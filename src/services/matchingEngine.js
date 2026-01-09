const db = require('../storage/inMemoryDB');
const { ORDER_STATUS, ORDER_TYPES, ORDER_STYLES } = require('../config/constants');
const Trade = require('../models/Trade');

function runMatchingEngine() {
    try {
        // Get all pending orders (status = PLACED)
        const pendingOrders = db.getPendingOrders();

        // Filter only LIMIT orders
        const limitOrders = pendingOrders.filter(order => order.orderStyle === ORDER_STYLES.LIMIT);

        if (limitOrders.length === 0) {
            return; // No limit orders to process
        }

        let executedCount = 0;

        limitOrders.forEach(order => {
            // Get current market price for the instrument
            const instrument = db.getInstrumentBySymbol(order.symbol);

            if (!instrument) {
                console.warn(`Instrument ${order.symbol} not found for order ${order.orderId}`);
                return;
            }

            const marketPrice = instrument.lastTradedPrice;
            const limitPrice = order.price;
            let shouldExecute = false;

            // Check if order should execute based on order type
            if (order.orderType === ORDER_TYPES.BUY) {
                // BUY LIMIT: Execute when market price is at or below limit price
                shouldExecute = marketPrice <= limitPrice;
            } else if (order.orderType === ORDER_TYPES.SELL) {
                // SELL LIMIT: Execute when market price is at or above limit price
                shouldExecute = marketPrice >= limitPrice;
            }

            if (shouldExecute) {
                executeLimitOrder(order, marketPrice);
                executedCount++;
            }
        });

        if (executedCount > 0) {
            console.log(`\nMatching Engine: Executed ${executedCount} limit order(s)\n`);
        }

    } catch (error) {
        console.error('Matching Engine Error:', error.message);
    }
}

/**
 * Execute a limit order at the current market price
 * @param {Object} order - The order to execute
 * @param {number} executedPrice - The current market price
 */
function executeLimitOrder(order, executedPrice) {
    try {
        // Update order status to EXECUTED
        order.status = ORDER_STATUS.EXECUTED;
        db.updateOrder(order.orderId, order);

        // Create trade record
        const trade = Trade.create({
            orderId: order.orderId,
            userId: order.userId,
            symbol: order.symbol,
            orderType: order.orderType,
            quantity: order.quantity,
            executedPrice: executedPrice
        });

        db.addTrade(trade);

        // Log execution
        const orderTypeLabel = order.orderType === ORDER_TYPES.BUY ? 'BUY' : 'SELL';
        console.log(`[${orderTypeLabel}] LIMIT Order Executed:`);
        console.log(`   Order ID: ${order.orderId}`);
        console.log(`   Symbol: ${order.symbol}`);
        console.log(`   Type: ${order.orderType}`);
        console.log(`   Quantity: ${order.quantity}`);
        console.log(`   Limit Price: Rs.${order.price.toFixed(2)}`);
        console.log(`   Executed Price: Rs.${executedPrice.toFixed(2)}`);

    } catch (error) {
        console.error(`Error executing limit order ${order.orderId}:`, error.message);
    }
}

module.exports = {
    runMatchingEngine,
    executeLimitOrder
};
