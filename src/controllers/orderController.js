const orderService = require('../services/orderService');
const { sendSuccess, sendError, sendNotFound, sendCreated, sendValidationError } = require('../utils/responseFormatter');
const { HTTP_STATUS } = require('../config/constants');

async function placeOrder(req, res) {
    try {
        const userId = req.user.userId; 

        const orderData = {
            userId,
            symbol: req.body.symbol,
            orderType: req.body.orderType,
            orderStyle: req.body.orderStyle,
            quantity: req.body.quantity,
            price: req.body.price
        };

        const result = orderService.placeOrder(orderData);

        if (!result.success) {
            
            if (result.errors) {
                return sendValidationError(res, result.errors);
            }
            return sendError(res, result.message, HTTP_STATUS.BAD_REQUEST);
        }

        return sendCreated(res, result.data, result.message);

    } catch (error) {
        return sendError(res, error.message);
    }
}

async function getOrderById(req, res) {
    try {
        const { orderId } = req.params;
        const result = orderService.getOrderById(orderId);

        if (!result.success) {
            return sendNotFound(res, result.message);
        }

        return sendSuccess(res, result.data, 'Order fetched successfully');

    } catch (error) {
        return sendError(res, error.message);
    }
}

async function getUserOrders(req, res) {
    try {
        const userId = req.user.userId; 
        const result = orderService.getUserOrders(userId);

        if (!result.success) {
            return sendError(res, result.message);
        }

        return sendSuccess(res, result.data, 'Orders fetched successfully');

    } catch (error) {
        return sendError(res, error.message);
    }
}

async function cancelOrder(req, res) {
    try {
        const { orderId } = req.params;
        const userId = req.user.userId; 

        const result = orderService.cancelOrder(orderId, userId);

        if (!result.success) {
            return sendError(res, result.message, HTTP_STATUS.BAD_REQUEST);
        }

        return sendSuccess(res, result.data, result.message);

    } catch (error) {
        return sendError(res, error.message);
    }
}

module.exports = {
    placeOrder,
    getOrderById,
    getUserOrders,
    cancelOrder
};