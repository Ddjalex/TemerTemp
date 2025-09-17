const express = require('express');
const router = express.Router();

// Import route modules
const propertyRoutes = require('./properties.cjs');
const heroRoutes = require('./hero.cjs');
const teamRoutes = require('./team.cjs');
const blogRoutes = require('./blog.cjs');
const contactRoutes = require('./contact.cjs');
const settingsRoutes = require('./settings.cjs');

// Import middleware
const { rateLimiter } = require('../../middleware/auth.cjs');

// Apply rate limiting to all public API routes
router.use(rateLimiter(15 * 60 * 1000, 100)); // 100 requests per 15 minutes

// Mount routes
router.use('/properties', propertyRoutes);
router.use('/hero', heroRoutes);
router.use('/team', teamRoutes);
router.use('/blog', blogRoutes);
router.use('/contact', contactRoutes);
router.use('/settings', settingsRoutes);

// Health check for API
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Temer Properties Public API',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

module.exports = router;