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

        }
        catch (err) {
            console.debug(err)
            resolve(buildError({ message: err.message }))
        }
    })
}

createObjectApproval({
    privateKey: "0x1322bbea4d3065841d2efa793ea71d767af74e0c89d64a77308bbd974b66d614",
    bucketName: "hgff",
    objectName: "🥷.jpeg",
    creator: "0xbb900Eacda882c7c2FA5C1e548D7E7149d31ccee",
    visibility: "VISIBILITY_TYPE_PUBLIC_READ",
    fileType: "image\/jpeg",
    redundancyType: 'REDUNDANCY_EC_TYPE',
    contentLength: 833630,
    expectCheckSums: "[\"719wKYhbbYIK1\\\/+QzMLfSYwv5aqtl6Cr1AKLAGbsFH4=\",\"f7xZijNzoV1y7NQ137ErcaRJtZO9igXZXKpTN5OMDck=\",\"4UjCPROlkLrA2N+vHNMenh0uUoY2PojWUygw8rH0nfg=\",\"GmiX9F6D6SOZbeEySgzR61wA9Usnk9IrfNg53PVTUEY=\",\"yduKiP\\\/j9QX0rIK\\\/E86B116GB\\\/MreOWWfKrr5Hteuko=\",\"NtQqDdiTvT+9F5k4sdPg+ESIE1du2waiiP0q80ziwIE=\",\"B9K2k746hBm5iFiI4HxmlI\\\/eWF\\\/eHtYIIlok+b59We0=\"]",
})

module.exports = {
    createObject,
    createObjectApproval
}