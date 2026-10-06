import { Router, type IRouter, type Request, type Response } from "express";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod/v4";
import { db, catalogsTable } from "@workspace/db";
import { ObjectNotFoundError, ObjectStorageService } from "../lib/objectStorage";
import { requireCatalogAdmin } from "../middlewares/catalogAdmin";

const router: IRouter = Router();
const storage = new ObjectStorageService();
const MAX_PDF_BYTES = 50 * 1024 * 1024;
const objectPathPattern = /^\/objects\/uploads\/[0-9a-f-]{36}$/i;

const uploadRequestSchema = z.object({
  name: z.string().min(1).max(255).regex(/\.pdf$/i, "Yalnızca PDF yükleyebilirsiniz."),
  size: z.number().int().positive().max(MAX_PDF_BYTES),
  contentType: z.literal("application/pdf"),
});

const createCatalogSchema = z.object({
  title: z.string().trim().min(2).max(180),
  brand: z.string().trim().min(1).max(80),
  category: z.string().trim().min(1).max(100),
  description: z.string().trim().max(1000).default(""),
  fileName: z.string().trim().min(1).max(255).regex(/\.pdf$/i),
  fileSize: z.number().int().positive().max(MAX_PDF_BYTES),
  objectPath: z.string().regex(objectPathPattern),
  published: z.boolean().default(true),
});

const updateCatalogSchema = z.object({
  title: z.string().trim().min(2).max(180).optional(),
  brand: z.string().trim().min(1).max(80).optional(),
  category: z.string().trim().min(1).max(100).optional(),
  description: z.string().trim().max(1000).optional(),
  published: z.boolean().optional(),
}).refine((value) => Object.keys(value).length > 0);

type CatalogRow = typeof catalogsTable.$inferSelect;

function toCatalogDto(catalog: CatalogRow) {
  return {
    id: String(catalog.id),
    title: catalog.title,
    brand: catalog.brand,
    category: catalog.category,
    description: catalog.description,
    fileName: catalog.fileName,
    fileSize: catalog.fileSize,
    published: catalog.published,
    createdAt: catalog.createdAt.toISOString(),
    downloadUrl: `/api/catalogs/${catalog.id}/download`,
  };
}

function safeFileName(fileName: string): string {
  const leaf = fileName.split(/[\\/]/).pop() ?? "katalog.pdf";
  return leaf.replace(/[\u0000-\u001f\u007f]/g, "").slice(0, 255) || "katalog.pdf";
}

router.get("/catalogs", async (_req, res): Promise<void> => {
  const catalogs = await db
    .select()
    .from(catalogsTable)
    .where(eq(catalogsTable.published, true))
    .orderBy(desc(catalogsTable.createdAt));
  res.json(catalogs.map(toCatalogDto));
});

router.get(
  "/catalogs/admin",
  requireCatalogAdmin,
  async (_req, res): Promise<void> => {
    const catalogs = await db
      .select()
      .from(catalogsTable)
      .orderBy(desc(catalogsTable.createdAt));
    res.json(catalogs.map(toCatalogDto));
  },
);

router.post(
  "/catalogs/uploads/request-url",
  requireCatalogAdmin,
  async (req: Request, res: Response): Promise<void> => {
    const parsed = uploadRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Geçerli, 50 MB'dan küçük bir PDF seçin." });
      return;
    }

    try {
      const uploadURL = await storage.getObjectEntityUploadURL();
      const objectPath = storage.normalizeObjectEntityPath(uploadURL);
      res.json({ uploadURL, objectPath });
    } catch (error) {
      req.log.error({ err: error }, "Catalog upload URL generation failed");
      res.status(500).json({ error: "Yükleme bağlantısı oluşturulamadı." });
    }
  },
);

