import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../reducers/cartReducer";
import { useSnackbar } from "../context/SnackbarContext";
import {
  Container,
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Divider,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PaymentIcon from "@mui/icons-material/Payment";

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: "calc(-50% + 16px)",
    right: "calc(50% + 16px)",
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#1976d2",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: "#eaeaf0",
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));

const QontoStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  color: "#eaeaf0",
  display: "flex",
  height: 22,
  alignItems: "center",
  ...(ownerState.active && {
    color: "#1976d2",
  }),
  "& .QontoStepIcon-completedIcon": {
    color: "#1976d2",
    zIndex: 1,
    fontSize: 18,
  },
  "& .QontoStepIcon-circle": {
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: "currentColor",
  },
}));

function QontoStepIcon(props) {
  const { active, completed, className } = props;

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <CheckCircleIcon className="QontoStepIcon-completedIcon" />
      ) : (
        <div className="QontoStepIcon-circle" />
      )}
    </QontoStepIconRoot>
  );
}

function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showSuccess, showError } = useSnackbar();
  const cartItems = useSelector((state) => state.cart.items);

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const [shippingData, setShippingData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const [paymentData, setPaymentData] = useState({
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h5" color="error" gutterBottom>
          Your cart is empty
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/")}
          sx={{ mt: 2 }}
        >
          Continue Shopping
        </Button>
      </Container>
    );
  }

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) =>
        total + item.product.price * parseInt(item.quantity || 1),
      0,
    );
  };

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentData((prev) => ({ ...prev, [name]: value }));
  };

  const validateShipping = () => {
    if (
      !shippingData.firstName ||
      !shippingData.lastName ||
      !shippingData.email ||
      !shippingData.address ||
      !shippingData.city ||
      !shippingData.state ||
      !shippingData.zipCode
    ) {
      showError("Please fill all shipping fields");
      return false;
    }
    return true;
  };

  const validatePayment = () => {
    if (
      !paymentData.cardName ||
      !paymentData.cardNumber ||
      !paymentData.expiryDate ||
      !paymentData.cvv
    ) {
      showError("Please fill all payment fields");
      return false;
    }
    if (paymentData.cardNumber.length !== 16) {
      showError("Card number must be 16 digits");
      return false;
    }
    if (paymentData.cvv.length !== 3) {
      showError("CVV must be 3 digits");
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (activeStep === 0) {
      if (validateShipping()) {
        setActiveStep(1);
      }
    } else if (activeStep === 1) {
      if (validatePayment()) {
        handlePlaceOrder();
      }
    }
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const newOrderId = `ORD-${Date.now()}`;
      setOrderId(newOrderId);
      setOrderPlaced(true);
      setActiveStep(2);

      showSuccess("Order placed successfully!");
      dispatch(clearCart());
    } catch (error) {
      showError("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const steps = ["Shipping", "Payment", "Confirmation"];

  if (orderPlaced) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Stepper
          activeStep={activeStep}
          connector={<QontoConnector />}
          sx={{ mb: 4 }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel StepIconComponent={QontoStepIcon}>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Paper
          sx={{
            p: 4,
            textAlign: "center",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            borderRadius: 2,
          }}
        >
          <CheckCircleIcon sx={{ fontSize: 80, mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Order Confirmed!
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Thank you for your purchase. Your order has been successfully
            placed.
          </Typography>
          <Typography variant="h6" sx={{ mb: 4 }}>
            Order ID: {orderId}
          </Typography>
          <Box sx={{ mb: 3, textAlign: "left", display: "inline-block" }}>
            <Typography variant="body2">
              <strong>Shipping to:</strong>
              <br />
              {shippingData.firstName} {shippingData.lastName}
              <br />
              {shippingData.address}
              <br />
              {shippingData.city}, {shippingData.state} {shippingData.zipCode}
            </Typography>
          </Box>
          <Box
            sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 4 }}
          >
            <Button
              variant="contained"
              sx={{ bgcolor: "white", color: "primary.main" }}
              onClick={() => navigate("/")}
            >
              Continue Shopping
            </Button>
            <Button
              variant="outlined"
              sx={{ borderColor: "white", color: "white" }}
            >
              Track Order
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
        Checkout
      </Typography>

      <Stepper
        activeStep={activeStep}
        connector={<QontoConnector />}
        sx={{ mb: 4 }}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel StepIconComponent={QontoStepIcon}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 4, borderRadius: 2 }}>
            {activeStep === 0 && (
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <LocalShippingIcon sx={{ mr: 2, color: "primary.main" }} />
                  <Typography variant="h6">Shipping Information</Typography>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      name="firstName"
                      value={shippingData.firstName}
                      onChange={handleShippingChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      name="lastName"
                      value={shippingData.lastName}
                      onChange={handleShippingChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      name="email"
                      value={shippingData.email}
                      onChange={handleShippingChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone"
                      name="phone"
                      value={shippingData.phone}
                      onChange={handleShippingChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address"
                      name="address"
                      value={shippingData.address}
                      onChange={handleShippingChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="City"
                      name="city"
                      value={shippingData.city}
                      onChange={handleShippingChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="State"
                      name="state"
                      value={shippingData.state}
                      onChange={handleShippingChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="Zip Code"
                      name="zipCode"
                      value={shippingData.zipCode}
                      onChange={handleShippingChange}
                      required
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            {activeStep === 1 && (
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <PaymentIcon sx={{ mr: 2, color: "primary.main" }} />
                  <Typography variant="h6">Payment Information</Typography>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Cardholder Name"
                      name="cardName"
                      value={paymentData.cardName}
                      onChange={handlePaymentChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Card Number"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={paymentData.cardNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        handlePaymentChange({
                          target: { name: "cardNumber", value },
                        });
                      }}
                      inputProps={{ maxLength: 16 }}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Expiry Date"
                      placeholder="MM/YY"
                      name="expiryDate"
                      value={paymentData.expiryDate}
                      onChange={handlePaymentChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="CVV"
                      type="password"
                      placeholder="123"
                      name="cvv"
                      value={paymentData.cvv}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        handlePaymentChange({
                          target: { name: "cvv", value },
                        });
                      }}
                      inputProps={{ maxLength: 3 }}
                      required
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
              {activeStep > 0 && (
                <Button
                  variant="outlined"
                  onClick={() => setActiveStep(activeStep - 1)}
                  disabled={loading}
                >
                  Back
                </Button>
              )}
              <Button
                variant="contained"
                onClick={handleNextStep}
                disabled={loading}
                sx={{ ml: "auto" }}
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                {loading
                  ? "Processing..."
                  : activeStep === 1
                    ? "Place Order"
                    : "Continue"}
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <Divider sx={{ my: 2 }} />

              {cartItems.map((item) => (
                <Box
                  key={item.product.id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2">
                    {item.product.title.substring(0, 30)}... x{item.quantity}
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </Typography>
                </Box>
              ))}

              <Divider sx={{ my: 2 }} />

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography>Subtotal</Typography>
                <Typography>${calculateTotal().toFixed(2)}</Typography>
              </Box>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography>Shipping</Typography>
                <Typography>Free</Typography>
              </Box>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <Typography>Tax</Typography>
                <Typography>${(calculateTotal() * 0.1).toFixed(2)}</Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h6" fontWeight={600}>
                  Total
                </Typography>
                <Typography variant="h6" color="primary" fontWeight={600}>
                  ${(calculateTotal() * 1.1).toFixed(2)}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          <Paper sx={{ p: 2, mt: 2, bgcolor: "#f5f5f5", borderRadius: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              ✓ Secure Checkout
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your payment information is encrypted and secure.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Checkout;
