import { Router } from "express";
import { storage } from "./storage";

const router = Router();

// Properties API
router.get('/properties', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      type,
      status = 'for-sale',
      featured
    } = req.query;

    const filters: any = { isActive: true };
    
    if (type) filters.propertyType = type;
    if (status) filters.status = status;
    if (featured === 'true') filters.isFeatured = true;

    const properties = await storage.getProperties(filters);
    
    // Simple pagination
    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const paginatedProperties = properties.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: {
        properties: paginatedProperties,
        pagination: {
          currentPage: Number(page),
          itemsPerPage: Number(limit),
          total: properties.length,
          totalPages: Math.ceil(properties.length / Number(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get properties error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch properties'
    });
  }
});

router.get('/properties/:id', async (req, res) => {
  try {
    const property = await storage.getProperty(Number(req.params.id));
    
    if (!property || !property.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    res.json({
      success: true,
      data: property
    });
  } catch (error) {
    console.error('Get property error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch property'
    });
  }
});

// Hero slides API
router.get('/hero', async (req, res) => {
  try {
    const slides = await storage.getHeroSlides();
    
    // Filter by date ranges if needed
    const now = new Date();
    const activeSlides = slides.filter(slide => {
      if (slide.startDate && new Date(slide.startDate) > now) return false;
      if (slide.endDate && new Date(slide.endDate) < now) return false;
      return true;
    });

    res.json({
      success: true,
      data: activeSlides
    });
  } catch (error) {
    console.error('Get hero slides error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch hero slides'
    });
  }
});

// Team members API
router.get('/team', async (req, res) => {
  try {
    const teamMembers = await storage.getTeamMembers();

    res.json({
      success: true,
      data: teamMembers
    });
  } catch (error) {
    console.error('Get team members error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch team members'
    });
  }
});

router.get('/team/:id', async (req, res) => {
  try {
    const teamMembers = await storage.getTeamMembers();
    const teamMember = teamMembers.find(member => member.id === Number(req.params.id));
    
    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    res.json({
      success: true,
      data: teamMember
    });
  } catch (error) {
    console.error('Get team member error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch team member'
    });
  }
});

// Blog posts API
router.get('/blog', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      featured
    } = req.query;

    const filters: any = { status: 'published' };
    
    if (category) filters.category = category;
    if (featured === 'true') filters.isFeatured = true;

    const posts = await storage.getBlogPosts(filters);
    
    // Simple pagination
    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const paginatedPosts = posts.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: {
        posts: paginatedPosts,
        pagination: {
          currentPage: Number(page),
          itemsPerPage: Number(limit),
          total: posts.length,
          totalPages: Math.ceil(posts.length / Number(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get blog posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blog posts'
    });
  }
});

router.get('/blog/post/:slug', async (req, res) => {
  try {
    const post = await storage.getBlogPostBySlug(req.params.slug);
    
    if (!post || post.status !== 'published') {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Get blog post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blog post'
    });
  }
});

// Settings API
router.get('/settings/:category', async (req, res) => {
  try {
    const settings = await storage.getSettingsByCategory(req.params.category);

    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch settings'
    });
  }
});

// Contact form submission
router.post('/contact', async (req, res) => {
  try {
    // For now, just log the contact form submission
    console.log('Contact form submission:', req.body);
    
    // In a real implementation, you would save to database or send email
    res.json({
      success: true,
      message: 'Thank you for your message. We will get back to you soon!'
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit contact form'
    });
  }
});

export default router;