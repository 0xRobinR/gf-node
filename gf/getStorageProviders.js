const { default: axios } = require("axios");
const { gfRPC, defaultCall } = require("../config");
const { buildError } = require("../utils/error");
const { getSP } = require("./config");

function getStorageProviders() {
    return new Promise(async (resolve, reject) => {
        const url = gfRPC + getSP;
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
    getStorageProviders
}