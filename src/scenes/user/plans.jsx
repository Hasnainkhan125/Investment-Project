import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Snackbar, Alert, Slide, IconButton, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowBackIosNew as ArrowBackIosNewIcon,
} from "@mui/icons-material";
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

function SlideTransition(props) {
  return <Slide {...props} direction="down" />;
}

const Plans = () => {
  const navigate = useNavigate();

  // Add a code/id for each plan
const plans = [
  { code: "BRZ01", title: "Bronze Plan", price: 300, daily: 60, total: 1200, days: 20 },
  { code: "SLV02", title: "Silver Plan", price: 500, daily: 100, total: 2000, days: 20 },
  { code: "GLD03", title: "Gold Plan", price: 700, daily: 140, total: 2800, days: 20 },
  { code: "PLT04", title: "Platinum Plan", price: 1000, daily: 200, total: 4000, days: 20 },
  { code: "DMD05", title: "Diamond Plan", price: 1500, daily: 300, total: 6000, days: 20 },
  { code: "VIPB1", title: "VIP Bronze", price: 2000, daily: 400, total: 8000, days: 20 },
  { code: "VIPS2", title: "VIP Silver", price: 3000, daily: 600, total: 12000, days: 20 },
  { code: "VIPG3", title: "VIP Gold", price: 5000, daily: 1000, total: 20000, days: 20 },
  { code: "ULT01", title: "Ultimate VIP", price: 10000, daily: 2000, total: 40000, days: 20 },
];
  const [balance, setBalance] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  const handleActivate = (planPrice, planTitle) => {
    setSnackbar(prev => ({ ...prev, open: false }));
    setTimeout(() => {
      if (balance < planPrice) {
        setSnackbar({ open: true, message: "Insufficient balance! Please deposit first.", severity: "error" });
      } else {
        setSnackbar({ open: true, message: `Activated "${planTitle}"! Deducted PKR ${planPrice.toLocaleString()}`, severity: "success" });
        setBalance(prev => prev - planPrice);
      }
    }, 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ minHeight: "100vh", fontFamily: "Poppins, sans-serif",  }}
    >
      <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
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
        <h2 style={{ marginLeft: 35, fontWeight: 700, fontSize: 24, }}>Investment Plans</h2>
      </div>

      <p style={{ color: "#6b7280", marginBottom: 25, fontSize: 16 }}>
        Current Balance: <strong>PKR {balance.toLocaleString()}</strong>
      </p>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
        {plans.map((plan, idx) => (
          <motion.div key={idx} variants={cardVariants}>
            <div
              style={{
                background: "linear-gradient(145deg, #ffffff, #f1f3f6)",
                borderRadius: 22,
                padding: 22,
                boxShadow: "0 15px 30px rgba(0,0,0,0.08)",
                position: "relative",
                overflow: "hidden",
                cursor: "pointer",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-8px)"; e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.15)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 15px 30px rgba(0,0,0,0.08)"; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{
                  width: 50, height: 50, borderRadius: "50%",
                  background: "linear-gradient(135deg,#1e88e5,#1565c0)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontWeight: 700, fontSize: 14,
                  boxShadow: "0 6px 18px rgba(30,136,229,0.4)"
                }}>
                  {plan.code} {/* Show plan code inside circle */}
                </div>

                <div>
                  <div style={{ fontWeight: 600, fontSize: 16, color: "#333" }}>{plan.title}</div>
                  <div style={{ color: "#1976d2", fontWeight: 700, fontSize: 20, marginTop: 4 }}>
                    PKR {plan.price.toLocaleString()}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, color: 'black', marginTop: 20 }}>
                <StatBox label="Daily" value={`PKR ${plan.daily}`} />
                <StatBox label="Total" value={`PKR ${plan.total}`} />
                <StatBox label="Days" value={plan.days} />
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.03 }}
                style={{
                  width: "100%",
                  marginTop: 20,
                  padding: 14,
                  borderRadius: 30,
                  border: "none",
                  background: "linear-gradient(90deg, #1e88e5, #1565c0)",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 15,
                  cursor: "pointer",
                }}
                onClick={() => handleActivate(plan.price, plan.title)}
              >
                Activate Plan
              </motion.button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        TransitionComponent={SlideTransition}
        onClose={(event, reason) => { if (reason === "clickaway") return; setSnackbar(prev => ({ ...prev, open: false })); }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          sx={{
            width: "100%",
            maxWidth: 420,
            borderRadius: "18px",
            fontWeight: 600,
            fontSize: { xs: "14px", sm: "15px" },
            px: 2.5,
            py: 1,
            backdropFilter: "blur(10px)",
            background:
              snackbar.severity === "success"
                ? "linear-gradient(135deg, #16a34a, #22c55e)"
                : snackbar.severity === "error"
                  ? "linear-gradient(135deg, #dc2626, #ef4444)"
                  : "linear-gradient(135deg, #2563eb, #3b82f6)",
            boxShadow:
              snackbar.severity === "success"
                ? "0 10px 30px rgba(34,197,94,0.35)"
                : snackbar.severity === "error"
                  ? "0 10px 30px rgba(239,68,68,0.35)"
                  : "0 10px 30px rgba(59,130,246,0.35)",
            color: "#fff",
            letterSpacing: 0.3,
            display: "flex",
            alignItems: "center",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </motion.div>
  );
};

const StatBox = ({ label, value }) => (
  <Tooltip title={label} arrow>
    <div style={{
      flex: 1,
      background: "#f1f3f6",
      borderRadius: 14,
      padding: "12px 10px",
      textAlign: "center",
      transition: "all 0.3s ease",
    }}>
      <div style={{ fontSize: 13, color: "#6b7280" }}>{label}</div>
      <div style={{ fontWeight: 700, marginTop: 4 }}>{value}</div>
    </div>
  </Tooltip>
);

export default Plans;