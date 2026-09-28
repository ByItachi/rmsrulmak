import { Router, type IRouter } from "express";
import { and, asc, count, eq, ilike, or } from "drizzle-orm";
import {
  Brand,
  Category,
  db,
  brandsTable,
  categoriesTable,
  productDocumentsTable,
  productSpecsTable,
  productsTable,
} from "@workspace/db";
import {
  GetDashboardSummaryResponse,
  GetProductParams,
  GetProductResponse,
  ListBrandsResponse,
  ListCategoriesResponse,
  ListProductsQueryParams,
  ListProductsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

const sectors = [
  {
    name: "Demir ve Çelik",
    slug: "demir-celik",
    description:
      "Yüksek ısı, yük ve sürekli çalışma koşulları için dayanıklı rulman ve güç aktarım çözümleri.",
  },
  {
    name: "Madencilik",
    slug: "madencilik",
    description:
      "Tozlu ve zorlu sahalarda ekipman ömrünü ve çalışma sürekliliğini destekleyen ürünler.",
  },
  {
    name: "Kağıt ve Sanayi",
    slug: "kagit-sanayi",
    description:
      "Üretim hatlarında hassasiyet, hız ve bakım verimliliği sağlayan teknik çözümler.",
  },
  {
    name: "Çimento",
    slug: "cimento",
    description:
      "Ağır hizmet uygulamalarında güvenilir hareket ve güç aktarımı için ürün seçimi.",
  },
  {
    name: "Taşıma ve Depolama",
    slug: "tasima-depolama",
    description:
      "Konveyör ve lojistik sistemlerinde kesintisiz hareket için doğru bileşenler.",
  },
  {
    name: "Enerji",
    slug: "enerji",
    description:
      "Enerji ekipmanlarında güvenilirlik, uzun ömür ve planlı bakım odaklı çözümler.",
  },
  {
    name: "Tarım ve Gıda",
    slug: "tarim-gida",
    description:
      "Hijyen, dayanıklılık ve zorlu çalışma ortamlarına uygun endüstriyel ürünler.",
  },
  {
    name: "Otomotiv ve Makine",
    slug: "otomotiv-makine",
    description:
      "Hassas ve yüksek performanslı makine sistemleri için rulman ve güç aktarım ürünleri.",
  },
];

function productImage(imageUrl: string): string {
  return imageUrl || "/brand/rulmak-icon-red.png";
}

function categoryDto(
  category: Category,
  productCount: number,
) {
  return {
    id: String(category.id),
    slug: category.slug,
    name: category.name,
    description: category.description,
    productCount,
  };
}

function brandDto(brand: Brand, productCount: number) {
  return {
    id: String(brand.id),
    slug: brand.slug,
    name: brand.name,
    description: brand.description,
    logoUrl: brand.logoUrl || "/brand/rulmak-icon-red.png",
    productCount,
  };
}

router.get("/products", async (req, res): Promise<void> => {
  const parsed = ListProductsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { q, category, brand, featured, limit, offset } = parsed.data;
  const conditions = [];

  if (q) {
    conditions.push(
      or(
        ilike(productsTable.name, `%${q}%`),
        ilike(productsTable.code, `%${q}%`),
        ilike(brandsTable.name, `%${q}%`),
        ilike(productsTable.slug, `%${q}%`),
      ),
    );
  }
  if (category) {
    conditions.push(eq(categoriesTable.slug, category));
  }
  if (brand) {
    conditions.push(eq(brandsTable.slug, brand));
  }
  if (featured !== undefined) {
    conditions.push(eq(productsTable.featured, featured));
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;
  const [rows, totalRows] = await Promise.all([
    db
      .select({
        product: productsTable,
        brand: brandsTable,
        category: categoriesTable,
      })
      .from(productsTable)
      .innerJoin(brandsTable, eq(productsTable.brandId, brandsTable.id))
      .innerJoin(
        categoriesTable,
        eq(productsTable.categoryId, categoriesTable.id),
      )
      .where(where)
      .orderBy(asc(productsTable.name))
      .limit(limit)
      .offset(offset),
    db
      .select({ value: count(productsTable.id) })
      .from(productsTable)
      .innerJoin(brandsTable, eq(productsTable.brandId, brandsTable.id))
      .innerJoin(
        categoriesTable,
        eq(productsTable.categoryId, categoriesTable.id),
      )
      .where(where),
  ]);

  const response = ListProductsResponse.parse({
    items: rows.map(({ product, brand: productBrand, category: productCategory }) => ({
      id: String(product.id),
      slug: product.slug,
      name: product.name,
      code: product.code,
      brandName: productBrand.name,
      brandSlug: productBrand.slug,
      categoryName: productCategory.name,
      categorySlug: productCategory.slug,
      shortDescription: product.shortDescription,
      imageUrl: productImage(product.imageUrl),
      featured: product.featured,
    })),
    total: Number(totalRows[0]?.value ?? 0),
    limit,
    offset,
  });

  res.json(response);
});

router.get("/products/:slug", async (req, res): Promise<void> => {
  const parsed = GetProductParams.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [row] = await db
    .select({
      product: productsTable,
      brand: brandsTable,
      category: categoriesTable,
    })
    .from(productsTable)
    .innerJoin(brandsTable, eq(productsTable.brandId, brandsTable.id))
    .innerJoin(
      categoriesTable,
      eq(productsTable.categoryId, categoriesTable.id),
    )
    .where(eq(productsTable.slug, parsed.data.slug))
    .limit(1);

  if (!row) {
    res.status(404).json({ error: "Ürün bulunamadı" });
    return;
  }

  const [specs, documents] = await Promise.all([
    db
      .select({
        label: productSpecsTable.label,
        value: productSpecsTable.value,
      })
      .from(productSpecsTable)
      .where(eq(productSpecsTable.productId, row.product.id))
      .orderBy(asc(productSpecsTable.id)),
    db
      .select({
        title: productDocumentsTable.title,
        type: productDocumentsTable.type,
        url: productDocumentsTable.url,
      })
      .from(productDocumentsTable)
      .where(eq(productDocumentsTable.productId, row.product.id))
      .orderBy(asc(productDocumentsTable.id)),
  ]);

  const response = GetProductResponse.parse({
    id: String(row.product.id),
    slug: row.product.slug,
    name: row.product.name,
    code: row.product.code,
    brand: brandDto(row.brand, 0),
    category: categoryDto(row.category, 0),
    shortDescription: row.product.shortDescription,
    description: row.product.description,
    imageUrl: productImage(row.product.imageUrl),
    technicalSpecs: specs,
    documents,
    featured: row.product.featured,
  });

  res.json(response);
});

router.get("/categories", async (_req, res): Promise<void> => {
  const rows = await db
    .select({
      category: categoriesTable,
      productCount: count(productsTable.id),
    })
    .from(categoriesTable)
    .leftJoin(productsTable, eq(productsTable.categoryId, categoriesTable.id))
    .groupBy(categoriesTable.id)
    .orderBy(asc(categoriesTable.name));

  res.json(
    ListCategoriesResponse.parse(
      rows.map(({ category, productCount }) =>
        categoryDto(category, Number(productCount)),
      ),
    ),
  );
});

router.get("/brands", async (_req, res): Promise<void> => {
  const rows = await db
    .select({
      brand: brandsTable,
      productCount: count(productsTable.id),
    })
    .from(brandsTable)
    .leftJoin(productsTable, eq(productsTable.brandId, brandsTable.id))
    .groupBy(brandsTable.id)
    .orderBy(asc(brandsTable.name));

  res.json(
    ListBrandsResponse.parse(
      rows.map(({ brand, productCount }) =>
        brandDto(brand, Number(productCount)),
      ),
    ),
  );
});

router.get("/dashboard/summary", async (_req, res): Promise<void> => {
  const [productCountRows, brandCountRows, categoryCountRows, products] =
    await Promise.all([
      db.select({ value: count(productsTable.id) }).from(productsTable),
      db.select({ value: count(brandsTable.id) }).from(brandsTable),
      db.select({ value: count(categoriesTable.id) }).from(categoriesTable),
      db
        .select({
          product: productsTable,
          brand: brandsTable,
          category: categoriesTable,
        })
        .from(productsTable)
        .innerJoin(brandsTable, eq(productsTable.brandId, brandsTable.id))
        .innerJoin(
          categoriesTable,
          eq(productsTable.categoryId, categoriesTable.id),
        )
        .where(eq(productsTable.featured, true))
        .orderBy(asc(productsTable.name))
        .limit(4),
    ]);

  res.json(
    GetDashboardSummaryResponse.parse({
      productCount: Number(productCountRows[0]?.value ?? 0),
      brandCount: Number(brandCountRows[0]?.value ?? 0),
      categoryCount: Number(categoryCountRows[0]?.value ?? 0),
      sectorCount: sectors.length,
      sectors,
      featuredProducts: products.map(
        ({ product, brand: productBrand, category: productCategory }) => ({
          id: String(product.id),
          slug: product.slug,
          name: product.name,
          code: product.code,
          brandName: productBrand.name,
          brandSlug: productBrand.slug,
          categoryName: productCategory.name,
          categorySlug: productCategory.slug,
          shortDescription: product.shortDescription,
          imageUrl: productImage(product.imageUrl),
          featured: product.featured,
        }),
      ),
    }),
  );
});

export default router;