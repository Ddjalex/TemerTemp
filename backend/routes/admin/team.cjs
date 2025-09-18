const express = require('express');
const router = express.Router();
const TeamMember = require('../../models/TeamMember.cjs');

// Team members list
router.get('/', async (req, res) => {
  try {
    const members = await TeamMember.find().sort({ displayOrder: 1 });
    res.render('admin/team/index', {
      title: 'Team Members - Temer Properties Admin',
      user: req.session.user,
      members
    });
  } catch (error) {
    console.error('Team members error:', error);
    res.render('admin/error', {
      title: 'Team Error - Temer Properties Admin',
      user: req.session.user,
      error: 'Failed to load team members'
    });
  }
});

// New member form
router.get('/new', (req, res) => {
  res.render('admin/team/form', {
    title: 'New Team Member - Temer Properties Admin',
    user: req.session.user,
    member: null,
    errors: {}
  });
});

// Create member
router.post('/new', async (req, res) => {
  try {
    const member = new TeamMember(req.body);
    await member.save();
    res.redirect('/admin/team');
  } catch (error) {
    console.error('Create member error:', error);
    res.render('admin/team/form', {
      title: 'New Team Member - Temer Properties Admin',
      user: req.session.user,
      member: req.body,
      errors: error.errors || { general: 'Failed to create team member' }
    });
  }
});

module.exports = router;