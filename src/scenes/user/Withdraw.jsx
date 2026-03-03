import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Chip,
  InputAdornment,
  Snackbar,
  Alert,
  Slide,
} from "@mui/material";
import {
  ShieldOutlined as ShieldOutlinedIcon,
  History as HistoryIcon,
  AttachMoney as AttachMoneyIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

const SlideTransition = (props) => <Slide {...props} direction="down" />;

const Withdraw = () => {
  const [form, setForm] = useState({ name: "", account: "", amount: "" });
  const [method, setMethod] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [loading, setLoading] = useState(false);
  const [clearLoading, setClearLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  const paymentMethods = [
    { name: "Easypaisa", color: "#6dd669", icon: "https://incomix-world.vercel.app/images/easypaisa.png" },
    { name: "JazzCash", color: "#ea464b", icon: "https://incomix-world.vercel.app/images/jazzcash.png" },
  ];

  const colors = {
    card: "#ffffff",
    cardSoft: "#f7f7f7",
    border: "1px solid #e0e0e0",
    text: "#111111",
    subText: "#666666",
    accent: "#3c7ad1",
    accentLight: "#e0f0ff",
    buttonGradient: "linear-gradient(90deg, #3c7ad1, #50b5ff)",
  };

  const showSnackbar = (message, severity = "success") =>
    setSnackbar({ open: true, message, severity });

  const isValid = form.name && form.account && form.amount && method;

  const handleChange = (key, value) => setForm({ ...form, [key]: value });

  const handleSubmit = () => {
    if (!isValid) return showSnackbar("Fill all fields and select a method", "warning");

    const newTx = { id: Date.now(), ...form, method: method.name, status: "Pending" };
    setTransactions([newTx, ...transactions]);
    setForm({ name: "", account: "", amount: "" });
    setLoading(true);

    setTimeout(() => {
      const statuses = ["Approved", "Rejected"];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

      setTransactions((prev) =>
        prev.map((tx) => (tx.id === newTx.id ? { ...tx, status: randomStatus } : tx))
      );
      setLoading(false);
      showSnackbar(`Transaction ${randomStatus}`, randomStatus === "Approved" ? "success" : "error");
    }, 1500);
  };

  const handleClearHistory = () => {
    setClearLoading(true);
    setTimeout(() => {
      setTransactions([]);
      setClearLoading(false);
      showSnackbar("History cleared successfully!", "success");
    }, 1000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "warning";
      case "Approved": return "success";
      case "Rejected": return "error";
      default: return "default";
    }
  };

  const filteredHistory =
    filterStatus === "All" ? transactions : transactions.filter((tx) => tx.status === filterStatus);

  const inputSx = {
    mb: 2.4,
    "& .MuiOutlinedInput-root": {
      borderRadius: "25px",
      border: '2px solid #57adf4a7',
      backgroundColor: colors.cardSoft,
      color: colors.text,
      transition: "all 0.3s ease",
      "& fieldset": { borderColor: colors.border, borderWidth: "1.5px" },
      "&:hover fieldset": { borderColor: colors.accent },
      "&.Mui-focused fieldset": { borderColor: colors.accent, boxShadow: `0 0 0 3px ${colors.accentLight}` },
    },
    "& input": { fontWeight: 600, padding: "19px" },
    "& label": { fontWeight: 600, color: colors.subText },
  };

  return (
    <Box sx={{ minHeight: "100vh",  }}>
<Typography
  fontSize={{ xs: 26, sm: 30, md: 36 }} // responsive font size
  fontFamily="Inter, sans-serif" // modern, clean font
  mb={3}
  textAlign="center"
  sx={{
    background: "linear-gradient(90deg, #4f46e5, #3b82f6)", // gradient text
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    letterSpacing: 2, // adds modern spacing
    textShadow: "0 2px 8px rgba(0,0,0,0.1)", // subtle depth
  }}
>
  Withdraw Portal
</Typography>
      <Typography mb={3}       fontSize={{ xs: 13, sm: 14 }} textAlign="center" color={colors.subText}>
        Liquidate generated dividends securely.
      </Typography>

              <Paper sx={{ p: 3, mb: 4, borderRadius: 3, display: "flex", alignItems: "center", gap: 2, border: colors.border, background: colors.card }}>
            <ShieldOutlinedIcon sx={{ color: "#f59e0b", fontSize: 28 }} />
            <Box>
              <Typography sx={{ fontWeight: 700,  color: colors.text }}>AUDIT NOTICE</Typography>
              <Typography sx={{ fontSize: 13, color: colors.subText }}>
                Minimum withdrawal threshold: <b>60 PKR</b>
              </Typography>
            </Box>
          </Paper>
          {/* Deposit Instructions */}
    <Paper
  sx={{
    p: 3,
    borderRadius: 4,
    mb: 3,
    background: "linear-gradient(135deg, #fdfbfb, #e2e8f0)", // soft modern gradient
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.08)", // smooth shadow
    border: "1px solid rgba(0,0,0,0.05)",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-3px)",
      boxShadow: "0 15px 35px rgba(0, 0, 0, 0.12)",
    },
  }}
>
  <Typography fontWeight={700} mb={2}             fontSize={{ xs: 16, sm: 18, md: 20 }} color="#4b5563">
Withdrawal Instructions
  </Typography>

  <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8 }}>
    <Typography fontSize={14} color="#6b7280">• Processing time: 10-30 minutes</Typography>
    <Typography fontSize={14} color="#6b7280">• Make sure your account details are correct</Typography>
    <Typography fontSize={14} color="#6b7280">• Withdrawals are processed 24/7</Typography>
    <Typography fontSize={14} color="#6b7280">• Incase any issue you can contact support</Typography>

  </Box>
