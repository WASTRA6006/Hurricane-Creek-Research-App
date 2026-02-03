import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const app = express();

app.use(express.json());

const loggingMiddleware = (req, res, next) => {
    console.log('${req.method} - ${req.url}');
    next();
}


app.use(loggingMiddleware);

const PORTSTRING = process.env.PORT ?? "3000";
const PORT = Number(PORTSTRING);
const now = new Date();
const mockUsers = [
        { id: 1, username: 'Alice', displayName: 'Alice Wonderland' },
        { id: 2, username: 'Bob', displayName: 'Bob Builder' },
        { id: 3, username: 'Charlie', displayName: 'Charlie Brown' },
        { id: 4, username: 'Aiana', displayName: 'Aiana Prince' }
    ];

// Status endpoint for server health check
app.get('/status', (req, res) => {
    res.send('OK');
});

// User-related endpoints
app.get('/api/users', (req, res) => {
    console.log(req.query);
    const { 
        query: { filter, value },
    } = req;
    // when filter and value are undefined
    if (!filter && !value) return res.send(mockUsers);
    // when filter and value are defined
    if (filter && value) {
        if (filter !== "username" && filter !== "displayName" && filter !== "id") return res.sendStatus(400);
            return res.send(
        mockUsers.filter((user) => String(user[filter]).includes(String(value)))
        );
    }
    return res.sendStatus(400);
});

app.post('/api/users', (req, res) => {
    console.log(req.body);
    const { body } = req;
    const lastId = mockUsers.length ? (mockUsers[mockUsers.length - 1]?.id ?? 0) : 0;
    const newUser = { id: lastId + 1, ...body };
    mockUsers.push(newUser);
    return res.status(201).send(newUser);
})

app.get('/api/users/:id', (req, res) => {
    console.log(req.params);
    const parsedId = parseInt(req.params.id);
    console.log(parsedId);
    if (isNaN(parsedId)) return res.status(400).send({msg: "Bad Request. Invalid ID."});

    const findUser = mockUsers.find((user) => user.id === parsedId);
    if (!findUser) return res.sendStatus(404);
    return res.send(findUser);
});

app.listen(PORT, (error) =>{
    console.log("--- " + now.toLocaleString() + " ---");
        console.log("Server is Successfully Running, and App is listening on port "+ PORT);
}); 