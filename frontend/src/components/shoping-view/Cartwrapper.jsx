import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import UserCartItemsContent from "./AddressCard";

function UserCartWrapper({ cartItems, setOpenCartSheet }) {
  const navigate = useNavigate();

  const totalCartAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  return (
    <Drawer anchor="right" open={true} onClose={() => setOpenCartSheet(false)}>
      <Box sx={{ width: 300, p: 2 }}>
        <Typography variant="h6">Your Cart</Typography>
        <Box sx={{ mt: 2 }}>
          {cartItems && cartItems.length > 0
            ? cartItems.map((item) => <UserCartItemsContent cartItem={item} />)
            : null}
        </Box>
        <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
          <Typography variant="body1" fontWeight="bold">
            Total
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            ${totalCartAmount}
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => {
            navigate("/shop/checkout");
            setOpenCartSheet(false);
          }}
        >
          Checkout
        </Button>
      </Box>
    </Drawer>
  );
}

export default UserCartWrapper;
