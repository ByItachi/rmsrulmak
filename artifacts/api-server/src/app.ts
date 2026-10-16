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

app.use("/api", router);

export default app;
