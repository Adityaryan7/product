import { createSlice } from "@reduxjs/toolkit";

const filtersSlice = createSlice({
  name: "filters",
  initialState: {
    category: "all",
    sortBy: "default",
    searchTerm: "",
    priceRange: { min: 0, max: 1000 },
  },
  reducers: {
    setCategory: (state, action) => {
      state.category = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setPriceRange: (state, action) => {
      state.priceRange = action.payload;
    },
  },
});

export const { setCategory, setSortBy, setSearchTerm, setPriceRange } =
  filtersSlice.actions;
export default filtersSlice.reducer;

import filtersReducer, {
  setSearchTerm,
  setCategory,
  setSortBy,
  setPriceRange,
} from "./filtersReducer";

// Test initial state matches reducer defaults
const initialState = {
  searchTerm: "",
  category: "all",
  sortBy: "none",
  priceRange: { min: 0, max: 1000 },
};

describe("filtersReducer", () => {
  test("should return initial state", () => {
    expect(filtersReducer(undefined, { type: "unknown" })).toEqual(
      initialState
    );
  });

  test("should handle setSearchTerm", () => {
    const action = setSearchTerm("test search");
    const state = filtersReducer(initialState, action);
    expect(state.searchTerm).toBe("test search");
  });

  test("should handle setCategory", () => {
    const action = setCategory("electronics");
    const state = filtersReducer(initialState, action);
    expect(state.category).toBe("electronics");
  });

  test("should handle setSortBy", () => {
    const action = setSortBy("price-asc");
    const state = filtersReducer(initialState, action);
    expect(state.sortBy).toBe("price-asc");
  });

  test("should handle setPriceRange", () => {
    const newRange = { min: 10, max: 500 };
    const action = setPriceRange(newRange);
    const state = filtersReducer(initialState, action);
    expect(state.priceRange).toEqual(newRange);
  });

  test("should reset searchTerm to empty string", () => {
    const stateWithSearch = { ...initialState, searchTerm: "existing search" };
    const action = setSearchTerm("");
    const state = filtersReducer(stateWithSearch, action);
    expect(state.searchTerm).toBe("");
  });

  test("should handle category 'all'", () => {
    const stateWithCategory = { ...initialState, category: "electronics" };
    const action = setCategory("all");
    const state = filtersReducer(stateWithCategory, action);
    expect(state.category).toBe("all");
  });

  test("should handle multiple sort options", () => {
    let state = filtersReducer(initialState, setSortBy("price-asc"));
    expect(state.sortBy).toBe("price-asc");

    state = filtersReducer(state, setSortBy("price-desc"));
    expect(state.sortBy).toBe("price-desc");
  });

  test("should maintain other state when updating searchTerm", () => {
    const customState = {
      ...initialState,
      category: "electronics",
      sortBy: "price-desc",
    };
    const action = setSearchTerm("laptop");
    const state = filtersReducer(customState, action);

    expect(state.searchTerm).toBe("laptop");
    expect(state.category).toBe("electronics");
    expect(state.sortBy).toBe("price-desc");
  });

  test("should handle price range with zero values", () => {
    const newRange = { min: 0, max: 0 };
    const action = setPriceRange(newRange);
    const state = filtersReducer(initialState, action);
    expect(state.priceRange).toEqual(newRange);
  });
});
