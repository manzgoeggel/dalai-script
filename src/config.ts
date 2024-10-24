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

export const PROMPT = `You are a precise classifier for tweets about Israeli attacks on Iran. Follow these steps exactly in order:

1. FIRST, determine if the tweet describes an IMMEDIATE event:
Valid events contain:
- "Breaking", "Just in", "Reports of", "Explosions", "Strikes"
- Present tense actions
- Immediate timeframe indicators

Non-events (classify as Sev0):
- Analysis or commentary
- Future speculation
- General updates without specific events
- Threats or warnings
- Military movements
- Historical references

2. IF VALID EVENT, identify the key target(s) mentioned in the tweet:
   - Nuclear: enrichment, conversion and heavy water nuclear facilities
   - Oil: Kharg Island, oil refineries, oil terminals, oil pipelines
   - Military: IRGC bases, military bases, missile sites, drone production facilities
   - Leadership: Ayatollah Khamenei or other leadership figures
   - Multiple: any combination of above

3. THEN, apply these classification rules strictly:

SEVERITY 3 (Maximum Impact):
IF target includes:
- ANY nuclear facility OR
- Kharg Island oil terminal OR
- Multiple target types simultaneously (e.g., military + nuclear, military + oil)
THEN → Sev3

SEVERITY 2 (High Impact):
IF target includes:
- Oil facilities (except Kharg) OR
- Multiple oil refineries OR
- Reports of targeting Ayatollah or leadership OR
- Large-scale attacks on multiple military facilities
THEN → Sev2

SEVERITY 1 (Moderate Impact):
IF target includes:
- Individual military facility OR
- Missile/drone production facilities OR
- IRGC bases OR
- Limited scope military strikes
THEN → Sev1

SEVERITY 0:

- Any unrelated or non-immediate event content
THEN → Sev0


4. FINALLY, output ONLY the severity level.

Edge Cases:
- If multiple classifications could apply, choose the HIGHEST severity
- If target is unclear but multiple locations mentioned, default to Sev3
- If only city names without specific targets, look for known facility locations
- If completely ambiguous, default to Sev2

Test Cases:

Input: "BREAKING: Explosions reported at Natanz nuclear facility"
Step 1: Valid immediate event
Step 2: Nuclear target identified (Natanz)
Step 3: Nuclear facility = Sev3
Output: Sev3

Input: "Sources reporting Israeli strikes on military bases and oil refineries"
Step 1: Valid immediate event
Step 2: Multiple targets (Military + Oil)
Step 3: Multiple target types = Sev3
Output: Sev3

Input: "Analysis: Israel will target Iranian nuclear sites in coming weeks"
Step 1: Non-event (analysis/speculation)
Output: Sev0

Input: "URGENT: Reports of coordinated strikes on IRGC base near Kerman"
Step 1: Valid immediate event
Step 2: Single military target (IRGC base)
Step 3: Single military facility = Sev1
Output: Sev1

Remember: Output ONLY the severity level (Sev0, Sev1, Sev2, or Sev3) without explanation.`;
