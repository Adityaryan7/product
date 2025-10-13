import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux'; 
import productsReducer from '../reducers/productsReducer';
import favoritesReducer from '../reducers/favoritesReducer';
import filtersReducer from '../reducers/filtersReducer';
import cartReducer from '../reducers/cartReducer';


const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['cart', 'favorites', 'products'], 
};


const rootReducer = combineReducers({
  products: productsReducer,
  filters: filtersReducer,
  cart: cartReducer,
  favorites: favoritesReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);


export const store = configureStore({
  reducer: persistedReducer, 
});


export const persistor = persistStore(store);
