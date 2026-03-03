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
import { supabase } from "../../supabaseClient";

const SlideTransition = (props) => <Slide {...props} direction="down" />;

const Deposit = () => {
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
  const [user, setUser] = useState(null);

  const paymentMethods = [
    { 
      name: "Easypaisa", 
      user: "Muhammad Saad", 
      number: "03001234567", 
      icon: "https://incomix-world.vercel.app/images/easypaisa.png", 
      color: "#00a651" 
    },
    { 
      name: "JazzCash", 
      user: "Muhammad Saad", 
      number: "03117654321", 
      icon: "https://incomix-world.vercel.app/images/jazzcash.png", 
      color: "#ed1c24" 
    },
  ];

  // Soft White Theme Colors
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

  const handleChange = (key, value) => setForm({ ...form, [key]: value });
  const showSnackbar = (message, severity = "success") =>
    setSnackbar({ open: true, message, severity });

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) setUser(data.user);
    };
    loadUser();
  }, []);

  const fetchDeposits = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("deposits")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (!error) setAuditHistory(data);
  };

  useEffect(() => {
    fetchDeposits();
  }, [user]);

  const handleSubmit = async () => {
    if (!form.amount || !form.trx || !selectedMethod) return showSnackbar("Enter all fields and select a method", "warning");
    if (!user) return showSnackbar("User not logged in", "error");

    setLoading(true);
    const { data, error } = await supabase
      .from("deposits")
      .insert([{ user_id: user.id, method: selectedMethod.name, amount: Number(form.amount), trx: form.trx, status: "pending" }])
      .select()
      .single();

    if (error) showSnackbar("Deposit failed: " + error.message, "error");
    else {
      setAuditHistory((prev) => [data, ...prev]);
      setForm({ amount: "", trx: "" });
      showSnackbar("Deposit submitted successfully!", "success");
    }
    setLoading(false);
  };

  const handleClearHistory = async () => {
    if (!user) return;
    setClearLoading(true);
    const { error } = await supabase.from("deposits").delete().eq("user_id", user.id);
    if (error) showSnackbar("Failed to clear history: " + error.message, "error");
    else {
      setAuditHistory([]);
      showSnackbar("History cleared successfully!", "success");
    }
    setClearLoading(false);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending": return "warning";
      case "approved": return "success";
      case "rejected":
      case "failed": return "error";
      default: return "default";
    }
  };

  const getIcon = () => {
    switch (snackbar.severity) {
      case "success": return <CheckCircleIcon />;
      case "error": return <ErrorOutlineIcon />;
      case "warning": return <WarningAmberIcon />;
      default: return <InfoOutlinedIcon />;
    }
  };

  const filteredHistory =
    filterStatus === "All" ? auditHistory : auditHistory.filter((d) => d.status.toLowerCase() === filterStatus.toLowerCase());

  const inputSx = {
    mb: 3,
    "& .MuiOutlinedInput-root": {
      borderRadius: "25px",
      backgroundColor: colors.cardSoft,
      color: colors.text,
      "& fieldset": { borderColor: colors.border },
      "&:hover fieldset": { borderColor: colors.accent },
      "&.Mui-focused fieldset": { borderColor: colors.accent, boxShadow: `0 0 0 3px ${colors.accentLight}` },
    },
    "& label": { fontWeight: 700, color: colors.subText },
  };

  return (
    <Box sx={{ minHeight: "100vh"}}>
      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2500}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        TransitionComponent={SlideTransition}
      >
        <Alert
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
            backgroundColor: colors.card,
            color: colors.text,
            boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Grid container spacing={4}>
        {/* LEFT SIDE */}
        <Grid item xs={12} md={7}>
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
  Deposit Portal
