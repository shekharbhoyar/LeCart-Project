import { Button, Card, CardContent, CardActions, Typography } from "@mui/material";

function AddressCard({
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
  setCurrentSelectedAddress,
  selectedId,
}) {
  return (
    <Card
      onClick={
        setCurrentSelectedAddress
          ? () => setCurrentSelectedAddress(addressInfo)
          : null
      }
      sx={{
        cursor: "pointer",
        border: selectedId?._id === addressInfo?._id ? "4px solid red" : "1px solid black",
      }}
    >
      <CardContent>
        <Typography variant="body1">Address: {addressInfo?.address}</Typography>
        <Typography variant="body1">City: {addressInfo?.city}</Typography>
        <Typography variant="body1">Pincode: {addressInfo?.pincode}</Typography>
        <Typography variant="body1">Phone: {addressInfo?.phone}</Typography>
        <Typography variant="body1">Notes: {addressInfo?.notes}</Typography>
      </CardContent>
      <CardActions>
        <Button variant="contained" color="primary" onClick={() => handleEditAddress(addressInfo)}>
          Edit
        </Button>
        <Button variant="contained" color="secondary" onClick={() => handleDeleteAddress(addressInfo)}>
          Delete
        </Button>
      </CardActions>
    </Card>
  );
}

export default AddressCard;
