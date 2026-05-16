import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../lib/prisma.js";
import { env } from "../../config/env.js";

export interface JwtPayload {
    userId: string;
    email: string;
}

export async function validateUser(email: string, password: string) {
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        return null;
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
        return null;
    }

    const payload: JwtPayload = {
        userId: user.id,
        email: user.email,
    };

    const token = jwt.sign(payload, env.JWT_SECRET, {
        expiresIn: "1h",
    });

    return {
        token,
        user: {
            id: user.id,
            email: user.email,
        },
    };
}
