import axios from "axios";

const CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_API = "https://api-m.sandbox.paypal.com"; // Use "https://api-m.paypal.com" for live

export async function getAccessToken() {
    try {
        const response = await axios.post(
            `${PAYPAL_API}/v1/oauth2/token`,
            "grant_type=client_credentials",
            {
                headers: {
                    "Authorization": "Basic " + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64"),
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );

        return response.data.access_token;
    } catch (error) {
        console.error("Failed to fetch PayPal access token:", error.response?.data || error.message);
        throw new Error("Failed to fetch PayPal access token");
    }
}
