const express = require('express');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const session = require('express-session');

const app = express();

// Set up middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://fonts.googleapis.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"]
    }
  }
}));

app.use(compression());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'temer-properties-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
  }
}));

// View engine setup for admin dashboard
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'backend/views'));

// Static files for admin dashboard
app.use('/public', express.static(path.join(__dirname, 'backend/public')));

// Serve frontend assets
app.use('/assets', express.static(path.join(__dirname, 'attached_assets')));

async function startServer() {
  try {
    // Connect to MongoDB
    const connectDB = require('./backend/lib/database.js');
    const { createAdminUser } = require('./backend/create-admin.js');
    
    await connectDB();
    console.log('✅ MongoDB connected successfully');
    
    // Create admin user if needed
    try {
      await createAdminUser();
    } catch (error) {
      console.error('Admin user creation:', error.message);
    }

    // Load routes
    const adminRoutes = require('./backend/routes/admin.js');
    const publicRoutes = require('./backend/routes/public.js');

    // Register routes
    app.use('/api', publicRoutes);
    app.use('/admin', adminRoutes);

    // Health check
    app.get('/health', (req, res) => {
      res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
      });
    });

    // Serve static frontend
    app.use(express.static(path.join(__dirname, 'frontend')));
    
    // Catch-all to serve frontend
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'frontend/index.html'));
    });

    // Start server
    const port = parseInt(process.env.PORT || '5000', 10);
    app.listen(port, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${port}`);
      console.log(`📊 Admin: http://localhost:${port}/admin`);
      console.log(`🌐 Frontend: http://localhost:${port}`);
    });

  } catch (error) {
    console.error('❌ Server startup failed:', error);
    process.exit(1);
  }
}

startServer();