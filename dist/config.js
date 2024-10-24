"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROMPT = exports.TAKE_PROFIT_PERCENTAGE = exports.MANUALLY_CLOSE_POSITIONS = exports.DIGITALOCEAN_PORT = exports.TESTNET = exports.STOP_LOSS_PERCENTAGE = exports.TICKER_BASKET = exports.MARK_PRICE_DISCOUNT_RATE = exports.MARK_PRICE_DISCOUNT_RATE_PER_TOKEN = exports.SET_MARK_PRICE_DISCOUNT_RATE_PER_TOKEN = exports.POSITION_ADJUSTMENT_INTERVAL = exports.TOTAL_POSITION_SIZE_USD = void 0;
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
exports.PROMPT = "You are a precise classifier for tweets about Israeli attacks on Iran. Follow these steps exactly in order:\n\n1. FIRST, determine if the tweet describes an IMMEDIATE event:\nValid events contain:\n- \"Breaking\", \"Just in\", \"Reports of\", \"Explosions\", \"Strikes\"\n- Present tense actions\n- Immediate timeframe indicators\n\nNon-events (classify as Sev0):\n- Analysis or commentary\n- Future speculation\n- General updates without specific events\n- Threats or warnings\n- Military movements\n- Historical references\n\n2. IF VALID EVENT, identify the key target(s) mentioned in the tweet:\n   - Nuclear: enrichment, conversion and heavy water nuclear facilities\n   - Oil: Kharg Island, oil refineries, oil terminals, oil pipelines\n   - Military: IRGC bases, military bases, missile sites, drone production facilities\n   - Leadership: Ayatollah Khamenei or other leadership figures\n   - Multiple: any combination of above\n\n3. THEN, apply these classification rules strictly:\n\nSEVERITY 3 (Maximum Impact):\nIF target includes:\n- ANY nuclear facility OR\n- Kharg Island oil terminal OR\n- Multiple target types simultaneously (e.g., military + nuclear, military + oil)\nTHEN \u2192 Sev3\n\nSEVERITY 2 (High Impact):\nIF target includes:\n- Oil facilities (except Kharg) OR\n- Multiple oil refineries OR\n- Reports of targeting Ayatollah or leadership OR\n- Large-scale attacks on multiple military facilities\nTHEN \u2192 Sev2\n\nSEVERITY 1 (Moderate Impact):\nIF target includes:\n- Individual military facility OR\n- Missile/drone production facilities OR\n- IRGC bases OR\n- Limited scope military strikes\nTHEN \u2192 Sev1\n\nSEVERITY 0:\n\n- Any unrelated or non-immediate event content\nTHEN \u2192 Sev0\n\n\n4. FINALLY, output ONLY the severity level.\n\nEdge Cases:\n- If multiple classifications could apply, choose the HIGHEST severity\n- If target is unclear but multiple locations mentioned, default to Sev3\n- If only city names without specific targets, look for known facility locations\n- If completely ambiguous, default to Sev2\n\nTest Cases:\n\nInput: \"BREAKING: Explosions reported at Natanz nuclear facility\"\nStep 1: Valid immediate event\nStep 2: Nuclear target identified (Natanz)\nStep 3: Nuclear facility = Sev3\nOutput: Sev3\n\nInput: \"Sources reporting Israeli strikes on military bases and oil refineries\"\nStep 1: Valid immediate event\nStep 2: Multiple targets (Military + Oil)\nStep 3: Multiple target types = Sev3\nOutput: Sev3\n\nInput: \"Analysis: Israel will target Iranian nuclear sites in coming weeks\"\nStep 1: Non-event (analysis/speculation)\nOutput: Sev0\n\nInput: \"URGENT: Reports of coordinated strikes on IRGC base near Kerman\"\nStep 1: Valid immediate event\nStep 2: Single military target (IRGC base)\nStep 3: Single military facility = Sev1\nOutput: Sev1\n\nRemember: Output ONLY the severity level (Sev0, Sev1, Sev2, or Sev3) without explanation.";
