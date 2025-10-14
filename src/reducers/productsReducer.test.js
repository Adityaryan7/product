import productsReducer, { fetchProducts } from "./productsReducer";
import { configureStore } from "@reduxjs/toolkit";

// Mock fetch globally
global.fetch = jest.fn();

describe("productsReducer", () => {
  const initialState = {
    items: [],
    status: "idle",
    error: null,
  };

  beforeEach(() => {
    fetch.mockClear();
  });

  test("should return initial state", () => {
    expect(productsReducer(undefined, { type: "unknown" })).toEqual(
      initialState
    );
  });

  test("should handle fetchProducts.pending", () => {
    const action = { type: fetchProducts.pending.type };
    const state = productsReducer(initialState, action);
    expect(state.status).toBe("loading");
  });

  test("should handle fetchProducts.fulfilled", () => {
    const mockProducts = [{ id: 1, title: "Test Product", price: 29.99 }];
    const action = {
      type: fetchProducts.fulfilled.type,
      payload: mockProducts,
    };
    const state = productsReducer(initialState, action);
    expect(state.status).toBe("succeeded");
    expect(state.items).toEqual(mockProducts);
  });

  test("should handle fetchProducts.rejected", () => {
    const action = {
      type: fetchProducts.rejected.type,
      error: { message: "Failed to fetch" },
    };
    const state = productsReducer(initialState, action);
    expect(state.status).toBe("failed");
    expect(state.error).toBe("Failed to fetch");
  });

  // Integration test for async thunk
  test("fetchProducts thunk should fetch products successfully", async () => {
    const mockProducts = [{ id: 1, title: "Test Product" }];
    fetch.mockResolvedValueOnce({
      json: async () => mockProducts,
    });

    const store = configureStore({ reducer: { products: productsReducer } });
    await store.dispatch(fetchProducts());

    const state = store.getState().products;
    expect(state.status).toBe("succeeded");
    expect(state.items).toEqual(mockProducts);
    expect(fetch).toHaveBeenCalledWith("https://fakestoreapi.com/products");
  });
});
