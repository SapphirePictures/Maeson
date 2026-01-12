const express = require('express');
const router = express.Router();
const {
  createInquiry,
  getSentInquiries,
  getReceivedInquiries,
  updateInquiryStatus,
  deleteInquiry
} = require('../controllers/inquiryController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.post('/', createInquiry);
router.get('/sent', getSentInquiries);
router.get('/received', getReceivedInquiries);
router.put('/:id/status', updateInquiryStatus);
router.delete('/:id', deleteInquiry);

module.exports = router;
