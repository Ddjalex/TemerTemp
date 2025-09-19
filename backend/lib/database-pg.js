const { Pool } = require('pg');

let pool = null;

const connectDB = async () => {
  try {
    if (!process.env.DATABASE_URL) {
      console.error('❌ DATABASE_URL is not set. Make sure PostgreSQL database is provisioned.');
      throw new Error('DATABASE_URL is not set');
    }
    
    // Create connection pool
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });
    
    // Test the connection
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    
    console.log('✅ PostgreSQL Connected Successfully');
    console.log(`Database: ${process.env.PGDATABASE || 'Unknown'}`);
    
    // Connection event listeners
    pool.on('connect', () => {
      console.log('PostgreSQL client connected');
    });
    
    pool.on('error', (err) => {
      console.error('PostgreSQL connection error:', err);
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      console.log('Closing PostgreSQL connection pool...');
      await pool.end();
      console.log('PostgreSQL connection closed through app termination');
      process.exit(0);
    });

    return pool;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
};

const getPool = () => {
  if (!pool) {
    throw new Error('Database pool not initialized. Call connectDB() first.');
  }
  return pool;
};

module.exports = { connectDB, getPool };