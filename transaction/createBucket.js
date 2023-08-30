const { gfClient } = require("../client")
const { buildError } = require("../utils/error")

function getBucketApproval({
    privateKey,
    spAddress,
    creator,
    bucketName,
    visibility = "VISIBILITY_TYPE_PUBLIC_READ"
}) {
    return new Promise(async (resolve, reject) => {
        try {
            const createBucket = await gfClient.bucket.createBucket({
                signType: "authTypeV1",
                privateKey: privateKey,
                creator: creator,
                spInfo: {
                    primarySpAddress: spAddress,
                },
                bucketName: bucketName,
                chargedReadQuota: "0",
                visibility: visibility,
            })

            const simulate = await createBucket.simulate({ denom: "BNB" })
            console.debug(simulate)

            resolve({
                ...simulate,
                gasLimit: simulate.gasLimit.toString(),
            })
        } catch (err) {
            resolve(buildError({ message: err.message }))
        }
    })
}

function createBucket({
    privateKey,
    spAddress,
    creator,
    bucketName,
    visibility = "VISIBILITY_TYPE_PUBLIC_READ"
}) {
    return new Promise(async (resolve, reject) => {
        try {
            const createBucket = await gfClient.bucket.createBucket({
                signType: "authTypeV1",
                privateKey: privateKey,
                creator: creator,
                spInfo: {
                    primarySpAddress: spAddress,
                },
                bucketName: bucketName,
                chargedReadQuota: "0",
                visibility: visibility,
            })

            const simulate = await createBucket.simulate({ denom: "BNB" })
            const broadcast = await createBucket.broadcast({
                denom: "BNB",
                gasLimit: simulate.gasLimit.toString(),
                gasPrice: simulate.gasPrice,
                payer: creator,
                privateKey: privateKey,
                granter: ""
            })
            console.debug(broadcast, broadcast.events)

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
    getBucketApproval,
    createBucket
}