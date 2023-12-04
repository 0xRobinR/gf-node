module.exports = {
    "accountInfo": "/cosmos/auth/v1beta1/account_info/",
    "accountBalance": (address) => `/cosmos/bank/v1beta1/balances/${address}/by_denom?denom=BNB`,
    "dynamicBalance": (address) => `/greenfield/payment/dynamic_balance/${address}`,
    "getOutFlow": (address) => `/greenfield/payment/out_flows/${address}`,
}