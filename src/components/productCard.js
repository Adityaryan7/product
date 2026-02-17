import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import {
  addToFavoritesStart,
  addToFavoritesSuccess,
  removeFromFavoritesStart,
  removeFromFavoritesSuccess,
} from "../reducers/favoritesReducer";
import { addToCartStart, addToCartSuccess } from "../reducers/cartReducer";
import { useSnackbar } from "../context/SnackbarContext";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import InfoIcon from "@mui/icons-material/Info";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CircularProgress from "@mui/material/CircularProgress";
import {
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Box,
  Divider,
} from "@mui/material";

function ProductCard({ product }) {
  const dispatch = useDispatch();
  const { showSuccess } = useSnackbar();
  const favorites = useSelector((state) => state.favorites.items);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const isFavorite = favorites.some((item) => item.id === product.id);

  const toggleFavorite = () => {
    if (isLoading) return;
    setIsLoading(true);

    if (isFavorite) {
      dispatch(removeFromFavoritesStart());
      setTimeout(() => {
        dispatch(removeFromFavoritesSuccess(product));
        showSuccess("Removed from favorites");
        setIsLoading(false);
      }, 700);
    } else {
      dispatch(addToFavoritesStart());
      setTimeout(() => {
        dispatch(addToFavoritesSuccess(product));
        showSuccess("Added to favorites");
        setIsLoading(false);
      }, 700);
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    setIsAddingToCart(true);
    dispatch(addToCartStart());
    setTimeout(() => {
      dispatch(addToCartSuccess(product));
      showSuccess("Added to cart");
      setIsAddingToCart(false);
    }, 700);
  };

  return (
    <Card
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
        borderRadius: 2,
        border: "1px solid #e0e0e0",
        boxShadow: "none",
        "&:hover": {
          boxShadow: "0 2px 8px rgba(13,30,60,0.08)",
        },
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: 200,
          bgcolor: "#f8f8f8",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 2,
        }}
      >
        <img
          src={product.image}
          alt={product.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            maxWidth: "80%",
            maxHeight: "80%",
          }}
        />
      </Box>

      <CardContent
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          p: 2,
          "&:last-child": { pb: 2 },
        }}
      >
        <Box sx={{ mb: "auto" }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontSize: "0.875rem",
              fontWeight: 500,
              minHeight: "2.4em",
              maxHeight: "2.4em",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              mb: 1,
              color: "#212121",
              lineHeight: "1.2em",
              wordBreak: "break-word",
              "&:hover": {
                textOverflow: "ellipsis",
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              },
            }}
          >
            {product.title}
          </Typography>

          <Typography
            variant="caption"
            sx={{
              color: "#878787",
              display: "block",
              mb: 1,
            }}
          >
            {product.category}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontWeight: 600,
              color: "#212121",
              fontSize: "1rem",
            }}
          >
            ${product.price}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 2,
            pt: 1,
            borderTop: "1px solid #f0f0f0",
            gap: 1,
          }}
        >
          <Button
            component={RouterLink}
            to={`/product/${product.id}`}
            startIcon={<InfoIcon />}
            size="small"
            variant="outlined"
            sx={{
              flex: 1,
              textTransform: "none",
              borderColor: "#dbdbdb",
              color: "#2874f0",
              "&:hover": {
                borderColor: "#2874f0",
                bgcolor: "transparent",
              },
            }}
          >
            Details
          </Button>

          <Button
            onClick={handleAddToCart}
            startIcon={
              isAddingToCart ? (
                <CircularProgress size={18} />
              ) : (
                <ShoppingCartIcon />
              )
            }
            size="small"
            variant="contained"
            disabled={isAddingToCart}
            sx={{
              flex: 1,
              textTransform: "none",
            }}
          >
            Add to Cart
          </Button>

          <IconButton
            onClick={toggleFavorite}
            color={isFavorite ? "error" : "default"}
            size="small"
            disabled={isLoading}
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            } // Added
            sx={{
              border: "1px solid #dbdbdb",
              p: 1,
            }}
          >
            {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            {isLoading && (
              <CircularProgress
                size={24}
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  marginTop: "-12px",
                  marginLeft: "-12px",
                }}
              />
            )}
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
}

export default ProductCard;
