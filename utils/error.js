const buildError = ({ message }) => {
    return {
        error: {
            message
        },
        status: 'error',
        statusCode: 500
    }
}

module.exports = {
    buildError
}