// Load environment variables first
require('dotenv').config();

const express = require('express');
const { createServer } = require('http');
const path = require('path');

// Utility functions
function log(message, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit", 
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const requestPath = req.path;
  let capturedJsonResponse = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (requestPath.startsWith("/api")) {
      let logLine = `${req.method} ${requestPath} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

async function startServer() {
  try {
    // Load required modules
    const helmet = require("helmet");
    const compression = require("compression");
    const morgan = require("morgan");
    const session = require("express-session");
    const MongoStore = require('connect-mongo');

    // Configure middleware
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

    // Session configuration with MongoDB store
    app.use(session({
      secret: process.env.SESSION_SECRET || 'temer-properties-secret-key',
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: 'mongodb+srv://wondimualmeseged_db_user:A1l2m3e4s5@cluster0.dtusgpq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
      }),
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
      }
    }));

    // View engine setup
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, 'backend/views'));

    // Connect to MongoDB first
    const connectDB = require('./backend/lib/database.cjs');
    await connectDB();
    console.log('✅ MongoDB connected successfully');





    // Create admin user if needed
    try {
      const { createAdminUser } = require('./backend/create-admin.cjs');
      await createAdminUser();
    } catch (error) {
      console.error('Admin user creation:', error);
    }

    // Load backend routes
    const adminRoutes = require('./backend/routes/admin.cjs');
    const publicRoutes = require('./backend/routes/public.cjs');

    // Serve uploaded files
    app.use('/uploads', express.static(path.join(__dirname, 'backend/uploads')));

    // Register routes
    app.use('/api', publicRoutes);
    app.use('/admin', adminRoutes);

    // Health check endpoint
    app.get('/health', (req, res) => {
      res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
      });
    });

    // Error handling middleware
    app.use((err, req, res, next) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      console.error('Error:', err);
      res.status(status).json({ message });
    });

    // Serve static React app files
    const reactAppPath = path.join(__dirname, 'dist/public');
    app.use(express.static(reactAppPath));
    app.use("*", (req, res) => {
      // Skip if it's an API or admin route (already handled above)
      if (req.originalUrl.startsWith('/admin') || req.originalUrl.startsWith('/api') || req.originalUrl.startsWith('/health')) {
        return res.status(404).json({ message: 'Route not found' });
      }
      // Serve the React app for all other routes (SPA routing)
      res.sendFile(path.join(reactAppPath, 'index.html'));
    });

    // Start server
    const port = parseInt(process.env.PORT || '5000', 10);
    const server = createServer(app);
    
    server.listen(port, "0.0.0.0", () => {
      log(`serving on port ${port}`);
      console.log('🚀 Server is running on port', port);
    });

  } catch (error) {
    console.error('❌ Server startup failed:', error);
    process.exit(1);
  }
}

startServer();