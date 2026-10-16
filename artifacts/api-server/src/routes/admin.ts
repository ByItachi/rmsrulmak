import { Router, type IRouter, type Response } from "express";
import { and, asc, count, desc, eq, gte, sql } from "drizzle-orm";
import {
  db,
  auditLogsTable,
  brandsTable,
  categoriesTable,
  contactMessagesTable,
  mediaAssetsTable,
  pagesTable,
  postsTable,
  productRequestsTable,
  productsTable,
  redirectRulesTable,
  sectorsTable,
  settingsTable,
  slidersTable,
  siteSectionsTable,
  usersTable,
} from "@workspace/db";
import {
  CreateBrandBody,
  CreateCategoryBody,
  CreateAdminMediaAssetBody,
  CreateAdminPageBody,
  CreatePostBody,
  CreateProductBody,
  CreateAdminRedirectRuleBody,
  CreateSectorBody,
  CreateSiteSectionBody,
  CreateSliderBody,
  DeleteBrandParams,
  DeleteCategoryParams,
  DeleteAdminMediaAssetParams,
  DeleteAdminPageParams,
  UpdateAdminPageParams,
  UpdateAdminMediaAssetParams,
  DeletePostParams,
  DeleteProductParams,
  DeleteAdminRedirectRuleParams,
  DeleteSectorParams,
  DeleteSiteSectionParams,
  DeleteSliderParams,
  GetAdminSettingsResponse,
  GetAdminSummaryResponse,
  ListAdminBrandsResponse,
  ListAdminCategoriesResponse,
  ListAdminContactMessagesResponse,
  ListAdminMediaAssetsResponse,
  ListAdminPagesResponse,
  ListAdminPostsResponse,
  ListAdminProductsResponse,
  ListAdminRedirectRulesResponse,
  ListAdminSectorsResponse,
  ListAdminSiteSectionsResponse,
  ListAdminSlidersResponse,
  ListAdminUsersResponse,
  UpdateAdminSettingsBody,
  UpdateAdminMediaAssetBody,
  UpdateAdminPageBody,
  UpdateAdminRedirectRuleBody,
  UpdateAdminUserBody,
  UpdateBrandBody,
  UpdateBrandParams,
  UpdateCategoryBody,
  UpdateCategoryParams,
  UpdateContactMessageBody,
  UpdateContactMessageParams,
  UpdatePostBody,
  UpdatePostParams,
  UpdateProductBody,
  UpdateProductParams,
  UpdateRedirectRuleBody,
  UpdateAdminRedirectRuleParams,
  UpdateSectorBody,
  UpdateSectorParams,
  UpdateSiteSectionBody,
  UpdateSiteSectionParams,
  UpdateSliderBody,
  UpdateSliderParams,
  UpdateAdminUserParams,
} from "@workspace/api-zod";
import { requireCatalogAdmin } from "../middlewares/catalogAdmin";
import { isUniqueViolation, slugify } from "../lib/contentFallbacks";
import { deleteMediaFile, isAllowedFile, saveMediaFile } from "../lib/mediaStore";

const router: IRouter = Router();

router.use("/admin", requireCatalogAdmin);

function slugConflict(res: Response): void {
  res.status(409).json({ error: "Bu slug (SEO adresi) zaten kullanımda." });
}

function fkConflict(res: Response, message: string): void {
  res.status(409).json({ error: message });
}

function isFkViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "23503"
  );
}

// ---------------------------------------------------------------------------
// Brands
// ---------------------------------------------------------------------------

async function brandDto(brandId: number) {
  const [row] = await db
    .select({ brand: brandsTable, productCount: count(productsTable.id) })
    .from(brandsTable)
    .leftJoin(productsTable, eq(productsTable.brandId, brandsTable.id))
    .where(eq(brandsTable.id, brandId))
    .groupBy(brandsTable.id)
    .limit(1);
  if (!row) return null;
  return {
    id: String(row.brand.id),
    slug: row.brand.slug,
    name: row.brand.name,
    description: row.brand.description,
    logoUrl: row.brand.logoUrl,
    productCount: Number(row.productCount),
  };
}

router.get("/admin/brands", async (_req, res): Promise<void> => {
  const rows = await db
    .select({ brand: brandsTable, productCount: count(productsTable.id) })
    .from(brandsTable)
    .leftJoin(productsTable, eq(productsTable.brandId, brandsTable.id))
    .groupBy(brandsTable.id)
    .orderBy(asc(brandsTable.name));
  res.json(
    ListAdminBrandsResponse.parse(
      rows.map(({ brand, productCount }) => ({
        id: String(brand.id),
        slug: brand.slug,
        name: brand.name,
        description: brand.description,
        logoUrl: brand.logoUrl,
        productCount: Number(productCount),
      })),
    ),
  );
});

