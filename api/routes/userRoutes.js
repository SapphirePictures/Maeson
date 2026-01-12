const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUser,
  getUserProperties,
  updateUser,
  deleteUser,
  getAgents
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/agents', getAgents);
router.get('/:id', getUser);
router.get('/:id/properties', getUserProperties);

// Admin only routes
router.get('/', protect, authorize('admin'), getUsers);
router.put('/:id', protect, authorize('admin'), updateUser);
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
