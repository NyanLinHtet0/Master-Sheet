export class Transaction {
  constructor({ description, amount, date, rate = 1, currency = 'MMK' }) {
    this.description = description;
    this.amount = Number(amount);
    this.date = date || new Date().toISOString().split('T')[0];
    this.rate = Number(rate); // Exchange rate
    this.currency = currency;
  }

  // Example of a complex function: Get value in base currency
  getConvertedValue() {
    return this.amount * this.rate;
  }
}

export class Corporation {
  constructor(data) {
    this.name = data.name || "";
    this.balance = Number(data.balance) || 0;
    this.order = data.order;
    this.transactions = (data.transactions || []).map(tx => new Transaction(tx));
  }

  // Composition: Add complex logic here
  calculateTotalByCurrency(currency) {
    return this.transactions
      .filter(tx => tx.currency === currency)
      .reduce((sum, tx) => sum + tx.amount, 0);
  }

  // Formats data back for the API
  toJSON() {
    return {
      name: this.name,
      balance: this.balance,
      order: this.order,
      transactions: this.transactions
    };
  }
}