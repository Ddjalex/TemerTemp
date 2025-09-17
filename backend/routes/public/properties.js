const express = require('express');
const router = express.Router();
const Property = require('../../models/Property');
const { paginate, sendError, sendSuccess } = require('../../lib/utils');

// Get all active properties with pagination and filtering
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      type,
      status = 'for-sale',
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      city,
      state,
      featured,
      sort = '-createdAt'
    } = req.query;

    // Build filter object
    const filter = { isActive: true };
    
    if (type) filter.propertyType = type;
    if (status) filter.status = status;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (bedrooms) filter['features.bedrooms'] = { $gte: Number(bedrooms) };
    if (bathrooms) filter['features.bathrooms'] = { $gte: Number(bathrooms) };
    if (city) filter['address.city'] = new RegExp(city, 'i');
    if (state) filter['address.state'] = new RegExp(state, 'i');
    if (featured === 'true') filter.isFeatured = true;

    // Get total count for pagination
    const total = await Property.countDocuments(filter);
    const pagination = paginate(page, limit, total);

    // Get properties
    const properties = await Property.find(filter)
      .populate('agent', 'firstName lastName email contact.phone contact.whatsapp')
      .sort(sort)
      .skip(pagination.skip)
      .limit(pagination.itemsPerPage)
      .lean();

    sendSuccess(res, {
      properties,
      pagination
    });
  } catch (error) {
    console.error('Get properties error:', error);
    sendError(res, 'Failed to fetch properties', 500);
  }
});

// Get single property by ID
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findOne({ 
      _id: req.params.id, 
      isActive: true 
    })
    .populate('agent', 'firstName lastName email contact.phone contact.whatsapp photo position')
    .lean();

    if (!property) {
      return sendError(res, 'Property not found', 404);
    }

    // Increment view count
    await Property.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    sendSuccess(res, property);
  } catch (error) {
    console.error('Get property error:', error);
    sendError(res, 'Failed to fetch property', 500);
  }
});

// Search properties
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const { page = 1, limit = 12 } = req.query;

    if (!query || query.trim().length < 2) {
      return sendError(res, 'Search query must be at least 2 characters', 400);
    }

    const searchFilter = {
      isActive: true,
      $text: { $search: query }
    };

    const total = await Property.countDocuments(searchFilter);
    const pagination = paginate(page, limit, total);

    const properties = await Property.find(searchFilter, { score: { $meta: 'textScore' } })
      .populate('agent', 'firstName lastName email contact.phone')
      .sort({ score: { $meta: 'textScore' } })
      .skip(pagination.skip)
      .limit(pagination.itemsPerPage)
      .lean();

    sendSuccess(res, {
      properties,
      pagination,
      query
    });
  } catch (error) {
    console.error('Search properties error:', error);
    sendError(res, 'Failed to search properties', 500);
  }
});

// Get featured properties
router.get('/featured/list', async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const properties = await Property.find({
      isActive: true,
      isFeatured: true
    })
    .populate('agent', 'firstName lastName')
    .sort('-createdAt')
    .limit(Number(limit))
    .lean();

    sendSuccess(res, properties);
  } catch (error) {
    console.error('Get featured properties error:', error);
    sendError(res, 'Failed to fetch featured properties', 500);
  }
});

// Get similar properties
router.get('/:id/similar', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return sendError(res, 'Property not found', 404);
    }

    const { limit = 4 } = req.query;

    const similarProperties = await Property.find({
      _id: { $ne: property._id },
      isActive: true,
      propertyType: property.propertyType,
      'address.city': property.address.city,
      price: {
        $gte: property.price * 0.8,
        $lte: property.price * 1.2
      }
    })
    .populate('agent', 'firstName lastName')
    .sort('-createdAt')
    .limit(Number(limit))
    .lean();

    sendSuccess(res, similarProperties);
  } catch (error) {
    console.error('Get similar properties error:', error);
    sendError(res, 'Failed to fetch similar properties', 500);
  }
});

// Get property statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const [totalProperties, forSale, forRent, sold] = await Promise.all([
      Property.countDocuments({ isActive: true }),
      Property.countDocuments({ isActive: true, status: 'for-sale' }),
      Property.countDocuments({ isActive: true, status: 'for-rent' }),
      Property.countDocuments({ status: 'sold' })
    ]);

    const avgPrice = await Property.aggregate([
      { $match: { isActive: true, status: 'for-sale' } },
      { $group: { _id: null, avgPrice: { $avg: '$price' } } }
    ]);

    sendSuccess(res, {
      totalProperties,
      forSale,
      forRent,
      sold,
      averagePrice: avgPrice[0]?.avgPrice || 0
    });
  } catch (error) {
    console.error('Get property stats error:', error);
    sendError(res, 'Failed to fetch property statistics', 500);
  }
});

module.exports = router;