import { Router } from "express";
import bcrypt from 'bcrypt'; 
import { createUser, getUserByEmail } from '../db/queries.js';

const router = Router();

router.post("/users/register", async (req, res) => {
    console.log("register endpoint hit");
    try {
        //Registration logic
        const { name, email, password } = req.body;
        //If these fields are left blank, inform the user that they are required
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email, and password are required" });
        }
        //Check if the email is already in use
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }
        //Hash the password and create the user
        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = await createUser({ name, email, password_hash: passwordHash, role: 'viewer' });
        res.status(201).json(newUser);
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Failed to register user" });
    }
});

export default router;