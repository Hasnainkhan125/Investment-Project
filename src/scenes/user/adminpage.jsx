import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Grid, Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDeposits: 0,
    totalWithdrawals: 0,
    totalCommission: 0,
    transactions: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch users
        const usersRes = await axios.get("/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Fetch transactions
        const transactionsRes = await axios.get("/api/admin/transactions", {
          headers: { Authorization: `Bearer ${token}` },
        });

        let deposits = 0,
          withdrawals = 0,
          commission = 0;

        transactionsRes.data.forEach((tx) => {
          if (tx.type === "deposit" && tx.status === "completed") deposits += tx.amount;
          if (tx.type === "withdraw" && tx.status === "completed") withdrawals += tx.amount;
          if (tx.type === "referral" && tx.status === "completed") commission += tx.amount;
        });

        setStats({
          totalUsers: usersRes.data.length,
          totalDeposits: deposits,
          totalWithdrawals: withdrawals,
          totalCommission: commission,
          transactions: transactionsRes.data.slice(-10).reverse(),
        });
      } catch (err) {
        console.error("Admin Dashboard fetch error:", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Admin Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="subtitle1">Total Users</Typography>
            <Typography variant="h5">{stats.totalUsers}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="subtitle1">Total Deposits</Typography>
            <Typography variant="h5">${stats.totalDeposits.toLocaleString()}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="subtitle1">Total Withdrawals</Typography>
            <Typography variant="h5">${stats.totalWithdrawals.toLocaleString()}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="subtitle1">Total Commission</Typography>
            <Typography variant="h5">${stats.totalCommission.toLocaleString()}</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Typography variant="h6" sx={{ mb: 2 }}>
        Recent Transactions
      </Typography>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User ID</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stats.transactions.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell>{tx.user_id}</TableCell>
                <TableCell>{tx.type}</TableCell>
                <TableCell>${tx.amount}</TableCell>
                <TableCell>{tx.status}</TableCell>
                <TableCell>{new Date(tx.created_at).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default AdminDashboard;