router.post(
  "/catalogs",
  requireCatalogAdmin,
  async (req: Request, res: Response): Promise<void> => {
    const parsed = createCatalogSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Katalog bilgileri geçerli değil." });
      return;
    }

    try {
      const [storedFile] = await storage
        .getObjectEntityFile(parsed.data.objectPath)
        .then((file) => file.getMetadata());
      if (
        Number(storedFile.size) !== parsed.data.fileSize ||
        storedFile.contentType !== "application/pdf"
      ) {
        res.status(400).json({ error: "Yüklenen dosya doğrulanamadı." });
        return;
      }

      const [catalog] = await db
        .insert(catalogsTable)
        .values({
          ...parsed.data,
          fileName: safeFileName(parsed.data.fileName),
        })
        .returning();
      res.status(201).json(toCatalogDto(catalog));
    } catch (error) {
      if (error instanceof ObjectNotFoundError) {
        res.status(400).json({ error: "Yüklenen PDF bulunamadı." });
        return;
      }
      req.log.error({ err: error }, "Catalog record creation failed");
      res.status(500).json({ error: "Katalog kaydı oluşturulamadı." });
    }
  },
);

router.patch(
  "/catalogs/:id",
  requireCatalogAdmin,
  async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    const parsed = updateCatalogSchema.safeParse(req.body);
    if (!Number.isInteger(id) || id < 1 || !parsed.success) {
      res.status(400).json({ error: "Katalog bilgileri geçerli değil." });
      return;
    }

    const [catalog] = await db
      .update(catalogsTable)
      .set(parsed.data)
      .where(eq(catalogsTable.id, id))
      .returning();
    if (!catalog) {
      res.status(404).json({ error: "Katalog bulunamadı." });
      return;
    }
    res.json(toCatalogDto(catalog));
  },
);

router.delete(
  "/catalogs/:id",
  requireCatalogAdmin,
  async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      res.status(400).json({ error: "Katalog kimliği geçerli değil." });
      return;
    }

    const [catalog] = await db
      .select()
      .from(catalogsTable)
      .where(eq(catalogsTable.id, id))
      .limit(1);
    if (!catalog) {
      res.status(404).json({ error: "Katalog bulunamadı." });
      return;
    }

    try {
      const file = await storage.getObjectEntityFile(catalog.objectPath);
      await file.delete();
    } catch (error) {
      if (!(error instanceof ObjectNotFoundError)) {
        req.log.error({ err: error, catalogId: id }, "Catalog file deletion failed");
        res.status(500).json({ error: "Katalog dosyası silinemedi." });
        return;
      }
    }

    await db.delete(catalogsTable).where(eq(catalogsTable.id, id));
    res.sendStatus(204);
  },
);

router.get(
  "/catalogs/:id/download",
  async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      res.status(404).json({ error: "Katalog bulunamadı." });
      return;
    }

    const [catalog] = await db
      .select()
      .from(catalogsTable)
      .where(and(eq(catalogsTable.id, id), eq(catalogsTable.published, true)))
      .limit(1);
    if (!catalog) {
      res.status(404).json({ error: "Katalog bulunamadı." });
      return;
    }

    try {
      const file = await storage.getObjectEntityFile(catalog.objectPath);
      const [metadata] = await file.getMetadata();
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Length", String(metadata.size ?? catalog.fileSize));
      res.setHeader(
        "Content-Disposition",
        `attachment; filename*=UTF-8''${encodeURIComponent(catalog.fileName)}`,
      );
      res.setHeader("Cache-Control", "public, max-age=3600");
      file.createReadStream().on("error", (error) => {
        req.log.error({ err: error, catalogId: id }, "Catalog download stream failed");
        if (!res.headersSent) res.status(500).end();
        else res.end();
      }).pipe(res);
    } catch (error) {
      if (error instanceof ObjectNotFoundError) {
        res.status(404).json({ error: "Katalog dosyası bulunamadı." });
        return;
      }
      req.log.error({ err: error, catalogId: id }, "Catalog download failed");
      res.status(500).json({ error: "Katalog indirilemedi." });
    }
  },
);

export default router;
