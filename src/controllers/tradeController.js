const tradeService = require('../services/tradeService');
const { sendSuccess, sendError } = require('../utils/responseFormatter');

async function getUserTrades(req, res) {
    try {
        const userId = req.user.userId; 
        const result = tradeService.getUserTrades(userId);

        if (!result.success) {
            return sendError(res, result.message);
        }

        return sendSuccess(res, result.data, 'Trades fetched successfully');

    } catch (error) {
        return sendError(res, error.message);
    }
}

async function getTradeStats(req, res) {
    try {
        const userId = req.user.userId; 
        const result = tradeService.getTradeStats(userId);

        if (!result.success) {
            return sendError(res, result.message);
        }

        return sendSuccess(res, result.data, 'Trade statistics fetched successfully');

    } catch (error) {
        return sendError(res, error.message);
    }
}

async function getTradesByOrderId(req, res) {
    try {
        const { orderId } = req.params;
        const result = tradeService.getTradesByOrderId(orderId);

        if (!result.success) {
            return sendError(res, result.message);
        }

        return sendSuccess(res, result.data, 'Trades fetched successfully');

    } catch (error) {
        return sendError(res, error.message);
    }
}

module.exports = {
    getUserTrades,
    getTradeStats,
    getTradesByOrderId
};

