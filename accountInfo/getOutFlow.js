const { default: axios } = require("axios");
const { gfRPC, defaultCall } = require("../config");
const { buildError } = require("../utils/error");
const { getOutFlow } = require("./config");

function getOutflowAccount(address) {
    return new Promise(async (resolve, reject) => {
        const url = gfRPC + getOutFlow(address);
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
    getOutflowAccount
}