router.post("/admin/brands", async (req, res): Promise<void> => {
  const parsed = CreateBrandBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const slug = parsed.data.slug || slugify(parsed.data.name);
  try {
    const [row] = await db
      .insert(brandsTable)
      .values({ ...parsed.data, slug })
      .returning({ id: brandsTable.id });
    const dto = await brandDto(row.id);
    res.status(201).json(dto);
  } catch (error) {
    if (isUniqueViolation(error)) {
      slugConflict(res);
      return;
    }
    throw error;
  }
});

router.patch("/admin/brands/:id", async (req, res): Promise<void> => {
  const params = UpdateBrandParams.safeParse(req.params);
  const body = UpdateBrandBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ error: "Geçersiz istek." });
    return;
  }
  try {
    const [row] = await db
      .update(brandsTable)
      .set(body.data)
      .where(eq(brandsTable.id, params.data.id))
      .returning({ id: brandsTable.id });
    if (!row) {
      res.status(404).json({ error: "Marka bulunamadı" });
      return;
    }
    res.json(await brandDto(row.id));
  } catch (error) {
    if (isUniqueViolation(error)) {
      slugConflict(res);
      return;
    }
    throw error;
  }
});

router.delete("/admin/brands/:id", async (req, res): Promise<void> => {
  const params = DeleteBrandParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Geçersiz istek." });
    return;
  }
  try {
    const [row] = await db
      .delete(brandsTable)
      .where(eq(brandsTable.id, params.data.id))
      .returning({ id: brandsTable.id });
    if (!row) {
      res.status(404).json({ error: "Marka bulunamadı" });
      return;
    }
    res.status(204).end();
  } catch (error) {
    if (isFkViolation(error)) {
      fkConflict(res, "Bu markaya bağlı ürünler var. Önce ürünleri taşıyın veya silin.");
      return;
    }
    throw error;
  }
});

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

async function categoryDto(categoryId: number) {
  const [row] = await db
    .select({ category: categoriesTable, productCount: count(productsTable.id) })
    .from(categoriesTable)
    .leftJoin(productsTable, eq(productsTable.categoryId, categoriesTable.id))
    .where(eq(categoriesTable.id, categoryId))
    .groupBy(categoriesTable.id)
    .limit(1);
  if (!row) return null;
  return {
    id: String(row.category.id),
    slug: row.category.slug,
    name: row.category.name,
    description: row.category.description,
    productCount: Number(row.productCount),
  };
}

router.get("/admin/categories", async (_req, res): Promise<void> => {
  const rows = await db
    .select({ category: categoriesTable, productCount: count(productsTable.id) })
    .from(categoriesTable)
    .leftJoin(productsTable, eq(productsTable.categoryId, categoriesTable.id))
    .groupBy(categoriesTable.id)
    .orderBy(asc(categoriesTable.name));
  res.json(
    ListAdminCategoriesResponse.parse(
      rows.map(({ category, productCount }) => ({
        id: String(category.id),
        slug: category.slug,
        name: category.name,
        description: category.description,
        productCount: Number(productCount),
      })),
    ),
  );
});

router.post("/admin/categories", async (req, res): Promise<void> => {
  const parsed = CreateCategoryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const slug = parsed.data.slug || slugify(parsed.data.name);
  try {
    const [row] = await db
      .insert(categoriesTable)
      .values({ ...parsed.data, slug })
      .returning({ id: categoriesTable.id });
    res.status(201).json(await categoryDto(row.id));
  } catch (error) {
    if (isUniqueViolation(error)) {
      slugConflict(res);
      return;
    }
    throw error;
  }
});

router.patch("/admin/categories/:id", async (req, res): Promise<void> => {
  const params = UpdateCategoryParams.safeParse(req.params);
  const body = UpdateCategoryBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ error: "Geçersiz istek." });
    return;
  }
  try {
    const [row] = await db
      .update(categoriesTable)
      .set(body.data)
      .where(eq(categoriesTable.id, params.data.id))
      .returning({ id: categoriesTable.id });
    if (!row) {
      res.status(404).json({ error: "Kategori bulunamadı" });
      return;
    }
    res.json(await categoryDto(row.id));
  } catch (error) {
    if (isUniqueViolation(error)) {
      slugConflict(res);
      return;
    }
    throw error;
  }
});

