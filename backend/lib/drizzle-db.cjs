const { Pool } = require('pg');
const { drizzle } = require('drizzle-orm/node-postgres');

// Import the schema (we'll convert this to use the compiled version)
let schema;
try {
  // Try to import the compiled JavaScript schema if available
  schema = require('../../shared/schema.js');
} catch (e) {
  // Fallback - this will need to be set up properly
  console.warn('Schema not available as CommonJS, database operations may not work correctly');
  schema = {};
}

let pool = null;
let db = null;

const initializeDb = () => {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });
    
    db = drizzle(pool, { schema });
  }
  return db;
};

const getDb = () => {
  if (!db) {
    return initializeDb();
  }
  return db;
};

const getPool = () => pool;

module.exports = { 
  initializeDb, 
  getDb, 
  getPool,
  // Export table references if schema is available
  ...(schema.users && { users: schema.users }),
  ...(schema.properties && { properties: schema.properties }),
  ...(schema.teamMembers && { teamMembers: schema.teamMembers }),
  ...(schema.blogPosts && { blogPosts: schema.blogPosts }),
  ...(schema.heroSlides && { heroSlides: schema.heroSlides }),
  ...(schema.settings && { settings: schema.settings })
};