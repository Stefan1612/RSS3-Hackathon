## Status

The NFT Marketplace is currently running and fully functional on Goerli at

The Website is online and running at [Website](https://famous-smakager-f1beb0.netlify.app/)

## Any questions? Contact me

Email: simpleblock4@protonmail.com
Discord: SimpleBlock#6604

## Biconomy

### Demo videos:

NFT Marketplace: https://www.youtube.com/watch?v=TERQfpsUPZo

SKD Hyphen: https://www.youtube.com/watch?v=cViRhJu1qIM

### Hyphen Widget

The Biconomy Hyphen Widget allows for fast and easy cross chain movement of funds. You can easily with a few clicks and seconds transfer your
Tokens from one network to another

Biconomy docs: https://docs.biconomy.io/products/hyphen-instant-cross-chain-transfers/hyphen-widget

Added at: [Code]()

## Approach

A NFT Marketplace running currently on Goerli. Let's you mint, sell and buy NFT's. During the minting we store the Metadata on IPFS and only store the TokenURI on-chain.

## Project local setup

1. git clone repo
2. generate .env
3. npm i
4. npm start
5. If you wanna test with your own contract instances you can redeploy on goerli via:
   npx hardhat run scripts/deploy.js --network goerli

## What is a NFT Marketplace?

This DApp allows you mint, buy and sell NFT's from the "Ape Family" contract.

- NFT's uploaded to IPFS
- Generated Transfer History with Covalent API, ethers receipt, tokenURI
- sell, buy with NFT Marketplace contract
- mint, transfer and set TokenURI with NFT contract

## Covalent API

Covalent was used to generate: [this whole section]()

The actual API call

## License

This project is released under a GPLv3 compatible license

## Stack

### Blockchain Technologies

1. Environment - [Hardhat](https://hardhat.org/)
2. File Storage - [IPFS](https://github.com/ipfs/js-ipfs/tree/master/packages/ipfs-http-client#install)
3. Client - [ethers.js](https://docs.ethers.io/v5/)

### Frontend

- [React](https://reactjs.org/)
- [ethers.js](https://docs.ethers.io/v5/)
- [MUI: React UI Library](https://mui.com/)
- [Bootstrap]
- [Covalent](https://www.covalenthq.com/docs/api/)

## Backend

- [Netlify](https://www.netlify.com/): Website host
- [Node.js](https://nodejs.org/en/)
