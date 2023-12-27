
const { buildError } = require("../../utils/error");
const { gfClient } = require("../../client");
const { ethers } = require("ethers");

function setObject({
    privateKey,
    creator,
    bucketName,
    objectName,
    visibility
}) {
    return new Promise(async (resolve, reject) => {
        try {
            let preview = await gfClient.object.updateObjectInfo({
                operator: creator,
                bucketName,
                objectName,
                visibility,
            })
            const simulate = await preview.simulate({ denom: "BNB" })

            const broadcast = await preview.broadcast({
                denom: "BNB",
                gasLimit: simulate.gasLimit.toString(),
                gasPrice: simulate.gasPrice,
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
    setObject
}