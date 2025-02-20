import {
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Typography,
  Button,
  Chip,
} from "@mui/material";
import { brandOptionsMap, categoryOptionsMap } from "../../config/index";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
}) {
  return (
    <Card className="w-full max-w-sm mx-auto">
      <div onClick={() => handleGetProductDetails(product?._id)}>
        <div className="relative">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[300px] object-cover rounded-t-lg"
          />
          {product?.totalStock === 0 ? (
            <Chip
              label="Out Of Stock"
              color="error"
              className="absolute top-2 left-2"
            />
          ) : product?.totalStock < 10 ? (
            <Chip
              label={`Only ${product?.totalStock} items left`}
              color="error"
              className="absolute top-2 left-2"
            />
          ) : product?.salePrice > 0 ? (
            <Chip
              label="Sale"
              color="error"
              className="absolute top-2 left-2"
            />
          ) : null}
        </div>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {product?.title}
          </Typography>
          <div className="flex justify-between items-center mb-2">
            <Typography variant="body2" color="textSecondary">
              {categoryOptionsMap[product?.category]}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {brandOptionsMap[product?.brand]}
            </Typography>
          </div>
          <div className="flex justify-between items-center mb-2">
            <Typography
              variant="h6"
              color="primary"
              className={product?.salePrice > 0 ? "line-through" : ""}
            >
              ${product?.price}
            </Typography>
            {product?.salePrice > 0 && (
              <Typography variant="h6" color="primary">
                ${product?.salePrice}
              </Typography>
            )}
          </div>
        </CardContent>
      </div>
      <CardActions>
        {product?.totalStock === 0 ? (
          <Button variant="contained" fullWidth disabled>
            Out Of Stock
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => handleAddtoCart(product?._id, product?.totalStock)}
          >
            Add to cart
          </Button>
        )}
      </CardActions>
    </Card>
  );
}

export default ShoppingProductTile;
