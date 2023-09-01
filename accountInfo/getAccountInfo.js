const { default: axios } = require("axios");
const { gfRPC, defaultCall } = require("../config");
const { buildError } = require("../utils/error");
const { accountInfo } = require("./config");

function getAccountInfo(address) {
    return new Promise(async (resolve, reject) => {
        const url = gfRPC + accountInfo + address;
        let options = defaultCall({
            url,
        })
        try {
            const response = await axios(options);
            resolve(response.data)
        } catch (err) {
            console.log(err)
            resolve(buildError({ message: err.message }))
        }
    })

}

module.exports = {
    getAccountInfo
}