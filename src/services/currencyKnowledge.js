/**
 * Currency Knowledge Base
 * Provides currency information and calculation utilities
 */

// Approximate USD values (can be updated)
const CURRENCY_DATA = {
  'USD': { name: 'US Dollar', valueUSD: 1.0, symbol: '$' },
  'USDT': { name: 'Tether', valueUSD: 1.0, symbol: 'USDT' },
  'USDC': { name: 'USD Coin', valueUSD: 1.0, symbol: 'USDC' },
  'HKD': { name: 'Hong Kong Dollar', valueUSD: 0.128, symbol: 'HK$' },
  'CNY': { name: 'Chinese Yuan', valueUSD: 0.14, symbol: '¥' },
  'EUR': { name: 'Euro', valueUSD: 1.08, symbol: '€' },
  'GBP': { name: 'British Pound', valueUSD: 1.27, symbol: '£' },
  'JPY': { name: 'Japanese Yen', valueUSD: 0.0067, symbol: '¥' },
  'BTC': { name: 'Bitcoin', valueUSD: 100000, symbol: '₿' },
  'ETH': { name: 'Ethereum', valueUSD: 3500, symbol: 'Ξ' }
};

/**
 * Get currency info
 */
export function getCurrencyInfo(currencyCode) {
  const code = currencyCode.toUpperCase();
  return CURRENCY_DATA[code] || { 
    name: code, 
    valueUSD: 1.0, 
    symbol: code 
  };
}

/**
 * Determine which currency is stronger (worth more)
 */
export function isStronger(currency1, currency2) {
  const curr1 = getCurrencyInfo(currency1);
  const curr2 = getCurrencyInfo(currency2);
  return curr1.valueUSD > curr2.valueUSD;
}

/**
 * Parse currency pair (e.g., "HKD/USDT", "usdt-hkd", "buy HKD sell USDT")
 * Returns { fromCurrency, toCurrency } where from=buy, to=sell
 */
export function parseCurrencyPair(input) {
  if (!input) return null;
  
  const inputUpper = input.toUpperCase().trim();
  
  // Pattern 1: "HKD/USDT" or "HKD-USDT"
  const slashMatch = inputUpper.match(/([A-Z]{3,4})[\/\-]([A-Z]{3,4})/);
  if (slashMatch) {
    return {
      fromCurrency: slashMatch[1],
      toCurrency: slashMatch[2]
    };
  }
  
  // Pattern 2: "buy HKD sell USDT" or "buying HKD selling USDT"
  const buySellMatch = inputUpper.match(/BUY(?:ING)?\s+([A-Z]{3,4}).*SELL(?:ING)?\s+([A-Z]{3,4})/);
  if (buySellMatch) {
    return {
      fromCurrency: buySellMatch[1],
      toCurrency: buySellMatch[2]
    };
  }
  
  // Pattern 3: Just two currency codes "HKD USDT"
  const twoCodesMatch = inputUpper.match(/\b([A-Z]{3,4})\s+([A-Z]{3,4})\b/);
  if (twoCodesMatch) {
    return {
      fromCurrency: twoCodesMatch[1],
      toCurrency: twoCodesMatch[2]
    };
  }
  
  return null;
}

/**
 * Calculate missing amount based on rate and one known amount
 * 
 * For HKD/USDT with rate 7:
 * - Rate interpretation: 1 USDT = 7 HKD (stronger currency = 1 unit)
 * - If buying 700 HKD: need to sell 700/7 = 100 USDT
 * - If selling 100 USDT: will buy 100*7 = 700 HKD
 */
export function calculateAmounts(orderData) {
  const { fromCurrency, toCurrency, rate, amountBuy, amountSell } = orderData;
  
  if (!fromCurrency || !toCurrency || !rate) {
    return orderData; // Can't calculate
  }
  
  const rateNum = parseFloat(rate);
  if (isNaN(rateNum) || rateNum <= 0) {
    return orderData;
  }
  
  // Determine which currency is stronger
  const fromStronger = isStronger(fromCurrency, toCurrency);
  
  // Rate interpretation: 1 unit of stronger currency = X units of weaker currency
  // For HKD/USDT (rate 7): 1 USDT = 7 HKD (USDT is stronger)
  
  if (amountBuy && !amountSell) {
    // Know how much we're buying, calculate how much to sell
    const buyNum = parseFloat(amountBuy);
    if (isNaN(buyNum)) return orderData;
    
    let sellAmount;
    if (fromStronger) {
      // Buying stronger currency (e.g., buying USDT with HKD)
      // amountBuy USDT / rate = amountSell HKD
      sellAmount = buyNum * rateNum;
    } else {
      // Buying weaker currency (e.g., buying HKD with USDT)
      // amountBuy HKD / rate = amountSell USDT
      sellAmount = buyNum / rateNum;
    }
    
    return {
      ...orderData,
      amountSell: Math.round(sellAmount * 100) / 100 // Round to 2 decimals
    };
  }
  
  if (amountSell && !amountBuy) {
    // Know how much we're selling, calculate how much to buy
    const sellNum = parseFloat(amountSell);
    if (isNaN(sellNum)) return orderData;
    
    let buyAmount;
    if (fromStronger) {
      // Selling weaker to buy stronger (e.g., selling HKD to buy USDT)
      // amountSell HKD / rate = amountBuy USDT
      buyAmount = sellNum / rateNum;
    } else {
      // Selling stronger to buy weaker (e.g., selling USDT to buy HKD)
      // amountSell USDT * rate = amountBuy HKD
      buyAmount = sellNum * rateNum;
    }
    
    return {
      ...orderData,
      amountBuy: Math.round(buyAmount * 100) / 100 // Round to 2 decimals
    };
  }
  
  // Both amounts provided, or neither - return as is
  return orderData;
}

/**
 * Format currency pair for display
 */
export function formatCurrencyPair(fromCurrency, toCurrency) {
  return `${fromCurrency}/${toCurrency}`;
}

/**
 * Validate currency code
 */
export function isValidCurrency(code) {
  if (!code || typeof code !== 'string') return false;
  const upperCode = code.toUpperCase();
  // Must be 3-4 letters
  return /^[A-Z]{3,4}$/.test(upperCode);
}
