import { configureStore } from "@reduxjs/toolkit";
import productsReducer, { fetchProducts } from "../reducers/productsReducer";
import cartReducer, {
  addToCartSuccess,
  clearCart,
} from "../reducers/cartReducer";

// Mock fetch for integration tests
global.fetch = jest.fn();

describe("Integration Tests", () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        products: productsReducer,
        cart: cartReducer,
      },
    });
    fetch.mockClear();
  });

  test("should fetch products and add to cart workflow", async () => {
    // Mock API response
    const mockProducts = [
      { id: 1, title: "Product 1", price: 10.99 },
      { id: 2, title: "Product 2", price: 20.99 },
    ];

    fetch.mockResolvedValueOnce({
      json: async () => mockProducts,
    });

    // Fetch products
    await store.dispatch(fetchProducts());

    // Verify fetch URL
    expect(fetch).toHaveBeenCalledWith("https://fakestoreapi.com/products");

    // Verify products are loaded
    const productsState = store.getState().products;
    expect(productsState.status).toBe("succeeded");
    expect(productsState.items).toEqual(mockProducts);

    // Add product to cart
    store.dispatch(addToCartSuccess(mockProducts[0]));

    // Verify cart state
    const cartState = store.getState().cart;
    expect(cartState.items).toHaveLength(1);
    expect(cartState.items[0].product).toEqual(mockProducts[0]);
    expect(cartState.items[0].quantity).toBe(1);
  });

  test("should handle multiple cart operations", () => {
    const product1 = { id: 1, title: "Product 1", price: 10.99 };
    const product2 = { id: 2, title: "Product 2", price: 20.99 };

    // Add products to cart
    store.dispatch(addToCartSuccess(product1));
    store.dispatch(addToCartSuccess(product2));
    store.dispatch(addToCartSuccess(product1)); // Add same product again

    let cartState = store.getState().cart;
    expect(cartState.items).toHaveLength(2);
    expect(cartState.items[0].quantity).toBe(2); // Product 1 quantity increased
    expect(cartState.items[1].quantity).toBe(1); // Product 2 added once

    // Clear cart
    store.dispatch(clearCart());
    cartState = store.getState().cart;
    expect(cartState.items).toHaveLength(0);
  });
});
