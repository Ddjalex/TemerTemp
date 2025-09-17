const express = require('express');
const router = express.Router();
const Property = require('../../models/Property');
const User = require('../../models/User');
const BlogPost = require('../../models/BlogPost');
const TeamMember = require('../../models/TeamMember');

// GET dashboard home
router.get('/', async (req, res) => {
  try {
    // Get dashboard statistics
    const [
      totalProperties,
      activeProperties,
      soldProperties,
      totalUsers,
      totalAgents,
      totalBlogPosts,
      publishedBlogPosts,
      totalTeamMembers,
      recentProperties,
      recentBlogPosts
    ] = await Promise.all([
      Property.countDocuments(),
      Property.countDocuments({ isActive: true }),
      Property.countDocuments({ status: 'sold' }),
      User.countDocuments({ isActive: true }),
      User.countDocuments({ role: 'agent', isActive: true }),
      BlogPost.countDocuments(),
      BlogPost.countDocuments({ status: 'published' }),
      TeamMember.countDocuments({ isActive: true }),
      Property.find({ isActive: true })
        .populate('agent', 'firstName lastName')
        .sort('-createdAt')
        .limit(5)
        .lean(),
      BlogPost.find({ status: 'published' })
        .populate('author', 'firstName lastName')
        .sort('-publishedAt')
        .limit(5)
        .lean()
    ]);

    // Calculate property value statistics
    const propertyStats = await Property.aggregate([
      { $match: { isActive: true, status: 'for-sale' } },
      {
        $group: {
          _id: null,
          totalValue: { $sum: '$price' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      }
    ]);

    const stats = {
      properties: {
        total: totalProperties,
        active: activeProperties,
        sold: soldProperties,
        value: propertyStats[0] || { totalValue: 0, avgPrice: 0, minPrice: 0, maxPrice: 0 }
      },
      users: {
        total: totalUsers,
        agents: totalAgents
      },
      blog: {
        total: totalBlogPosts,
        published: publishedBlogPosts
      },
      team: {
        total: totalTeamMembers
      },
      recent: {
        properties: recentProperties,
        blogPosts: recentBlogPosts
      }
    };

    res.render('admin/dashboard/index', {
      title: 'Dashboard - Temer Properties Admin',
      stats,
      user: req.user
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).render('admin/error', {
      title: 'Error - Temer Properties Admin',
      message: 'Failed to load dashboard data',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
});

// GET analytics
router.get('/analytics', async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    // Calculate date range based on period
    const now = new Date();
    let startDate;
    
    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Get analytics data
    const [propertyTrends, blogTrends, userActivity] = await Promise.all([
      Property.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
            },
            count: { $sum: 1 },
            totalValue: { $sum: '$price' }
          }
        },
        { $sort: { '_id': 1 } }
      ]),
      BlogPost.aggregate([
        {
          $match: {
            publishedAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$publishedAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id': 1 } }
      ]),
      User.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id': 1 } }
      ])
    ]);

    res.render('admin/dashboard/analytics', {
      title: 'Analytics - Temer Properties Admin',
      period,
      analytics: {
        properties: propertyTrends,
        blog: blogTrends,
        users: userActivity
      },
      user: req.user
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).render('admin/error', {
      title: 'Error - Temer Properties Admin',
      message: 'Failed to load analytics data',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
});

module.exports = router;