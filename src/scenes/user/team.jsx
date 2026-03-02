import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  Slide,
} from "@mui/material";
import { HiOutlineClipboardDocument } from "react-icons/hi2";
import { FaWhatsapp, FaTelegramPlane, FaCheckCircle } from "react-icons/fa";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

function SlideTransition(props) {
  return <Slide {...props} direction="down" />;
}

const Team = ({ darkMode }) => {
  const [referralCode, setReferralCode] = useState("");
  const [referralLink, setReferralLink] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [level, setLevel] = useState(1);
  const [team, setTeam] = useState([]);
  const [commission, setCommission] = useState(0);
  const [loading, setLoading] = useState(false);

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

  // Copy referral link
  const handleCopyReferral = () => {
    navigator.clipboard.writeText(referralLink);
    setOpenSnackbar(true);
  };

  // Share links
  const shareWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=Join using my referral link: ${referralLink}`;
    window.open(url, "_blank");
  };

  const shareTelegram = () => {
    const url = `https://t.me/share/url?url=${referralLink}&text=Join using my referral link!`;
    window.open(url, "_blank");
  };

  // Handle level change
  const handleLevelChange = (lvl) => {
    setLevel(lvl);
    if (lvl === 2) {
      setLoading(true);
      setTimeout(() => {
        setTeam([]); // simulate no members
        setLoading(false);
      }, 1000);
    }
    if (lvl === 3) {
      setTeam([]); // level 3 restricted
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 900, mx: "auto",}}>
      {/* Referral Card */}
      <Paper
        sx={{
          p: 4,
          borderRadius: 6,
          background: darkMode
            ? "linear-gradient(135deg, #1f2937, #111827)"
            : "linear-gradient(90deg, #3c7ad1, #50b5ff)",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          gap: 3,
          boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
        }}
      >
        <Typography sx={{ fontSize: 20, fontWeight: "bold" }}>
          Invite & Earn
        </Typography>

        {/* Policies */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <FaCheckCircle size={14} /> Send this link to your friends. When they
            sign up, you get commission on their deposits.
          </Typography>
          <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <FaCheckCircle size={14} /> Level 1: 20% | Level 2: 3% | Level 3: 1%
          </Typography>
          <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <FaCheckCircle size={14} /> Click COPY, then share on WhatsApp,
            Telegram, etc.
          </Typography>
        </Box>

        <Box
          sx={{
            background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(32, 103, 127, 0.5)",
            p: 2,
            borderRadius: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            sx={{
              wordBreak: "break-all",
              flex: 1,
              pr: 2,
              color: darkMode ? "#fff" : "#ffffff",
            }}
          >
            {referralLink}
          </Typography>

          <Tooltip title="Copy Link">
            <IconButton
              onClick={handleCopyReferral}
              sx={{
                background: darkMode ? "#309cea" : "#3896d9",
                color: "#fff",
                "&:hover": { transform: "scale(1.1)", boxShadow: "0 8px 20px rgba(0,0,0,0.4)" },
              }}
            >
              <HiOutlineClipboardDocument size={22} />
            </IconButton>
          </Tooltip>
        </Box>

        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Tooltip title="Share on WhatsApp">
            <IconButton
              onClick={shareWhatsApp}
              sx={{
                background: "#25D366",
                color: "#fff",
                "&:hover": { transform: "scale(1.1)" },
              }}
            >
              <FaWhatsapp />
            </IconButton>
          </Tooltip>

          <Tooltip title="Share on Telegram">
            <IconButton
              onClick={shareTelegram}
              sx={{
                background: "#148fcc",
                color: "#fff",
                "&:hover": { transform: "scale(1.1)" },
              }}
            >
              <FaTelegramPlane />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>

{/* Stats */}
<Box display="flex" gap={3} mt={4} mb={3}>
  <Paper
    sx={{
      flex: 1,
      p: 4,
      textAlign: "center",
      borderRadius: 4,
      background: darkMode ? "#1f2937" : "#fdfdfd", // soft white background in light mode
      boxShadow: darkMode
        ? "0 6px 20px rgba(0,0,0,0.4)"
        : "0 6px 20px rgba(0,0,0,0.08)", // soft shadow for modern look
      transition: "all 0.3s",
      "&:hover": {
        transform: "translateY(-3px)",
        boxShadow: darkMode
          ? "0 10px 25px rgba(0,0,0,0.5)"
          : "0 10px 25px rgba(0,0,0,0.12)",
      },
    }}
  >
    <Typography variant="h4" fontWeight="bold" color={darkMode ? "#fff" : "#111"}>
      {commission}
    </Typography>
    <Typography color={darkMode ? "#aaa" : "#555"}>Commission</Typography>
  </Paper>

  <Paper
    sx={{
      flex: 1,
      p: 4,
      textAlign: "center",
      borderRadius: 4,
      background: darkMode ? "#1f2937" : "#fdfdfd",
      boxShadow: darkMode
        ? "0 6px 20px rgba(0,0,0,0.4)"
        : "0 6px 20px rgba(0,0,0,0.08)",
      transition: "all 0.3s",
      "&:hover": {
        transform: "translateY(-3px)",
        boxShadow: darkMode
          ? "0 10px 25px rgba(0,0,0,0.5)"
          : "0 10px 25px rgba(0,0,0,0.12)",
      },
    }}
  >
    <Typography variant="h4" fontWeight="bold" color={darkMode ? "#fff" : "#111"}>
      {team.length}
    </Typography>
    <Typography color={darkMode ? "#aaa" : "#555"}>Team Size</Typography>
  </Paper>
</Box>

    {/* Level Buttons */}
<Box sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 3 }}>
  {[1, 2, 3].map((lvl) => (
    <Box
      key={lvl}
      onClick={() => handleLevelChange(lvl)}
      sx={{
        flex: 1,
        py: 1.3,
        borderRadius: 2,
        cursor: "pointer",
        fontSize: '15px',
        textAlign: "center",
        fontFamily: "Poppins, sans-serif",
        background:
          level === lvl
            ? "#50b5ff" // active blue
            : "#ffffff", // default white
        color: level === lvl ? "#fff" : "#1f1f1f",
        boxShadow:
          level === lvl
            ? "0 6px 15px rgba(0,0,0,0.25)"
            : "0 4px 12px rgba(0,0,0,0.08)",
        transition: "all 0.3s",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow:
            level === lvl
              ? "0 8px 20px rgba(0,0,0,0.3)"
              : "0 6px 18px rgba(0,0,0,0.15)",
        },
      }}
    >
      Level {lvl}
    </Box>
  ))}
