import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import adminProductsSlice from "./admin/productsSlice/index";
import adminOrderSlice from "./admin/orderSlice/index";

import shopProductsSlice from "./shop/productsSlice/index";
import shopCartSlice from "./shop/cartSlice/index";
import shopAddressSlice from "./shop/addressSlice/index";
import shopOrderSlice from "./shop/orderSlice/index";
import shopSearchSlice from "./shop/searchSlice/index";
import shopReviewSlice from "./shop/reviweSlice/index";
import commonFeatureSlice from "./commonSlice/index";

const store = configureStore({
  reducer: {
    auth: authReducer,

    adminProducts: adminProductsSlice,
    adminOrder: adminOrderSlice,

    shopProducts: shopProductsSlice,
    shopCart: shopCartSlice,
    shopAddress: shopAddressSlice,
    shopOrder: shopOrderSlice,
    shopSearch: shopSearchSlice,
    shopReview: shopReviewSlice,

    commonFeature: commonFeatureSlice,
  },
});

export default store;
