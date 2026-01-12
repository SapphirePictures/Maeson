const express = require('express');
const router = express.Router();
const {
  getFavorites,
  addFavorite,
  removeFavorite,
  updateFavorite,
  checkFavorite
} = require('../controllers/favoriteController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.get('/', getFavorites);
router.post('/', addFavorite);
router.put('/:id', updateFavorite);
router.delete('/:id', removeFavorite);
router.get('/check/:propertyId', checkFavorite);

module.exports = router;
