'use strict';

function parsePayload(record){
    const data = new Buffer(record.kinesis.data, 'base64').toString('utf8');
    return JSON.parse(data);
}


module.exports.getRecords = event => {
    return event.Records.map(parsePayload(event));
}