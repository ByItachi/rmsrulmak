import { createInsertSchema } from "drizzle-zod";
import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export const catalogsTable = pgTable("catalogs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  brand: text("brand").notNull().default("Genel"),
  category: text("category").notNull().default("Teknik katalog"),
  description: text("description").notNull().default(""),
  fileName: text("file_name").notNull(),
  fileSize: integer("file_size").notNull(),
  objectPath: text("object_path").notNull().unique(),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const insertCatalogSchema = createInsertSchema(catalogsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Catalog = typeof catalogsTable.$inferSelect;
export type InsertCatalog = z.infer<typeof insertCatalogSchema>;
