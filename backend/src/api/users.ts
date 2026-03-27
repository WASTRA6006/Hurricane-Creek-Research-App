import { Router } from "express";
import bcrypt from 'bcrypt'; 
import { createUser, getUserByEmail, getUserRoleByEmail } from '../db/queries.js';

const router = Router();

router.post("/users/register", async (req, res) => {
    console.log("register endpoint hit");
    try {
        //Registration logic
        const { name, email, password } = req.body;
        //Normalize email to lowercase
        const normalizedEmail = email.toLowerCase().trim();
        //Validate UNG Email
        if (!normalizedEmail.endsWith('@ung.edu')) {
            return res.status(400).json({ 
                message: "Only UNG email addresses (@ung.edu) are allowed" 
            });
        }
        //If these fields are left blank, inform the user that they are required
        if (!name || !normalizedEmail || !password) {
            return res.status(400).json({ message: "Name, email, and password are required" });
        }
        //Check if the email is already in use
        const existingUser = await getUserByEmail(normalizedEmail);
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }
        //Hash the password and create the user
        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = await createUser({ name, email: normalizedEmail, password_hash: passwordHash, role: 'viewer' });
        res.status(201).json(newUser);
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Failed to register user" });
    }
});

router.post("/users/login", async (req, res) => {
    console.log("login endpoint hit");
    try {
        //Login logic
        const { email, password } = req.body;
        //Normalize email to lowercase
        const normalizedEmail = email.toLowerCase().trim();
        //Check if both values are provided
        if (!normalizedEmail || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        //Get the user by email and check if they exist
        const user = await getUserByEmail(normalizedEmail);
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        //Compare the provided password with the stored hash and continue if it matches
        const passwordCheck = await bcrypt.compare(password, user.password_hash);
        if (!passwordCheck) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        //If all the above is successful, return the user data
        res.status(200).json({ id: user.id, email: user.email, name: user.name });
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ message: "Failed to log in user" });
    }
});

router.get("/users/adminCheck", async (req, res) => {
    console.log("admin check endpoint hit");

     const email = req.query.email as string;
  
    if (!email) {
        return res.status(400).json({ message: "Email required" });
    }
    try {
        const role = await getUserRoleByEmail(email);
        if (role === 'admin') {
            res.status(200).json({ isAdmin: true });
        } else {
            res.status(200).json({ isAdmin: false });
        }
    } catch (error) {
        console.error("Error checking admin status:", error);
        res.status(500).json({ message: "Failed to check admin status" });
    }
});

export default router;