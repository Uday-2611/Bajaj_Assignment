const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');

router.get('/summary', portfolioController.getPortfolioSummary);

router.get('/:symbol', portfolioController.getHoldingBySymbol);

router.get('/', portfolioController.getUserPortfolio);

module.exports = router;