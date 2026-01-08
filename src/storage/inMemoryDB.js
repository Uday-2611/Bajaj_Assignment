const { EXCHANGES, INSTRUMENT_TYPES } = require('../config/constants');

const instruments = new Map();
const orders = new Map();
const trades = new Map();

function seedInstruments() {
    const instrumentsData = [
        
        {
            symbol: 'RELIANCE',
            exchange: EXCHANGES.NSE,
            instrumentType: INSTRUMENT_TYPES.EQUITY,
            lastTradedPrice: 2450.75
        },
        {
            symbol: 'TCS',
            exchange: EXCHANGES.NSE,
            instrumentType: INSTRUMENT_TYPES.EQUITY,
            lastTradedPrice: 3680.50
        },
        {
            symbol: 'INFY',
            exchange: EXCHANGES.NSE,
            instrumentType: INSTRUMENT_TYPES.EQUITY,
            lastTradedPrice: 1520.30
        },
        {
            symbol: 'HDFCBANK',
            exchange: EXCHANGES.NSE,
            instrumentType: INSTRUMENT_TYPES.EQUITY,
            lastTradedPrice: 1645.20
        },
        {
            symbol: 'ICICIBANK',
            exchange: EXCHANGES.NSE,
            instrumentType: INSTRUMENT_TYPES.EQUITY,
            lastTradedPrice: 1089.45
        },
        {
            symbol: 'WIPRO',
            exchange: EXCHANGES.NSE,
            instrumentType: INSTRUMENT_TYPES.EQUITY,
            lastTradedPrice: 445.60
        },
        {
            symbol: 'BHARTIARTL',
            exchange: EXCHANGES.NSE,
            instrumentType: INSTRUMENT_TYPES.EQUITY,
            lastTradedPrice: 1275.80
        },
        {
            symbol: 'ITC',
            exchange: EXCHANGES.NSE,
            instrumentType: INSTRUMENT_TYPES.EQUITY,
            lastTradedPrice: 425.90
        },
        {
            symbol: 'SBIN',
            exchange: EXCHANGES.NSE,
            instrumentType: INSTRUMENT_TYPES.EQUITY,
            lastTradedPrice: 625.35
        },
        {
            symbol: 'LT',
            exchange: EXCHANGES.NSE,
            instrumentType: INSTRUMENT_TYPES.EQUITY,
            lastTradedPrice: 3456.70
        },
        
        {
            symbol: 'TATAMOTORS',
            exchange: EXCHANGES.BSE,
            instrumentType: INSTRUMENT_TYPES.EQUITY,
            lastTradedPrice: 785.25
        },
        {
            symbol: 'MARUTI',
            exchange: EXCHANGES.BSE,
            instrumentType: INSTRUMENT_TYPES.EQUITY,
            lastTradedPrice: 10250.40
        },
        {
            symbol: 'BAJFINANCE',
            exchange: EXCHANGES.BSE,
            instrumentType: INSTRUMENT_TYPES.EQUITY,
            lastTradedPrice: 6890.15
        },
        {
            symbol: 'ASIANPAINT',
            exchange: EXCHANGES.BSE,
            instrumentType: INSTRUMENT_TYPES.EQUITY,
            lastTradedPrice: 2875.60
        },
        {
            symbol: 'SUNPHARMA',
            exchange: EXCHANGES.BSE,
            instrumentType: INSTRUMENT_TYPES.EQUITY,
            lastTradedPrice: 1456.80
        }
    ];

    instrumentsData.forEach(instrument => {
        instruments.set(instrument.symbol, instrument);
    });

    console.log(` Seeded ${instruments.size} instruments`);
}

seedInstruments();

function getAllInstruments() {
    return Array.from(instruments.values());
}

function getInstrumentBySymbol(symbol) {
    return instruments.get(symbol);
}

function instrumentExists(symbol) {
    return instruments.has(symbol);
}

function addOrder(order) {
    orders.set(order.orderId, order);
    return order;
}

function getOrderById(orderId) {
    return orders.get(orderId);
}

function getOrdersByUserId(userId) {
    return Array.from(orders.values()).filter(order => order.userId === userId);
}

function updateOrder(orderId, updates) {
    const order = orders.get(orderId);
    if (order) {
        const updatedOrder = { ...order, ...updates };
        orders.set(orderId, updatedOrder);
        return updatedOrder;
    }
    return null;
}

function addTrade(trade) {
    trades.set(trade.tradeId, trade);
    return trade;
}

function getTradesByUserId(userId) {
    return Array.from(trades.values()).filter(trade => trade.userId === userId);
}

function getTradesByOrderId(orderId) {
    return Array.from(trades.values()).filter(trade => trade.orderId === orderId);
}

function clearAllData() {
    orders.clear();
    trades.clear();
    console.log('️  Cleared all orders and trades');
}

function getStats() {
    return {
        totalInstruments: instruments.size,
        totalOrders: orders.size,
        totalTrades: trades.size
    };
}

module.exports = {
    
    getAllInstruments,
    getInstrumentBySymbol,
    instrumentExists,

    addOrder,
    getOrderById,
    getOrdersByUserId,
    updateOrder,

    addTrade,
    getTradesByUserId,
    getTradesByOrderId,

    clearAllData,
    getStats
};
