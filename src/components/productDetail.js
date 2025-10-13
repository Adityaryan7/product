import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  addToFavoritesStart,
  addToFavoritesSuccess,
  removeFromFavoritesStart,
  removeFromFavoritesSuccess
} from '../reducers/favoritesReducer';
import {
  addToCartStart,
  addToCartSuccess,
} from '../reducers/cartReducer';
import {
  Container,
  Grid,
  Card,
  Typography,
  Button,
  IconButton,
  Chip,
  Box,
  Rating,
  Divider,
  Paper,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CircularProgress from '@mui/material/CircularProgress';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  const product = useSelector((state) =>
    state.products.items.find((item) => item.id === parseInt(id))
  );
  const favorites = useSelector((state) => state.favorites.items);
  const isFavorite = favorites.some((item) => item.id === product?.id);

  if (!product) return <Container sx={{ py: 6 }}><Typography>Product not found</Typography></Container>;

  const toggleFavorite = () => {
    if (isLoading) return;
    setIsLoading(true);
    
    if (isFavorite) {
      dispatch(removeFromFavoritesStart());
      setTimeout(() => {
        dispatch(removeFromFavoritesSuccess(product));
        setIsLoading(false);
      }, 700);
    } else {
      dispatch(addToFavoritesStart());
      setTimeout(() => {
        dispatch(addToFavoritesSuccess(product));
        setIsLoading(false);
      }, 700);
    }
  };

  const handleAddToCart = () => {
    setIsAddingToCart(true);
    dispatch(addToCartStart());
    setTimeout(() => {
      dispatch(addToCartSuccess(product));
      setIsAddingToCart(false);
    }, 700);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          onClick={() => navigate(-1)}
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 2, color: 'text.secondary' }}
        >
          Back to Products
        </Button>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={0}
            sx={{ 
              bgcolor: '#fff',
              borderRadius: 2,
              overflow: 'hidden',
              p: 4,
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src={product.image}
              alt={product.title}
              style={{
                maxWidth: '100%',
                maxHeight: '400px',
                objectFit: 'contain',
              }}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ height: '100%' }}>
            <Chip 
              label={product.category}
              size="small"
              sx={{ mb: 2, bgcolor: '#f5f5f5' }}
            />
            <Typography variant="h4" component="h1" sx={{ mb: 2, fontWeight: 600 }}>
              {product.title}
            </Typography>

      
            <Box sx={{ mb: 3 }}>
              <Typography variant="h4" color="primary" sx={{ fontWeight: 600, mb: 1 }}>
                ${product.price}
              </Typography>
              {product.rating && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Rating value={product.rating.rate} precision={0.1} readOnly />
                  <Typography variant="body2" color="text.secondary">
                    ({product.rating.count} reviews)
                  </Typography>
                </Box>
              )}
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography 
              variant="body1" 
              sx={{ 
                mb: 4,
                lineHeight: 1.8,
                color: 'text.secondary'
              }}
            >
              {product.description}
            </Typography>

            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocalShippingIcon color="action" />
              <Typography variant="body2" color="text.secondary">
                Free shipping available on orders over $50
              </Typography>
            </Box>

         
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                size="large"
                startIcon={isAddingToCart ? <CircularProgress size={20} color="inherit" /> : <ShoppingCartIcon />}
                disabled={isAddingToCart}
                onClick={handleAddToCart}
                sx={{
                  flex: 2,
                  py: 1.5,
                  bgcolor: '#2874f0',
                  '&:hover': {
                    bgcolor: '#1c5ac4',
                  }
                }}
              >
                Add to Cart
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={toggleFavorite}
                disabled={isLoading}
                startIcon={isLoading ? (
                  <CircularProgress size={20} />
                ) : isFavorite ? (
                  <FavoriteIcon color="error" />
                ) : (
                  <FavoriteBorderIcon />
                )}
                sx={{
                  flex: 1,
                  py: 1.5,
                  borderColor: isFavorite ? 'error.main' : 'inherit',
                  color: isFavorite ? 'error.main' : 'inherit',
                }}
              >
                {isFavorite ? 'Saved' : 'Save'}
              </Button>
            </Box>

            <Box sx={{ mt: 4, p: 2, bgcolor: '#f8f9fa', borderRadius: 1 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                Product Highlights
              </Typography>
              <Typography variant="body2" component="div">
                • Free Returns
                <br />
                • Quality Guaranteed
                <br />
                • 24/7 Customer Support
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default ProductDetail;