import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";
import { authMiddleware } from "./middlewares/authMiddleware";
import { auditLog } from "./middlewares/auditLog";
import { securityHeaders } from "./middlewares/securityHeaders";
import { rateLimit } from "./middlewares/rateLimit";
import { redirectMiddleware } from "./middlewares/redirectRules";

function allowedOrigins(): string[] {
  const raw = process.env["CORS_ORIGINS"];
  if (!raw) return [];
  return raw
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(securityHeaders);
app.use(
  cors({
    credentials: true,
    origin(origin, callback) {
      if (!origin) {
        callback(null, true);
        return;
      }
      const allowed = allowedOrigins();
      if (allowed.length === 0 || allowed.includes(origin)) {
        callback(null, true);
        return;
      }
      // İzin yok: CORS başlığı yansıtılmaz, tarayıcı isteği reddeder (200 + headersız)
      callback(null, false);
    },
  }),
);
app.use(
  rateLimit({
    windowMs: 60_000,
    max: 180,
    message: "Çok fazla istek gönderildi. Lütfen biraz sonra tekrar deneyin.",
  }),
);
app.use(cookieParser());
app.use(express.json({ limit: "256kb" }));
app.use(express.urlencoded({ extended: true, limit: "256kb" }));
app.use(authMiddleware);
app.use(auditLog);

app.use(redirectMiddleware);

app.use("/api", router);

// Üretim: derlenmiş frontend'i (Vite dist) aynı süreçten sun + SPA fallback
import fs from "node:fs";
import path from "node:path";

const staticDir = process.env["STATIC_DIR"];
if (staticDir && fs.existsSync(path.join(staticDir, "index.html"))) {
  const distHandler = express.static(staticDir, {
    index: "index.html",
    maxAge: "1h",
    setHeaders(res, filePath) {
      if (filePath.endsWith(".html")) res.setHeader("Cache-Control", "no-cache");
      if (filePath.startsWith(path.join(staticDir, "catalog") + path.sep))
        res.setHeader("Cache-Control", "public, max-age=604800");
    },
  });
  app.use(distHandler);
  // SPA fallback: /api dışındaki GET istekleri index.html'e gitsin
  app.use((req, res, next) => {
    if (req.method !== "GET" || req.path.startsWith("/api/")) return next();
    res.setHeader("Cache-Control", "no-cache");
    res.sendFile(path.join(staticDir, "index.html"));
  });
}

export default app;
