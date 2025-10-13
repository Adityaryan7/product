import React from 'react';
import { useSelector } from 'react-redux';
import ProductCard from './productCard';
import { 
  Container, 
  Typography, 
  Grid, 
  Box, 
  Paper,
  Divider 
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';

function Favorites() {
  const favorites = useSelector((state) => state.favorites.items);

  return (
    <Container  maxWidth="xl">
      <Paper 
        elevation={0} 
        sx={{ 
          pt: 3, 
          pb: 3, 
          mb: 3, 
          bgcolor: 'white',
          borderRadius: 2
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FavoriteIcon color="error" sx={{ fontSize: 28 }} />
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            My Favorites
          </Typography>
        </Box>
        <Divider sx={{ mt: 2 }} />
      </Paper>

      {favorites.length === 0 ? (
        <Paper 
          elevation={0}
          sx={{ 
            p: 4, 
            textAlign: 'center',
            bgcolor: 'white',
            borderRadius: 2
          }}
        >
          <FavoriteIcon sx={{ fontSize: 48, color: '#bdbdbd', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No favorites yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Start adding some products to your favorites list
          </Typography>
        </Paper>
      ) : (
        <Grid 
          container 
          spacing={2}
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)',
            },
            gap: 2,
            '& .MuiGrid-item': {
              width: '100%',
              maxWidth: '100%',
              flexBasis: 'unset',
              padding: 0,
              display: 'flex'
            }
          }}
        >
          {favorites.map((product) => (
            <Grid item key={product.id}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default Favorites;