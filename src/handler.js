const fetch = require('node-fetch');
const AWS = require('aws-sdk');
AWS.config.update({region:'us-east-1'});

module.exports.handler = async event => {
    console.log('Starting' + JSON.stringify(event));

    try {
        const rawResponse = await fetch('https://api.mysportsfeeds.com/v2.1/pull/nfl/2019-regular/player_stats_totals.json', {
            headers: {
                'Authorization': 'Basic ' + process.env.api_key
            }
        });
        const response = await rawResponse.json();

        const s3 = new AWS.S3();
        await s3.putObject({
                Bucket: 'nfl-data-fantasy',
                Key: 'playerData.json',
                Body: JSON.stringify(response),
                ContentType: "application/json"}).promise();

        return response;
    } catch (e) {
        console.log('Error: ' + e);
    }
};
