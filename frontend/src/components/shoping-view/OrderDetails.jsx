import { useSelector } from "react-redux";
import { Badge, DialogContent, Typography, Divider } from "@mui/material";

function ShoppingOrderDetailsView({ orderDetails }) {
  const { user } = useSelector((state) => state.auth);

  return (
    <DialogContent>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <div className="flex mt-6 items-center justify-between">
            <Typography variant="body1" fontWeight="medium">
              Order ID
            </Typography>
            <Typography>{orderDetails?._id}</Typography>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <Typography variant="body1" fontWeight="medium">
              Order Date
            </Typography>
            <Typography>{orderDetails?.orderDate.split("T")[0]}</Typography>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <Typography variant="body1" fontWeight="medium">
              Order Price
            </Typography>
            <Typography>${orderDetails?.totalAmount}</Typography>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <Typography variant="body1" fontWeight="medium">
              Payment method
            </Typography>
            <Typography>{orderDetails?.paymentMethod}</Typography>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <Typography variant="body1" fontWeight="medium">
              Payment Status
            </Typography>
            <Typography>{orderDetails?.paymentStatus}</Typography>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <Typography variant="body1" fontWeight="medium">
              Order Status
            </Typography>
            <Badge
              sx={{
                padding: "4px 12px",
                backgroundColor:
                  orderDetails?.orderStatus === "confirmed"
                    ? "green"
                    : orderDetails?.orderStatus === "rejected"
                    ? "red"
                    : "black",
                color: "white",
              }}
            >
              {orderDetails?.orderStatus}
            </Badge>
          </div>
        </div>
        <Divider />
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Typography variant="body1" fontWeight="medium">
              Order Details
            </Typography>
            <ul className="grid gap-3">
              {orderDetails?.cartItems && orderDetails?.cartItems.length > 0
                ? orderDetails?.cartItems.map((item) => (
                    <li
                      className="flex items-center justify-between"
                      key={item.title}
                    >
                      <Typography>Title: {item.title}</Typography>
                      <Typography>Quantity: {item.quantity}</Typography>
                      <Typography>Price: ${item.price}</Typography>
                    </li>
                  ))
                : null}
            </ul>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Typography variant="body1" fontWeight="medium">
              Shipping Info
            </Typography>
            <div className="grid gap-0.5 text-muted-foreground">
              <Typography>{user.userName}</Typography>
              <Typography>{orderDetails?.addressInfo?.address}</Typography>
              <Typography>{orderDetails?.addressInfo?.city}</Typography>
              <Typography>{orderDetails?.addressInfo?.pincode}</Typography>
              <Typography>{orderDetails?.addressInfo?.phone}</Typography>
              <Typography>{orderDetails?.addressInfo?.notes}</Typography>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}

export default ShoppingOrderDetailsView;
