class Portfolio {
    constructor({
        symbol,
        quantity,
        averagePrice,
        currentPrice = null,
        investedValue = null,
        currentValue,
        unrealizedPnL = null,
        pnlPercentage = null
    }) {
        this.symbol = symbol;
        this.quantity = quantity;
        this.averagePrice = averagePrice;
        this.currentPrice = currentPrice;
        this.investedValue = investedValue;
        this.currentValue = currentValue;
        this.unrealizedPnL = unrealizedPnL;
        this.pnlPercentage = pnlPercentage;
    }

    calculateCurrentValue(lastTradedPrice) {
        this.currentValue = this.quantity * lastTradedPrice;
        return this.currentValue;
    }

    calculateProfitLoss() {
        return this.currentValue - (this.quantity * this.averagePrice);
    }

    calculateProfitLossPercentage() {
        const investedValue = this.quantity * this.averagePrice;
        if (investedValue === 0) return 0;
        return ((this.currentValue - investedValue) / investedValue) * 100;
    }

    static create(data) {
        return new Portfolio(data);
    }
}

module.exports = Portfolio;