</Typography>
          <Typography mb={2} textAlign={'center'} color={colors.subText}>Add funds and track your deposits securely.</Typography>

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
  <Typography fontWeight={700} mb={2} fontSize={16} color="#4b5563">
    Deposit Instructions
  </Typography>

  <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8 }}>
    <Typography fontSize={14} color="#6b7280">• Send money to the exact number.</Typography>
    <Typography fontSize={14} color="#6b7280">• Put all details below correctly.</Typography>
    <Typography fontSize={14} color="#6b7280">• Click on Submit button.</Typography>
    <Typography fontSize={14} color="#6b7280">• Your deposit will be approved within 30 mins.</Typography>
<Box
  sx={{
    display: "flex",
    flexDirection: "column",
    gap: 0.5,
    mt: 1,
    p: 2,
  }}
>
  <Typography
    fontSize={14}
    textTransform="uppercase"
    color="#1e3a8a" // darker blue for readability
    sx={{ letterSpacing: 0.5 }}
  >
    <b>Account:</b> 03117654321
  </Typography>
  <Typography
    fontSize={14}
    textTransform="uppercase"
    color="#1e3a8a"
    sx={{ letterSpacing: 0.5 }}
  >
    <b>Name:</b> Muhammad Saad
  </Typography>
</Box>
  </Box>
