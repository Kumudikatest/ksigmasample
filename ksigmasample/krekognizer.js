const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
const rekog = new AWS.Rekognition();

exports.handler = function (event, context, callback) {
    let s3 = event.Records[0].s3;
    rekog.detectLabels({
        Image: {
            S3Object: {
                Bucket: s3.bucket.name,
                Name: s3.object.key
            }
        },
        MaxLabels: 1
    }).promise()
        .then(data => {
            console.log(data);
            if (!data.Labels || data.Labels.length < 1) {
                callback(null, {});
                return;
            }
            let lbl = data.Labels[0];
            console.log(lbl.Name)
            ddb.put({
                TableName: 'ksample',
                Item: { 'label': 'lbl.Name', 'name': 's3.object.key' }
            }).promise()
                .then((data) => {
                    //your logic goes here
                })
                .catch((err) => {
                    //handle error
                });
        })
        .catch(callback);
}