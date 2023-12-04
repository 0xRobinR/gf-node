const { default: axios } = require("axios");
const { gfRPC, defaultCall } = require("../config");
const { buildError } = require("../utils/error");
const { getObjects } = require("./config");

function getObjectsInBucket(bucketName, pageKey = null) {
    return new Promise(async (resolve, reject) => {
        const url = gfRPC + getObjects(bucketName, pageKey);
        let options = defaultCall({
            url,
        })
        try {
            const response = await axios(options);
            resolve(response.data)
        } catch (err) {
            resolve(buildError({ message: err.message }))
        }
    })

}

module.exports = {
    getObjectsInBucket
}