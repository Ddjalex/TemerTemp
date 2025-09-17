const express = require('express');
const router = express.Router();

// Import middleware
const { isAuthenticated, isAdmin, attachUser } = require('../../middleware/auth');

// Import admin route modules
const authRoutes = require('./auth');
const dashboardRoutes = require('./dashboard');
const propertyRoutes = require('./properties');
const heroRoutes = require('./hero');
const teamRoutes = require('./team');
const blogRoutes = require('./blog');
const settingsRoutes = require('./settings');
const userRoutes = require('./users');

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