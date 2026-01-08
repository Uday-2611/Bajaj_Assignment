const { EXCHANGES, INSTRUMENT_TYPES } = require('../config/constants');

class Instrument {
    constructor({ symbol, exchange, instrumentType, lastTradedPrice }) {
        this.symbol = symbol;
        this.exchange = exchange;
        this.instrumentType = instrumentType;
        this.lastTradedPrice = lastTradedPrice;
    }

    static validate(data) {
        const errors = [];

        if (!data.symbol || typeof data.symbol !== 'string') {
            errors.push('Symbol is required and must be a string');
        }

        if (!data.exchange || !Object.values(EXCHANGES).includes(data.exchange)) {
            errors.push(`Exchange must be one of: ${Object.values(EXCHANGES).join(', ')}`);
        }

        if (!data.instrumentType || !Object.values(INSTRUMENT_TYPES).includes(data.instrumentType)) {
            errors.push(`Instrument type must be one of: ${Object.values(INSTRUMENT_TYPES).join(', ')}`);
        }

        if (typeof data.lastTradedPrice !== 'number' || data.lastTradedPrice <= 0) {
            errors.push('Last traded price must be a positive number');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    static create(data) {
        const validation = Instrument.validate(data);
        if (!validation.isValid) {
            throw new Error(`Invalid instrument data: ${validation.errors.join(', ')}`);
        }
        return new Instrument(data);
    }
}

module.exports = Instrument;

