const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const TeamMember = require('../../models/TeamMember.cjs');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../uploads/team');
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

// Edit member form
router.get('/edit/:id', async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);
    if (!member) {
      return res.render('admin/error', {
        title: 'Member Not Found - Temer Properties Admin',
        user: req.session.user,
        error: 'Team member not found'
      });
    }
    res.render('admin/team/form', {
      title: 'Edit Team Member - Temer Properties Admin',
      user: req.session.user,
      member,
      errors: {}
    });
  } catch (error) {
    console.error('Edit member error:', error);
    res.render('admin/error', {
      title: 'Team Error - Temer Properties Admin',
      user: req.session.user,
      error: 'Failed to load team member'
    });
  }
});

// Create member
router.post('/new', upload.single('image'), async (req, res) => {
  try {
    const {
      firstName, lastName, position, email, phone, bio, specialties,
      linkedin, twitter, facebook, instagram, displayOrder, isActive
    } = req.body;
    
    // Process specialties
    const specialtiesArray = specialties ? specialties.split(',').map(s => s.trim()).filter(s => s) : [];
    
    // Process social media
    const socialMedia = {};
    if (linkedin) socialMedia.linkedin = linkedin;
    if (twitter) socialMedia.twitter = twitter;
    if (facebook) socialMedia.facebook = facebook;
    if (instagram) socialMedia.instagram = instagram;
    
    const memberData = {
      firstName,
      lastName,
      position,
      email,
      phone,
      bio,
      specialties: specialtiesArray,
      socialMedia: Object.keys(socialMedia).length > 0 ? socialMedia : undefined,
      displayOrder: displayOrder ? parseInt(displayOrder) : 0,
      isActive: isActive === 'true',
      image: req.file ? `/uploads/team/${req.file.filename}` : null
    };
    
    const member = new TeamMember(memberData);
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

// Update member
router.post('/edit/:id', upload.single('image'), async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }
    
    const {
      firstName, lastName, position, email, phone, bio, specialties,
      linkedin, twitter, facebook, instagram, displayOrder, isActive
    } = req.body;
    
    // Process specialties
    const specialtiesArray = specialties ? specialties.split(',').map(s => s.trim()).filter(s => s) : [];
    
    // Process social media
    const socialMedia = {};
    if (linkedin) socialMedia.linkedin = linkedin;
    if (twitter) socialMedia.twitter = twitter;
    if (facebook) socialMedia.facebook = facebook;
    if (instagram) socialMedia.instagram = instagram;
    
    member.firstName = firstName;
    member.lastName = lastName;
    member.position = position;
    member.email = email;
    member.phone = phone;
    member.bio = bio;
    member.specialties = specialtiesArray;
    member.socialMedia = Object.keys(socialMedia).length > 0 ? socialMedia : {};
    member.displayOrder = displayOrder ? parseInt(displayOrder) : 0;
    member.isActive = isActive === 'true';
    
    if (req.file) {
      member.image = `/uploads/team/${req.file.filename}`;
    }
    
    await member.save();
    res.redirect('/admin/team');
  } catch (error) {
    console.error('Update member error:', error);
    res.render('admin/team/form', {
      title: 'Edit Team Member - Temer Properties Admin',
      user: req.session.user,
      member: req.body,
      errors: error.errors || { general: 'Failed to update team member' }
    });
  }
});

// Delete member
router.delete('/delete/:id', async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }
    
    // Delete image file if exists
    if (member.image && member.image.startsWith('/uploads/')) {
      const imagePath = path.join(__dirname, '../..', member.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    await TeamMember.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Team member deleted successfully' });
  } catch (error) {
    console.error('Delete member error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete team member' });
  }
});

module.exports = router;