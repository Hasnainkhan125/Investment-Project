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
    { name: "Easypaisa", user: "Muhammad Saad", number: "03001234567", icon: FaWallet, color: "#00a651" },
    { name: "JazzCash", user: "Muhammad Saad", number: "03117654321", icon: MdPayment, color: "#ed1c24" },
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
      .insert([{ user_id: user.id, method: selectedMethod.name, amount: Number(form.amount), trx: form.trx, status: "Pending" }])
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
    switch (status) {
      case "Pending": return "warning";
      case "Approved": return "success";
      case "Rejected":
      case "Failed": return "error";
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
    filterStatus === "All" ? auditHistory : auditHistory.filter((d) => d.status === filterStatus);

  const inputSx = {
    mb: 3,
    "& .MuiOutlinedInput-root": {
      borderRadius: "14px",
      backgroundColor: colors.cardSoft,
      color: colors.text,
      "& fieldset": { borderColor: colors.border },
      "&:hover fieldset": { borderColor: colors.accent },
      "&.Mui-focused fieldset": { borderColor: colors.accent, boxShadow: `0 0 0 3px ${colors.accentLight}` },
    },
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
          <Typography fontSize={30} fontFamily={'sans-serif'} textTransform={'uppercase'} fontWeight={700} mb={2} textAlign={'center'}>Deposit Portal</Typography>
          <Typography mb={2} textAlign={'center'} color={colors.subText}>Add funds and track your deposits securely.</Typography>

          {/* Payment Methods */}
          <Paper sx={{ p: 3, borderRadius: 4, mb: 4, background: colors.card, boxShadow: "0 6px 20px rgba(0,0,0,0.05)" }}>
            <Typography fontWeight={700} mb={3}   display="flex" alignItems="center" gap={1} color={colors.accent}>
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
                  color: colors.text,
                  border: selectedMethod?.name === item.name ? `2px solid ${item.color}` : colors.border,
                  background: colors.cardSoft,
                  transition: "all 0.3s",
                  "&:hover": { boxShadow: "0 6px 15px rgba(0,0,0,0.08)" }
                }}
              >
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  <Box sx={{ width: 45, height: 45, borderRadius: 2, background: `${item.color}20`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <item.icon size={22} color={item.color} />
                  </Box>
                  <Box>
                    <Typography fontWeight={700}>{item.name}</Typography>
                    <Typography fontSize={14} color={colors.subText}>{item.user}</Typography>
                  </Box>
                </Box>
                <Typography fontWeight={700} color={item.color}>{item.number}</Typography>
              </Paper>
            ))}
          </Paper>

          {/* Submit Section */}
          <Paper sx={{ p: 4, borderRadius: 3, background: colors.card, boxShadow: "0 6px 20px rgba(0,0,0,0.05)" }}>
            <Typography fontWeight={700} fontSize={18} mb={3} display="flex" alignItems="center" gap={1.5} color={colors.accent}>
              <ReceiptLongIcon /> Submit Transaction
            </Typography>
            <TextField fullWidth placeholder="Enter Amount (PKR)" type="number" value={form.amount} onChange={(e) => handleChange("amount", e.target.value)} sx={inputSx} InputProps={{ startAdornment: (<InputAdornment position="start"><AttachMoneyIcon sx={{ color: colors.accent }} /></InputAdornment>) }} />
            <TextField fullWidth placeholder="Enter Transaction TRX ID" value={form.trx} onChange={(e) => handleChange("trx", e.target.value)} sx={inputSx} />

            <Button fullWidth onClick={handleSubmit} disabled={loading} sx={{ py: 1.6, borderRadius: "14px", fontWeight: 600, fontSize: 14, background: colors.buttonGradient, color: "#fff" }}>
              {loading ? <CircularProgress size={22} sx={{ color: "#fff" }} /> : "Submit Deposit"}
            </Button>
          </Paper>
        </Grid>

        {/* RIGHT SIDE - History */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ borderRadius: 4, display: "flex", flexDirection: "column", minHeight: 600, overflow: "hidden", background: colors.card, boxShadow: "0 6px 20px rgba(0,0,0,0.05)" }}>
            {/* Header */}
            <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: colors.border }}>
              <Typography fontWeight={700} display="flex" alignItems="center" gap={2} fontSize={20} color={colors.accent}>
                <HistoryIcon sx={{ fontSize: 24, color: colors.accent }} /> Audit History
              </Typography>
              <Button size="small" color="error" startIcon={clearLoading ? <CircularProgress size={16} /> : <DeleteIcon />} disabled={clearLoading} onClick={handleClearHistory}>
                {clearLoading ? "Clearing..." : "Clear"}
              </Button>
            </Box>

            {/* Filter */}
            <Box sx={{ p: 2, borderBottom: colors.border, }}>
              <FormControl fullWidth>
                <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <MenuItem value="All">All Transactions</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Approved">Approved</MenuItem>
                  <MenuItem value="Rejected">Rejected</MenuItem>
                  <MenuItem value="Failed">Failed</MenuItem>
                </Select>
              </FormControl>
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
                    <Paper key={item.id} sx={{ p: 2.5, mb: 2, borderRadius: 3, display: "flex", justifyContent: "space-between", alignItems: "center", background: colors.cardSoft }}>
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