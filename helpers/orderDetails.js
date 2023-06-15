const {Order} = require('../models/order');
const {OrderItem} = require('../models/order-item');

// Function to fetch order details with product names and quantities
async function getOrderDetails(orderId) {
  try {
    const order = await Order.findById(orderId).populate({
      path: 'orderItems',
      populate: {
        path: 'product',
        select: 'name volume price',
      },
    });

    const orderDetails = {
      orderId: order.id,
      totalPrice: order.totalPrice,
      items: order.orderItems.map((orderItem) => ({
        productName: orderItem.product.name,
        volume: orderItem.product.volume,
        quantity: orderItem.quantity,
        price:orderItem.product.price,
      })),
    };
    return orderDetails;
  } catch (error) {
    // Handle any errors that occur during the process
    console.error(error);
  }
}

module.exports = getOrderDetails;
