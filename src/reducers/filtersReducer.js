import { createSlice } from '@reduxjs/toolkit';

const filtersSlice = createSlice({
  name: 'filters',
  initialState: {
    searchTerm: '',
    category: 'all',
    sortBy: 'none',
    priceRange: { min: 0, max: 1000 }
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setCategory: (state, action) => {
      state.category = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setPriceRange: (state, action) => {
      state.priceRange = action.payload;
    }
  },
});

export const { setSearchTerm, setCategory, setSortBy, setPriceRange } = filtersSlice.actions;
export default filtersSlice.reducer;