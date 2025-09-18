const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const HeroSlide = require('../../models/HeroSlide.cjs');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../uploads/hero');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

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

// Edit slide form
router.get('/edit/:id', async (req, res) => {
  try {
    const slide = await HeroSlide.findById(req.params.id);
    if (!slide) {
      return res.render('admin/error', {
        title: 'Slide Not Found - Temer Properties Admin',
        user: req.session.user,
        error: 'Hero slide not found'
      });
    }
    res.render('admin/hero/form', {
      title: 'Edit Hero Slide - Temer Properties Admin',
      user: req.session.user,
      slide,
      errors: {}
    });
  } catch (error) {
    console.error('Edit slide error:', error);
    res.render('admin/error', {
      title: 'Hero Error - Temer Properties Admin',
      user: req.session.user,
      error: 'Failed to load hero slide'
    });
  }
});

// Create slide
router.post('/new', upload.single('image'), async (req, res) => {
  try {
    const { title, subtitle, description, buttonText, buttonLink, displayOrder, isActive, imageAlt } = req.body;
    
    // Validate required fields
    if (!req.file) {
      throw new Error('Hero image is required');
    }
    if (!imageAlt || !imageAlt.trim()) {
      throw new Error('Image alt text is required');
    }
    
    const slideData = {
      title,
      subtitle,
      description,
      ctaButton: {
        text: buttonText || 'Learn More',
        link: buttonLink || '/listings'
      },
      order: displayOrder ? parseInt(displayOrder) : 0,
      isActive: isActive === 'true',
      image: {
        url: `/uploads/hero/${req.file.filename}`,
        alt: imageAlt.trim()
      }
    };
    
    const slide = new HeroSlide(slideData);
    await slide.save();
    res.redirect('/admin/hero');
  } catch (error) {
    console.error('Create slide error:', error);
    res.render('admin/hero/form', {
      title: 'New Hero Slide - Temer Properties Admin',
      user: req.session.user,
      slide: req.body,
      errors: error.errors || { general: error.message || 'Failed to create slide' }
    });
  }
});

// Update slide
router.post('/edit/:id', upload.single('image'), async (req, res) => {
  try {
    const slide = await HeroSlide.findById(req.params.id);
    if (!slide) {
      return res.status(404).json({ success: false, message: 'Slide not found' });
    }
    
    const { title, subtitle, description, buttonText, buttonLink, displayOrder, isActive, imageAlt } = req.body;
    
    slide.title = title;
    slide.subtitle = subtitle;
    slide.description = description;
    slide.ctaButton = {
      text: buttonText || 'Learn More',
      link: buttonLink || '/listings'
    };
    slide.order = displayOrder ? parseInt(displayOrder) : 0;
    slide.isActive = isActive === 'true';
    
    // Handle image update
    if (req.file) {
      if (!imageAlt || !imageAlt.trim()) {
        throw new Error('Image alt text is required when uploading a new image');
      }
      slide.image = {
        url: `/uploads/hero/${req.file.filename}`,
        alt: imageAlt.trim()
      };
    } else if (imageAlt && imageAlt.trim() && slide.image && slide.image.url) {
      // Update only alt text if no new image uploaded
      slide.image.alt = imageAlt.trim();
    }
    
    await slide.save();
    res.redirect('/admin/hero');
  } catch (error) {
    console.error('Update slide error:', error);
    res.render('admin/hero/form', {
      title: 'Edit Hero Slide - Temer Properties Admin',
      user: req.session.user,
      slide: req.body,
      errors: error.errors || { general: error.message || 'Failed to update slide' }
    });
  }
});

// Delete slide
router.delete('/delete/:id', async (req, res) => {
  try {
    const slide = await HeroSlide.findById(req.params.id);
    if (!slide) {
      return res.status(404).json({ success: false, message: 'Slide not found' });
    }
    
    // Delete image file if exists
    if (slide.image && slide.image.startsWith('/uploads/')) {
      const imagePath = path.join(__dirname, '../..', slide.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    await HeroSlide.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Slide deleted successfully' });
  } catch (error) {
    console.error('Delete slide error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete slide' });
  }
});

module.exports = router;