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

  // Initialize database storage and create admin user if needed
  const { storage } = await import("./storage.js");
  
  // Create admin user if it doesn't exist
  try {
    const existingAdmin = await storage.getUserByUsername('admin');
    if (!existingAdmin) {
      console.log('Creating default admin user...');
      await storage.createUser({
        username: 'admin',
        email: 'admin@temerproperties.com',
        password: 'admin123', // Note: In production, this should be hashed
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        isActive: true
      });
      console.log('Admin user created successfully!');
      console.log('Email: admin@temerproperties.com');
      console.log('Password: admin123');
    }
  } catch (error) {
    console.error('Failed to create admin user:', error);
  }

  // Use the new PostgreSQL-based API routes
  const apiRoutes = await import("./api.js");
  app.use('/api', apiRoutes.default);

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
