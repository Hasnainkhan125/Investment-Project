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

  // Generate a random referral code
const generateReferralCode = (length = 6) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};
  // Initialize referral code and link
useEffect(() => {
  const storedUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

  // Use existing code if available, else generate one
  const code = storedUser.referralCode || generateReferralCode();
  
  // Save back to localStorage (optional, you should save it in DB ideally)
  localStorage.setItem(
    "currentUser",
    JSON.stringify({ ...storedUser, referralCode: code })
  );

  setReferralCode(code);

  // This is your real project link
  setReferralLink(`https://investtoday2.netlify.app/user-dashboard?ref=${code}`);
}, []);

  // Copy referral link
  const handleCopyReferral = () => {
    navigator.clipboard.writeText(referralLink);
    setOpenSnackbar(true);
  };

  return (
    <Box sx={{ mb: 3, width: "100%", mx: "auto", }}>
      <Paper
        sx={{
          p: 4,
          borderRadius: 6,
          background: isDark
            ? "linear-gradient(135deg, #1f2937, #111827)"
            : "#fff",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          transition: "all 0.3s ease",
        }}
      >
        <Typography
          sx={{ fontSize: 18, color: isDark ? "#aaa" : "#666", letterSpacing: 1 }}
        >
       Invite & Earn
        </Typography>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "nowrap" }}>
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
          <Tooltip title="Copy Link">
            <IconButton
              onClick={handleCopyReferral}
              sx={{
                  background: "linear-gradient(90deg, #309cea, #309cea)",
                color: "#fff",
                borderRadius: 3,
                p: 1.5,
                "&:hover": {
                  transform: "scale(1.1)",
                  boxShadow: "0 15px 35px #7db6de",
                },
              }}
            >
              <HiOutlineClipboardDocument size={22} />
            </IconButton>
          </Tooltip>
        </Box>

      </Paper>

      {/* Snackbar */}
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
            maxWidth: 300,
            borderRadius: 12,
            fontWeight: 500,
            fontSize: 16,
            px: 2,
            py: 1.5,
            display: "flex",
            alignItems: "center",
            gap: 1,
            backdropFilter: "blur(12px)",
            backgroundColor: isDark ? "#333" : "#fff",
            color: isDark ? "#fff" : "#111",    
          }}
        >
          Referral link copied!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ReferralCard;