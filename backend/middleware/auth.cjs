// Authentication middleware for admin routes
const requireAuth = (req, res, next) => {
  if (!req.session || !req.session.user) {
    if (req.xhr || req.headers.accept?.indexOf('json') > -1) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    return res.redirect('/admin/login');
  }
  next();
};

// Check if user is admin
const requireAdmin = (req, res, next) => {
  if (!req.session?.user || req.session.user.role !== 'admin') {
    if (req.xhr || req.headers.accept?.indexOf('json') > -1) {
      return res.status(403).json({ message: 'Admin access required' });
    }
    return res.redirect('/admin/login');
  }
  next();
};

// Redirect to dashboard if already logged in
const redirectIfAuth = (req, res, next) => {
  if (req.session?.user) {
    return res.redirect('/admin/dashboard');
  }
  next();
};

// Simple rate limiting function
const createRateLimiter = (windowMs, max) => {
  const requests = new Map();
  
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowStart = now - windowMs;
    
    if (!requests.has(ip)) {
      requests.set(ip, []);
    }
    
    const userRequests = requests.get(ip);
    const validRequests = userRequests.filter(time => time > windowStart);
    
    if (validRequests.length >= max) {
      return res.status(429).json({ 
        message: 'Too many requests, please try again later.' 
      });
    }
    
    validRequests.push(now);
    requests.set(ip, validRequests);
    
    // Cleanup old entries periodically
    if (Math.random() < 0.01) {
      for (const [key, timestamps] of requests.entries()) {
        const validTimestamps = timestamps.filter(time => time > windowStart);
        if (validTimestamps.length === 0) {
          requests.delete(key);
        } else {
          requests.set(key, validTimestamps);
        }
      }
    }
    
    next();
  };
};

// Rate limiters
const rateLimiter = createRateLimiter;
const loginRateLimit = createRateLimiter(15 * 60 * 1000, 5); // 5 attempts per 15 minutes

module.exports = {
  requireAuth,
  requireAdmin,
  redirectIfAuth,
  rateLimiter,
  loginRateLimit
};