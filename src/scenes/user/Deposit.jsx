import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  InputAdornment,
  CircularProgress,
  Snackbar,
  Alert,
  Slide,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  AccountBalanceWallet as AccountBalanceWalletIcon,
  ReceiptLong as ReceiptLongIcon,
  ContentCopy as ContentCopyIcon,
} from "@mui/icons-material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { motion } from "framer-motion";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom"; // for navigation

const SlideTransition = (props) => <Slide {...props} direction="down" />;

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
  }),
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const Deposit = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ amount: "", trx: "" });
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  const [user, setUser] = useState(null);

  const paymentMethods = [
    {
      name: "Easypaisa",
      user: "Muhammad Saad",
      number: "03001234567",
      icon: "https://incomix-world.vercel.app/images/easypaisa.png",
      color: "#00a651",
    },
    {
      name: "JazzCash",
      user: "Muhammad Saad",
      number: "03117654321",
      icon: "https://incomix-world.vercel.app/images/jazzcash.png",
      color: "#ed1c24",
    },
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

  const handleChange = (key, value) => setForm({ ...form, [key]: value });

  const showSnackbar = (message, severity = "success") =>
    setSnackbar({ open: true, message, severity });

  const handleCopy = (number) => {
    navigator.clipboard.writeText(number);
    showSnackbar("Number copied successfully!", "success");
  };

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) setUser(data.user);
    };
    loadUser();
  }, []);

  const handleSubmit = async () => {
    if (!form.amount || !form.trx || !selectedMethod)
      return showSnackbar("Enter all fields and select a method", "warning");

    if (!user) return showSnackbar("User not logged in", "error");

    setLoading(true);

    const { error } = await supabase.from("deposits").insert([
      {
        user_id: user.id,
        method: selectedMethod.name,
        amount: Number(form.amount),
        trx: form.trx,
        status: "pending",
      },
    ]);

    if (error) showSnackbar("Deposit failed: " + error.message, "error");
    else {
      setForm({ amount: "", trx: "" });
      showSnackbar("Deposit Request successfully!", "success");
    }

    setLoading(false);
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

  const inputSx = {
    mb: 2.4,
    "& .MuiOutlinedInput-root": {
      borderRadius: "25px",
      border: "2px solid #57adf4a7",
      backgroundColor: colors.cardSoft,
      color: colors.text,
      transition: "all 0.3s ease",
      "& fieldset": { borderColor: colors.border, borderWidth: "1.5px" },
      "&:hover fieldset": { borderColor: colors.accent },
      "&.Mui-focused fieldset": {
        borderColor: colors.accent,
        boxShadow: `0 0 0 3px ${colors.accentLight}`,
      },
    },
    "& input": { fontWeight: 600, padding: "19px" },
    "& label": { fontWeight: 600, color: colors.subText },
  };

  return (
    <Box  
          component={motion.div}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      sx={{ minHeight: "100vh" }}>


<IconButton
  onClick={() => navigate("/user-dashboard")}
  sx={{
    color: "#fff",
    background: "linear-gradient(135deg, #1e88e5, #1565c0)",
    borderRadius: "12px",
    p: 1.5,
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "scale(1.1)",
      background: "linear-gradient(135deg, #1565c0, #1e88e5)",
    },
  }}
>
  <ArrowBackIosNewIcon fontSize="medium" />
</IconButton>
        
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
          width: "90%",
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
            background: '#fff',
            color: "#111",
    }}
  >
    {snackbar.message}
  </Alert>
</Snackbar>

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
    mb: 2,
  }}
>
  Deposit Portal
</Typography>

          {/* Payment Methods */}
         <Paper
  sx={{
    p: { xs: 2, sm: 3 }, // responsive padding
    borderRadius: 4,
    mb: { xs: 3, sm: 4 },
    background: "linear-gradient(135deg, #f8f9ff, #f7f7f7)",
  }}
>
  <Typography
    fontWeight={800}
    mb={{ xs: 2, sm: 3 }}
    display="flex"
    alignItems="center"
    gap={1}
    color="#4899eb"
    fontSize={{ xs: 16, sm: 18 }}
  >
    <AccountBalanceWalletIcon /> Payment Methods
  </Typography>

  {paymentMethods.map((item, i) => (
    <Paper
      key={i}
      onClick={() => setSelectedMethod(item)}
      sx={{
        p: { xs: 2, sm: 3 },
        mb: { xs: 2, sm: 2 },
        borderRadius: 3,
        display: "flex",
        flexDirection: { xs: "column", sm: "row" }, // stack on mobile
        justifyContent: "space-between",
        alignItems: { xs: "flex-start", sm: "center" },
        cursor: "pointer",
        border:
          selectedMethod?.name === item.name
            ? `2px solid ${item.color}`
            : "1px solid rgba(0,0,0,0.08)",
        background:
          selectedMethod?.name === item.name ? `${item.color}15` : "#ffffff",
        transition: "0.3s",
        "&:hover": {
          transform: "translateY(-3px)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: { xs: 1.5, sm: 2 },
          alignItems: "center",
          width: { xs: "100%", sm: "auto" },
          mb: { xs: 1.5, sm: 0 }, // spacing on mobile stacked
        }}
      >
        <img
          src={item.icon}
          alt={item.name}
          style={{ width: 44, height: 44, borderRadius: 6 }}
        />
        <Box>
          <Typography color="black" fontSize={{ xs: 16, sm: 18 }} fontWeight={700}>
            {item.name}
          </Typography>
          <Typography fontSize={{ xs: 12, sm: 14 }} color="gray">
            {item.user}
          </Typography>
        </Box>
      </Box>

      {/* Modern Copy Badge */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          background: `${item.color}15`,
          px: { xs: 1.5, sm: 2 },
          py: { xs: 0.8, sm: 1 },
          borderRadius: 3,
          width: { xs: "100%", sm: "auto" },
          justifyContent: { xs: "space-between", sm: "flex-end" },
        }}
      >
        <Typography fontWeight={700} color={item.color} fontSize={{ xs: 13, sm: 15 }}>
          {item.number}
        </Typography>

        <Tooltip title="Copy number">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleCopy(item.number);
            }}
            sx={{
              color: item.color,
              "&:hover": {
                background: `${item.color}25`,
              },
            }}
          >
            <ContentCopyIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Paper>
  ))}
</Paper>
          {/* Submit Section */}
          <Paper 
                    component={motion.div}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
            sx={{
              p: 4,
              borderRadius: 3,
              background: colors.card,
            }}
          >
            <Typography
              fontWeight={700}
              fontSize={18}
              mb={3}
              display="flex"
              alignItems="center"
              gap={1}
              color={colors.accent}
            >
              <ReceiptLongIcon /> Submit Transaction
            </Typography>
<TextField
  fullWidth
  label="Amount (PKR)"
  type="number"
  value={form.amount}
  onChange={(e) => handleChange("amount", e.target.value)}
  sx={inputSx}
  InputProps={{
  }}
/>

            <TextField
              fullWidth
              label="Transaction TRX ID"
              value={form.trx}
              onChange={(e) =>
                handleChange("trx", e.target.value)
              }
              sx={inputSx}
            />

            <Button
              fullWidth
              onClick={handleSubmit}
              disabled={loading}
              sx={{
                py: 1.6,
                borderRadius: "14px",
                fontWeight: 600,
                background: colors.buttonGradient,
                color: "#fff",
              }}
            >
              {loading ? (
                <CircularProgress size={22} sx={{ color: "#fff" }} />
              ) : (
                "Submit Deposit"
              )}
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Deposit;