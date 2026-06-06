import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../lib/prisma.js";
import { env } from "../../config/env.js";

export interface JwtPayload {
    userId: string;
    email: string;
}

const BCRYPT_ROUNDS = 10;

function signToken(payload: JwtPayload) {
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "1h" });
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

    return {
        token: signToken(payload),
        user: {
            id: user.id,
            email: user.email,
        },
    };
}

// Sentinel results so the controller can map to HTTP status codes without
// reaching for exceptions for expected user-input failures.
export type ChangeResult<T> =
    | { ok: true; data: T }
    | { ok: false; reason: "user_not_found" | "invalid_password" | "email_taken" };

export async function changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
): Promise<ChangeResult<{ id: string }>> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return { ok: false, reason: "user_not_found" };

    const ok = await bcrypt.compare(currentPassword, user.password);
    if (!ok) return { ok: false, reason: "invalid_password" };

    const hash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
    await prisma.user.update({ where: { id: userId }, data: { password: hash } });

    return { ok: true, data: { id: user.id } };
}

export async function changeEmail(
    userId: string,
    currentPassword: string,
    newEmail: string
): Promise<ChangeResult<{ token: string; user: { id: string; email: string } }>> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return { ok: false, reason: "user_not_found" };

    const ok = await bcrypt.compare(currentPassword, user.password);
    if (!ok) return { ok: false, reason: "invalid_password" };

    // No-op when the new email matches the current one — return a fresh token
    // so the client behavior stays consistent.
    if (newEmail !== user.email) {
        const taken = await prisma.user.findUnique({ where: { email: newEmail } });
        if (taken && taken.id !== userId) return { ok: false, reason: "email_taken" };
    }

    const updated = await prisma.user.update({
        where: { id: userId },
        data: { email: newEmail },
    });

    const token = signToken({ userId: updated.id, email: updated.email });

    return {
        ok: true,
        data: {
            token,
            user: { id: updated.id, email: updated.email },
        },
    };
}
