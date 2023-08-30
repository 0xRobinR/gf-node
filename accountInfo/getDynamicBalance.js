const { default: axios } = require("axios");
const { gfRPC, defaultCall } = require("../config");
const { buildError } = require("../utils/error");
const { dynamicBalance } = require("./config");

function getDynamicBalance(address) {
    return new Promise(async (resolve, reject) => {
        const url = gfRPC + dynamicBalance(address);
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
    getDynamicBalance
}