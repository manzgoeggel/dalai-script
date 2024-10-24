"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ansi_colors_1 = __importDefault(require("ansi-colors"));
var dotenv_1 = __importDefault(require("dotenv"));
var config_1 = require("./config");
var express_1 = __importDefault(require("express"));
var openai_1 = __importDefault(require("openai"));
dotenv_1.default.config();
var openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var tweet, completion, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                tweet = "Israel nukes the shithole called 'Iran' completely";
                return [4 /*yield*/, openai.chat.completions.create({
                        model: "gpt-4o-mini",
                        messages: [
                            {
                                role: "system",
                                content: config_1.PROMPT,
                            },
                            {
                                role: "user",
                                content: "Tweet: ".concat(tweet),
                            },
                        ],
                    })];
            case 1:
                completion = _a.sent();
                console.log(completion.choices[0].message);
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                console.log({ err: err_1 });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); })();
//create a http server for the health checks (digital ocean)
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.get("/", function (req, res) {
    res.send("server is on at port ".concat(config_1.DIGITALOCEAN_PORT));
});
app.listen(config_1.DIGITALOCEAN_PORT);
console.log(ansi_colors_1.default.green("server is on!"));
// Webhook endpoint with correct Express types
app.post("/webhook", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var payload;
    return __generator(this, function (_a) {
        try {
            payload = req.body;
            // Basic validation
            if (!payload.eventToken || !payload.unixTimestamp) {
                return [2 /*return*/, res.status(400).json({
                        error: "Invalid webhook payload - missing required fields",
                    })];
            }
            // Log incoming webhook
            console.log("Received webhook: ".concat(payload.eventToken), {
                timestamp: new Date(payload.unixTimestamp).toISOString(),
                data: payload.data,
            });
            // Handle webhook logic here
            if (payload.eventToken === "summer_news_e83664255c6963e962bb20f9fcfaad") {
                console.log("NEW EVENT: ", payload.data);
                //@TODO add logic to determine, whether criteria are fulfilled to open a position
                //If criteria fullfilled, send post request to an array of different servers that trigger the opening of the desired position
                res.status(201).json({
                    message: "Successfully triggered",
                });
            }
            throw new Error("Oops, something went wrong.");
        }
        catch (error) {
            res.status(500).json({
                error: error.message,
            });
        }
        return [2 /*return*/];
    });
}); });
