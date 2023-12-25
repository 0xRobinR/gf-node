
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
    deleteObject
}