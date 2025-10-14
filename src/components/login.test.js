import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Login from "./login";

// Mock localStorage
const localStorageMock = {
  setItem: jest.fn(),
};
global.localStorage = localStorageMock;

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("Login", () => {
  const mockOnLoginSuccess = jest.fn();

  beforeEach(() => {
    mockOnLoginSuccess.mockClear();
    localStorageMock.setItem.mockClear();
  });

  test("renders login form elements", () => {
    renderWithRouter(<Login onLoginSuccess={mockOnLoginSuccess} />);

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  test("updates input values on change", () => {
    renderWithRouter(<Login onLoginSuccess={mockOnLoginSuccess} />);

    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(usernameInput.value).toBe("testuser");
    expect(passwordInput.value).toBe("password123");
  });

  test("handles form submission", async () => {
    renderWithRouter(<Login onLoginSuccess={mockOnLoginSuccess} />);

    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole("button", { name: /login/i });

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(mockOnLoginSuccess).toHaveBeenCalled();
    });
  });

  test("navigates to register page", () => {
    renderWithRouter(<Login onLoginSuccess={mockOnLoginSuccess} />);

    const registerLink = screen.getByText(/register here/i);
    expect(registerLink).toBeInTheDocument();
  });

  test("navigates to forgot password page", () => {
    renderWithRouter(<Login onLoginSuccess={mockOnLoginSuccess} />);

    const forgotPasswordLink = screen.getByText(/forgot password/i);
    expect(forgotPasswordLink).toBeInTheDocument();
  });
});
