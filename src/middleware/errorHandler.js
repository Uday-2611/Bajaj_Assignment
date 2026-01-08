const { HTTP_STATUS } = require('../config/constants');

function errorHandler(err, req, res, next) {
    
    console.error(' Error:', err.message);
    console.error('Stack:', err.stack);

    const statusCode = err.statusCode || err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR;

    const message = err.message || 'An unexpected error occurred';

    res.status(statusCode).json({
        success: false,
        message: message,
        statusCode: statusCode,
        
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
}

function notFoundHandler(req, res, next) {
    const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
    error.statusCode = HTTP_STATUS.NOT_FOUND;
    next(error);
}

function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}

module.exports = {
    errorHandler,
    notFoundHandler,
    asyncHandler
};