"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TAKE_PROFIT_PERCENTAGE = exports.MANUALLY_CLOSE_POSITIONS = exports.DIGITALOCEAN_PORT = exports.TESTNET = exports.STOP_LOSS_PERCENTAGE = exports.TICKER_BASKET = exports.MARK_PRICE_DISCOUNT_RATE = exports.MARK_PRICE_DISCOUNT_RATE_PER_TOKEN = exports.SET_MARK_PRICE_DISCOUNT_RATE_PER_TOKEN = exports.POSITION_ADJUSTMENT_INTERVAL = exports.TOTAL_POSITION_SIZE_USD = void 0;
// Total position size in USD ($100'000 => 100000 or 100_000)
exports.TOTAL_POSITION_SIZE_USD = 500;
/**
 * Position adjustment interval in seconds.
 * @in seconds
 */
exports.POSITION_ADJUSTMENT_INTERVAL = 3600;
/**
 * If true, sets mark price discount for each token (TICKER_BASKET) individually
 *
 */
exports.SET_MARK_PRICE_DISCOUNT_RATE_PER_TOKEN = false;
/**
 * Sets bids x% below current mark price, for each INDIVIDUAL ticker in TICKER_BASKET
 * @in decimals (1% => 0.01)
 * @in greater than 0 & less than 1
 * @in the array must have the same length as TICKER_BASKET
 */
exports.MARK_PRICE_DISCOUNT_RATE_PER_TOKEN = [0.3, 0.25, 0.19, 0.15];
/**
 * Sets bids x% below current mark price, for each ticker in TICKER_BASKET
 * @in decimals (1% => 0.01)
 * @in greater than 0 & less than 1
 */
exports.MARK_PRICE_DISCOUNT_RATE = 0.2;
exports.TICKER_BASKET = ["1000PEPEUSDT", "WIFUSDT", "DOGEUSDT", "1000BONKUSDT"];
// Represented as decimals: 1% => 0.01
exports.STOP_LOSS_PERCENTAGE = 0.05;
// Testnet mode: if false, you'll post orders to Bybit in production (e.g., you'll lose real money)
exports.TESTNET = false;
//only necessary if hosted via digitalocean
exports.DIGITALOCEAN_PORT = 8080;
// if set to true, the script won't close your filled positions automatically.
exports.MANUALLY_CLOSE_POSITIONS = true;
exports.TAKE_PROFIT_PERCENTAGE = 0.2;
