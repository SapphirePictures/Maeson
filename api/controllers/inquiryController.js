const Inquiry = require('../models/Inquiry');
const Property = require('../models/Property');
const nodemailer = require('nodemailer');

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// @desc    Create inquiry
// @route   POST /api/inquiries
// @access  Private
exports.createInquiry = async (req, res, next) => {
  try {
    const { property, message, inquiryType, preferredContactMethod, name, email, phone } = req.body;

    // Check if property exists
    const propertyDoc = await Property.findById(property).populate('owner agent');

    if (!propertyDoc) {
      return res.status(404).json({
        status: 'error',
        message: 'Property not found'
      });
    }

    // Determine recipient (agent or owner)
    const recipient = propertyDoc.agent || propertyDoc.owner;

    // Create inquiry
    const inquiry = await Inquiry.create({
      property,
      sender: req.user.id,
      recipient: recipient._id,
      name: name || `${req.user.firstName} ${req.user.lastName}`,
      email: email || req.user.email,
      phone: phone || req.user.phone,
      message,
      inquiryType,
      preferredContactMethod
    });

    // Send email notification to property owner/agent
    try {
      const transporter = createTransporter();
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: recipient.email,
        subject: `New Inquiry for ${propertyDoc.title}`,
        html: `
          <h2>New Property Inquiry</h2>
          <p><strong>Property:</strong> ${propertyDoc.title}</p>
          <p><strong>From:</strong> ${inquiry.name} (${inquiry.email})</p>
          <p><strong>Phone:</strong> ${inquiry.phone}</p>
          <p><strong>Type:</strong> ${inquiryType}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
          <p><strong>Preferred Contact:</strong> ${preferredContactMethod}</p>
        `
      });
    } catch (emailError) {
      console.error('Error sending email:', emailError);
    }

    res.status(201).json({
      status: 'success',
      message: 'Inquiry sent successfully',
      data: inquiry
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's inquiries (sent)
// @route   GET /api/inquiries/sent
// @access  Private
exports.getSentInquiries = async (req, res, next) => {
  try {
    const inquiries = await Inquiry.find({ sender: req.user.id })
      .populate('property', 'title price images address')
      .populate('recipient', 'firstName lastName email phone')
      .sort('-createdAt');

    res.status(200).json({
      status: 'success',
      count: inquiries.length,
      data: inquiries
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's inquiries (received)
// @route   GET /api/inquiries/received
// @access  Private
exports.getReceivedInquiries = async (req, res, next) => {
  try {
    const inquiries = await Inquiry.find({ recipient: req.user.id })
      .populate('property', 'title price images address')
      .populate('sender', 'firstName lastName email phone')
      .sort('-createdAt');

    res.status(200).json({
      status: 'success',
      count: inquiries.length,
      data: inquiries
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update inquiry status
// @route   PUT /api/inquiries/:id/status
// @access  Private
exports.updateInquiryStatus = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({
        status: 'error',
        message: 'Inquiry not found'
      });
    }

    // Only recipient can update status
    if (inquiry.recipient.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to update this inquiry'
      });
    }

    inquiry.status = req.body.status;
    if (req.body.response) {
      inquiry.response = req.body.response;
      inquiry.respondedAt = Date.now();
    }

    await inquiry.save();

    res.status(200).json({
      status: 'success',
      message: 'Inquiry updated successfully',
      data: inquiry
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete inquiry
// @route   DELETE /api/inquiries/:id
// @access  Private
exports.deleteInquiry = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({
        status: 'error',
        message: 'Inquiry not found'
      });
    }

    // Only sender can delete
    if (inquiry.sender.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to delete this inquiry'
      });
    }

    await inquiry.deleteOne();

    res.status(200).json({
      status: 'success',
      message: 'Inquiry deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
