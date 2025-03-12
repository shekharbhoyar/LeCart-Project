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
    if (paymentId && payerId) {
      const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));

      dispatch(capturePayment({ paymentId, payerId, orderId }))
        .then((data) => {
          if (data?.payload?.success) {
            sessionStorage.removeItem("currentOrderId");
            navigate("/shop/payment-success");
          } else {
            setError("Payment failed. Try again.");
            setLoading(false);
          }
        })
        .catch(() => {
          setError("An error occurred. Try again.");
          setLoading(false);
        });
    } else {
      setError("Invalid PayPal response.");
      setLoading(false);
    }
  }, [paymentId, payerId, dispatch, navigate]);

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{error}</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {loading ? "Processing Payment...Please wait!" : "Redirecting..."}
        </CardTitle>
      </CardHeader>
    </Card>
  );
}

export default PaypalReturnPage;
