const defaultConfig = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://gnfd-testnet-fullnode-tendermint-us.bnbchain.org/',
    headers: {
        'Accept': '*/*'
    }
}

module.exports = {
    "gfRPC": "https://gnfd-testnet-fullnode-tendermint-ap.bnbchain.org",
    "defaultCall": (override) => {
        return {
            ...defaultConfig,
            ...override
        }
    }
}