router.delete("/admin/categories/:id", async (req, res): Promise<void> => {
  const params = DeleteCategoryParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Geçersiz istek." });
    return;
  }
  try {
    const [row] = await db
      .delete(categoriesTable)
      .where(eq(categoriesTable.id, params.data.id))
      .returning({ id: categoriesTable.id });
    if (!row) {
      res.status(404).json({ error: "Kategori bulunamadı" });
      return;
    }
    res.status(204).end();
  } catch (error) {
    if (isFkViolation(error)) {
      fkConflict(res, "Bu kategoriye bağlı ürünler var. Önce ürünleri taşıyın veya silin.");
      return;
    }
    throw error;
  }
});

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

function productDto(row: typeof productsTable.$inferSelect) {
  return {
    id: String(row.id),
    slug: row.slug,
    name: row.name,
    code: row.code,
    brandId: row.brandId,
    categoryId: row.categoryId,
    shortDescription: row.shortDescription,
    description: row.description,
    imageUrl: row.imageUrl,
    featured: row.featured,
  };
}

router.get("/admin/products", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(productsTable)
    .orderBy(asc(productsTable.name));
  res.json(ListAdminProductsResponse.parse(rows.map(productDto)));
});

router.post("/admin/products", async (req, res): Promise<void> => {
  const parsed = CreateProductBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const slug = parsed.data.slug || slugify(`${parsed.data.name}-${parsed.data.code}`);
  try {
    const [row] = await db
      .insert(productsTable)
      .values({ ...parsed.data, description: parsed.data.description ?? "", slug })
      .returning();
    res.status(201).json(productDto(row));
  } catch (error) {
    if (isUniqueViolation(error)) {
      slugConflict(res);
      return;
    }
    throw error;
  }
});

router.patch("/admin/products/:id", async (req, res): Promise<void> => {
  const params = UpdateProductParams.safeParse(req.params);
  const body = UpdateProductBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ error: "Geçersiz istek." });
    return;
  }
  try {
    const [row] = await db
      .update(productsTable)
      .set(body.data)
      .where(eq(productsTable.id, params.data.id))
      .returning();
    if (!row) {
      res.status(404).json({ error: "Ürün bulunamadı" });
      return;
    }
    res.json(productDto(row));
  } catch (error) {
    if (isUniqueViolation(error)) {
      slugConflict(res);
      return;
    }
    throw error;
  }
});

router.delete("/admin/products/:id", async (req, res): Promise<void> => {
  const params = DeleteProductParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Geçersiz istek." });
    return;
  }
  const [row] = await db
    .delete(productsTable)
    .where(eq(productsTable.id, params.data.id))
    .returning({ id: productsTable.id });
  if (!row) {
    res.status(404).json({ error: "Ürün bulunamadı" });
    return;
  }
  res.status(204).end();
});

// ---------------------------------------------------------------------------
// Sectors
// ---------------------------------------------------------------------------

function sectorDto(row: typeof sectorsTable.$inferSelect) {
  return {
    id: String(row.id),
    slug: row.slug,
    name: row.name,
    description: row.description,
    position: row.position,
  };
}

router.get("/admin/sectors", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(sectorsTable)
    .orderBy(asc(sectorsTable.position), asc(sectorsTable.id));
  res.json(ListAdminSectorsResponse.parse(rows.map(sectorDto)));
});

router.post("/admin/sectors", async (req, res): Promise<void> => {
  const parsed = CreateSectorBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const slug = parsed.data.slug || slugify(parsed.data.name);
  try {
    const [row] = await db
      .insert(sectorsTable)
      .values({ ...parsed.data, slug })
      .returning();
    res.status(201).json(sectorDto(row));
  } catch (error) {
    if (isUniqueViolation(error)) {
      slugConflict(res);
      return;
    }
    throw error;
  }
});

router.patch("/admin/sectors/:id", async (req, res): Promise<void> => {
  const params = UpdateSectorParams.safeParse(req.params);
  const body = UpdateSectorBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ error: "Geçersiz istek." });
    return;
  }
  try {
    const [row] = await db
      .update(sectorsTable)
      .set(body.data)
      .where(eq(sectorsTable.id, params.data.id))
      .returning();
    if (!row) {
      res.status(404).json({ error: "Sektör bulunamadı" });
      return;
    }
    res.json(sectorDto(row));
  } catch (error) {
    if (isUniqueViolation(error)) {
      slugConflict(res);
      return;
    }
    throw error;
  }
});

router.delete("/admin/sectors/:id", async (req, res): Promise<void> => {
  const params = DeleteSectorParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Geçersiz istek." });
    return;
  }
  const [row] = await db
    .delete(sectorsTable)
    .where(eq(sectorsTable.id, params.data.id))
    .returning({ id: sectorsTable.id });
  if (!row) {
    res.status(404).json({ error: "Sektör bulunamadı" });
    return;
  }
  res.status(204).end();
});

