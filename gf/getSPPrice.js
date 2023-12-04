const { default: axios } = require("axios");
const { gfRPC, defaultCall } = require("../config");
const { buildError } = require("../utils/error");
const { getSPPrice } = require("./config");

function getPriceBySP(spAddr, timestamp = 0) {
    return new Promise(async (resolve, reject) => {
        const url = gfRPC + getSPPrice(spAddr, timestamp);
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
    getPriceBySP
}