const express = require('express');
const router = express.Router();
const { requireAuth, requireAdmin, redirectIfAuth } = require('../middleware/auth.cjs');

// Import admin route modules
const authRoutes = require('./admin/auth.cjs');
const dashboardRoutes = require('./admin/dashboard.cjs');
const propertiesRoutes = require('./admin/properties.cjs');
const settingsRoutes = require('./admin/settings.cjs');
const blogRoutes = require('./admin/blog.cjs');
const heroRoutes = require('./admin/hero.cjs');
const teamRoutes = require('./admin/team.cjs');

// Public admin routes (login, etc.)
router.use('/login', authRoutes);

// Protected admin routes - require authentication
router.use(requireAuth);
router.use('/dashboard', dashboardRoutes);
router.use('/properties', propertiesRoutes);
router.use('/settings', settingsRoutes);
router.use('/blog', blogRoutes);
router.use('/hero', heroRoutes);
router.use('/team', teamRoutes);

// Default admin route redirects to dashboard
router.get('/', (req, res) => {
  res.redirect('/admin/dashboard');
});

module.exports = router;