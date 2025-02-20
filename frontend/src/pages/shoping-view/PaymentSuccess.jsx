import {
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Typography,
  Button,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function PaymentSuccessPage() {
  const navigate = useNavigate();

  return (
    <Card className="p-10">
      <CardHeader className="p-0">
        <Typography variant="h4">Payment is successful!</Typography>
      </CardHeader>
      <CardActions>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/shop/account")}
        >
          View Orders
        </Button>
      </CardActions>
    </Card>
  );
}

export default PaymentSuccessPage;
