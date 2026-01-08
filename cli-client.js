const readline = require('readline');
const http = require('http');

const API_BASE = 'http://localhost:3000';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Helper function to make HTTP requests
function makeRequest(method, path, data = null) {
    return new Promise((resolve, reject) => {
        const url = new URL(path, API_BASE);
        const options = {
            hostname: url.hostname,
            port: url.port,
            path: url.pathname,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(body));
                } catch (e) {
                    resolve(body);
                }
            });
        });

        req.on('error', reject);

        if (data) {
            req.write(JSON.stringify(data));
        }

        req.end();
    });
}

// Helper to display formatted JSON
function displayJSON(data) {
    console.log(JSON.stringify(data, null, 2));
}

// Helper to display table
function displayTable(headers, rows) {
    const colWidths = headers.map((h, i) => {
        const maxWidth = Math.max(
            h.length,
            ...rows.map(r => String(r[i] || '').length)
        );
        return maxWidth + 2;
    });

    const line = '─'.repeat(colWidths.reduce((a, b) => a + b, 0) + headers.length + 1);

    console.log('┌' + line + '┐');
    console.log('│ ' + headers.map((h, i) => h.padEnd(colWidths[i])).join('│ ') + '│');
    console.log('├' + line + '┤');

    rows.forEach(row => {
        console.log('│ ' + row.map((cell, i) => String(cell || '').padEnd(colWidths[i])).join('│ ') + '│');
    });

    console.log('└' + line + '┘');
}

// Clear screen
function clearScreen() {
    console.clear();
}

// Display header
function displayHeader() {
    console.log('TRADING PLATFORM - Bajaj Broking');
    console.log('Interactive CLI Client');
}

// Main menu
function showMainMenu() {
    clearScreen();
    displayHeader();
    console.log('Main Menu:\n');
    console.log('1. View All Instruments');
    console.log('2. Buy Stocks');
    console.log('3. Sell Stocks');
    console.log('4. View My Orders');
    console.log('5. View My Portfolio');
    console.log('6. View Trade History');
    console.log('7. Cancel Order');
    console.log('0. Exit\n');

    rl.question('Enter your choice: ', handleMainMenu);
}

// Handle main menu choice
async function handleMainMenu(choice) {
    try {
        switch (choice.trim()) {
            case '1':
                await viewInstruments();
                break;
            case '2':
                await buyStocks();
                break;
            case '3':
                await sellStocks();
                break;
            case '4':
                await viewOrders();
                break;
            case '5':
                await viewPortfolio();
                break;
            case '6':
                await viewTrades();
                break;
            case '7':
                await cancelOrder();
                break;
            case '0':
                console.log('\nThank you for using Trading Platform!\n');
                rl.close();
                process.exit(0);
                return;
            default:
                console.log('\nInvalid choice. Please try again.\n');
                await waitForEnter();
                showMainMenu();
                return;
        }
    } catch (error) {
        console.log('\nError:', error.message);
        await waitForEnter();
        showMainMenu();
    }
}

// Wait for Enter key
function waitForEnter() {
    return new Promise(resolve => {
        rl.question('\nPress Enter to continue...', () => resolve());
    });
}

// View all instruments
async function viewInstruments() {
    console.log('Available Instruments');

    const response = await makeRequest('GET', '/api/v1/instruments');

    if (response.success) {
        const instruments = response.data;
        const rows = instruments.map((inst, i) => [
            i + 1,
            inst.symbol,
            inst.exchange,
            inst.instrumentType,
            `₹${inst.lastTradedPrice.toFixed(2)}`
        ]);

        displayTable(['No.', 'Symbol', 'Exchange', 'Type', 'Price'], rows);
    } else {
        console.log('Error:', response.message);
    }

    await waitForEnter();
    showMainMenu();
}

