import express from "express";
import { createServer } from "http";
import { createRequire } from "module";
import path from "path";

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
const require = createRequire(import.meta.url);

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
    // Load CommonJS backend modules
    const helmet = require("helmet");
    const compression = require("compression");
    const morgan = require("morgan");
    const session = require("express-session");

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

    // View engine setup
    app.set('view engine', 'ejs');
    app.set('views', path.join(process.cwd(), 'backend/views'));

    // Static files
    app.use('/public', express.static(path.join(process.cwd(), 'backend/public')));

    // Connect to MongoDB and setup backend
    const connectDB = require(path.join(process.cwd(), 'backend/lib/database.cjs'));
    const { createAdminUser } = require(path.join(process.cwd(), 'backend/create-admin.cjs'));
    
    // Connect to MongoDB
    await connectDB();
    console.log('✅ MongoDB connected successfully');
    
    // Create admin user if needed
    try {
      await createAdminUser();
    } catch (error) {
      console.error('Admin user creation:', error);
    }

    // Load backend routes
    const adminRoutes = require(path.join(process.cwd(), 'backend/routes/admin.cjs'));
    const publicRoutes = require(path.join(process.cwd(), 'backend/routes/public.cjs'));

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

    const server = createServer(app);

    // Error handling middleware
    app.use((err, _req, res, _next) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
      throw err;
    });

    // Setup Vite in development or serve static files in production
    if (process.env.NODE_ENV === "development") {
      // Development: Setup Vite middleware using dynamic import
      const { createServer: createViteServer } = await import("vite");
      
      const vite = await createViteServer({
        configFile: path.resolve(process.cwd(), "vite.config.js"),
        server: {
          middlewareMode: true,
          hmr: { server },
          allowedHosts: true,
        },
        appType: "custom",
      });

      app.use(vite.middlewares);
      app.use("*", async (req, res, next) => {
        const url = req.originalUrl;
        try {
          const clientTemplate = path.resolve(process.cwd(), "client", "index.html");
          let template = await require("fs").promises.readFile(clientTemplate, "utf-8");
          const page = await vite.transformIndexHtml(url, template);
          res.status(200).set({ "Content-Type": "text/html" }).end(page);
        } catch (e) {
          vite.ssrFixStacktrace(e as Error);
          next(e);
        }
      });
    } else {
      // Production: Serve static files
      const distPath = path.resolve(process.cwd(), "public");
      app.use(express.static(distPath));
      app.use("*", (_req, res) => {
        res.sendFile(path.resolve(distPath, "index.html"));
      });
    }

    // Start server
    const port = parseInt(process.env.PORT || '5000', 10);
    server.listen({
      port,
      host: "0.0.0.0",
      reusePort: true,
    }, () => {
      log(`serving on port ${port}`);
    });

  } catch (error) {
    console.error('❌ Server startup failed:', error);
    process.exit(1);
  }
}

startServer();