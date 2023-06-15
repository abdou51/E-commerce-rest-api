const orderConfirmationTemplate = (order, details) => {
  return {
    from: 'MangaLandz <support@mangalandz.com>',
    to: order.email,
    subject: 'Order Confirmation',
    html: `<p>Dear ${order.name},</p>
      <p>Thank you for your order! We are pleased to inform you that your order has been created successfully. Please find the order details below:</p>

      <table style="border-collapse: collapse; width: 50%;">
        <thead>
          <tr>
            <th style="border: 1px solid black; padding: 8px;">Product Name</th>
            <th style="border: 1px solid black; padding: 8px;">Volume</th>
            <th style="border: 1px solid black; padding: 8px;">Quantity</th>
            <th style="border: 1px solid black; padding: 8px;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${details.items
            .map(
              (item) => `
            <tr>
              <td style="border: 1px solid black; padding: 8px;">${item.productName}</td>
              <td style="border: 1px solid black; padding: 8px;">${item.volume}</td>
              <td style="border: 1px solid black; padding: 8px;">${item.quantity}</td>
              <td style="border: 1px solid black; padding: 8px;">${item.price} DZD</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>

      <p>Customer Information:</p>
      <ul>
        <li>Name: ${order.name}</li>
        <li>Shipping Address: ${order.shippingAddress1}</li>
        <li>City: ${order.city}</li>
        <li>Phone: ${order.phone}</li>
      </ul>

      <p>Total Price: ${order.totalPrice} DZD</p>

      <p>Thank you for choosing MangaLandz!</p>

      <p>Best regards,<br>MangaLandz Support Team</p>`,
  };
};

module.exports = orderConfirmationTemplate;