</Paper>

      <Grid container spacing={4}>
        {/* LEFT SIDE - Form */}
        <Grid item xs={12} md={6}>
          {/* Audit Notice */}
  

          {/* Withdrawal Form */}
          <Paper sx={{ p: 4, borderRadius: 3, background: colors.card, border: colors.border, boxShadow: "0 6px 20px rgba(0,0,0,0.05)" }}>
            <Typography sx={{ fontWeight: 700, mb: 3, color: colors.accent, fontSize: 20, textAlign: "center", textTransform: "uppercase" }}>
              Withdrawal Method
            </Typography>

            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
              {paymentMethods.map((m) => (
                <Button
                  key={m.name}
                  onClick={() => setMethod(m)}
                  sx={{
                    flex: 1,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 700,
                    
                    borderColor: method?.name === m.name ? m.color : colors.border,
                    color: method?.name === m.name ? "#fff" : m.color,
                    background: method?.name === m.name ? m.color : colors.cardSoft,
                    "&:hover": { background: method?.name === m.name ? m.color : colors.accentLight },
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    justifyContent: "center",
                  }}
                  startIcon={<img src={m.icon} alt={m.name} style={{ width: 44, height: 44, borderRadius: 6 }} />}
                >
                  {m.name}
                </Button>
              ))}
            </Box>

            <TextField
              fullWidth
              label="Account Name"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              sx={inputSx}
            />
            <TextField
              fullWidth
              label="Account Number"
              value={form.account}
              onChange={(e) => handleChange("account", e.target.value)}
              sx={inputSx}
            />
            <TextField
              fullWidth
              type="number"
              label="Amount"
              value={form.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><AttachMoneyIcon sx={{ color: colors.accent }} /></InputAdornment> }}
              sx={inputSx}
            />

            <Button
              fullWidth
              disabled={!isValid || loading}
              onClick={handleSubmit}
              sx={{ mt: 1, py: 1.5, borderRadius: "20px",    fontSize: { xs: 14, sm: 16 }, background: colors.buttonGradient, color: "#fff", textTransform: "uppercase" }}
            >
              {loading ? "Processing..." : "Submit Withdrawal"}
            </Button>
          </Paper>
        </Grid>

        {/* RIGHT SIDE - History */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ borderRadius: 4, display: "flex", flexDirection: "column", minHeight: 600, overflow: "hidden", background: colors.card, boxShadow: "0 6px 20px rgba(0,0,0,0.05)" }}>
            <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: colors.border }}>
              <Typography sx={{ fontWeight: 700, display: "flex", alignItems: "center", gap: 1, fontSize: 18, color: colors.accent }}>
                <HistoryIcon /> Transaction History
              </Typography>
              <Button size="small" color="error" startIcon={clearLoading ? <CircularProgress size={16} /> : <DeleteIcon />} onClick={handleClearHistory} disabled={clearLoading}>
                {clearLoading ? "Clearing..." : "Clear"}
              </Button>
            </Box>

            {/* Filter */}
            <Box sx={{ p: 2, borderBottom: colors.border, display: "flex", gap: 1.5, flexWrap: "wrap", background: "#fafafa" }}>
              {["All", "Pending", "Approved", "Rejected"].map((status) => {
                const active = filterStatus === status;
                const colorMap = { All: "#6366f1", Pending: "#f59e0b", Approved: "#10b981", Rejected: "#ef4444" };
                return (
 <Button
  key={status}
  onClick={() => setFilterStatus(status)}
  size="small"
  sx={{
    flexGrow: { xs: 1, sm: 0 },          // stretch on mobile
    width: { xs: "48%", sm: "auto" },    // 2 per row on mobile
    minWidth: { xs: "48%", sm: "auto" },
    px: { xs: 1.2, sm: 1.7 },
    py: { xs: 0.7, sm: 0.8 },
    fontSize: { xs: 12, sm: 13 },
    fontWeight: 600,
    borderRadius: "30px",
    textTransform: "none",
    whiteSpace: "nowrap",
    background: active
      ? `linear-gradient(135deg, ${colorMap[status]}, ${colorMap[status]}cc)`
      : "#ffffff",
    color: active ? "#fff" : "#374151",
    border: active ? "none" : "1px solid #e5e7eb",
    boxShadow: active
      ? `0 6px 18px ${colorMap[status]}40`
      : "none",
    transition: "all 0.25s ease",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: `0 6px 18px ${colorMap[status]}30`,
    },
  }}
>
  {status}
</Button>
                );
              })}
            </Box>

            {/* Scrollable history */}
            <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
              {filteredHistory.length === 0 ? (
                <Typography textAlign="center" mt={5} color={colors.subText}>
                  No transactions yet
                </Typography>
              ) : (
                filteredHistory.map((tx) => {
                  const methodColor = tx.method === "Easypaisa" ? "#00a651" : "#ed1c24";
                  const iconUrl = tx.method === "Easypaisa"
                    ? "https://incomix-world.vercel.app/images/easypaisa.png"
                    : "https://incomix-world.vercel.app/images/jazzcash.png";
                  return (
                    <Paper key={tx.id} sx={{ p: 2.5, mb: 2, borderRadius: 3, display: "flex", justifyContent: "space-between", alignItems: "center", background: colors.cardSoft }}>
                      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                        <img src={iconUrl} alt={tx.method} style={{ width: 30, height: 30 }} />
                        <Box>
                          <Typography fontWeight={700}>{tx.method} - PKR {tx.amount}</Typography>
                          <Typography fontSize={12} color={colors.subText}>{tx.name} | {tx.account}</Typography>
                        </Box>
                      </Box>
                      <Chip label={tx.status} color={getStatusColor(tx.status)} size="small" sx={{ backgroundColor: methodColor + "20" }} />
                    </Paper>
                  );
                })
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar open={snackbar.open} autoHideDuration={2500} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: "top", horizontal: "center" }} TransitionComponent={SlideTransition}>
        <Alert severity={snackbar.severity} variant="filled" sx={{ width: 300, borderRadius: 12 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Withdraw;