// ---------------------------------------------------------------------------
// Blog posts
// ---------------------------------------------------------------------------

function postDto(row: typeof postsTable.$inferSelect) {
  return {
    id: String(row.id),
    slug: row.slug,
    title: row.title,
    tag: row.tag,
    excerpt: row.excerpt,
    body: row.body,
    readTime: row.readTime,
    published: row.published,
    createdAt: row.createdAt,
  };
}

router.get("/admin/posts", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(postsTable)
    .orderBy(asc(postsTable.id));
  res.json(ListAdminPostsResponse.parse(rows.map(postDto)));
});

router.post("/admin/posts", async (req, res): Promise<void> => {
  const parsed = CreatePostBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const slug = parsed.data.slug || slugify(parsed.data.title);
  try {
    const [row] = await db
      .insert(postsTable)
      .values({ ...parsed.data, slug })
      .returning();
    res.status(201).json(postDto(row));
  } catch (error) {
    if (isUniqueViolation(error)) {
      slugConflict(res);
      return;
    }
    throw error;
  }
});

router.patch("/admin/posts/:id", async (req, res): Promise<void> => {
  const params = UpdatePostParams.safeParse(req.params);
  const body = UpdatePostBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ error: "Geçersiz istek." });
    return;
  }
  try {
    const [row] = await db
      .update(postsTable)
      .set(body.data)
      .where(eq(postsTable.id, params.data.id))
      .returning();
    if (!row) {
      res.status(404).json({ error: "Yazı bulunamadı" });
      return;
    }
    res.json(postDto(row));
  } catch (error) {
    if (isUniqueViolation(error)) {
      slugConflict(res);
      return;
    }
    throw error;
  }
});

router.delete("/admin/posts/:id", async (req, res): Promise<void> => {
  const params = DeletePostParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Geçersiz istek." });
    return;
  }
  const [row] = await db
    .delete(postsTable)
    .where(eq(postsTable.id, params.data.id))
    .returning({ id: postsTable.id });
  if (!row) {
    res.status(404).json({ error: "Yazı bulunamadı" });
    return;
  }
  res.status(204).end();
});

function contactMessageDto(m: typeof contactMessagesTable.$inferSelect) {
  return {
    id: String(m.id),
    fullName: m.fullName,
    company: m.company,
    phone: m.phone,
    email: m.email,
    subject: m.subject,
    message: m.message,
    kvkkAccepted: m.kvkkAccepted,
    status: m.status,
    createdAt: m.createdAt.toISOString(),
  };
}

router.get("/admin/summary", async (_req, res): Promise<void> => {
  const [
    productCountRows,
    brandCountRows,
    categoryCountRows,
    postCountRows,
    sliderCountRows,
    sectorList,
    messageCountRows,
    newMessageCountRows,
    requestCountRows,
    recentMessages,
    monthlyRows,
  ] = await Promise.all([
    db.select({ value: count(productsTable.id) }).from(productsTable),
    db.select({ value: count(brandsTable.id) }).from(brandsTable),
    db.select({ value: count(categoriesTable.id) }).from(categoriesTable),
    db.select({ value: count(postsTable.id) }).from(postsTable),
    db.select({ value: count(slidersTable.id) }).from(slidersTable),
    db.select({ id: sectorsTable.id }).from(sectorsTable),
    db.select({ value: count(contactMessagesTable.id) }).from(contactMessagesTable),
    db
      .select({ value: count(contactMessagesTable.id) })
      .from(contactMessagesTable)
      .where(eq(contactMessagesTable.status, "new")),
    db.select({ value: count(productRequestsTable.id) }).from(productRequestsTable),
    db
      .select()
      .from(contactMessagesTable)
      .orderBy(desc(contactMessagesTable.createdAt))
      .limit(6),
    db
      .select({
        month: sql<string>`to_char(${contactMessagesTable.createdAt}, 'YYYY-MM')`,
        count: count(contactMessagesTable.id),
      })
      .from(contactMessagesTable)
      .where(
        gte(
          contactMessagesTable.createdAt,
          sql`date_trunc('month', now()) - interval '5 months'`,
        ),
      )
      .groupBy(sql`to_char(${contactMessagesTable.createdAt}, 'YYYY-MM')`)
      .orderBy(asc(sql`to_char(${contactMessagesTable.createdAt}, 'YYYY-MM')`)),
  ]);

  res.json(
    GetAdminSummaryResponse.parse({
      productCount: Number(productCountRows[0]?.value ?? 0),
      brandCount: Number(brandCountRows[0]?.value ?? 0),
      categoryCount: Number(categoryCountRows[0]?.value ?? 0),
      sectorCount: sectorList.length,
      postCount: Number(postCountRows[0]?.value ?? 0),
      sliderCount: Number(sliderCountRows[0]?.value ?? 0),
      newMessageCount: Number(newMessageCountRows[0]?.value ?? 0),
      totalMessageCount: Number(messageCountRows[0]?.value ?? 0),
      totalRequestCount: Number(requestCountRows[0]?.value ?? 0),
      recentMessages: recentMessages.map(contactMessageDto),
      monthlyMessageTrend: monthlyRows.map((r) => ({
        month: String(r.month),
        count: Number(r.count),
      })),
    }),
  );
});

