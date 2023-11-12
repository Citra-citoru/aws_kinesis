"use strict";
const AWS = require('aws-sdk');
const sqs = new AWS. SQS({
  region: process.env.region
});

const DELIVERY_COMPANY_QUEUE = process.env.deliveryCompanyQueue;

module.exports.deliveryOrder = ordersFulfilled => {
    var orderFulfilledPromises = [];
    for (let order of orderFulfilled) {
        const temp = orderManager.update0rderForDelivery(order.orderId).then(updatedOrder => {
            orderManager.saveOrder(updatedOrder).then ( () => {
              notifyDeliverytompany(updatedOrder);
            });
        });
        orderFulfilledPromises.push(temp);
    };
    return Promise.all(orderFulfilledPromises) ;
}

function notifyDeliveryCompany(order) {
    const params = {
      MessageBody: JSON.stringify(order), 
      QueueUrl: DELIVERY_COMPANY_QUEUE
    }
    return sqs.sendMessage(params).promise();
}