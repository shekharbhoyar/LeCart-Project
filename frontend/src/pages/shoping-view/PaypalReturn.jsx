import { Card, CardHeader, CardContent, Typography } from "@mui/material";
import { capturePayment } from "../../store/shop/orderSlice/index";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

function PaypalReturnPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const paymentId = params.get("paymentId");
  const payerId = params.get("PayerID");

  useEffect(() => {
    if (paymentId && payerId) {
      const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));

      dispatch(capturePayment({ paymentId, payerId, orderId })).then((data) => {
        if (data?.payload?.success) {
          sessionStorage.removeItem("currentOrderId");
          window.location.href = "/shop/payment-success";
        }
      });
    }
  }, [paymentId, payerId, dispatch]);

  return (
    <Card sx={{ p: 3 }}>
      <CardHeader title="Processing Payment..." />
      <CardContent>
        <Typography variant="body1">
          Please wait while we process your payment.
        </Typography>
      </CardContent>
    </Card>
  );
}

export default PaypalReturnPage;
