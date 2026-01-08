# Trading API SDK

A RESTful API implementation for a simplified trading platform built with Node.js and Express.js.

## Table of Contents

- [Overview](#overview)
- [Setup Instructions](#setup-instructions)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Assumptions](#assumptions)

## Overview

This project implements a REST API wrapper SDK that simulates core trading workflows including instrument viewing, order placement, trade execution, and portfolio management. The implementation uses in-memory storage and does not require real market connectivity.

### Core Features

- View available financial instruments
- Place and manage orders (BUY/SELL with MARKET/LIMIT styles)
- Track order status and execution
- View trade history
- Monitor portfolio holdings

### Technical Stack

- **Runtime**: Node.js (v14+)
- **Framework**: Express.js
- **Language**: JavaScript (CommonJS)
- **Storage**: In-memory (JavaScript Maps)
- **Dependencies**: express, uuid, body-parser

## Setup Instructions

### Prerequisites

- Node.js v14 or higher
- npm package manager

### Installation

1. Navigate to project directory:
```bash
cd Bajaj_Uday_Assignment
```

2. Install dependencies:
```bash
npm install
```

3. Start the API server:
```bash
npm run server
```

The server will start on `http://localhost:3000` with 15 pre-seeded instruments.

The server will start on `http://localhost:3000` with 15 pre-seeded instruments.

### Verification

Test server status:
```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "success": true,
  "message": "Trading API is running",
  "timestamp": "2026-01-08T14:00:00.000Z"
}
```

### Interactive API Documentation (Swagger)

Access the interactive API documentation at:
```
http://localhost:3000/api-docs
```

The Swagger UI provides:
- Complete API endpoint documentation
- Interactive "Try it out" functionality to test endpoints directly in the browser
- Request/response schemas and examples
- No need to use curl or Postman for testing

## API Documentation

### Base URL
```
http://localhost:3000/api/v1
```

### Authentication
Mock authentication is implemented. All requests are automatically authenticated with a default user (`user_001`).

### Endpoints

#### 1. Instruments

**GET /api/v1/instruments**

Retrieves all available instruments.

Response:
```json
{
  "success": true,
  "message": "Instruments fetched successfully",
  "data": [
    {
      "symbol": "RELIANCE",
      "exchange": "NSE",
      "instrumentType": "EQUITY",
      "lastTradedPrice": 2450.75
    }
  ]
}
```

**GET /api/v1/instruments/:symbol**

Retrieves a specific instrument by symbol.

#### 2. Orders

**POST /api/v1/orders**

Places a new order.

Request Body:
```json
{
  "symbol": "RELIANCE",
  "orderType": "BUY",
  "orderStyle": "MARKET",
  "quantity": 10,
  "price": 2450.75
}
```

Parameters:
- `symbol` (required): Instrument symbol
- `orderType` (required): BUY or SELL
- `orderStyle` (required): MARKET or LIMIT
- `quantity` (required): Positive integer
- `price` (required for LIMIT orders): Positive number

Response for MARKET order:
```json
{
  "success": true,
  "message": "Order executed successfully",
  "data": {
    "order": {
      "orderId": "uuid",
      "status": "EXECUTED",
      "symbol": "RELIANCE",
      "orderType": "BUY",
      "quantity": 10
    },
    "trade": {
      "tradeId": "uuid",
      "executedPrice": 2450.75
    }
  }
}
```

**GET /api/v1/orders**

Retrieves all orders for the authenticated user.

**GET /api/v1/orders/:orderId**

Retrieves a specific order by ID.

**DELETE /api/v1/orders/:orderId**

Cancels an order. Only orders in PLACED status can be cancelled.

Order Status Flow:
- NEW: Order created
- PLACED: Order submitted to system
- EXECUTED: Order completed
- CANCELLED: Order cancelled

#### 3. Trades

**GET /api/v1/trades**

Retrieves all executed trades for the authenticated user.

Response:
```json
{
  "success": true,
  "message": "Trades fetched successfully",
  "data": [
    {
      "tradeId": "uuid",
      "orderId": "uuid",
      "symbol": "RELIANCE",
      "orderType": "BUY",
      "quantity": 10,
      "executedPrice": 2450.75,
      "timestamp": "2026-01-08T14:00:00.000Z"
    }
  ]
}
```

**GET /api/v1/trades/stats**

Retrieves trade statistics for the authenticated user.

**GET /api/v1/trades/order/:orderId**

Retrieves trades for a specific order.

#### 4. Portfolio

**GET /api/v1/portfolio**

Retrieves current portfolio holdings.

Response:
```json
{
  "success": true,
  "message": "Portfolio fetched successfully",
  "data": [
    {
      "symbol": "RELIANCE",
      "quantity": 10,
      "averagePrice": 2450.75,
      "currentValue": 24507.50
    }
  ]
}
```

Portfolio Calculation:
- `quantity`: Net quantity (BUY trades - SELL trades)
- `averagePrice`: Weighted average purchase price
- `currentValue`: quantity × current market price

**GET /api/v1/portfolio/summary**

Retrieves portfolio summary with total values and profit/loss.

**GET /api/v1/portfolio/:symbol**

Retrieves holding details for a specific symbol.

### Error Responses

All errors follow a standard format:

```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400
}
```

HTTP Status Codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 404: Not Found
- 500: Internal Server Error

## Project Structure

```
src/
├── config/
│   └── constants.js          # Application constants
├── models/
│   ├── Instrument.js         # Instrument model with validation
│   ├── Order.js              # Order model with validation
│   ├── Trade.js              # Trade model
│   └── Portfolio.js          # Portfolio model
├── services/
│   ├── instrumentService.js  # Instrument business logic
│   ├── orderService.js       # Order processing and execution
│   ├── tradeService.js       # Trade operations
│   └── portfolioService.js   # Portfolio calculations
├── controllers/
│   ├── instrumentController.js
│   ├── orderController.js
│   ├── tradeController.js
│   └── portfolioController.js
├── routes/
│   ├── instruments.js
│   ├── orders.js
│   ├── trades.js
│   └── portfolio.js
├── middleware/
│   ├── auth.js               # Mock authentication
│   └── errorHandler.js       # Centralized error handling
├── utils/
│   └── responseFormatter.js  # Standardized API responses
├── storage/
│   └── inMemoryDB.js         # In-memory data storage
└── app.js                    # Express application setup

server.js                     # Server entry point
```

## Assumptions

The following assumptions were made during implementation:

1. **Authentication**: Mock authentication with a single hardcoded user is acceptable for demonstration purposes. Production systems would require JWT-based authentication.

2. **Data Persistence**: In-memory storage is sufficient. Data is reset on server restart. Production systems would use a database (PostgreSQL, MongoDB, etc.).

3. **Order Execution Logic**:
   - MARKET orders execute immediately at the current `lastTradedPrice`
   - LIMIT orders are placed in PLACED status but do not auto-execute
   - No matching engine is implemented for LIMIT orders

4. **Instrument Data**: 15 Indian stock instruments (NSE and BSE) are pre-seeded with static prices. No live market data feed is integrated.

5. **Portfolio Calculation**: Portfolio holdings are calculated dynamically from trade history. Net quantity is computed as (total BUY quantity - total SELL quantity) per symbol.

6. **Validation Rules**:
   - Order quantity must be greater than 0
   - Price is mandatory for LIMIT orders
   - Symbol must exist in the instrument list
   - Only PLACED orders can be cancelled

7. **Error Handling**: All errors return standardized JSON responses with appropriate HTTP status codes.

8. **Concurrency**: No handling for concurrent order placement. Production systems would implement locking mechanisms or use database transactions.

9. **API Versioning**: API is versioned at `/api/v1`. Future versions would use `/api/v2`, etc.

10. **User Isolation**: Single user system. Multi-user support would require proper user management and data isolation.

## Assignment Compliance

This implementation fulfills all specified requirements:

**Functional Requirements**:
- Instrument APIs for fetching available instruments
- Order Management APIs for placing and tracking orders
- Trade APIs for viewing executed trades
- Portfolio APIs for monitoring holdings

**Non-Functional Requirements**:
- RESTful API design with proper HTTP methods and status codes
- Clean code structure with separation of concerns (MVC pattern)
- Comprehensive error handling
- In-memory storage implementation
- Mock authentication

**Deliverables**:
- Complete source code with modular architecture
- Setup and installation instructions
- Comprehensive API documentation
- Implementation assumptions

## Author

Uday  
Bajaj Broking - Campus Hiring Assignment
