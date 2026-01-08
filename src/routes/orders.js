const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/', orderController.placeOrder);

router.get('/', orderController.getUserOrders);

router.get('/:orderId', orderController.getOrderById);

router.delete('/:orderId', orderController.cancelOrder);

module.exports = router;