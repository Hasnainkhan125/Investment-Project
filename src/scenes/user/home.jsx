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
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ImageCarousel from "../user/ImageCarousel"; // adjust path as needed
import { motion } from "framer-motion";

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
    const [walletBalance, setWalletBalance] = useState(0);
    const [hideBalance, setHideBalance] = useState(true);

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};
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

    }, [referralCode, walletBalance]);


    



    const colors = {
      background: darkMode ? "#0f172a" : "#e6e6e6",
      cardBg: darkMode ? "#1e293b" : "#ffffff",
      textPrimary: darkMode ? "#f8fafc" : "#111827",
      textSecondary: darkMode ? "#a1a1aa" : "#636362",
    };


    return (
      <Box sx={{ }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
<Box
  sx={{
    overflow: "hidden", // ensures animation doesn't overflow
  }}
>
  <Typography
    sx={{
      fontSize: { xs: "1rem", sm: "1.1rem", md: "1.3rem" }, // responsive
      letterSpacing: "0.5px",
      fontWeight: 500,
      color: "#94a3b8",
      opacity: 0,
      transform: "translateX(-20px)",
      animation: "fadeSlideIn 0.8s forwards",
      "@keyframes fadeSlideIn": {
        "0%": { opacity: 0, transform: "translateX(-20px)" },
        "100%": { opacity: 1, transform: "translateX(0)" },
      },
    }}
  >
    Welcome back,{" "}
    <span
      style={{
        background: "linear-gradient(90deg, #5480e7, #60a5fa, #3b82f6)",
        backgroundSize: "200% 200%",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        fontWeight: 700,
        display: "inline-block",
        animation: "gradientShift 3s ease infinite",
      }}
    >
      {userName}
    </span>{" "}
    👋
  </Typography>

  <style>
    {`
      @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    `}
  </style>
</Box>
        </Box>


<motion.div
  variants={fadeUp}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.2 }}
>
{/* Balance Card */}
<Paper
  elevation={0}
  sx={{
    mb: 4,
    p: 3,
    borderRadius: 5,
    background: darkMode
      ? "linear-gradient(135deg, #0f172a, #1e293b)"
      : "linear-gradient(135deg, #0080ff, #0061c2)",

    color: "#fff",
    position: "relative",
    overflow: "hidden",
    transition: "all 0.3s ease",
  }}
>
  {/* Subtle Glow */}
  <Box
    sx={{
      position: "absolute",
      top: -50,
      right: -50,
      width: 140,
      height: 140,
      background: "rgba(255,255,255,0.08)",
      borderRadius: "50%",
      filter: "blur(50px)",
    }}
  />

  {/* Header */}
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
<Box
  sx={{
    width: 50,
    height: 50,
    borderRadius: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255,255,255,0.15)",
  }}
>
  <AccountBalanceWalletIcon
    sx={{
      fontSize: 30,
      color: "#fff",
    }}
  />
</Box>      <Typography sx={{ fontSize: 17, opacity: 0.85 }}>
        Available Balance
      </Typography>
    </Box>

    <IconButton
      onClick={() => setHideBalance(!hideBalance)}
      size="small"
      sx={{
        background: "rgba(255,255,255,0.12)",
        color: "#fff",
        borderRadius: 2,
        p: 1,
        "&:hover": {
          background: "rgba(255,255,255,0.25)",
        },
      }}
    >
      {hideBalance ? <HiOutlineEye size={18} /> : <HiOutlineEyeSlash size={18} />}
    </IconButton>
  </Box>

  {/* Balance */}
  <Typography
    sx={{
      mt: 1.5,
      fontSize: { xs: 36, sm: 32 },
      fontWeight: 700,
      letterSpacing: 0.5,
    }}
  >
    {hideBalance ? "******" : `PKR ${walletBalance.toLocaleString()}`}
  </Typography>

  {/* Buttons - Full Width with Small Gap */}
  <Box
    sx={{
      display: "flex",
      gap: 1.5, // small gap
      mt: 2.5,
    }}
  >
    <Button
      fullWidth
      onClick={() => navigate("/user-dashboard/deposit")}
      sx={{
        py: 1.3,
        borderRadius: 10,
        fontSize: 19,
        fontWeight: 600,
        textTransform: "none",
        background: "#ffffff",
        color: "#2563eb",
        transition: "all 0.3s ease",
        "&:hover": {
          background: "#f1f5f9",
          transform: "translateY(-2px)",
        },
      }}
    >
      Deposit
    </Button>

    <Button
      fullWidth
      onClick={() => navigate("/user-dashboard/withdraw")}
      sx={{
        py: 1.3,
        borderRadius: 10,
        fontWeight: 600,
                fontSize: 19,
        textTransform: "none",
        background: "linear-gradient(135deg, #2782dc, #0c72d8)",
        border: "1px solid rgba(255,255,255,0.15)",
        color: "#fff",
        transition: "all 0.3s ease",
        "&:hover": {
          background: "rgba(255,255,255,0.25)",
          transform: "translateY(-2px)",
        },
      }}
    >
      Withdraw
    </Button>
  </Box>
  
</Paper>
</motion.div>


{/* Announcement Section */}
  <Box
    sx={{
      mt: -2, // slightly closer to balance card
      borderRadius: 5,
      overflow: "hidden",
      background: darkMode
        ? "linear-gradient(135deg, #0f172a, #1e293b)"
        : "linear-gradient(135deg, #ffffff, #ffffff)",
    }}
  >
    <Box
      sx={{
        width: "100%",
        py: 1.5,
        fontSize: 17,
        px: 2,
        color: darkMode ? "#fff" : "#0f172a", 
        whiteSpace: "nowrap",
        display: "inline-block",
        animation: "marquee 10s linear infinite",
      }}
    >
      🎉 Welcome to InvestPro — Pakistan's #1 Trusted Investment Platform Secure • Fast • Reliable Withdrawals
  </Box>

    <style>
      {`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}
    </style>
  </Box>
<ImageCarousel darkMode={darkMode} />


  <Grid container spacing={2} >
    {[ /* your wallet cards */ ].map((item, index) => (
      <Grid item xs={6} key={index}>
      </Grid>
    ))}
  </Grid>

<motion.div
  variants={fadeUp}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.2 }}
>
  
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
            width: 75,
            height: 75,
            borderRadius: "18px",
            mx: "auto",
            mb: 2,
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
</motion.div>
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