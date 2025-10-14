// favorites.test.js
import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import Favorites from "./favorites";
import favoritesReducer from "../reducers/favoritesReducer";

const createMockStore = (initialState) =>
  configureStore({
    reducer: {
      favorites: favoritesReducer,
    },
    preloadedState: initialState,
  });

test("renders Favorite component", () => {
  const initialState = {
    favorites: {
      items: [
        {
          id: 1,
          title: "Sample Favorite Item",
          price: 29.99,
          image: "test.jpg",
        },
      ],
    },
  };
  const store = createMockStore(initialState);

  render(
    <Provider store={store}>
      <BrowserRouter>
        <Favorites />
      </BrowserRouter>
    </Provider>
  );

  expect(screen.getByText(/sample favorite item/i)).toBeInTheDocument();
});