router.get("/admin/contact-messages", async (_req, res): Promise<void> => {
  const messages = await db
    .select()
    .from(contactMessagesTable)
    .orderBy(desc(contactMessagesTable.createdAt))
    .limit(200);
  res.json(ListAdminContactMessagesResponse.parse(messages.map(contactMessageDto)));
});

router.patch("/admin/contact-messages/:id", async (req, res): Promise<void> => {
  const params = UpdateContactMessageParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Geçersiz istek." });
    return;
  }
  const body = UpdateContactMessageBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "Geçersiz durum." });
    return;
  }
  const [row] = await db
    .update(contactMessagesTable)
    .set({ status: body.data.status })
    .where(eq(contactMessagesTable.id, params.data.id))
    .returning();
  if (!row) {
    res.status(404).json({ error: "Mesaj bulunamadı" });
    return;
  }
  res.json(contactMessageDto(row));
});

const SETTING_GROUPS: Record<string, string> = {
  general: "Genel Ayarlar",
  smtp: "SMTP Ayarları",
  seo: "SEO & Google Search Console",
  integrations: "Google & Meta Entegrasyonları",
  theme: "Tema ve Renkler",
};

router.get("/admin/settings", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(settingsTable)
    .orderBy(asc(settingsTable.group), asc(settingsTable.key));
  res.json(
    GetAdminSettingsResponse.parse(
      rows.map((s) => ({
        id: String(s.id),
        key: s.key,
        group: SETTING_GROUPS[s.group] ?? s.group,
        label: s.label,
        value: s.value,
        updatedAt: s.updatedAt.toISOString(),
      })),
    ),
  );
});

router.put("/admin/settings", async (req, res): Promise<void> => {
  const body = UpdateAdminSettingsBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "Geçersiz ayar girdisi." });
    return;
  }
  await Promise.all(
    Object.entries(body.data).map(([key, value]) =>
      db
        .update(settingsTable)
        .set({ value })
        .where(eq(settingsTable.key, key)),
    ),
  );
  const rows = await db
    .select()
    .from(settingsTable)
    .orderBy(asc(settingsTable.group), asc(settingsTable.key));
  res.json(
    GetAdminSettingsResponse.parse(
      rows.map((s) => ({
        id: String(s.id),
        key: s.key,
        group: SETTING_GROUPS[s.group] ?? s.group,
        label: s.label,
        value: s.value,
        updatedAt: s.updatedAt.toISOString(),
      })),
    ),
  );
});

router.get("/admin/audit-logs", async (req, res): Promise<void> => {
  const limit = Math.min(Number(req.query.limit) || 100, 500);
  const rows = await db
    .select()
    .from(auditLogsTable)
    .orderBy(desc(auditLogsTable.createdAt))
    .limit(limit);
  res.json(
    rows.map((r) => ({
      id: String(r.id),
      actorEmail: r.actorEmail,
      module: r.module,
      action: r.action,
      entityId: r.entityId,
      statusCode: r.statusCode,
      meta: r.meta ? JSON.parse(r.meta) : {},
      createdAt: r.createdAt.toISOString(),
    })),
  );
});

router.post("/admin/backup", async (_req, res): Promise<void> => {
  const { execFile } = await import("node:child_process");
  const fs = await import("node:fs");
  const path = await import("node:path");
  const { promisify } = await import("node:util");
  const execFileAsync = promisify(execFile);
  const backupDir = path.join(process.cwd(), "backups");
  fs.mkdirSync(backupDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const fileName = `rms-rulmak-${stamp}.sql`;
  const filePath = path.join(backupDir, fileName);
  const connection = process.env.DATABASE_URL ?? "postgresql://rulmak:rulmak_dev@localhost:15433/rms_rulmak";
  try {
    await execFileAsync("pg_dump", [connection, "-f", filePath], { timeout: 300_000 });
    const stats = fs.statSync(filePath);
    res.json({ ok: true, fileName, sizeBytes: stats.size, path: `backups/${fileName}` });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ ok: false, error: message });
  }
});

