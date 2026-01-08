const db = require('../storage/inMemoryDB');

function getUserTrades(userId) {
    try {
        const trades = db.getTradesByUserId(userId);

        return {
            success: true,
            data: trades
        };

    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

function getTradesByOrderId(orderId) {
    try {
        const trades = db.getTradesByOrderId(orderId);

        return {
            success: true,
            data: trades
        };

    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

function getTradeStats(userId) {
    try {
        const trades = db.getTradesByUserId(userId);

        const stats = {
            totalTrades: trades.length,
            totalBuyTrades: trades.filter(t => t.orderType === 'BUY').length,
            totalSellTrades: trades.filter(t => t.orderType === 'SELL').length,
            totalVolume: trades.reduce((sum, t) => sum + (t.quantity * t.executedPrice), 0)
        };

        return {
            success: true,
            data: stats
        };

    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

module.exports = {
    getUserTrades,
    getTradesByOrderId,
    getTradeStats
};

