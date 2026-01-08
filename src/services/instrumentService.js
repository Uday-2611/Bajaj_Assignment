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

module.exports = {
    getAllInstruments,
    getInstrumentBySymbol,
    instrumentExists
};

