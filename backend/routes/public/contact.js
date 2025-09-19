const express = require('express');
const router = express.Router();
const { isValidEmail, isValidPhone, sendError, sendSuccess } = require('../../lib/utils.js');


// Contact form submission
router.post('/submit', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      subject,
      message,
      propertyId,
      type = 'general' // general, property-inquiry, callback-request
    } = req.body;

    // Validation
    if (!name || name.trim().length < 2) {
      return sendError(res, 'Name is required and must be at least 2 characters', 400);
    }

    if (!email || !isValidEmail(email)) {
      return sendError(res, 'Valid email address is required', 400);
    }

    if (phone && !isValidPhone(phone)) {
      return sendError(res, 'Please provide a valid phone number', 400);
    }

    if (!message || message.trim().length < 10) {
      return sendError(res, 'Message is required and must be at least 10 characters', 400);
    }

    // Create contact submission object
    const contactSubmission = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone ? phone.trim() : null,
      subject: subject ? subject.trim() : null,
      message: message.trim(),
      propertyId: propertyId || null,
      type,
      submittedAt: new Date(),
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent')
    };

    // In a real application, you would:
    // 1. Save to database
    // 2. Send email notification to admin
    // 3. Send confirmation email to user
    // 4. Integrate with CRM system

    console.log('Contact form submission:', contactSubmission);

    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    sendSuccess(res, null, 'Thank you for your message. We will get back to you soon!');
  } catch (error) {
    console.error('Contact form submission error:', error);
    sendError(res, 'Failed to submit contact form. Please try again.', 500);
  }
});

// Property inquiry (specific property interest)
router.post('/property-inquiry', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      message,
      propertyId,
      inquiryType = 'viewing' // viewing, price-info, availability
    } = req.body;

    // Validation
    if (!name || name.trim().length < 2) {
      return sendError(res, 'Name is required', 400);
    }

    if (!email || !isValidEmail(email)) {
      return sendError(res, 'Valid email address is required', 400);
    }

    if (!propertyId) {
      return sendError(res, 'Property ID is required', 400);
    }

    // Verify property exists
    const Property = require('../../models/Property.js');
    const property = await Property.findOne({ _id: propertyId, isActive: true });
    
    if (!property) {
      return sendError(res, 'Property not found', 404);
    }

    const inquiry = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone ? phone.trim() : null,
      message: message ? message.trim() : null,
      propertyId,
      inquiryType,
      property: {
        title: property.title,
        address: property.fullAddress,
        price: property.price
      },
      submittedAt: new Date(),
      ip: req.ip || req.connection.remoteAddress
    };

    console.log('Property inquiry:', inquiry);

    // In a real application, you would:
    // 1. Save to database
    // 2. Send notification to property agent
    // 3. Send confirmation email to inquirer
    // 4. Create lead in CRM

    sendSuccess(res, null, 'Your inquiry has been sent to the property agent. They will contact you soon!');
  } catch (error) {
    console.error('Property inquiry error:', error);
    sendError(res, 'Failed to submit property inquiry. Please try again.', 500);
  }
});

// Callback request
router.post('/callback-request', async (req, res) => {
  try {
    const {
      name,
      phone,
      preferredTime,
      subject,
      propertyId
    } = req.body;

    // Validation
    if (!name || name.trim().length < 2) {
      return sendError(res, 'Name is required', 400);
    }

    if (!phone || !isValidPhone(phone)) {
      return sendError(res, 'Valid phone number is required', 400);
    }

    const callbackRequest = {
      name: name.trim(),
      phone: phone.trim(),
      preferredTime: preferredTime || null,
      subject: subject ? subject.trim() : null,
      propertyId: propertyId || null,
      requestedAt: new Date(),
      ip: req.ip || req.connection.remoteAddress
    };

    console.log('Callback request:', callbackRequest);

    // In a real application, you would:
    // 1. Save to database
    // 2. Add to callback queue
    // 3. Send notification to sales team
    // 4. Send confirmation SMS/email

    sendSuccess(res, null, 'Callback request received. We will call you back soon!');
  } catch (error) {
    console.error('Callback request error:', error);
    sendError(res, 'Failed to submit callback request. Please try again.', 500);
  }
});

// Newsletter subscription
router.post('/newsletter', async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email || !isValidEmail(email)) {
      return sendError(res, 'Valid email address is required', 400);
    }

    const subscription = {
      email: email.toLowerCase().trim(),
      name: name ? name.trim() : null,
      subscribedAt: new Date(),
      ip: req.ip || req.connection.remoteAddress
    };

    console.log('Newsletter subscription:', subscription);

    // In a real application, you would:
    // 1. Save to database
    // 2. Add to email marketing platform
    // 3. Send welcome email
    // 4. Check for existing subscription

    sendSuccess(res, null, 'Thank you for subscribing to our newsletter!');
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    sendError(res, 'Failed to subscribe to newsletter. Please try again.', 500);
  }
});

module.exports = router;