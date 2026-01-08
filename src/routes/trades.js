const express = require('express');
const router = express.Router();
const tradeController = require('../controllers/tradeController');

router.get('/stats', tradeController.getTradeStats);

router.get('/order/:orderId', tradeController.getTradesByOrderId);

router.get('/', tradeController.getUserTrades);

module.exports = router;