const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../../models/User.cjs');
const Setting = require('../../models/Setting.cjs');

// Settings page
router.get('/', async (req, res) => {
  try {
    const settings = await Setting.find().sort({ category: 1, key: 1 });
    
    // Group settings by category
    const groupedSettings = {};
    settings.forEach(setting => {
      if (!groupedSettings[setting.category]) {
        groupedSettings[setting.category] = [];
      }
      groupedSettings[setting.category].push(setting);
    });

    res.render('admin/settings/index', {
      title: 'Settings - Temer Properties Admin',
      user: req.session.user,
      settings: groupedSettings
    });
  } catch (error) {
    console.error('Settings page error:', error);
    res.render('admin/error', {
      title: 'Settings Error - Temer Properties Admin',
      user: req.session.user,
      error: 'Failed to load settings'
    });
  }
});

// Change password page
router.get('/password', (req, res) => {
  res.render('admin/settings/password', {
    title: 'Change Password - Temer Properties Admin',
    user: req.session.user,
    error: null,
    success: null
  });
});

// Update password
router.post('/password', async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    
    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.render('admin/settings/password', {
        title: 'Change Password - Temer Properties Admin',
        user: req.session.user,
        error: 'All fields are required',
        success: null
      });
    }
    
    if (newPassword !== confirmPassword) {
      return res.render('admin/settings/password', {
        title: 'Change Password - Temer Properties Admin',
        user: req.session.user,
        error: 'New passwords do not match',
        success: null
      });
    }
    
    if (newPassword.length < 6) {
      return res.render('admin/settings/password', {
        title: 'Change Password - Temer Properties Admin',
        user: req.session.user,
        error: 'New password must be at least 6 characters',
        success: null
      });
    }

    // Get current user
    const user = await User.findById(req.session.user._id);
    if (!user) {
      return res.render('admin/settings/password', {
        title: 'Change Password - Temer Properties Admin',
        user: req.session.user,
        error: 'User not found',
        success: null
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.render('admin/settings/password', {
        title: 'Change Password - Temer Properties Admin',
        user: req.session.user,
        error: 'Current password is incorrect',
        success: null
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.render('admin/settings/password', {
      title: 'Change Password - Temer Properties Admin',
      user: req.session.user,
      error: null,
      success: 'Password updated successfully'
    });

  } catch (error) {
    console.error('Update password error:', error);
    res.render('admin/settings/password', {
      title: 'Change Password - Temer Properties Admin',
      user: req.session.user,
      error: 'Failed to update password',
      success: null
    });
  }
});

// Update contact settings
router.post('/contact', async (req, res) => {
  try {
    const { phone, whatsapp, email } = req.body;
    
    // Update or create settings
    await Setting.findOneAndUpdate(
      { key: 'contact_phone' },
      { 
        key: 'contact_phone',
        value: phone,
        type: 'string',
        description: 'Company phone number',
        category: 'contact',
        isEditable: true
      },
      { upsert: true }
    );

    await Setting.findOneAndUpdate(
      { key: 'contact_whatsapp' },
      { 
        key: 'contact_whatsapp',
        value: whatsapp,
        type: 'string', 
        description: 'Company WhatsApp number',
        category: 'contact',
        isEditable: true
      },
      { upsert: true }
    );

    await Setting.findOneAndUpdate(
      { key: 'contact_email' },
      { 
        key: 'contact_email',
        value: email,
        type: 'string',
        description: 'Company email address', 
        category: 'contact',
        isEditable: true
      },
      { upsert: true }
    );

    res.json({ success: true, message: 'Contact settings updated successfully' });
  } catch (error) {
    console.error('Update contact settings error:', error);
    res.status(500).json({ success: false, message: 'Failed to update contact settings' });
  }
});

// Update settings
router.post('/', async (req, res) => {
  try {
    const updates = req.body;
    
    for (const [key, value] of Object.entries(updates)) {
      await Setting.findOneAndUpdate(
        { key },
        { key, value, updatedAt: new Date() },
        { upsert: true, new: true }
      );
    }
    
    res.redirect('/admin/settings');
  } catch (error) {
    console.error('Update settings error:', error);
    res.redirect('/admin/settings');
  }
});

module.exports = router;