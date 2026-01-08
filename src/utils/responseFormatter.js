const { HTTP_STATUS } = require('../config/constants');

function sendSuccess(res, data = null, message = 'Success', statusCode = HTTP_STATUS.OK) {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
}

function sendError(res, message = 'An error occurred', statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, errors = null) {
    const response = {
        success: false,
        message,
        statusCode
    };

    if (errors) {
        response.errors = errors;
    }

    return res.status(statusCode).json(response);
}

function sendValidationError(res, errors) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Validation failed',
        statusCode: HTTP_STATUS.BAD_REQUEST,
        errors
    });
}

function sendNotFound(res, message = 'Resource not found') {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message,
        statusCode: HTTP_STATUS.NOT_FOUND
    });
}

function sendCreated(res, data, message = 'Resource created successfully') {
    return res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message,
        data
    });
}

module.exports = {
    sendSuccess,
    sendError,
    sendValidationError,
    sendNotFound,
    sendCreated
};
