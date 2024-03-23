// Total position size in USD ($100'000 => 100000 or 100_000)
export const TOTAL_POSITION_SIZE_USD: number = 500;

/**
 * Position adjustment interval in seconds.
 * @in seconds
 */
export const POSITION_ADJUSTMENT_INTERVAL: number = 3_600;

/**
 * Sets bids x% below current mark price, for each ticker in TICKER_BASKET
 * @in decimals (1% => 0.01)
 * @in greater than 0 & less than 1
 */
export const MARK_PRICE_DISCOUNT_RATE: number = 0.2;

export const TICKER_BASKET: string[] = ["ETHUSDT"];

// Represented as decimals: 1% => 0.01
export const STOP_LOSS_PERCENTAGE: number = 0.05;
export const TAKE_PROFIT_PERCENTAGE: number = 0.20;

// Testnet mode: if false, you'll post orders to Bybit in production (e.g., you'll lose real money)
export const TESTNET: boolean = false;
