import React from "react";
import { render, screen, act, waitFor } from "@testing-library/react";
import { Provider } from "react-redux"; // fixed
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "../reducers/productsReducer";
import filtersReducer, {
  setSearchTerm,
  setCategory,
  setSortBy,
} from "../reducers/filtersReducer";
import favoritesReducer from "../reducers/favoritesReducer";
import cartReducer from "../reducers/cartReducer";
import ProductList from "../components/productList";

const createStore = (preloadedState) =>
  configureStore({
    reducer: {
      products: productsReducer,
      filters: filtersReducer,
      favorites: favoritesReducer,
      cart: cartReducer,
    },
    preloadedState,
  });

test("search, filter, sort, and favorite flow", async () => {
  const preloadedState = {
    products: {
      items: [
        {
          id: 1,
          title: "Red Shirt",
          category: "men's clothing",
          price: 10,
          image: "",
        },
        {
          id: 2,
          title: "Blue Ring",
          category: "jewelery",
          price: 100,
          image: "",
        },
      ],
      status: "succeeded",
      error: null,
    },
    filters: {
      searchTerm: "",
      category: "all",
      sortBy: "none",
      priceRange: { min: 0, max: 1000 },
    },
    favorites: { items: [], loading: false },
    cart: { items: [], loading: false },
  };
  const store = createStore(preloadedState);

  render(
    <Provider store={store}>
      <BrowserRouter>
        <ProductList />
      </BrowserRouter>
    </Provider>
  );

  // Search
  await act(async () => {
    store.dispatch(setSearchTerm("red"));
  });
  expect(screen.getByText(/red shirt/i)).toBeInTheDocument();

  // Category filter
  await act(async () => {
    store.dispatch(setCategory("jewelery"));
  });
  await waitFor(() =>
    expect(screen.queryByText(/red shirt/i)).not.toBeInTheDocument()
  );
  expect(screen.getByText(/blue ring/i)).toBeInTheDocument();

  // Sort
  await act(async () => {
    store.dispatch(setCategory("all"));
    store.dispatch(setSortBy("price-desc"));
  });

  // Favorite via reducer dispatch
  expect(store.getState().favorites.items).toHaveLength(0);
  await act(async () => {
    store.dispatch({
      type: "favorites/addToFavoritesSuccess",
      payload: { id: 2, title: "Blue Ring" },
    });
  });
  expect(store.getState().favorites.items).toHaveLength(1);
});
