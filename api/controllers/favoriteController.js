const Favorite = require('../models/Favorite');

// @desc    Get user's favorites
// @route   GET /api/favorites
// @access  Private
exports.getFavorites = async (req, res, next) => {
  try {
    const favorites = await Favorite.find({ user: req.user.id })
      .populate({
        path: 'property',
        populate: {
          path: 'owner',
          select: 'firstName lastName email phone'
        }
      })
      .sort('-createdAt');

    res.status(200).json({
      status: 'success',
      count: favorites.length,
      data: favorites
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add property to favorites
// @route   POST /api/favorites
// @access  Private
exports.addFavorite = async (req, res, next) => {
  try {
    const { property, notes } = req.body;

    // Check if already in favorites
    const existingFavorite = await Favorite.findOne({
      user: req.user.id,
      property
    });

    if (existingFavorite) {
      return res.status(400).json({
        status: 'error',
        message: 'Property already in favorites'
      });
    }

    const favorite = await Favorite.create({
      user: req.user.id,
      property,
      notes
    });

    await favorite.populate('property');

    res.status(201).json({
      status: 'success',
      message: 'Property added to favorites',
      data: favorite
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove property from favorites
// @route   DELETE /api/favorites/:id
// @access  Private
exports.removeFavorite = async (req, res, next) => {
  try {
    const favorite = await Favorite.findById(req.params.id);

    if (!favorite) {
      return res.status(404).json({
        status: 'error',
        message: 'Favorite not found'
      });
    }

    // Check ownership
    if (favorite.user.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to remove this favorite'
      });
    }

    await favorite.deleteOne();

    res.status(200).json({
      status: 'success',
      message: 'Property removed from favorites'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update favorite notes
// @route   PUT /api/favorites/:id
// @access  Private
exports.updateFavorite = async (req, res, next) => {
  try {
    let favorite = await Favorite.findById(req.params.id);

    if (!favorite) {
      return res.status(404).json({
        status: 'error',
        message: 'Favorite not found'
      });
    }

    // Check ownership
    if (favorite.user.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to update this favorite'
      });
    }

    favorite = await Favorite.findByIdAndUpdate(
      req.params.id,
      { notes: req.body.notes },
      { new: true, runValidators: true }
    ).populate('property');

    res.status(200).json({
      status: 'success',
      message: 'Favorite updated successfully',
      data: favorite
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check if property is in favorites
// @route   GET /api/favorites/check/:propertyId
// @access  Private
exports.checkFavorite = async (req, res, next) => {
  try {
    const favorite = await Favorite.findOne({
      user: req.user.id,
      property: req.params.propertyId
    });

    res.status(200).json({
      status: 'success',
      isFavorite: !!favorite,
      data: favorite
    });
  } catch (error) {
    next(error);
  }
};
