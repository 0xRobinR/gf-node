
const { buildError } = require("../../utils/error");
const { gfClient } = require("../../client");



function deleteObject({
    privateKey,
    bucketName,
    objectName,
    creator,
}) {
    return new Promise(async (resolve, reject) => {
        try {
            let preview = await gfClient.object.deleteObject({
                bucketName,
                objectName,
                operator: creator
            })

            console.debug(preview)

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

function cancelObject({
    privateKey,
    bucketName,
    objectName,
    creator,
}) {
    return new Promise(async (resolve, reject) => {
        try {
            let preview = await gfClient.object.cancelCreateObject({
                bucketName,
                objectName,
                operator: creator
            })

            console.debug(preview)

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
    deleteObject,
    cancelObject
}