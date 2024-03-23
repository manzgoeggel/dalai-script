import { DefaultLogger, MarkPrice, USDMClient, WebsocketClient } from "binance";
import { MARK_PRICE_DISCOUNT_RATE, STOP_LOSS_PERCENTAGE, TAKE_PROFIT_PERCENTAGE, TICKER_BASKET, TOTAL_POSITION_SIZE_USD } from "./config";
import color from "ansi-colors";

export async function cancelAllOpenBasketOrders(client: USDMClient): Promise<void> {
	for (const ticker of TICKER_BASKET) {
		const cancelledOrder = await client.cancelAllOpenOrders({ symbol: ticker });
		console.log({ cancelledOrder });

		if (cancelledOrder.code === 200) {
			console.log(color.green(`Successfully cancelled all open orders for ${ticker}`));
		}
	}
}
interface Decimals {
	roundByDecimals: number;
	quantityDecimals: number;
}
function getDecimals(markPrice: number): Decimals {
	//different coins have different price decimals & position decimals
	let roundByDecimals = 0;
	let quantityDecimals = 0;
	if (markPrice >= 5) {
		roundByDecimals = 100;
	} else if (markPrice >= 5) {
		roundByDecimals = 1_000;
	} else if (markPrice <= 1 && markPrice >= 0.05) {
		//doge 0.16729
		roundByDecimals = 100_000;
	} else {
		roundByDecimals = 1_000_000;
		//pepe 0.022595
		//bonk 0.022595
		//bome 0.013984
	}

	if (markPrice >= 1000) {
		quantityDecimals = 1_000;
	} else {
		//meaning, it won't format the min quantity (not relevant prob, since pos sizes will anyways be large enough)
		quantityDecimals = 1;
	}

	return {
		roundByDecimals,
		quantityDecimals,
	};
}

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

		const { roundByDecimals, quantityDecimals } = getDecimals(markPrice);

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

const ignoredSillyLogMsgs = ["Sending ping", "Received pong, clearing pong timer", "Received ping, sending pong frame"];
const logger = {
	...DefaultLogger,
	//@ts-expect-error
	silly: (msg, context) => {
		if (ignoredSillyLogMsgs.includes(msg)) {
			return;
		}
		console.log(JSON.stringify({ msg, context }));
	},
};

export async function usdmarginedWebSocket(client: USDMClient) {
	try {
		const [API_KEY, API_SECRET]: (string | undefined)[] = [process.env.API_KEY, process.env.API_SECRET];

		if (!API_KEY || API_KEY.length <= 5) {
			throw new Error("API KEY is not defined!");
		}
		if (!API_SECRET || API_SECRET.length <= 5) {
			throw new Error("API SECRET is not defined!");
		}
		const wsClient = new WebsocketClient(
			{
				api_key: API_KEY,
				api_secret: API_SECRET,
				beautify: true,
				//disableHeartbeat: true
			},
			logger
		);

		wsClient.on("formattedMessage", async (data) => {
			const formattedMessage = JSON.stringify(data, null, 2);

			const { order } = JSON.parse(formattedMessage);

			if ((order?.orderStatus !== undefined && order.orderStatus === "FILLED") || order.orderStatus === "PARTIALLY_FILLED") {
				const filledPrice = order.lastFilledPrice as number;
				const { roundByDecimals } = getDecimals(filledPrice);
				const takeProfitPrice =
					Math.round((order.lastFilledPrice as number) * (1 + TAKE_PROFIT_PERCENTAGE) * roundByDecimals) / roundByDecimals;

				await client.submitNewOrder({
					symbol: order.symbol as string,
					side: "SELL",
					positionSide: "BOTH",
					//@TODO discuss with gambid
					type: "TAKE_PROFIT_MARKET",
					reduceOnly: "true",
					//@ts-ignore
					firstTrigger: "PLACE_ODER",
					quantity: order.lastFilledQuantity as number,
					stopPrice: takeProfitPrice,
					timeInForce: "GTC",
					workingType: "MARK_PRICE",
					priceProtect: "TRUE",
				});
				console.log(color.green(`Successfully set TP order @${takeProfitPrice} (+${TAKE_PROFIT_PERCENTAGE * 100}%)`));
			}
		});

		wsClient.subscribeUsdFuturesUserDataStream();
	} catch (err) {
		console.log(color.red("err"), err);
	}
}
