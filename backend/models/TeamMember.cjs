const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  position: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  bio: {
    type: String,
    required: true,
    maxlength: 1000
  },
  photo: {
    url: { type: String, required: true },
    alt: { type: String }
  },
  contact: {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    whatsapp: {
      type: String,
      trim: true
    }
  },
  socialMedia: {
    linkedin: { type: String, trim: true },
    twitter: { type: String, trim: true },
    facebook: { type: String, trim: true },
    instagram: { type: String, trim: true },
    telegram: { type: String, trim: true }
  },
  specialties: [{
    type: String,
    trim: true
  }],
  languages: [{
    type: String,
    trim: true
  }],
  experience: {
    yearsInBusiness: { type: Number, min: 0 },
    propertiesSold: { type: Number, min: 0, default: 0 },
    totalSalesVolume: { type: Number, min: 0, default: 0 }
  },
  certifications: [{
    name: { type: String, required: true },
    issuingOrganization: { type: String },
    year: { type: Number }
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for display ordering
teamMemberSchema.index({ order: 1, isActive: 1 });

// Virtual for full name
teamMemberSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Method to get formatted phone number
teamMemberSchema.methods.getFormattedPhone = function() {
  const phone = this.contact.phone.replace(/\D/g, '');
  if (phone.length === 10) {
    return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`;
  }
  return this.contact.phone;
};

module.exports = mongoose.model('TeamMember', teamMemberSchema);