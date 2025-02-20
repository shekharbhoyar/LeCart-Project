import paypal from "@paypal/checkout-server-sdk";
import dotenv from "dotenv";

dotenv.config();

// Create a PayPal HTTP client instance
const paypalClient = new paypal.core.PayPalHttpClient(
  new paypal.core.SandboxEnvironment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
  )
);

export default paypalClient;
