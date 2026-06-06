import { Response } from "express";
import { validateUser, changePassword, changeEmail } from "./auth.service.js";
import { changePasswordSchema, changeEmailSchema } from "./auth.validation.js";
import type { AuthRequest } from "../../middlewares/auth.middleware.js";

export async function login(req: AuthRequest, res: Response) {
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

export async function changePasswordController(req: AuthRequest, res: Response) {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const parsed = changePasswordSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ message: "Validation error", errors: parsed.error.format() });
    }

    try {
        const result = await changePassword(userId, parsed.data.currentPassword, parsed.data.newPassword);
        if (!result.ok) {
            if (result.reason === "user_not_found") return res.status(404).json({ message: "User not found" });
            if (result.reason === "invalid_password") return res.status(401).json({ message: "Current password is incorrect" });
        }
        res.json({ message: "Password updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function changeEmailController(req: AuthRequest, res: Response) {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const parsed = changeEmailSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ message: "Validation error", errors: parsed.error.format() });
    }

    try {
        const result = await changeEmail(userId, parsed.data.currentPassword, parsed.data.newEmail);
        if (!result.ok) {
            if (result.reason === "user_not_found") return res.status(404).json({ message: "User not found" });
            if (result.reason === "invalid_password") return res.status(401).json({ message: "Current password is incorrect" });
            if (result.reason === "email_taken") return res.status(409).json({ message: "That email is already in use" });
        } else {
            res.json(result.data);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}
