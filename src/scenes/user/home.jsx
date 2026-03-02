  import React, { useState, useEffect } from "react";
  import {
    Box,
    Grid,
    Paper,
    Typography,
    IconButton,
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
  import ReferralCard from "../user/ReferralCard"; // adjust path as needed

  import { HiOutlineUser } from "react-icons/hi2";
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


      setTimeout(() => setLoading(false), 1200);

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
          <CircularProgress size={40} sx={{ color: "#3b82f6" }} />
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
                background: darkMode ? "#309cea" : "#3896d9",
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
                background: darkMode ? "#309cea" : "#3896d9",
                color: "#fff",
                border: "2px solid #7db6de",
                transition: "all 0.4s ease",
                "&:hover": {
                  transform: "translateY(-2px) scale(1.02)",
                  background: "linear-gradient(90deg, #309cea, #309cea)",
                  border: "2px solid #85bfe8",
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

  <Grid container spacing={2} mb={3}>
    {[ /* your wallet cards */ ].map((item, index) => (
      <Grid item xs={6} key={index}>
      </Grid>
    ))}
  </Grid>

  <ReferralCard darkMode={darkMode} />

<Grid container spacing={2} >
  {[
    {
      title: "Deposit",
      icon: <HiOutlineBanknotes size={26} />,
      color: "#2563eb",
      path: "/user-dashboard/deposit",
    },
    {
      title: "Withdraw",
      icon: <HiOutlineBanknotes size={26} />,
      color: "#ef4444",
      path: "/user-dashboard/withdraw",
    },
    {
      title: "Plans",
      icon: <HiOutlineCube size={26} />,
      color: "#f59e0b",
      path: "/user-dashboard/plan",
    },
    {
      title: "My Tasks",
      icon: <HiOutlineChartBar size={26} />,
      color: "#3b82f6",
      path: "/user-dashboard/tasks",
    },
    {
      title: "My Team",
      icon: <HiOutlineUserGroup size={26} />,
      color: "#22c55e",
      path: "/user-dashboard/team",
    },
    {
      title: "History",
      icon: <HiOutlineChartBar size={26} />,
      color: "#6366f1",
      path: "/user-dashboard/deposit-history",
    },
    {
      title: "Support",
      icon: <HiOutlineUser size={26} />,
      color: "#0ea5e9",
      path: "/user-dashboard/support",
    },
    {
      title: "Profile",
      icon: <HiUser size={26} />,
      color: "#8b5cf6",
      path: "/user-dashboard/profile",
    },
  ].map((card, index) => (
    <Grid item xs={6} sm={6} md={3} key={index}>
      <Paper
        elevation={0}
        onClick={() => navigate(card.path)}
        sx={{
          p: 3.5,
          borderRadius: 5,
          textAlign: "center",
          cursor: "pointer",
          position: "relative",
          background: darkMode
            ? "linear-gradient(145deg, #1e293b, #0f172a)"
            : "#ffffff",
          border: darkMode
            ? "1px solid rgba(255,255,255,0.06)"
            : "1px solid rgba(0,0,0,0.05)",
          boxShadow: darkMode
            ? "0 8px 20px rgba(0,0,0,0.4)"
            : "0 8px 20px rgba(0,0,0,0.06)",
          transition: "all 0.35s cubic-bezier(.4,0,.2,1)",

          "&:hover": {
            transform: "translateY(-6px)",
            boxShadow: `0 20px 40px ${card.color}30`,
            borderColor: `${card.color}40`,
          },

          "&:active": {
            transform: "scale(0.97)",
          },
        }}
      >
        {/* Icon Container */}
        <Box
          sx={{
            width: 65,
            height: 65,
            borderRadius: "18px",
            mx: "auto",
            mb: 2.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: `${card.color}15`,
            color: card.color,
            transition: "all 0.3s ease",

            "&:hover": {
              background: `${card.color}25`,
              transform: "scale(1.1)",
            },
          }}
        >
          {card.icon}
        </Box>

        {/* Title */}
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: 15,
            color: colors.textPrimary,
            letterSpacing: 0.4,
          }}
        >
          {card.title}
        </Typography>
      </Paper>
    </Grid>
  ))}
</Grid>
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