// Buy stocks
async function buyStocks() {
    console.log('Place BUY Order');

    const symbol = await new Promise(resolve => {
        rl.question('Enter Stock Symbol (e.g., RELIANCE): ', resolve);
    });

    const quantity = await new Promise(resolve => {
        rl.question('Enter Quantity: ', resolve);
    });

    console.log('\nOrder Type:');
    console.log('1. MARKET (Execute immediately)');
    console.log('2. LIMIT (Set price)');

    const orderTypeChoice = await new Promise(resolve => {
        rl.question('Enter choice: ', resolve);
    });

    let orderStyle = orderTypeChoice === '1' ? 'MARKET' : 'LIMIT';
    let price = null;

    if (orderStyle === 'LIMIT') {
        price = await new Promise(resolve => {
            rl.question('Enter Limit Price: ', resolve);
        });
        price = parseFloat(price);
    }

    console.log('\nPlacing order...\n');

    const orderData = {
        symbol: symbol.toUpperCase(),
        orderType: 'BUY',
        orderStyle: orderStyle,
        quantity: parseInt(quantity),
        price: price
    };

    const response = await makeRequest('POST', '/api/v1/orders', orderData);

    if (response.success) {
        console.log('Order Placed Successfully!\n');
        displayJSON(response.data);
    } else {
        console.log('Order Failed!');
        if (response.errors) {
            response.errors.forEach(err => console.log('  - ' + err));
        } else {
            console.log('  - ' + response.message);
        }
    }

    await waitForEnter();
    showMainMenu();
}

// Sell stocks
async function sellStocks() {
    console.log('Place SELL Order');

    const symbol = await new Promise(resolve => {
        rl.question('Enter Stock Symbol (e.g., RELIANCE): ', resolve);
    });

    const quantity = await new Promise(resolve => {
        rl.question('Enter Quantity: ', resolve);
    });

    console.log('\nOrder Type:');
    console.log('1. MARKET (Execute immediately)');
    console.log('2. LIMIT (Set price)');

    const orderTypeChoice = await new Promise(resolve => {
        rl.question('Enter choice: ', resolve);
    });

    let orderStyle = orderTypeChoice === '1' ? 'MARKET' : 'LIMIT';
    let price = null;

    if (orderStyle === 'LIMIT') {
        price = await new Promise(resolve => {
            rl.question('Enter Limit Price: ', resolve);
        });
        price = parseFloat(price);
    }

    console.log('\nPlacing order...\n');

    const orderData = {
        symbol: symbol.toUpperCase(),
        orderType: 'SELL',
        orderStyle: orderStyle,
        quantity: parseInt(quantity),
        price: price
    };

    const response = await makeRequest('POST', '/api/v1/orders', orderData);

    if (response.success) {
        console.log('Order Placed Successfully!\n');
        displayJSON(response.data);
    } else {
        console.log('Order Failed!');
        if (response.errors) {
            response.errors.forEach(err => console.log('  - ' + err));
        } else {
            console.log('  - ' + response.message);
        }
    }

    await waitForEnter();
    showMainMenu();
}

// View orders
async function viewOrders() {
    console.log('My Orders');

    const response = await makeRequest('GET', '/api/v1/orders');

    if (response.success && response.data.length > 0) {
        const orders = response.data;
        const rows = orders.map(order => [
            order.orderId.substring(0, 8) + '...',
            order.symbol,
            order.orderType,
            order.orderStyle,
            order.quantity,
            order.status
        ]);

        displayTable(['Order ID', 'Symbol', 'Type', 'Style', 'Qty', 'Status'], rows);
    } else if (response.success) {
        console.log('No orders found.\n');
    } else {
        console.log('Error:', response.message);
    }

    await waitForEnter();
    showMainMenu();
}

// View portfolio
async function viewPortfolio() {
    console.log('My Portfolio');

    const response = await makeRequest('GET', '/api/v1/portfolio');

    if (response.success && response.data.length > 0) {
        const holdings = response.data;
        const rows = holdings.map(holding => [
            holding.symbol,
            holding.quantity,
            `₹${holding.averagePrice.toFixed(2)}`,
            `₹${holding.currentValue.toFixed(2)}`
        ]);

        displayTable(['Symbol', 'Quantity', 'Avg Price', 'Current Value'], rows);

        const totalValue = holdings.reduce((sum, h) => sum + h.currentValue, 0);
        console.log(`\nTotal Portfolio Value: ₹${totalValue.toFixed(2)}\n`);
    } else if (response.success) {
        console.log('Portfolio is empty. Start trading to build your portfolio!\n');
    } else {
        console.log('Error:', response.message);
    }

    await waitForEnter();
    showMainMenu();
}

