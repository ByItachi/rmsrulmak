import crypto from "crypto";
import fs from "fs";
import path from "path";

const MEDIA_ROOT = path.resolve(import.meta.dirname, "../../uploads/media");

const ALLOWED_MIME: Record<string, string[]> = {
  image: ["png", "jpg", "jpeg", "gif", "webp", "svg", "avif", "ico"],
  application: ["pdf"],
};

export function isAllowedFile(mimeType: string, fileName: string): boolean {
  const ext = path.extname(fileName).toLowerCase().replace(".", "");
  const main = mimeType.split("/")[0];
  const allowed = ALLOWED_MIME[main];
  if (!allowed) {
    return false;
  }
  // Dosya uzantısı ve MIME tutarlılığı: bilinen türlerin dışına çıkma
  return allowed.includes(ext);
}

export function uniqueFileName(fileName: string): string {
  const ext = path.extname(fileName).toLowerCase();
  const safeBase = path
    .basename(fileName, ext)
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .slice(0, 80);
  const stem = safeBase || "dosya";
  return `${stem}-${Date.now()}-${crypto.randomBytes(3).toString("hex")}${ext}`;
}

export function saveMediaFile(
  base64: string,
  fileName: string,
  mimeType: string,
): { storagePath: string; size: number; checksum: string } {
  const raw = base64.trim();
  const commaIndex = raw.indexOf(",");
  const b64 = commaIndex !== -1 && raw.startsWith("data:") ? raw.slice(commaIndex + 1) : raw;

  const buffer = Buffer.from(b64, "base64");
  if (buffer.length === 0) {
    throw new Error("Dosya içeriği boş.");
  }

  const storageName = uniqueFileName(fileName);
  fs.mkdirSync(MEDIA_ROOT, { recursive: true });
  const storagePath = path.join(MEDIA_ROOT, storageNamerel(storageName));
  fs.writeFileSync(storagePath, buffer);

  return {
    storagePath: storageName,
    size: buffer.length,
    checksum: crypto.createHash("sha256").update(buffer).digest("hex"),
  };
}

function storageNamerel(name: string): string {
  // path traversal koruması: sadece dosya adı kabul edilir
  const base = path.basename(name);
  if (base !== name) {
    throw new Error("Geçersiz dosya adı.");
  }
  return base;
}

export function mediaFilePath(storagePath: string): string {
  return path.join(MEDIA_ROOT, storageNamerel(storagePath));
}

export function deleteMediaFile(storagePath: string): void {
  const filePath = mediaFilePath(storagePath);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

export function readMediaFile(storagePath: string): Buffer | null {
  const filePath = mediaFilePath(storagePath);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return fs.readFileSync(filePath);
}

export function mediaContentType(storagePath: string): string {
  const ext = path.extname(storagePath).toLowerCase().replace(".", "");
  const map: Record<string, string> = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    webp: "image/webp",
    svg: "image/svg+xml",
    avif: "image/avif",
    ico: "image/x-icon",
    pdf: "application/pdf",
  };
  return map[ext] ?? "application/octet-stream";
}
