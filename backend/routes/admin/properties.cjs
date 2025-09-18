const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const Property = require('../../models/Property.cjs');

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
  try {
    const {
      title, description, price, propertyType, status,
      street, city, state, zipCode, country,
      bedrooms, bathrooms, sqft, yearBuilt,
      isActive, isFeatured
    } = req.body;

    // Process uploaded images
    const images = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file, index) => {
        images.push({
          url: `/uploads/properties/${file.filename}`,
          alt: `${title} - Image ${index + 1}`,
          isPrimary: index === 0
        });
      });
    }

    // Create property data
    const propertyData = {
      title,
      description,
      price: price ? parseFloat(price) : null,
      propertyType,
      status: status || 'for-sale',
      address: {
        street,
        city,
        state,
        zipCode,
        country: country || 'Ethiopia'
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

    const property = new Property(propertyData);
    await property.save();
    
    res.json({ success: true, message: 'Property created successfully' });
  } catch (error) {
    console.error('Create property error:', error);
    res.status(500).json({ success: false, message: 'Failed to create property' });
  }
});

// Update property
router.post('/edit/:id', upload.array('newImages', 10), async (req, res) => {
  try {
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

    // Handle existing images
    let images = [];
    if (req.body.existingImages) {
      // Process existing images that weren't deleted
      const existingImages = Array.isArray(req.body.existingImages) ? req.body.existingImages : [req.body.existingImages];
      existingImages.forEach(img => {
        if (img && img.url) {
          images.push({
            url: img.url,
            alt: img.alt || title,
            isPrimary: images.length === 0
          });
        }
      });
    }

    // Add new uploaded images
    if (req.files && req.files.length > 0) {
      req.files.forEach((file, index) => {
        images.push({
          url: `/uploads/properties/${file.filename}`,
          alt: `${title} - Image ${images.length + index + 1}`,
          isPrimary: images.length === 0 && index === 0
        });
      });
    }

    // Update property
    property.title = title;
    property.description = description;
    property.price = price ? parseFloat(price) : null;
    property.propertyType = propertyType;
    property.status = status || 'for-sale';
    property.address = {
      street,
      city,
      state,
      zipCode,
      country: country || 'Ethiopia'
    };
    property.features = {
      bedrooms: bedrooms ? parseInt(bedrooms) : null,
      bathrooms: bathrooms ? parseFloat(bathrooms) : null,
      sqft: sqft ? parseInt(sqft) : null,
      yearBuilt: yearBuilt ? parseInt(yearBuilt) : null
    };
    property.images = images;
    property.isActive = isActive === 'true';
    property.isFeatured = isFeatured === 'true';
    property.lastUpdated = new Date();

    await property.save();
    
    res.json({ success: true, message: 'Property updated successfully' });
  } catch (error) {
    console.error('Update property error:', error);
    res.status(500).json({ success: false, message: 'Failed to update property' });
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