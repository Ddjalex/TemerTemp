const express = require('express');
const router = express.Router();
const TeamMember = require('../../models/TeamMember');
const User = require('../../models/User');
const { uploadConfigs } = require('../../lib/storage');
const { paginate } = require('../../lib/utils');

// GET team members list
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const total = await TeamMember.countDocuments();
    const pagination = paginate(page, limit, total);

    const members = await TeamMember.find()
      .populate('user', 'firstName lastName email')
      .sort('order')
      .skip(pagination.skip)
      .limit(pagination.itemsPerPage)
      .lean();

    res.render('admin/team/index', {
      title: 'Team Members - Temer Properties Admin',
      members,
      pagination,
      user: req.user
    });
  } catch (error) {
    console.error('Team members list error:', error);
    res.status(500).render('admin/error', {
      title: 'Error - Temer Properties Admin',
      message: 'Failed to load team members',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
});

// GET new team member form
router.get('/new', async (req, res) => {
  try {
    const users = await User.find({ role: { $in: ['agent', 'admin'] }, isActive: true })
      .select('firstName lastName email')
      .sort('firstName')
      .lean();

    res.render('admin/team/form', {
      title: 'Add New Team Member - Temer Properties Admin',
      member: null,
      users,
      isEdit: false,
      user: req.user
    });
  } catch (error) {
    console.error('New team member form error:', error);
    res.status(500).render('admin/error', {
      title: 'Error - Temer Properties Admin',
      message: 'Failed to load team member form',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
});

// GET edit team member form
router.get('/:id/edit', async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id)
      .populate('user', 'firstName lastName email')
      .lean();

    if (!member) {
      return res.status(404).render('admin/error', {
        title: 'Error - Temer Properties Admin',
        message: 'Team member not found',
        status: 404
      });
    }

    const users = await User.find({ role: { $in: ['agent', 'admin'] }, isActive: true })
      .select('firstName lastName email')
      .sort('firstName')
      .lean();

    res.render('admin/team/form', {
      title: `Edit ${member.firstName} ${member.lastName} - Temer Properties Admin`,
      member,
      users,
      isEdit: true,
      user: req.user
    });
  } catch (error) {
    console.error('Edit team member form error:', error);
    res.status(500).render('admin/error', {
      title: 'Error - Temer Properties Admin',
      message: 'Failed to load team member for editing',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
});

// POST create team member
router.post('/', uploadConfigs.team.single('photo'), async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      position,
      bio,
      email,
      phone,
      whatsapp,
      linkedin,
      twitter,
      facebook,
      instagram,
      specialties,
      languages,
      yearsInBusiness,
      propertiesSold,
      totalSalesVolume,
      user,
      isActive,
      order
    } = req.body;

    if (!req.file) {
      return res.redirect('/admin/team/new?error=Photo is required');
    }

    const member = new TeamMember({
      firstName,
      lastName,
      position,
      bio,
      photo: {
        url: `/uploads/team/${req.file.filename}`,
        alt: `${firstName} ${lastName}`
      },
      contact: {
        email,
        phone,
        whatsapp: whatsapp || null
      },
      socialMedia: {
        linkedin: linkedin || null,
        twitter: twitter || null,
        facebook: facebook || null,
        instagram: instagram || null
      },
      specialties: specialties ? specialties.split(',').map(s => s.trim()) : [],
      languages: languages ? languages.split(',').map(l => l.trim()) : [],
      experience: {
        yearsInBusiness: yearsInBusiness ? Number(yearsInBusiness) : 0,
        propertiesSold: propertiesSold ? Number(propertiesSold) : 0,
        totalSalesVolume: totalSalesVolume ? Number(totalSalesVolume) : 0
      },
      user: user || null,
      isActive: isActive === 'on',
      order: Number(order) || 0
    });

    await member.save();
    res.redirect('/admin/team?success=Team member created successfully');
  } catch (error) {
    console.error('Create team member error:', error);
    res.redirect('/admin/team/new?error=Failed to create team member');
  }
});

// PUT update team member
router.put('/:id', uploadConfigs.team.single('photo'), async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ error: 'Team member not found' });
    }

    const {
      firstName,
      lastName,
      position,
      bio,
      email,
      phone,
      whatsapp,
      linkedin,
      twitter,
      facebook,
      instagram,
      specialties,
      languages,
      yearsInBusiness,
      propertiesSold,
      totalSalesVolume,
      user,
      isActive,
      order
    } = req.body;

    member.firstName = firstName;
    member.lastName = lastName;
    member.position = position;
    member.bio = bio;
    member.contact = {
      email,
      phone,
      whatsapp: whatsapp || null
    };
    member.socialMedia = {
      linkedin: linkedin || null,
      twitter: twitter || null,
      facebook: facebook || null,
      instagram: instagram || null
    };
    member.specialties = specialties ? specialties.split(',').map(s => s.trim()) : [];
    member.languages = languages ? languages.split(',').map(l => l.trim()) : [];
    member.experience = {
      yearsInBusiness: yearsInBusiness ? Number(yearsInBusiness) : 0,
      propertiesSold: propertiesSold ? Number(propertiesSold) : 0,
      totalSalesVolume: totalSalesVolume ? Number(totalSalesVolume) : 0
    };
    member.user = user || null;
    member.isActive = isActive === 'on';
    member.order = Number(order) || 0;

    // Update photo if new one uploaded
    if (req.file) {
      member.photo = {
        url: `/uploads/team/${req.file.filename}`,
        alt: `${firstName} ${lastName}`
      };
    }

    await member.save();
    res.redirect('/admin/team?success=Team member updated successfully');
  } catch (error) {
    console.error('Update team member error:', error);
    res.redirect(`/admin/team/${req.params.id}/edit?error=Failed to update team member`);
  }
});

// DELETE team member
router.delete('/:id', async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ error: 'Team member not found' });
    }

    await TeamMember.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Team member deleted successfully' });
  } catch (error) {
    console.error('Delete team member error:', error);
    res.status(500).json({ error: 'Failed to delete team member' });
  }
});

module.exports = router;