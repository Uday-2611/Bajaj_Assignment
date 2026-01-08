const Portfolio = require('../models/Portfolio');
const db = require('../storage/inMemoryDB');
const { ORDER_TYPES } = require('../config/constants');
const { getInstrumentBySymbol } = require('./instrumentService');

function getUserPortfolio(userId) {
    try {
        const trades = db.getTradesByUserId(userId);

        const holdingsMap = new Map();

        trades.forEach(trade => {
            const symbol = trade.symbol;

            if (!holdingsMap.has(symbol)) {
                holdingsMap.set(symbol, {
                    symbol: symbol,
                    totalQuantity: 0,
                    totalInvestedValue: 0,
                    buyQuantity: 0,
                    sellQuantity: 0
                });
            }

            const holding = holdingsMap.get(symbol);

            if (trade.orderType === ORDER_TYPES.BUY) {
                holding.buyQuantity += trade.quantity;
                holding.totalQuantity += trade.quantity;
                holding.totalInvestedValue += (trade.quantity * trade.executedPrice);
            } else if (trade.orderType === ORDER_TYPES.SELL) {
                holding.sellQuantity += trade.quantity;
                holding.totalQuantity -= trade.quantity;
                
                const avgPrice = holding.totalInvestedValue / (holding.totalQuantity + trade.quantity);
                holding.totalInvestedValue -= (trade.quantity * avgPrice);
            }
        });

        const portfolio = [];

        holdingsMap.forEach((holding, symbol) => {
            
            if (holding.totalQuantity > 0) {
                const averagePrice = holding.totalInvestedValue / holding.totalQuantity;

                const instrumentResult = getInstrumentBySymbol(symbol);
                const currentPrice = instrumentResult.success
                    ? instrumentResult.data.lastTradedPrice
                    : averagePrice;

                const currentValue = holding.totalQuantity * currentPrice;

                const portfolioItem = Portfolio.create({
                    symbol: symbol,
                    quantity: holding.totalQuantity,
                    averagePrice: parseFloat(averagePrice.toFixed(2)),
                    currentValue: parseFloat(currentValue.toFixed(2))
                });

                portfolio.push(portfolioItem);
            }
        });

        return {
            success: true,
            data: portfolio
        };

    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

function getPortfolioSummary(userId) {
    try {
        const portfolioResult = getUserPortfolio(userId);

        if (!portfolioResult.success) {
            return portfolioResult;
        }

        const portfolio = portfolioResult.data;

        const summary = {
            totalHoldings: portfolio.length,
            totalInvestedValue: portfolio.reduce((sum, item) =>
                sum + (item.quantity * item.averagePrice), 0
            ),
            totalCurrentValue: portfolio.reduce((sum, item) =>
                sum + item.currentValue, 0
            ),
            holdings: portfolio
        };

        summary.totalProfitLoss = summary.totalCurrentValue - summary.totalInvestedValue;
        summary.totalProfitLossPercentage = summary.totalInvestedValue > 0
            ? ((summary.totalProfitLoss / summary.totalInvestedValue) * 100).toFixed(2)
            : 0;

        return {
            success: true,
            data: summary
        };

    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

function getHoldingBySymbol(userId, symbol) {
    try {
        const portfolioResult = getUserPortfolio(userId);

        if (!portfolioResult.success) {
            return portfolioResult;
        }

        const holding = portfolioResult.data.find(item => item.symbol === symbol);

        if (!holding) {
            return {
                success: false,
                message: `No holdings found for symbol: ${symbol}`
            };
        }

        return {
            success: true,
            data: holding
        };

    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

module.exports = {
    getUserPortfolio,
    getPortfolioSummary,
    getHoldingBySymbol
};

