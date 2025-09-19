const express = require('express');
const router = express.Router();

// Import public route modules
const publicRoutes = require('./public/index.js');

// Mount all public API routes
router.use('/', publicRoutes);

module.exports = router;