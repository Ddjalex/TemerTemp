const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    let mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      throw new Error('MONGODB_URI environment variable is required');
    }
    
    console.log('🔗 Connecting to MongoDB Atlas...');
    
    const options = {
      maxPoolSize: 15, // Increase pool size for better concurrent admin operations
      minPoolSize: 5, // Maintain minimum connections for faster response
      serverSelectionTimeoutMS: 8000, // Faster server selection for admin operations
      socketTimeoutMS: 30000, // Reduce socket timeout for quicker error detection
      connectTimeoutMS: 10000, // Connection timeout for faster failures
      maxIdleTimeMS: 30000, // Close idle connections faster
      family: 4, // Use IPv4, skip trying IPv6
      retryWrites: true,
      w: 'majority',
      readPreference: 'primary', // Ensure consistent reads for admin operations
      readConcern: { level: 'local' } // Faster reads for admin operations
    };

    const conn = await mongoose.connect(mongoURI, options);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
    
    // Connection event listeners
    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected to MongoDB');
    });
    
    mongoose.connection.on('error', (err) => {
      console.error('Mongoose connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose disconnected from MongoDB');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });

    return conn;
  } catch (error) {
    console.error('Database connection failed:', error);
    
    // Retry connection after 5 seconds
    console.log('Retrying database connection in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

module.exports = connectDB;