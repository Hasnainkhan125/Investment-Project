import React, { useState } from "react";
import {
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Button,
  Paper,
} from "@mui/material";

const depositData = [];
const withdrawData = [];

const DepositHistory = () => {
  const [type, setType] = useState("deposit");

  const handleChange = (event, newType) => {
    if (newType !== null) setType(newType);
  };

  const data = type === "deposit" ? depositData : withdrawData;

  const pending = data.filter((item) => item.status === "Pending");
  const approved = data.filter((item) => item.status === "Approved");
  const rejected = data.filter((item) => item.status === "Rejected");

  return (
    <Box
      sx={{
        minHeight: "100vh",
      }}
    >
      {/* Title */}
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
<Box
  sx={{
    display: "flex",
    justifyContent: "center",
    mb: 3,
  }}
>
  <ToggleButtonGroup
    value={type}
    exclusive
    onChange={handleChange}
    sx={{
      background: "rgba(0,128,255,0.08)",
      backdropFilter: "blur(10px)",
      borderRadius: "50px",
      p: "6px",
      width: { xs: "100%", sm: 520 },
      boxShadow: "0 10px 30px rgba(0,128,255,0.08)",
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
            letterSpacing: 0.3,
            color: active ? "#fff" : "#0f172a",
            background: active
              ? "linear-gradient(135deg, #3e92e6, #3e92e6 )"
              : "transparent",
            transition: "all 0.35s cubic-bezier(.4,0,.2,1)",

            "&:hover": {
              background: active
                ? "linear-gradient(135deg, #0072e6, #005ce6)"
                : "rgba(0,128,255,0.12)",
              transform: "translateY(-2px)",
            },

            "&.Mui-selected": {
              color: "#fff",
            },
          }}
        >
          {item === "deposit"
            ? "Deposit History"
            : "Withdraw History"}
        </ToggleButton>
      );
    })}
  </ToggleButtonGroup>
</Box>
      {/* Empty State */}
      {data.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: "center",
            borderRadius: 4,
            background: "#ffffff",
            boxShadow: "0 15px 40px rgba(0,0,0,0.05)",
          }}
        >
          <Typography
            sx={{
              fontSize: 16,
              fontWeight: 500,
              color: "#94a3b8",
            }}
          >
            {type === "deposit"
              ? "No deposit history"
              : "No withdraw history"}
          </Typography>
        </Paper>
      ) : (
        <>
          {/* Status Summary Cards */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(3,1fr)",
              },
              gap: 3,
              mb: 5,
            }}
          >
            <StatusCard
              title="Pending"
              count={pending.length}
              color="#f59e0b"
              bg="#fff7ed"
            />
            <StatusCard
              title="Approved"
              count={approved.length}
              color="#10b981"
              bg="#ecfdf5"
            />
            <StatusCard
              title="Rejected"
              count={rejected.length}
              color="#ef4444"
              bg="#fef2f2"
            />
          </Box>

          {/* List Sections */}
          <StatusSection title="Pending" items={pending} color="#f59e0b" />
          <StatusSection title="Approved" items={approved} color="#10b981" />
          <StatusSection title="Rejected" items={rejected} color="#ef4444" />
        </>
      )}
    </Box>
  );
};

const StatusCard = ({ title, count, color, bg }) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      borderRadius: 4,
      background: bg,
      textAlign: "center",
      border: `1px solid ${color}20`,
    }}
  >
    <Typography sx={{ fontSize: 14, fontWeight: 600, color }}>
      {title}
    </Typography>
    <Typography sx={{ fontSize: 28, fontWeight: 800, color }}>
      {count}
    </Typography>
  </Paper>
);

const StatusSection = ({ title, items, color }) => {
  if (items.length === 0) return null;

  return (
    <Box sx={{ mb: 4 }}>
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: 18,
          mb: 2,
          color,
        }}
      >
        {title}
      </Typography>

      {items.map((item) => (
        <Paper
          key={item.id}
          elevation={0}
          sx={{
            p: 3,
            mb: 2,
            borderRadius: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#ffffff",
            boxShadow: "0 8px 25px rgba(0,0,0,0.04)",
            transition: "0.3s",
            "&:hover": {
              transform: "translateY(-3px)",
              boxShadow: "0 12px 35px rgba(0,0,0,0.08)",
            },
          }}
        >
          <Box>
            <Typography fontWeight={700}>
              ${item.amount}
            </Typography>
            <Typography fontSize={13} color="#94a3b8">
              {item.date}
            </Typography>
          </Box>

          <Button
            sx={{
              px: 3,
              height: 38,
              borderRadius: 2,
              fontWeight: 600,
              fontSize: 13,
              textTransform: "none",
              background: "linear-gradient(135deg,#0080ff,#0066ff)",
              color: "#fff",
              "&:hover": {
                background: "linear-gradient(135deg,#0072e6,#005ce6)",
              },
            }}
          >
            View
          </Button>
        </Paper>
      ))}
    </Box>
  );
};

export default DepositHistory;