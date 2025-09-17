import { users, properties, blogPosts, heroSlides, teamMembers, settings, type User, type InsertUser, type Property, type InsertProperty, type BlogPost, type InsertBlogPost, type HeroSlide, type InsertHeroSlide, type TeamMember, type InsertTeamMember, type Setting, type InsertSetting } from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc, ilike, sql, count } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(insertUser: InsertUser): Promise<User>;
  updateUser(id: number, updateData: Partial<User>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
  getAllUsers(): Promise<User[]>;
  
  // Property operations
  getProperty(id: number): Promise<Property | undefined>;
  getProperties(filters?: any): Promise<Property[]>;
  createProperty(insertProperty: InsertProperty): Promise<Property>;
  updateProperty(id: number, updateData: Partial<Property>): Promise<Property | undefined>;
  deleteProperty(id: number): Promise<boolean>;
  
  // Blog post operations
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  getBlogPosts(filters?: any): Promise<BlogPost[]>;
  createBlogPost(insertBlogPost: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, updateData: Partial<BlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<boolean>;
  
  // Hero slide operations
  getHeroSlides(): Promise<HeroSlide[]>;
  createHeroSlide(insertHeroSlide: InsertHeroSlide): Promise<HeroSlide>;
  updateHeroSlide(id: number, updateData: Partial<HeroSlide>): Promise<HeroSlide | undefined>;
  deleteHeroSlide(id: number): Promise<boolean>;
  
  // Team member operations
  getTeamMembers(): Promise<TeamMember[]>;
  createTeamMember(insertTeamMember: InsertTeamMember): Promise<TeamMember>;
  updateTeamMember(id: number, updateData: Partial<TeamMember>): Promise<TeamMember | undefined>;
  deleteTeamMember(id: number): Promise<boolean>;
  
  // Settings operations
  getSetting(key: string): Promise<Setting | undefined>;
  getSettingsByCategory(category: string): Promise<Setting[]>;
  setSetting(key: string, value: any, type: string, description?: string, category?: string): Promise<Setting>;
  deleteSetting(key: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        updatedAt: new Date()
      })
      .returning();
    return user;
  }

  async updateUser(id: number, updateData: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({
        ...updateData,
        updatedAt: new Date()
      })
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return result.rowCount > 0;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(asc(users.createdAt));
  }

  // Property operations
  async getProperty(id: number): Promise<Property | undefined> {
    const [property] = await db.select().from(properties).where(eq(properties.id, id));
    return property || undefined;
  }

  async getProperties(filters: any = {}): Promise<Property[]> {
    let query = db.select().from(properties);
    
    const conditions = [];
    if (filters.status) {
      conditions.push(eq(properties.status, filters.status));
    }
    if (filters.propertyType) {
      conditions.push(eq(properties.propertyType, filters.propertyType));
    }
    if (filters.agentId) {
      conditions.push(eq(properties.agentId, filters.agentId));
    }
    if (filters.isActive !== undefined) {
      conditions.push(eq(properties.isActive, filters.isActive));
    }
    if (filters.isFeatured !== undefined) {
      conditions.push(eq(properties.isFeatured, filters.isFeatured));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return await query.orderBy(desc(properties.createdAt));
  }

  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const [property] = await db
      .insert(properties)
      .values({
        ...insertProperty,
        updatedAt: new Date()
      })
      .returning();
    return property;
  }

  async updateProperty(id: number, updateData: Partial<Property>): Promise<Property | undefined> {
    const [property] = await db
      .update(properties)
      .set({
        ...updateData,
        updatedAt: new Date()
      })
      .where(eq(properties.id, id))
      .returning();
    return property || undefined;
  }

  async deleteProperty(id: number): Promise<boolean> {
    const result = await db.delete(properties).where(eq(properties.id, id));
    return result.rowCount > 0;
  }

  // Blog post operations
  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post || undefined;
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post || undefined;
  }

  async getBlogPosts(filters: any = {}): Promise<BlogPost[]> {
    let query = db.select().from(blogPosts);
    
    const conditions = [];
    if (filters.status) {
      conditions.push(eq(blogPosts.status, filters.status));
    }
    if (filters.category) {
      conditions.push(eq(blogPosts.category, filters.category));
    }
    if (filters.authorId) {
      conditions.push(eq(blogPosts.authorId, filters.authorId));
    }
    if (filters.isFeatured !== undefined) {
      conditions.push(eq(blogPosts.isFeatured, filters.isFeatured));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return await query.orderBy(desc(blogPosts.publishedAt));
  }

  async createBlogPost(insertBlogPost: InsertBlogPost): Promise<BlogPost> {
    const [post] = await db
      .insert(blogPosts)
      .values({
        ...insertBlogPost,
        updatedAt: new Date()
      })
      .returning();
    return post;
  }

  async updateBlogPost(id: number, updateData: Partial<BlogPost>): Promise<BlogPost | undefined> {
    const [post] = await db
      .update(blogPosts)
      .set({
        ...updateData,
        updatedAt: new Date()
      })
      .where(eq(blogPosts.id, id))
      .returning();
    return post || undefined;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    const result = await db.delete(blogPosts).where(eq(blogPosts.id, id));
    return result.rowCount > 0;
  }

  // Hero slide operations
  async getHeroSlides(): Promise<HeroSlide[]> {
    return await db.select().from(heroSlides)
      .where(eq(heroSlides.isActive, true))
      .orderBy(asc(heroSlides.order));
  }

  async createHeroSlide(insertHeroSlide: InsertHeroSlide): Promise<HeroSlide> {
    const [slide] = await db
      .insert(heroSlides)
      .values({
        ...insertHeroSlide,
        updatedAt: new Date()
      })
      .returning();
    return slide;
  }

  async updateHeroSlide(id: number, updateData: Partial<HeroSlide>): Promise<HeroSlide | undefined> {
    const [slide] = await db
      .update(heroSlides)
      .set({
        ...updateData,
        updatedAt: new Date()
      })
      .where(eq(heroSlides.id, id))
      .returning();
    return slide || undefined;
  }

  async deleteHeroSlide(id: number): Promise<boolean> {
    const result = await db.delete(heroSlides).where(eq(heroSlides.id, id));
    return result.rowCount > 0;
  }

  // Team member operations
  async getTeamMembers(): Promise<TeamMember[]> {
    return await db.select().from(teamMembers)
      .where(eq(teamMembers.isActive, true))
      .orderBy(asc(teamMembers.order));
  }

  async createTeamMember(insertTeamMember: InsertTeamMember): Promise<TeamMember> {
    const [member] = await db
      .insert(teamMembers)
      .values({
        ...insertTeamMember,
        updatedAt: new Date()
      })
      .returning();
    return member;
  }

  async updateTeamMember(id: number, updateData: Partial<TeamMember>): Promise<TeamMember | undefined> {
    const [member] = await db
      .update(teamMembers)
      .set({
        ...updateData,
        updatedAt: new Date()
      })
      .where(eq(teamMembers.id, id))
      .returning();
    return member || undefined;
  }

  async deleteTeamMember(id: number): Promise<boolean> {
    const result = await db.delete(teamMembers).where(eq(teamMembers.id, id));
    return result.rowCount > 0;
  }

  // Settings operations
  async getSetting(key: string): Promise<Setting | undefined> {
    const [setting] = await db.select().from(settings).where(eq(settings.key, key));
    return setting || undefined;
  }

  async getSettingsByCategory(category: string): Promise<Setting[]> {
    return await db.select().from(settings).where(eq(settings.category, category));
  }

  async setSetting(key: string, value: any, type: string = 'string', description?: string, category: string = 'general'): Promise<Setting> {
    const [setting] = await db
      .insert(settings)
      .values({
        key,
        value,
        type,
        description,
        category,
        updatedAt: new Date()
      })
      .onConflictDoUpdate({
        target: settings.key,
        set: {
          value,
          type,
          description,
          category,
          updatedAt: new Date()
        }
      })
      .returning();
    return setting;
  }

  async deleteSetting(key: string): Promise<boolean> {
    const result = await db.delete(settings).where(eq(settings.key, key));
    return result.rowCount > 0;
  }
}

export const storage = new DatabaseStorage();