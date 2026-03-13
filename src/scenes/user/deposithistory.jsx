// src/scenes/user/DepositHistory.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
  Chip,
  IconButton,
} from "@mui/material";
import { supabase } from "../../supabaseClient";
import { ArrowBackIosNew as ArrowBackIosNewIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const DepositHistory = () => {
  const navigate = useNavigate();
  const [type, setType] = useState("deposit");
  const [data, setData] = useState([]);
  const [user, setUser] = useState(null);
  const colors = { subText: "#6b7280" };

  const handleChange = (event, newType) => {
    if (newType !== null) setType(newType);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "warning";
      case "approved":
        return "success";
      case "rejected":
        return "error";
      default:
        return "default";
    }
  };

  const methodImages = {
    Easypaisa: "https://incomix-world.vercel.app/images/easypaisa.png",
    JazzCash: "https://incomix-world.vercel.app/images/jazzcash.png",
  };

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) setUser(data.user);
    };
    loadUser();
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user) return;

      const tableName = type === "deposit" ? "deposits" : "withdrawals";
      const { data: transactions, error } = await supabase
        .from(tableName)
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching transactions:", error);
        setData([]);
      } else {
        setData(transactions || []);
      }
    };

    fetchTransactions();
  }, [type, user]);

  return (
    <Box sx={{ minHeight: "100vh",}}>

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
      {/* Gradient Title */}
      <Typography
        sx={{
          textAlign: "center",
          fontSize: { xs: 26, md: 34 },
          fontWeight: 800,
          mb: 4,
          background: "linear-gradient(135deg,#0080ff,#0066ff)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Transaction History
      </Typography>

      {/* Toggle */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <ToggleButtonGroup
          value={type}
          exclusive
          onChange={handleChange}
          sx={{
            background: "rgba(0,128,255,0.08)",
            backdropFilter: "blur(10px)",
            borderRadius: "50px",
            width: { xs: "100%", sm: 520 },
          }}
        >
          {["deposit", "withdraw"].map((item) => {
            const active = type === item;
            return (
              <ToggleButton
                key={item}
                value={item}
                sx={{
                  flex: 1,
                  height: 60,
                  borderRadius: "40px",
                  fontWeight: 700,
                  fontSize: 15,
                  textTransform: "none",
                  border: "none",
                  color: active ? "#fff" : "#0f172a",
                  background: active
                    ? "linear-gradient(135deg, #3e92e6, #3e92e6)"
                    : "transparent",
                  "&:hover": {
                    background: active
                      ? "linear-gradient(135deg, #0072e6, #005ce6)"
                      : "rgba(0,128,255,0.12)",
                  },
                  "&.Mui-selected": { color: "#fff" },
                }}
              >
                {item === "deposit" ? "Deposit History" : "Withdraw History"}
              </ToggleButton>
            );
          })}
        </ToggleButtonGroup>
      </Box>

      {/* Scrollable History */}
      <Box sx={{ flex: 1, overflowY: "auto", }}>
        {data.length === 0 ? (
          <Typography textAlign="center" mt={5} color={colors.subText}>
            No transactions yet
          </Typography>
        ) : (
          data.map((item) => {
            const method = item.method;
            const methodColor = method === "Easypaisa" ? "#00a651" : "#ed1c24";
            const methodImage = methodImages[method] || "";

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
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      background: methodColor + "20",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {methodImage && (
                      <img
                        src={methodImage}
                        alt={method}
                        style={{
                          width: 24,
                          height: 24,
                          objectFit: "contain",
                          borderRadius: 4,
                        }}
                      />
                    )}
                  </Box>
                  <Box>
                    <Typography fontWeight={700} fontSize={"15px"}>
                      {item.method}
                    </Typography>
                    <Typography fontSize={13}>PKR {item.amount}</Typography>
                    <Typography fontSize={14} color={colors.subText}>
                      TRX: {item.trx}
                    </Typography>
                    <Typography fontSize={12} color={colors.subText}>
                      Date: {new Date(item.created_at).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  label={item.status}
                  color={getStatusColor(item.status)}
                  size="large"
                />
              </Paper>
            );
          })
        )}
      </Box>
    </Box>
  );
};

export default DepositHistory;