import fetch from "node-fetch";

const PAYPAL_API_URL = "https://api-m.sandbox.paypal.com"; // Use live URL for production

export const getPayPalAccessToken = async () => {
  try {
    const auth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
    ).toString("base64");

    const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    const data = await response.json();
    if (!data.access_token) throw new Error("Failed to retrieve PayPal access token.");

    return data.access_token;
  } catch (error) {
    console.error("Error fetching PayPal token:", error);
    throw error;
  }
};
