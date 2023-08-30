module.exports = {
    "getBlock": "/cosmos/base/tendermint/v1beta1/blocks/latest",
    "getSP": "/greenfield/storage_providers",
    "getBucket": (bucketName) => `/greenfield/storage/head_bucket/${bucketName}`,
    "getBucketExtra": (bucketName) => `/greenfield/storage/head_bucket_extra/${bucketName}`,
    "getObjects": (bucketName, pageKey = null) => `/greenfield/storage/list_objects/${bucketName}${pageKey ? `&pagination.key=${pageKey}` : ''}`,
    "getPrice": "/greenfield/sp/get_secondary_sp_store_price_by_time/0",
    "getSPPrice": (spAddr, timstamp = 0) => `/greenfield/sp/get_sp_storage_price_by_time/${spAddr}/${timstamp}`
}