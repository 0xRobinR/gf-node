const { default: axios } = require("axios");
const { buildError } = require("../utils/error");
const { gfClient } = require("../client");
const { gfRPC, defaultCall } = require("../config");
const { getLatestBlock } = require("./getLatestBlock");

function getTotalBuckets() {
    return new Promise(async (resolve, reject) => {
        try {
            let config = defaultCall({
                url: `${gfRPC}/greenfield/storage/list_buckets?pagination.count_total=true`,
            })

            const response = await axios(config)
            resolve(response.data.pagination.total)
        } catch (err) {
            resolve(buildError({ message: err.message }))
        }
    })
}

function getStats() {
    return new Promise(async (resolve, reject) => {
        try {
            const totalBuckets = await getTotalBuckets()
            const latestBlock = await getLatestBlock()
            resolve({
                totalBuckets,
                currentBlock: latestBlock?.block?.header?.height
            })
        } catch (err) {
            resolve(buildError({ message: err.message }))
        }
    })

}

module.exports = {
    getStats
}