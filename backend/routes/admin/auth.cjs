const express = require('express');
const router = express.Router();
const User = require('../../models/User.cjs');
const { isValidEmail, sendError } = require('../../lib/utils.cjs');

// GET login page
router.get('/login', (req, res) => {
  // If already authenticated, redirect to dashboard
  if (req.session && req.session.userId) {
    return res.redirect('/admin/dashboard');
  }

  res.render('admin/auth/login', {
    title: 'Admin Login - Temer Properties',
    error: req.query.error || null,
    returnTo: req.session.returnTo || '/admin/dashboard'
  });
});

// POST login
router.post('/login', async (req, res) => {
  try {
    const { email, password, returnTo } = req.body;

    // Validation
    if (!email || !isValidEmail(email)) {
      return res.render('admin/auth/login', {
        title: 'Admin Login - Temer Properties',
        error: 'Please provide a valid email address',
        returnTo: returnTo || '/admin/dashboard'
      });
    }

    if (!password || password.length < 6) {
      return res.render('admin/auth/login', {
        title: 'Admin Login - Temer Properties',
        error: 'Password must be at least 6 characters',
        returnTo: returnTo || '/admin/dashboard'
      });
    }

    // Find user
    const user = await User.findOne({ 
      email: email.toLowerCase().trim(),
      isActive: true
    });

    if (!user) {
      return res.render('admin/auth/login', {
        title: 'Admin Login - Temer Properties',
        error: 'Invalid email or password',
        returnTo: returnTo || '/admin/dashboard'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.render('admin/auth/login', {
        title: 'Admin Login - Temer Properties',
        error: 'Invalid email or password',
        returnTo: returnTo || '/admin/dashboard'
      });
    }

    // Check if user has admin privileges
    if (user.role !== 'admin') {
      return res.render('admin/auth/login', {
        title: 'Admin Login - Temer Properties',
        error: 'Access denied. Admin privileges required.',
        returnTo: returnTo || '/admin/dashboard'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Create session
    req.session.userId = user._id;
    req.session.userRole = user.role;

    // Clear return URL from session
    const redirectUrl = req.session.returnTo || returnTo || '/admin/dashboard';
    delete req.session.returnTo;

    res.redirect(redirectUrl);
  } catch (error) {
    console.error('Login error:', error);
    res.render('admin/auth/login', {
      title: 'Admin Login - Temer Properties',
      error: 'An error occurred during login. Please try again.',
      returnTo: req.body.returnTo || '/admin/dashboard'
    });
  }
});

// GET logout
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/admin/auth/login?message=logged-out');
  });
});

// POST logout (for AJAX requests)
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

module.exports = router;