import axios from "axios";

const PAYPAL_API_URL = "https://api-m.sandbox.paypal.com"; // Use live URL for production

export const getPayPalAccessToken = async () => {
  try {
    const auth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
    ).toString("base64");

    const response = await axios.post(
      `${PAYPAL_API_URL}/v1/oauth2/token`,
      "grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (!response.data.access_token) {
      throw new Error("Failed to retrieve PayPal access token.");
    }

    return response.data.access_token;
  } catch (error) {
    console.error(
      "Error fetching PayPal token:",
      error.response?.data || error.message
    );
    throw error;
  }
};