</Box>
      {/* Team List */}
      <Paper
        sx={{
          p: 3,
          mt: 3,
          borderRadius: 3,
          background: darkMode ? "#1f2937" : "#f9fafb",
          boxShadow: darkMode
            ? "0 8px 25px rgba(0,0,0,0.3)"
            : "0 8px 25px rgba(0,0,0,0.1)",
        }}
      >
        {level === 3 ? (
          <Typography align="center" color={darkMode ? "#aaa" : "#555"}>
            Level 3 requires higher plan to view
          </Typography>
        ) : loading ? (
          <Typography align="center" color={darkMode ? "#aaa" : "#555"}>
            Loading...
          </Typography>
        ) : team.length === 0 ? (
          <Typography align="center" color={darkMode ? "#aaa" : "#555"}>
            No members found
          </Typography>
        ) : (
          team.map((member) => (
            <Box
              key={member.id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                py: 1,
                borderBottom: "1px solid",
                borderColor: darkMode ? "#333" : "#ddd",
              }}
            >
              <Typography color={darkMode ? "#fff" : "#111"}>
                {member.name || member.email}
              </Typography>
              <Typography color="gray">{member.email}</Typography>
            </Box>
          ))
        )}
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
            backgroundColor: darkMode ? "#333" : "#fff",
            color: darkMode ? "#fff" : "#111",
          }}
        >
          Referral link copied!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Team;