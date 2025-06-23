import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

const getItemId = (item) => item._id || item.id;
const initialState = {
  cart: localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : [],
  total: localStorage.getItem("total")
    ? JSON.parse(localStorage.getItem("total"))
    : 0,
  totalItems: localStorage.getItem("totalItems")
    ? JSON.parse(localStorage.getItem("totalItems"))
    : 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const itemId = getItemId(item);
      const alreadyInCart = state.cart.some((i) => getItemId(i) === itemId);
      if (alreadyInCart) {
        toast.error("Item already in cart");
        return;
      }
      state.cart.push(item);
      state.totalItems++;
      state.total += item.price;
      state.total = parseFloat(state.total.toFixed(2));
      localStorage.setItem("cart", JSON.stringify(state.cart));
      localStorage.setItem("total", JSON.stringify(state.total));
      localStorage.setItem("totalItems", JSON.stringify(state.totalItems));
      toast.success("Item added to cart");
    },

    removeFromCart: (state, action) => {
      const itemId = action.payload;
      const index = state.cart.findIndex((i) => getItemId(i) === itemId);
      if (index >= 0) {
        state.totalItems--;
        state.total -= state.cart[index].price;
        state.total = parseFloat(state.total.toFixed(2));
        state.cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(state.cart));
        localStorage.setItem("total", JSON.stringify(state.total));
        localStorage.setItem("totalItems", JSON.stringify(state.totalItems));
        toast.success("Item removed from cart");
      }
    },
    resetCart: (state) => {
      state.cart = [];
      state.total = 0;
      state.totalItems = 0;
      localStorage.removeItem("cart");
      localStorage.removeItem("total");
      localStorage.removeItem("totalItems");
    },
  },
});

export const { addToCart, removeFromCart, resetCart } = cartSlice.actions;
export default cartSlice.reducer;
