import { createSlice } from "@reduxjs/toolkit";

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: {
    items: [],
    loading: false,
  },
  reducers: {
    addToFavoritesStart: (state) => {
      state.loading = true;
    },
    addToFavoritesSuccess: (state, action) => {
      const product = action.payload;
      const exists = state.items.some((item) => item.id === product.id);
      if (!exists) {
        state.items.push(product);
      }
      state.loading = false;
    },
    removeFromFavoritesStart: (state) => {
      state.loading = true;
    },
    removeFromFavoritesSuccess: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload.id);
      state.loading = false;
    },
    setFavoritesLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const {
  addToFavoritesStart,
  addToFavoritesSuccess,
  removeFromFavoritesStart,
  removeFromFavoritesSuccess,
  setFavoritesLoading,
} = favoritesSlice.actions;
export default favoritesSlice.reducer;
