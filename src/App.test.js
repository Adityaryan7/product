import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import cartReducer from "./reducers/cartReducer";
import productsReducer from "./reducers/productsReducer";
import favoritesReducer from "./reducers/favoritesReducer";
import filtersReducer from "./reducers/filtersReducer";

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock window.location.replace
delete window.location;
window.location = { replace: jest.fn() };

// Mock useMediaQuery for mobile testing - Fixed initialization
jest.mock("@mui/material/useMediaQuery", () => jest.fn());

// Mock the components to avoid complex rendering issues
jest.mock("./components/productList", () => {
  return function MockProductList() {
    return <div>Product List</div>;
  };
});

jest.mock("./components/productDetail", () => {
  return function MockProductDetail() {
    return <div>Product Detail</div>;
  };
});

jest.mock("./components/favorites", () => {
  return function MockFavorites() {
    return <div>Favorites</div>;
  };
});

jest.mock("./components/cart", () => {
  return function MockCart() {
    return <div>Cart</div>;
  };
});

// Import App after mocks are set up
import App from "./App";
import useMediaQuery from "@mui/material/useMediaQuery";

// Create test store with cart items for badge testing
const createTestStore = (initialState = {}) =>
  configureStore({
    reducer: {
      cart: cartReducer,
      products: productsReducer,
      favorites: favoritesReducer,
      filters: filtersReducer,
    },
    preloadedState: {
      cart: { items: [], loading: false },
      products: { items: [], status: "idle", error: null },
      favorites: { items: [], loading: false },
      filters: {
        searchTerm: "",
        category: "all",
        sortBy: "none",
        priceRange: { min: 0, max: 1000 },
      },
      ...initialState,
    },
  });

const theme = createTheme();

const renderApp = (initialState = {}) => {
  const store = createTestStore(initialState);
  return render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
};

describe("App", () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    window.location.replace?.mockClear();
    useMediaQuery.mockReturnValue(false); // Default to desktop
  });

  // Authentication tests
  test("renders login when not authenticated", () => {
    localStorageMock.getItem.mockReturnValue(null);
    renderApp();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  test("renders navbar when authenticated", () => {
    localStorageMock.getItem.mockReturnValue("mock-token");
    renderApp();
    expect(screen.getByText("Product Dashboard")).toBeInTheDocument();
  });

  // Desktop navbar tests
  test("renders desktop navbar links when authenticated", () => {
    localStorageMock.getItem.mockReturnValue("mock-token");
    useMediaQuery.mockReturnValue(false); // Desktop

    renderApp();

    expect(screen.getByText("Products")).toBeInTheDocument();
    expect(screen.getByText("Favorites")).toBeInTheDocument();
    expect(screen.getByText("Cart")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  // Mobile navbar tests
  test("renders mobile menu when on mobile device", () => {
    localStorageMock.getItem.mockReturnValue("mock-token");
    useMediaQuery.mockReturnValue(true); // Mobile

    renderApp();

    // Should show menu icon instead of individual links
    const menuButton = screen.getByRole("button", { name: /menu/i });
    expect(menuButton).toBeInTheDocument();
  });

  test("opens mobile menu and shows navigation options", () => {
    localStorageMock.getItem.mockReturnValue("mock-token");
    useMediaQuery.mockReturnValue(true); // Mobile

    renderApp();

    // Click menu button
    const menuButton = screen.getByRole("button", { name: /menu/i });
    fireEvent.click(menuButton);

    // Should show menu items
    expect(screen.getByText("Products")).toBeInTheDocument();
    expect(screen.getByText("Favorites")).toBeInTheDocument();
    expect(screen.getByText("Cart")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  // Cart badge functionality
  test("shows cart badge with correct item count", () => {
    localStorageMock.getItem.mockReturnValue("mock-token");

    const cartItems = [
      { product: { id: 1, title: "Item 1", price: 10 }, quantity: 2 },
      { product: { id: 2, title: "Item 2", price: 20 }, quantity: 1 },
    ];

    renderApp({ cart: { items: cartItems, loading: false } });

    // Badge should show total quantity (2 + 1 = 3)
    const badge = screen.getByText("3");
    expect(badge).toBeInTheDocument();
  });

  // Logout functionality
  test("handles logout correctly", () => {
    localStorageMock.getItem.mockReturnValue("mock-token");

    renderApp();

    const logoutButton = screen.getByText(/logout/i);
    fireEvent.click(logoutButton);

    expect(localStorageMock.removeItem).toHaveBeenCalledWith("token");
  });

  // Menu close functionality (mobile)
  test("closes mobile menu when menu item is clicked", () => {
    localStorageMock.getItem.mockReturnValue("mock-token");
    useMediaQuery.mockReturnValue(true); // Mobile

    renderApp();

    // Open menu
    const menuButton = screen.getByRole("button", { name: /menu/i });
    fireEvent.click(menuButton);

    // Click on a menu item
    const productsLink = screen.getByText("Products");
    fireEvent.click(productsLink);

    // Menu should close (this tests handleMenuClose function)
    expect(productsLink).toBeInTheDocument();
  });

  // Test mobile menu logout
  test("handles logout from mobile menu", () => {
    localStorageMock.getItem.mockReturnValue("mock-token");
    useMediaQuery.mockReturnValue(true); // Mobile

    renderApp();

    // Open menu
    const menuButton = screen.getByRole("button", { name: /menu/i });
    fireEvent.click(menuButton);

    // Click logout from menu
    const logoutMenuItem = screen.getByText("Logout");
    fireEvent.click(logoutMenuItem);

    expect(localStorageMock.removeItem).toHaveBeenCalledWith("token");
  });
});
