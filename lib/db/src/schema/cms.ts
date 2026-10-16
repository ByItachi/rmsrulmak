import { createInsertSchema } from "drizzle-zod";
import {
  boolean,
  foreignKey,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export const mediaAssetsTable = pgTable("media_assets", {
  id: serial("id").primaryKey(),
  storagePath: text("storage_path").notNull(),
  fileName: text("file_name").notNull(),
  title: text("title").notNull().default(""),
  description: text("description").notNull().default(""),
  altText: text("alt_text").notNull().default(""),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull().default(0),
  folder: text("folder").notNull().default("genel"),
  checksum: text("checksum").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const pagesTable = pgTable("pages", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  content: text("content").notNull().default(""),
  template: text("template").notNull().default("static"),
  published: boolean("published").notNull().default(true),
  seoTitle: text("seo_title").notNull().default(""),
  seoDescription: text("seo_description").notNull().default(""),
  position: integer("position").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const redirectRulesTable = pgTable("redirect_rules", {
  id: serial("id").primaryKey(),
  fromPath: text("from_path").notNull().unique(),
  toPath: text("to_path").notNull(),
  statusCode: integer("status_code").notNull().default(301),
  enabled: boolean("enabled").notNull().default(true),
  position: integer("position").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const menusTable = pgTable("menus", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  label: text("label").notNull(),
  position: integer("position").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const menuItemsTable = pgTable(
  "menu_items",
  {
    id: serial("id").primaryKey(),
    menuId: integer("menu_id")
      .notNull()
      .references(() => menusTable.id, { onDelete: "cascade" }),
    parentId: integer("parent_id"),
    label: text("label").notNull(),
    href: text("href").notNull(),
    position: integer("position").notNull().default(0),
    openInNewTab: boolean("open_in_new_tab").notNull().default(false),
    enabled: boolean("enabled").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [foreignKey({ columns: [t.parentId], foreignColumns: [t.id] })],
);

export const insertMenuSchema = createInsertSchema(menusTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const insertMenuItemSchema = createInsertSchema(menuItemsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMediaAssetSchema = createInsertSchema(mediaAssetsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPageSchema = createInsertSchema(pagesTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertRedirectRuleSchema = createInsertSchema(redirectRulesTable).omit(
  { id: true, createdAt: true, updatedAt: true },
);

export type MediaAsset = typeof mediaAssetsTable.$inferSelect;
export type Page = typeof pagesTable.$inferSelect;
export type RedirectRule = typeof redirectRulesTable.$inferSelect;
export type Menu = typeof menusTable.$inferSelect;
export type MenuItem = typeof menuItemsTable.$inferSelect;
export type InsertMediaAsset = z.infer<typeof insertMediaAssetSchema>;
export type InsertPage = z.infer<typeof insertPageSchema>;
export type InsertRedirectRule = z.infer<typeof insertRedirectRuleSchema>;
export type InsertMenu = z.infer<typeof insertMenuSchema>;
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;
