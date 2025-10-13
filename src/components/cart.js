import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  IconButton,
  Grid,
  Divider,
  TextField,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {
  removeFromCartStart,
  removeFromCartSuccess,
  updateQuantity,
  clearCart,
} from '../reducers/cartReducer';

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity >= 1) {
      dispatch(updateQuantity({ productId, quantity: parseInt(newQuantity) }));
    }
  };

  const handleRemoveItem = (product) => {
    dispatch(removeFromCartStart());
    setTimeout(() => {
      dispatch(removeFromCartSuccess(product));
    }, 300);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={() => navigate(-1)} color="inherit">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight={600}>
          Shopping Cart
        </Typography>
      </Box>

      {cartItems.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <ShoppingCartIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Your cart is empty
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/')}
            sx={{ mt: 2 }}
          >
            Continue Shopping
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
         
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2 }}>
              {cartItems.map((item) => (
                <Box key={item.product.id}>
                  <Box sx={{ p: 2, display: 'flex', gap: 2 }}>
             
                    <Box
                      sx={{
                        width: 100,
                        height: 100,
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: '#f5f5f5',
                        borderRadius: 1,
                      }}
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.title}
                        style={{
                          maxWidth: '80%',
                          maxHeight: '80%',
                          objectFit: 'contain',
                        }}
                      />
                    </Box>

                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" sx={{ mb: 1 }}>
                        {item.product.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        ${item.product.price}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                        <TextField
                          type="number"
                          size="small"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.product.id, e.target.value)}
                          InputProps={{ inputProps: { min: 1 } }}
                          sx={{ width: '100%' }} 
                        />
                        <IconButton
                          onClick={() => handleRemoveItem(item.product)}
                          color="error"
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                  <Divider />
                </Box>
              ))}
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <Box sx={{ my: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Subtotal</Typography>
                  <Typography>${calculateTotal().toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Shipping</Typography>
                  <Typography>Free</Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">Total</Typography>
                  <Typography variant="h6" color="primary">
                    ${calculateTotal().toFixed(2)}
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="contained"
                fullWidth
                size="large"
                sx={{ mb: 2 }}
              >
                Checkout
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => dispatch(clearCart())}
              >
                Clear Cart
              </Button>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}

export default Cart;