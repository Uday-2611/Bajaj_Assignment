const ORDER_TYPES = {
    BUY: 'BUY',
    SELL: 'SELL'
};

const ORDER_STYLES = {
    MARKET: 'MARKET',
    LIMIT: 'LIMIT'
};

const ORDER_STATUS = {
    NEW: 'NEW',
    PLACED: 'PLACED',
    EXECUTED: 'EXECUTED',
    CANCELLED: 'CANCELLED'
};

const EXCHANGES = {
    NSE: 'NSE',   
    BSE: 'BSE'    
};

const INSTRUMENT_TYPES = {
    EQUITY: 'EQUITY',
    FUTURES: 'FUTURES',
    OPTIONS: 'OPTIONS',
    COMMODITY: 'COMMODITY'
};

const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
};

const ERROR_MESSAGES = {
    INVALID_ORDER_TYPE: 'Order type must be BUY or SELL',
    INVALID_ORDER_STYLE: 'Order style must be MARKET or LIMIT',
    INVALID_QUANTITY: 'Quantity must be greater than 0',
    PRICE_REQUIRED_FOR_LIMIT: 'Price is mandatory for LIMIT orders',
    INSTRUMENT_NOT_FOUND: 'Instrument not found',
    ORDER_NOT_FOUND: 'Order not found',
    INSUFFICIENT_QUANTITY: 'Insufficient quantity in portfolio for SELL order',
    INVALID_SYMBOL: 'Invalid instrument symbol'
};

const SUCCESS_MESSAGES = {
    ORDER_PLACED: 'Order placed successfully',
    ORDER_EXECUTED: 'Order executed successfully'
};

const API_CONFIG = {
    BASE_PATH: '/api/v1',
    PORT: process.env.PORT || 3000
};

const DEFAULT_USER = {
    userId: 'user_001',
    name: 'Test User',
    email: 'testuser@bajajbroking.com'
};

module.exports = {
    ORDER_TYPES,
    ORDER_STYLES,
    ORDER_STATUS,
    EXCHANGES,
    INSTRUMENT_TYPES,
    HTTP_STATUS,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES,
    API_CONFIG,
    DEFAULT_USER
};
