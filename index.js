
const express = require('express')
const multer = require('multer')
const bodyParser = require('body-parser')
const cors = require('cors')
const { getAccountInfo } = require('./accountInfo/getAccountInfo')
const { getAccountBalance } = require('./accountInfo/getAccountBalance')
const { getLatestBlock } = require('./gf/getLatestBlock')
const { getUserBuckets } = require('./accountInfo/getUserBuckets')
const { getStorageProviders } = require('./gf/getStorageProviders')
const { getBucketInfo } = require('./gf/getBucketInfo')
const { getObjectsInBucket } = require('./gf/getObjectsInBucket')
const { getDynamicBalance } = require('./accountInfo/getDynamicBalance')
const { getOutflowAccount } = require('./accountInfo/getOutFlow')
const { getStorePrice } = require('./gf/getStorePrice')
const { getPriceBySP } = require('./gf/getSPPrice')
const { getStats } = require('./gf/getStats')
const { getBucketApproval, createBucket } = require('./transaction/createBucket')
const { createObject } = require('./transaction/createObject')

const app = express()

// Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())

// const upload = multer({ dest: "./temp/" });

app.get('/', (req, res) => {
    res.send({
        version: '0.0.1',
        author: '0xrobinr'
    })
})

// Account Info

app.post('/accountInfo', async (req, res) => {
    const { address } = req.body
    const resp = await getAccountInfo(address)
    if (resp.error) {
        res.send(resp)
        return
    }
    res.send(resp?.info)
})

app.post('/accountBalance', async (req, res) => {
    const { address } = req.body
    const resp = await getAccountBalance(address)
    if (resp.error) {
        res.send(resp)
        return
    }
    res.send(resp?.balance)
})

app.post('/dynamicBalance', async (req, res) => {
    const { address } = req.body
    const resp = await getDynamicBalance(address)
    if (resp.error) {
        res.send(resp)
        return
    }
    res.send(resp)
})

app.post('/outflow', async (req, res) => {
    const { address } = req.body
    const resp = await getOutflowAccount(address)
    if (resp.error) {
        res.send(resp)
        return
    }
    res.send(resp?.out_flows)
})

// Block Info

app.get('/getBlock', async (req, res) => {
    const resp = await getLatestBlock()
    if (resp.error) {
        res.send(resp)
        return
    }
    res.send({
        current: resp?.block?.header?.height,
    })
})

app.get('/stats', async (req, res) => {
    const resp = await getStats()
    if (resp.error) {
        res.send(resp)
        return
    }
    res.send(resp)
})

// Storage Providers
app.get('/storageProviders', async (req, res) => {
    const resp = await getStorageProviders()
    if (resp.error) {
        res.send(resp)
        return
    }
    res.send(resp?.sps)
})

app.get('/storePrice', async (req, res) => {
    const resp = await getStorePrice()
    if (resp.error) {
        res.send(resp)
        return
    }
    res.send(resp?.secondary_sp_store_price)
})

app.post('/spStorePrice', async (req, res) => {
    const { spAddr, timestamp } = req.body
    const resp = await getPriceBySP(spAddr, timestamp)
    if (resp.error) {
        res.send(resp)
        return
    }
    res.send(resp?.sp_storage_price)
})

// User Buckets
app.post('/userBuckets', async (req, res) => {
    const { address, spURL } = req.body
    console.debug(address, spURL)
    const resp = await getUserBuckets(address, spURL)
    if (resp.error) {
        res.send(resp)
        return
    }
    res.send(resp?.GfSpGetUserBucketsResponse.Buckets)
})

// Bucket Info
app.post('/bucketInfo', async (req, res) => {
    const { bucketName } = req.body
    const resp = await getBucketInfo(bucketName)
    if (resp.error) {
        res.send(resp)
        return
    }
    res.send(resp?.bucket_info)
})

app.post('/bucketObjects', async (req, res) => {
    const { bucketName, pageKey } = req.body
    const resp = await getObjectsInBucket(bucketName, pageKey)
    if (resp.error) {
        res.send(resp)
        return
    }
    res.send(resp)
})

// transaction
app.post('/getCreateBucketEstimate', async (req, res) => {
    const { auth: privateKey, spAddr: spAddress, address: creator, bucketName, visibility } = req.body
    const resp = await getBucketApproval({
        privateKey,
        spAddress,
        creator,
        bucketName,
        visibility
    })
    if (resp.error) {
        res.send(resp)
        return
    }
    res.send(resp)
})

app.post('/createBucket', async (req, res) => {
    const { auth: privateKey, spAddr: spAddress, address: creator, bucketName, visibility } = req.body
    console.debug(privateKey, spAddress, creator, bucketName, visibility)

    const resp = await createBucket({
        privateKey,
        spAddress,
        creator,
        bucketName,
        visibility: null
    })
    if (resp.error) {
        res.send(resp)
        return
    }
    res.send(resp)
})

// upload file objects
app.post('/createObject', upload.single('myFile'), async (req, res) => {
    try {
        const uploadedFile = req.file;
        if (!uploadedFile) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }

        // Access other form data via req.body
        const { auth: privateKey, address: creator, bucketName, visibility } = req.body;
        const fileType = uploadedFile.mimetype;

        const resp = await createObject({
            privateKey,
            objectName: uploadedFile.originalname,
            creator,
            bucketName,
            visibility,
            fileType,
            path: uploadedFile.path
        });
        if (resp.error) {
            res.send(resp);
            return;
        }
        res.send(resp);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

app.listen(process.env.PORT || 80, () => console.log("server started"))

module.exports = app