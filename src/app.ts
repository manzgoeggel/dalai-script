import color from "ansi-colors";
import { USDMClient } from "binance";
import dotenv from "dotenv";
import { DIGITALOCEAN_PORT, MANUALLY_CLOSE_POSITIONS, POSITION_ADJUSTMENT_INTERVAL, PROMPT, TESTNET } from "./config";
import { cancelAllOpenBasketOrders, postOrdersForBasket, usdmarginedWebSocket } from "./modules";
import express, { Express, Request, Response } from "express";
import OpenAI from "openai";
dotenv.config();

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

//create a http server for the health checks (digital ocean)
const app = express();
app.use(express.json());
app.get("/", (req, res) => {
	res.send(`server is on at port ${DIGITALOCEAN_PORT}`);
});

app.listen(DIGITALOCEAN_PORT);
console.log(color.green("server is on!"));
interface WebhookPayload {
	eventToken: string;
	headline: string;
	tweetUrl: string;
	timestamp: number;
	geolocation: string;
}

// Webhook endpoint with correct Express types
app.post("/webhook", async (req: Request, res: Response) => {
	try {
		const payload: WebhookPayload = req.body;

		// Basic validation
		if (!payload.eventToken || !payload.timestamp) {
			return res.status(400).json({
				error: "Invalid webhook payload - missing required fields",
			});
		}

		// Handle webhook logic here
		if (payload.eventToken === "summer_news_e83664255c6963e962bb20f9fcfaad") {
			console.log("NEW EVENT: ", payload);

			const completion = await openai.chat.completions.create({
				model: "gpt-4o",
				messages: [
					{
						role: "system",
						content: PROMPT,
					},
					{
						role: "user",
						content: `Result: ${payload.headline}`,
					},
				],
			});
			console.log(completion.choices[0].message);

			//@TODO add logic to determine, whether criteria are fulfilled to open a position
			//If criteria fullfilled, send post request to an array of different servers that trigger the opening of the desired position

			res.status(201).json({
				message: "Successfully triggered",
			});
		}
		throw new Error("Oops, something went wrong.");
	} catch (error) {
		res.status(500).json({
			error: (error as Error).message,
		});
	}
});
