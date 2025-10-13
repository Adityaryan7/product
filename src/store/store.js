import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // localStorage for web
import { combineReducers } from 'redux'; // Import combineReducers from redux
import productsReducer from '../reducers/productsReducer';
import favoritesReducer from '../reducers/favoritesReducer';
import filtersReducer from '../reducers/filtersReducer';
import cartReducer from '../reducers/cartReducer';

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['cart', 'favorites'], // Only persist the cart and favorites slices
};

// Combine reducers
const rootReducer = combineReducers({
  products: productsReducer,
  filters: filtersReducer,
  cart: cartReducer,
  favorites: favoritesReducer,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with persisted reducer
export const store = configureStore({
  reducer: persistedReducer, // Pass the persisted reducer here
});

// Create persistor
export const persistor = persistStore(store);
