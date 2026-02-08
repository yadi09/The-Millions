import { Request, Response } from "express";
import { validateUser } from "./auth.service.js";

export async function login(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const result = await validateUser(email, password);

        if (!result) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}
