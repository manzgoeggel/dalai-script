"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TESTNET = exports.TAKE_PROFIT_PERCENTAGE = exports.STOP_LOSS_PERCENTAGE = exports.TICKER_BASKET = exports.MARK_PRICE_DISCOUNT_RATE = exports.POSITION_ADJUSTMENT_INTERVAL = exports.TOTAL_POSITION_SIZE_USD = void 0;
// Total position size in USD ($100'000 => 100000 or 100_000)
exports.TOTAL_POSITION_SIZE_USD = 500;
/**
 * Position adjustment interval in seconds.
 * @in seconds
 */
exports.POSITION_ADJUSTMENT_INTERVAL = 3600;
/**
 * Sets bids x% below current mark price, for each ticker in TICKER_BASKET
 * @in decimals (1% => 0.01)
 * @in greater than 0 & less than 1
 */
exports.MARK_PRICE_DISCOUNT_RATE = 0.2;
exports.TICKER_BASKET = ["ETHUSDT", "WIFUSDT", "DOGEUSDT", "FTM1USDT"];
// Represented as decimals: 1% => 0.01
exports.STOP_LOSS_PERCENTAGE = 0.05;
exports.TAKE_PROFIT_PERCENTAGE = 0.20;
// Testnet mode: if false, you'll post orders to Bybit in production (e.g., you'll lose real money)
exports.TESTNET = false;
