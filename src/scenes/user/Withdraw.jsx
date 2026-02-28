import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Chip,
  InputAdornment,
  Snackbar,
  Alert,
} from "@mui/material";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import HistoryIcon from "@mui/icons-material/History";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

const Withdraw = () => {
  const [form, setForm] = useState({ name: "", account: "", amount: "" });
  const [method, setMethod] = useState("Easypaisa");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openSnack, setOpenSnack] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [snackSeverity, setSnackSeverity] = useState("success");

  const balance = 0;

  const colors = {
    card: "#rgb(30, 28, 28)",
    cardSoft: "#1e1e1e",
    border: "1px solid #333333",
    text: "#ffffff",
    subText: "#aaaaaa",
    neon: "#ffffff",
    cyan: "#e69119",
  };

  const isValid = form.name && form.account && form.amount;

  const handleChange = (key, value) =>
    setForm({ ...form, [key]: value });

  const handleSubmit = () => {
    if (!isValid) return;

    if (Number(form.amount) > balance) {
      setSnackMessage("Insufficient balance!");
      setSnackSeverity("error");
      setOpenSnack(true);
      return;
    }

    const newTx = {
      id: Date.now(),
      ...form,
      method,
      status: "Pending",
    };

    setTransactions([newTx, ...transactions]);
    setForm({ name: "", account: "", amount: "" });
    setLoading(true);

    setTimeout(() => {
      const statuses = ["Approved", "Rejected"];
      const randomStatus =
        statuses[Math.floor(Math.random() * statuses.length)];

      setTransactions((prev) =>
        prev.map((tx) =>
          tx.id === newTx.id ? { ...tx, status: randomStatus } : tx
        )
      );

      setLoading(false);
      setSnackMessage(`Transaction ${randomStatus} ✅`);
      setSnackSeverity(randomStatus === "Approved" ? "success" : "error");
      setOpenSnack(true);
    }, 3000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "warning";
      case "Approved":
        return "success";
      case "Rejected":
        return "error";
      default:
        return "default";
    }
  };

  const inputSx = {
    mb: 2.5,
    "& .MuiOutlinedInput-root": {
      borderRadius: "14px",
      backgroundColor: colors.card,
      color: colors.text,
      transition: "all 0.3s ease",

      "& fieldset": {
        borderColor: "#333333",
        borderWidth: "1.5px",
      },

      "&:hover fieldset": {
        borderColor: colors.neon,
      },

      "&.Mui-focused fieldset": {
        borderColor: colors.neon,
        boxShadow: `0 0 0 3px ${colors.neon}22`,
      },
    },

    "& input": {
      fontWeight: 600,
      padding: "14px",
    },
  };

  return (
    <Box sx={{ minHeight: "100vh",}}>
      <Typography sx={{ fontSize: 32, textTransform: 'uppercase', fontWeight: 800, mb: 1, }}>
        Withdraw Portal
      </Typography>
      <Typography sx={{  mb: 5 }}>
        Liquidate generated dividends securely.
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, mb: 4, borderRadius: 3, display: "flex", alignItems: "center", gap: 2, border: colors.border, background: "#1a1a1a" }}>
            <ShieldOutlinedIcon sx={{ color: "#f59e0b", fontSize: 28 }} />
            <Box>
              <Typography sx={{ fontWeight: 700, color: colors.text }}>AUDIT NOTICE</Typography>
              <Typography sx={{ fontSize: 13, color: colors.subText }}>
                Minimum withdrawal threshold: <b>60 PKR</b>
              </Typography>
            </Box>
          </Paper>

          <Paper sx={{ p: 4, borderRadius: 3, background: colors.card, border: colors.border, backdropFilter: "blur(10px)" }}>
            <Typography sx={{ fontWeight: 700, mb: 3, color: colors.neon, fontSize: 20 }}>
              Relay Parameters
            </Typography>

            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
              {["Easypaisa", "JazzCash"].map((m) => (
                <Button
                  key={m}
                  variant={method === m ? "contained" : "outlined"}
                  onClick={() => setMethod(m)}
                  sx={{
                    flex: 1,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 700,
                    borderColor: method === m ? colors.neon : colors.border,
                    color: colors.text,
                    "&:hover": { background: colors.neon + "30" },
                  }}
                  startIcon={<AccountBalanceWalletOutlinedIcon />}
                >
                  {m}
                </Button>
              ))}
            </Box>

            <TextField fullWidth placeholder="Full Name" value={form.name} onChange={(e) => handleChange("name", e.target.value)} sx={inputSx} />
            <TextField fullWidth placeholder="03xx xxxxxxx" value={form.account} onChange={(e) => handleChange("account", e.target.value)} sx={inputSx} />
            <TextField
              fullWidth
              type="number"
              placeholder="Min. 60"
              value={form.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AttachMoneyIcon sx={{ color: colors.neon }} />
                  </InputAdornment>
                ),
              }}
              sx={inputSx}
            />

            <Button
              fullWidth
              disabled={!isValid || loading}
              onClick={handleSubmit}
              sx={{
                mt: 1,
                py: 1.2,
             borderRadius: "20px",
    background:' rgb(30, 28, 28)',
                fontSize: 16,
        background: "linear-gradient(90deg, #ea580c, #f59e0b)",
                color: "#f4f4f4",
                textTransform: "uppercase",
              }}
            >
              {loading ? "Processing..." : "Initialize Withdrawal"}
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 4, borderRadius: 3, background: colors.card, border: colors.border, minHeight: 450 }}>
            <Typography sx={{ fontWeight: 700, mb: 3, color: colors.cyan, display: "flex", alignItems: "center", gap: 1, fontSize: 18 }}>
              <HistoryIcon /> Transaction History
            </Typography>

            {transactions.length === 0 ? (
              <Box sx={{ border: `2px dashed ${colors.neon}`, borderRadius: 3, p: 8, textAlign: "center", color: colors.subText }}>
                No transactions yet
              </Box>
            ) : (
              transactions.map((tx) => (
                <Paper key={tx.id} sx={{ p: 2, mb: 2, borderRadius: 2, display: "flex", justifyContent: "space-between", alignItems: "center", background: colors.cardSoft }}>
                  <Box>
                    <Typography sx={{ fontWeight: 700, color: colors.text }}>
                      {tx.method} - PKR {tx.amount}
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: colors.subText }}>
                      {tx.name} | {tx.account}
                    </Typography>
                  </Box>
                  <Chip label={tx.status} color={getStatusColor(tx.status)} size="small" />
                </Paper>
              ))
            )}
          </Paper>
        </Grid>
      </Grid>

      <Snackbar open={openSnack} autoHideDuration={3000} onClose={() => setOpenSnack(false)}>
        <Alert severity={snackSeverity} variant="filled">
          {snackMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Withdraw;