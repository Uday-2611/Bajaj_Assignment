const instrumentService = require('../services/instrumentService');
const { sendSuccess, sendError, sendNotFound } = require('../utils/responseFormatter');

async function getAllInstruments(req, res) {
    try {
        const result = instrumentService.getAllInstruments();

        if (!result.success) {
            return sendError(res, result.message);
        }

        return sendSuccess(res, result.data, 'Instruments fetched successfully');

    } catch (error) {
        return sendError(res, error.message);
    }
}

async function getInstrumentBySymbol(req, res) {
    try {
        const { symbol } = req.params;
        const result = instrumentService.getInstrumentBySymbol(symbol);

        if (!result.success) {
            return sendNotFound(res, result.message);
        }

        return sendSuccess(res, result.data, 'Instrument fetched successfully');

    } catch (error) {
        return sendError(res, error.message);
    }
}

module.exports = {
    getAllInstruments,
    getInstrumentBySymbol
};