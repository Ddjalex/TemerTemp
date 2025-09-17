const express = require('express');
const router = express.Router();
const BlogPost = require('../../models/BlogPost');
const { paginate, sendError, sendSuccess } = require('../../lib/utils');

// Get all published blog posts with pagination
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      tag,
      featured,
      sort = '-publishedAt'
    } = req.query;

    // Build filter object
    const filter = { status: 'published' };
    
    if (category) filter.category = category;
    if (tag) filter.tags = { $in: [tag.toLowerCase()] };
    if (featured === 'true') filter.isFeatured = true;

    // Get total count for pagination
    const total = await BlogPost.countDocuments(filter);
    const pagination = paginate(page, limit, total);

    // Get blog posts
    const posts = await BlogPost.find(filter)
      .populate('author', 'firstName lastName avatar')
      .select('-content') // Exclude full content for list view
      .sort(sort)
      .skip(pagination.skip)
      .limit(pagination.itemsPerPage)
      .lean();

    sendSuccess(res, {
      posts,
      pagination
    });
  } catch (error) {
    console.error('Get blog posts error:', error);
    sendError(res, 'Failed to fetch blog posts', 500);
  }
});

// Get single blog post by slug
router.get('/post/:slug', async (req, res) => {
  try {
    const post = await BlogPost.findOne({
      slug: req.params.slug,
      status: 'published'
    })
    .populate('author', 'firstName lastName avatar position bio')
    .lean();

    if (!post) {
      return sendError(res, 'Blog post not found', 404);
    }

    // Increment view count
    await BlogPost.findByIdAndUpdate(post._id, { $inc: { views: 1 } });

    sendSuccess(res, post);
  } catch (error) {
    console.error('Get blog post error:', error);
    sendError(res, 'Failed to fetch blog post', 500);
  }
});

// Search blog posts
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!query || query.trim().length < 2) {
      return sendError(res, 'Search query must be at least 2 characters', 400);
    }

    const searchFilter = {
      status: 'published',
      $text: { $search: query }
    };

    const total = await BlogPost.countDocuments(searchFilter);
    const pagination = paginate(page, limit, total);

    const posts = await BlogPost.find(searchFilter, { score: { $meta: 'textScore' } })
      .populate('author', 'firstName lastName avatar')
      .select('-content')
      .sort({ score: { $meta: 'textScore' } })
      .skip(pagination.skip)
      .limit(pagination.itemsPerPage)
      .lean();

    sendSuccess(res, {
      posts,
      pagination,
      query
    });
  } catch (error) {
    console.error('Search blog posts error:', error);
    sendError(res, 'Failed to search blog posts', 500);
  }
});

// Get featured blog posts
router.get('/featured/list', async (req, res) => {
  try {
    const { limit = 3 } = req.query;

    const posts = await BlogPost.find({
      status: 'published',
      isFeatured: true
    })
    .populate('author', 'firstName lastName avatar')
    .select('-content')
    .sort('-publishedAt')
    .limit(Number(limit))
    .lean();

    sendSuccess(res, posts);
  } catch (error) {
    console.error('Get featured blog posts error:', error);
    sendError(res, 'Failed to fetch featured blog posts', 500);
  }
});

// Get related blog posts
router.get('/post/:slug/related', async (req, res) => {
  try {
    const currentPost = await BlogPost.findOne({
      slug: req.params.slug,
      status: 'published'
    }).select('category tags');

    if (!currentPost) {
      return sendError(res, 'Blog post not found', 404);
    }

    const { limit = 3 } = req.query;

    // Find related posts by category and tags
    const relatedPosts = await BlogPost.find({
      _id: { $ne: currentPost._id },
      status: 'published',
      $or: [
        { category: currentPost.category },
        { tags: { $in: currentPost.tags } }
      ]
    })
    .populate('author', 'firstName lastName avatar')
    .select('-content')
    .sort('-publishedAt')
    .limit(Number(limit))
    .lean();

    sendSuccess(res, relatedPosts);
  } catch (error) {
    console.error('Get related blog posts error:', error);
    sendError(res, 'Failed to fetch related blog posts', 500);
  }
});

// Get blog categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await BlogPost.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const formattedCategories = categories.map(cat => ({
      name: cat._id,
      count: cat.count,
      displayName: cat._id.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')
    }));

    sendSuccess(res, formattedCategories);
  } catch (error) {
    console.error('Get blog categories error:', error);
    sendError(res, 'Failed to fetch blog categories', 500);
  }
});

// Get popular tags
router.get('/tags', async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    const tags = await BlogPost.aggregate([
      { $match: { status: 'published' } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: Number(limit) }
    ]);

    const formattedTags = tags.map(tag => ({
      name: tag._id,
      count: tag.count
    }));

    sendSuccess(res, formattedTags);
  } catch (error) {
    console.error('Get blog tags error:', error);
    sendError(res, 'Failed to fetch blog tags', 500);
  }
});

module.exports = router;