</Paper>

          {/* Payment Methods */}
          <Paper
            sx={{
              p: 1,
              borderRadius: 4,
              mb: 4,
              background: "linear-gradient(135deg, #f8f9ff, #f7f7f7)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            }}
          >
            <Typography
              fontWeight={800}
              mb={3}
              display="flex"
              alignItems="center"
              gap={1}
              color="#4899eb"
              fontSize={18}
                sx={{
              p: 1,
                }}
            >
              <AccountBalanceWalletIcon /> Payment Channels
            </Typography>

            {paymentMethods.map((item, i) => (
              <Paper
                key={i}
                onClick={() => setSelectedMethod(item)}
                sx={{
                  p: 3,
                  mb: 2,
                  borderRadius: 3,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                  color: "#1f2937",
                  border:
                    selectedMethod?.name === item.name
                      ? `2px solid ${item.color}`
                      : "1px solid rgba(0,0,0,0.08)",
                  background:
                    selectedMethod?.name === item.name
                      ? `linear-gradient(90deg, ${item.color}20, ${item.color}10)`
                      : "#ffffff",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: 3,
                      background: `${item.color}20`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.3s",
                    }}
                  >
                    <img src={item.icon} alt={item.name} style={{ width: 34, height: 34, objectFit: "contain", borderRadius: 6 }} />
                  </Box>
                  <Box>
                    <Typography fontWeight={700} fontSize={16}>
                      {item.name}
                    </Typography>
                    <Typography fontSize={15} color="gray">
                      {item.user}
                    </Typography>
                  </Box>
                </Box>
                <Typography
                  fontWeight={700}
                  color={item.color}
                  fontSize={18}
                  sx={{ minWidth: 80, textAlign: "right" }}
                >
                  {item.number}
                </Typography>
              </Paper>
            ))}
          </Paper>

          {/* Submit Section */}
          <Paper sx={{ p: 4, borderRadius: 3, background: colors.card, boxShadow: "0 6px 20px rgba(0,0,0,0.05)" }}>
            <Typography fontWeight={700} fontSize={18} mb={3} display="flex" alignItems="center" gap={1.5} color={colors.accent}>
              <ReceiptLongIcon /> Submit Transaction
            </Typography>

            {/* Modern Labels */}
            <TextField
              fullWidth
              label="Amount (PKR)"
              type="number"
              value={form.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
              sx={inputSx}
              InputProps={{ startAdornment: (<InputAdornment position="start"><AttachMoneyIcon sx={{ color: colors.accent }} /></InputAdornment>) }}
            />
            <TextField
              fullWidth
              label="Transaction TRX ID"
              value={form.trx}
              onChange={(e) => handleChange("trx", e.target.value)}
              sx={inputSx}
            />

            <Button fullWidth onClick={handleSubmit} disabled={loading} sx={{ py: 1.6, borderRadius: "14px", fontWeight: 600, fontSize: 14, background: colors.buttonGradient, color: "#fff" }}>
              {loading ? <CircularProgress size={22} sx={{ color: "#fff" }} /> : "Submit Deposit"}
            </Button>
          </Paper>
        </Grid>

        {/* RIGHT SIDE - History */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ borderRadius: 4, display: "flex", flexDirection: "column", minHeight: 600, overflow: "hidden", background: colors.card, boxShadow: "0 6px 20px rgba(0,0,0,0.05)" }}>
            <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: colors.border }}>
              <Typography fontWeight={700} display="flex" alignItems="center" gap={2} fontSize={20} color={colors.accent}>
                <HistoryIcon sx={{ fontSize: 24, color: colors.accent }} /> Audit History
              </Typography>
              <Button size="small" color="error" startIcon={clearLoading ? <CircularProgress size={16} /> : <DeleteIcon />} disabled={clearLoading} onClick={handleClearHistory}>
                {clearLoading ? "Clearing..." : "Clear"}
              </Button>
            </Box>

            {/* Filter */}
            <Box
              sx={{
                display: "flex",
                gap: 1.5,
                flexWrap: "wrap",
                p: 2,
                borderBottom: colors.border,
                background: "#fafafa",
              }}
            >
              {[
                { label: "All", color: "#6366f1" },
                { label: "pending", color: "#f59e0b" },
                { label: "Approved", color: "#10b981" },
                { label: "Rejected", color: "#ef4444" },
              ].map((item) => {
                const active = filterStatus.toLowerCase() === item.label.toLowerCase();
                return (
                <Button
  key={item.label}
  onClick={() => setFilterStatus(item.label)}
  size="small"
  sx={{
    flexGrow: { xs: 1, sm: 0 },              // stretch on small screens
    width: { xs: "48%", sm: "auto" },        // 2 per row on mobile
    minWidth: { xs: "48%", sm: 60 },
    px: { xs: 1.5, sm: 2.5 },
    py: { xs: 0.7, sm: 0.8 },
    fontSize: { xs: 12, sm: 13 },
    fontWeight: 600,
    borderRadius: "30px",
    textTransform: "none",
    whiteSpace: "nowrap",
    transition: "all 0.3s ease",
    background: active
      ? `linear-gradient(135deg, ${item.color}, ${item.color}cc)`
      : "#ffffff",
    color: active ? "#fff" : "#374151",
    border: active ? "none" : "1px solid #e5e7eb",
    boxShadow: active
      ? `0 6px 18px ${item.color}40`
      : "none",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: active
        ? `0 6px 18px ${item.color}50`
        : `0 2px 6px rgba(0,0,0,0.05)`,
    },
  }}
>
  {item.label}
</Button>
                );
              })}
            </Box>

            {/* Scrollable History */}
            <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
              {filteredHistory.length === 0 ? (
                <Typography textAlign="center" mt={5} color={colors.subText}>No transactions yet</Typography>
              ) : (
                filteredHistory.map((item) => {
                  const isEasy = item.method === "Easypaisa";
                  const methodColor = isEasy ? "#00a651" : "#ed1c24";
                  const MethodIcon = isEasy ? FaWallet : MdPayment;

                  return (
                    <Paper
                      key={item.id}
                      sx={{
                        p: 3,
                        mb: 2,
                        borderRadius: 4,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        background: "linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%)",
                        color: "#1f2937",
                        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.06)",
                        border: "1px solid rgba(0,0,0,0.04)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: "0 12px 35px rgba(0, 0, 0, 0.1)",
                        },
                      }}
                    >
                      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                        <Box sx={{ width: 40, height: 40, borderRadius: 2, background: methodColor + "20", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <MethodIcon size={20} color={methodColor} />
                        </Box>
                        <Box>
                          <Typography fontWeight={700}>{item.method}</Typography>
                          <Typography fontSize={13}>PKR {item.amount}</Typography>
                          <Typography fontSize={11} color={colors.subText}>TRX: {item.trx}</Typography>
                        </Box>
                      </Box>
                      <Chip label={item.status} color={getStatusColor(item.status)} size="small" />
                    </Paper>
                  );
                })
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Deposit;