const express = require('express');
const router = express.Router();
const Property = require('../../models/Property.cjs');
const User = require('../../models/User.cjs');
const { uploadConfigs } = require('../../lib/storage.cjs');
const { paginate, formatCurrency, generateSlug } = require('../../lib/utils.cjs');

// GET properties list
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      status,
      type,
      agent,
      sort = '-createdAt'
    } = req.query;

    // Build filter
    const filter = {};
    if (search) {
      filter.$text = { $search: search };
    }
    if (status) filter.status = status;
    if (type) filter.propertyType = type;
    if (agent) filter.agent = agent;

    // Get total count
    const total = await Property.countDocuments(filter);
    const pagination = paginate(page, limit, total);

    // Get properties
    const properties = await Property.find(filter)
      .populate('agent', 'firstName lastName email')
      .sort(sort)
      .skip(pagination.skip)
      .limit(pagination.itemsPerPage)
      .lean();

    // Get agents for filter dropdown
    const agents = await User.find({ role: 'agent', isActive: true })
      .select('firstName lastName')
      .sort('firstName')
      .lean();

    res.render('admin/properties/index', {
      title: 'Properties - Temer Properties Admin',
      properties,
      pagination,
      agents,
      filters: { search, status, type, agent, sort },
      user: req.user
    });
  } catch (error) {
    console.error('Properties list error:', error);
    res.status(500).render('admin/error', {
      title: 'Error - Temer Properties Admin',
      message: 'Failed to load properties',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
});

// GET new property form
router.get('/new', async (req, res) => {
  try {
    const agents = await User.find({ role: 'agent', isActive: true })
      .select('firstName lastName')
      .sort('firstName')
      .lean();

    res.render('admin/properties/form', {
      title: 'Add New Property - Temer Properties Admin',
      property: null,
      agents,
      isEdit: false,
      user: req.user
    });
  } catch (error) {
    console.error('New property form error:', error);
    res.status(500).render('admin/error', {
      title: 'Error - Temer Properties Admin',
      message: 'Failed to load property form',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
});

// GET edit property form
router.get('/:id/edit', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('agent', 'firstName lastName')
      .lean();

    if (!property) {
      return res.status(404).render('admin/error', {
        title: 'Error - Temer Properties Admin',
        message: 'Property not found',
        status: 404
      });
    }

    const agents = await User.find({ role: 'agent', isActive: true })
      .select('firstName lastName')
      .sort('firstName')
      .lean();

    res.render('admin/properties/form', {
      title: `Edit ${property.title} - Temer Properties Admin`,
      property,
      agents,
      isEdit: true,
      user: req.user
    });
  } catch (error) {
    console.error('Edit property form error:', error);
    res.status(500).render('admin/error', {
      title: 'Error - Temer Properties Admin',
      message: 'Failed to load property for editing',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
});

// POST create property
router.post('/', uploadConfigs.properties.array('images', 10), async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      propertyType,
      status,
      street,
      city,
      state,
      zipCode,
      country,
      latitude,
      longitude,
      bedrooms,
      bathrooms,
      sqft,
      lotSize,
      yearBuilt,
      garage,
      stories,
      amenities,
      agent,
      isActive,
      isFeatured
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

    // Create property
    const property = new Property({
      title,
      description,
      price: Number(price),
      propertyType,
      status,
      address: {
        street,
        city,
        state,
        zipCode,
        country: country || 'USA'
      },
      coordinates: {
        latitude: latitude ? Number(latitude) : undefined,
        longitude: longitude ? Number(longitude) : undefined
      },
      features: {
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        sqft: Number(sqft),
        lotSize: lotSize ? Number(lotSize) : undefined,
        yearBuilt: yearBuilt ? Number(yearBuilt) : undefined,
        garage: garage ? Number(garage) : 0,
        stories: stories ? Number(stories) : 1
      },
      amenities: amenities ? amenities.split(',').map(a => a.trim()) : [],
      images,
      agent,
      isActive: isActive === 'on',
      isFeatured: isFeatured === 'on'
    });

    await property.save();

    res.redirect('/admin/properties?success=Property created successfully');
  } catch (error) {
    console.error('Create property error:', error);
    res.redirect('/admin/properties/new?error=Failed to create property');
  }
});

// PUT update property
router.put('/:id', uploadConfigs.properties.array('images', 10), async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const {
      title,
      description,
      price,
      propertyType,
      status,
      street,
      city,
      state,
      zipCode,
      country,
      latitude,
      longitude,
      bedrooms,
      bathrooms,
      sqft,
      lotSize,
      yearBuilt,
      garage,
      stories,
      amenities,
      agent,
      isActive,
      isFeatured,
      existingImages
    } = req.body;

    // Handle existing images
    let images = [];
    if (existingImages) {
      try {
        images = JSON.parse(existingImages);
      } catch (e) {
        images = [];
      }
    }

    // Process new uploaded images
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
    property.price = Number(price);
    property.propertyType = propertyType;
    property.status = status;
    property.address = {
      street,
      city,
      state,
      zipCode,
      country: country || 'USA'
    };
    property.coordinates = {
      latitude: latitude ? Number(latitude) : undefined,
      longitude: longitude ? Number(longitude) : undefined
    };
    property.features = {
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      sqft: Number(sqft),
      lotSize: lotSize ? Number(lotSize) : undefined,
      yearBuilt: yearBuilt ? Number(yearBuilt) : undefined,
      garage: garage ? Number(garage) : 0,
      stories: stories ? Number(stories) : 1
    };
    property.amenities = amenities ? amenities.split(',').map(a => a.trim()) : [];
    property.images = images;
    property.agent = agent;
    property.isActive = isActive === 'on';
    property.isFeatured = isFeatured === 'on';
    property.lastUpdated = new Date();

    await property.save();

    res.redirect(`/admin/properties?success=Property updated successfully`);
  } catch (error) {
    console.error('Update property error:', error);
    res.redirect(`/admin/properties/${req.params.id}/edit?error=Failed to update property`);
  }
});

// DELETE property
router.delete('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    await Property.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Delete property error:', error);
    res.status(500).json({ error: 'Failed to delete property' });
  }
});

// GET property details
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('agent', 'firstName lastName email contact')
      .lean();

    if (!property) {
      return res.status(404).render('admin/error', {
        title: 'Error - Temer Properties Admin',
        message: 'Property not found',
        status: 404
      });
    }

    res.render('admin/properties/detail', {
      title: `${property.title} - Temer Properties Admin`,
      property,
      user: req.user
    });
  } catch (error) {
    console.error('Property detail error:', error);
    res.status(500).render('admin/error', {
      title: 'Error - Temer Properties Admin',
      message: 'Failed to load property details',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
});

module.exports = router;