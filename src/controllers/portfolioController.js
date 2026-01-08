const portfolioService = require('../services/portfolioService');
const { sendSuccess, sendError, sendNotFound } = require('../utils/responseFormatter');

async function getUserPortfolio(req, res) {
    try {
        const userId = req.user.userId; 
        const result = portfolioService.getUserPortfolio(userId);

        if (!result.success) {
            return sendError(res, result.message);
        }

        return sendSuccess(res, result.data, 'Portfolio fetched successfully');

    } catch (error) {
        return sendError(res, error.message);
    }
}

async function getPortfolioSummary(req, res) {
    try {
        const userId = req.user.userId; 
        const result = portfolioService.getPortfolioSummary(userId);

        if (!result.success) {
            return sendError(res, result.message);
        }

        return sendSuccess(res, result.data, 'Portfolio summary fetched successfully');

    } catch (error) {
        return sendError(res, error.message);
    }
}

async function getHoldingBySymbol(req, res) {
    try {
        const userId = req.user.userId; 
        const { symbol } = req.params;

        const result = portfolioService.getHoldingBySymbol(userId, symbol);

        if (!result.success) {
            return sendNotFound(res, result.message);
        }

        return sendSuccess(res, result.data, 'Holding fetched successfully');

    } catch (error) {
        return sendError(res, error.message);
    }
}

module.exports = {
    getUserPortfolio,
    getPortfolioSummary,
    getHoldingBySymbol
};