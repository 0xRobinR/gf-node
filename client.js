const { Client } = require("@bnb-chain/greenfield-js-sdk");
const { gfRPC } = require("./config");

(async () => {
    const fetch = await import('node-fetch');
    global.fetch = fetch.default;
})();

const client = Client.create('https://gnfd-testnet-fullnode-tendermint-us.bnbchain.org', '5600');

module.exports = {
    gfClient: client
}