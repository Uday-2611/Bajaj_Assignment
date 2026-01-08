const express = require('express');
const router = express.Router();
const instrumentController = require('../controllers/instrumentController');

router.get('/', instrumentController.getAllInstruments);

router.get('/:symbol', instrumentController.getInstrumentBySymbol);

module.exports = router;