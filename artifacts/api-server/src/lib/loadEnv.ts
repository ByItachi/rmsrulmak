// Yan etkili modül: DB/app import'larından ÖNCE .env'i yükle (ESM import sırası gereği en başta import edilir)
import fs from "node:fs";
import path from "node:path";

try {
  // 1) ENV_FILE, 2) uygulama kökü (dist/../.env — Passenger'a karşı deterministik), 3) cwd
  const candidates = [
    ...(process.env.ENV_FILE ? [process.env.ENV_FILE] : []),
    path.resolve(import.meta.dirname, "../.env"),
    path.resolve(process.cwd(), ".env"),
  ];
  const envPath = candidates.find((p) => fs.existsSync(p));
  if (envPath) {
    for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
      if (!m) continue;
      const key = m[1];
      let value = m[2];
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
    console.log(`[env] yüklendi: ${envPath}`);
  }
} catch (err) {
  console.warn("[env] .env yüklenemedi", err);
}
