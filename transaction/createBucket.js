const { ethers } = require("ethers")
const { gfClient } = require("../client")
const { buildError } = require("../utils/error")

const wallet = new ethers.Wallet("0x1322bbea4d3065841d2efa793ea71d767af74e0c89d64a77308bbd974b66d614")
const account = wallet.connect(gfClient.provider)

// account.signMessage("hello world").then((signature) => {
//     console.debug(signature)
// })

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
                creator: creator,
                spInfo: {
                    primarySpAddress: spAddress,
                },
                bucketName: bucketName,
                chargedReadQuota: "0",
                visibility: visibility
            }, {
                type: "ECDSA",
                privateKey: privateKey,
            })

            const simulate = await createBucket.simulate({ denom: "BNB" })
            console.debug(simulate)

            resolve({
                ...simulate,
                gasLimit: simulate.gasLimit.toString(),
            })
        } catch (err) {
            console.debug("error", err.message)
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
                creator: creator,
                spInfo: {
                    primarySpAddress: spAddress,
                },
                paymentAddress: creator,
                bucketName: bucketName,
                chargedReadQuota: "0",
                visibility: visibility || "VISIBILITY_TYPE_PUBLIC_READ",
            }, {
                type: "ECDSA",
                privateKey: privateKey,
            })

            const simulate = await createBucket.simulate({ denom: "BNB" })
            const broadcast = await createBucket.broadcast({
                denom: "BNB",
                gasLimit: Number(simulate.gasLimit),
                gasPrice: simulate.gasPrice,
                payer: creator,
                granter: "",
                privateKey
            })

            console.debug(broadcast.transactionHash)

            resolve({
                hash: broadcast.transactionHash,
                block: broadcast.height
            })
        } catch (err) {
            console.debug("error", err.message)
            resolve(buildError({ message: err.message }))
        }
    })
}

createBucket({
    privateKey: "0x1322bbea4d3065841d2efa793ea71d767af74e0c89d64a77308bbd974b66d614",
    spAddress: "0xC22843908F8c82962754dC141F44Aa73E2C2A74E",
    creator: "0xbb900Eacda882c7c2FA5C1e548D7E7149d31Ccee",
    bucketName: "what-a-name-could-be",
})

module.exports = {
    getBucketApproval,
    createBucket
}