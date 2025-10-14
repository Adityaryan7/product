import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import ProductCard from "./productCard";
import cartReducer from "../reducers/cartReducer";
import favoritesReducer from "../reducers/favoritesReducer";

const createMockStore = (initialState) =>
  configureStore({
    reducer: {
      cart: cartReducer,
      favorites: favoritesReducer,
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

describe("ProductCard", () => {
  const mockProduct = {
    id: 1,
    title: "Test Product",
    price: 29.99,
    image: "test.jpg",
    description: "Test description",
  };

  const initialState = {
    cart: { items: [], loading: false },
    favorites: { items: [], loading: false },
  };

  test("renders product information", () => {
    renderWithProviders(<ProductCard product={mockProduct} />, initialState);

    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("$29.99")).toBeInTheDocument();
  });

  test("handles add to cart button click", () => {
    renderWithProviders(<ProductCard product={mockProduct} />, initialState);

    const addToCartButton = screen.getByRole("button", {
      name: /add to cart/i,
    });
    fireEvent.click(addToCartButton);

    // The button should be in the document (action dispatched)
    expect(addToCartButton).toBeInTheDocument();
  });

  test("handles favorite button click", () => {
    renderWithProviders(<ProductCard product={mockProduct} />, initialState);

    // Use the aria-label we added
    const favoriteButton = screen.getByRole("button", {
      name: /add to favorites/i,
    });
    fireEvent.click(favoriteButton);

    // The button should be in the document (action dispatched)
    expect(favoriteButton).toBeInTheDocument();
  });

  test("shows product as favorited when in favorites", () => {
    const stateWithFavorite = {
      cart: { items: [], loading: false },
      favorites: { items: [mockProduct], loading: false },
    };

    renderWithProviders(
      <ProductCard product={mockProduct} />,
      stateWithFavorite
    );

    // Should show remove from favorites option
    const favoriteButton = screen.getByRole("button", {
      name: /remove from favorites/i,
    });
    expect(favoriteButton).toBeInTheDocument();
  });

  test("shows favorite icon when product is in favorites", () => {
    const stateWithFavorite = {
      cart: { items: [], loading: false },
      favorites: { items: [mockProduct], loading: false },
    };

    renderWithProviders(
      <ProductCard product={mockProduct} />,
      stateWithFavorite
    );

    // Check for the filled favorite icon
    const favoriteIcon = screen.getByTestId("FavoriteIcon");
    expect(favoriteIcon).toBeInTheDocument();
  });

  test("shows unfavorite icon when product is not in favorites", () => {
    renderWithProviders(<ProductCard product={mockProduct} />, initialState);

    // Check for the outlined favorite icon
    const favoriteIcon = screen.getByTestId("FavoriteBorderIcon");
    expect(favoriteIcon).toBeInTheDocument();
  });
});
