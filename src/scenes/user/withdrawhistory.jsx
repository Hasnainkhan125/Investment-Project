import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
} from "@mui/material";
import { supabase } from "../../supabaseClient";

const WithdrawHistory = () => {
  const [withdraws, setWithdraws] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWithdraws = async () => {
      try {
        const storedData = JSON.parse(localStorage.getItem("profileData")) || {};
        const userEmail = storedData.email;

        // Fetch withdraw records from Supabase table "withdraws"
        const { data, error } = await supabase
          .from("withdraws")
          .select("*")
          .eq("user_email", userEmail)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setWithdraws(data || []);
      } catch (err) {
        console.error("Error fetching withdraw history:", err.message);
        setWithdraws([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWithdraws();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          width: "100%",
          minHeight: "60vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 3,
        minHeight: "60vh",
        borderRadius: 3,
      }}
    >
      {/* Header */}
      <Typography
        variant="h4"
        sx={{
          mb: 3,
          fontWeight: "bold",
          background: "linear-gradient(90deg, #6a11cb, #2575fc)", // modern gradient
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
    Withdraw History
      </Typography>

      {withdraws.length === 0 ? (
        <Paper
          sx={{
            p: 4,
            borderRadius: 3,
            textAlign: "center",
            background: "linear-gradient(135deg, #f0f0f0, #e0e0e0)",
            color: "#555",
          }}
        >
          <Typography variant="h6">No records found.</Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {withdraws.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Paper
                sx={{
                  p: 2,
                  borderRadius: 3,
                  background: "linear-gradient(90deg, #ef4444, #dc2626)",
                  color: "#fff",
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
                }}
              >
                <Typography fontSize={16} fontWeight={600}>
                  Amount: ${item.amount}
                </Typography>
                <Typography fontSize={13} sx={{ opacity: 0.9 }}>
                  Status: {item.status}
                </Typography>
                <Typography fontSize={12} sx={{ opacity: 0.8 }}>
                  Date: {new Date(item.created_at).toLocaleString()}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default WithdrawHistory;