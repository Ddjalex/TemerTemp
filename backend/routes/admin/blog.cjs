const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const BlogPost = require('../../models/BlogPost.cjs');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../uploads/blog');
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
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Blog posts list
router.get('/', async (req, res) => {
  try {
    const posts = await BlogPost.find().sort({ updatedAt: -1 });
    res.render('admin/blog/index', {
      title: 'Blog Posts - Temer Properties Admin',
      user: req.session.user,
      posts
    });
  } catch (error) {
    console.error('Blog list error:', error);
    res.render('admin/error', {
      title: 'Blog Error - Temer Properties Admin',
      user: req.session.user,
      error: 'Failed to load blog posts'
    });
  }
});

// New post form
router.get('/new', (req, res) => {
  res.render('admin/blog/form', {
    title: 'New Blog Post - Temer Properties Admin',
    user: req.session.user,
    post: null,
    errors: {}
  });
});

// Edit post form
router.get('/edit/:id', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.render('admin/error', {
        title: 'Post Not Found - Temer Properties Admin',
        user: req.session.user,
        error: 'Blog post not found'
      });
    }
    res.render('admin/blog/form', {
      title: 'Edit Blog Post - Temer Properties Admin',
      user: req.session.user,
      post,
      errors: {}
    });
  } catch (error) {
    console.error('Edit post error:', error);
    res.render('admin/error', {
      title: 'Blog Error - Temer Properties Admin',
      user: req.session.user,
      error: 'Failed to load blog post'
    });
  }
});

// Create post
router.post('/new', upload.single('featuredImage'), async (req, res) => {
  try {
    const { title, slug, excerpt, content, tags, isPublished, publishedAt } = req.body;
    
    // Process tags
    const tagArray = tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
    
    const postData = {
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
      excerpt,
      content,
      tags: tagArray,
      isPublished: isPublished === 'true',
      publishedAt: publishedAt ? new Date(publishedAt) : (isPublished === 'true' ? new Date() : null),
      featuredImage: req.file ? `/uploads/blog/${req.file.filename}` : null
    };
    
    const post = new BlogPost(postData);
    await post.save();
    res.redirect('/admin/blog');
  } catch (error) {
    console.error('Create post error:', error);
    res.render('admin/blog/form', {
      title: 'New Blog Post - Temer Properties Admin',
      user: req.session.user,
      post: req.body,
      errors: error.errors || { general: 'Failed to create post' }
    });
  }
});

// Update post
router.post('/edit/:id', upload.single('featuredImage'), async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    
    const { title, slug, excerpt, content, tags, isPublished, publishedAt } = req.body;
    
    // Process tags
    const tagArray = tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
    
    post.title = title;
    post.slug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    post.excerpt = excerpt;
    post.content = content;
    post.tags = tagArray;
    post.isPublished = isPublished === 'true';
    post.publishedAt = publishedAt ? new Date(publishedAt) : (isPublished === 'true' && !post.publishedAt ? new Date() : post.publishedAt);
    
    if (req.file) {
      post.featuredImage = `/uploads/blog/${req.file.filename}`;
    }
    
    await post.save();
    res.redirect('/admin/blog');
  } catch (error) {
    console.error('Update post error:', error);
    res.render('admin/blog/form', {
      title: 'Edit Blog Post - Temer Properties Admin',
      user: req.session.user,
      post: req.body,
      errors: error.errors || { general: 'Failed to update post' }
    });
  }
});

// Delete post
router.delete('/delete/:id', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    
    // Delete featured image file if exists
    if (post.featuredImage && post.featuredImage.startsWith('/uploads/')) {
      const imagePath = path.join(__dirname, '../..', post.featuredImage);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    await BlogPost.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete post' });
  }
});

module.exports = router;