const { default: axios } = require("axios");
const { gfRPC, defaultCall } = require("../config");
const { buildError } = require("../utils/error");
const { getBucket, getBucketExtra } = require("./config");

function getBucketInfo(bucketName) {
    return new Promise(async (resolve, reject) => {
        const url = gfRPC + getBucket(bucketName);
        const url2 = gfRPC + getBucketExtra(bucketName);
        let options = defaultCall({
            url,
        })
        try {
            const response = await axios(options);
            options = {
                ...options,
                url: url2
            }
            const responseExtra = await axios(options)
            response.data.bucket_info = {
                ...response.data.bucket_info,
                ...responseExtra.data.extra_info
            }
            resolve(response.data)
        } catch (err) {
            resolve(buildError({ message: err.message }))
        }
    })

}

module.exports = {
    getBucketInfo
}