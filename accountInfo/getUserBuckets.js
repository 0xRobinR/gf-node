const { buildError } = require("../utils/error");
const { default: axios } = require("axios");
const xml2js = require('xml2js');

const parseXmlToJson = (xmlData) => {
    return new Promise((resolve, reject) => {
        const parser = new xml2js.Parser({ explicitArray: false });
        parser.parseString(xmlData, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
};

function getUserBuckets(address, spURL) {
    return new Promise(async (resolve, reject) => {
        try {

            const source = axios.CancelToken.source();
            let headers = {
                method: "GET",
                url: spURL,
                headers: {
                    "X-Gnfd-User-Address": address,
                    cancelToken: source.token,
                }
            }

            const buckets = await axios(headers)
            const data = await parseXmlToJson(buckets.data)
            console.debug(data)

            resolve(data)
        } catch (err) {
            resolve(buildError({ message: err.message }))
        }
    })

}

module.exports = {
    getUserBuckets
}