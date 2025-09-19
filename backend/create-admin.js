const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User.js');

// Create admin user
const createAdminUser = async () => {
  try {
    const existingAdmin = await User.findOne({ 
      $or: [
        { role: 'admin' },
        { email: 'admin@temerproperties.com' },
        { username: 'admin' }
      ]
    });
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists:', existingAdmin.email);
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
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@temerproperties.com');
    console.log('🔐 Password: admin123');
    console.log('🔗 Login URL: /admin/login');
    
    return adminUser;
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    throw error;
  }
};

module.exports = { createAdminUser };