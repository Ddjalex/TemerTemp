const { Pool } = require('pg');
const bcrypt = require('bcrypt');

// Create admin user with PostgreSQL
const createAdminUser = async () => {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL not set');
    }

    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    });

    // First, create the users table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        role VARCHAR(20) DEFAULT 'admin',
        is_active BOOLEAN DEFAULT true,
        last_login TIMESTAMP,
        avatar VARCHAR(500),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Check if admin user already exists
    const existingAdmin = await pool.query(`
      SELECT * FROM users 
      WHERE role = 'admin' OR email = 'admin@temerproperties.com' OR username = 'admin'
      LIMIT 1
    `);
    
    if (existingAdmin.rows.length > 0) {
      console.log('✅ Admin user already exists:', existingAdmin.rows[0].email);
      await pool.end();
      return existingAdmin.rows[0];
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    // Create admin user
    const result = await pool.query(`
      INSERT INTO users (username, email, password, first_name, last_name, role, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, ['admin', 'admin@temerproperties.com', hashedPassword, 'Admin', 'User', 'admin', true]);

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@temerproperties.com');
    console.log('🔐 Password: admin123');
    console.log('🔗 Login URL: /admin/login');
    
    await pool.end();
    return result.rows[0];
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    throw error;
  }
};

module.exports = { createAdminUser };