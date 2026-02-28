import React, { useState, useEffect } from "react";
import { Box, Paper, Typography, Grid, Button, Chip, CircularProgress } from "@mui/material";

const AdminDeposits = ({ darkMode }) => {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(false);

  const colors = darkMode
    ? {
        card: "rgba(17, 24, 39, 0.85)",
        cardSoft: "rgba(31, 41, 55, 0.85)",
        border: "1px solid rgba(0,255,170,0.2)",
        text: "#e2e8f0",
        subText: "#94a3b8",
        neon: "#00ffa3",
      }
    : {
        card: "#ffffff",
        cardSoft: "#f8fafc",
        border: "1px solid rgba(0,0,0,0.08)",
        text: "#0f172a",
        subText: "#64748b",
        neon: "#16a34a",
      };

  // Fetch all deposits from backend
  const fetchDeposits = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/deposits"); // your backend endpoint
      const data = await res.json();
      setDeposits(Array.isArray(data) ? data.reverse() : []);
    } catch (err) {
      console.error("Error fetching deposits:", err);
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, []);

  // Approve or Reject
  const updateStatus = async (id, status) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:4000/api/deposit/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        fetchDeposits(); // refresh after update
      }
    } catch (err) {
      console.error("Error updating status:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch ((status || "").toLowerCase()) {
      case "pending":
        return "warning";
      case "approved":
        return "success";
      case "rejected":
      case "failed":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Box sx={{ minHeight: "100vh",}}>
      <Typography sx={{ fontSize: 28, fontWeight: 800, mb: 3, textTransform: 'uppercase', textAlign: "center" }}>
        Admin Deposits
      </Typography>

      <Grid container spacing={3}>
        {deposits.length > 0 ? (
          deposits.map((item) => (
            <Grid item xs={12} md={6} key={item.id}>
              <Paper sx={{ p: 3, borderRadius: 3, background: colors.cardSoft, border: colors.border }}>
                <Typography sx={{ fontWeight: 700, color: colors.text }}>
                  {item.method} - PKR {item.amount}
                </Typography>
                <Typography sx={{ fontSize: 12, color: colors.subText }}>TRX: {item.trx}</Typography>
                <Box sx={{ mt: 2, display: "flex", gap: 1, alignItems: "center" }}>
                  <Chip label={item.status} color={getStatusColor(item.status)} size="small" />
                  {item.status?.toLowerCase() === "pending" && (
                    <>
                      <Button
                        size="small"
                        color="success"
                        variant="outlined"
                        onClick={() => updateStatus(item.id, "Approved")}
                        disabled={loading}
                      >
                        Approve
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        variant="outlined"
                        onClick={() => updateStatus(item.id, "Rejected")}
                        disabled={loading}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                </Box>
              </Paper>
            </Grid>
          ))
        ) : (
          <Box sx={{ p: 8, width: "100%", textAlign: "center", border: `2px dashed ${colors.neon}`, borderRadius: 3, color: colors.subText }}>
            No deposits yet
          </Box>
        )}
      </Grid>
    </Box>
  );
};

export default AdminDeposits;