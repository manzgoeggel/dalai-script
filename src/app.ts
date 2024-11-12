import color from "ansi-colors";
import { USDMClient } from "binance";
import dotenv from "dotenv";
import { DIGITALOCEAN_PORT, MANUALLY_CLOSE_POSITIONS, POSITION_ADJUSTMENT_INTERVAL, TESTNET } from "./config";
import { cancelAllOpenBasketOrders, postOrdersForBasket, usdmarginedWebSocket } from "./modules";
import express from "express";
dotenv.config();

//create a http server for the health checks (digital ocean)
const app = express();
app.get("/", (req, res) => {
	res.send(`server is on at port ${DIGITALOCEAN_PORT}`);
});

app.listen(DIGITALOCEAN_PORT);

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

		//when starting the script, we want to, for security, make sure that all open orders are cancelled
		await cancelAllOpenBasketOrders(client);

		if (!MANUALLY_CLOSE_POSITIONS) {
			//this ws is crucial to set the TPs for the filled positions, as OTOCO orders aren't possibly via the Binance API
			await usdmarginedWebSocket(client);
		}
		

		//trigger postOrders initially
		await postOrdersForBasket(client);

		//start interval

		setInterval(async () => {
			console.log(`start interval... (runs every ${POSITION_ADJUSTMENT_INTERVAL / 60} minutes) `);
			//cancel all open orders
			await cancelAllOpenBasketOrders(client);

			//triggers new orders
			await postOrdersForBasket(client);
		}, POSITION_ADJUSTMENT_INTERVAL * 1000);
	} catch (err) {
		console.log(color.redBright("ERROR:"), err);
	}
})();
