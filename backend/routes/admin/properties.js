const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const Property = require('../../models/Property.js');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../uploads/properties');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
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

// View property (read-only)
router.get('/view/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.render('admin/error', {
        title: 'Property Not Found - Temer Properties Admin',
        user: req.session.user,
        error: 'Property not found'
      });
    }
    res.render('admin/properties/view', {
      title: 'View Property - Temer Properties Admin',
      user: req.session.user,
      property
    });
  } catch (error) {
    console.error('View property error:', error);
    res.render('admin/error', {
      title: 'Properties Error - Temer Properties Admin',
      user: req.session.user,
      error: 'Failed to load property'
    });
  }
});

// Edit property form
router.get('/edit/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.render('admin/error', {
        title: 'Property Not Found - Temer Properties Admin',
        user: req.session.user,
        error: 'Property not found'
      });
    }
    res.render('admin/properties/form', {
      title: 'Edit Property - Temer Properties Admin',
      user: req.session.user,
      property,
      errors: {}
    });
  } catch (error) {
    console.error('Edit property error:', error);
    res.render('admin/error', {
      title: 'Properties Error - Temer Properties Admin',
      user: req.session.user,
      error: 'Failed to load property'
    });
  }
});

// Create property
router.post('/new', upload.array('newImages', 10), async (req, res) => {
  const startTime = Date.now();
  
  try {
    const {
      title, description, price, propertyType, status,
      street, city, state, zipCode, country,
      bedrooms, bathrooms, sqft, yearBuilt,
      isActive, isFeatured
    } = req.body;

    // Validate required fields early
    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Property title is required' });
    }

    // Process uploaded images efficiently
    const images = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file, index) => {
        images.push({
          url: `/uploads/properties/${file.filename}`,
          alt: `${title.trim()} - Image ${index + 1}`,
          isPrimary: index === 0
        });
      });
    }

    // Create property data with optimized structure
    const propertyData = {
      title: title.trim(),
      description: description ? description.trim() : '',
      price: price ? parseFloat(price) : null,
      propertyType,
      status: status || 'for-sale',
      address: {
        street: street ? street.trim() : '',
        city: city ? city.trim() : '',
        state: state ? state.trim() : '',
        zipCode: zipCode ? zipCode.trim() : '',
        country: country ? country.trim() : 'Ethiopia'
      },
      features: {
        bedrooms: bedrooms ? parseInt(bedrooms) : null,
        bathrooms: bathrooms ? parseFloat(bathrooms) : null,
        sqft: sqft ? parseInt(sqft) : null,
        yearBuilt: yearBuilt ? parseInt(yearBuilt) : null
      },
      images,
      isActive: isActive === 'true',
      isFeatured: isFeatured === 'true',
      lastUpdated: new Date()
    };

    // Create and save property with session for transaction-like behavior
    const property = new Property(propertyData);
    await property.save();
    
    const duration = Date.now() - startTime;
    console.log(`✅ Property created successfully in ${duration}ms`);
    
    res.json({ 
      success: true, 
      message: 'Property created successfully',
      data: { id: property._id, title: property.title },
      processingTime: `${duration}ms`
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ Create property error (${duration}ms):`, error.message);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to create property';
    if (error.name === 'ValidationError') {
      errorMessage = 'Please check all required fields are filled correctly';
    } else if (error.code === 11000) {
      errorMessage = 'A property with this information already exists';
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

// Update property
router.post('/edit/:id', upload.array('newImages', 10), async (req, res) => {
  const startTime = Date.now();
  
  try {
    // Validate ID format early
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: 'Invalid property ID format' });
    }

    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    const {
      title, description, price, propertyType, status,
      street, city, state, zipCode, country,
      bedrooms, bathrooms, sqft, yearBuilt,
      isActive, isFeatured
    } = req.body;

    // Validate required fields early
    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Property title is required' });
    }

    // Handle existing images efficiently
    let images = [];
    if (req.body.existingImages) {
      const existingImages = Array.isArray(req.body.existingImages) ? req.body.existingImages : [req.body.existingImages];
      existingImages.forEach(img => {
        if (img && img.url) {
          images.push({
            url: img.url,
            alt: img.alt || title.trim(),
            isPrimary: images.length === 0
          });
        }
      });
    }

    // Add new uploaded images efficiently
    if (req.files && req.files.length > 0) {
      req.files.forEach((file, index) => {
        images.push({
          url: `/uploads/properties/${file.filename}`,
          alt: `${title.trim()} - Image ${images.length + index + 1}`,
          isPrimary: images.length === 0 && index === 0
        });
      });
    }

    // Use atomic update operations for better performance
    const updateData = {
      title: title.trim(),
      description: description ? description.trim() : '',
      price: price ? parseFloat(price) : null,
      propertyType,
      status: status || 'for-sale',
      address: {
        street: street ? street.trim() : '',
        city: city ? city.trim() : '',
        state: state ? state.trim() : '',
        zipCode: zipCode ? zipCode.trim() : '',
        country: country ? country.trim() : 'Ethiopia'
      },
      features: {
        bedrooms: bedrooms ? parseInt(bedrooms) : null,
        bathrooms: bathrooms ? parseFloat(bathrooms) : null,
        sqft: sqft ? parseInt(sqft) : null,
        yearBuilt: yearBuilt ? parseInt(yearBuilt) : null
      },
      images,
      isActive: isActive === 'true',
      isFeatured: isFeatured === 'true',
      lastUpdated: new Date()
    };

    // Update using findByIdAndUpdate for better performance
    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    const duration = Date.now() - startTime;
    console.log(`✅ Property updated successfully in ${duration}ms`);
    
    res.json({ 
      success: true, 
      message: 'Property updated successfully',
      data: { id: updatedProperty._id, title: updatedProperty.title },
      processingTime: `${duration}ms`
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ Update property error (${duration}ms):`, error.message);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to update property';
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

// Delete property
router.delete('/delete/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    // Delete associated image files
    if (property.images && property.images.length > 0) {
      property.images.forEach(image => {
        if (image.url.startsWith('/uploads/')) {
          const imagePath = path.join(__dirname, '../..', image.url);
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        }
      });
    }

    await Property.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Delete property error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete property' });
  }
});

module.exports = router;