import React, { useState } from "react";
import { FaCrown, FaArrowLeft } from "react-icons/fa";
import { Snackbar, Alert, Slide, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const Plans = () => {
  const navigate = useNavigate();

  const plans = [
    { title: "Starter", price: 300, daily: 60, total: 1200, days: 20 },
    { title: "Basic", price: 500, daily: 100, total: 2000, days: 20 },
    { title: "Silver", price: 700, daily: 140, total: 2800, days: 20 },
    { title: "Gold", price: 1000, daily: 200, total: 4000, days: 20 },
    { title: "Platinum", price: 1500, daily: 300, total: 6000, days: 20 },
    { title: "Diamond", price: 2000, daily: 400, total: 8000, days: 20 },
    { title: "VIP 1", price: 3000, daily: 600, total: 12000, days: 20 },
    { title: "VIP 2", price: 5000, daily: 1000, total: 20000, days: 20 },
    { title: "VIP 3", price: 10000, daily: 2000, total: 40000, days: 20 },
  ];

  const [balance, setBalance] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  function SlideTransition(props) {
    return <Slide {...props} direction="down" />;
  }

  const handleActivate = (planPrice) => {
    if (balance < planPrice) {
      setSnackbar({
        open: true,
        message: "Insufficient balance! Please top up your account.",
        severity: "error",
      });
    } else {
      setSnackbar({
        open: true,
        message: `Plan activated! Deducted PKR ${planPrice.toLocaleString()}`,
        severity: "success",
      });
      setBalance(balance - planPrice);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ minHeight: "100vh", fontFamily: "sans-serif" }}
    >
      <IconButton
        onClick={() => navigate("/user-dashboard")}
        sx={{ color: "#1976d2" }}
      >
        <FaArrowLeft size={20} />
      </IconButton>

      <h2 style={{ marginBottom: 5, fontWeight: 700, fontSize: 22 }}>
        Investment Plans
      </h2>

      <p style={{ color: "#6b7280", marginBottom: 25, fontSize: 16 }}>
        Balance: <strong>PKR {balance.toLocaleString()}</strong>
      </p>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {plans.map((plan, index) => (
          <motion.div key={index} variants={cardVariants}>
            <div
              style={{
                background: "#fff",
                borderRadius: 22,
                padding: 20,
                marginBottom: 20,
                boxShadow: "0 8px 25px rgba(0,0,0,0.06)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-6px)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateY(0px)")
              }
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #1e88e5, #1565c0)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    boxShadow: "0 4px 15px rgba(30,136,229,0.4)",
                  }}
                >
                  <FaCrown size={18} />
                </div>

                <div>
                  <div style={{ fontWeight: 600, fontSize: 16 }}>
                    {plan.title}
                  </div>
                  <div
                    style={{
                      color: "#1976d2",
                      fontWeight: 700,
                      fontSize: 20,
                      marginTop: 4,
                    }}
                  >
                    PKR {plan.price.toLocaleString()}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
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
                  background:
                    "linear-gradient(90deg, #1e88e5, #1565c0)",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 15,
                  cursor: "pointer",
                }}
                onClick={() => handleActivate(plan.price)}
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
        onClose={() =>
          setSnackbar((prev) => ({ ...prev, open: false }))
        }
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          sx={{
            borderRadius: "16px",
            fontWeight: 500,
            background:
              snackbar.severity === "success"
                ? "linear-gradient(135deg, #22c55e, #16a34a)"
                : snackbar.severity === "error"
                ? "linear-gradient(135deg, #ef4444, #dc2626)"
                : "linear-gradient(135deg, #3b82f6, #2563eb)",
            boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
            color: "#fff",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </motion.div>
  );
};

const StatBox = ({ label, value }) => (
  <div
    style={{
      flex: 1,
      background: "#f1f3f6",
      borderRadius: 14,
      padding: "12px 10px",
      textAlign: "center",
      transition: "all 0.3s ease",
    }}
  >
    <div style={{ fontSize: 13, color: "#6b7280" }}>{label}</div>
    <div style={{ fontWeight: 700, marginTop: 4 }}>{value}</div>
  </div>
);

export default Plans;