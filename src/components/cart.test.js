import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react"; // add within
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { BrowserRouter } from "react-router-dom";
import Cart from "./cart";
import cartReducer from "../reducers/cartReducer";

const mockStore = (initialState) =>
  configureStore({
    reducer: {
      cart: cartReducer,
    },
    preloadedState: initialState,
  });

const renderWithProviders = (component, initialState) => {
  const store = mockStore(initialState);
  return render(
    <Provider store={store}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>
  );
};

describe("Cart", () => {
  test("renders empty cart message when no items", () => {
    const initialState = {
      cart: {
        items: [],
        loading: false,
      },
    };

    renderWithProviders(<Cart />, initialState);

    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });

  test("renders cart items when present", () => {
    const initialState = {
      cart: {
        items: [
          {
            product: {
              id: 1,
              title: "Test Product",
              price: 29.99,
              image: "test.jpg",
            },
            quantity: 2,
          },
        ],
        loading: false,
      },
    };

    renderWithProviders(<Cart />, initialState);

    expect(screen.getByText("Test Product")).toBeInTheDocument();
  });

  test("displays product image", () => {
    const initialState = {
      cart: {
        items: [
          {
            product: {
              id: 1,
              title: "Test Product",
              price: 29.99,
              image: "test.jpg",
            },
            quantity: 1,
          },
        ],
        loading: false,
      },
    };

    renderWithProviders(<Cart />, initialState);

    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("src", "test.jpg");
  });

  test("displays product price", () => {
    const initialState = {
      cart: {
        items: [
          {
            product: {
              id: 1,
              title: "Test Product",
              price: 29.99,
              image: "test.jpg",
            },
            quantity: 1,
          },
        ],
        loading: false,
      },
    };

    renderWithProviders(<Cart />, initialState);

    expect(screen.getByText("$29.99")).toBeInTheDocument();
  });

  test("displays product quantity", () => {
    const initialState = {
      cart: {
        items: [
          {
            product: {
              id: 1,
              title: "Test Product",
              price: 29.99,
              image: "test.jpg",
            },
            quantity: 3,
          },
        ],
        loading: false,
      },
    };

    renderWithProviders(<Cart />, initialState);

    expect(screen.getByDisplayValue("3")).toBeInTheDocument();
  });

  test("handles quantity increase", () => {
    const initialState = {
      cart: {
        items: [
          {
            product: {
              id: 1,
              title: "Test Product",
              price: 29.99,
              image: "test.jpg",
            },
            quantity: 1,
          },
        ],
        loading: false,
      },
    };

    renderWithProviders(<Cart />, initialState);

    const increaseButton = screen.getByRole("button", { name: /\+/ });
    fireEvent.click(increaseButton);

    expect(increaseButton).toBeInTheDocument();
  });

  test("handles quantity decrease", () => {
    const initialState = {
      cart: {
        items: [
          {
            product: {
              id: 1,
              title: "Test Product",
              price: 29.99,
              image: "test.jpg",
            },
            quantity: 2,
          },
        ],
        loading: false,
      },
    };

    renderWithProviders(<Cart />, initialState);

    const decreaseButton = screen.getByRole("button", { name: /-/ });
    fireEvent.click(decreaseButton);

    expect(decreaseButton).toBeInTheDocument();
  });

  test("handles remove item", () => {
    const initialState = {
      cart: {
        items: [
          {
            product: {
              id: 1,
              title: "Test Product",
              price: 29.99,
              image: "test.jpg",
            },
            quantity: 1,
          },
        ],
        loading: false,
      },
    };

    renderWithProviders(<Cart />, initialState);

    const removeButtons = screen.getAllByRole("button", { name: /remove/i });
    const removeButton = removeButtons[0];
    fireEvent.click(removeButton);

    expect(removeButton).toBeInTheDocument();
  });

  test("calculates and displays total correctly", () => {
    const initialState = {
      cart: {
        items: [
          {
            product: {
              id: 1,
              title: "Product 1",
              price: 10.0,
              image: "test1.jpg",
            },
            quantity: 2,
          },
          {
            product: {
              id: 2,
              title: "Product 2",
              price: 15.0,
              image: "test2.jpg",
            },
            quantity: 1,
          },
        ],
        loading: false,
      },
    };

    renderWithProviders(<Cart />, initialState);

    const totalRegion = screen.getByLabelText(/order-total/i);
    expect(within(totalRegion).getByText(/\$?\s*35\.00/)).toBeInTheDocument();
  });

  test("handles checkout button click", () => {
    const initialState = {
      cart: {
        items: [
          {
            product: {
              id: 1,
              title: "Test Product",
              price: 29.99,
              image: "test.jpg",
            },
            quantity: 1,
          },
        ],
        loading: false,
      },
    };

    renderWithProviders(<Cart />, initialState);

    const checkoutButton = screen.getByRole("button", { name: /checkout/i });
    fireEvent.click(checkoutButton);

    expect(checkoutButton).toBeInTheDocument();
  });

  test("shows loading state", () => {
    const initialState = {
      cart: {
        items: [],
        loading: true,
      },
    };

    renderWithProviders(<Cart />, initialState);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test("handles clear cart", () => {
    const initialState = {
      cart: {
        items: [
          {
            product: {
              id: 1,
              title: "Test Product",
              price: 29.99,
              image: "test.jpg",
            },
            quantity: 1,
          },
        ],
        loading: false,
      },
    };

    renderWithProviders(<Cart />, initialState);

    const clearButton = screen.getByRole("button", { name: /clear cart/i });
    fireEvent.click(clearButton);

    expect(clearButton).toBeInTheDocument();
  });
});
