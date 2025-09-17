const express = require('express');
const router = express.Router();
const HeroSlide = require('../../models/HeroSlide');
const Property = require('../../models/Property');
const { uploadConfigs } = require('../../lib/storage');
const { paginate } = require('../../lib/utils');

// GET hero slides list
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const total = await HeroSlide.countDocuments();
    const pagination = paginate(page, limit, total);

    const slides = await HeroSlide.find()
      .populate('property', 'title address.city price')
      .sort('order')
      .skip(pagination.skip)
      .limit(pagination.itemsPerPage)
      .lean();

    res.render('admin/hero/index', {
      title: 'Hero Slides - Temer Properties Admin',
      slides,
      pagination,
      user: req.user
    });
  } catch (error) {
    console.error('Hero slides list error:', error);
    res.status(500).render('admin/error', {
      title: 'Error - Temer Properties Admin',
      message: 'Failed to load hero slides',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
});

// GET new hero slide form
router.get('/new', async (req, res) => {
  try {
    const properties = await Property.find({ isActive: true })
      .select('title address.city price')
      .sort('title')
      .lean();

    res.render('admin/hero/form', {
      title: 'Add New Hero Slide - Temer Properties Admin',
      slide: null,
      properties,
      isEdit: false,
      user: req.user
    });
  } catch (error) {
    console.error('New hero slide form error:', error);
    res.status(500).render('admin/error', {
      title: 'Error - Temer Properties Admin',
      message: 'Failed to load hero slide form',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
});

// GET edit hero slide form
router.get('/:id/edit', async (req, res) => {
  try {
    const slide = await HeroSlide.findById(req.params.id)
      .populate('property', 'title address.city price')
      .lean();

    if (!slide) {
      return res.status(404).render('admin/error', {
        title: 'Error - Temer Properties Admin',
        message: 'Hero slide not found',
        status: 404
      });
    }

    const properties = await Property.find({ isActive: true })
      .select('title address.city price')
      .sort('title')
      .lean();

    res.render('admin/hero/form', {
      title: `Edit Hero Slide - Temer Properties Admin`,
      slide,
      properties,
      isEdit: true,
      user: req.user
    });
  } catch (error) {
    console.error('Edit hero slide form error:', error);
    res.status(500).render('admin/error', {
      title: 'Error - Temer Properties Admin',
      message: 'Failed to load hero slide for editing',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
});

// POST create hero slide
router.post('/', uploadConfigs.hero.single('image'), async (req, res) => {
  try {
    const {
      title,
      subtitle,
      description,
      ctaText,
      ctaLink,
      isExternal,
      property,
      order,
      isActive,
      startDate,
      endDate
    } = req.body;

    if (!req.file) {
      return res.redirect('/admin/hero/new?error=Hero image is required');
    }

    const slide = new HeroSlide({
      title,
      subtitle,
      description,
      image: {
        url: `/uploads/hero/${req.file.filename}`,
        alt: title
      },
      ctaButton: {
        text: ctaText || 'Learn More',
        link: ctaLink || '/listings',
        isExternal: isExternal === 'on'
      },
      property: property || null,
      order: Number(order) || 0,
      isActive: isActive === 'on',
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: endDate ? new Date(endDate) : null
    });

    await slide.save();
    res.redirect('/admin/hero?success=Hero slide created successfully');
  } catch (error) {
    console.error('Create hero slide error:', error);
    res.redirect('/admin/hero/new?error=Failed to create hero slide');
  }
});

// PUT update hero slide
router.put('/:id', uploadConfigs.hero.single('image'), async (req, res) => {
  try {
    const slide = await HeroSlide.findById(req.params.id);
    if (!slide) {
      return res.status(404).json({ error: 'Hero slide not found' });
    }

    const {
      title,
      subtitle,
      description,
      ctaText,
      ctaLink,
      isExternal,
      property,
      order,
      isActive,
      startDate,
      endDate
    } = req.body;

    slide.title = title;
    slide.subtitle = subtitle;
    slide.description = description;
    slide.ctaButton = {
      text: ctaText || 'Learn More',
      link: ctaLink || '/listings',
      isExternal: isExternal === 'on'
    };
    slide.property = property || null;
    slide.order = Number(order) || 0;
    slide.isActive = isActive === 'on';
    slide.startDate = startDate ? new Date(startDate) : slide.startDate;
    slide.endDate = endDate ? new Date(endDate) : null;

    // Update image if new one uploaded
    if (req.file) {
      slide.image = {
        url: `/uploads/hero/${req.file.filename}`,
        alt: title
      };
    }

    await slide.save();
    res.redirect('/admin/hero?success=Hero slide updated successfully');
  } catch (error) {
    console.error('Update hero slide error:', error);
    res.redirect(`/admin/hero/${req.params.id}/edit?error=Failed to update hero slide`);
  }
});

// DELETE hero slide
router.delete('/:id', async (req, res) => {
  try {
    const slide = await HeroSlide.findById(req.params.id);
    if (!slide) {
      return res.status(404).json({ error: 'Hero slide not found' });
    }

    await HeroSlide.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Hero slide deleted successfully' });
  } catch (error) {
    console.error('Delete hero slide error:', error);
    res.status(500).json({ error: 'Failed to delete hero slide' });
  }
});

module.exports = router;