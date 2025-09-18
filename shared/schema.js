import { pgTable, serial, varchar, text, integer, boolean, timestamp, decimal, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Users table (for admin authentication)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  role: varchar("role", { length: 50 }).default("admin"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Properties table
export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }),
  description: text("description"),
  price: decimal("price", { precision: 12, scale: 2 }),
  propertyType: varchar("property_type", { length: 50 }),
  status: varchar("status", { length: 50 }).default("for-sale"),
  
  // Address as separate columns
  street: varchar("street", { length: 255 }),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 100 }),
  zipCode: varchar("zip_code", { length: 20 }),
  country: varchar("country", { length: 100 }).default("USA"),
  
  // Coordinates
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  
  // Property features
  bedrooms: integer("bedrooms"),
  bathrooms: decimal("bathrooms", { precision: 3, scale: 1 }),
  sqft: integer("sqft"),
  lotSize: decimal("lot_size", { precision: 10, scale: 2 }),
  yearBuilt: integer("year_built"),
  garage: integer("garage").default(0),
  stories: integer("stories").default(1),
  
  // Additional features
  amenities: jsonb("amenities"),
  images: jsonb("images"),
  
  // Meta fields
  agentId: integer("agent_id"),
  isActive: boolean("is_active").default(true),
  isFeatured: boolean("is_featured").default(false),
  views: integer("views").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Team Members table
export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  position: varchar("position", { length: 100 }),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  bio: text("bio"),
  specialties: jsonb("specialties"),
  image: varchar("image", { length: 500 }),
  socialMedia: jsonb("social_media"),
  isActive: boolean("is_active").default(true),
  displayOrder: integer("display_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Blog Posts table
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content"),
  featuredImage: varchar("featured_image", { length: 500 }),
  authorId: integer("author_id"),
  tags: jsonb("tags"),
  isPublished: boolean("is_published").default(false),
  publishedAt: timestamp("published_at"),
  views: integer("views").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Hero Slides table
export const heroSlides = pgTable("hero_slides", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }),
  subtitle: varchar("subtitle", { length: 300 }),
  description: text("description"),
  image: varchar("image", { length: 500 }),
  buttonText: varchar("button_text", { length: 100 }),
  buttonLink: varchar("button_link", { length: 500 }),
  isActive: boolean("is_active").default(true),
  displayOrder: integer("display_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Settings table
export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: text("value"),
  type: varchar("type", { length: 50 }).default("text"), // text, number, boolean, json
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  properties: many(properties),
  blogPosts: many(blogPosts),
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