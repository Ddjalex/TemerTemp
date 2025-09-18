import { pgTable, serial, varchar, text, integer, decimal, boolean, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Users table - corresponds to User.cjs
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  firstName: varchar("first_name", { length: 50 }).notNull(),
  lastName: varchar("last_name", { length: 50 }).notNull(),
  role: varchar("role", { length: 20 }).default("user").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  lastLogin: timestamp("last_login"),
  avatar: varchar("avatar", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  usernameIdx: index("idx_users_username").on(table.username),
  emailIdx: index("idx_users_email").on(table.email),
  roleIdx: index("idx_users_role").on(table.role),
}));

// Properties table - corresponds to Property.cjs
export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }),
  description: text("description"),
  price: decimal("price", { precision: 12, scale: 2 }),
  propertyType: varchar("property_type", { length: 50 }),
  status: varchar("status", { length: 20 }).default("for-sale").notNull(),
  
  // Address as JSON
  address: jsonb("address").$type<{
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  }>(),
  
  // Coordinates as JSON
  coordinates: jsonb("coordinates").$type<{
    latitude?: number;
    longitude?: number;
  }>(),
  
  // Features as JSON
  features: jsonb("features").$type<{
    bedrooms?: number;
    bathrooms?: number;
    sqft?: number;
    lotSize?: number;
    yearBuilt?: number;
    garage?: number;
    stories?: number;
  }>(),
  
  // Amenities as JSON array
  amenities: jsonb("amenities").$type<string[]>(),
  
  // Images as JSON array
  images: jsonb("images").$type<Array<{
    url: string;
    alt?: string;
    isPrimary?: boolean;
  }>>(),
  
  agentId: integer("agent_id").references(() => users.id),
  isActive: boolean("is_active").default(true).notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  views: integer("views").default(0).notNull(),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  propertyTypeStatusIdx: index("idx_properties_type_status").on(table.propertyType, table.status),
  priceIdx: index("idx_properties_price").on(table.price),
  activeFeatureIdx: index("idx_properties_active_featured").on(table.isActive, table.isFeatured),
  agentIdx: index("idx_properties_agent").on(table.agentId),
}));

// Blog posts table - corresponds to BlogPost.cjs
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 250 }).notNull().unique(),
  excerpt: varchar("excerpt", { length: 300 }).notNull(),
  content: text("content").notNull(),
  
  // Featured image as JSON
  featuredImage: jsonb("featured_image").$type<{
    url: string;
    alt: string;
  }>().notNull(),
  
  authorId: integer("author_id").references(() => users.id).notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  tags: jsonb("tags").$type<string[]>(),
  status: varchar("status", { length: 20 }).default("draft").notNull(),
  publishedAt: timestamp("published_at"),
  views: integer("views").default(0).notNull(),
  readTime: integer("read_time").default(5).notNull(),
  
  // SEO as JSON
  seo: jsonb("seo").$type<{
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  }>(),
  
  isFeatured: boolean("is_featured").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  slugIdx: index("idx_blog_posts_slug").on(table.slug),
  categoryStatusIdx: index("idx_blog_posts_category_status").on(table.category, table.status),
  statusFeaturedIdx: index("idx_blog_posts_status_featured").on(table.status, table.isFeatured),
  publishedIdx: index("idx_blog_posts_published").on(table.publishedAt),
  authorIdx: index("idx_blog_posts_author").on(table.authorId),
}));

// Hero slides table - corresponds to HeroSlide.cjs
export const heroSlides = pgTable("hero_slides", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 100 }).notNull(),
  subtitle: varchar("subtitle", { length: 200 }),
  description: varchar("description", { length: 500 }),
  
  // Image as JSON
  image: jsonb("image").$type<{
    url: string;
    alt: string;
  }>().notNull(),
  
  // CTA button as JSON
  ctaButton: jsonb("cta_button").$type<{
    text?: string;
    link?: string;
    isExternal?: boolean;
  }>(),
  
  propertyId: integer("property_id").references(() => properties.id),
  order: integer("order").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  startDate: timestamp("start_date").defaultNow().notNull(),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  orderActiveIdx: index("idx_hero_slides_order_active").on(table.order, table.isActive),
  propertyIdx: index("idx_hero_slides_property").on(table.propertyId),
}));

// Team members table - corresponds to TeamMember.cjs
export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name", { length: 50 }).notNull(),
  lastName: varchar("last_name", { length: 50 }).notNull(),
  position: varchar("position", { length: 100 }).notNull(),
  bio: text("bio").notNull(),
  
  // Photo as JSON
  photo: jsonb("photo").$type<{
    url: string;
    alt?: string;
  }>().notNull(),
  
  // Contact as JSON
  contact: jsonb("contact").$type<{
    email: string;
    phone: string;
    whatsapp?: string;
  }>().notNull(),
  
  // Social media as JSON
  socialMedia: jsonb("social_media").$type<{
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  }>(),
  
  specialties: jsonb("specialties").$type<string[]>(),
  languages: jsonb("languages").$type<string[]>(),
  
  // Experience as JSON
  experience: jsonb("experience").$type<{
    yearsInBusiness?: number;
    propertiesSold?: number;
    totalSalesVolume?: number;
  }>(),
  
  // Certifications as JSON
  certifications: jsonb("certifications").$type<Array<{
    name: string;
    issuingOrganization?: string;
    year?: number;
  }>>(),
  
  userId: integer("user_id").references(() => users.id),
  isActive: boolean("is_active").default(true).notNull(),
  order: integer("order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  orderActiveIdx: index("idx_team_members_order_active").on(table.order, table.isActive),
  userIdx: index("idx_team_members_user").on(table.userId),
}));

// Settings table - corresponds to Setting.cjs
export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: jsonb("value").notNull(),
  type: varchar("type", { length: 20 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 50 }).notNull(),
  isEditable: boolean("is_editable").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  keyIdx: index("idx_settings_key").on(table.key),
  categoryIdx: index("idx_settings_category").on(table.category),
}));

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  properties: many(properties),
  blogPosts: many(blogPosts),
  teamMembers: many(teamMembers),
}));

export const propertiesRelations = relations(properties, ({ one, many }) => ({
  agent: one(users, {
    fields: [properties.agentId],
    references: [users.id],
  }),
  heroSlides: many(heroSlides),
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

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  user: one(users, {
    fields: [teamMembers.userId],
    references: [users.id],
  }),
}));

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Property = typeof properties.$inferSelect;
export type InsertProperty = typeof properties.$inferInsert;
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;
export type HeroSlide = typeof heroSlides.$inferSelect;
export type InsertHeroSlide = typeof heroSlides.$inferInsert;
export type TeamMember = typeof teamMembers.$inferSelect;
export type InsertTeamMember = typeof teamMembers.$inferInsert;
export type Setting = typeof settings.$inferSelect;
export type InsertSetting = typeof settings.$inferInsert;