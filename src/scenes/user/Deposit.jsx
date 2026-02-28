import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Chip,
  InputAdornment,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  Snackbar,
  Alert,
  Slide,
} from "@mui/material";
import {
  AccountBalanceWallet as AccountBalanceWalletIcon,
  ReceiptLong as ReceiptLongIcon,
  History as HistoryIcon,
  AttachMoney as AttachMoneyIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { FaWallet } from "react-icons/fa";
import { MdPayment } from "react-icons/md";

const currentUserId = "CURRENT_USER_ID";

// Smooth slide animation
const SlideTransition = (props) => {
  return <Slide {...props} direction="down" />;
};

const Deposit = ({ darkMode }) => {
  const [form, setForm] = useState({ amount: "", trx: "" });
  const [auditHistory, setAuditHistory] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [loading, setLoading] = useState(false);
  const [clearLoading, setClearLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const paymentMethods = [
    {
      name: "Easypaisa",
      user: "Muhammad Saad",
      number: "03001234567",
      icon: FaWallet,
      color: "#00a651",
    },
    {
      name: "JazzCash",
      user: "Muhammad Saad",
      number: "03117654321",
      icon: MdPayment,
      color: "#ed1c24",
    },
  ];

  const handleChange = (key, value) =>
    setForm({ ...form, [key]: value });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchDeposits = async () => {
    try {
      const res = await fetch(
        "http://localhost:4000/api/deposits?userId=" + currentUserId
      );
      const data = await res.json();
      setAuditHistory(Array.isArray(data) ? data.reverse() : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDeposits();
    const interval = setInterval(fetchDeposits, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async () => {
    if (!form.amount || !form.trx || !selectedMethod) {
      showSnackbar("Enter all fields and select a method", "warning");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/api/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method: selectedMethod.name,
          amount: Number(form.amount),
          trx: form.trx,
          userId: currentUserId,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setAuditHistory((prev) => [data.deposit, ...prev]);
        setForm({ amount: "", trx: "" });
        showSnackbar("Deposit submitted successfully!", "success");
      } else {
        showSnackbar(data.message || "Deposit failed", "error");
      }
    } catch {
      showSnackbar("Deposit error", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    setClearLoading(true);
    try {
      const res = await fetch(
        "http://localhost:4000/api/deposits/clear",
        { method: "DELETE" }
      );
      const data = await res.json();

      if (data.success) {
        setAuditHistory([]);
        showSnackbar("History cleared successfully!", "success");
      }
    } catch {
      showSnackbar("Failed to clear history", "error");
    } finally {
      setClearLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "warning";
      case "Approved":
        return "success";
      case "Rejected":
      case "Failed":
        return "error";
      default:
        return "default";
    }
  };

  const getIcon = () => {
    switch (snackbar.severity) {
      case "success":
        return <CheckCircleIcon />;
      case "error":
        return <ErrorOutlineIcon />;
      case "warning":
        return <WarningAmberIcon />;
      default:
        return <InfoOutlinedIcon />;
    }
  };

  const filteredHistory =
    filterStatus === "All"
      ? auditHistory
      : auditHistory.filter((d) => d.status === filterStatus);

  return (
    <Box sx={{ minHeight: "100vh",  }}>
      {/* Snackbar */}
<Snackbar
  open={snackbar.open}
  autoHideDuration={2500}
  onClose={() => setSnackbar({ ...snackbar, open: false })}
  anchorOrigin={{ vertical: "top", horizontal: "center" }}
  TransitionComponent={SlideTransition}
>
  <Alert
    onClose={() => setSnackbar({ ...snackbar, open: false })}
    icon={getIcon()}
    severity={snackbar.severity}
    variant="filled"
    sx={{
      width: "90vw",
      maxWidth: 300,
      borderRadius: 12,
      fontWeight: 500,
      fontSize: 13,
      px: 2,
      py: 1.5,
      display: "flex",
      alignItems: "center", 
      gap: 1,
      backdropFilter: "blur(12px)",
      backgroundColor: darkMode ? "#edecec" : "#f0f0f0",
      color: "#111",
      boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
    }}
  >
    {snackbar.message}
  </Alert>
</Snackbar>

      <Grid container spacing={4}>
        {/* LEFT SIDE */}
        <Grid item xs={12} md={7}>
          <Box sx={{ p: 4, }}>
  {/* Main Heading */}
  <Typography
    sx={{
      fontSize: 32,
      fontWeight: 800,
      textTransform: "uppercase",
      letterSpacing: 1,
      display: "inline-block",
      pb: 1,
    }}
  >
    Deposit Portal
  </Typography>

  <Typography sx={{ mb: 4 }}>
    Add funds and track your deposits securely.
  </Typography>

  <Grid container spacing={4}>
    {/* Your existing left and right grids go here */}
  </Grid>
</Box>
          {/* Payment Methods */}
          <Paper
            sx={{
              p: 3,
              borderRadius: 4,
              mb: 4,
            }}
          >
            
            <Typography
              sx={{
                fontWeight: 700,
                mb: 3,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <AccountBalanceWalletIcon />
              Payment Channels
            </Typography>

            {paymentMethods.map((item, i) => (
              <Paper
                key={i}
                onClick={() =>
                  setSelectedMethod(item)
                }
                sx={{
                  p: 3,
                  mb: 2,
                  borderRadius: 3,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                  border:
                    selectedMethod?.name ===
                    item.name
                      ? `2px solid ${item.color}`
                      : "1px solid #e5e7eb",
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: `0 8px 25px ${item.color}40`,
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: 45,
                      height: 45,
                      borderRadius: 2,
                      background: `${item.color}20`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <item.icon
                      size={22}
                      color={item.color}
                    />
                  </Box>
                  <Box>
                    <Typography fontWeight={700}>
                      {item.name}
                    </Typography>
                    <Typography fontSize={14}>
                      {item.user}
                    </Typography>
                  </Box>
                </Box>
                <Typography
                  fontWeight={700}
                  color={item.color}
                >
                  {item.number}
                </Typography>
              </Paper>
            ))}
          </Paper>

          {/* Submit Section */}
<Paper
  elevation={0}
  sx={{
    p: 4,
    borderRadius: "20px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 10px 40px rgba(0,0,0,0.06)",
    background:' rgb(30, 28, 28)',
  }}
>
  <Typography
    sx={{
      fontWeight: 700,
      fontSize: 18,
      mb: 3,
      display: "flex",
      alignItems: "center",
      gap: 1.5,
    }}
  >
    <ReceiptLongIcon sx={{ color: "#f59e0b" }} />
    Submit Transaction
  </Typography>

  {/* Amount Field */}
  <TextField
    fullWidth
    placeholder="Enter Amount (PKR)"
    type="number"
    value={form.amount}
    onChange={(e) => handleChange("amount", e.target.value)}
    sx={{
      mb: 3,
      "& .MuiOutlinedInput-root": {
        borderRadius: "14px",
      },
    }}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <AttachMoneyIcon sx={{ color: "#9ca3af" }} />
        </InputAdornment>
      ),
    }}
  />

  {/* TRX Field */}
  <TextField
    fullWidth
    placeholder="Enter Transaction TRX ID"
    value={form.trx}
    onChange={(e) => handleChange("trx", e.target.value)}
    sx={{
      mb: 4,
      "& .MuiOutlinedInput-root": {
        borderRadius: "14px",
      },
    }}
  />

  {/* Submit Button */}
  <Button
    fullWidth
    onClick={handleSubmit}
    disabled={loading}
    sx={{
      py: 1.6,
      borderRadius: "14px",
      fontWeight: 600,
      fontSize: 14,
      textTransform: "none",
        background: "linear-gradient(90deg, #ea580c, #f59e0b)",
      color: "#ffffff",
      transition: "0.3s ease",
      "&:hover": {
        background: "linear-gradient(90deg, #ea580c, #f59e0b)",
        transform: "translateY(-2px)",
      },
    }}
  >
    {loading ? (
      <CircularProgress size={22} sx={{ color: "#fff" }} />
    ) : (
      "Initialize Verification"
    )}
  </Button>
</Paper>
        </Grid>

        {/* RIGHT SIDE - MODERN HISTORY */}
        <Grid item xs={12} md={5}>
          <Paper
            sx={{
              borderRadius: 4,
              display: "flex",
              flexDirection: "column",
              minHeight: 550,
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <Box
              sx={{
                p: 2,  
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                borderBottom:
                  "1px solid rgba(0,0,0,0.08)",
              }}
            >
        <Typography
  sx={{
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    gap: 2,
    fontSize: 20,
    letterSpacing: 1,
    color: "#f59e0b",           // neon cyan color
  }}
>
  <HistoryIcon sx={{ fontSize: 24, color: "#f59e0b" }} />  {/* neon green icon */}
  Audit History
</Typography>

              <Button
                size="small"
                color="error"
                startIcon={
                  clearLoading ? (
                    <CircularProgress
                      size={16}
                    />
                  ) : (
                    <DeleteIcon />
                  )
                }
                disabled={clearLoading}
                onClick={
                  handleClearHistory
                }
              >
                {clearLoading
                  ? "Clearing..."
                  : "Clear"}
              </Button>
            </Box>

            {/* Filter */}
  <Box sx={{ p: 2, borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
  <FormControl fullWidth>
    <Select
      value={filterStatus}
      onChange={(e) => setFilterStatus(e.target.value)}
      displayEmpty
      sx={{
        borderRadius: 2,
        background: "#f3f4f6", // Light mode background
        color: "#111827",       // Text color
        fontWeight: 600,
        "& .MuiOutlinedInput-notchedOutline": { border: "none" },
        "& .MuiSelect-select": { padding: "10px 14px" },
        "&:hover": { background: "#e5e7eb" }, // hover effect
        "& .MuiSvgIcon-root": { color: "#6b7280" }, // arrow color
      }}
    >
      <MenuItem value="All">All Transactions</MenuItem>
      <MenuItem value="Pending">Pending</MenuItem>
      <MenuItem value="Approved">Approved</MenuItem>
      <MenuItem value="Rejected">Rejected</MenuItem>
      <MenuItem value="Failed">Failed</MenuItem>
    </Select>
  </FormControl>
</Box>

            {/* Scrollable History */}
            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                p: 2,
              }}
            >
              {filteredHistory.length === 0 ? (
                <Typography
                  textAlign="center"
                  mt={5}
                >
                  No transactions yet
                </Typography>
              ) : (
                filteredHistory.map(
                  (item) => {
                    const isEasy =
                      item.method ===
                      "Easypaisa";
                    const methodColor =
                      isEasy
                        ? "#00a651"
                        : "#ed1c24";
                    const MethodIcon =
                      isEasy
                        ? FaWallet
                        : MdPayment;

                    return (
                      <Paper
                        key={item.id}
                        sx={{
                          p: 2.5,
                          mb: 2,
                          borderRadius: 3,
                          display: "flex",
                          justifyContent:
                            "space-between",
                          alignItems: "center",
                          transition: "0.3s",
                          "&:hover": {
                            transform:
                              "translateY(-4px)",
                            boxShadow:
                              "0 8px 25px rgba(0,0,0,0.1)",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            gap: 2,
                            alignItems:
                              "center",
                          }}
                        >
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: 2,
                              background:
                                methodColor +
                                "20",
                              display: "flex",
                              alignItems:
                                "center",
                              justifyContent:
                                "center",
                            }}
                          >
                            <MethodIcon
                              size={20}
                              color={
                                methodColor
                              }
                            />
                          </Box>

                          <Box>
                            <Typography fontWeight={700}>
                              {
                                item.method
                              }
                            </Typography>
                            <Typography fontSize={13}>
                              PKR{" "}
                              {
                                item.amount
                              }
                            </Typography>
                            <Typography
                              fontSize={11}
                              color="gray"
                            >
                              TRX:{" "}
                              {
                                item.trx
                              }
                            </Typography>
                          </Box>
                        </Box>

                        <Chip
                          label={
                            item.status
                          }
                          color={getStatusColor(
                            item.status
                          )}
                          size="small"
                        />
                      </Paper>
                    );
                  }
                )
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Deposit;