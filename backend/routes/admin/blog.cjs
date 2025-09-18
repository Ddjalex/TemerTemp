const express = require('express');
const router = express.Router();
const BlogPost = require('../../models/BlogPost.cjs');

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

// Create post
router.post('/new', async (req, res) => {
  try {
    const post = new BlogPost(req.body);
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

module.exports = router;