import { createSlice } from "@reduxjs/toolkit";

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: {
    items: [],
    loading: false,
  },
  reducers: {
    addToFavoritesStart: (state) => {
      state.loading = true;
    },
    addToFavoritesSuccess: (state, action) => {
      const product = action.payload;
      const exists = state.items.find((item) => item.id === product.id);
      if (!exists) {
        state.items.push(product);
      }
      state.loading = false;
    },
    removeFromFavoritesStart: (state) => {
      state.loading = true;
    },
    removeFromFavoritesSuccess: (state, action) => {
      const product = action.payload;
      state.items = state.items.filter((item) => item.id !== product.id);
      state.loading = false;
    },
    setFavoritesLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const {
  addToFavoritesStart,
  addToFavoritesSuccess,
  removeFromFavoritesStart,
  removeFromFavoritesSuccess,
  setFavoritesLoading,
} = favoritesSlice.actions;
export default favoritesSlice.reducer;

import favoritesReducer, {
  addToFavoritesStart,
  addToFavoritesSuccess,
  removeFromFavoritesStart,
  removeFromFavoritesSuccess,
  setFavoritesLoading,
} from "./favoritesReducer";

describe("favoritesReducer", () => {
  const initialState = {
    items: [],
    loading: false,
  };

  const sampleProduct = {
    id: 1,
    title: "Test Product",
    price: 29.99,
    image: "test.jpg",
    category: "electronics",
  };

  const sampleProduct2 = {
    id: 2,
    title: "Test Product 2",
    price: 39.99,
    image: "test2.jpg",
    category: "jewelery",
  };

  test("should return the initial state", () => {
    expect(favoritesReducer(undefined, { type: "unknown" })).toEqual(
      initialState
    );
  });

  // Test addToFavoritesStart (line 11-13)
  test("should handle addToFavoritesStart", () => {
    const action = addToFavoritesStart();
    const state = favoritesReducer(initialState, action);

    expect(state.loading).toBe(true);
    expect(state.items).toEqual([]);
  });

  // Test addToFavoritesSuccess (line 14-21)
  test("should handle addToFavoritesSuccess with new product", () => {
    const action = addToFavoritesSuccess(sampleProduct);
    const state = favoritesReducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toEqual(sampleProduct);
  });

  // Test duplicate prevention in addToFavoritesSuccess (line 16-18)
  test("should not add duplicate product in addToFavoritesSuccess", () => {
    const stateWithProduct = {
      items: [sampleProduct],
      loading: true,
    };

    const action = addToFavoritesSuccess(sampleProduct);
    const state = favoritesReducer(stateWithProduct, action);

    expect(state.loading).toBe(false);
    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toEqual(sampleProduct);
  });

  // Test adding multiple different products
  test("should add multiple different products", () => {
    const stateWithOneProduct = {
      items: [sampleProduct],
      loading: false,
    };

    const action = addToFavoritesSuccess(sampleProduct2);
    const state = favoritesReducer(stateWithOneProduct, action);

    expect(state.loading).toBe(false);
    expect(state.items).toHaveLength(2);
    expect(state.items).toContain(sampleProduct);
    expect(state.items).toContain(sampleProduct2);
  });

  // Test removeFromFavoritesStart (line 22-24)
  test("should handle removeFromFavoritesStart", () => {
    const stateWithProduct = {
      items: [sampleProduct],
      loading: false,
    };

    const action = removeFromFavoritesStart();
    const state = favoritesReducer(stateWithProduct, action);

    expect(state.loading).toBe(true);
    expect(state.items).toEqual([sampleProduct]);
  });

  // Test removeFromFavoritesSuccess (line 25-29)
  test("should handle removeFromFavoritesSuccess", () => {
    const stateWithProducts = {
      items: [sampleProduct, sampleProduct2],
      loading: true,
    };

    const action = removeFromFavoritesSuccess(sampleProduct);
    const state = favoritesReducer(stateWithProducts, action);

    expect(state.loading).toBe(false);
    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toEqual(sampleProduct2);
  });

  test("should handle removeFromFavoritesSuccess when product not found", () => {
    const nonExistentProduct = { id: 999, title: "Not Found" };
    const stateWithProducts = {
      items: [sampleProduct, sampleProduct2],
      loading: true,
    };

    const action = removeFromFavoritesSuccess(nonExistentProduct);
    const state = favoritesReducer(stateWithProducts, action);

    expect(state.loading).toBe(false);
    expect(state.items).toHaveLength(2); // No products removed
    expect(state.items).toContain(sampleProduct);
    expect(state.items).toContain(sampleProduct2);
  });

  // Test setFavoritesLoading (line 30-32)
  test("should handle setFavoritesLoading true", () => {
    const action = setFavoritesLoading(true);
    const state = favoritesReducer(initialState, action);

    expect(state.loading).toBe(true);
    expect(state.items).toEqual([]);
  });

  test("should handle setFavoritesLoading false", () => {
    const loadingState = {
      items: [sampleProduct],
      loading: true,
    };

    const action = setFavoritesLoading(false);
    const state = favoritesReducer(loadingState, action);

    expect(state.loading).toBe(false);
    expect(state.items).toEqual([sampleProduct]);
  });

  // Test action creators return correct action objects
  test("action creators return correct action types", () => {
    expect(addToFavoritesStart().type).toBe("favorites/addToFavoritesStart");
    expect(addToFavoritesSuccess(sampleProduct).type).toBe(
      "favorites/addToFavoritesSuccess"
    );
    expect(removeFromFavoritesStart().type).toBe(
      "favorites/removeFromFavoritesStart"
    );
    expect(removeFromFavoritesSuccess(sampleProduct).type).toBe(
      "favorites/removeFromFavoritesSuccess"
    );
    expect(setFavoritesLoading(true).type).toBe(
      "favorites/setFavoritesLoading"
    );
  });

  // Test payload handling
  test("action creators include correct payloads", () => {
    expect(addToFavoritesSuccess(sampleProduct).payload).toEqual(sampleProduct);
    expect(removeFromFavoritesSuccess(sampleProduct).payload).toEqual(
      sampleProduct
    );
    expect(setFavoritesLoading(true).payload).toBe(true);
    expect(setFavoritesLoading(false).payload).toBe(false);
  });

  // Edge case: empty items array operations
  test("should handle removeFromFavoritesSuccess on empty array", () => {
    const action = removeFromFavoritesSuccess(sampleProduct);
    const state = favoritesReducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.items).toHaveLength(0);
  });

  // Test state immutability
  test("should not mutate original state", () => {
    const originalState = {
      items: [sampleProduct],
      loading: false,
    };

    const action = addToFavoritesSuccess(sampleProduct2);
    const newState = favoritesReducer(originalState, action);

    // Original state should be unchanged
    expect(originalState.items).toHaveLength(1);
    expect(originalState.items[0]).toEqual(sampleProduct);

    // New state should have both products
    expect(newState.items).toHaveLength(2);
  });
});