export default router;

// ---------------------------------------------------------------------------
// Sliders
// ---------------------------------------------------------------------------

function sliderDto(row: typeof slidersTable.$inferSelect) {
  return {
    id: String(row.id),
    placement: row.placement,
    title: row.title,
    subtitle: row.subtitle,
    image: row.image,
    href: row.href,
    position: row.position,
    published: row.published,
  };
}

router.get("/admin/sliders", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(slidersTable)
    .orderBy(asc(slidersTable.position), asc(slidersTable.id));
  res.json(rows.map(sliderDto));
});

router.post("/admin/sliders", async (req, res): Promise<void> => {
  const parsed = CreateSliderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const row = await db
    .insert(slidersTable)
    .values(parsed.data)
    .returning();
  res.status(201).json(sliderDto(row[0]));
});

router.patch("/admin/sliders/:id", async (req, res): Promise<void> => {
  const params = UpdateSliderParams.safeParse(req.params);
  const body = UpdateSliderBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ error: "Geçersiz istek." });
    return;
  }
  const [row] = await db
    .update(slidersTable)
    .set(body.data)
    .where(eq(slidersTable.id, params.data.id))
    .returning();
  if (!row) {
    res.status(404).json({ error: "Slider bulunamadı" });
    return;
  }
  res.json(sliderDto(row));
});

router.delete("/admin/sliders/:id", async (req, res): Promise<void> => {
  const params = DeleteSliderParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Geçersiz istek." });
    return;
  }
  const [row] = await db
    .delete(slidersTable)
    .where(eq(slidersTable.id, params.data.id))
    .returning({ id: slidersTable.id });
  if (!row) {
    res.status(404).json({ error: "Slider bulunamadı" });
    return;
  }
  res.status(204).end();
});

// ---------------------------------------------------------------------------
// Site sections
// ---------------------------------------------------------------------------

function siteSectionDto(row: typeof siteSectionsTable.$inferSelect) {
  return {
    id: String(row.id),
    key: row.key,
    page: row.page,
    label: row.label,
    body: row.body,
  };
}

router.get("/admin/site-sections", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(siteSectionsTable)
    .orderBy(asc(siteSectionsTable.page), asc(siteSectionsTable.id));
  res.json(rows.map(siteSectionDto));
});

router.post("/admin/site-sections", async (req, res): Promise<void> => {
  const parsed = CreateSiteSectionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  try {
    const row = await db
      .insert(siteSectionsTable)
      .values(parsed.data)
      .returning();
    res.status(201).json(siteSectionDto(row[0]));
  } catch (error) {
    if (isUniqueViolation(error)) {
      slugConflict(res);
      return;
    }
    throw error;
  }
});

router.patch("/admin/site-sections/:id", async (req, res): Promise<void> => {
  const params = UpdateSiteSectionParams.safeParse(req.params);
  const body = UpdateSiteSectionBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ error: "Geçersiz istek." });
    return;
  }
  try {
    const [row] = await db
      .update(siteSectionsTable)
      .set(body.data)
      .where(eq(siteSectionsTable.id, params.data.id))
      .returning();
    if (!row) {
      res.status(404).json({ error: "Bölüm bulunamadı" });
      return;
    }
    res.json(siteSectionDto(row));
  } catch (error) {
    if (isUniqueViolation(error)) {
      slugConflict(res);
      return;
    }
    throw error;
  }
});

router.delete("/admin/site-sections/:id", async (req, res): Promise<void> => {
  const params = DeleteSiteSectionParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Geçersiz istek." });
    return;
  }
  const [row] = await db
    .delete(siteSectionsTable)
    .where(eq(siteSectionsTable.id, params.data.id))
    .returning({ id: siteSectionsTable.id });
  if (!row) {
    res.status(404).json({ error: "Bölüm bulunamadı" });
    return;
  }
  res.status(204).end();
});

// ---------------------------------------------------------------------------
// Media library
// ---------------------------------------------------------------------------
router.get("/admin/media", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(mediaAssetsTable)
    .orderBy(desc(mediaAssetsTable.createdAt));
  res.json(ListAdminMediaAssetsResponse.parse(rows.map(mediaAssetDto)));
});

