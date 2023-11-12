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
    return saveOrder(order).then((order) => {
        return placeOrderStream(order);
    });
}

module.exports.fulfillOrder = (orderId, fulfillmentId) => {
    return getOrder(orderId).then(savedOrder => {
        const order = createFullfilledOrder(savedOrder, fulfillmentId);
        return savedOrder(order).then(order =>{
            return placeOrderStream(order);
        })
    })
}

function saveOrder(order) {
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

function getOrder(orderId){
    const params = {
        Key: {
            orderId: orderId
        },
        TableName: TABLE_NAME
    }
    dynamo.get(params).promise().then(result => {
        return result.Item;
    })
}

function createFullfilledOrder(savedOrder, fulfillmentId) {
    savedOrder.fulfillmentId = fulfillmentId;
    savedOrder.fulfillmentDate = Date.now();
    savedOrder.eventType = 'order_fulfilled';

    return savedOrder;
}