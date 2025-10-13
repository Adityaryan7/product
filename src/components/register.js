import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";

const Register = ({ onBackToLogin }) => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    firstname: "",
    lastname: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("https://fakestoreapi.com/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          username: formData.username,
          password: formData.password,
          name: {
            firstname: formData.firstname,
            lastname: formData.lastname,
          },
          address: {
            city: "default city",
            street: "default street",
            number: 1,
            zipcode: "00000",
            geolocation: { lat: "0", long: "0" },
          },
          phone: "0000000000",
        }),
      });

      if (!res.ok) throw new Error("Error creating account");

      const data = await res.json();
      setSuccess("User registered successfully!");
      setFormData({
        email: "",
        username: "",
        password: "",
        firstname: "",
        lastname: "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
      <Paper elevation={6} sx={{ p: 4, width: 380, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight="bold" textAlign="center" mb={2}>
          Create New Account
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            name="firstname"
            label="First Name"
            margin="normal"
            value={formData.firstname}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            name="lastname"
            label="Last Name"
            margin="normal"
            value={formData.lastname}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            name="email"
            label="Email"
            type="email"
            margin="normal"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            name="username"
            label="Username"
            margin="normal"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            name="password"
            label="Password"
            type="password"
            margin="normal"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {error && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mt: 1 }}>
              {success}
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
            {loading ? <CircularProgress size={24} color="inherit" /> : "Register"}
          </Button>

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

export default Register;
