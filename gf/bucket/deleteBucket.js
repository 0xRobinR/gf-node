
const { buildError } = require("../../utils/error");
const { gfClient } = require("../../client");

function getDeleteBucketEstimate({
    privateKey,
    bucketName,
    creator
}) {
    return new Promise(async (resolve, reject) => {
        try {
            let preview = await gfClient.bucket.deleteBucket({
                bucketName,
                operator: creator
            })
            const simulate = await preview.simulate({ denom: "BNB" })
            console.log(simulate)

            resolve({
                ...simulate,
                gasLimit: simulate.gasLimit.toString(),
            })
        } catch (err) {
            resolve(buildError({ message: err.message }))
        }
    })
}

function deleteBucket({
    privateKey,
    bucketName,
    creator
}) {
    return new Promise(async (resolve, reject) => {
        try {
            let preview = await gfClient.bucket.deleteBucket({
                bucketName,
                operator: creator
            })
            const broadcast = await preview.broadcast({
                denom: "BNB",
                gasLimit: preview.gasLimit.toString(),
                gasPrice: preview.gasPrice,
                payer: creator,
                privateKey: privateKey,
                granter: ""
            })

            console.log(broadcast.transactionHash)

            resolve({
                hash: broadcast.transactionHash,
                block: broadcast.height
            })
        } catch (err) {
            resolve(buildError({ message: err.message }))
        }
    })
}
module.exports = {
    getDeleteBucketEstimate,
    deleteBucket
}