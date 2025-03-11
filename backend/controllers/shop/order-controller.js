import paypalClient from "../../helpers/paypal.js";
import Order from "../../models/Order.js";
import Cart from "../../models/Cart.js";
import Product from "../../models/Product.js";
import paypal from "@paypal/checkout-server-sdk";

export const createOrder = async (req, res) => {
  try {
    const { userId, cartId, addressInfo, paymentMethod, orderStatus } =
      req.body;

    // 🔹 Fetch cart from DB to get actual items and prices
    const cart = await Cart.findById(cartId).populate("items.productId");
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found!" });
    }

    // 🔹 Prepare items and calculate total amount
    let totalAmount = 0;
    const cartItems = cart.items.map((item) => {
      const product = item.productId; // Populated product document
      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      return {
        name: product.title,
        sku: product._id.toString(),
        unit_amount: {
          currency_code: "USD",
          value: product.price.toFixed(2),
        },
        quantity: item.quantity.toString(),
      };
    });

    // 🔹 Create PayPal Order
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: totalAmount.toFixed(2),
          },
          items: cartItems,
        },
      ],
    });

    const paypalOrder = await paypalClient.execute(request);

    // 🔹 Save the order in the database
    const newOrder = new Order({
      userId,
      cartId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus: "pending", // Default status
      totalAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: paypalOrder.result.id, // Store PayPal order ID
    });

    await newOrder.save();

    res.status(201).json({
      success: true,
      orderId: paypalOrder.result.id,
      approvalURL: paypalOrder.result.links.find(
        (link) => link.rel === "approve"
      ).href,
    });
  } catch (error) {
    console.error("PayPal Order Creation Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Error while creating PayPal order" });
  }
};
export const capturePayment = async (req, res) => {
  try {
    const { orderId } = req.body; // Use PayPal order ID

    // 🔹 Capture payment from PayPal
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    const capture = await paypalClient.execute(request);

    if (capture.result.status !== "COMPLETED") {
      return res.status(400).json({
        success: false,
        message: "Payment not completed",
      });
    }

    // 🔹 Find the order in the DB
    let order = await Order.findOne({ paymentId: orderId });
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found!" });
    }

    // 🔹 Update order details
    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.payerId = capture.result.payer.payer_id;
    order.orderUpdateDate = new Date();

    // 🔹 Reduce stock for each product
    for (let item of order.cartItems) {
      let product = await Product.findById(item.sku);
      if (product) {
        product.totalStock -= item.quantity;
        await product.save();
      }
    }

    // 🔹 Delete the cart after successful checkout
    await Cart.findByIdAndDelete(order.cartId);
    await order.save();

    res.status(200).json({
      success: true,
      message: "Payment successful & order confirmed",
      order: order,
    });
  } catch (error) {
    console.error("PayPal Capture Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Error capturing payment" });
  }
};

export const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

export const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};
