const express = require('express');
const router = express.Router();
const User = require('../../models/User.cjs');
const { redirectIfAuth, loginRateLimit } = require('../../middleware/auth.cjs');

// Show login page
router.get('/', redirectIfAuth, (req, res) => {
  res.render('admin/auth/login', {
    title: 'Admin Login - Temer Properties',
    error: null,
    username: ''
  });
});

// Handle login form submission
router.post('/', loginRateLimit, async (req, res) => {
  try {
    const { username, password, remember } = req.body;
    
    if (!username || !password) {
      return res.render('admin/auth/login', {
        title: 'Admin Login - Temer Properties',
        error: 'Please provide both username and password',
        username: username || ''
      });
    }

    // Find user by username or email
    const user = await User.findOne({
      $or: [
        { username: username.toLowerCase().trim() },
        { email: username.toLowerCase().trim() }
      ],
      isActive: true
    });

    if (!user) {
      return res.render('admin/auth/login', {
        title: 'Admin Login - Temer Properties',
        error: `The username ${username} is not registered on this site. If you are unsure of your username, try your email address instead.`,
        username: username
      });
    }

    // Check password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.render('admin/auth/login', {
        title: 'Admin Login - Temer Properties',
        error: 'Incorrect password. Please try again.',
        username: username
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Create session
    req.session.user = {
      id: user._id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      avatar: user.avatar
    };

    // Set session expiry
    if (remember === 'on') {
      req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
    } else {
      req.session.cookie.maxAge = 24 * 60 * 60 * 1000; // 24 hours
    }

    // Redirect to dashboard
    res.redirect('/admin/dashboard');

  } catch (error) {
    console.error('Login error:', error);
    res.render('admin/auth/login', {
      title: 'Admin Login - Temer Properties',
      error: 'An error occurred during login. Please try again.',
      username: req.body.username || ''
    });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/admin/login');
  });
});

// Logout via GET (for navigation links)
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/admin/login');
  });
});

module.exports = router;