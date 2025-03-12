import ProductDetailsDialog from "../../components/shoping-view/ProductDetails";
import ShoppingProductTile from "../../components/shoping-view/ProductGrid";
import { Input } from "../../components/ui/input";
import { toast } from "sonner";
import { addToCart, fetchCartItems } from "../../store/shop/cartSlice/index";
import { fetchProductDetails } from "../../store/shop/productsSlice/index";
import {
  getSearchResults,
  resetSearchResults,
} from "../../store/shop/searchSlice/index";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

function SearchProducts() {
  const [keyword, setKeyword] = useState("");
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const dispatch = useDispatch();
  const { searchResults } = useSelector((state) => state.shopSearch);
  const { productDetails } = useSelector((state) => state.shopProducts);
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);

  useEffect(() => {
    if (keyword.trim().length > 3) {
      console.log("Fetching search results for:", keyword);
      setSearchParams(new URLSearchParams({ keyword }));

      dispatch(getSearchResults(keyword))
        .then((response) => {
          console.log("Search API Response:", response.payload);
        })
        .catch((error) => {
          console.error("Search API Error:", error);
        });
    } else {
      setSearchParams(new URLSearchParams({ keyword: "" }));
      dispatch(resetSearchResults());
    }
  }, [keyword, dispatch, setSearchParams]);

  function handleAddtoCart(getCurrentProductId, getTotalStock) {
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast.error(
            `Only ${getQuantity} quantity can be added for this item`
          );
          return;
        }
      }
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast.success("Product is added to cart");
      }
    });
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  console.log("Current Search Results:", searchResults);

  return (
    <div className="container mx-auto md:px-6 px-4 py-8">
      <div className="flex justify-center mb-8">
        <div className="w-full flex items-center">
          <Input
            value={keyword}
            name="keyword"
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Search Products..."
          />
        </div>
      </div>
      {!searchResults || searchResults.length === 0 ? (
        <h1 className="text-5xl font-extrabold">No result found!</h1>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {searchResults.map((item) => (
            <ShoppingProductTile
              key={item.id} // Ensure React can track items correctly
              handleAddtoCart={handleAddtoCart}
              product={item}
              handleGetProductDetails={handleGetProductDetails}
            />
          ))}
        </div>
      )}
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default SearchProducts;
