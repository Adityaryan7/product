import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [], 
    loading: false,
  },
  reducers: {
    addToCartStart: (state) => {
      state.loading = true;
    },
    addToCartSuccess: (state, action) => {
      const existingItem = state.items.find(item => item.product.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ product: action.payload, quantity: 1 });
      }
      state.loading = false;
    },
    removeFromCartStart: (state) => {
      state.loading = true;
    },
    removeFromCartSuccess: (state, action) => {
      state.items = state.items.filter(item => item.product.id !== action.payload.id);
      state.loading = false;
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find(item => item.product.id === productId);
      if (item) {
        item.quantity = quantity;
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  addToCartStart,
  addToCartSuccess,
  removeFromCartStart,
  removeFromCartSuccess,
  updateQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;