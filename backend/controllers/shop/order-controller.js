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
        return_url: "http://localhost:5173/shop/home",
        cancel_url: "http://localhost:5173/shop/home",
      },
    });

    const orderResponse = await paypalClient.execute(request);
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

    const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    const captureResponse = await paypalClient.execute(request);

    const order = await Order.findOne({ paymentId: orderId });

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found." });
    }

    order.paymentStatus = "Paid";
    order.orderStatus = "Confirmed";
    order.payerId = captureResponse.result.payer.payer_id;
    order.orderUpdateDate = new Date();

    await order.save();

    res.status(200).json({
      success: true,
      message: "Payment captured successfully.",
      order,
    });
  } catch (e) {
    console.error("Error capturing PayPal payment:", e);
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
