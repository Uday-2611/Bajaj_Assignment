const db = require('../storage/inMemoryDB');
const { runMatchingEngine } = require('./matchingEngine');

// Configuration
const PRICE_UPDATE_INTERVAL = 5000; // 5 seconds
const VOLATILITY = 0.005; // ±0.5% price change

let simulationInterval = null;


function updatePrices() {
    try {
        const instruments = db.getAllInstruments();
        const priceChanges = [];

        instruments.forEach(instrument => {
            const currentPrice = instrument.lastTradedPrice;

            // Generate random change between -VOLATILITY and +VOLATILITY
            // Math.random() gives [0, 1), we transform it to [-0.5%, +0.5%]
            const randomChange = (Math.random() - 0.5) * 2 * VOLATILITY;

            // Calculate new price using random walk formula
            const newPrice = currentPrice * (1 + randomChange);

            // Round to 2 decimal places for realistic pricing
            const roundedPrice = Math.round(newPrice * 100) / 100;

            // Update the instrument price in database
            db.updateInstrumentPrice(instrument.symbol, roundedPrice);

            // Track changes for logging
            const changePercent = ((roundedPrice - currentPrice) / currentPrice * 100).toFixed(2);
            priceChanges.push({
                symbol: instrument.symbol,
                oldPrice: currentPrice.toFixed(2),
                newPrice: roundedPrice.toFixed(2),
                change: changePercent
            });
        });

        // Log price updates
        console.log('\nPrice Update (Random Walk):');
        priceChanges.forEach(change => {
            const arrow = parseFloat(change.change) >= 0 ? 'UP  ' : 'DOWN';
            console.log(`  ${arrow} ${change.symbol}: Rs.${change.oldPrice} -> Rs.${change.newPrice} (${change.change}%)`);
        });

        // After updating prices, run matching engine to check for limit order execution
        runMatchingEngine();

    } catch (error) {
        console.error('Error updating prices:', error.message);
    }
}

/**
 * Start the price simulation
 * Prices will update every 5 seconds using random walk algorithm
 */
function startPriceSimulation() {
    if (simulationInterval) {
        console.log('Price simulation is already running');
        return;
    }

    console.log('\n' + '='.repeat(50));
    console.log('Starting Price Simulation (Random Walk)');
    console.log('='.repeat(50));
    console.log(`Update Interval: ${PRICE_UPDATE_INTERVAL / 1000} seconds`);
    console.log(`Volatility: ±${VOLATILITY * 100}%`);
    console.log('='.repeat(50) + '\n');

    // Run initial price update
    updatePrices();

    // Set up recurring price updates
    simulationInterval = setInterval(updatePrices, PRICE_UPDATE_INTERVAL);
}

/**
 * Stop the price simulation
 */
function stopPriceSimulation() {
    if (simulationInterval) {
        clearInterval(simulationInterval);
        simulationInterval = null;
        console.log('\nPrice simulation stopped\n');
    }
}

/**
 * Check if simulation is running
 */
function isSimulationRunning() {
    return simulationInterval !== null;
}

module.exports = {
    startPriceSimulation,
    stopPriceSimulation,
    isSimulationRunning
};
