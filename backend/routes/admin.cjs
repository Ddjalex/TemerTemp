const express = require('express');
const router = express.Router();

// Import admin route modules
const adminRoutes = require('./admin/index.cjs');

// Mount all admin routes
router.use('/', adminRoutes);

module.exports = router;