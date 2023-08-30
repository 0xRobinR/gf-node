const FileHandle = require("@bnb-chain/greenfiled-file-handle");
const { buildError } = require("../utils/error");
const { gfClient } = require("../client");

function readFileAsUint8Array(fileData) {
    const fileArrayBuffer = Buffer.from(fileData).buffer;
    const fileUint8Array = new Uint8Array(fileArrayBuffer);
    return fileUint8Array;
}
function createObject({
    privateKey,
    bucketName,
    objectName,
    creator,
    visibility = "VISIBILITY_TYPE_PUBLIC_READ",
    fileType,
    path
}) {
    return new Promise(async (resolve, reject) => {
        try {
            const fileData = await fs.promises.readFile(path);
            const fileArrayBuffer = readFileAsUint8Array(fileData);
            if (fileArrayBuffer) {
                const { contentLength, expectCheckSums } = await FileHandle.getCheckSums(fileArrayBuffer);

                // let _createObject = await gfClient.object.createObject({
                //     signType: "authTypeV1",
                //     privateKey: privateKey,
                //     bucketName,
                //     objectName,
                //     creator,
                //     visibility,
                //     fileType,
                //     contentLength,
                //     expectCheckSums,
                // })

                let _createObject = await gfClient.object.createObject({
                    signType: "authTypeV1",
                    privateKey,
                    bucketName,
                    objectName,
                    creator,
                    contentLength,
                    fileType,
                    expectCheckSums,
                    visibility
                }, {
                    signType: "authTypeV1",
                    privateKey: privateKey,
                })

                console.debug(_createObject)

                const simulate = await _createObject.simulate({ denom: "BNB" })
                console.log(simulate)

                const broadcast = await _createObject.broadcast({
                    denom: "BNB",
                    gasLimit: simulate.gasLimit.toString(),
                    gasPrice: simulate.gasPrice,
                    payer: creator,
                    privateKey: privateKey,
                    granter: ""
                })

                resolve({
                    hash: broadcast.transactionHash,
                    block: broadcast.height
                })
            }
        }
        catch (err) {
            resolve(buildError({ message: err.message }))
        }
    })
}

module.exports = {
    createObject
}