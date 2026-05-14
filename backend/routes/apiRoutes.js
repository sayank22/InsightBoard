const express = require('express');
const router = express.Router();
const { getDashboardData, getFilterOptions, getDashboardStats } = require('../controllers/dataController');


router.get('/data', getDashboardData);
router.get('/filters', getFilterOptions);
router.get('/stats', getDashboardStats);

module.exports = router;