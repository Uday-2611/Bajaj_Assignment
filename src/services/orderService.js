const Order = require('../models/Order');
const Trade = require('../models/Trade');
const db = require('../storage/inMemoryDB');
const { ORDER_STATUS, ORDER_STYLES, ERROR_MESSAGES, SUCCESS_MESSAGES } = require('../config/constants');
const { instrumentExists, getInstrumentBySymbol } = require('./instrumentService');

function placeOrder(orderData) {
    try {
        
        if (!instrumentExists(orderData.symbol)) {
            return {
                success: false,
                message: ERROR_MESSAGES.INSTRUMENT_NOT_FOUND
            };
        }

        const result = Order.create(orderData);

        if (!result.success) {
            return {
                success: false,
                errors: result.errors
            };
        }

        const order = result.order;

        order.updateStatus(ORDER_STATUS.PLACED);

        db.addOrder(order);

        if (order.orderStyle === ORDER_STYLES.MARKET) {
            const executionResult = executeMarketOrder(order);

            if (executionResult.success) {
                return {
                    success: true,
                    message: SUCCESS_MESSAGES.ORDER_EXECUTED,
                    data: {
                        order: executionResult.order,
                        trade: executionResult.trade
                    }
                };
            }
        }

        return {
            success: true,
            message: SUCCESS_MESSAGES.ORDER_PLACED,
            data: order
        };

    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

function executeMarketOrder(order) {
    try {
        
        const instrumentResult = getInstrumentBySymbol(order.symbol);

        if (!instrumentResult.success) {
            return {
                success: false,
                message: ERROR_MESSAGES.INSTRUMENT_NOT_FOUND
            };
        }

        const instrument = instrumentResult.data;
        const executedPrice = instrument.lastTradedPrice;

        order.updateStatus(ORDER_STATUS.EXECUTED);
        db.updateOrder(order.orderId, order);

        const trade = Trade.create({
            orderId: order.orderId,
            userId: order.userId,
            symbol: order.symbol,
            orderType: order.orderType,
            quantity: order.quantity,
            executedPrice: executedPrice
        });

        db.addTrade(trade);

        return {
            success: true,
            order: order,
            trade: trade
        };

    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

function getOrderById(orderId) {
    try {
        const order = db.getOrderById(orderId);

        if (!order) {
            return {
                success: false,
                message: ERROR_MESSAGES.ORDER_NOT_FOUND
            };
        }

        return {
            success: true,
            data: order
        };

    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

function getUserOrders(userId) {
    try {
        const orders = db.getOrdersByUserId(userId);

        return {
            success: true,
            data: orders
        };

    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

function cancelOrder(orderId, userId) {
    try {
        const order = db.getOrderById(orderId);

        if (!order) {
            return {
                success: false,
                message: ERROR_MESSAGES.ORDER_NOT_FOUND
            };
        }

        if (order.userId !== userId) {
            return {
                success: false,
                message: 'Unauthorized to cancel this order'
            };
        }

        if (order.status === ORDER_STATUS.EXECUTED) {
            return {
                success: false,
                message: 'Cannot cancel an executed order'
            };
        }

        if (order.status === ORDER_STATUS.CANCELLED) {
            return {
                success: false,
                message: 'Order is already cancelled'
            };
        }

        order.updateStatus(ORDER_STATUS.CANCELLED);
        db.updateOrder(orderId, order);

        return {
            success: true,
            message: 'Order cancelled successfully',
            data: order
        };

    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

module.exports = {
    placeOrder,
    getOrderById,
    getUserOrders,
    cancelOrder,
    executeMarketOrder
};