// View trades
async function viewTrades() {
    console.log('Trade History');

    const response = await makeRequest('GET', '/api/v1/trades');

    if (response.success && response.data.length > 0) {
        const trades = response.data;
        const rows = trades.map(trade => [
            trade.tradeId.substring(0, 8) + '...',
            trade.symbol,
            trade.orderType,
            trade.quantity,
            `₹${trade.executedPrice.toFixed(2)}`,
            `₹${(trade.quantity * trade.executedPrice).toFixed(2)}`
        ]);

        displayTable(['Trade ID', 'Symbol', 'Type', 'Qty', 'Price', 'Total'], rows);
    } else if (response.success) {
        console.log('No trades found.\n');
    } else {
        console.log('Error:', response.message);
    }

    await waitForEnter();
    showMainMenu();
}

// Cancel order
async function cancelOrder() {
    console.log('Cancel Order');

    // First, show current orders
    const ordersResponse = await makeRequest('GET', '/api/v1/orders');

    if (ordersResponse.success && ordersResponse.data.length > 0) {
        const orders = ordersResponse.data;

        // Filter only PLACED orders (can be cancelled)
        const placeableOrders = orders.filter(o => o.status === 'PLACED');

        if (placeableOrders.length === 0) {
            console.log('No orders available to cancel.');
            console.log('Only PLACED orders can be cancelled.\n');
            await waitForEnter();
            showMainMenu();
            return;
        }

        console.log('Orders that can be cancelled:\n');
        const rows = placeableOrders.map((order, i) => [
            i + 1,
            order.orderId.substring(0, 8) + '...',
            order.symbol,
            order.orderType,
            order.orderStyle,
            order.quantity,
            order.status
        ]);

        displayTable(['#', 'Order ID', 'Symbol', 'Type', 'Style', 'Qty', 'Status'], rows);

        console.log('\nTip: Enter the # number from the table above\n');

        const indexInput = await new Promise(resolve => {
            rl.question('Enter order number to cancel (or press Enter to go back): ', resolve);
        });

        if (!indexInput.trim()) {
            showMainMenu();
            return;
        }

        const index = parseInt(indexInput.trim()) - 1;

        if (isNaN(index) || index < 0 || index >= placeableOrders.length) {
            console.log('\nInvalid order number. Please try again.\n');
            await waitForEnter();
            showMainMenu();
            return;
        }

        const selectedOrder = placeableOrders[index];
        const orderId = selectedOrder.orderId;

        console.log(`\nCancelling order for ${selectedOrder.symbol}...\n`);

        const response = await makeRequest('DELETE', `/api/v1/orders/${orderId}`);

        if (response.success) {
            console.log('Order Cancelled Successfully!\n');
            displayJSON(response.data);
        } else {
            console.log('Cancellation Failed!');
            console.log('  - ' + response.message);
        }
    } else if (ordersResponse.success) {
        console.log('No orders found.\n');
    } else {
        console.log('Error:', ordersResponse.message);
    }

    await waitForEnter();
    showMainMenu();
}

// Check if server is running
async function checkServer() {
    try {
        await makeRequest('GET', '/health');
        return true;
    } catch (error) {
        return false;
    }
}

// Start the CLI
async function start() {
    console.log('\nChecking API server connection...\n');

    const serverRunning = await checkServer();

    if (!serverRunning) {
        console.log('Error: API server is not running!');
        console.log('Please start the server first:');
        console.log('1. Open another terminal');
        console.log('2. Run: npm run server\n');
        rl.close();
        process.exit(1);
        return;
    }

    console.log('Connected to API server!\n');
    setTimeout(showMainMenu, 1000);
}

start();
