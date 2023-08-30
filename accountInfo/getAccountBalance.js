const { default: axios } = require("axios");
const { gfRPC, defaultCall } = require("../config");
const { buildError } = require("../utils/error");
const { accountBalance } = require("./config");

function getAccountBalance(address) {
    return new Promise(async (resolve, reject) => {
        const url = gfRPC + accountBalance(address);
        let options = defaultCall({
            url,
        })
        try {
            const response = await axios(options);
            resolve(response.data)
        } catch (err) {
            resolve(buildError({ message: err.message }))
        }
    })

}

module.exports = {
    getAccountBalance
}