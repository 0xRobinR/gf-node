const { Client } = require("@bnb-chain/greenfield-chain-sdk");
const { gfRPC } = require("./config");

const client = Client.create('https://gnfd-testnet-fullnode-tendermint-ap.bnbchain.org', '5600');

module.exports = {
    gfClient: client
}