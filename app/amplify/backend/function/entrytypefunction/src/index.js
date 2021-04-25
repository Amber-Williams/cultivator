const awsServerlessExpress = require('aws-serverless-express');
const app = require('./app');

const server = awsServerlessExpress.createServer(app);

exports.handler = async (event, context) => {
    console.log(`request params: ${JSON.stringify(event)}`);
    const response = await awsServerlessExpress.proxy(server, event, context, 'PROMISE').promise

    if (response.statusCode === 200) {
        return JSON.parse(response.body)
    }

    return response;
};