function mediaAssetDto(row: typeof mediaAssetsTable.$inferSelect) {
  return {
    id: String(row.id),
    storagePath: row.storagePath,
    fileName: row.fileName,
    title: row.title,
    description: row.description,
    altText: row.altText,
    mimeType: row.mimeType,
    size: row.size,
    folder: row.folder,
    checksum: row.checksum,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

router.post("/admin/media", async (req, res): Promise<void> => {
  const parsed = CreateAdminMediaAssetBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Geçersiz dosya verisi." });
    return;
  }
  const { fileName, mimeType, base64, title, altText, description, folder } =
    parsed.data;
  if (!isAllowedFile(mimeType, fileName)) {
    res.status(400).json({
      error: "Desteklenmeyen dosya türü. Görsel (png, jpg, webp, svg, gif) veya PDF yükleyebilirsiniz.",
    });
    return;
  }
  let saved: { storagePath: string; size: number; checksum: string };
  try {
    saved = saveMediaFile(base64, fileName, mimeType);
  } catch (error) {
    res
      .status(400)
      .json({ error: error instanceof Error ? error.message : "Dosya kaydedilemedi." });
    return;
  }
  const [row] = await db
    .insert(mediaAssetsTable)
    .values({
      storagePath: saved.storagePath,
      fileName,
      mimeType,
      size: saved.size,
      checksum: saved.checksum,
      title: title ?? "",
      altText: altText ?? "",
      description: description ?? "",
      folder: folder ?? "genel",
    })
    .returning();
  res.status(201).json(mediaAssetDto(row));
});

router.patch("/admin/media/:id", async (req, res): Promise<void> => {
  const params = UpdateAdminMediaAssetParams.safeParse(req.params);
  const body = UpdateAdminMediaAssetBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ error: "Geçersiz istek." });
    return;
  }
  const [row] = await db
    .update(mediaAssetsTable)
    .set({
      title: body.data.title,
      altText: body.data.altText,
      description: body.data.description,
      folder: body.data.folder,
    })
    .where(eq(mediaAssetsTable.id, params.data.id))
    .returning();
  if (!row) {
    res.status(404).json({ error: "Dosya bulunamadı" });
    return;
  }
  res.json(mediaAssetDto(row));
});

router.delete("/admin/media/:id", async (req, res): Promise<void> => {
  const params = DeleteAdminMediaAssetParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Geçersiz istek." });
    return;
  }
  const [row] = await db
    .delete(mediaAssetsTable)
    .where(eq(mediaAssetsTable.id, params.data.id))
    .returning();
  if (!row) {
    res.status(404).json({ error: "Dosya bulunamadı" });
    return;
  }
  try {
    deleteMediaFile(row.storagePath);
  } catch {
    // Fiziksel dosya zaten yoksa sorun değil; kayıt silindi.
  }
  res.status(204).end();
});

// ---------------------------------------------------------------------------
// Pages
// ---------------------------------------------------------------------------
router.get("/admin/pages", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(pagesTable)
    .orderBy(asc(pagesTable.position), asc(pagesTable.id));
  res.json(ListAdminPagesResponse.parse(rows.map(pageAdminDto)));
});

function pageAdminDto(row: typeof pagesTable.$inferSelect) {
  return {
    id: String(row.id),
    slug: row.slug,
    title: row.title,
    content: row.content,
    template: row.template,
    published: row.published,
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    position: row.position,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

router.post("/admin/pages", async (req, res): Promise<void> => {
  const parsed = CreateAdminPageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Geçersiz sayfa verisi." });
    return;
  }
  const body = parsed.data;
  const slug = slugify(body.slug);
  if (!slug) {
    res.status(400).json({ error: "Geçersiz sayfa adresi (slug)." });
    return;
  }
  try {
    const [row] = await db
      .insert(pagesTable)
      .values({
        slug,
        title: body.title,
        content: body.content,
        template: body.template ?? "static",
        published: body.published ?? true,
        seoTitle: body.seoTitle ?? "",
        seoDescription: body.seoDescription ?? "",
        position: body.position ?? 0,
      })
      .returning();
    res.status(201).json(pageAdminDto(row));
  } catch (error) {
    if (isUniqueViolation(error)) {
      slugConflict(res);
      return;
    }
    throw error;
  }
});

router.patch("/admin/pages/:id", async (req, res): Promise<void> => {
  const params = UpdateAdminPageParams.safeParse(req.params);
  const body = UpdateAdminPageBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ error: "Geçersiz istek." });
    return;
  }
  const next = { ...body.data };
  if (next.slug) {
    next.slug = slugify(next.slug);
    if (!next.slug) {
      res.status(400).json({ error: "Geçersiz sayfa adresi (slug)." });
      return;
    }
  }
  try {
    const [row] = await db
      .update(pagesTable)
      .set(next)
      .where(eq(pagesTable.id, params.data.id))
      .returning();
    if (!row) {
      res.status(404).json({ error: "Sayfa bulunamadı" });
      return;
    }
    res.json(pageAdminDto(row));
  } catch (error) {
    if (isUniqueViolation(error)) {
      slugConflict(res);
      return;
    }
    throw error;
  }
});

