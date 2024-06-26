// Total position size in USD ($100'000 => 100000 or 100_000)
export const TOTAL_POSITION_SIZE_USD: number = 500;

/**
 * Position adjustment interval in seconds.
 * @in seconds
 */
export const POSITION_ADJUSTMENT_INTERVAL: number = 3_600;

/**
 * If true, sets mark price discount for each token (TICKER_BASKET) individually
 *
 */
export const SET_MARK_PRICE_DISCOUNT_RATE_PER_TOKEN: boolean = false;

/**
 * Sets bids x% below current mark price, for each INDIVIDUAL ticker in TICKER_BASKET
 * @in decimals (1% => 0.01)
 * @in greater than 0 & less than 1
 * @in the array must have the same length as TICKER_BASKET
 */

export const MARK_PRICE_DISCOUNT_RATE_PER_TOKEN: number[] = [0.3, 0.25, 0.19, 0.15];

/**
 * Sets bids x% below current mark price, for each ticker in TICKER_BASKET
 * @in decimals (1% => 0.01)
 * @in greater than 0 & less than 1
 */
export const MARK_PRICE_DISCOUNT_RATE: number = 0.2;

export const TICKER_BASKET: string[] = ["1000PEPEUSDT", "WIFUSDT", "DOGEUSDT", "1000BONKUSDT"];

// Represented as decimals: 1% => 0.01
export const STOP_LOSS_PERCENTAGE: number = 0.05;

// Testnet mode: if false, you'll post orders to Bybit in production (e.g., you'll lose real money)
export const TESTNET: boolean = false;

//only necessary if hosted via digitalocean
export const DIGITALOCEAN_PORT = 8080;

// if set to true, the script won't close your filled positions automatically.
export const MANUALLY_CLOSE_POSITIONS: boolean = true;
export const TAKE_PROFIT_PERCENTAGE: number = 0.2;
