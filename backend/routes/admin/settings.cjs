const express = require('express');
const router = express.Router();
const Setting = require('../../models/Setting.cjs');

// GET settings page
router.get('/', async (req, res) => {
  try {
    const { category = 'general' } = req.query;

    // Get settings by category
    const settings = await Setting.find({ category })
      .sort('key')
      .lean();

    // Get all categories for navigation
    const categories = await Setting.distinct('category');

    res.render('admin/settings/index', {
      title: 'Settings - Temer Properties Admin',
      settings,
      categories,
      currentCategory: category,
      user: req.user
    });
  } catch (error) {
    console.error('Settings page error:', error);
    res.status(500).render('admin/error', {
      title: 'Error - Temer Properties Admin',
      message: 'Failed to load settings',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
});

// POST update settings
router.post('/', async (req, res) => {
  try {
    const { category = 'general' } = req.query;
    const updates = req.body;

    // Update each setting
    for (const [key, value] of Object.entries(updates)) {
      if (key === 'category') continue; // Skip category field

      await Setting.findOneAndUpdate(
        { key },
        { 
          value,
          type: typeof value,
          category: category,
          updatedAt: new Date()
        },
        { upsert: true }
      );
    }

    res.redirect(`/admin/settings?category=${category}&success=Settings updated successfully`);
  } catch (error) {
    console.error('Update settings error:', error);
    res.redirect(`/admin/settings?category=${req.query.category || 'general'}&error=Failed to update settings`);
  }
});

// GET add new setting form
router.get('/new', (req, res) => {
  const { category = 'general' } = req.query;
  
  res.render('admin/settings/form', {
    title: 'Add New Setting - Temer Properties Admin',
    setting: null,
    category,
    isEdit: false,
    user: req.user
  });
});

// GET edit setting form
router.get('/:id/edit', async (req, res) => {
  try {
    const setting = await Setting.findById(req.params.id).lean();

    if (!setting) {
      return res.status(404).render('admin/error', {
        title: 'Error - Temer Properties Admin',
        message: 'Setting not found',
        status: 404
      });
    }

    res.render('admin/settings/form', {
      title: `Edit ${setting.key} - Temer Properties Admin`,
      setting,
      category: setting.category,
      isEdit: true,
      user: req.user
    });
  } catch (error) {
    console.error('Edit setting form error:', error);
    res.status(500).render('admin/error', {
      title: 'Error - Temer Properties Admin',
      message: 'Failed to load setting for editing',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
});

// POST create setting
router.post('/create', async (req, res) => {
  try {
    const { key, value, type, description, category, isEditable } = req.body;

    // Check if setting already exists
    const existingSetting = await Setting.findOne({ key });
    if (existingSetting) {
      return res.redirect(`/admin/settings/new?category=${category}&error=Setting key already exists`);
    }

    let processedValue = value;
    
    // Process value based on type
    switch (type) {
      case 'boolean':
        processedValue = value === 'true' || value === 'on';
        break;
      case 'number':
        processedValue = Number(value);
        break;
      case 'object':
      case 'array':
        try {
          processedValue = JSON.parse(value);
        } catch (e) {
          return res.redirect(`/admin/settings/new?category=${category}&error=Invalid JSON format for object/array`);
        }
        break;
      default:
        processedValue = value;
    }

    const setting = new Setting({
      key,
      value: processedValue,
      type,
      description,
      category,
      isEditable: isEditable === 'on'
    });

    await setting.save();
    res.redirect(`/admin/settings?category=${category}&success=Setting created successfully`);
  } catch (error) {
    console.error('Create setting error:', error);
    res.redirect(`/admin/settings/new?category=${req.body.category || 'general'}&error=Failed to create setting`);
  }
});

// PUT update setting
router.put('/:id', async (req, res) => {
  try {
    const setting = await Setting.findById(req.params.id);
    if (!setting) {
      return res.status(404).json({ error: 'Setting not found' });
    }

    const { key, value, type, description, category, isEditable } = req.body;

    // Check if key is changing and doesn't conflict
    if (key && key !== setting.key) {
      const existingSetting = await Setting.findOne({ key, _id: { $ne: setting._id } });
      if (existingSetting) {
        return res.redirect(`/admin/settings/${req.params.id}/edit?error=Setting key already exists`);
      }
    }

    let processedValue = value;
    
    // Process value based on type
    switch (type) {
      case 'boolean':
        processedValue = value === 'true' || value === 'on';
        break;
      case 'number':
        processedValue = Number(value);
        break;
      case 'object':
      case 'array':
        try {
          processedValue = JSON.parse(value);
        } catch (e) {
          return res.redirect(`/admin/settings/${req.params.id}/edit?error=Invalid JSON format for object/array`);
        }
        break;
      default:
        processedValue = value;
    }

    setting.key = key;
    setting.value = processedValue;
    setting.type = type;
    setting.description = description;
    setting.category = category;
    setting.isEditable = isEditable === 'on';

    await setting.save();
    res.redirect(`/admin/settings?category=${category}&success=Setting updated successfully`);
  } catch (error) {
    console.error('Update setting error:', error);
    res.redirect(`/admin/settings/${req.params.id}/edit?error=Failed to update setting`);
  }
});

// DELETE setting
router.delete('/:id', async (req, res) => {
  try {
    const setting = await Setting.findById(req.params.id);
    if (!setting) {
      return res.status(404).json({ error: 'Setting not found' });
    }

    if (!setting.isEditable) {
      return res.status(400).json({ error: 'This setting cannot be deleted' });
    }

    await Setting.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Setting deleted successfully' });
  } catch (error) {
    console.error('Delete setting error:', error);
    res.status(500).json({ error: 'Failed to delete setting' });
  }
});

// POST seed default settings
router.post('/seed', async (req, res) => {
  try {
    const defaultSettings = [
      // Company settings
      { key: 'company_name', value: 'Temer Properties', type: 'string', category: 'company', description: 'Company name' },
      { key: 'company_tagline', value: 'Your Trusted Real Estate Partner', type: 'string', category: 'company', description: 'Company tagline' },
      { key: 'company_description', value: 'Temer Properties is a leading real estate agency helping clients buy, sell, and rent properties.', type: 'string', category: 'company', description: 'Company description' },
      
      // Contact settings
      { key: 'contact_phone', value: '(555) 123-4567', type: 'string', category: 'contact', description: 'Main phone number' },
      { key: 'contact_email', value: 'info@temerproperties.com', type: 'string', category: 'contact', description: 'Main email address' },
      { key: 'contact_address', value: '123 Real Estate Blvd, City, State 12345', type: 'string', category: 'contact', description: 'Office address' },
      
      // Social media settings
      { key: 'social_facebook', value: 'https://facebook.com/temerproperties', type: 'string', category: 'social', description: 'Facebook page URL' },
      { key: 'social_instagram', value: 'https://instagram.com/temerproperties', type: 'string', category: 'social', description: 'Instagram profile URL' },
      { key: 'social_twitter', value: 'https://twitter.com/temerproperties', type: 'string', category: 'social', description: 'Twitter profile URL' },
      { key: 'social_linkedin', value: 'https://linkedin.com/company/temerproperties', type: 'string', category: 'social', description: 'LinkedIn company URL' },
      
      // General settings
      { key: 'site_currency', value: 'ETB', type: 'string', category: 'general', description: 'Default currency' },
      { key: 'properties_per_page', value: 12, type: 'number', category: 'general', description: 'Properties per page' },
      { key: 'blog_posts_per_page', value: 10, type: 'number', category: 'general', description: 'Blog posts per page' }
    ];

    for (const setting of defaultSettings) {
      await Setting.findOneAndUpdate(
        { key: setting.key },
        setting,
        { upsert: true }
      );
    }

    res.redirect('/admin/settings?success=Default settings seeded successfully');
  } catch (error) {
    console.error('Seed settings error:', error);
    res.redirect('/admin/settings?error=Failed to seed default settings');
  }
});

module.exports = router;