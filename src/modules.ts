import { MarkPrice, USDMClient } from "binance";
import { MARK_PRICE_DISCOUNT_RATE, STOP_LOSS_PERCENTAGE, TICKER_BASKET, TOTAL_POSITION_SIZE_USD } from "./config";
import color from "ansi-colors";
export async function postOrdersForBasket(client: USDMClient): Promise<void> {
	console.log("posting orders for basket...");
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

		const markPrice = parseFloat(fetchedTicker.markPrice as string);

		//different coins have different price decimals & position decimals
		let roundByDecimals = 0;

		if (markPrice >= 5) {
			roundByDecimals = 100;
		} else if (markPrice >= 5) {
			roundByDecimals = 1_000;
		} else {
			roundByDecimals = 10_000;
		}
		let quantityDecimals = 0;
		if (markPrice >= 1000) {
			quantityDecimals = 1_000;
		} else {
			quantityDecimals = 1;
		}

		const bidPrice = Math.round(markPrice * (1 - MARK_PRICE_DISCOUNT_RATE) * roundByDecimals) / roundByDecimals;
		const stopLossPrice = Math.round(bidPrice * (1 - STOP_LOSS_PERCENTAGE) * roundByDecimals) / roundByDecimals;

		const quantity = Math.round((positionSizeForEachTicker / bidPrice) * quantityDecimals) / quantityDecimals;

		//post buy order
		const order = await client.submitMultipleOrders([
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
				timeInForce: "GTC",
				workingType: "MARK_PRICE",
				priceProtect: "TRUE",
			},
		]);
		if (order.length > 0) {
			console.log(
				color.greenBright(
					`Successfully set ${ticker} bid @${bidPrice} for $${positionSizeForEachTicker} notional, with SL at ${stopLossPrice} (-${
						STOP_LOSS_PERCENTAGE * 100
					}%)`
				)
			);
		}
	}
}
