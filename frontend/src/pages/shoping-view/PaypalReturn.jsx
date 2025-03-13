import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const PayPalReturn = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("token");

  useEffect(() => {
    if (orderId) {
      capturePayment(orderId);
    }
  }, [orderId]);

  const capturePayment = async (orderId) => {
    try {
      const response = await axios.post(
        "https://your-backend.com/api/orders/capturePayment",
        {
          orderId,
        }
      );

      if (response.data.success) {
        console.log("Payment captured successfully:", response.data);
        window.location.href = "/order-success"; // Redirect to order success page
      } else {
        console.error("Payment capture failed:", response.data.message);
      }
    } catch (error) {
      console.error("Error capturing payment:", error);
    }
  };

  return <div>Processing Payment...</div>;
};

export default PayPalReturn;
