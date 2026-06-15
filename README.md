# Dumb.fun
Token launchpad for new memecoin fair launches inspired by [pump.fun](https://pump.fun).

## Features:
1. Implemented Bonding curve `Anchor` smart contract and write tests for instructions(Init, Buy, Sell).
2. Built custom indexer to index new bonding curve initializations & trades using `@triton-one/yellowstone-grpc` and tested on `Solana` localnet.
3. Express server to expose `REST API` endpoints for UI to read/write data to bypass onchain-network query overhead.
4. A web app built using `Vite + React`.

## Todos:
1. Figure how to test UI with localnet with geyser-plugin deployment of Bonding curve program as it cost actual money to use gRPC url from a RPC provider.
2. Write more endpoints to expose Coin data and performaces and add websocket powered real-time data feed for UI/UX state updates. 
3. UI/UX improvement & api wiring.
4. Impelent Coin migration to DEX like [Raydium](https://raydium.io).
