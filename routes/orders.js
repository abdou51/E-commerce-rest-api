const {Order} = require('../models/order');
const express = require('express');
const { OrderItem } = require('../models/order-item');
const router = express.Router();
const userGuest = require('../helpers/userGuest');
const transporter = require('../helpers/smtpTransporter');
const orderConfirmationTemplate = require('../helpers/mailOptions');
const shippedOrder = require('../helpers/shippedOrder');
const orderDetails = require('../helpers/orderDetails');

router.get(`/`, async (req, res) =>{
    const orderList = await Order.find().populate('user', 'name').sort({'dateOrdered': -1});

    if(!orderList) {
        res.status(500).json({success: false})
    } 
    res.send(orderList);
})

router.get(`/:id`, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name')
      .populate({
        path: 'orderItems',
        populate: {
          path: 'product',
          populate: 'category'
        }
      });

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    res.send(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});


router.post('/', userGuest, async (req, res) => {
  const orderItems = req.body.orderItems; // Retrieve the order items from the request

  const orderItemsIds = await Promise.all(
    orderItems.map(async (orderItem) => {
      let newOrderItem = new OrderItem({
        quantity: orderItem.quantity,
        product: orderItem.product,
      });

      newOrderItem = await newOrderItem.save();

      // Populate the entire product object before returning the complete order item object
      await newOrderItem.populate('product').execPopulate();
      newOrderItem.productObject = newOrderItem.product;

      return newOrderItem.toObject();
    })
  );

  const totalPrices = await Promise.all(
    orderItemsIds.map(async (orderItem) => {
      const orderItemDetails = await OrderItem.findById(orderItem._id).populate(
        'product',
        'price'
      );
      const totalPrice = orderItemDetails.product.price * orderItem.quantity;
      return totalPrice;
    })
  );

  const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

  let order = new Order({
    orderItems: orderItemsIds,
    name: req.body.name,
    shippingAddress1: req.body.shippingAddress1,
    wilaya: req.body.wilaya,
    commune: req.body.commune,
    zip: req.body.zip,
    phone: req.body.phone,
    email: req.body.email,
    status: req.body.status,
    totalPrice: totalPrice,
  });

  if (req.user) {
    order.user = req.user.userId;
    order.userType = 'User';
    
  }

  // Save the order
  order = await order.save();

  // Populate the orderItems field with the complete OrderItem objects
  order = await order
  .populate({
    path: 'orderItems',
    populate: {
      path: 'product',
      select: 'name price volume quantity',
    },
  })
  .execPopulate();

  console.log(order);


    
    if (!order) {
      return res.status(400).send('The order cannot be created!');
    }

    const details = await orderDetails(order.id);
    const mailOptions = orderConfirmationTemplate(order, details);

    
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
    res.send(order);
  });


  router.put('/ship/:id', async (req, res) => {
    const order = await Order.findById(req.params.id);
  
    if (!order)
      return res.status(400).send('The order cannot be found!');
  
    if (order.status === 'Shipped')
      return res.status(400).send('Order is already shipped');
  
    order.status = 'Shipped';
    const updatedOrder = await order.save();
  
    const details = await orderDetails(updatedOrder.id);
    const mailOptions = shippedOrder(updatedOrder, details);
    
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
  
    res.send(updatedOrder);
  });

router.put('/cancel/:id', async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      status: 'Cancelled'
    },
    { new: true }
  );

  if (!order)
      return res.status(400).send('The order cannot be updated!');

  res.send(order);
});



router.delete('/:id', (req, res)=>{
    Order.findByIdAndRemove(req.params.id).then(async order =>{
        if(order) {
            await order.orderItems.map(async orderItem => {
                await OrderItem.findByIdAndRemove(orderItem)
            })
            return res.status(200).json({success: true, message: 'the order is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "order not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
})



router.get('/get/totalsales', async (req, res)=> {
    const totalSales= await Order.aggregate([
        { $group: { _id: null , totalsales : { $sum : '$totalPrice'}}}
    ])

    if(!totalSales) {
        return res.status(400).send('The order sales cannot be generated')
    }

    res.send({totalsales: totalSales.pop().totalsales})
})



router.get(`/get/count`, async (req, res) =>{
    const orderCount = await Order.countDocuments((count) => count)

    if(!orderCount) {
        res.status(500).json({success: false})
    } 
    res.send({
        orderCount: orderCount
    });
})



router.get(`/get/userorders/:userid`, async (req, res) =>{
    const userOrderList = await Order.find({user: req.params.userid}).populate({ 
        path: 'orderItems', populate: {
            path : 'product', populate: 'category'} 
        }).sort({'dateOrdered': -1});

    if(!userOrderList) {
        res.status(500).json({success: false})
    } 
    res.send(userOrderList);
})



module.exports =router;