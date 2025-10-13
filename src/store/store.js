import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../reducers/productsReducer';
import favoritesReducer from '../reducers/favoritesReducer';
import filtersReducer from '../reducers/filtersReducer';
import cartReducer from '../reducers/cartReducer';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    favorites: favoritesReducer,
    filters: filtersReducer,
    cart: cartReducer,
  },
});