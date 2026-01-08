const { v4: uuidv4 } = require('uuid');
const { ORDER_TYPES, ORDER_STYLES, ORDER_STATUS, ERROR_MESSAGES } = require('../config/constants');

class Order {
    constructor({
        orderId = uuidv4(),
        userId,
        symbol,
        orderType,
        orderStyle,
        quantity,
        price = null,
        status = ORDER_STATUS.NEW,
        timestamp = new Date().toISOString()
    }) {
        this.orderId = orderId;
        this.userId = userId;
        this.symbol = symbol;
        this.orderType = orderType;
        this.orderStyle = orderStyle;
        this.quantity = quantity;
        this.price = price;
        this.status = status;
        this.timestamp = timestamp;
    }

    static validate(data) {
        const errors = [];

        if (!data.userId) {
            errors.push('User ID is required');
        }

        if (!data.symbol || typeof data.symbol !== 'string') {
            errors.push('Symbol is required and must be a string');
        }

        if (!data.orderType || !Object.values(ORDER_TYPES).includes(data.orderType)) {
            errors.push(ERROR_MESSAGES.INVALID_ORDER_TYPE);
        }

        if (!data.orderStyle || !Object.values(ORDER_STYLES).includes(data.orderStyle)) {
            errors.push(ERROR_MESSAGES.INVALID_ORDER_STYLE);
        }

        if (!data.quantity || typeof data.quantity !== 'number' || data.quantity <= 0) {
            errors.push(ERROR_MESSAGES.INVALID_QUANTITY);
        }

        if (data.orderStyle === ORDER_STYLES.LIMIT) {
            if (!data.price || typeof data.price !== 'number' || data.price <= 0) {
                errors.push(ERROR_MESSAGES.PRICE_REQUIRED_FOR_LIMIT);
            }
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    static create(data) {
        const validation = Order.validate(data);
        if (!validation.isValid) {
            return {
                success: false,
                errors: validation.errors
            };
        }
        return {
            success: true,
            order: new Order(data)
        };
    }

    updateStatus(newStatus) {
        if (!Object.values(ORDER_STATUS).includes(newStatus)) {
            throw new Error(`Invalid order status: ${newStatus}`);
        }
        this.status = newStatus;
    }
}

module.exports = Order;