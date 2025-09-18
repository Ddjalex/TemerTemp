// Currency formatting utility
import { getPublicSettings } from './api';

let currentCurrency = 'ETB'; // Default to ETB
let currencyCache = null;

// Load currency from API settings
export const loadCurrencySettings = async () => {
  try {
    if (!currencyCache) {
      const settings = await getPublicSettings();
      currentCurrency = settings.general?.site_currency || 'ETB';
      currencyCache = currentCurrency;
    }
    return currentCurrency;
  } catch (error) {
    console.warn('Failed to load currency settings:', error);
    return 'ETB'; // Fallback to ETB
  }
};

// Format currency based on current settings
export const formatCurrency = (amount) => {
  if (typeof amount !== 'number') {
    return amount;
  }

  const currency = currentCurrency || 'ETB';
  
  if (currency === 'ETB') {
    // Ethiopian Birr formatting
    if (amount >= 1000000) {
      return `ETB ${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `ETB ${(amount / 1000).toFixed(0)}K`;
    }
    return `ETB ${amount.toLocaleString()}`;
  } else {
    // Default formatting for other currencies
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }
};

// Get current currency
export const getCurrency = () => currentCurrency || 'ETB';

// Set currency (for admin or testing)
export const setCurrency = (currency) => {
  currentCurrency = currency;
  currencyCache = currency;
};