import type { NextFunction, Request, Response } from "express";
import { asc, eq } from "drizzle-orm";
import { db, redirectRulesTable } from "@workspace/db";

const CACHE_TTL_MS = 60_000;

interface CachedRules {
  loadedAt: number;
  rules: Array<{ fromPath: string; toPath: string; statusCode: number }>;
}

let cache: CachedRules | null = null;

async function enabledRules(): Promise<CachedRules["rules"]> {
  const now = Date.now();
  if (cache && now - cache.loadedAt < CACHE_TTL_MS) {
    return cache.rules;
  }
  const rows = await db
    .select({
      fromPath: redirectRulesTable.fromPath,
      toPath: redirectRulesTable.toPath,
      statusCode: redirectRulesTable.statusCode,
    })
    .from(redirectRulesTable)
    .where(eq(redirectRulesTable.enabled, true))
    .orderBy(asc(redirectRulesTable.position));
  cache = { loadedAt: now, rules: rows };
  return rows;
}

export async function redirectMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  if (req.method !== "GET" && req.method !== "HEAD") {
    next();
    return;
  }
  if (req.path.startsWith("/api")) {
    next();
    return;
  }
  try {
    const rules = await enabledRules();
    for (const rule of rules) {
      if (rule.fromPath === req.path) {
        res.redirect(rule.statusCode, rule.toPath);
        return;
      }
    }
    next();
  } catch (error) {
    next(error);
  }
}
