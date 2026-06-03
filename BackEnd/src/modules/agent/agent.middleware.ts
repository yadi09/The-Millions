import { Request, Response, NextFunction } from "express";
import { timingSafeEqual } from "crypto";
import { env } from "../../config/env.js";
import { UnauthorizedError } from "../../utils/errors.js";

/**
 * API-key auth for the agent endpoints. The agent (e.g. WhatsApp bot platform)
 * sends `X-API-Key: <AGENT_API_KEY>` on every request. We compare in
 * constant time to defeat timing attacks; an attacker who can measure tiny
 * timing differences could otherwise leak the secret byte-by-byte.
 */
export function requireAgentApiKey(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const provided = req.header("x-api-key");
  if (!provided) {
    return next(new UnauthorizedError("Missing X-API-Key header"));
  }

  const expected = env.AGENT_API_KEY;

  // timingSafeEqual requires equal-length buffers. Compare lengths first;
  // if they differ, fail fast (this comparison itself doesn't leak info
  // beyond the length, which the attacker can already brute-force).
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return next(new UnauthorizedError("Invalid API key"));
  }

  next();
}
