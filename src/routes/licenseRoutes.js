const express = require('express');
const router = express.Router();
const licenseController = require('../controllers/licenseController');

router.get('/licenses', licenseController.getLicenseDetails);

module.exports = router;
