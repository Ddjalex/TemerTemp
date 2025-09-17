const mongoose = require('mongoose');

const heroSlideSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  subtitle: {
    type: String,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  image: {
    url: { type: String, required: true },
    alt: { type: String, required: true }
  },
  ctaButton: {
    text: { type: String, default: 'Learn More' },
    link: { type: String, default: '/listings' },
    isExternal: { type: Boolean, default: false }
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    default: null
  },
  order: {
    type: Number,
    required: true,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Index for ordering
heroSlideSchema.index({ order: 1, isActive: 1 });

// Method to check if slide is currently active
heroSlideSchema.methods.isCurrentlyActive = function() {
  const now = new Date();
  if (!this.isActive) return false;
  if (this.startDate && this.startDate > now) return false;
  if (this.endDate && this.endDate < now) return false;
  return true;
};

module.exports = mongoose.model('HeroSlide', heroSlideSchema);