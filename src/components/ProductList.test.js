import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import ProductList from './productList';
import productsReducer from '../reducers/productsReducer';
import filtersReducer from '../reducers/filtersReducer';
import favoritesReducer from '../reducers/favoritesReducer';

const mockStore = configureStore({
  reducer: {
    products: productsReducer,
    filters: filtersReducer,
    favorites: favoritesReducer,
  },
  preloadedState: {
    products: {
      items: [
        { id: 1, title: 'Electronics Item', price: 99.99, category: 'electronics' },
        { id: 2, title: 'Clothing Item', price: 49.99, category: 'men\'s clothing' }
      ],
      status: 'succeeded'
    }
  }
});

describe('ProductList Integration Tests', () => {
  const renderWithProviders = (component) => {
    return render(
      <Provider store={mockStore}>
        <BrowserRouter>
          {component}
        </BrowserRouter>
      </Provider>
    );
  };

  test('renders product list and filters', () => {
    renderWithProviders(<ProductList />);

    expect(screen.getByPlaceholderText(/search products/i)).toBeInTheDocument();
    expect(screen.getByText(/all categories/i)).toBeInTheDocument();
    expect(screen.getByText(/sort by/i)).toBeInTheDocument();
    expect(screen.getByText(/electronics item/i)).toBeInTheDocument();
  });

  test('filters products by search term', async () => {
    renderWithProviders(<ProductList />);
    
    const searchInput = screen.getByPlaceholderText(/search products/i);
    fireEvent.change(searchInput, { target: { value: 'electronics' } });
    
    await waitFor(() => {
      expect(screen.getByText('Electronics Item')).toBeInTheDocument();
      expect(screen.queryByText('Clothing Item')).not.toBeInTheDocument();
    });
  });

  test('filters products by category', () => {
    renderWithProviders(<ProductList />);
    
    const categorySelect = screen.getByRole('combobox', { name: /category/i });
    fireEvent.change(categorySelect, { target: { value: 'electronics' } });
    
    expect(screen.getByText('Electronics Item')).toBeInTheDocument();
    expect(screen.queryByText('Clothing Item')).not.toBeInTheDocument();
  });

  test('sorts products by price', () => {
    renderWithProviders(<ProductList />);
    
    const sortSelect = screen.getByRole('combobox', { name: /sort/i });
    fireEvent.change(sortSelect, { target: { value: 'price-desc' } });
    
    const prices = screen.getAllByText(/\$\d+\.\d+/);
    expect(prices[0]).toHaveTextContent('$99.99');
    expect(prices[1]).toHaveTextContent('$49.99');
  });
});