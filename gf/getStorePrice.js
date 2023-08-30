const { default: axios } = require("axios");
const { gfRPC, defaultCall } = require("../config");
const { buildError } = require("../utils/error");
const { getPrice } = require("./config");

function getStorePrice() {
    return new Promise(async (resolve, reject) => {
        const url = gfRPC + getPrice;
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
    getStorePrice
}