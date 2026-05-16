import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { UnauthorizedError } from "../utils/errors.js";
import type { JwtPayload } from "../modules/auth/auth.service.js";

export interface AuthRequest extends Request {
    user?: JwtPayload;
}

export function authenticate(req: AuthRequest, _res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return next(new UnauthorizedError("Authorization header missing"));
    }

    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
        return next(new UnauthorizedError("Invalid authorization header format"));
    }

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET);
        if (
            typeof decoded !== "object" ||
            decoded === null ||
            typeof (decoded as JwtPayload).userId !== "string" ||
            typeof (decoded as JwtPayload).email !== "string"
        ) {
            return next(new UnauthorizedError("Invalid token payload"));
        }
        req.user = decoded as JwtPayload;
        next();
    } catch {
        return next(new UnauthorizedError("Invalid or expired token"));
    }
}
