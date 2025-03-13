import paypalClient from "../../helpers/paypal.js";
import checkoutNodeJssdk from "@paypal/checkout-server-sdk";
import Order from "../../models/Order.js";

export const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      cartId,
    } = req.body;

    if (!addressInfo?.zipCode) {
      return res.status(400).json({
        success: false,
        message: "Postal code is required for shipping.",
      });
    }

    // Get PayPal access token
    const accessToken = await getAccessToken();

    // Create order via PayPal API
    const { data } = await axios.post(
      "https://api-m.sandbox.paypal.com/v2/checkout/orders",
      {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: totalAmount.toFixed(2),
              breakdown: {
                item_total: {
                  currency_code: "USD",
                  value: totalAmount.toFixed(2),
                },
              },
            },
            items: cartItems.map((item) => ({
              name: item.title,
              sku: item.productId,
              unit_amount: {
                currency_code: "USD",
                value: item.price.toFixed(2),
              },
              quantity: item.quantity,
            })),
            shipping: {
              address: {
                address_line_1: addressInfo.addressLine1,
                admin_area_2: addressInfo.city,
                admin_area_1: addressInfo.state,
                postal_code: addressInfo.zipCode,
                country_code: addressInfo.countryCode,
              },
            },
          },
        ],
        application_context: {
          brand_name: "YourShop",
          landing_page: "BILLING",
          user_action: "PAY_NOW",
          return_url: "https://lecart-front.onrender.com/shop/paypal-return",
          cancel_url: "https://lecart-front.onrender.com/shop/paypal-cancel",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Extract approval URL
    const approvalURL = data.links.find((link) => link.rel === "approve").href;

    // Save order to database
    const newlyCreatedOrder = new Order({
      userId,
      cartId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId: data.id, // PayPal order ID
      payerId: null,
    });

    await newlyCreatedOrder.save();

    res
      .status(201)
      .json({ success: true, approvalURL, orderId: newlyCreatedOrder._id });
  } catch (e) {
    console.error(
      "Error creating PayPal order:",
      e.response?.data || e.message
    );
    res
      .status(500)
      .json({ success: false, message: "Error processing payment." });
  }
};

export const capturePayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res
        .status(400)
        .json({ success: false, message: "Order ID is required." });
    }

    // Get PayPal access token
    const accessToken = await getAccessToken();

    // Capture payment via PayPal API
    const { data } = await axios.post(
      `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const order = await Order.findOne({ paymentId: orderId });

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found." });
    }

    order.paymentStatus = "Paid";
    order.orderStatus = "Confirmed";
    order.payerId = data.payer.payer_id;
    order.orderUpdateDate = new Date();

    await order.save();

    res.status(200).json({
      success: true,
      message: "Payment captured successfully.",
      order,
    });
  } catch (e) {
    console.error(
      "Error capturing PayPal payment:",
      e.response?.data || e.message
    );
    res
      .status(500)
      .json({ success: false, message: "Error capturing payment." });
  }
};

export const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId });

    if (!orders.length) {
      return res
        .status(404)
        .json({ success: false, message: "No orders found." });
    }

    res.status(200).json({ success: true, data: orders });
  } catch (e) {
    console.error("Error fetching user orders:", e);
    res
      .status(500)
      .json({ success: false, message: "Error retrieving orders." });
  }
};

export const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found." });
    }

    res.status(200).json({ success: true, data: order });
  } catch (e) {
    console.error("Error fetching order details:", e);
    res
      .status(500)
      .json({ success: false, message: "Error retrieving order details." });
  }
};
