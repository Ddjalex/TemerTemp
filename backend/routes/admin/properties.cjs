const express = require('express');
const router = express.Router();
const Property = require('../../models/Property.cjs');

// Properties list
router.get('/', async (req, res) => {
  try {
    const properties = await Property.find().sort({ updatedAt: -1 });
    res.render('admin/properties/index', {
      title: 'Properties - Temer Properties Admin',
      user: req.session.user,
      properties
    });
  } catch (error) {
    console.error('Properties list error:', error);
    res.render('admin/error', {
      title: 'Properties Error - Temer Properties Admin',
      user: req.session.user,
      error: 'Failed to load properties'
    });
  }
});

// New property form
router.get('/new', (req, res) => {
  res.render('admin/properties/form', {
    title: 'New Property - Temer Properties Admin',
    user: req.session.user,
    property: null,
    errors: {}
  });
});

// Create property
router.post('/new', async (req, res) => {
  try {
    const property = new Property(req.body);
    await property.save();
    res.redirect('/admin/properties');
  } catch (error) {
    console.error('Create property error:', error);
    res.render('admin/properties/form', {
      title: 'New Property - Temer Properties Admin',
      user: req.session.user,
      property: req.body,
      errors: error.errors || { general: 'Failed to create property' }
    });
  }
});

module.exports = router;