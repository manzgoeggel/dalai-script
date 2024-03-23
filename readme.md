i think it‘ll be as follows (in terms of call flow)

> every interval it‘s deleting open bids of tickers []
> fetching current fair market prices of said tickers [x]
> post new limit orders (with TP and SL) for said tickers x% below fair market price [x]

todos:
[] test the above
[] make posting orders and deleting multithreaded
[] add support for bybit

binance API doesn't allow us to set OTOCO orders directly, however there is a workaround, which is to subscribe to a websocket & create a TP once the limit order is filled.
