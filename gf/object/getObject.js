
const { buildError } = require("../../utils/error");
const { gfClient } = require("../../client");
function getObjectPreview({
    privateKey,
    bucketName,
    objectName
}) {
    return new Promise(async (resolve, reject) => {
        try {
            let preview = await gfClient.object.getObjectPreviewUrl({
                bucketName,
                objectName,
                queryMap: {}
            }, {
                privateKey: privateKey,
                type: "ECDSA"
            })
            console.debug(preview)
            resolve({ url: preview })
        } catch (err) {
            resolve(buildError({ message: err.message }))
        }
    })
}
module.exports = {
    getObjectPreview
}