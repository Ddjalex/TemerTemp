const express = require('express');
const router = express.Router();
const HeroSlide = require('../../models/HeroSlide');
const { sendError, sendSuccess } = require('../../lib/utils');

// Get all active hero slides
router.get('/', async (req, res) => {
  try {
    const slides = await HeroSlide.find({ isActive: true })
      .populate('property', 'title price propertyType address features images')
      .sort('order')
      .lean();

    // Filter slides that are currently active (within date range)
    const activeSlides = slides.filter(slide => {
      const now = new Date();
      if (slide.startDate && slide.startDate > now) return false;
      if (slide.endDate && slide.endDate < now) return false;
      return true;
    });

    sendSuccess(res, activeSlides);
  } catch (error) {
    console.error('Get hero slides error:', error);
    sendError(res, 'Failed to fetch hero slides', 500);
  }
});

// Get single hero slide by ID
router.get('/:id', async (req, res) => {
  try {
    const slide = await HeroSlide.findOne({
      _id: req.params.id,
      isActive: true
    })
    .populate('property', 'title price propertyType address features images')
    .lean();

    if (!slide) {
      return sendError(res, 'Hero slide not found', 404);
    }

    // Check if slide is currently active
    const now = new Date();
    if (slide.startDate && slide.startDate > now) {
      return sendError(res, 'Hero slide not yet active', 404);
    }
    if (slide.endDate && slide.endDate < now) {
      return sendError(res, 'Hero slide has expired', 404);
    }

    sendSuccess(res, slide);
  } catch (error) {
    console.error('Get hero slide error:', error);
    sendError(res, 'Failed to fetch hero slide', 500);
  }
});

module.exports = router;