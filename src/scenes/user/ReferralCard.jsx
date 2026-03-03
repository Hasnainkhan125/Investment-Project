import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  Slide,
  TextField,
} from "@mui/material";
import { HiOutlineClipboardDocument } from "react-icons/hi2";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

function SlideTransition(props) {
  return <Slide {...props} direction="down" />;
}

const ReferralCard = ({ darkMode }) => {
  const isDark = darkMode;
  const [referralCode, setReferralCode] = useState("");
  const [referralLink, setReferralLink] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const generateReferralCode = (length = 6) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < length; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const code = storedUser.referralCode || generateReferralCode();

    localStorage.setItem(
      "currentUser",
      JSON.stringify({ ...storedUser, referralCode: code })
    );

    setReferralCode(code);
    setReferralLink(
      `https://investtoday2.netlify.app/user-dashboard?ref=${code}`
    );
  }, []);

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(referralLink);
    setOpenSnackbar(true);
  };

  return (
    <Box sx={{ mb: 4, width: "100%", maxWidth: 500, mx: "auto", px: 2 }}>
      <Paper
        sx={{
          p: { xs: 3, sm: 4 },
          borderRadius: 4,
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
          backdropFilter: "blur(12px)",
          background: isDark
            ? "rgba(30, 41, 59, 0.7)"
            : "rgba(255, 255, 255, 0.9)",
          boxShadow: isDark
            ? "0 10px 25px rgba(0,0,0,0.3)"
            : "0 8px 20px rgba(0,0,0,0.1)",
          transition: "all 0.3s ease",
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: 17, sm: 18 },
            fontWeight: 600,
            color: isDark ? "#ddd" : "#555",
            letterSpacing: 0.5,
          }}
        >
          Invite & Earn
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            flexWrap: { xs: "wrap", sm: "nowrap" },
          }}
        >
          <TextField
            value={referralLink}
            fullWidth
            InputProps={{
              readOnly: true,
              sx: {
                borderRadius: 3,
                background: isDark ? "rgba(255,255,255,0.05)" : "#f5f5f5",
                color: isDark ? "#fff" : "#111",
                "& .MuiOutlinedInput-notchedOutline": { border: "none" },
              },
            }}
          />
          <Tooltip title="Copy Link" arrow>
            <IconButton
              onClick={handleCopyReferral}
              sx={{
                background: "linear-gradient(90deg, #3b82f6, #2563eb)",
                color: "#fff",
                borderRadius: 3,
                p: 1.5,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "scale(1.1)",
                  boxShadow: "0 15px 35px rgba(37,99,235,0.4)",
                  background: "linear-gradient(90deg, #2563eb, #3b82f6)",
                },
              }}
            >
              <HiOutlineClipboardDocument size={22} />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>

      {/* Modern Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        TransitionComponent={SlideTransition}
      >
        <Alert
          severity="success"
          icon={<CheckCircleIcon />}
          sx={{
            width: "90%",
            maxWidth: 320,
            borderRadius: 12,
            fontWeight: 500,
            fontSize: 16,
            px: 2,
            py: 1.5,
            display: "flex",
            alignItems: "center",
            gap: 1,
            backdropFilter: "blur(12px)",
            backgroundColor: isDark ? "#1e293b" : "#fff",
            color: isDark ? "#fff" : "#111",
            boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
          }}
        >
          Referral link copied!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ReferralCard;  