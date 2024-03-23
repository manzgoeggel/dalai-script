import color from "ansi-colors";
import { DefaultLogger, USDMClient, WebsocketClient } from "binance";
import dotenv from "dotenv";
import { POSITION_ADJUSTMENT_INTERVAL, TAKE_PROFIT_PERCENTAGE, TESTNET, TICKER_BASKET } from "./config";
import { postOrdersForBasket } from "./modules";
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

async function webSocket(client: USDMClient) {
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

			if (order?.orderStatus !== undefined && order.orderStatus === "FILLED") {
				let roundByDecimals = 0;
				const filledPrice = order.lastFilledPrice as number;
				if (filledPrice >= 1_000) {
					roundByDecimals = 100;
				} else if (filledPrice >= 5) {
					roundByDecimals = 1_000;
				} else {
					roundByDecimals = 10_000;
				}
				const takeProfitPrice =
					Math.round((order.lastFilledPrice as number) * (1 + TAKE_PROFIT_PERCENTAGE) * roundByDecimals) / roundByDecimals;

				const tpOrder = await client.submitNewOrder({
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
		//this ws is crucial to set the TPs for the filled positions, as OTOCO orders aren't possibly via the Binance API
		await webSocket(client);

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
