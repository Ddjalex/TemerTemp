import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import path from "path";
import { createRequire } from "module";
import session from "express-session";
import helmet from "helmet";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create require function for CommonJS modules
  const require = createRequire(import.meta.url);
  const compression = require("compression");
  const morgan = require("morgan");

  // Configure middleware needed for admin routes
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

  // Session configuration for admin authentication
  app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
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
  app.set('views', path.join(process.cwd(), 'backend/views'));

  // Static files for admin dashboard
  app.use('/public', (req, res, next) => {
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    next();
  }, (req, res, next) => {
    res.sendFile(path.join(process.cwd(), 'backend/public', req.path), (err) => {
      if (err) {
        if ((err as any).code === 'ENOENT') {
          res.status(404).end();
        } else {
          res.status(500).end();
        }
      }
    });
  });

  // Connect to database and create admin user
  const connectDB = require(path.join(process.cwd(), 'backend/lib/database.js'));
  const { createAdminUser } = require(path.join(process.cwd(), 'backend/create-admin.js'));
  
  // Connect to MongoDB Atlas
  await connectDB();
  
  // Create admin user if it doesn't exist
  try {
    await createAdminUser();
  } catch (error) {
    console.error('Failed to create admin user:', error);
  }

  // Load backend routes using require (CommonJS modules)
  const adminRoutes = require(path.join(process.cwd(), 'backend/routes/admin.js'));
  const publicRoutes = require(path.join(process.cwd(), 'backend/routes/public.js'));

  // Register the backend routes
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

  const httpServer = createServer(app);

  return httpServer;
}