router.delete("/admin/pages/:id", async (req, res): Promise<void> => {
  const params = DeleteAdminPageParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Geçersiz istek." });
    return;
  }
  const [row] = await db
    .delete(pagesTable)
    .where(eq(pagesTable.id, params.data.id))
    .returning({ id: pagesTable.id });
  if (!row) {
    res.status(404).json({ error: "Sayfa bulunamadı" });
    return;
  }
  res.status(204).end();
});

// ---------------------------------------------------------------------------
// Redirect rules
// ---------------------------------------------------------------------------
router.get("/admin/redirects", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(redirectRulesTable)
    .orderBy(asc(redirectRulesTable.position), asc(redirectRulesTable.id));
  res.json(ListAdminRedirectRulesResponse.parse(rows.map(redirectDto)));
});

function redirectDto(row: typeof redirectRulesTable.$inferSelect) {
  return {
    id: String(row.id),
    fromPath: row.fromPath,
    toPath: row.toPath,
    statusCode: row.statusCode,
    enabled: row.enabled,
    position: row.position,
    createdAt: row.createdAt,
  };
}

router.post("/admin/redirects", async (req, res): Promise<void> => {
  const parsed = CreateAdminRedirectRuleBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Geçersiz yönlendirme verisi." });
    return;
  }
  const body = parsed.data;
  try {
    const [row] = await db
      .insert(redirectRulesTable)
      .values({
        fromPath: body.fromPath,
        toPath: body.toPath,
        statusCode: body.statusCode ?? 301,
        enabled: body.enabled ?? true,
        position: body.position ?? 0,
      })
      .returning();
    res.status(201).json(redirectDto(row));
  } catch (error) {
    if (isUniqueViolation(error)) {
      res.status(409).json({ error: "Bu kaynak adresi için kural zaten var." });
      return;
    }
    throw error;
  }
});

router.patch("/admin/redirects/:id", async (req, res): Promise<void> => {
  const params = UpdateAdminRedirectRuleParams.safeParse(req.params);
  const body = UpdateAdminRedirectRuleBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ error: "Geçersiz istek." });
    return;
  }
  try {
    const [row] = await db
      .update(redirectRulesTable)
      .set(body.data)
      .where(eq(redirectRulesTable.id, params.data.id))
      .returning();
    if (!row) {
      res.status(404).json({ error: "Kural bulunamadı" });
      return;
    }
    res.json(redirectDto(row));
  } catch (error) {
    if (isUniqueViolation(error)) {
      res.status(409).json({ error: "Bu kaynak adresi için kural zaten var." });
      return;
    }
    throw error;
  }
});

router.delete("/admin/redirects/:id", async (req, res): Promise<void> => {
  const params = DeleteAdminRedirectRuleParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Geçersiz istek." });
    return;
  }
  const [row] = await db
    .delete(redirectRulesTable)
    .where(eq(redirectRulesTable.id, params.data.id))
    .returning({ id: redirectRulesTable.id });
  if (!row) {
    res.status(404).json({ error: "Kural bulunamadı" });
    return;
  }
  res.status(204).end();
});

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------
router.get("/admin/users", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(usersTable)
    .orderBy(desc(usersTable.createdAt));
  res.json(
    ListAdminUsersResponse.parse(
      rows.map((u) => ({
        id: u.id,
        email: u.email,
        firstName: u.firstName,
        lastName: u.lastName,
        profileImageUrl: u.profileImageUrl,
        role: u.role,
        isActive: u.isActive,
        lastLoginAt: u.lastLoginAt,
        createdAt: u.createdAt,
      })),
    ),
  );
});

router.patch("/admin/users/:id", async (req, res): Promise<void> => {
  const params = UpdateAdminUserParams.safeParse(req.params);
  const body = UpdateAdminUserBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ error: "Geçersiz istek." });
    return;
  }
  const [row] = await db
    .update(usersTable)
    .set({ role: body.data.role, isActive: body.data.isActive })
    .where(eq(usersTable.id, params.data.id))
    .returning();
  if (!row) {
    res.status(404).json({ error: "Kullanıcı bulunamadı" });
    return;
  }
  res.json({
    id: row.id,
    email: row.email,
    firstName: row.firstName,
    lastName: row.lastName,
    profileImageUrl: row.profileImageUrl,
    role: row.role,
    isActive: row.isActive,
    lastLoginAt: row.lastLoginAt,
    createdAt: row.createdAt,
  });
});
