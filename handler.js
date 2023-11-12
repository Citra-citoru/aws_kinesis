'use strict';

module.exports.createOrder = async (event) => {
  return {
    statusCode: 201,
    body: JSON.stringify(
      {
        message: 'Order created!',
        input: event,
      },
      null,
      2
    ),
  };
};
