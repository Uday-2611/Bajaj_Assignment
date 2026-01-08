const { DEFAULT_USER } = require('../config/constants');

function mockAuth(req, res, next) {

    req.user = DEFAULT_USER;

    console.log(` Authenticated user: ${req.user.userId} (${req.user.name})`);

    next();
}

function verifyUser(req, res, next) {
    if (!req.user || !req.user.userId) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized - User not authenticated',
            statusCode: 401
        });
    }
    next();
}

module.exports = {
    mockAuth,
    verifyUser
};