import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'

dotenv.config();

const prisma = new PrismaClient();



if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
}

const JWT_SECRET = process.env.JWT_SECRET;


interface JwtPayload {
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

    const token = jwt.sign(payload, JWT_SECRET, {
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
