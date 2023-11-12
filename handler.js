'use strict';

const orderManagement = require('./order-management');
const kinesisHelper = require('./kinesis-helper');
const cakeProducerManager = require('./cake-producer-manager');

const createResponse = (statusCode, message) => {
  return {
    statusCode: statusCode,
    body: JSON.stringify(message)
  }
}
module.exports.createOrder = async (event) => {

  const body = JSON.parse(event.body);
  const order = orderManagement.createOrder(body);

  return orderManagement.placeNewOrder(order).then(() => {
    return createResponse(200, "Order Created!");
  }).catch((error)=>{
    return createResponse(400, error);
  })
};

module.exports.orderFulfillment = async(event) => {
  const body = JSON.parse(event.body);
  const orderId = body.orderId;
  const fulfillmentId = body.fulfillmentId;

  return orderManagement.fulfillOrder(orderId, fulfillmentId).then(() => {
    return createResponse(200, `Order with orderId: ${orderId} was sent to delivery!`);
  }).catch(error =>{
    return createResponse(400, error);
  })
}

module.exports.notifyCakeProducer = async(event) => {
  const data = kinesisHelper.getRecords(event);
  const ordersPlaced = records.filter(r => r.eventType == 'order_placed');

  if (ordersPlaced <= 0)
  {
    return 'There is no data';
  }
  cakeProducerManager.handlePlaceOrders(ordersPlaced).then(()=>{
    return 'everything went well';
  }).catch(error => {
    return error;
  })
}