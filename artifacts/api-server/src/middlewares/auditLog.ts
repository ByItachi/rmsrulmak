import type { NextFunction, Request, Response } from "express";
import { db, auditLogsTable } from "@workspace/db";

const MODULE_FROM_PATH = /^\/api\/admin\/([^/]+)/;

export function auditLog(req: Request, res: Response, next: NextFunction): void {
  const originalEnd = res.end.bind(res);

  res.end = ((...args: Parameters<Response["end"]>) => {
    try {
      if (req.user && req.path.startsWith("/api/admin")) {
        const match = MODULE_FROM_PATH.exec(req.path.replace(/\/api$/, ""));
        const moduleName = match?.[1] ?? "admin";
        const meta = {
          method: req.method,
          ip: req.ip ?? null,
          userAgent: req.headers["user-agent"]?.slice(0, 200) ?? null,
          query: Object.keys(req.query as object).length ? req.query : undefined,
        };
        void db
          .insert(auditLogsTable)
          .values({
            actorEmail: req.user.email ?? "unknown",
            module: moduleName,
            action: req.method,
            entityId: (req.params as Record<string, string | undefined>).id ?? null,
            statusCode: res.statusCode,
            meta: JSON.stringify(meta) ?? "{}",
          })
          .catch(() => {
            // Audit kaydı başarısız olursa isteğin kendisi engellenmez
          });
      }
    } catch {
      // Loglama hatası istek akışını bozmaz
    }

    return originalEnd(...args);
  }) as Response["end"];

  next();
}
