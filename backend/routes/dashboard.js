const express = require('express');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const { getDashboardStats, getAnalytics } = require('../controllers/dashboardController');

const router = express.Router();

router.use(auth);

router.get('/stats', getDashboardStats);
router.get('/analytics', roleCheck(['Admin']), getAnalytics);

module.exports = router;
