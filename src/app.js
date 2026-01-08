const express = require('express');
const { API_CONFIG } = require('./config/constants');
const { mockAuth } = require('./middleware/auth');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { swaggerUi, swaggerSpec } = require('./config/swagger');

const instrumentRoutes = require('./routes/instruments');
const orderRoutes = require('./routes/orders');
const tradeRoutes = require('./routes/trades');
const portfolioRoutes = require('./routes/portfolio');

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log(` ${req.method} ${req.path}`);
    next();
});

app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Trading API is running',
        timestamp: new Date().toISOString()
    });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Trading API Documentation'
}));

app.use(API_CONFIG.BASE_PATH, mockAuth);

app.use(`${API_CONFIG.BASE_PATH}/instruments`, instrumentRoutes);
app.use(`${API_CONFIG.BASE_PATH}/orders`, orderRoutes);
app.use(`${API_CONFIG.BASE_PATH}/trades`, tradeRoutes);
app.use(`${API_CONFIG.BASE_PATH}/portfolio`, portfolioRoutes);

app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Welcome to Trading API SDK - Bajaj Broking',
        version: '1.0.0',
        endpoints: {
            instruments: `${API_CONFIG.BASE_PATH}/instruments`,
            orders: `${API_CONFIG.BASE_PATH}/orders`,
            trades: `${API_CONFIG.BASE_PATH}/trades`,
            portfolio: `${API_CONFIG.BASE_PATH}/portfolio`
        },
        documentation: 'See README.md for API documentation'
    });
});

app.use(notFoundHandler);

app.use(errorHandler);

module.exports = app;
