const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const HeroSlide = require('../../models/HeroSlide.js');

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

// View slide (read-only)
router.get('/view/:id', async (req, res) => {
  try {
    const slide = await HeroSlide.findById(req.params.id);
    if (!slide) {
      return res.render('admin/error', {
        title: 'Slide Not Found - Temer Properties Admin',
        user: req.session.user,
        error: 'Hero slide not found'
      });
    }
    res.render('admin/hero/view', {
      title: 'View Hero Slide - Temer Properties Admin',
      user: req.session.user,
      slide
    });
  } catch (error) {
    console.error('View slide error:', error);
    res.render('admin/error', {
      title: 'Hero Error - Temer Properties Admin',
      user: req.session.user,
      error: 'Failed to load hero slide'
    });
  }
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
  const startTime = Date.now();
  
  try {
    const { title, subtitle, description, buttonText, buttonLink, displayOrder, isActive, imageAlt } = req.body;
    
    // Validate required fields early
    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Hero slide title is required' });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Hero image is required' });
    }
    if (!imageAlt || !imageAlt.trim()) {
      return res.status(400).json({ success: false, message: 'Image alt text is required' });
    }
    
    const slideData = {
      title: title.trim(),
      subtitle: subtitle ? subtitle.trim() : '',
      description: description ? description.trim() : '',
      ctaButton: {
        text: buttonText ? buttonText.trim() : 'Learn More',
        link: buttonLink ? buttonLink.trim() : '/listings'
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
    
    const duration = Date.now() - startTime;
    console.log(`✅ Hero slide created successfully in ${duration}ms`);
    
    res.json({ 
      success: true, 
      message: 'Hero slide created successfully',
      data: { id: slide._id, title: slide.title },
      processingTime: `${duration}ms`,
      redirectUrl: '/admin/hero'
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ Create hero slide error (${duration}ms):`, error.message);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to create hero slide';
    if (error.name === 'ValidationError') {
      errorMessage = 'Please check all required fields are filled correctly';
    } else if (error.code === 11000) {
      errorMessage = 'A hero slide with this information already exists';
    } else if (error.message.includes('timeout')) {
      errorMessage = 'Operation timed out - please try again';
    }
    
    res.status(500).json({ 
      success: false, 
      message: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Update slide
router.post('/edit/:id', upload.single('image'), async (req, res) => {
  const startTime = Date.now();
  
  try {
    // Validate ID format early
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: 'Invalid hero slide ID format' });
    }

    const slide = await HeroSlide.findById(req.params.id);
    if (!slide) {
      return res.status(404).json({ success: false, message: 'Hero slide not found' });
    }
    
    const { title, subtitle, description, buttonText, buttonLink, displayOrder, isActive, imageAlt } = req.body;
    
    // Validate required fields early
    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Hero slide title is required' });
    }

    // Prepare update data
    const updateData = {
      title: title.trim(),
      subtitle: subtitle ? subtitle.trim() : '',
      description: description ? description.trim() : '',
      ctaButton: {
        text: buttonText ? buttonText.trim() : 'Learn More',
        link: buttonLink ? buttonLink.trim() : '/listings'
      },
      order: displayOrder ? parseInt(displayOrder) : 0,
      isActive: isActive === 'true'
    };

    // Handle image update efficiently
    if (req.file) {
      if (!imageAlt || !imageAlt.trim()) {
        return res.status(400).json({ success: false, message: 'Image alt text is required when uploading a new image' });
      }
      updateData.image = {
        url: `/uploads/hero/${req.file.filename}`,
        alt: imageAlt.trim()
      };
    } else if (imageAlt && imageAlt.trim() && slide.image && slide.image.url) {
      // Update only alt text if no new image uploaded
      updateData.image = {
        url: slide.image.url,
        alt: imageAlt.trim()
      };
    } else {
      // Keep existing image if no changes
      updateData.image = slide.image;
    }
    
    // Use atomic update for better performance
    const updatedSlide = await HeroSlide.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    const duration = Date.now() - startTime;
    console.log(`✅ Hero slide updated successfully in ${duration}ms`);
    
    res.json({ 
      success: true, 
      message: 'Hero slide updated successfully',
      data: { id: updatedSlide._id, title: updatedSlide.title },
      processingTime: `${duration}ms`,
      redirectUrl: '/admin/hero'
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ Update hero slide error (${duration}ms):`, error.message);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to update hero slide';
    if (error.name === 'ValidationError') {
      errorMessage = 'Please check all required fields are filled correctly';
    } else if (error.name === 'CastError') {
      errorMessage = 'Invalid data format provided';
    } else if (error.message.includes('timeout')) {
      errorMessage = 'Operation timed out - please try again';
    }
    
    res.status(500).json({ 
      success: false, 
      message: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
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
    if (slide.image && slide.image.url && slide.image.url.startsWith('/uploads/')) {
      const baseDir = path.join(__dirname, '../../uploads');
      const relativePath = slide.image.url.replace(/^\/uploads\//, '');
      const imagePath = path.resolve(baseDir, relativePath);
      // Security check: ensure path is within uploads directory
      if (imagePath.startsWith(baseDir + path.sep) && fs.existsSync(imagePath)) {
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