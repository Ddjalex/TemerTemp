const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const Setting = require('./models/Setting');

// Database connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/temer-properties';
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

// Create admin user
const createAdminUser = async () => {
  try {
    const existingAdmin = await User.findOne({ role: 'admin' });
    
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
      return existingAdmin;
    }

    const adminUser = new User({
      username: 'admin',
      email: 'admin@temerproperties.com',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      isActive: true
    });

    await adminUser.save();
    console.log('Admin user created successfully!');
    console.log('Email: admin@temerproperties.com');
    console.log('Password: admin123');
    
    return adminUser;
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

// Seed default settings
const seedSettings = async () => {
  try {
    const defaultSettings = [
      // Company settings
      { key: 'company_name', value: 'Temer Properties', type: 'string', category: 'company', description: 'Company name' },
      { key: 'company_tagline', value: 'Your Trusted Real Estate Partner', type: 'string', category: 'company', description: 'Company tagline' },
      { key: 'company_description', value: 'Temer Properties is a leading real estate agency helping clients buy, sell, and rent properties.', type: 'string', category: 'company', description: 'Company description' },
      
      // Contact settings
      { key: 'contact_phone', value: '(555) 123-4567', type: 'string', category: 'contact', description: 'Main phone number' },
      { key: 'contact_email', value: 'info@temerproperties.com', type: 'string', category: 'contact', description: 'Main email address' },
      { key: 'contact_address', value: '123 Real Estate Blvd, City, State 12345', type: 'string', category: 'contact', description: 'Office address' },
      
      // Social media settings
      { key: 'social_facebook', value: 'https://facebook.com/temerproperties', type: 'string', category: 'social', description: 'Facebook page URL' },
      { key: 'social_instagram', value: 'https://instagram.com/temerproperties', type: 'string', category: 'social', description: 'Instagram profile URL' },
      { key: 'social_twitter', value: 'https://twitter.com/temerproperties', type: 'string', category: 'social', description: 'Twitter profile URL' },
      { key: 'social_linkedin', value: 'https://linkedin.com/company/temerproperties', type: 'string', category: 'social', description: 'LinkedIn company URL' },
      
      // General settings
      { key: 'site_currency', value: 'USD', type: 'string', category: 'general', description: 'Default currency' },
      { key: 'properties_per_page', value: 12, type: 'number', category: 'general', description: 'Properties per page' },
      { key: 'blog_posts_per_page', value: 10, type: 'number', category: 'general', description: 'Blog posts per page' }
    ];

    let createdCount = 0;
    for (const setting of defaultSettings) {
      const existing = await Setting.findOne({ key: setting.key });
      if (!existing) {
        await Setting.create(setting);
        createdCount++;
      }
    }

    console.log(`${createdCount} default settings created`);
  } catch (error) {
    console.error('Error seeding settings:', error);
  }
};

// Main seed function
const seed = async () => {
  console.log('🌱 Starting database seeding...');
  
  try {
    await connectDB();
    
    await createAdminUser();
    await seedSettings();
    
    console.log('✅ Database seeding completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Start the server: node app.js');
    console.log('2. Visit: http://localhost:5000/admin');
    console.log('3. Login with admin@temerproperties.com / admin123');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

// Run if called directly
if (require.main === module) {
  seed();
}

module.exports = { seed, createAdminUser, seedSettings };