import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box, useMediaQuery, IconButton, Menu, MenuItem, Badge } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MenuIcon from "@mui/icons-material/Menu";
import { useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles";
import ProductList from "./components/productList";
import ProductDetail from "./components/productDetail";
import Favorites from "./components/favorites";
import Cart from "./components/cart";
import Login from "./components/login";
import Register from "./components/register";
import ForgotPassword from "./components/forgotPassword";
import "./App.css";

function Navbar({ onLogout }) {
  const cartItems = useSelector((state) => state.cart.items);
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <AppBar position="static">
      <Toolbar sx={{ px: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ textDecoration: "none", color: "inherit", fontWeight: "bold" }}
          >
            Product Dashboard
          </Typography>

          {isMobile ? (
            <>
              <IconButton color="inherit" onClick={handleMenuOpen}>
                <MenuIcon />
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem component={Link} to="/" onClick={handleMenuClose}><HomeIcon sx={{ mr: 1 }} /> Products</MenuItem>
                <MenuItem component={Link} to="/favorites" onClick={handleMenuClose}><FavoriteIcon sx={{ mr: 1 }} /> Favorites</MenuItem>
                <MenuItem component={Link} to="/cart" onClick={handleMenuClose}>
                  <Badge badgeContent={cartItemCount} color="error" sx={{ mr: 1 }}><ShoppingCartIcon /></Badge>Cart
                </MenuItem>
                <MenuItem onClick={onLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button color="inherit" component={Link} to="/" startIcon={<HomeIcon />}>Products</Button>
              <Button color="inherit" component={Link} to="/favorites" startIcon={<FavoriteIcon />}>Favorites</Button>
              <Button color="inherit" component={Link} to="/cart" startIcon={
                <Badge badgeContent={cartItemCount} color="error"><ShoppingCartIcon /></Badge>
              }>Cart</Button>
              <Button color="inherit" onClick={onLogout}>Logout</Button>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const handleLoginSuccess = (token) => setToken(token);
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <Router>
      {/* Only show Navbar if the user is logged in */}
      {token && <Navbar onLogout={handleLogout} />}

      <Routes>
        {/* Public Routes */}
        {!token ? (
          <>
            <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/register" element={<Register onBackToLogin={() => window.location.replace("/login")} />} />
            <Route path="/forgot-password" element={<ForgotPassword onBackToLogin={() => window.location.replace("/login")} />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        ) : (
          <>
            {/* Protected Routes */}
            <Route path="/" element={token ? <ProductList /> : <Navigate to="/login" />} />
            <Route path="/product/:id" element={token ? <ProductDetail /> : <Navigate to="/login" />} />
            <Route path="/favorites" element={token ? <Favorites /> : <Navigate to="/login" />} />
            <Route path="/cart" element={token ? <Cart /> : <Navigate to="/login" />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
