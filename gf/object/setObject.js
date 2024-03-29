
const { buildError } = require("../../utils/error");
const { gfClient } = require("../../client");
const { VisibilityType } = require("@bnb-chain/greenfield-cosmos-types/greenfield/storage/common")

function setObject({
    privateKey,
    creator,
    bucketName,
    objectName,
    visibility = "VISIBILITY_TYPE_PUBLIC_READ"
}) {
    return new Promise(async (resolve, reject) => {
        try {

            console.log(visibility)
            let preview = await gfClient.object.updateObjectInfo({
                operator: creator,
                bucketName,
                objectName,
                visibility: visibility === "VISIBILITY_TYPE_PUBLIC_READ" ? VisibilityType.VISIBILITY_TYPE_PUBLIC_READ : VisibilityType.VISIBILITY_TYPE_PRIVATE
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
            console.debug("error", err.message)
            resolve(buildError({ message: err.message }))
        }
    })
}
module.exports = {
    setObject
}