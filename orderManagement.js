'use strict'
const uuidv1 = require('uuid/v1');
const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const kinesis = new AWS.kinesis();

const TABLE_NAME = process.env.OrderTableName;
const STREAM_NAME = process.env.orderStreamName;

module.export.createOrder = body => {
    const order = {
        orderId: uuidv1 (),
        name: body. name,
        address: body.address,
        productId: body.productId,
        quantity: body.quantity,
        orderDate: Date.now(),
        eventType: 'order_place'

    };
    return order;
}

module.export.placeNewOrder = order => {
    return saveNewOrder(order).then((order) => {
        return placeOrderStream(order);
    });
}

function saveNewOrder(order) {
    const params = {
        TableName: TABLE_NAME,
        Item: order
    };
    return dynamo.put(params).promise();
}

function placeOrderStream(order) {
    const params = {
        Data: JSON.stringify(order),
        PartitionKey: order.orderId,
        StreamName: STREAM_NAME
    }
    return kinesis.putRecord(params).promise();
}