const express = require('express');
const router = express.Router();
const { getDashboardData } = require('../controllers/dataController');

// The route is now clean and simply points to the controller function
router.get('/data', getDashboardData);

module.exports = router;