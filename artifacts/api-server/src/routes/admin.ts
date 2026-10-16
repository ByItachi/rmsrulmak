import { Router, type IRouter, type Response } from "express";
import { asc, count, eq } from "drizzle-orm";
import {
  db,
  brandsTable,
  categoriesTable,
  postsTable,
  productsTable,
  sectorsTable,
} from "@workspace/db";
import {
  CreateBrandBody,
  CreateCategoryBody,
  CreatePostBody,
  CreateProductBody,
  CreateSectorBody,
  DeleteBrandParams,
  DeleteCategoryParams,
  DeletePostParams,
  DeleteProductParams,
  DeleteSectorParams,
  ListAdminBrandsResponse,
  ListAdminCategoriesResponse,
  ListAdminPostsResponse,
  ListAdminProductsResponse,
  ListAdminSectorsResponse,
  UpdateBrandBody,
  UpdateBrandParams,
  UpdateCategoryBody,
  UpdateCategoryParams,
  UpdatePostBody,
  UpdatePostParams,
  UpdateProductBody,
  UpdateProductParams,
  UpdateSectorBody,
  UpdateSectorParams,
} from "@workspace/api-zod";
import { requireCatalogAdmin } from "../middlewares/catalogAdmin";
import { isUniqueViolation, slugify } from "../lib/contentFallbacks";

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

export default router;
