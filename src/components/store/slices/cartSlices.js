import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const cartSlice = createSlice({
  name: "cart",

  initialState: {
    items: [],
    totalAmount: 0,
  },
  reducers: {
    addToCart: (state, action) => {
      console.log(action.payload);
      const product = action.payload;
      const selectedQuantity = product.quantity ?? 1;
      const item = state.items.find((item) => item.id === product.id);
      if (item) {
        if (product.stock < item.quantity + selectedQuantity) {
          toast.error("quantity exceeds stock");
          return;
        }
        item.quantity += selectedQuantity;
      } else {
        if (selectedQuantity >product.stock){
          toast.error("quantity exceeds stock");
          return;
        }
        state.items.push({...product, quantity: selectedQuantity})
      }
      toast.success("Successfully added to cart");
      localStorage.setItem("items", JSON.stringify(state.items));
      cartSlice.caseReducers.calcTotalAmount(state);
    },
    removeFromCart: (state, action) => {
      const product = action.payload;
      state.items =state.items.filter((item) => item.id !== product.id);
      toast.success("Successfully Removed item");
      localStorage.setItem("items", JSON.stringify(state.items));
      cartSlice.caseReducers.calcTotalAmount(state);
    },

    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      localStorage.removeItem("items");
      cartSlice.caseReducers.calcTotalAmount(state);
    },

    calcTotalAmount: (state) => {
      state.totalAmount = state.items.reduce(
        (sum, item) => sum + (item.price * item.quantity),
        0,
      );
      localStorage.setItem("items", JSON.stringify(state.items));
    },

    increaseQuantity: (state, action) => {
      const product = action.payload;
      const item = state.items.find((item) => item.id === product.id);

      if(!item) return;

      if (product.stock <= item.quantity) {
        toast.error("Maximum stock reached");
        return;
      }
      item.quantity += 1;
      localStorage.setItem("items", JSON.stringify(state.items));
      cartSlice.caseReducers.calcTotalAmount(state);
    },
    decreaseQuantity: (state, action) => {
      const product = action.payload;
      const item = state.items.find((item) => item.id === product.id);
      if (item.quantity === 1) {
        return;
      }

      item.quantity -= 1;
      localStorage.setItem("items", JSON.stringify(state.items));
      cartSlice.caseReducers.calcTotalAmount(state);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  clearCart,
  calcTotalAmount,
  decreaseQuantity,
  increaseQuantity,
} = cartSlice.actions;
export default cartSlice.reducer;
