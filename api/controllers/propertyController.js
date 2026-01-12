const Property = require('../models/Property');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinary');

// @desc    Get all properties
// @route   GET /api/properties
// @access  Public
exports.getProperties = async (req, res, next) => {
  try {
    // Build query
    let query = { isPublished: true };

    // Filter by property type
    if (req.query.propertyType) {
      query.propertyType = req.query.propertyType;
    }

    // Filter by listing type
    if (req.query.listingType) {
      query.listingType = req.query.listingType;
    }

    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Filter by city
    if (req.query.city) {
      query['address.city'] = new RegExp(req.query.city, 'i');
    }

    // Filter by state
    if (req.query.state) {
      query['address.state'] = new RegExp(req.query.state, 'i');
    }

    // Price range
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }

    // Bedrooms
    if (req.query.bedrooms) {
      query.bedrooms = { $gte: Number(req.query.bedrooms) };
    }

    // Bathrooms
    if (req.query.bathrooms) {
      query.bathrooms = { $gte: Number(req.query.bathrooms) };
    }

    // Text search
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    // Sort
    let sortBy = '-createdAt'; // Default: newest first
    if (req.query.sort) {
      sortBy = req.query.sort === 'price-asc' ? 'price' :
               req.query.sort === 'price-desc' ? '-price' :
               req.query.sort === 'oldest' ? 'createdAt' :
               '-createdAt';
    }

    // Execute query
    const properties = await Property.find(query)
      .populate('owner', 'firstName lastName email phone avatar')
      .populate('agent', 'firstName lastName email phone avatar agency')
      .sort(sortBy)
      .limit(limit)
      .skip(startIndex);

    // Get total count
    const total = await Property.countDocuments(query);

    res.status(200).json({
      status: 'success',
      count: properties.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: properties
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
exports.getProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('owner', 'firstName lastName email phone avatar bio')
      .populate('agent', 'firstName lastName email phone avatar bio agency licenseNumber');

    if (!property) {
      return res.status(404).json({
        status: 'error',
        message: 'Property not found'
      });
    }

    // Increment views
    property.views += 1;
    await property.save();

    res.status(200).json({
      status: 'success',
      data: property
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new property
// @route   POST /api/properties
// @access  Private (seller, agent, admin)
exports.createProperty = async (req, res, next) => {
  try {
    // Add user as owner
    req.body.owner = req.user.id;

    // If user is an agent, also set as agent
    if (req.user.role === 'agent') {
      req.body.agent = req.user.id;
    }

    const property = await Property.create(req.body);

    res.status(201).json({
      status: 'success',
      message: 'Property created successfully',
      data: property
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private (owner or admin)
exports.updateProperty = async (req, res, next) => {
  try {
    let property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        status: 'error',
        message: 'Property not found'
      });
    }

    // Check ownership
    if (property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to update this property'
      });
    }

    property = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      status: 'success',
      message: 'Property updated successfully',
      data: property
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private (owner or admin)
exports.deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        status: 'error',
        message: 'Property not found'
      });
    }

    // Check ownership
    if (property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to delete this property'
      });
    }

    // Delete images from Cloudinary
    for (const image of property.images) {
      if (image.publicId) {
        await deleteFromCloudinary(image.publicId);
      }
    }

    await property.deleteOne();

    res.status(200).json({
      status: 'success',
      message: 'Property deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload property images
// @route   POST /api/properties/:id/images
// @access  Private (owner or admin)
exports.uploadPropertyImages = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        status: 'error',
        message: 'Property not found'
      });
    }

    // Check ownership
    if (property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to upload images for this property'
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Please upload at least one image'
      });
    }

    // Upload images to Cloudinary
    const uploadPromises = req.files.map(file => 
      uploadToCloudinary(file.buffer, 'properties')
    );

    const uploadedImages = await Promise.all(uploadPromises);

    // Add images to property
    property.images.push(...uploadedImages);
    await property.save();

    res.status(200).json({
      status: 'success',
      message: 'Images uploaded successfully',
      data: property
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured properties
// @route   GET /api/properties/featured
// @access  Public
exports.getFeaturedProperties = async (req, res, next) => {
  try {
    const properties = await Property.find({ 
      isFeatured: true, 
      isPublished: true 
    })
      .populate('owner', 'firstName lastName email phone avatar')
      .populate('agent', 'firstName lastName email phone avatar')
      .limit(6)
      .sort('-createdAt');

    res.status(200).json({
      status: 'success',
      count: properties.length,
      data: properties
    });
  } catch (error) {
    next(error);
  }
};
