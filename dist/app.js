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
var binance_1 = require("binance");
var dotenv_1 = __importDefault(require("dotenv"));
var config_1 = require("./config");
var modules_1 = require("./modules");
var express_1 = __importDefault(require("express"));
dotenv_1.default.config();
//create a http server for the health checks (digital ocean)
var app = (0, express_1.default)();
app.get("/", function (req, res) {
    res.send("server is on at port ".concat(config_1.DIGITALOCEAN_PORT));
});
app.listen(config_1.DIGITALOCEAN_PORT);
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, API_KEY, API_SECRET, client_1, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                console.log(config_1.TESTNET ? ansi_colors_1.default.yellowBright("TESTNET Mode") : ansi_colors_1.default.greenBright("MAINNET Mode (you'll gamble with real money!"));
                _a = [process.env.API_KEY, process.env.API_SECRET], API_KEY = _a[0], API_SECRET = _a[1];
                if (!API_KEY || API_KEY.length <= 5) {
                    throw new Error("API KEY is not defined!");
                }
                if (!API_SECRET || API_SECRET.length <= 5) {
                    throw new Error("API SECRET is not defined!");
                }
                client_1 = new binance_1.USDMClient({
                    api_key: API_KEY,
                    api_secret: API_SECRET,
                }, undefined, config_1.TESTNET);
                //when starting the script, we want to, for security, make sure that all open orders are cancelled
                return [4 /*yield*/, (0, modules_1.cancelAllOpenBasketOrders)(client_1)];
            case 1:
                //when starting the script, we want to, for security, make sure that all open orders are cancelled
                _b.sent();
                if (!!config_1.MANUALLY_CLOSE_POSITIONS) return [3 /*break*/, 3];
                //this ws is crucial to set the TPs for the filled positions, as OTOCO orders aren't possibly via the Binance API
                return [4 /*yield*/, (0, modules_1.usdmarginedWebSocket)(client_1)];
            case 2:
                //this ws is crucial to set the TPs for the filled positions, as OTOCO orders aren't possibly via the Binance API
                _b.sent();
                _b.label = 3;
            case 3: 
            //trigger postOrders initially
            return [4 /*yield*/, (0, modules_1.postOrdersForBasket)(client_1)];
            case 4:
                //trigger postOrders initially
                _b.sent();
                //start interval
                setInterval(function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                console.log("start interval... (runs every ".concat(config_1.POSITION_ADJUSTMENT_INTERVAL / 60, " minutes) "));
                                //cancel all open orders
                                return [4 /*yield*/, (0, modules_1.cancelAllOpenBasketOrders)(client_1)];
                            case 1:
                                //cancel all open orders
                                _a.sent();
                                //triggers new orders
                                return [4 /*yield*/, (0, modules_1.postOrdersForBasket)(client_1)];
                            case 2:
                                //triggers new orders
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); }, config_1.POSITION_ADJUSTMENT_INTERVAL * 1000);
                return [3 /*break*/, 6];
            case 5:
                err_1 = _b.sent();
                console.log(ansi_colors_1.default.redBright("ERROR:"), err_1);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); })();
