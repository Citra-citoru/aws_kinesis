'use strict';

const orderManagement = require('./orderManagement');

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
