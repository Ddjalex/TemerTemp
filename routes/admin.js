const express = require('express');
const router = express.Router();

// Import admin route modules
const adminRoutes = require('./admin/index');

// Mount all admin routes
router.use('/', adminRoutes);

module.exports = router;