const app = require('./src/app');
const { API_CONFIG } = require('./src/config/constants');

const PORT = API_CONFIG.PORT;

const server = app.listen(PORT, () => {
    console.log('\n' + '='.repeat(50));
    console.log(' Trading API Server Started');
    console.log('='.repeat(50));
    console.log(` Server running on: http://localhost:${PORT}`);
    console.log(` Health check: http://localhost:${PORT}/health`);
    console.log(` API Base URL: http://localhost:${PORT}${API_CONFIG.BASE_PATH}`);
    console.log('='.repeat(50));
    console.log('\n Available Endpoints:');
    console.log(`GET  ${API_CONFIG.BASE_PATH}/instruments`);
    console.log(`POST ${API_CONFIG.BASE_PATH}/orders`);
    console.log(`GET  ${API_CONFIG.BASE_PATH}/orders/:orderId`);
    console.log(`GET  ${API_CONFIG.BASE_PATH}/trades`);
    console.log(`GET  ${API_CONFIG.BASE_PATH}/portfolio`);
    console.log('='.repeat(50) + '\n');
});

process.on('SIGTERM', () => {
    console.log('️  SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log(' HTTP server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('\n️  SIGINT signal received: closing HTTP server');
    server.close(() => {
        console.log(' HTTP server closed');
        process.exit(0);
    });
});

module.exports = server;

