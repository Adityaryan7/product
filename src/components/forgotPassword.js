import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
} from "@mui/material";

const ForgotPassword = ({ onBackToLogin }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Fake behavior (since fakestoreapi doesn’t support password reset)
    setMessage(
      `Password reset link has been sent to ${email} (demo simulation).`
    );
    setEmail("");
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)",
      }}
    >
      <Paper elevation={6} sx={{ p: 4, width: 360, borderRadius: 3 }}>
        <Typography variant="h5" textAlign="center" fontWeight="bold" mb={2}>
          Forgot Password
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Enter your email"
            type="email"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            sx={{ mt: 2, py: 1 }}
          >
            Send Reset Link
          </Button>

          {message && (
            <Alert severity="info" sx={{ mt: 2 }}>
              {message}
            </Alert>
          )}

          <Button
            fullWidth
            variant="text"
            sx={{ mt: 2 }}
            onClick={onBackToLogin}
          >
            Back to Login
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default ForgotPassword;
