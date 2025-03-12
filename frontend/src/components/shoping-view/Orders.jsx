// import { useEffect, useState } from "react";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   Typography,
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Chip,
// } from "@mui/material";
// import ShoppingOrderDetailsView from "./OrderDetails";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   getAllOrdersByUserId,
//   getOrderDetails,
//   resetOrderDetails,
// } from "../../store/shop/orderSlice/index";

// function ShoppingOrders() {
//   const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
//   const dispatch = useDispatch();
//   const { user } = useSelector((state) => state.auth);
//   const { orderList, orderDetails } = useSelector((state) => state.shopOrder);

//   function handleFetchOrderDetails(getId) {
//     dispatch(getOrderDetails(getId));
//   }

//   useEffect(() => {
//     dispatch(getAllOrdersByUserId(user?.id));
//   }, [dispatch]);

//   useEffect(() => {
//     if (orderDetails !== null) setOpenDetailsDialog(true);
//   }, [orderDetails]);

//   return (
//     <Card component={Paper} elevation={3}>
//       <CardHeader title={<Typography variant="h6">Order History</Typography>} />
//       <CardContent>
//         <TableContainer component={Paper}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Order ID</TableCell>
//                 <TableCell>Order Date</TableCell>
//                 <TableCell>Order Status</TableCell>
//                 <TableCell>Order Price</TableCell>
//                 <TableCell>Details</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {orderList && orderList.length > 0
//                 ? orderList.map((orderItem) => (
//                     <TableRow key={orderItem?._id}>
//                       <TableCell>{orderItem?._id}</TableCell>
//                       <TableCell>
//                         {orderItem?.orderDate.split("T")[0]}
//                       </TableCell>
//                       <TableCell>
//                         <Chip
//                           label={orderItem?.orderStatus}
//                           sx={{
//                             backgroundColor:
//                               orderItem?.orderStatus === "confirmed"
//                                 ? "green"
//                                 : orderItem?.orderStatus === "rejected"
//                                 ? "red"
//                                 : "black",
//                             color: "white",
//                           }}
//                         />
//                       </TableCell>
//                       <TableCell>${orderItem?.totalAmount}</TableCell>
//                       <TableCell>
//                         <Button
//                           variant="contained"
//                           color="primary"
//                           onClick={() =>
//                             handleFetchOrderDetails(orderItem?._id)
//                           }
//                         >
//                           View Details
//                         </Button>
//                         <Dialog
//                           open={openDetailsDialog}
//                           onClose={() => {
//                             setOpenDetailsDialog(false);
//                             dispatch(resetOrderDetails());
//                           }}
//                         >
//                           <DialogTitle>Order Details</DialogTitle>
//                           <DialogContent>
//                             <ShoppingOrderDetailsView
//                               orderDetails={orderDetails}
//                             />
//                           </DialogContent>
//                           <DialogActions>
//                             <Button
//                               onClick={() => setOpenDetailsDialog(false)}
//                               color="primary"
//                             >
//                               Close
//                             </Button>
//                           </DialogActions>
//                         </Dialog>
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 : null}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </CardContent>
//     </Card>
//   );
// }

// export default ShoppingOrders;

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersByUserId,
  getOrderDetails,
  resetOrderDetails,
} from "../../store/shop/orderSlice/index";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import ShoppingOrderDetailsView from "./OrderDetails";

function ShoppingOrders() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orderList, orderDetails } = useSelector((state) => state.shopOrder);

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetails(getId));
    setSelectedOrder(getId);
    setOpenDetailsDialog(true);
  }

  useEffect(() => {
    dispatch(getAllOrdersByUserId(user?.id));
  }, [dispatch, user?.id]);

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold">Order History</h2>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Order Price</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderList && orderList.length > 0
              ? orderList.map((orderItem) => (
                  <TableRow key={orderItem?._id}>
                    <TableCell>{orderItem?._id}</TableCell>
                    <TableCell>{orderItem?.orderDate.split("T")[0]}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          orderItem?.orderStatus === "confirmed"
                            ? "success"
                            : orderItem?.orderStatus === "rejected"
                            ? "destructive"
                            : "default"
                        }
                      >
                        {orderItem?.orderStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>${orderItem?.totalAmount}</TableCell>
                    <TableCell>
                      <Dialog
                        open={openDetailsDialog}
                        onOpenChange={setOpenDetailsDialog}
                      >
                        <DialogTrigger asChild>
                          <Button
                            onClick={() =>
                              handleFetchOrderDetails(orderItem?._id)
                            }
                          >
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Order Details</DialogTitle>
                          </DialogHeader>
                          <DialogContent>
                            {orderDetails ? (
                              <ShoppingOrderDetailsView
                                orderDetails={orderDetails}
                              />
                            ) : (
                              <p>Loading...</p>
                            )}
                          </DialogContent>
                          <DialogFooter>
                            <Button onClick={() => setOpenDetailsDialog(false)}>
                              Close
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              : null}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default ShoppingOrders;
