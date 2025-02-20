import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from "@mui/material";
import ShoppingOrderDetailsView from "./OrderDetails";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersByUserId,
  getOrderDetails,
  resetOrderDetails,
} from "../../store/shop/orderSlice/index";

function ShoppingOrders() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orderList, orderDetails } = useSelector((state) => state.shopOrder);

  useEffect(() => {
    if (user?.id) {
      dispatch(getAllOrdersByUserId(user.id));
    }
  }, [dispatch, user?.id]);

  useEffect(() => {
    if (orderDetails) setOpenDetailsDialog(true);
  }, [orderDetails]);

  function handleFetchOrderDetails(orderId) {
    setSelectedOrder(orderId);
    dispatch(getOrderDetails(orderId));
  }

  function handleCloseDialog() {
    setOpenDetailsDialog(false);
    setSelectedOrder(null);
    dispatch(resetOrderDetails());
  }

  return (
    <Card component={Paper} elevation={3}>
      <CardHeader title={<Typography variant="h6">Order History</Typography>} />
      <CardContent>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Order Date</TableCell>
                <TableCell>Order Status</TableCell>
                <TableCell>Order Price</TableCell>
                <TableCell>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orderList?.length > 0 ? (
                orderList.map((orderItem) => (
                  <TableRow key={orderItem._id}>
                    <TableCell>{orderItem._id}</TableCell>
                    <TableCell>{orderItem.orderDate.split("T")[0]}</TableCell>
                    <TableCell>
                      <Chip
                        label={orderItem.orderStatus}
                        sx={{
                          backgroundColor:
                            orderItem.orderStatus === "confirmed"
                              ? "green"
                              : orderItem.orderStatus === "rejected"
                              ? "red"
                              : "black",
                          color: "white",
                        }}
                      />
                    </TableCell>
                    <TableCell>${orderItem.totalAmount}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleFetchOrderDetails(orderItem._id)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No Orders Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>

      {/* Order Details Dialog */}
      <Dialog open={openDetailsDialog} onClose={handleCloseDialog}>
        <DialogTitle>Order Details</DialogTitle>
        <DialogContent>
          {orderDetails ? (
            <ShoppingOrderDetailsView orderDetails={orderDetails} />
          ) : (
            <Typography>Loading...</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}

export default ShoppingOrders;
