import React from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

// Sample data (empty for demo)
const depositData = [];
// Example with records:
// const depositData = [
//   { id: 1, date: "2026-03-01", amount: 250, status: "Completed" },
//   { id: 2, date: "2026-03-02", amount: 100, status: "Pending" },
// ];

const DepositHistory = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
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
        Deposit History
      </Typography>

      {/* Table */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          boxShadow:
            theme.palette.mode === "light"
              ? "0 8px 25px rgba(0,0,0,0.05)"
              : "0 8px 25px rgba(0,0,0,0.5)",
        }}
      >
        <Table>
          <TableHead>
            <TableRow
              sx={{
                background: "linear-gradient(90deg, #6a11cb, #2575fc)",
              }}
            >
              <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Date</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Amount</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Status</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {depositData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 5 }}>
                  <Typography
                    sx={{
                      color: theme.palette.mode === "light" ? "#555" : "#ccc",
                      fontStyle: "italic",
                      fontSize: 14,
                    }}
                  >
                    No records found.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              depositData.map((deposit) => (
                <TableRow
                  key={deposit.id}
                  sx={{
                    "&:hover": {
                      backgroundColor:
                        theme.palette.mode === "light" ? "#edf2ff" : "#2c2c2c",
                      transition: "0.3s",
                    },
                  }}
                >
                  <TableCell>{deposit.date}</TableCell>
                  <TableCell>${deposit.amount}</TableCell>
                  <TableCell>{deposit.status}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      sx={{
                        background: "linear-gradient(90deg, #6a11cb, #2575fc)",
                        color: "#fff",
                        textTransform: "none",
                        borderRadius: 2,
                        px: 3,
                        py: 1,
                        fontSize: 14,
                        fontWeight: 500,
                        "&:hover": {
                          background: "linear-gradient(90deg, #5a0fcf, #1f64e0)",
                        },
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DepositHistory;