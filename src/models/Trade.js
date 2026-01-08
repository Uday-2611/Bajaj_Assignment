const { v4: uuidv4 } = require('uuid');

class Trade {
    constructor({
        tradeId = uuidv4(),
        orderId,
        userId,
        symbol,
        orderType,
        quantity,
        executedPrice,
        timestamp = new Date().toISOString()
    }) {
        this.tradeId = tradeId;
        this.orderId = orderId;
        this.userId = userId;
        this.symbol = symbol;
        this.orderType = orderType;
        this.quantity = quantity;
        this.executedPrice = executedPrice;
        this.timestamp = timestamp;
    }

    static validate(data) {
        const errors = [];

        if (!data.orderId) {
            errors.push('Order ID is required');
        }

        if (!data.userId) {
            errors.push('User ID is required');
        }

        if (!data.symbol) {
            errors.push('Symbol is required');
        }

        if (!data.orderType) {
            errors.push('Order type is required');
        }

        if (!data.quantity || data.quantity <= 0) {
            errors.push('Quantity must be greater than 0');
        }

        if (!data.executedPrice || data.executedPrice <= 0) {
            errors.push('Executed price must be greater than 0');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    static create(data) {
        const validation = Trade.validate(data);
        if (!validation.isValid) {
            throw new Error(`Invalid trade data: ${validation.errors.join(', ')}`);
        }
        return new Trade(data);
    }
}

module.exports = Trade;