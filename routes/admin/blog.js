const express = require('express');
const router = express.Router();
const BlogPost = require('../../models/BlogPost');
const User = require('../../models/User');
const { uploadConfigs } = require('../../lib/storage');
const { paginate, generateSlug, sanitizeContent } = require('../../lib/utils');

// GET blog posts list
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      status,
      category,
      author,
      sort = '-createdAt'
    } = req.query;

    // Build filter
    const filter = {};
    if (search) {
      filter.$text = { $search: search };
    }
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (author) filter.author = author;

    // Get total count
    const total = await BlogPost.countDocuments(filter);
    const pagination = paginate(page, limit, total);

    // Get blog posts
    const posts = await BlogPost.find(filter)
      .populate('author', 'firstName lastName email')
      .sort(sort)
      .skip(pagination.skip)
      .limit(pagination.itemsPerPage)
      .lean();

    // Get authors for filter dropdown
    const authors = await User.find({ role: { $in: ['admin', 'agent'] }, isActive: true })
      .select('firstName lastName')
      .sort('firstName')
      .lean();

    res.render('admin/blog/index', {
      title: 'Blog Posts - Temer Properties Admin',
      posts,
      pagination,
      authors,
      filters: { search, status, category, author, sort },
      user: req.user
    });
  } catch (error) {
    console.error('Blog posts list error:', error);
    res.status(500).render('admin/error', {
      title: 'Error - Temer Properties Admin',
      message: 'Failed to load blog posts',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
});

// GET new blog post form
router.get('/new', async (req, res) => {
  try {
    const authors = await User.find({ role: { $in: ['admin', 'agent'] }, isActive: true })
      .select('firstName lastName')
      .sort('firstName')
      .lean();

    res.render('admin/blog/form', {
      title: 'Create New Blog Post - Temer Properties Admin',
      post: null,
      authors,
      isEdit: false,
      user: req.user
    });
  } catch (error) {
    console.error('New blog post form error:', error);
    res.status(500).render('admin/error', {
      title: 'Error - Temer Properties Admin',
      message: 'Failed to load blog post form',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
});

// GET edit blog post form
router.get('/:id/edit', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id)
      .populate('author', 'firstName lastName')
      .lean();

    if (!post) {
      return res.status(404).render('admin/error', {
        title: 'Error - Temer Properties Admin',
        message: 'Blog post not found',
        status: 404
      });
    }

    const authors = await User.find({ role: { $in: ['admin', 'agent'] }, isActive: true })
      .select('firstName lastName')
      .sort('firstName')
      .lean();

    res.render('admin/blog/form', {
      title: `Edit "${post.title}" - Temer Properties Admin`,
      post,
      authors,
      isEdit: true,
      user: req.user
    });
  } catch (error) {
    console.error('Edit blog post form error:', error);
    res.status(500).render('admin/error', {
      title: 'Error - Temer Properties Admin',
      message: 'Failed to load blog post for editing',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
});

// POST create blog post
router.post('/', uploadConfigs.blog.single('featuredImage'), async (req, res) => {
  try {
    const {
      title,
      slug,
      excerpt,
      content,
      author,
      category,
      tags,
      status,
      isFeatured,
      metaTitle,
      metaDescription,
      keywords
    } = req.body;

    if (!req.file) {
      return res.redirect('/admin/blog/new?error=Featured image is required');
    }

    // Generate slug if not provided
    const postSlug = slug || generateSlug(title);

    // Check if slug already exists
    const existingPost = await BlogPost.findOne({ slug: postSlug });
    if (existingPost) {
      return res.redirect('/admin/blog/new?error=Slug already exists');
    }

    const post = new BlogPost({
      title,
      slug: postSlug,
      excerpt,
      content: sanitizeContent(content),
      featuredImage: {
        url: `/uploads/blog/${req.file.filename}`,
        alt: title
      },
      author,
      category,
      tags: tags ? tags.split(',').map(tag => tag.trim().toLowerCase()) : [],
      status,
      isFeatured: isFeatured === 'on',
      seo: {
        metaTitle: metaTitle || title,
        metaDescription: metaDescription || excerpt,
        keywords: keywords ? keywords.split(',').map(k => k.trim()) : []
      }
    });

    await post.save();
    res.redirect('/admin/blog?success=Blog post created successfully');
  } catch (error) {
    console.error('Create blog post error:', error);
    res.redirect('/admin/blog/new?error=Failed to create blog post');
  }
});

// PUT update blog post
router.put('/:id', uploadConfigs.blog.single('featuredImage'), async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    const {
      title,
      slug,
      excerpt,
      content,
      author,
      category,
      tags,
      status,
      isFeatured,
      metaTitle,
      metaDescription,
      keywords
    } = req.body;

    // Check if slug is changing and doesn't conflict
    if (slug && slug !== post.slug) {
      const existingPost = await BlogPost.findOne({ slug, _id: { $ne: post._id } });
      if (existingPost) {
        return res.redirect(`/admin/blog/${req.params.id}/edit?error=Slug already exists`);
      }
      post.slug = slug;
    }

    post.title = title;
    post.excerpt = excerpt;
    post.content = sanitizeContent(content);
    post.author = author;
    post.category = category;
    post.tags = tags ? tags.split(',').map(tag => tag.trim().toLowerCase()) : [];
    post.status = status;
    post.isFeatured = isFeatured === 'on';
    post.seo = {
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || excerpt,
      keywords: keywords ? keywords.split(',').map(k => k.trim()) : []
    };

    // Update featured image if new one uploaded
    if (req.file) {
      post.featuredImage = {
        url: `/uploads/blog/${req.file.filename}`,
        alt: title
      };
    }

    await post.save();
    res.redirect('/admin/blog?success=Blog post updated successfully');
  } catch (error) {
    console.error('Update blog post error:', error);
    res.redirect(`/admin/blog/${req.params.id}/edit?error=Failed to update blog post`);
  }
});

// DELETE blog post
router.delete('/:id', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    await BlogPost.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Delete blog post error:', error);
    res.status(500).json({ error: 'Failed to delete blog post' });
  }
});

// GET blog post preview
router.get('/:id/preview', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id)
      .populate('author', 'firstName lastName avatar')
      .lean();

    if (!post) {
      return res.status(404).render('admin/error', {
        title: 'Error - Temer Properties Admin',
        message: 'Blog post not found',
        status: 404
      });
    }

    res.render('admin/blog/preview', {
      title: `Preview: ${post.title} - Temer Properties Admin`,
      post,
      user: req.user
    });
  } catch (error) {
    console.error('Blog post preview error:', error);
    res.status(500).render('admin/error', {
      title: 'Error - Temer Properties Admin',
      message: 'Failed to load blog post preview',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
});

module.exports = router;