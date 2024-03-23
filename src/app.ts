import color from "ansi-colors";
import { USDMClient } from "binance";
import dotenv from "dotenv";
import {
	MARK_PRICE_DISCOUNT_RATE,
	POSITION_ADJUSTMENT_INTERVAL,
	STOP_LOSS_PERCENTAGE,
	TAKE_PROFIT_PERCENTAGE,
	TESTNET,
	TICKER_BASKET,
	TOTAL_POSITION_SIZE_USD,
} from "./config";
dotenv.config();
export type numberInString = string | number;
export interface MarkPrice {
	symbol: string;
	markPrice: numberInString;
	indexPrice: numberInString;
	estimatedSettlePrice: numberInString;
	lastFundingRate: numberInString;
	interestRate: numberInString;
	nextFundingTime: number;
	time: number;
}

async function cancelAllOpenOrdersForBasket(client: USDMClient): Promise<void> {
	console.log("cancelAllOpenOrdersForBasket");
	for (const ticker of TICKER_BASKET) {
		const result = await client.cancelAllOpenOrders({
			symbol: ticker,
			isIsolated: "FALSE",
		});

		console.log({ result });
	}
}

async function postOrdersForBasket(client: USDMClient): Promise<void> {
	console.log("postOrdersForBasket");
	if (TICKER_BASKET.length < 1) {
		throw new Error("Define at least one ticker in TICKER_BASKET.");
	}

	if (MARK_PRICE_DISCOUNT_RATE < 0 || MARK_PRICE_DISCOUNT_RATE >= 1) {
		throw new Error("MARK_PRICE_DISCOUNT_RATE must be greater than 0 and less than 1");
	}

	//rounds each position to two decimals
	const positionSizeForEachTicker = Math.round((TOTAL_POSITION_SIZE_USD / TICKER_BASKET.length) * 100) / 100;

	for (const ticker of TICKER_BASKET) {
		console.log("posting order for: ", ticker);
		const fetchedTicker = (await client.getMarkPrice({ symbol: ticker, isIsolated: "FALSE" })) as MarkPrice;
		console.log("fetchedMarkPrice", fetchedTicker);

		const markPrice = parseFloat(fetchedTicker.markPrice as string);
		console.log({ markPrice });

		let roundByDecimals = 0;

		//@Todo accurately decide on number of decimals to bid for ticker.
		//for the initial version of the script we just take two decimals for mark prices equal or over 1'000

		//SUI: 1.6828
		//SOL: 175.047 x
		//DOGE: 0.16756
		//FTM: 1.0786 x
		//TIA: 13.6358
		//AVAX: 54.834
		if (markPrice >= 1_000) {
			roundByDecimals = 100;
		} else if (markPrice >= 5) {
			roundByDecimals = 1_000;
		} else {
			roundByDecimals = 10_000;
		}

		//round quantity of ticker to three decimals.

		const bidPrice = Math.round(markPrice * (1 - MARK_PRICE_DISCOUNT_RATE) * roundByDecimals) / roundByDecimals;
		const stopLossPrice = Math.round(bidPrice * (1 - STOP_LOSS_PERCENTAGE) * roundByDecimals) / roundByDecimals;
		const takeProfitPrice = Math.round(bidPrice * (1 + TAKE_PROFIT_PERCENTAGE) * roundByDecimals) / roundByDecimals;

		const quantity = Math.round((TOTAL_POSITION_SIZE_USD / bidPrice) * roundByDecimals) / roundByDecimals;

		console.log({ quantity, bidPrice, stopLossPrice, takeProfitPrice });

		//post buy order

		const postedBuyOrder = await client.submitMultipleOrders([
			//post buy order
			{
				symbol: ticker,
				side: "BUY",
				type: "LIMIT",
				positionSide: "BOTH",
				quantity: quantity.toString(),
				price: bidPrice.toString(),
				timeInForce: "GTC",
				workingType: "MARK_PRICE",
			},

			//post SL
			{
				symbol: ticker,
				side: "SELL",
				positionSide: "BOTH",
				//@TODO discuss with gambid
				type: "STOP_MARKET",
				reduceOnly: "true",
				quantity: quantity.toString(),
				stopPrice: stopLossPrice.toString(),
				timeInForce: "GTE_GTC",
				workingType: "MARK_PRICE",
				priceProtect: "TRUE",
			},
			//post TP
			// {
			// 	symbol: ticker,
			// 	side: "SELL",
			// 	positionSide: "BOTH",
			// 	//@TODO discuss with gambid
			// 	type: "TAKE_PROFIT_MARKET",
			// 	reduceOnly: "true",
			// 	//@ts-ignore
			// 	firstTrigger: "PLACE_ODER",
			// 	quantity: quantity.toString(),
			// 	stopPrice: takeProfitPrice.toString(),
			// 	timeInForce: "GTE_GTC",
			// 	workingType: "MARK_PRICE",
			// 	priceProtect: "TRUE",
			// },
			//post TP
			{
				symbol: ticker,
				side: "SELL",
				positionSide: "BOTH",
				//@TODO discuss with gambid
				type: "LIMIT",
				price: takeProfitPrice.toString(),
				reduceOnly: "true",
				quantity: quantity.toString(),
				timeInForce: "GTC",
				workingType: "MARK_PRICE",
				priceProtect: "TRUE",
			},
		]);
		console.log({ postedBuyOrder });
		// if (postedBuyOrder) {

		// 	//post TP order
		// 	const postedBuyOrder = await client.submitNewOrder({
		// 		symbol: ticker,
		// 		side: "SELL",
		// 		//@todo: discuss with gamb on the type here (prob. market sell is better to ensure execution)
		// 		type: "LIMIT",
		// 		quantity,
		// 		price: takeProfitPrice,
		// 		reduceOnly: "true",
		// 	});
		// }
	}
}

(async () => {
	try {
		console.log(TESTNET ? color.yellowBright("TESTNET Mode") : color.greenBright("MAINNET Mode (you'll gamble with real money!"));

		const [API_KEY, API_SECRET]: (string | undefined)[] = [process.env.API_KEY, process.env.API_SECRET];

		if (!API_KEY || API_KEY.length <= 5) {
			throw new Error("API KEY is not defined!");
		}
		if (!API_SECRET || API_SECRET.length <= 5) {
			throw new Error("API SECRET is not defined!");
		}

		//initiate exchange client
		const client = new USDMClient(
			{
				api_key: API_KEY,
				api_secret: API_SECRET,
			},
			undefined,
			TESTNET
		);

		//trigger postOrders initially

		await postOrdersForBasket(client);

		//start interval

		setInterval(async () => {
			//@add postOrdersForBasket & cancelAllOpenOrdersForBasket
		}, POSITION_ADJUSTMENT_INTERVAL * 1000);
	} catch (err) {
		console.log(color.redBright("ERROR:"), err);
	}
})();
