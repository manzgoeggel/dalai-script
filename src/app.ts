import color from "ansi-colors";
import { USDMClient } from "binance";
import dotenv from "dotenv";
import { DIGITALOCEAN_PORT, MANUALLY_CLOSE_POSITIONS, POSITION_ADJUSTMENT_INTERVAL, TESTNET } from "./config";
import { cancelAllOpenBasketOrders, postOrdersForBasket, usdmarginedWebSocket } from "./modules";
import express, { Express, Request, Response } from "express";
dotenv.config();
console.log(color.green("server is on!"));
interface WebhookPayload {
	event: string;
	data: any;
	timestamp: number;
}

//create a http server for the health checks (digital ocean)
const app = express();
app.get("/", (req, res) => {
	res.send(`server is on at port ${DIGITALOCEAN_PORT}`);
});

app.listen(DIGITALOCEAN_PORT);

// Webhook endpoint with correct Express types
app.post("/webhook", async (req: Request, res: Response) => {
	try {
		const payload: WebhookPayload = req.body;

		// Basic validation
		if (!payload.event || !payload.timestamp) {
			return res.status(400).json({
				error: "Invalid webhook payload - missing required fields",
			});
		}

		// Log incoming webhook
		console.log(`Received webhook: ${payload.event}`, {
			timestamp: new Date(payload.timestamp).toISOString(),
			data: payload.data,
		});

		// Handle webhook logic here
		if (payload.event === "summer_news_e83664255c6963e962bb20f9fcfaad") {
			console.log("NEW EVENT: ", payload.data)
			//@TODO add logic to determine, whether criteria are fulfilled to open a position
			//If criteria fullfilled, send post request to an array of different servers that trigger the opening of the desired position
		}
	} catch (error) {
		console.error("Error processing webhook:", error);
		res.status(500).json({
			error: "Internal server error processing webhook",
		});
	}
});
