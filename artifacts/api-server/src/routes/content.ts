import { Router, type IRouter } from "express";
import { asc, desc, eq } from "drizzle-orm";
import {
  db,
  pagesTable,
  postsTable,
  sectorsTable,
  settingsTable,
  siteSectionsTable,
  slidersTable,
} from "@workspace/db";
import {
  GetPostParams,
  GetPostResponse,
  GetPublicPageParams,
  GetPublicPageResponse,
  ListPostsResponse,
  ListSectorsResponse,
} from "@workspace/api-zod";
import { fallbackSectors, fallbackSliders } from "../lib/contentFallbacks";
import {
  mediaContentType,
  readMediaFile,
} from "../lib/mediaStore";

const router: IRouter = Router();

router.get("/sectors", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(sectorsTable)
    .orderBy(asc(sectorsTable.position), asc(sectorsTable.id));

  const payload = rows.length
    ? rows.map((row) => ({
        name: row.name,
        slug: row.slug,
        description: row.description,
      }))
    : fallbackSectors;

  res.json(ListSectorsResponse.parse(payload));
});

router.get("/sliders", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(slidersTable)
    .where(eq(slidersTable.published, true))
    .orderBy(asc(slidersTable.position), asc(slidersTable.id));

  const payload = rows.length
    ? rows.map((row) => ({
        title: row.title,
        subtitle: row.subtitle,
        image: row.image,
        href: row.href,
        placement: row.placement,
      }))
    : fallbackSliders;

  res.json(payload);
});

router.get("/site-sections", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(siteSectionsTable)
    .orderBy(asc(siteSectionsTable.id));

  res.json(
    rows.map((row) => ({
      key: row.key,
      page: row.page,
      label: row.label,
      body: row.body,
    })),
  );
});

router.get("/posts", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(postsTable)
    .where(eq(postsTable.published, true))
    .orderBy(desc(postsTable.createdAt), desc(postsTable.id));

  res.json(
    ListPostsResponse.parse(
      rows.map((row) => ({
        slug: row.slug,
        title: row.title,
        tag: row.tag,
        excerpt: row.excerpt,
        readTime: row.readTime,
        createdAt: row.createdAt,
      })),
    ),
  );
});

router.get("/posts/:slug", async (req, res): Promise<void> => {
  const parsed = GetPostParams.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [row] = await db
    .select()
    .from(postsTable)
    .where(eq(postsTable.slug, parsed.data.slug))
    .limit(1);

  if (!row || !row.published) {
    res.status(404).json({ error: "Yazı bulunamadı" });
    return;
  }

  res.json(
    GetPostResponse.parse({
      slug: row.slug,
      title: row.title,
      tag: row.tag,
      excerpt: row.excerpt,
      body: row.body,
      readTime: row.readTime,
      published: row.published,
      createdAt: row.createdAt,
    }),
  );
});

const PUBLIC_SETTING_KEYS = [
  "site_name",
  "site_tagline",
  "meta_title",
  "meta_description",
  "gsc_verification",
  "ga4_id",
  "gtm_id",
  "meta_pixel_id",
  "theme_primary",
  "theme_primary_foreground",
  "theme_background",
  "theme_foreground",
  "theme_accent",
] as const;

router.get("/settings/public", async (_req, res): Promise<void> => {
  const rows = await db.select().from(settingsTable);
  const out: Record<string, string> = {};
  for (const key of PUBLIC_SETTING_KEYS) {
    const row = rows.find((r) => r.key === key);
    if (row) out[key] = row.value;
  }
  res.json(out);
});

router.get("/pages/:slug", async (req, res): Promise<void> => {
  const parsed = GetPublicPageParams.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [row] = await db
    .select()
    .from(pagesTable)
    .where(eq(pagesTable.slug, parsed.data.slug))
    .limit(1);

  if (!row || !row.published) {
    res.status(404).json({ error: "Sayfa bulunamadı" });
    return;
  }

  res.json(
    GetPublicPageResponse.parse({
      slug: row.slug,
      title: row.title,
      content: row.content,
      template: row.template,
      seoTitle: row.seoTitle,
      seoDescription: row.seoDescription,
      updatedAt: row.updatedAt,
    }),
  );
});

router.get("/media/:name", (req, res) => {
  const name = String(req.params.name ?? "");
  if (!name || name.includes("/")) {
    res.status(400).json({ error: "Geçersiz dosya adı." });
    return;
  }
  const buffer = readMediaFile(name);
  if (!buffer) {
    res.status(404).json({ error: "Dosya bulunamadı" });
    return;
  }
  res.setHeader("Content-Type", mediaContentType(name));
  res.setHeader("Cache-Control", "public, max-age=86400");
  res.send(buffer);
});

export default router;
