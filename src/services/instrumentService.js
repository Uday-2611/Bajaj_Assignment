const db = require('../storage/inMemoryDB');
const { ERROR_MESSAGES } = require('../config/constants');

function getAllInstruments() {
    try {
        const instruments = db.getAllInstruments();
        return {
            success: true,
            data: instruments
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

function getInstrumentBySymbol(symbol) {
    try {
        const instrument = db.getInstrumentBySymbol(symbol);

        if (!instrument) {
            return {
                success: false,
                message: ERROR_MESSAGES.INSTRUMENT_NOT_FOUND
            };
        }

        return {
            success: true,
            data: instrument
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

function instrumentExists(symbol) {
    return db.instrumentExists(symbol);
}

function updateInstrumentPrice(symbol, newPrice) {
    try {
        if (!instrumentExists(symbol)) {
            return {
                success: false,
                message: ERROR_MESSAGES.INSTRUMENT_NOT_FOUND
            };
        }

        if (typeof newPrice !== 'number' || newPrice <= 0) {
            return {
                success: false,
                message: 'Price must be a positive number'
            };
        }

        const updatedInstrument = db.updateInstrumentPrice(symbol, newPrice);

        return {
            success: true,
            data: updatedInstrument
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

module.exports = {
    getAllInstruments,
    getInstrumentBySymbol,
    instrumentExists,
    updateInstrumentPrice
};


