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
    redundancyType = 'REDUNDANCY_EC_TYPE',
    contentLength,
    expectCheckSums,
}) {
    return new Promise(async (resolve, reject) => {
        try {
            let _createObject = await gfClient.object.createObject({
                creator,
                contentLength,
                fileType,
                visibility,
                expectCheckSums: JSON.parse(expectCheckSums),
                objectName,
                bucketName,
                redundancyType,
            }, {
                privateKey: privateKey,
                type: "ECDSA"
            })

            // console.debug(_createObject)

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

            console.log(broadcast.transactionHash)

            resolve({
                hash: broadcast.transactionHash,
                block: broadcast.height
            })
        }
        catch (err) {
            resolve(buildError({ message: err.message }))
        }
    })
}

function createObjectApproval({
    privateKey,
    bucketName,
    objectName,
    creator,
    visibility = "VISIBILITY_TYPE_PUBLIC_READ",
    fileType,
    redundancyType = 'REDUNDANCY_EC_TYPE',
    contentLength,
    expectCheckSums,
}) {
    return new Promise(async (resolve, reject) => {
        try {
            let createObjectEstimate = await gfClient.object.createObject({
                creator,
                contentLength,
                fileType,
                visibility,
                expectCheckSums: JSON.parse(expectCheckSums),
                objectName,
                bucketName,
                redundancyType,
            }, {
                privateKey: privateKey,
                type: "ECDSA"
            })

            const simulate = await createObjectEstimate.simulate({ denom: "BNB" })
            console.log(simulate)

            resolve({
                ...simulate,
                gasLimit: simulate.gasLimit.toString(),
            })

        }
        catch (err) {
            console.debug(err)
            resolve(buildError({ message: err.message }))
        }
    })
}

function createFolder({
    privateKey,
    bucketName,
    objectName,
    creator
}) {
    return new Promise(async (resolve, reject) => {
        try {
            let createObjectEstimate = await gfClient.object.createFolder({
                creator,
                objectName: objectName + "/",
                bucketName,
            }, {
                privateKey: privateKey,
                type: "ECDSA"
            })

            const simulate = await createObjectEstimate.simulate({ denom: "BNB" })
            console.log(simulate)

            const broadcast = await createObjectEstimate.broadcast({
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

        }
        catch (err) {
            console.debug(err)
            resolve(buildError({ message: err.message }))
        }
    })
}

module.exports = {
    createObject,
    createObjectApproval,
    createFolder
}