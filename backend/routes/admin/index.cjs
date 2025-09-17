const express = require('express');
const router = express.Router();

// Import middleware
const { isAuthenticated, isAdmin, attachUser } = require('../../middleware/auth.cjs');

// Import admin route modules
const authRoutes = require('./auth.cjs');
const dashboardRoutes = require('./dashboard.cjs');
const propertyRoutes = require('./properties.cjs');
const heroRoutes = require('./hero.cjs');
const teamRoutes = require('./team.cjs');
const blogRoutes = require('./blog.cjs');
const settingsRoutes = require('./settings.cjs');
const userRoutes = require('./users.cjs');

// Attach user to all admin routes for nav/layout purposes
router.use(attachUser);

// Auth routes (login, logout) - no auth required
router.use('/auth', authRoutes);

// Redirect root /admin to /admin/dashboard
router.get('/', (req, res) => {
  res.redirect('/admin/dashboard');
});

// Protected admin routes - require authentication and admin role
router.use('/dashboard', isAdmin, dashboardRoutes);
router.use('/properties', isAdmin, propertyRoutes);
router.use('/hero', isAdmin, heroRoutes);
router.use('/team', isAdmin, teamRoutes);
router.use('/blog', isAdmin, blogRoutes);
router.use('/settings', isAdmin, settingsRoutes);
router.use('/users', isAdmin, userRoutes);

// Legacy routes for login/logout (redirect to new auth routes)
router.get('/login', (req, res) => res.redirect('/admin/auth/login'));
router.post('/login', (req, res) => res.redirect('/admin/auth/login'));
router.get('/logout', (req, res) => res.redirect('/admin/auth/logout'));

module.exports = router;