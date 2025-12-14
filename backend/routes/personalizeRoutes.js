const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware'); 
const {
  updateInterests,
  logActivity,
  getRecommendations
} = require('../controllers/personalizationController');

router.post('/interests', auth, updateInterests);
router.post('/activity', auth, logActivity);
router.get('/recommendations', auth, getRecommendations);

module.exports = router;
