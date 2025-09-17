const express = require('express');
const router = express.Router();
const Setting = require('../../models/Setting');
const { sendError, sendSuccess } = require('../../lib/utils');

// Get public settings (company info, contact details, etc.)
router.get('/public', async (req, res) => {
  try {
    const publicCategories = ['general', 'company', 'contact', 'social'];
    
    const settings = await Setting.find({
      category: { $in: publicCategories }
    }).select('key value category').lean();

    // Group settings by category
    const groupedSettings = {};
    settings.forEach(setting => {
      if (!groupedSettings[setting.category]) {
        groupedSettings[setting.category] = {};
      }
      groupedSettings[setting.category][setting.key] = setting.value;
    });

    sendSuccess(res, groupedSettings);
  } catch (error) {
    console.error('Get public settings error:', error);
    sendError(res, 'Failed to fetch settings', 500);
  }
});

// Get specific setting by key (only public settings)
router.get('/public/:key', async (req, res) => {
  try {
    const { key } = req.params;
    
    const setting = await Setting.findOne({
      key,
      category: { $in: ['general', 'company', 'contact', 'social'] }
    }).select('key value').lean();

    if (!setting) {
      return sendError(res, 'Setting not found', 404);
    }

    sendSuccess(res, setting.value);
  } catch (error) {
    console.error('Get setting error:', error);
    sendError(res, 'Failed to fetch setting', 500);
  }
});

// Get company information
router.get('/company', async (req, res) => {
  try {
    const companySettings = await Setting.getSettingsByCategory('company');
    const contactSettings = await Setting.getSettingsByCategory('contact');
    
    const companyInfo = {
      ...companySettings,
      ...contactSettings
    };

    sendSuccess(res, companyInfo);
  } catch (error) {
    console.error('Get company info error:', error);
    sendError(res, 'Failed to fetch company information', 500);
  }
});

// Get social media links
router.get('/social', async (req, res) => {
  try {
    const socialSettings = await Setting.getSettingsByCategory('social');
    sendSuccess(res, socialSettings);
  } catch (error) {
    console.error('Get social settings error:', error);
    sendError(res, 'Failed to fetch social media links', 500);
  }
});

module.exports = router;