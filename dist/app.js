"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var binance_1 = require("binance");
var dotenv_1 = __importDefault(require("dotenv"));
var config_1 = require("./config");
var modules_1 = require("./modules");
dotenv_1.default.config();
function cancelAllOpenOrdersForBasket(client) {
    return __awaiter(this, void 0, void 0, function () {
        var _i, TICKER_BASKET_1, ticker, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("cancelAllOpenOrdersForBasket");
                    _i = 0, TICKER_BASKET_1 = config_1.TICKER_BASKET;
                    _a.label = 1;
                case 1:
                    if (!(_i < TICKER_BASKET_1.length)) return [3 /*break*/, 4];
                    ticker = TICKER_BASKET_1[_i];
                    return [4 /*yield*/, client.cancelAllOpenOrders({
                            symbol: ticker,
                            isIsolated: "FALSE",
                        })];
                case 2:
                    result = _a.sent();
                    console.log({ result: result });
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
var ignoredSillyLogMsgs = ["Sending ping", "Received pong, clearing pong timer", "Received ping, sending pong frame"];
var logger = __assign(__assign({}, binance_1.DefaultLogger), { 
    //@ts-expect-error
    silly: function (msg, context) {
        if (ignoredSillyLogMsgs.includes(msg)) {
            return;
        }
        console.log(JSON.stringify({ msg: msg, context: context }));
    } });
function webSocket(client) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, API_KEY, API_SECRET, wsClient;
        var _this = this;
        return __generator(this, function (_b) {
            try {
                _a = [process.env.API_KEY, process.env.API_SECRET], API_KEY = _a[0], API_SECRET = _a[1];
                if (!API_KEY || API_KEY.length <= 5) {
                    throw new Error("API KEY is not defined!");
                }
                if (!API_SECRET || API_SECRET.length <= 5) {
                    throw new Error("API SECRET is not defined!");
                }
                wsClient = new binance_1.WebsocketClient({
                    api_key: API_KEY,
                    api_secret: API_SECRET,
                    beautify: true,
                    //disableHeartbeat: true
                }, logger);
                wsClient.on("formattedMessage", function (data) { return __awaiter(_this, void 0, void 0, function () {
                    var formattedMessage, order, roundByDecimals, filledPrice, takeProfitPrice, tpOrder;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                formattedMessage = JSON.stringify(data, null, 2);
                                order = JSON.parse(formattedMessage).order;
                                if (!((order === null || order === void 0 ? void 0 : order.orderStatus) !== undefined && order.orderStatus === "FILLED")) return [3 /*break*/, 2];
                                roundByDecimals = 0;
                                filledPrice = order.lastFilledPrice;
                                if (filledPrice >= 1000) {
                                    roundByDecimals = 100;
                                }
                                else if (filledPrice >= 5) {
                                    roundByDecimals = 1000;
                                }
                                else {
                                    roundByDecimals = 10000;
                                }
                                takeProfitPrice = Math.round(order.lastFilledPrice * (1 + config_1.TAKE_PROFIT_PERCENTAGE) * roundByDecimals) / roundByDecimals;
                                return [4 /*yield*/, client.submitNewOrder({
                                        symbol: order.symbol,
                                        side: "SELL",
                                        positionSide: "BOTH",
                                        //@TODO discuss with gambid
                                        type: "TAKE_PROFIT_MARKET",
                                        reduceOnly: "true",
                                        //@ts-ignore
                                        firstTrigger: "PLACE_ODER",
                                        quantity: order.lastFilledQuantity,
                                        stopPrice: takeProfitPrice,
                                        timeInForce: "GTC",
                                        workingType: "MARK_PRICE",
                                        priceProtect: "TRUE",
                                    })];
                            case 1:
                                tpOrder = _a.sent();
                                console.log(ansi_colors_1.default.green("Successfully set TP order @".concat(takeProfitPrice, " (+").concat(config_1.TAKE_PROFIT_PERCENTAGE * 100, "%)")));
                                _a.label = 2;
                            case 2: return [2 /*return*/];
                        }
                    });
                }); });
                wsClient.subscribeUsdFuturesUserDataStream();
            }
            catch (err) {
                console.log(ansi_colors_1.default.red("err"), err);
            }
            return [2 /*return*/];
        });
    });
}
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, API_KEY, API_SECRET, client, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                console.log(config_1.TESTNET ? ansi_colors_1.default.yellowBright("TESTNET Mode") : ansi_colors_1.default.greenBright("MAINNET Mode (you'll gamble with real money!"));
                _a = [process.env.API_KEY, process.env.API_SECRET], API_KEY = _a[0], API_SECRET = _a[1];
                if (!API_KEY || API_KEY.length <= 5) {
                    throw new Error("API KEY is not defined!");
                }
                if (!API_SECRET || API_SECRET.length <= 5) {
                    throw new Error("API SECRET is not defined!");
                }
                client = new binance_1.USDMClient({
                    api_key: API_KEY,
                    api_secret: API_SECRET,
                }, undefined, config_1.TESTNET);
                //this ws is crucial to set the TPs for the filled positions, as OTOCO orders aren't possibly via the Binance API
                // await webSocket(client);
                return [4 /*yield*/, (0, modules_1.cancelAllOpenBasketOrders)(client)];
            case 1:
                //this ws is crucial to set the TPs for the filled positions, as OTOCO orders aren't possibly via the Binance API
                // await webSocket(client);
                _b.sent();
                //trigger postOrders initially
                // await postOrdersForBasket(client);
                //start interval
                setInterval(function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/];
                    });
                }); }, config_1.POSITION_ADJUSTMENT_INTERVAL * 1000);
                return [3 /*break*/, 3];
            case 2:
                err_1 = _b.sent();
                console.log(ansi_colors_1.default.redBright("ERROR:"), err_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); })();
