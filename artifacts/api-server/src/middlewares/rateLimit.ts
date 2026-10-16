import type { NextFunction, Request, Response } from "express";

type Window = { count: number; resetAt: number };

const store = new Map<string, Window>();

function getKey(req: Request): string {
  const ip =
    req.ip ||
    req.socket?.remoteAddress ||
    req.headers["x-forwarded-for"]?.toString().split(",")[0]?.trim() ||
    "unknown";
  return ip;
}

function sweep(now: number, timeoutMs: number): void {
  for (const [key, entry] of store) {
    if (now > entry.resetAt + timeoutMs) store.delete(key);
  }
}

export function rateLimit(options: {
  windowMs: number;
  max: number;
  message?: string;
}) {
  const { windowMs, max } = options;
  const message =
    options.message ?? "Çok fazla istek gönderildi. Lütfen biraz sonra tekrar deneyin.";
  return (req: Request, res: Response, next: NextFunction): void => {
    const now = Date.now();
    sweep(now, windowMs);
    const key = getKey(req);
    const entry = store.get(key);
    if (!entry || now > entry.resetAt) {
      store.set(key, { count: 1, resetAt: now + windowMs });
      next();
      return;
    }
    entry.count += 1;
    if (entry.count > max) {
      res.setHeader("Retry-After", String(Math.ceil((entry.resetAt - now) / 1000)));
      res.status(429).json({ error: message });
      return;
    }
    next();
  };
}

export function clearRateLimitStore(): void {
  store.clear();
}
