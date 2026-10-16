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

export const sectorsTable = pgTable("sectors", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  position: integer("position").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const postsTable = pgTable("posts", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  tag: text("tag").notNull().default("Teknik bilgi"),
  excerpt: text("excerpt").notNull().default(""),
  body: text("body").notNull().default(""),
  readTime: integer("read_time").notNull().default(4),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const slidersTable = pgTable("sliders", {
  id: serial("id").primaryKey(),
  placement: text("placement").notNull().default("hero"),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull().default(""),
  image: text("image").notNull(),
  href: text("href").notNull().default(""),
  position: integer("position").notNull().default(0),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const siteSectionsTable = pgTable("site_sections", {
  id: serial("id").primaryKey(),
  page: text("page").notNull().default("home"),
  key: text("key").notNull().unique(),
  label: text("label").notNull(),
  body: text("body").notNull().default(""),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const settingsTable = pgTable("settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  group: text("group").notNull().default("general"),
  label: text("label").notNull(),
  value: text("value").notNull().default(""),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const auditLogsTable = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  actorEmail: text("actor_email").notNull(),
  module: text("module").notNull(),
  action: text("action").notNull(),
  entityId: text("entity_id"),
  statusCode: integer("status_code").notNull(),
  meta: text("meta"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const insertSectorSchema = createInsertSchema(sectorsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPostSchema = createInsertSchema(postsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSliderSchema = createInsertSchema(slidersTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSiteSectionSchema = createInsertSchema(siteSectionsTable).omit({
  id: true,
  updatedAt: true,
});

export const insertSettingSchema = createInsertSchema(settingsTable).omit({
  id: true,
  updatedAt: true,
});

export type Sector = typeof sectorsTable.$inferSelect;
export type Post = typeof postsTable.$inferSelect;
export type Slider = typeof slidersTable.$inferSelect;
export type SiteSection = typeof siteSectionsTable.$inferSelect;
export type SiteSetting = typeof settingsTable.$inferSelect;
export type AuditLog = typeof auditLogsTable.$inferSelect;
export type InsertSector = z.infer<typeof insertSectorSchema>;
export type InsertPost = z.infer<typeof insertPostSchema>;
export type InsertSlider = z.infer<typeof insertSliderSchema>;
export type InsertSiteSection = z.infer<typeof insertSiteSectionSchema>;
export type InsertSetting = z.infer<typeof insertSettingSchema>;
