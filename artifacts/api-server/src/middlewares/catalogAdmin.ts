import type { NextFunction, Request, Response } from "express";

export function isCatalogAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const allowlist = (process.env.CATALOG_ADMIN_EMAILS ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  return allowlist.includes(email.trim().toLowerCase());
}

export function requireCatalogAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Yönetici girişi gerekli." });
    return;
  }

  if (!isCatalogAdminEmail(req.user.email)) {
    res.status(403).json({ error: "Bu işlem için yetkiniz yok." });
    return;
  }

  next();
}
