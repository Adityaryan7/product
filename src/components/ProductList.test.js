// favorites.test.js
import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import ProductList from "./productList";
import productsReducer from "../reducers/productsReducer";
import filtersReducer from "../reducers/filtersReducer";
import favoritesReducer from "../reducers/favoritesReducer";
import cartReducer from "../reducers/cartReducer";

const createMockStore = (initialState) =>
  configureStore({
    reducer: {
      products: productsReducer,
      filters: filtersReducer,
      favorites: favoritesReducer,
      cart: cartReducer,
    },
    preloadedState: initialState,
  });

const renderWithProviders = (component, initialState) => {
  const store = createMockStore(initialState);
  return render(
    <Provider store={store}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>
  );
};

test("renders Product List component", () => {
  const initialState = {
    products: {
      items: [
        {
          id: 1,
          title: "Sample Product List Item",
          price: 29.99,
          image: "test.jpg",
        },
      ],
      status: "succeeded",
      error: null,
    },
    filters: {
      category: "all",
      sortBy: "none",
      searchTerm: "",
    },
    favorites: {
      items: [],
    },
    cart: {
      items: [],
      loading: false,
    },
  };

  renderWithProviders(<ProductList />, initialState);

  expect(screen.getByText(/sample product list item/i)).toBeInTheDocument();
});
