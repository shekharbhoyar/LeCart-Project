import checkoutNodeJssdk from "@paypal/checkout-server-sdk";
import dotenv from "dotenv";

dotenv.config();

// Create a PayPal HTTP client instance
const paypalClient = new checkoutNodeJssdk.core.PayPalHttpClient(
  new checkoutNodeJssdk.core.SandboxEnvironment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
  )
);

export default paypalClient;

// import checkoutNodeJssdk from "@paypal/checkout-server-sdk";

// const environment = new checkoutNodeJssdk.core.SandboxEnvironment(
//   process.env.PAYPAL_CLIENT_ID,
//   process.env.PAYPAL_SECRET
// );

// const paypalClient = new checkoutNodeJssdk.core.PayPalHttpClient(environment);

// export default paypalClient;
