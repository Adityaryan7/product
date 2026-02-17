import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "../context/SnackbarContext";

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { showSuccess, showError } = useSnackbar();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!username || !password) {
        throw new Error("Username and password are required");
      }

      const res = await fetch("https://fakestoreapi.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!res.ok) throw new Error("Invalid username or password");

      const data = await res.json();
      localStorage.setItem("token", data.token);
      showSuccess("Login successful!");
      onLoginSuccess(data.token);
      navigate("/");
    } catch (err) {
      setError(err.message);
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const goToRegister = () => {
    navigate("/register");
  };

  const goToForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          width: 360,
          textAlign: "center",
          borderRadius: 3,
        }}
      >
        <Typography variant="h5" fontWeight="bold" mb={2}>
          Login
        </Typography>

        <form onSubmit={handleLogin}>
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {error}
            </Alert>
          )}

          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2, py: 1 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
          </Button>

          <Typography variant="body2" color="text.secondary" mt={2}>
            Demo credentials:
            <br /> <strong>Username:</strong> mor_2314
            <br /> <strong>Password:</strong> 83r5^_
          </Typography>

          <Button
            fullWidth
            variant="text"
            sx={{ mt: 2 }}
            onClick={goToRegister}
          >
            Create New Account
          </Button>

          <Button
            fullWidth
            variant="text"
            sx={{ mt: 0 }}
            onClick={goToForgotPassword}
          >
            Forgot Password?
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;
