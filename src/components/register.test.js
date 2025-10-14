import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Register from "./register";

describe("Register", () => {
  const mockOnBackToLogin = jest.fn();

  beforeEach(() => {
    mockOnBackToLogin.mockClear();
  });

  test("renders registration form elements", () => {
    render(<Register onBackToLogin={mockOnBackToLogin} />);

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /register/i })
    ).toBeInTheDocument();
  });

  test("updates input values on change", () => {
    render(<Register onBackToLogin={mockOnBackToLogin} />);

    const usernameInput = screen.getByLabelText(/username/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(usernameInput, { target: { value: "newuser" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(usernameInput.value).toBe("newuser");
    expect(emailInput.value).toBe("test@example.com");
    expect(passwordInput.value).toBe("password123");
  });

  test("handles form submission", async () => {
    render(<Register onBackToLogin={mockOnBackToLogin} />);

    const usernameInput = screen.getByLabelText(/username/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const registerButton = screen.getByRole("button", { name: /register/i });

    fireEvent.change(usernameInput, { target: { value: "newuser" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(registerButton);

    await waitFor(() => {
      expect(screen.getByText(/registration successful/i)).toBeInTheDocument();
    });
  });

  test("calls onBackToLogin when back button is clicked", () => {
    render(<Register onBackToLogin={mockOnBackToLogin} />);

    const backButton = screen.getByRole("button", { name: /back to login/i });
    fireEvent.click(backButton);

    expect(mockOnBackToLogin).toHaveBeenCalledTimes(1);
  });
});
