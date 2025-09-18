const express = require('express');
const router = express.Router();
const Setting = require('../../models/Setting.cjs');

// Settings page
router.get('/', async (req, res) => {
  try {
    const settings = await Setting.find();
    const settingsObj = {};
    settings.forEach(setting => {
      settingsObj[setting.key] = setting.value;
    });

    res.render('admin/settings/index', {
      title: 'Settings - Temer Properties Admin',
      user: req.session.user,
      settings: settingsObj
    });
  } catch (error) {
    console.error('Settings error:', error);
    res.render('admin/error', {
      title: 'Settings Error - Temer Properties Admin',
      user: req.session.user,
      error: 'Failed to load settings'
    });
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