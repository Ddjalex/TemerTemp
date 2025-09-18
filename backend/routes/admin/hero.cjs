const express = require('express');
const router = express.Router();
const HeroSlide = require('../../models/HeroSlide.cjs');

// Hero slides list
router.get('/', async (req, res) => {
  try {
    const slides = await HeroSlide.find().sort({ displayOrder: 1 });
    res.render('admin/hero/index', {
      title: 'Hero Slides - Temer Properties Admin',
      user: req.session.user,
      slides
    });
  } catch (error) {
    console.error('Hero slides error:', error);
    res.render('admin/error', {
      title: 'Hero Slides Error - Temer Properties Admin',
      user: req.session.user,
      error: 'Failed to load hero slides'
    });
  }
});

// New slide form
router.get('/new', (req, res) => {
  res.render('admin/hero/form', {
    title: 'New Hero Slide - Temer Properties Admin',
    user: req.session.user,
    slide: null,
    errors: {}
  });
});

// Create slide
router.post('/new', async (req, res) => {
  try {
    const slide = new HeroSlide(req.body);
    await slide.save();
    res.redirect('/admin/hero');
  } catch (error) {
    console.error('Create slide error:', error);
    res.render('admin/hero/form', {
      title: 'New Hero Slide - Temer Properties Admin',
      user: req.session.user,
      slide: req.body,
      errors: error.errors || { general: 'Failed to create slide' }
    });
  }
});

module.exports = router;