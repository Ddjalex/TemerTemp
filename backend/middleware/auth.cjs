const User = require('../models/User.cjs');

// Check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  
  // For API requests, return JSON error
  if (req.path.startsWith('/api/')) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  // For admin dashboard, redirect to login
  req.session.returnTo = req.originalUrl;
  return res.redirect('/admin/auth/login');
};

// Check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    if (!req.session || !req.session.userId) {
      if (req.path.startsWith('/api/')) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      return res.redirect('/admin/auth/login');
    }

    const user = await User.findById(req.session.userId);
    if (!user || user.role !== 'admin') {
      if (req.path.startsWith('/api/')) {
        return res.status(403).json({ error: 'Admin access required' });
      }
      return res.status(403).render('admin/error', { 
        message: 'Access denied. Admin privileges required.',
        status: 403 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    if (req.path.startsWith('/api/')) {
      return res.status(500).json({ error: 'Authentication error' });
    }
    return res.status(500).render('admin/error', { 
      message: 'Authentication error',
      status: 500 
    });
  }
};

// Check if user is agent or admin
const isAgentOrAdmin = async (req, res, next) => {
  try {
    if (!req.session || !req.session.userId) {
      if (req.path.startsWith('/api/')) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      return res.redirect('/admin/auth/login');
    }

    const user = await User.findById(req.session.userId);
    if (!user || !['admin', 'agent'].includes(user.role)) {
      if (req.path.startsWith('/api/')) {
        return res.status(403).json({ error: 'Agent or admin access required' });
      }
      return res.status(403).render('admin/error', { 
        message: 'Access denied. Agent or admin privileges required.',
        status: 403 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Agent auth error:', error);
    if (req.path.startsWith('/api/')) {
      return res.status(500).json({ error: 'Authentication error' });
    }
    return res.status(500).render('admin/error', { 
      message: 'Authentication error',
      status: 500 
    });
  }
};

// Attach user to request if authenticated (optional auth)
const attachUser = async (req, res, next) => {
  try {
    if (req.session && req.session.userId) {
      const user = await User.findById(req.session.userId);
      if (user) {
        req.user = user;
        res.locals.user = user;
      }
    }
    next();
  } catch (error) {
    console.error('Attach user error:', error);
    next();
  }
};

// Rate limiting middleware (simple implementation)
const rateLimiter = (windowMs = 15 * 60 * 1000, maxRequests = 100) => {
  const requests = new Map();
  
  return (req, res, next) => {
    const clientIP = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    if (!requests.has(clientIP)) {
      requests.set(clientIP, { count: 1, resetTime: now + windowMs });
      return next();
    }
    
    const clientData = requests.get(clientIP);
    
    if (now > clientData.resetTime) {
      requests.set(clientIP, { count: 1, resetTime: now + windowMs });
      return next();
    }
    
    if (clientData.count >= maxRequests) {
      return res.status(429).json({ 
        error: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil((clientData.resetTime - now) / 1000)
      });
    }
    
    clientData.count++;
    next();
  };
};

// Input validation middleware
const validateInput = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      if (req.path.startsWith('/api/')) {
        return res.status(400).json({ error: errorMessage });
      }
      req.flash('error', errorMessage);
      return res.redirect('back');
    }
    next();
  };
};

module.exports = {
  isAuthenticated,
  isAdmin,
  isAgentOrAdmin,
  attachUser,
  rateLimiter,
  validateInput
};