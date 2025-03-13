import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const validatePayPalToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Unauthorized: No PayPal token provided",
        });
    }

    const token = authHeader.split(" ")[1]; // Extract token from "Bearer <token>"

    // Verify token with PayPal
    const response = await axios.post(
      "https://api-m.sandbox.paypal.com/v1/identity/oauth2/tokeninfo",
      `access_token=${token}`,
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    if (
      !response.data ||
      !response.data.scope.includes("https://api.paypal.com/v1/payments/*")
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid PayPal token" });
    }

    next(); // ✅ Token is valid, proceed to the next middleware/controller
  } catch (error) {
    console.error("PayPal token validation error:", error);
    res
      .status(403)
      .json({ success: false, message: "Failed to validate PayPal token" });
  }
};
