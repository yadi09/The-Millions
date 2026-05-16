import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env.js';

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  // 5xx logged with stack; 4xx logged at a quieter level
  const statusCode = err.statusCode || 500;
  if (statusCode >= 500) {
    console.error(err.stack);
  } else {
    console.warn(`[${statusCode}] ${err.message ?? err}`);
  }

  const body: Record<string, unknown> = {
    error: err.message || 'Internal Server Error',
  };
  if (err.details !== undefined) body.details = err.details;
  if (env.NODE_ENV === 'development' && err.stack) body.stack = err.stack;

  res.status(statusCode).json(body);
};