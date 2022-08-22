import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./features/cartSlice";
import restaurantReducer from "./features/restaurantSlice";
import userReducer from "./features/userSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    restaurant: restaurantReducer,
    user: userReducer,
  },
});
