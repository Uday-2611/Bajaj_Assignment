class Portfolio {
    constructor({
        symbol,
        quantity,
        averagePrice,
        currentValue
    }) {
        this.symbol = symbol;
        this.quantity = quantity;
        this.averagePrice = averagePrice;
        this.currentValue = currentValue;
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