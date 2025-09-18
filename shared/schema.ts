import { sql } from "drizzle-orm";
import { 
  pgTable, 
  serial, 
  varchar, 
  text, 
  integer, 
  decimal,
  boolean, 
  timestamp,
  jsonb,
  index
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  firstName: varchar("first_name", { length: 50 }).notNull(),
  lastName: varchar("last_name", { length: 50 }).notNull(),
  role: varchar("role", { enum: ["admin", "manager"] }).default("admin"),
  isActive: boolean("is_active").default(true),
  lastLogin: timestamp("last_login"),
  avatar: varchar("avatar", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => {
  return {
    usernameIdx: index("idx_users_username").on(table.username),
    emailIdx: index("idx_users_email").on(table.email),
  };
});

// Properties table
export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }),
  description: text("description"),
  price: decimal("price", { precision: 12, scale: 2 }),
  propertyType: varchar("property_type", { 
    enum: ["house", "apartment", "condo", "townhouse", "villa", "land", "commercial"] 
  }),
  status: varchar("status", { 
    enum: ["for-sale", "for-rent", "sold", "rented", "pending"] 
  }).default("for-sale"),
  // Address as JSONB
  address: jsonb("address").$type<{
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  }>(),
  // Coordinates as JSONB  
  coordinates: jsonb("coordinates").$type<{
    latitude?: number;
    longitude?: number;
  }>(),
  // Features as JSONB
  features: jsonb("features").$type<{
    bedrooms?: number;
    bathrooms?: number;
    sqft?: number;
    lotSize?: number;
    yearBuilt?: number;
    garage?: number;
    stories?: number;
  }>(),
  amenities: jsonb("amenities").$type<string[]>(),
  images: jsonb("images").$type<Array<{
    url: string;
    alt?: string;
    isPrimary?: boolean;
  }>>(),
  agentId: integer("agent_id").references(() => users.id),
  isActive: boolean("is_active").default(true),
  isFeatured: boolean("is_featured").default(false),
  views: integer("views").default(0),
  lastUpdated: timestamp("last_updated").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => {
  return {
    propertyTypeIdx: index("idx_properties_type_status").on(table.propertyType, table.status),
    activeIdx: index("idx_properties_active_featured").on(table.isActive, table.isFeatured),
    agentIdx: index("idx_properties_agent").on(table.agentId),
  };
});

// Team members table
export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name", { length: 50 }).notNull(),
  lastName: varchar("last_name", { length: 50 }).notNull(),
  position: varchar("position", { length: 100 }).notNull(),
  bio: text("bio").notNull(),
  photo: jsonb("photo").$type<{
    url: string;
    alt?: string;
  }>().notNull(),
  contact: jsonb("contact").$type<{
    email: string;
    phone: string;
    whatsapp?: string;
  }>().notNull(),
  socialMedia: jsonb("social_media").$type<{
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  }>(),
  specialties: jsonb("specialties").$type<string[]>(),
  languages: jsonb("languages").$type<string[]>(),
  experience: jsonb("experience").$type<{
    yearsInBusiness?: number;
    propertiesSold?: number;
    totalSalesVolume?: number;
  }>(),
  certifications: jsonb("certifications").$type<Array<{
    name: string;
    issuingOrganization?: string;
    year?: number;
  }>>(),
  userId: integer("user_id").references(() => users.id),
  isActive: boolean("is_active").default(true),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => {
  return {
    orderIdx: index("idx_team_members_order_active").on(table.order, table.isActive),
  };
});

// Blog posts table
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 250 }).notNull().unique(),
  excerpt: varchar("excerpt", { length: 300 }).notNull(),
  content: text("content").notNull(),
  featuredImage: jsonb("featured_image").$type<{
    url: string;
    alt: string;
  }>().notNull(),
  authorId: integer("author_id").references(() => users.id).notNull(),
  category: varchar("category", {
    enum: ["market-update", "buying-guide", "selling-guide", "investment", "neighborhood", "tips", "news"]
  }).notNull(),
  tags: jsonb("tags").$type<string[]>(),
  status: varchar("status", {
    enum: ["draft", "published", "archived"]
  }).default("draft"),
  publishedAt: timestamp("published_at"),
  views: integer("views").default(0),
  readTime: integer("read_time").default(5),
  seo: jsonb("seo").$type<{
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  }>(),
  isFeatured: boolean("is_featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => {
  return {
    slugIdx: index("idx_blog_posts_slug").on(table.slug),
    categoryStatusIdx: index("idx_blog_posts_category_status").on(table.category, table.status),
    statusFeaturedIdx: index("idx_blog_posts_status_featured").on(table.status, table.isFeatured),
    authorIdx: index("idx_blog_posts_author").on(table.authorId),
  };
});

// Hero slides table
export const heroSlides = pgTable("hero_slides", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 100 }).notNull(),
  subtitle: varchar("subtitle", { length: 200 }),
  description: varchar("description", { length: 500 }),
  image: jsonb("image").$type<{
    url: string;
    alt: string;
  }>().notNull(),
  ctaButton: jsonb("cta_button").$type<{
    text?: string;
    link?: string;
    isExternal?: boolean;
  }>(),
  propertyId: integer("property_id").references(() => properties.id),
  order: integer("order").notNull().default(0),
  isActive: boolean("is_active").default(true),
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => {
  return {
    orderIdx: index("idx_hero_slides_order_active").on(table.order, table.isActive),
    propertyIdx: index("idx_hero_slides_property").on(table.propertyId),
  };
});

// Settings table
export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: jsonb("value").notNull(),
  type: varchar("type", {
    enum: ["string", "number", "boolean", "object", "array"]
  }).notNull(),
  description: text("description"),
  category: varchar("category", {
    enum: ["general", "company", "contact", "social", "seo", "theme", "features"]
  }).notNull(),
  isEditable: boolean("is_editable").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => {
  return {
    keyIdx: index("idx_settings_key").on(table.key),
    categoryIdx: index("idx_settings_category").on(table.category),
  };
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  properties: many(properties),
  blogPosts: many(blogPosts),
  teamMember: many(teamMembers),
}));

export const propertiesRelations = relations(properties, ({ one, many }) => ({
  agent: one(users, {
    fields: [properties.agentId],
    references: [users.id],
  }),
  heroSlides: many(heroSlides),
}));

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  user: one(users, {
    fields: [teamMembers.userId],
    references: [users.id],
  }),
}));

export const blogPostsRelations = relations(blogPosts, ({ one }) => ({
  author: one(users, {
    fields: [blogPosts.authorId],
    references: [users.id],
  }),
}));

export const heroSlidesRelations = relations(heroSlides, ({ one }) => ({
  property: one(properties, {
    fields: [heroSlides.propertyId],
    references: [properties.id],
  }),
}));

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Property = typeof properties.$inferSelect;
export type InsertProperty = typeof properties.$inferInsert;
export type TeamMember = typeof teamMembers.$inferSelect;
export type InsertTeamMember = typeof teamMembers.$inferInsert;
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;
export type HeroSlide = typeof heroSlides.$inferSelect;
export type InsertHeroSlide = typeof heroSlides.$inferInsert;
export type Setting = typeof settings.$inferSelect;
export type InsertSetting = typeof settings.$inferInsert;