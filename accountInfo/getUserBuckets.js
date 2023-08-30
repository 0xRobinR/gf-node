const { buildError } = require("../utils/error");
const { default: axios } = require("axios");

function getUserBuckets(address, spURL) {
    return new Promise(async (resolve, reject) => {
        try {

            const source = axios.CancelToken.source();
            let headers = {
                method: "GET",
                url: spURL,
                headers: {
                    "X-Gnfd-User-Address": address,
                    cancelToken: source.token,
                }
            }

            const buckets = await axios(headers)

            console.debug(buckets.data)

            resolve(buckets.data)
        } catch (err) {
            resolve(buildError({ message: err.message }))
        }
    })

}

module.exports = {
    getUserBuckets
}