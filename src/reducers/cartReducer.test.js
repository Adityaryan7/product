import cartReducer, {
  addToCartStart,
  addToCartSuccess,
  removeFromCartStart,
  removeFromCartSuccess,
  updateQuantity,
  clearCart,
} from "./cartReducer";

describe("cartReducer", () => {
  const initialState = {
    items: [],
    loading: false,
  };

  test("should return initial state", () => {
    expect(cartReducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  test("should handle addToCartStart", () => {
    const action = addToCartStart();
    const state = cartReducer(initialState, action);
    expect(state.loading).toBe(true);
  });

  test("should add new item to cart", () => {
    const product = { id: 1, title: "Test Product", price: 29.99 };
    const action = addToCartSuccess(product);
    const state = cartReducer(initialState, action);

    expect(state.items).toHaveLength(1);
    expect(state.items[0].product).toEqual(product);
    expect(state.items[0].quantity).toBe(1);
    expect(state.loading).toBe(false);
  });

  test("should increment quantity for existing item", () => {
    const product = { id: 1, title: "Test Product", price: 29.99 };
    const stateWithItem = {
      items: [{ product, quantity: 1 }],
      loading: false,
    };
    const action = addToCartSuccess(product);
    const state = cartReducer(stateWithItem, action);

    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(2);
  });

  test("should handle removeFromCartStart", () => {
    const action = removeFromCartStart();
    const state = cartReducer(initialState, action);
    expect(state.loading).toBe(true);
  });

  test("should remove item from cart", () => {
    const product = { id: 1, title: "Test Product", price: 29.99 };
    const stateWithItem = {
      items: [{ product, quantity: 1 }],
      loading: false,
    };
    const action = removeFromCartSuccess(product);
    const state = cartReducer(stateWithItem, action);

    expect(state.items).toHaveLength(0);
    expect(state.loading).toBe(false);
  });

  test("should update quantity of existing item", () => {
    const product = { id: 1, title: "Test Product", price: 29.99 };
    const stateWithItem = {
      items: [{ product, quantity: 1 }],
      loading: false,
    };
    const action = updateQuantity({ productId: 1, quantity: 5 });
    const state = cartReducer(stateWithItem, action);

    expect(state.items[0].quantity).toBe(5);
  });

  test("should clear all items from cart", () => {
    const stateWithItems = {
      items: [
        { product: { id: 1, title: "Product 1" }, quantity: 2 },
        { product: { id: 2, title: "Product 2" }, quantity: 1 },
      ],
      loading: false,
    };
    const action = clearCart();
    const state = cartReducer(stateWithItems, action);

    expect(state.items).toHaveLength(0);
  });
});
