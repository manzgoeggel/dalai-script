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
exports.postOrdersForBasket = exports.cancelAllOpenBasketOrders = void 0;
var config_1 = require("./config");
var ansi_colors_1 = __importDefault(require("ansi-colors"));
function cancelAllOpenBasketOrders(client) {
    return __awaiter(this, void 0, void 0, function () {
        var _i, TICKER_BASKET_1, ticker, cancelledOrder;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _i = 0, TICKER_BASKET_1 = config_1.TICKER_BASKET;
                    _a.label = 1;
                case 1:
                    if (!(_i < TICKER_BASKET_1.length)) return [3 /*break*/, 4];
                    ticker = TICKER_BASKET_1[_i];
                    return [4 /*yield*/, client.cancelAllOpenOrders({ symbol: ticker })];
                case 2:
                    cancelledOrder = _a.sent();
                    console.log({ cancelledOrder: cancelledOrder });
                    if (cancelledOrder.code === 200) {
                        console.log(ansi_colors_1.default.green("Successfully cancelled all open orders for ".concat(ticker)));
                    }
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.cancelAllOpenBasketOrders = cancelAllOpenBasketOrders;
function postOrdersForBasket(client) {
    return __awaiter(this, void 0, void 0, function () {
        var positionSizeForEachTicker, _i, TICKER_BASKET_2, ticker, fetchedTicker, markPrice, roundByDecimals, quantityDecimals, bidPrice, stopLossPrice, quantity, order;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("posting orders for basket...");
                    if (config_1.TICKER_BASKET.length < 1) {
                        throw new Error("Define at least one ticker in TICKER_BASKET.");
                    }
                    if (config_1.MARK_PRICE_DISCOUNT_RATE < 0 || config_1.MARK_PRICE_DISCOUNT_RATE >= 1) {
                        throw new Error("MARK_PRICE_DISCOUNT_RATE must be greater than 0 and less than 1");
                    }
                    positionSizeForEachTicker = Math.round((config_1.TOTAL_POSITION_SIZE_USD / config_1.TICKER_BASKET.length) * 100) / 100;
                    _i = 0, TICKER_BASKET_2 = config_1.TICKER_BASKET;
                    _a.label = 1;
                case 1:
                    if (!(_i < TICKER_BASKET_2.length)) return [3 /*break*/, 5];
                    ticker = TICKER_BASKET_2[_i];
                    console.log("posting order for: ", ticker);
                    return [4 /*yield*/, client.getMarkPrice({ symbol: ticker, isIsolated: "FALSE" })];
                case 2:
                    fetchedTicker = (_a.sent());
                    markPrice = parseFloat(fetchedTicker.markPrice);
                    roundByDecimals = 0;
                    if (markPrice >= 5) {
                        roundByDecimals = 100;
                    }
                    else if (markPrice >= 5) {
                        roundByDecimals = 1000;
                    }
                    else {
                        roundByDecimals = 10000;
                    }
                    quantityDecimals = 0;
                    if (markPrice >= 1000) {
                        quantityDecimals = 1000;
                    }
                    else {
                        quantityDecimals = 1;
                    }
                    bidPrice = Math.round(markPrice * (1 - config_1.MARK_PRICE_DISCOUNT_RATE) * roundByDecimals) / roundByDecimals;
                    stopLossPrice = Math.round(bidPrice * (1 - config_1.STOP_LOSS_PERCENTAGE) * roundByDecimals) / roundByDecimals;
                    quantity = Math.round((positionSizeForEachTicker / bidPrice) * quantityDecimals) / quantityDecimals;
                    return [4 /*yield*/, client.submitMultipleOrders([
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
                        ])];
                case 3:
                    order = _a.sent();
                    if (order.length > 0) {
                        console.log(ansi_colors_1.default.greenBright("Successfully set ".concat(ticker, " bid @").concat(bidPrice, " for $").concat(positionSizeForEachTicker, " notional, with SL at ").concat(stopLossPrice, " (-").concat(config_1.STOP_LOSS_PERCENTAGE * 100, "%)")));
                    }
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 1];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.postOrdersForBasket = postOrdersForBasket;
