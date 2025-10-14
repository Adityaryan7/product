import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ForgotPassword from "./forgotPassword";

describe("ForgotPassword", () => {
  const mockOnBackToLogin = jest.fn();

  beforeEach(() => {
    mockOnBackToLogin.mockClear();
  });

  test("renders forgot password form", () => {
    render(<ForgotPassword onBackToLogin={mockOnBackToLogin} />);

    expect(screen.getByText("Forgot Password")).toBeInTheDocument();

    // Try multiple ways to find the email input
    const emailInput =
      screen.getByDisplayValue("") ||
      screen.getByRole("textbox") ||
      screen.getByLabelText(/email/i);
    expect(emailInput).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /send reset link/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /back to login/i })
    ).toBeInTheDocument();
  });

  test("updates email input value", () => {
    render(<ForgotPassword onBackToLogin={mockOnBackToLogin} />);

    const emailInput = screen.getByRole("textbox");
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    expect(emailInput.value).toBe("test@example.com");
  });

  test("shows success message after form submission", async () => {
    render(<ForgotPassword onBackToLogin={mockOnBackToLogin} />);

    const emailInput = screen.getByRole("textbox");
    const submitButton = screen.getByRole("button", {
      name: /send reset link/i,
    });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(
          /password reset link has been sent to test@example.com/i
        )
      ).toBeInTheDocument();
    });
  });

  test("calls onBackToLogin when back button is clicked", () => {
    render(<ForgotPassword onBackToLogin={mockOnBackToLogin} />);

    const backButton = screen.getByRole("button", { name: /back to login/i });
    fireEvent.click(backButton);

    expect(mockOnBackToLogin).toHaveBeenCalledTimes(1);
  });
});
