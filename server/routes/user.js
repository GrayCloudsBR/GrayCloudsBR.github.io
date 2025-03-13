const express = require('express');
const router = express.Router();
const { updateProfile, changePassword, getSubscription } = require('../controllers/user');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.put('/profile', updateProfile);
router.put('/password', changePassword);
router.get('/subscription', getSubscription);

module.exports = router; 