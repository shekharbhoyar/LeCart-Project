import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { capturePayment } from "../../store/shop/orderSlice";

const PayPalReturn = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("token");

  const dispatch = useDispatch();
  const { loading, success, error } = useSelector((state) => state.order);

  useEffect(() => {
    if (orderId) {
      dispatch(capturePayment({ orderId })).then((data) => {
        if (data.payload?.success) {
          window.location.href = "/order-success"; // Redirect to success page
        }
      });
    }
  }, [orderId, dispatch]);

  return (
    <div>
      {loading ? <p>Processing Payment...</p> : null}
      {error ? <p style={{ color: "red" }}>Payment failed: {error}</p> : null}
    </div>
  );
};

export default PayPalReturn;

