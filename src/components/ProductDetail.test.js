import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import ProductDetail from './productDetail';
import productsReducer from '../reducers/productsReducer';
import favoritesReducer from '../reducers/favoritesReducer';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: '1' }),
}));

const mockStore = configureStore({
  reducer: {
    products: productsReducer,
    favorites: favoritesReducer,
  },
  preloadedState: {
    products: {
      items: [
        { 
          id: 1, 
          title: 'Test Product', 
          price: 99.99, 
          description: 'Test description',
          image: 'test.jpg'
        }
      ],
      status: 'succeeded'
    },
    favorites: {
      items: []
    }
  }
});

test('renders product details and handles favorite toggle', () => {
  render(
    <Provider store={mockStore}>
      <BrowserRouter>
        <ProductDetail />
      </BrowserRouter>
    </Provider>
  );

  expect(screen.getByText('Test Product')).toBeInTheDocument();
  expect(screen.getByText('$99.99')).toBeInTheDocument();
  expect(screen.getByText('Test description')).toBeInTheDocument();

  const favoriteButton = screen.getByRole('button', { name: /add to favorites/i });
  fireEvent.click(favoriteButton);
  expect(screen.getByText(/remove from favorites/i)).toBeInTheDocument();
});