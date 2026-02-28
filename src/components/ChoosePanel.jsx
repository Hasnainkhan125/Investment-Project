import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const ChoosePanel = () => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

  const [showRequestForm, setShowRequestForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [requestStatus, setRequestStatus] = useState("");
  const [approved, setApproved] = useState(false);

  const [name, setName] = useState(currentUser.name || "");
  const [email, setEmail] = useState(currentUser.email || "");
  const [password, setPassword] = useState("");
  const [requestMessage, setRequestMessage] = useState("");

  const ADMIN_CREDENTIALS = {
    email: "admin@gmail.com",
    password: "admin123",
  };

  // Check request status
  const checkRequestStatus = () => {
    const storedRequests = JSON.parse(localStorage.getItem("adminRequests") || "[]");
    const userRequest = storedRequests.find(req => req.email === currentUser.email);
    const admins = JSON.parse(localStorage.getItem("admins") || "[]");

    if (userRequest) {
      setRequestStatus(userRequest.status);
      if (userRequest.status === "Approved" && admins.includes(currentUser.email)) {
        setApproved(true);
        setSnackbarMessage("🎉 Your request is approved! You can now open your dashboard.");
        setSnackbarOpen(true);
      }
    }
  };

  // Polling to detect approval in same tab
  useEffect(() => {
    checkRequestStatus();
    const interval = setInterval(checkRequestStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRequestSubmit = () => {
    if (!name || !email || !password || !requestMessage.trim()) return;

    setLoading(true);
    setTimeout(() => {
      const storedRequests = JSON.parse(localStorage.getItem("adminRequests") || "[]");
      storedRequests.push({
        id: Date.now(),
        name,
        email,
        password,
        message: requestMessage,
        date: new Date().toLocaleString(),
        status: "Pending",
      });
      localStorage.setItem("adminRequests", JSON.stringify(storedRequests));

      setLoading(false);
      setRequestStatus("Pending");
      setSnackbarMessage("✅ Request sent! Wait for approval.");
      setSnackbarOpen(true);
      setShowRequestForm(false);

      setName("");
      setEmail("");
      setPassword("");
      setRequestMessage("");
    }, 1500);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #f0f2f5, #d9e2ec)",
        p: 2,
      }}
    >
      <Paper
        elevation={12}
        sx={{
          width: { xs: "95%", sm: "450px" },
          textAlign: "center",
          borderRadius: 3,
          p: { xs: 3, sm: 5 },
          boxShadow: "0px 10px 30px rgba(0,0,0,0.1)",
        }}
      >
        <Typography variant="h4" fontWeight={700} mb={4} color="#1976d2">
          Choose Your Panel
        </Typography>

        {/* Approved Panel */}
        {approved ? (
          <Box>
            <Typography variant="h6" mb={3} sx={{ color: "#2e7d32", fontWeight: 600 }}>
              ✅ Your request is approved!
            </Typography>
            <TextField
              fullWidth
              label="Admin Email"
              value={ADMIN_CREDENTIALS.email}
              sx={{ mb: 2 }}
              InputProps={{ readOnly: true }}
            />
            <TextField
              fullWidth
              label="Admin Password"
              value={ADMIN_CREDENTIALS.password}
              sx={{ mb: 2 }}
              InputProps={{ readOnly: true }}
            />
            <Typography mb={3} color="text.secondary">
              You can now open your dashboard.
            </Typography>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mb: 2 }}
              onClick={() => navigate("/admin-dashboard")}
            >
              Go to Dashboard
            </Button>
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate("/login")}
              sx={{ mt: 2, display: "block", color: "#1976d2" }}
            >
              Not now? Go to Login
            </Link>
          </Box>
        ) : requestStatus === "Pending" ? (
          <Typography variant="h6" mb={2}>
            ⏳ Your request is pending. Please wait for approval.
          </Typography>
        ) : !showRequestForm ? (
          <>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={() => setShowRequestForm(true)}
              sx={{ mb: 2 }}
            >
              Request Admin Access
            </Button>
            <Button
              fullWidth
              variant="outlined"
              color="secondary"
              onClick={() => navigate("/user-dashboard")}
            >
              Go to Store
            </Button>
          </>
        ) : (
          <>
            <Typography variant="h6" mb={3} color="#1976d2">
              Request Admin Access
            </Typography>
            <TextField
              fullWidth
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              multiline
              minRows={3}
              label="Request Message"
              placeholder="Write your request..."
              value={requestMessage}
              onChange={(e) => setRequestMessage(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleRequestSubmit}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Send Request"}
            </Button>
          </>
        )}
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert severity="info">{snackbarMessage}</Alert>
      </Snackbar>
    </Box>
  );
};

export default ChoosePanel;










