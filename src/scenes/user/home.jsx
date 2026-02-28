import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  Slide,
  CircularProgress,
  Button,
} from "@mui/material";
import {
  HiOutlineClipboardDocument,
  HiOutlineBanknotes,
  HiOutlineChartBar,
  HiOutlineUserGroup,
  HiOutlineCube,
} from "react-icons/hi2";
import { HiOutlineEye, HiOutlineEyeSlash } from "react-icons/hi2";
import { HiArrowRight, HiUser, HiUsers, HiStar } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

// Generate random referral code
const generateReferralCode = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

const Home = ({ darkMode = false }) => {
  const navigate = useNavigate();

  // ✅ USER NAME FROM SUPABASE
  const [userName, setUserName] = useState("User");

  // ✅ Referral Code (kept using localStorage)
  const [referralCode] = useState(() => {
    const stored = JSON.parse(localStorage.getItem("profileData")) || {};
    return stored.referralCode || generateReferralCode();
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [walletBalance, setWalletBalance] = useState(0);
  const [hideBalance, setHideBalance] = useState(true);

  // ✅ Animated values
  const [animatedValues, setAnimatedValues] = useState({
    balance: 5000,
    earnings: 5000,
    referral: 5000,
    plans: 400,
  });

  // ✅ Get Logged-in User Name
  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserName(session.user.user_metadata?.name || "User");
      }
    };
    getUser();
  }, []);

  // Existing logic preserved
  useEffect(() => {
    const storedProfile = JSON.parse(localStorage.getItem("profileData")) || {};
    localStorage.setItem(
      "profileData",
      JSON.stringify({ ...storedProfile, referralCode })
    );

    const balance = Number(localStorage.getItem("walletBalance")) || 0;
    setWalletBalance(balance);

    // Animate stats
    const targetValues = {
      balance: balance,
      earnings: 0,
      referral: 0,
      plans: 0, // target for Active Plans
    };
    const duration = 2000;
    const frameRate = 30;
    const totalFrames = Math.round((duration / 1000) * frameRate);
    let frame = 0;

    const interval = setInterval(() => {
      frame++;
      setAnimatedValues({
        balance: Math.round(5000 + ((targetValues.balance - 5000) * frame) / totalFrames),
        earnings: Math.round(5000 + ((targetValues.earnings - 5000) * frame) / totalFrames),
        referral: Math.round(5000 + ((targetValues.referral - 5000) * frame) / totalFrames),
        plans: Math.round((targetValues.plans * frame) / totalFrames),
      });
      if (frame >= totalFrames) clearInterval(interval);
    }, 2000 / frameRate);

    setTimeout(() => setLoading(false), 1200);

    return () => clearInterval(interval);
  }, [referralCode, walletBalance]);


  

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(referralCode);
    setSnackbarOpen(false);
    setTimeout(() => setSnackbarOpen(true), 50);
  };

  const colors = {
    background: darkMode ? "#0f172a" : "#f5f7fb",
    cardBg: darkMode ? "#1e293b" : "#ffffff",
    textPrimary: darkMode ? "#f8fafc" : "#111827",
    textSecondary: darkMode ? "#a1a1aa" : "#636362",
  };

  const bigCardStyle = {
    p: 3,
    borderRadius: 4,
    background: colors.cardBg,
    transition: "all 0.3s ease",
    "&:hover": {
      boxShadow: darkMode
        ? "0 15px 30px rgba(0,0,0,0.35)"
        : "0 15px 30px rgba(0,0,0,0.1)",
    },
  };

  if (loading) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <CircularProgress size={40} sx={{ color: "#ea910c" }} />
        <Typography sx={{ mt: 2, fontWeight: 500, color: colors.textPrimary }}>
          Loading Dashboard...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh" }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          Dashboard
        </Typography>
        <Typography sx={{ mt: 2, fontSize: "1.1rem", letterSpacing: "0.4px" }}>
          Welcome back, {userName} 👋
        </Typography>
      </Box>

      {/* Balance Card */}
      <Paper
        sx={{
          mb: 4,
          p: 4,
          borderRadius: 6,
          background: "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)",
          color: "#fff",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -60,
            right: -60,
            width: 200,
            height: 200,
            background: "rgba(255,255,255,0.15)",
            borderRadius: "50%",
            filter: "blur(60px)",
          }}
        />
        <Typography sx={{ fontSize: 15, opacity: 0.85, letterSpacing: 0.5 }}>
          Available Balance
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 2 }}>
          <Typography sx={{ fontSize: { xs: 30, sm: 42 }, fontWeight: 700, letterSpacing: 1 }}>
            {hideBalance ? "******" : `PKR ${walletBalance.toLocaleString()}`}
          </Typography>
          <IconButton
            onClick={() => setHideBalance(!hideBalance)}
            sx={{
              background: "rgba(255,255,255,0.2)",
              color: "#fff",
              borderRadius: 3,
              p: 1.4,
              "&:hover": { background: "rgba(255,255,255,0.35)", transform: "scale(1.1)" },
            }}
          >
            {hideBalance ? <HiOutlineEye size={22} /> : <HiOutlineEyeSlash size={22} />}
          </IconButton>
        </Box>

        {/* Deposit & Withdraw Buttons */}
        <Box sx={{ display: "flex", gap: 2, mt: 4, justifyContent: "flex-start" }}>
          <Button
            onClick={() => navigate("/user-dashboard/deposit")}
            sx={{
              width: 160,
              py: 1.5,
              borderRadius: 50,
              fontWeight: 700,
              textTransform: "uppercase",
              background: "linear-gradient(90deg, #f59e0b, #ea580c)",
              color: "#fff",
              border: "2px solid #ffb347",
              boxShadow: "0 4px 15px rgba(234, 88, 12, 0.4)",
              transition: "all 0.4s ease",
              "&:hover": {
                transform: "translateY(-2px) scale(1.02)",
                background: "linear-gradient(90deg, #faa616, #e1590f)",
                border: "2px solid #ffc069",
              },
            }}
          >
            Deposit
          </Button>
          <Button
            onClick={() => navigate("/user-dashboard/withdraw")}
            sx={{
              width: 160,
              py: 1.5,
              borderRadius: 50,
              fontWeight: 700,
              textTransform: "uppercase",
              background: "linear-gradient(90deg, #ffffff, #ffffff)",
              color: "#000000",
              transition: "all 0.4s ease",
              "&:hover": { transform: "translateY(-2px) scale(1.02)" },
            }}
          >
            Withdraw
          </Button>
        </Box>
      </Paper>

      {/* Referral Card */}
      <Paper
        sx={{
          mb: 4,
          p: 4,
          borderRadius: 6,
          background: darkMode ? "linear-gradient(135deg, #1f2937, #111827)" : "#fff",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          transition: "all 0.3s ease",
          "&:hover": { transform: "translateY(-3px)" },
        }}
      >
        <Box>
          <Typography sx={{ fontSize: 13, color: colors.textSecondary, letterSpacing: 1 }}>YOUR REFERRAL CODE</Typography>
          <Typography sx={{ fontSize: { xs: 20, sm: 26 }, fontWeight: 800, mt: 0.5, letterSpacing: 3, color: darkMode ? "#fff" : "#111827" }}>
            {referralCode}
          </Typography>
        </Box>
        <Tooltip title="Copy Code">
          <IconButton
            onClick={(e) => { e.stopPropagation(); handleCopyReferral(); }}
            sx={{
              background: "linear-gradient(135deg, #f59e0b, #ea580c)",
              color: "#fff",
              borderRadius: 4,
              p: 1.5,
              "&:hover": { transform: "scale(1.1)", boxShadow: "0 15px 35px rgba(234,88,12,0.6)" },
            }}
          >
            <HiOutlineClipboardDocument size={22} />
          </IconButton>
        </Tooltip>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {[
          { title: "Available Balance", value: animatedValues.balance, icon: <HiOutlineBanknotes size={28} />, color: "#17c256" },
          { title: "Total Earnings", value: animatedValues.earnings, icon: <HiOutlineChartBar size={28} />, color: "#2563eb" },
          { title: "Referral Bonus", value: animatedValues.referral, icon: <HiOutlineUserGroup size={28} />, color: "#9333ea" },
          { title: "Active Plans", value: animatedValues.plans, icon: <HiOutlineCube size={28} />, color: "#f59e0b" },
        ].map((card, index) => (
          <Grid item xs={6} sm={6} md={3} key={index}>
            <Paper sx={bigCardStyle}>
              <Box sx={{ width: 56, height: 56, borderRadius: 3, background: `${card.color}15`, display: "flex", alignItems: "center", justifyContent: "center", color: card.color, mb: 3 }}>
                {card.icon}
              </Box>
              <Typography sx={{ color: colors.textSecondary, fontSize: 14 }}>{card.title}</Typography>
              <Typography sx={{ fontWeight: "bold", fontSize: 22, mt: 1, color: colors.textPrimary }}>
                {card.title === "Active Plans" ? card.value : `PKR ${card.value.toLocaleString()}`}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Network Section */}
      <Box sx={{ mt: 5, mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography sx={{ fontWeight: "bold", fontSize: 20 }}>Network</Typography>
        <IconButton onClick={() => navigate("/user-dashboard/profile")} sx={{ color: "#2563eb", "&:hover": { color: "#1d4ed8", background: "transparent" } }}>
          <HiArrowRight size={24} />
        </IconButton>
      </Box>

      <Paper sx={{ ...bigCardStyle, p: 4, borderRadius: 6, background: darkMode ? "linear-gradient(135deg, #1e293b, #111827)" : "#f3f4f6" }}>
        {[{ level: "Level 1", percent: "12%", color: "#16a34a", icon: <HiUser size={22} style={{ color: "#22c55e" }} /> },
          { level: "Level 2", percent: "6%", color: "#2563eb", icon: <HiUsers size={22} style={{ color: "#3b82f6" }} /> },
          { level: "Level 3", percent: "3%", color: "#9333ea", icon: <HiStar size={22} style={{ color: "#a855f7" }} /> }].map((item, index) => (
          <Box key={index} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2, borderRadius: 5, mb: 2, background: darkMode ? "#334155" : "#f9fafb", boxShadow: darkMode ? "inset 0 2px 6px rgba(255,255,255,0.05)" : "0 2px 6px rgba(0,0,0,0.05)", transition: "all 0.3s ease", "&:hover": { transform: "translateY(-3px)", boxShadow: darkMode ? "0 10px 25px rgba(0,0,0,0.35)" : "0 10px 25px rgba(0,0,0,0.12)" } }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>{item.icon}<Typography sx={{ fontWeight: 600, color: colors.textPrimary }}>{item.level}</Typography></Box>
            <Box sx={{ px: 3, py: 0.8, borderRadius: 3, fontWeight: 700, color: "#fff", background: `linear-gradient(135deg, ${item.color}55, ${item.color}AA)`, boxShadow: `0 4px 12px ${item.color}55`, minWidth: 50, textAlign: "center" }}>
              {item.percent}
            </Box>
          </Box>
        ))}
        <Typography sx={{ fontSize: 13, color: colors.textSecondary, mt: 2, lineHeight: 1.5 }}>
          Earn commissions on every active plan activated within your downline.
        </Typography>
      </Paper>

      {/* Snackbar */}
      <Snackbar open={snackbarOpen} autoHideDuration={2000} onClose={() => setSnackbarOpen(false)} anchorOrigin={{ vertical: "top", horizontal: "center" }} TransitionComponent={(props) => <Slide {...props} direction="down" />} sx={{ pointerEvents: "none" }}>
        <Alert severity="success" sx={{ backgroundColor: "#edecec", color: "#000", borderRadius: 10, padding: "10px 20px", pointerEvents: "auto" }}>
          Referral code copied!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Home;