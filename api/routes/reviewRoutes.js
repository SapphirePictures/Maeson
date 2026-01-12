const express = require('express');
const router = express.Router();
const {
  getPropertyReviews,
  createReview,
  updateReview,
  deleteReview,
  approveReview,
  getUserReviews
} = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/property/:propertyId', getPropertyReviews);

// Protected routes
router.post('/', protect, createReview);
router.get('/user', protect, getUserReviews);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

// Admin only
router.put('/:id/approve', protect, authorize('admin'), approveReview);

module.exports = router;
