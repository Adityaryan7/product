import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../reducers/productsReducer";
import {
  setSearchTerm,
  setCategory,
  setSortBy,
} from "../reducers/filtersReducer";
import ProductCard from "./productCard";
import SearchIcon from "@mui/icons-material/Search";
import SortIcon from "@mui/icons-material/Sort";
import CategoryIcon from "@mui/icons-material/Category";
import {
  Container,
  Box,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
  Typography,
} from "@mui/material";
import debounce from "lodash/debounce";

function ProductList() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.products);
  const { searchTerm, category, sortBy } = useSelector(
    (state) => state.filters
  );

  useEffect(() => {
    if (status === "idle") dispatch(fetchProducts());
  }, [status, dispatch]);

  const debouncedSearch = useMemo(
    () => debounce((term) => dispatch(setSearchTerm(term)), 300),
    [dispatch]
  );

  const filteredProducts = useMemo(() => {
    return items
      .filter((product) => {
        const matchesSearch = product.title
          .toLowerCase()
          .includes((searchTerm || "").toLowerCase());
        const matchesCategory =
          category === "all" || product.category === category;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        return 0;
      });
  }, [items, searchTerm, category, sortBy]);

  if (status === "loading")
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <Typography variant="h6" color="text.secondary">
          Loading products...
        </Typography>
      </Container>
    );

  if (status === "failed")
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <Typography color="error">Error: {error}</Typography>
      </Container>
    );

  return (
    <Container maxWidth="xl">
      <Box
        sx={{
          mt: 2,
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          alignItems: "center",
        }}
      >
        <TextField
          placeholder="Search products..."
          onChange={(e) => debouncedSearch(e.target.value)}
          size="small"
          variant="outlined"
          sx={{ minWidth: 240, flex: "1 1 320px" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            labelId="category-label"
            value={category}
            label="Category"
            onChange={(e) => dispatch(setCategory(e.target.value))}
            startAdornment={
              <InputAdornment position="start">
                <CategoryIcon />
              </InputAdornment>
            }
          >
            <MenuItem value="all">All Categories</MenuItem>
            <MenuItem value="electronics">Electronics</MenuItem>
            <MenuItem value="jewelery">Jewelery</MenuItem>
            <MenuItem value="men's clothing">Men's Clothing</MenuItem>
            <MenuItem value="women's clothing">Women's Clothing</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel id="sort-label">Sort by</InputLabel>
          <Select
            labelId="sort-label"
            value={sortBy}
            label="Sort by"
            onChange={(e) => dispatch(setSortBy(e.target.value))}
            startAdornment={
              <InputAdornment position="start">
                <SortIcon />
              </InputAdornment>
            }
          >
            <MenuItem value="none">None</MenuItem>
            <MenuItem value="price-asc">Price: Low to High</MenuItem>
            <MenuItem value="price-desc">Price: High to Low</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ mt: 3 }}>
        {filteredProducts.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "50vh",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: "text.secondary",
                textAlign: "center",
              }}
            >
              No products found.
            </Typography>
          </Box>
        ) : (
          <Grid
            container
            spacing={2}
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(4, 1fr)",
              },
              gap: 2,
              "& .MuiGrid-item": {
                width: "100%",
                maxWidth: "100%",
                flexBasis: "unset",
                padding: 0,
                height: "auto",
                display: "flex",
              },
            }}
          >
            {filteredProducts.map((product) => (
              <Grid key={product.id}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
}

export default ProductList;
