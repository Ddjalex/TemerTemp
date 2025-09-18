const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    trim: true
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  type: {
    type: String,
    enum: ['string', 'number', 'boolean', 'object', 'array'],
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['general', 'company', 'contact', 'social', 'seo', 'theme', 'features']
  },
  isEditable: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for quick lookups
settingSchema.index({ key: 1 });
settingSchema.index({ category: 1 });

// Static method to get setting by key
settingSchema.statics.getSetting = async function(key, defaultValue = null) {
  try {
    const setting = await this.findOne({ key });
    return setting ? setting.value : defaultValue;
  } catch (error) {
    console.error(`Error getting setting ${key}:`, error);
    return defaultValue;
  }
};

// Static method to set setting
settingSchema.statics.setSetting = async function(key, value, type = 'string', description = '', category = 'general') {
  try {
    const setting = await this.findOneAndUpdate(
      { key },
      { value, type, description, category },
      { upsert: true, new: true }
    );
    return setting;
  } catch (error) {
    console.error(`Error setting ${key}:`, error);
    throw error;
  }
};

// Static method to get settings by category
settingSchema.statics.getSettingsByCategory = async function(category) {
  try {
    const settings = await this.find({ category });
    const result = {};
    settings.forEach(setting => {
      result[setting.key] = setting.value;
    });
    return result;
  } catch (error) {
    console.error(`Error getting settings for category ${category}:`, error);
    return {};
  }
};

module.exports = mongoose.model('Setting', settingSchema);