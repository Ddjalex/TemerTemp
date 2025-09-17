import { randomUUID } from "crypto";

/**
 * Simple in-memory storage implementation for development
 * Note: For production, use the MongoDB models in backend/models/
 */

export class MemStorage {
  constructor() {
    this.users = new Map();
  }

  async getUser(id) {
    return this.users.get(id);
  }

  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser) {
    const id = randomUUID();
    const user = { 
      ...insertUser, 
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: insertUser.isActive !== undefined ? insertUser.isActive : true
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id, updateData) {
    const existingUser = this.users.get(id);
    if (!existingUser) {
      return undefined;
    }
    
    const updatedUser = {
      ...existingUser,
      ...updateData,
      updatedAt: new Date()
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id) {
    return this.users.delete(id);
  }

  async getAllUsers() {
    return Array.from(this.users.values());
  }
}

export const storage = new MemStorage();
