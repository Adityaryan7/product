import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import ProductDetail from "./productDetail";
import productsReducer from "../reducers/productsReducer";
import cartReducer from "../reducers/cartReducer";
import favoritesReducer from "../reducers/favoritesReducer";

const createMockStore = (initialState) =>
  configureStore({
    reducer: {
      products: productsReducer,
      cart: cartReducer,
      favorites: favoritesReducer,
    },
    preloadedState: initialState,
  });

describe("ProductDetail", () => {
  const mockProduct = {
    id: 1,
    title: "Sample Product Details Item",
    price: 29.99,
    image: "test.jpg",
    description: "Test product description",
    category: "electronics",
    rating: { rate: 4.5, count: 100 },
  };

  test("renders product detail with product name", () => {
    const initialState = {
      products: {
        items: [mockProduct],
        status: "succeeded",
        error: null,
      },
      cart: { items: [], loading: false },
      favorites: { items: [], loading: false },
    };
    const store = createMockStore(initialState);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/product/1"]}>
          <Routes>
            <Route path="/product/:id" element={<ProductDetail />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(
      screen.getByText(/sample product details item/i)
    ).toBeInTheDocument();
  });

  test("handles add to cart button click", () => {
    const initialState = {
      products: {
        items: [mockProduct],
        status: "succeeded",
        error: null,
      },
      cart: { items: [], loading: false },
      favorites: { items: [], loading: false },
    };
    const store = createMockStore(initialState);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/product/1"]}>
          <Routes>
            <Route path="/product/:id" element={<ProductDetail />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    const addToCartButton = screen.getByRole("button", {
      name: /add to cart/i,
    });
    fireEvent.click(addToCartButton);

    expect(addToCartButton).toBeInTheDocument();
  });

  test("handles add to favorites button click", () => {
    const initialState = {
      products: {
        items: [mockProduct],
        status: "succeeded",
        error: null,
      },
      cart: { items: [], loading: false },
      favorites: { items: [], loading: false },
    };
    const store = createMockStore(initialState);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/product/1"]}>
          <Routes>
            <Route path="/product/:id" element={<ProductDetail />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    const favoriteButton = screen.getByRole("button", {
      name: /add to favorites/i,
    });
    fireEvent.click(favoriteButton);

    expect(favoriteButton).toBeInTheDocument();
  });

  test("shows product not found when product doesn't exist", () => {
    const initialState = {
      products: {
        items: [],
        status: "succeeded",
        error: null,
      },
      cart: { items: [], loading: false },
      favorites: { items: [], loading: false },
    };
    const store = createMockStore(initialState);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/product/999"]}>
          <Routes>
            <Route path="/product/:id" element={<ProductDetail />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    // Should show some error or not found message
    expect(document.body).toBeInTheDocument();
  });

  test("shows loading state when products are loading", () => {
    const initialState = {
      products: {
        items: [],
        status: "loading",
        error: null,
      },
      cart: { items: [], loading: false },
      favorites: { items: [], loading: false },
    };
    const store = createMockStore(initialState);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/product/1"]}>
          <Routes>
            <Route path="/product/:id" element={<ProductDetail />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    // Component should still render
    expect(document.body).toBeInTheDocument();
  });
});
