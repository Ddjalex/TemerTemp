import { pgTable, serial, varchar, text, integer, boolean, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  firstName: varchar("first_name", { length: 50 }).notNull(),
  lastName: varchar("last_name", { length: 50 }).notNull(),
  role: varchar("role", { length: 20 }).notNull().default("user"), // admin, agent, user
  isActive: boolean("is_active").default(true),
  lastLogin: timestamp("last_login"),
  avatar: varchar("avatar", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Properties table
export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  propertyType: varchar("property_type", { length: 50 }).notNull(), // house, apartment, condo, etc.
  status: varchar("status", { length: 20 }).notNull().default("for-sale"), // for-sale, for-rent, sold, etc.
  address: jsonb("address").notNull(), // { street, city, state, zipCode, country }
  coordinates: jsonb("coordinates"), // { latitude, longitude }
  features: jsonb("features").notNull(), // { bedrooms, bathrooms, sqft, lotSize, yearBuilt, garage, stories }
  amenities: jsonb("amenities"), // string array
  images: jsonb("images"), // array of { url, alt, isPrimary }
  agentId: integer("agent_id").notNull().references(() => users.id),
  isActive: boolean("is_active").default(true),
  isFeatured: boolean("is_featured").default(false),
  views: integer("views").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Blog posts table
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: varchar("excerpt", { length: 300 }).notNull(),
  content: text("content").notNull(),
  featuredImage: jsonb("featured_image").notNull(), // { url, alt }
  authorId: integer("author_id").notNull().references(() => users.id),
  category: varchar("category", { length: 50 }).notNull(),
  tags: jsonb("tags"), // string array
  status: varchar("status", { length: 20 }).default("draft"), // draft, published, archived
  publishedAt: timestamp("published_at"),
  views: integer("views").default(0),
  readTime: integer("read_time").default(5), // in minutes
  seo: jsonb("seo"), // { metaTitle, metaDescription, keywords }
  isFeatured: boolean("is_featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Hero slides table
export const heroSlides = pgTable("hero_slides", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 100 }).notNull(),
  subtitle: varchar("subtitle", { length: 200 }),
  description: varchar("description", { length: 500 }),
  image: jsonb("image").notNull(), // { url, alt }
  ctaButton: jsonb("cta_button"), // { text, link, isExternal }
  propertyId: integer("property_id").references(() => properties.id),
  order: integer("order").notNull().default(0),
  isActive: boolean("is_active").default(true),
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Team members table
export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name", { length: 50 }).notNull(),
  lastName: varchar("last_name", { length: 50 }).notNull(),
  position: varchar("position", { length: 100 }).notNull(),
  bio: text("bio").notNull(),
  photo: jsonb("photo").notNull(), // { url, alt }
  contact: jsonb("contact").notNull(), // { email, phone, whatsapp }
  socialMedia: jsonb("social_media"), // { linkedin, twitter, facebook, instagram }
  specialties: jsonb("specialties"), // string array
  languages: jsonb("languages"), // string array
  experience: jsonb("experience"), // { yearsInBusiness, propertiesSold, totalSalesVolume }
  certifications: jsonb("certifications"), // array of { name, issuingOrganization, year }
  userId: integer("user_id").references(() => users.id),
  isActive: boolean("is_active").default(true),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Settings table
export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: jsonb("value").notNull(),
  type: varchar("type", { length: 20 }).notNull(), // string, number, boolean, object, array
  description: text("description"),
  category: varchar("category", { length: 50 }).notNull(), // general, company, contact, social, seo, theme, features
  isEditable: boolean("is_editable").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Note: Indexes will be created automatically for primary keys and unique constraints

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  properties: many(properties),
  blogPosts: many(blogPosts),
  teamMember: many(teamMembers),
}));

export const propertiesRelations = relations(properties, ({ one }) => ({
  agent: one(users, {
    fields: [properties.agentId],
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

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  user: one(users, {
    fields: [teamMembers.userId],
    references: [users.id],
  }),
}));

// Types
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