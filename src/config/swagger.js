const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        
        info: {
            title: 'Trading API SDK',
           
            description: 'RESTful API for trading platform with order management, portfolio tracking, and trade execution. This API provides endpoints for viewing instruments, placing orders, tracking trades, and managing portfolios.'
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development server'
            }
        ],
        tags: [
            {
                name: 'Instruments',
                description: 'Endpoints for fetching tradable instruments'
            },
            {
                name: 'Orders',
                description: 'Order placement, tracking, and cancellation'
            },
            {
                name: 'Trades',
                description: 'Trade execution history and statistics'
            },
            {
                name: 'Portfolio',
                description: 'Portfolio holdings and performance tracking'
            }
        ],
        paths: {
            '/api/v1/instruments': {
                get: {
                    tags: ['Instruments'],
                    summary: 'Get all instruments',
                    description: 'Retrieves a list of all available trading instruments',
                    responses: {
                        200: {
                            description: 'Successful response',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            success: { type: 'boolean', example: true },
                                            message: { type: 'string', example: 'Instruments fetched successfully' },
                                            data: {
                                                type: 'array',
                                                items: { $ref: '#/components/schemas/Instrument' }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            '/api/v1/instruments/{symbol}': {
                get: {
                    tags: ['Instruments'],
                    summary: 'Get instrument by symbol',
                    description: 'Retrieves details of a specific instrument',
                    parameters: [
                        {
                            name: 'symbol',
                            in: 'path',
                            required: true,
                            schema: { type: 'string' },
                            example: 'RELIANCE'
                        }
                    ],
                    responses: {
                        200: {
                            description: 'Successful response',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            success: { type: 'boolean', example: true },
                                            message: { type: 'string' },
                                            data: { $ref: '#/components/schemas/Instrument' }
                                        }
                                    }
                                }
                            }
                        },
                        404: {
                            description: 'Instrument not found',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/ErrorResponse' }
                                }
                            }
                        }
                    }
                }
            },
            '/api/v1/orders': {
                post: {
                    tags: ['Orders'],
                    summary: 'Place a new order',
                    description: 'Places a new BUY or SELL order. MARKET orders execute immediately, LIMIT orders are placed in PLACED status.',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/OrderRequest' }
                            }
                        }
                    },
                    responses: {
                        201: {
                            description: 'Order placed successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            success: { type: 'boolean', example: true },
                                            message: { type: 'string' },
                                            data: {
                                                type: 'object',
                                                properties: {
                                                    order: { $ref: '#/components/schemas/Order' },
                                                    trade: { $ref: '#/components/schemas/Trade' }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        400: {
                            description: 'Invalid request',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/ErrorResponse' }
                                }
                            }
                        }
                    }
                },
                get: {
                    tags: ['Orders'],
                    summary: 'Get all orders',
                    description: 'Retrieves all orders for the authenticated user',
                    responses: {
                        200: {
                            description: 'Successful response',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            success: { type: 'boolean', example: true },
                                            message: { type: 'string' },
                                            data: {
                                                type: 'array',
                                                items: { $ref: '#/components/schemas/Order' }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            '/api/v1/orders/{orderId}': {
                get: {
                    tags: ['Orders'],
                    summary: 'Get order by ID',
                    description: 'Retrieves details of a specific order',
                    parameters: [
                        {
                            name: 'orderId',
                            in: 'path',
                            required: true,
                            schema: { type: 'string' }
                        }
                    ],
                    responses: {
                        200: {
                            description: 'Successful response',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            success: { type: 'boolean', example: true },
                                            message: { type: 'string' },
                                            data: { $ref: '#/components/schemas/Order' }
                                        }
                                    }
                                }
                            }
                        },
                        404: {
                            description: 'Order not found',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/ErrorResponse' }
                                }
                            }
                        }
                    }
                },
                delete: {
                    tags: ['Orders'],
                    summary: 'Cancel an order',
                    description: 'Cancels an order. Only orders in PLACED status can be cancelled.',
                    parameters: [
                        {
                            name: 'orderId',
                            in: 'path',
                            required: true,
                            schema: { type: 'string' }
                        }
                    ],
                    responses: {
                        200: {
                            description: 'Order cancelled successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            success: { type: 'boolean', example: true },
                                            message: { type: 'string' },
                                            data: { $ref: '#/components/schemas/Order' }
                                        }
                                    }
                                }
                            }
                        },
                        400: {
                            description: 'Cannot cancel order',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/ErrorResponse' }
                                }
                            }
                        }
                    }
                }
            },
            '/api/v1/trades': {
                get: {
                    tags: ['Trades'],
                    summary: 'Get all trades',
                    description: 'Retrieves all executed trades for the authenticated user',
                    responses: {
                        200: {
                            description: 'Successful response',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            success: { type: 'boolean', example: true },
                                            message: { type: 'string' },
                                            data: {
                                                type: 'array',
                                                items: { $ref: '#/components/schemas/Trade' }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            '/api/v1/portfolio': {
                get: {
                    tags: ['Portfolio'],
                    summary: 'Get portfolio holdings',
                    description: 'Retrieves current portfolio holdings with calculated values',
                    responses: {
                        200: {
                            description: 'Successful response',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            success: { type: 'boolean', example: true },
                                            message: { type: 'string' },
                                            data: {
                                                type: 'array',
                                                items: { $ref: '#/components/schemas/Portfolio' }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        components: {
            schemas: {
                Instrument: {
                    type: 'object',
                    properties: {
                        symbol: {
                            type: 'string',
                            description: 'Instrument symbol',
                            example: 'RELIANCE'
                        },
                        exchange: {
                            type: 'string',
                            enum: ['NSE', 'BSE'],
                            description: 'Stock exchange',
                            example: 'NSE'
                        },
                        instrumentType: {
                            type: 'string',
                            enum: ['EQUITY', 'FUTURES', 'OPTIONS', 'COMMODITY'],
                            description: 'Type of instrument',
                            example: 'EQUITY'
                        },
                        lastTradedPrice: {
                            type: 'number',
                            description: 'Current market price',
                            example: 2450.75
                        }
                    }
                },
                Order: {
                    type: 'object',
                    properties: {
                        orderId: {
                            type: 'string',
                            description: 'Unique order identifier',
                            example: 'abc123-def456-ghi789'
                        },
                        userId: {
                            type: 'string',
                            description: 'User identifier',
                            example: 'user_001'
                        },
                        symbol: {
                            type: 'string',
                            description: 'Instrument symbol',
                            example: 'RELIANCE'
                        },
                        orderType: {
                            type: 'string',
                            enum: ['BUY', 'SELL'],
                            description: 'Order type',
                            example: 'BUY'
                        },
                        orderStyle: {
                            type: 'string',
                            enum: ['MARKET', 'LIMIT'],
                            description: 'Order style',
                            example: 'MARKET'
                        },
                        quantity: {
                            type: 'integer',
                            description: 'Number of shares',
                            example: 10
                        },
                        price: {
                            type: 'number',
                            description: 'Limit price (for LIMIT orders)',
                            example: 2450.75
                        },
                        status: {
                            type: 'string',
                            enum: ['NEW', 'PLACED', 'EXECUTED', 'CANCELLED'],
                            description: 'Current order status',
                            example: 'EXECUTED'
                        },
                        timestamp: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Order creation time'
                        }
                    }
                },
                OrderRequest: {
                    type: 'object',
                    required: ['symbol', 'orderType', 'orderStyle', 'quantity'],
                    properties: {
                        symbol: {
                            type: 'string',
                            description: 'Instrument symbol - Choose from any of the 15 available stocks',
                            enum: ['RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'ICICIBANK', 'WIPRO', 'BHARTIARTL', 'ITC', 'SBIN', 'LT', 'TATAMOTORS', 'MARUTI', 'BAJFINANCE', 'ASIANPAINT', 'SUNPHARMA'],
                            example: 'TCS'
                        },
                        orderType: {
                            type: 'string',
                            enum: ['BUY', 'SELL'],
                            description: 'BUY or SELL',
                            example: 'BUY'
                        },
                        orderStyle: {
                            type: 'string',
                            enum: ['MARKET', 'LIMIT'],
                            description: 'MARKET (immediate) or LIMIT (at specific price)',
                            example: 'MARKET'
                        },
                        quantity: {
                            type: 'integer',
                            minimum: 1,
                            description: 'Number of shares (must be > 0)',
                            example: 10
                        },
                        price: {
                            type: 'number',
                            description: 'Required for LIMIT orders only',
                            example: 3680.50
                        }
                    }
                },
                Trade: {
                    type: 'object',
                    properties: {
                        tradeId: {
                            type: 'string',
                            description: 'Unique trade identifier',
                            example: 'xyz789-uvw456-rst123'
                        },
                        orderId: {
                            type: 'string',
                            description: 'Associated order ID',
                            example: 'abc123-def456-ghi789'
                        },
                        userId: {
                            type: 'string',
                            description: 'User identifier',
                            example: 'user_001'
                        },
                        symbol: {
                            type: 'string',
                            description: 'Instrument symbol',
                            example: 'RELIANCE'
                        },
                        orderType: {
                            type: 'string',
                            enum: ['BUY', 'SELL'],
                            description: 'Trade type',
                            example: 'BUY'
                        },
                        quantity: {
                            type: 'integer',
                            description: 'Number of shares traded',
                            example: 10
                        },
                        executedPrice: {
                            type: 'number',
                            description: 'Execution price',
                            example: 2450.75
                        },
                        timestamp: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Trade execution time'
                        }
                    }
                },
                Portfolio: {
                    type: 'object',
                    properties: {
                        symbol: {
                            type: 'string',
                            description: 'Instrument symbol',
                            example: 'RELIANCE'
                        },
                        quantity: {
                            type: 'integer',
                            description: 'Net quantity held (BUY - SELL)',
                            example: 10
                        },
                        averagePrice: {
                            type: 'number',
                            description: 'Weighted average purchase price',
                            example: 2450.75
                        },
                        currentValue: {
                            type: 'number',
                            description: 'Current market value (quantity × current price)',
                            example: 24507.50
                        }
                    }
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: false
                        },
                        message: {
                            type: 'string',
                            description: 'Error description',
                            example: 'Invalid request'
                        },
                        statusCode: {
                            type: 'integer',
                            description: 'HTTP status code',
                            example: 400
                        }
                    }
                }
            }
        }
    },
    apis: []
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = {
    swaggerUi,
    swaggerSpec
};
