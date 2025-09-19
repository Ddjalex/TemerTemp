const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../../models/User.js');
const Setting = require('../../models/Setting.js');

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

// URL validation function
function validateURL(url) {
  if (!url || url.trim() === '') return ''; // Allow empty URLs
  
  try {
    const urlObj = new URL(url);
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return null; // Invalid protocol
    }
    return urlObj.toString(); // Return normalized URL
  } catch (error) {
    return null; // Invalid URL format
  }
}

// Update social media settings
router.post('/social', async (req, res) => {
  try {
    const { facebook, twitter, instagram, linkedin, youtube } = req.body;
    
    // Validate and normalize URLs
    const urls = {
      facebook: validateURL(facebook),
      twitter: validateURL(twitter),
      instagram: validateURL(instagram),
      linkedin: validateURL(linkedin),
      youtube: validateURL(youtube)
    };
    
    // Check for invalid URLs
    const invalidUrls = [];
    Object.entries(urls).forEach(([platform, url]) => {
      if (url === null && req.body[platform] && req.body[platform].trim() !== '') {
        invalidUrls.push(platform);
      }
    });
    
    if (invalidUrls.length > 0) {
      return res.json({
        success: false,
        message: `Invalid URLs for: ${invalidUrls.join(', ')}. Please use valid http/https URLs.`
      });
    }
    
    // Update social media settings
    const socialSettings = [
      { key: 'social_facebook', value: urls.facebook, description: 'Facebook page URL' },
      { key: 'social_twitter', value: urls.twitter, description: 'Twitter profile URL' },
      { key: 'social_instagram', value: urls.instagram, description: 'Instagram profile URL' },
      { key: 'social_linkedin', value: urls.linkedin, description: 'LinkedIn company URL' },
      { key: 'social_youtube', value: urls.youtube, description: 'YouTube channel URL' }
    ];

    // Save each setting
    for (const settingData of socialSettings) {
      await Setting.setSetting(
        settingData.key,
        settingData.value,
        'string',
        settingData.description,
        'social'
      );
    }

    res.json({
      success: true,
      message: 'Social media links updated successfully'
    });

  } catch (error) {
    console.error('Update social media settings error:', error);
    res.json({
      success: false,
      message: 'Failed to update social media links'
    });
  }
});

module.exports = router;