# Dalai lama script

### workflow

> every interval it‘s deleting open bids of tickers
> fetching current fair market prices of said tickers
> post new limit orders (with SL) for said tickers x% below fair market price
> TP orders are created when the limits orders are filled (reason: binance API doesn't allow us to set OTOCO orders directly, however there is a workaround, which is to subscribe to a websocket & create a TP once the limit order is filled.)

### How to use it

1. Configue config.ts
2. Add your binance API_KEY & API_SECRET as env variables to a file called ".env" in the root folder (ideally create a subaccount for this and make sure to RESTRICT TRANSFER & WITHDRAWALS using the api keys)
3. open your console, and hit `npm i` & then, `npm run script` (ideally locally, otherwise you can skip step #3 and deploy to digitalocean (you probably want to choose a datacenter outside of the US, to avoid any issues with binance))
