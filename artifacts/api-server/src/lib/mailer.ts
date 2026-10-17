import nodemailer from "nodemailer";
import { eq } from "drizzle-orm";
import { db, settingsTable } from "@workspace/db";
import { logger } from "./logger";

type MailInput = { subject: string; text: string; replyTo?: string };

async function readSmtpSettings(): Promise<Record<string, string>> {
  try {
    const rows = await db.select().from(settingsTable);
    const map: Record<string, string> = {};
    for (const row of rows) map[row.key] = row.value ?? "";
    return map;
  } catch (err) {
    logger.warn({ err }, "smtp settings okunamadi");
    return {};
  }
}

function buildTransport(s: Record<string, string>) {
  const host = s.smtp_host?.trim();
  if (!host || host === "smtp.example.com") return null;
  const port = Number(s.smtp_port || 587);
  // Yerel MTA (cPanel exim) loopback'te STARTTLS el sıkışması bozulabiliyor — düz metin gönder
  const isLoopback = ["127.0.0.1", "localhost", "::1"].includes(host);
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    ...(isLoopback ? { ignoreTLS: true } : {}),
    auth: s.smtp_user ? { user: s.smtp_user, pass: s.smtp_pass ?? "" } : undefined,
    tls: { rejectUnauthorized: false },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
  });
}

/**
 * Form bildirimi gönderir. SMTP yapılandırılmamışsa veya gönderim başarısız olursa
 * hata YAYILMAZ — form kaydı DB'de güvende kalır, sadece log atılır.
 */
export async function sendFormNotification(input: MailInput): Promise<boolean> {
  try {
    const s = await readSmtpSettings();
    const transport = buildTransport(s);
    if (!transport) {
      logger.info("smtp ayarli degil, e-posta atlandi");
      return false;
    }
    const from = s.smtp_from || "noreply@rmsrulmak.com";
    const to = s.contact_email || "info@rmsrulmak.com";
    await transport.sendMail({ from, to, replyTo: input.replyTo, subject: input.subject, text: input.text });
    logger.info({ to }, "form bildirim e-postasi gonderildi");
    return true;
  } catch (err) {
    logger.warn({ err }, "form bildirim e-postasi gonderilemedi");
    return false;
  }
}
