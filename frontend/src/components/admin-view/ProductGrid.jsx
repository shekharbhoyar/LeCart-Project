import { Card, CardContent, CardActions, Button, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledCard = styled(Card)({
  maxWidth: 400,
  margin: "auto",
  borderRadius: 8,
});

const ProductImage = styled("img")({
  width: "100%",
  height: 300,
  objectFit: "cover",
  borderTopLeftRadius: 8,
  borderTopRightRadius: 8,
});

function AdminProductTile({
  product,
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  handleDelete,
}) {
  return (
    <StyledCard>
      <ProductImage src={product?.image} alt={product?.title} />
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {product?.title}
        </Typography>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography
            variant="body1"
            color="primary"
            style={{ textDecoration: product?.salePrice > 0 ? "line-through" : "none" }}
          >
            ${product?.price}
          </Typography>
          {product?.salePrice > 0 && (
            <Typography variant="body1" fontWeight="bold">
              ${product?.salePrice}
            </Typography>
          )}
        </div>
      </CardContent>
      <CardActions style={{ display: "flex", justifyContent: "space-between" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setOpenCreateProductsDialog(true);
            setCurrentEditedId(product?._id);
            setFormData(product);
          }}
        >
          Edit
        </Button>
        <Button variant="contained" color="secondary" onClick={() => handleDelete(product?._id)}>
          Delete
        </Button>
      </CardActions>
    </StyledCard>
  );
}

export default AdminProductTile;
