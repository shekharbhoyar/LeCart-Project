import paypalClient from "../../helpers/paypal.js";
import checkoutNodeJssdk from "@paypal/checkout-server-sdk";
import Order from "../../models/Order.js";
import { getPayPalAccessToken } from "../../helpers/paypalclient.js";

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

    // 🔹 Fetch PayPal Access Token
    const paypalAccessToken = await getPayPalAccessToken();

    const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
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
        // return_url: "http://localhost:5173/shop/paypal-return",
        // cancel_url: "http://localhost:5173/shop/paypal-cancel",
      },
    });

    // 🔹 Execute request with the token
    const orderResponse = await paypalClient.execute(request, {
      headers: {
        Authorization: `Bearer ${paypalAccessToken}`, // ✅ Use token here
      },
    });

    const approvalURL = orderResponse.result.links.find(
      (link) => link.rel === "approve"
    ).href;

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
      paymentId: orderResponse.result.id,
      payerId: null,
    });

    await newlyCreatedOrder.save();

    res
      .status(201)
      .json({ success: true, approvalURL, orderId: newlyCreatedOrder._id });
  } catch (e) {
    console.error("Error creating PayPal order:", e);
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

    // ✅ Create a request to capture the PayPal payment
    const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    // ✅ Execute the request
    const captureResponse = await paypalClient.execute(request);

    if (!captureResponse || !captureResponse.result) {
      console.error(
        "Error: PayPal capture response is invalid",
        captureResponse
      );
      return res.status(500).json({
        success: false,
        message: "Invalid response from PayPal.",
      });
    }

    // ✅ Find order in your database
    const order = await Order.findOne({ paymentId: orderId });

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found." });
    }

    // ✅ Extract PayPal Payer ID safely
    const payerId = captureResponse.result.payer?.payer_id || "Unknown Payer";
    const captureStatus = captureResponse.result.status;

    if (captureStatus !== "COMPLETED") {
      return res.status(400).json({
        success: false,
        message: `Payment capture failed. Status: ${captureStatus}`,
        details: captureResponse.result,
      });
    }

    // ✅ Update Order in Database
    order.paymentStatus = "Paid";
    order.orderStatus = "Confirmed";
    order.payerId = payerId;
    order.orderUpdateDate = new Date();

    await order.save();

    // ✅ Return response
    res.status(200).json({
      success: true,
      message: "Payment captured successfully.",
      order,
    });
  } catch (error) {
    console.error("Error capturing PayPal payment:", error);

    res.status(500).json({
      success: false,
      message: "Error capturing payment.",
      error: error.message || error,
    });
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
