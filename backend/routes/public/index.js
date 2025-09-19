const express = require('express');
const router = express.Router();

// Import route modules
const propertyRoutes = require('./properties.js');
const heroRoutes = require('./hero.js');
const teamRoutes = require('./team.js');
const blogRoutes = require('./blog.js');
const contactRoutes = require('./contact.js');
const settingsRoutes = require('./settings.js');


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