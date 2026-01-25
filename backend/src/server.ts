import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const app = express();

const PORTSTRING = process.env.PORT ?? "3000";
const PORT = Number(PORTSTRING);
const now = new Date();

app.get('/health', (req, res) => {
    res.send('OK');
});

app.listen(PORT, (error) =>{
    console.log("--- " + now.toLocaleString() + " ---");
        console.log("Server is Successfully Running, and App is listening on port "+ PORT);
}); 