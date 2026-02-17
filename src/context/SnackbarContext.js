import React, { createContext, useCallback, useState } from "react";
import { Snackbar, Alert } from "@mui/material";

export const SnackbarContext = createContext();

export const SnackbarProvider = ({ children }) => {
  const [snackbars, setSnackbars] = useState([]);

  const showSnackbar = useCallback(
    (message, severity = "info", duration = 3000) => {
      const id = Date.now();
      const newSnackbar = { id, message, severity, duration };
      setSnackbars((prev) => [...prev, newSnackbar]);

      if (duration > 0) {
        setTimeout(() => {
          removeSnackbar(id);
        }, duration);
      }

      return id;
    },
    [],
  );

  const removeSnackbar = useCallback((id) => {
    setSnackbars((prev) => prev.filter((sb) => sb.id !== id));
  }, []);

  const showSuccess = useCallback(
    (message, duration = 3000) => showSnackbar(message, "success", duration),
    [showSnackbar],
  );

  const showError = useCallback(
    (message, duration = 5000) => showSnackbar(message, "error", duration),
    [showSnackbar],
  );

  const showWarning = useCallback(
    (message, duration = 4000) => showSnackbar(message, "warning", duration),
    [showSnackbar],
  );

  const showInfo = useCallback(
    (message, duration = 3000) => showSnackbar(message, "info", duration),
    [showSnackbar],
  );

  const value = {
    showSnackbar,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeSnackbar,
  };

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      {snackbars.map((snackbar) => (
        <Snackbar
          key={snackbar.id}
          open={true}
          autoHideDuration={snackbar.duration}
          onClose={() => removeSnackbar(snackbar.id)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          sx={{
            "& .MuiSnackbar-root": {
              bottom: {
                xs: 60 + snackbars.indexOf(snackbar) * 80,
                sm: 20 + snackbars.indexOf(snackbar) * 80,
              },
            },
          }}
        >
          <Alert
            onClose={() => removeSnackbar(snackbar.id)}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
            variant="filled"
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      ))}
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const context = React.useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar must be used within SnackbarProvider");
  }
  return context;
};
