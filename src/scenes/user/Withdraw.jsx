import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  IconButton,
  Snackbar,
  Alert,
  Slide,
} from "@mui/material";
import { motion } from "framer-motion";
import { supabase } from "../../supabaseClient";  
import {
  ArrowBackIosNew as ArrowBackIosNewIcon,
  ShieldOutlined as ShieldOutlinedIcon,
} from "@mui/icons-material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import WarningIcon from "@mui/icons-material/Warning";
import InfoIcon from "@mui/icons-material/Info";
import { useNavigate } from "react-router-dom";

const SlideTransition = (props) => <Slide {...props} direction="down" />;

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const Withdraw = () => {
  const [form, setForm] = useState({ name: "", account: "", amount: "" });
  const [method, setMethod] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  const [walletBalance, setWalletBalance] = useState(0); // ✅ Wallet balance state

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

  const navigate = useNavigate();

  // ✅ Load wallet balance from localStorage (or fetch from Supabase if needed)
  useEffect(() => {
    const balance = Number(localStorage.getItem("walletBalance")) || 0;
    setWalletBalance(balance);
  }, []);

  const showSnackbar = (message, severity = "success") =>
    setSnackbar({ open: true, message, severity });

  const isValid = form.name && form.account && form.amount && method;
  const handleChange = (key, value) => setForm({ ...form, [key]: value });

  const handleSubmit = async () => {
    if (!isValid) return showSnackbar("Fill all fields", "warning");

    // ✅ Check if user has sufficient balance
    if (walletBalance <= 0) return showSnackbar("Insufficient balance", "error");
    if (Number(form.amount) > walletBalance) return showSnackbar("Cannot withdraw more than balance", "error");

    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      showSnackbar("User not logged in", "error");
      setLoading(false);
      return;
    }

    const trx = "TRX" + Date.now();

    const { error } = await supabase.from("withdrawals").insert([
      {
        user_id: user.id,
        name: form.name,
        account: form.account,
        method: method.name,
        amount: form.amount,
        trx: trx,
        status: "pending",
      },
    ]);

    if (error) {
      console.error(error);
      showSnackbar("Withdraw failed", "error");
    } else {
      showSnackbar("Withdraw request submitted", "success");
      // ✅ Reset fields after successful submission
      setForm({ name: "", account: "", amount: "" });
      setMethod(null);
      setWalletBalance(walletBalance - Number(form.amount)); // Optional local update
    }

    setLoading(false);
  };

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

  const getIcon = () => {
    switch (snackbar.severity) {
      case "success": return <CheckCircleIcon sx={{ color: "#22c55e" }} />;
      case "error": return <ErrorIcon sx={{ color: "#ef4444" }} />;
      case "warning": return <WarningIcon sx={{ color: "#f59e0b" }} />;
      default: return <InfoIcon sx={{ color: "#3b82f6" }} />;
    }
  };

  return (
    <Box component={motion.div} variants={fadeUp} initial="hidden" animate="visible" sx={{ minHeight: "100vh" }}>
      {/* Back Button */}
      <IconButton
        onClick={() => navigate("/user-dashboard")}
        sx={{
          color: "#fff",
          background: "linear-gradient(135deg, #1e88e5, #1565c0)",
          borderRadius: "12px",
          p: 1.5,
          transition: "all 0.3s ease",
          "&:hover": { transform: "scale(1.1)", background: "linear-gradient(135deg, #1565c0, #1e88e5)" },
        }}
      >
        <ArrowBackIosNewIcon fontSize="medium" />
      </IconButton>

      <Grid container justifyContent="center">
        <Grid item xs={12} md={7}>
          <Typography
            variant="h3"
            textAlign="center"
            sx={{
              fontSize: { xs: "28px", sm: "34px", md: "42px" },
              fontWeight: 800,
              letterSpacing: "-0.5px",
              background: "linear-gradient(135deg, #6366f1 0%, #3b82f6 50%, #06b6d4 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0px 4px 20px rgba(59,130,246,0.25)",
              mb: 4,
            }}
          >
            Withdraw Portal
          </Typography>

          <Grid container spacing={{ xs: 2, sm: 4 }}>
            {/* AUDIT NOTICE */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3, mb: 3, borderRadius: 3, display: "flex", alignItems: "center", gap: 2, border: colors.border, background: colors.card }}>
                <ShieldOutlinedIcon sx={{ color: "#f59e0b", fontSize: 28 }} />
                <Box>
                  <Typography sx={{ fontWeight: 700, color: colors.text }}>AUDIT NOTICE</Typography>
                  <Typography sx={{ color: colors.subText }}>Minimum withdrawal threshold: <b>60 PKR</b></Typography>
                  <Typography sx={{ color: colors.subText }}>Available Balance: <b>PKR {walletBalance.toLocaleString()}</b></Typography>
                </Box>
              </Paper>
            </Grid>

            {/* Withdrawal Form */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 4, borderRadius: 3, background: colors.card, border: colors.border, boxShadow: "0 6px 20px rgba(0,0,0,0.05)" }}>
                <Typography sx={{ fontWeight: 700, mb: 3, color: colors.accent, fontSize: 20, textAlign: "center", textTransform: "uppercase" }}>
                  Withdrawal Method
                </Typography>

                <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, mb: 3 }}>
                  {paymentMethods.map((m) => (
                    <Button
                      key={m.name}
                      onClick={() => setMethod(m)}
                      sx={{
                        flex: 1,
                        py: 1.5,
                        borderRadius: 2,
                        fontWeight: 700,
                        fontSize: 16,
                        borderColor: method?.name === m.name ? m.color : colors.border,
                        color: method?.name === m.name ? "#fff" : m.color,
                        background: method?.name === m.name ? m.color : colors.cardSoft,
                        "&:hover": { background: method?.name === m.name ? m.color : colors.accentLight },
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        justifyContent: "center",
                      }}
                      startIcon={<img src={m.icon} alt={m.name} style={{ width: 44, height: 44, borderRadius: 6 }} />}
                    >
                      {m.name}
                    </Button>
                  ))}
                </Box>

                <TextField fullWidth label="Account Name" value={form.name} onChange={(e) => handleChange("name", e.target.value)} sx={inputSx} />
                <TextField fullWidth label="Account Number" value={form.account} onChange={(e) => handleChange("account", e.target.value)} sx={inputSx} />
                <TextField fullWidth label="Amount (PKR)" type="number" value={form.amount} onChange={(e) => handleChange("amount", e.target.value)} sx={inputSx} />

                <Button fullWidth disabled={!isValid || loading} onClick={handleSubmit} sx={{ mt: 2, py: 1.6, borderRadius: "20px", fontSize: 16, background: colors.buttonGradient, color: "#fff", textTransform: "uppercase" }}>
                  {loading ? "Processing..." : "Submit Withdrawal"}
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* SNACKBAR */}
      <Snackbar open={snackbar.open} autoHideDuration={2500} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: "top", horizontal: "center" }} TransitionComponent={SlideTransition}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} icon={getIcon()} severity={snackbar.severity} variant="filled" sx={{ width: "90%", maxWidth: 300, borderRadius: 12, fontWeight: 500, fontSize: 13, px: 2, py: 1.5, display: "flex", alignItems: "center", gap: 1, backdropFilter: "blur(12px)", background: "#fff", color: "#111", boxShadow: "0 10px 25px rgba(0,0,0,0.15)" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Withdraw;