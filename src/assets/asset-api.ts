// src/assets/asset-api.ts
// Service for fetching real-time prices for stocks and crypto assets

/**
 * Fetch real-time stock price from Financial Modeling Prep public API
 * @param symbol Stock ticker symbol (e.g., 'AAPL', 'TSLA')
 * @returns Latest price as number, or null if not found
 * Uses the public demo API key (rate-limited)
 */
export async function getStockPrice(symbol: string): Promise<number | null> {
  const key = `asset-dairy:stock:PRICE:${symbol.toUpperCase()}`;
  const now = Date.now();
  const cached = localStorage.getItem(key);
  if (cached) {
    try {
      const { value, timestamp } = JSON.parse(cached);
      if (typeof value === 'number' && now - timestamp < 15 * 60 * 1000) {
        return value;
      }
    } catch {}
  }
  // Get API key from env (Vite convention)
  const apiKey = import.meta.env.VITE_FMP_API_KEY || 'demo';
  try {
    const res = await fetch(
      `https://financialmodelingprep.com/api/v3/quote-short/${encodeURIComponent(symbol)}?apikey=${apiKey}`
    );
    if (!res.ok) return null;
    const data = await res.json();
    const price = data && Array.isArray(data) && data[0]?.price;
    if (typeof price === 'number') {
      localStorage.setItem(key, JSON.stringify({ value: price, timestamp: now }));
      return price;
    }
    return null;
  } catch (e) {
    return null;
  }
}

/**
 * Fetch real-time crypto price from Binance public API
 * @param ticker Crypto ticker (e.g., 'BTC', 'ETH')
 * @returns Latest price in USD as number, or null if not found
 */
export async function getCryptoPrice(ticker: string): Promise<number | null> {
  const key = `asset-dairy:crypto:PRICE:${ticker.toUpperCase()}`;
  const now = Date.now();
  const cached = localStorage.getItem(key);
  if (cached) {
    try {
      const { value, timestamp } = JSON.parse(cached);
      if (typeof value === 'number' && now - timestamp < 15 * 60 * 1000) {
        return value;
      }
    } catch {}
  }
  try {
    // Map ticker to Binance symbol (e.g., 'BTC' -> 'BTCUSDT')
    const symbol = `${ticker.toUpperCase()}USDT`;
    const res = await fetch(
      `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`
    );
    if (!res.ok) return null;
    const data = await res.json();
    const price = parseFloat(data?.price);
    if (isNaN(price)) return null;
    localStorage.setItem(key, JSON.stringify({ value: price, timestamp: now }));
    return price;
  } catch (e) {
    return null;
  }
}
