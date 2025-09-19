const express = require('express');
const router = express.Router();
const Property = require('../../models/Property.cjs');
const BlogPost = require('../../models/BlogPost.cjs');
const HeroSlide = require('../../models/HeroSlide.cjs');
const TeamMember = require('../../models/TeamMember.cjs');

// Dashboard overview
router.get('/', async (req, res) => {
  try {
    // Get statistics
    const [
      totalProperties,
      featuredProperties,
      draftProperties,
      totalPosts,
      publishedPosts,
      activeSlides,
      activeTeamMembers
    ] = await Promise.all([
      Property.countDocuments({ isActive: true }),
      Property.countDocuments({ isActive: true, isFeatured: true }),
      Property.countDocuments({ isActive: false }),
      BlogPost.countDocuments(),
      BlogPost.countDocuments({ isPublished: true }),
      HeroSlide.countDocuments({ isActive: true }),
      TeamMember.countDocuments({ isActive: true })
    ]);

    // Get recent activities (last 10 activities)
    const recentProperties = await Property.find({ isActive: true })
      .sort({ updatedAt: -1 })
      .limit(5)
      .select('_id title status price updatedAt');

    const recentPosts = await BlogPost.find()
      .sort({ updatedAt: -1 })
      .limit(5)
      .select('_id title isPublished updatedAt');

    const activities = [
      ...recentProperties.map(p => ({
        _id: p._id,
        id: p._id.toString(),
        type: 'property',
        endpoint: 'properties',
        title: p.title,
        status: p.status,
        price: p.price,
        updatedAt: p.updatedAt,
        action: 'Property updated'
      })),
      ...recentPosts.map(p => ({
        _id: p._id,
        id: p._id.toString(),
        type: 'blog',
        endpoint: 'blog',
        title: p.title,
        status: p.isPublished ? 'published' : 'draft',
        updatedAt: p.updatedAt,
        action: 'Blog post updated'
      }))
    ].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 10);

    res.render('admin/dashboard/index', {
      title: 'Dashboard - Temer Properties Admin',
      user: req.session.user,
      stats: {
        totalProperties,
        featuredProperties,
        draftProperties,
        totalPosts,
        publishedPosts,
        activeSlides,
        activeTeamMembers
      },
      activities
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.render('admin/error', {
      title: 'Dashboard Error - Temer Properties Admin',
      user: req.session.user,
      error: 'Failed to load dashboard data'
    });
  }
});

module.exports = router;