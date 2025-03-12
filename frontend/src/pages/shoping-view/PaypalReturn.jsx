import { Card, CardHeader, CardTitle } from "../../components/ui/card";
import { capturePayment } from "../../store/shop/orderSlice/index";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

function PaypalReturnPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const paymentId = params.get("paymentId");
  const payerId = params.get("PayerID");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Redirected to PayPal Return Page");
    console.log("Payment ID:", paymentId, "Payer ID:", payerId);

    if (paymentId && payerId) {
      const orderId = sessionStorage.getItem("currentOrderId")
        ? JSON.parse(sessionStorage.getItem("currentOrderId"))
        : null;

      if (!orderId) {
        setError("Order information is missing. Payment cannot be processed.");
        setLoading(false);
        return;
      }

      console.log("Captured Order ID:", orderId);

      dispatch(capturePayment({ paymentId, payerId, orderId }))
        .then((data) => {
          console.log("Capture Payment Response:", data);

          if (data?.payload?.success) {
            sessionStorage.removeItem("currentOrderId");
            navigate("/shop/payment-success");
          } else {
            setError("Payment failed. Please try again.");
            setLoading(false);
          }
        })
        .catch((err) => {
          console.error("Payment capture error:", err);
          setError("An error occurred while processing payment.");
          setLoading(false);
        });
    } else {
      setError("Invalid PayPal response. Missing parameters.");
      setLoading(false);
    }
  }, [paymentId, payerId, dispatch, navigate]);

  return (
    <Card className="p-6 text-center">
      <CardHeader>
        <CardTitle className="text-lg">
          {loading
            ? "Processing Payment... Please wait!"
            : error || "Redirecting..."}
        </CardTitle>
      </CardHeader>
    </Card>
  );
}

export default PaypalReturnPage;
