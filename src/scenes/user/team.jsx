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
import { ArrowBackIosNew as ArrowBackIosNewIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

function SlideTransition(props) {
  return <Slide {...props} direction="down" />;
}

const Team = ({ darkMode }) => {
  const navigate = useNavigate();
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
// Generate referral link for sharing
useEffect(() => {
  const storedUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const code = storedUser.referralCode || generateReferralCode();

  // Save referral code in localStorage
  localStorage.setItem(
    "currentUser",
    JSON.stringify({ ...storedUser, referralCode: code })
  );

  setReferralCode(code);

  // ✅ FIX: point to /register instead of /user-dashboard
  setReferralLink(
    `https://investtoday2.netlify.app/register?ref=${code}`
  );
}, []);
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
    <Box sx={{ width: "100%", maxWidth: 900, mx: "auto", pb: 6 }}>

<IconButton
  onClick={() => navigate("/user-dashboard")}
  sx={{
    color: "#fff",
    background: "linear-gradient(135deg, #0080ff, #1565c0)",
    boxShadow: "0 6px 15px rgba(30,136,229,0.4)",
    borderRadius: "12px",
    p: 1.5,
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "scale(1.1)",
      background: "linear-gradient(135deg, #1565c0, #1e88e5)",
      boxShadow: "0 8px 20px rgba(30,136,229,0.6)",
    },
  }}
>
  <ArrowBackIosNewIcon fontSize="medium" />
</IconButton>


   <Paper
  sx={{
    p: { xs: 3, sm: 4 }, // smaller padding on mobile
    borderRadius: { xs: 3, sm: 6 },
    background: darkMode
      ? "linear-gradient(135deg, #1f2937, #111827)"
      : "linear-gradient(90deg, #0573e2, #0573e2)",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    gap: { xs: 2, sm: 3 },
    boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
    mt: { xs: 2, sm: 3 },
  }}
>
  {/* Title */}
  <Typography sx={{ fontSize: { xs: 18, sm: 20 }, fontWeight: "bold" }}>
    Invite & Earn
  </Typography>

  {/* Policies */}
  <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 1, sm: 1.5 } }}>
    <Typography sx={{ display: "flex", alignItems: "center", gap: 1, fontSize: { xs: 12, sm: 14 } }}>
      <FaCheckCircle size={14} /> Send this link to your friends. When they sign up, you get commission on their deposits.
    </Typography>
    <Typography sx={{ display: "flex", alignItems: "center", gap: 1, fontSize: { xs: 12, sm: 14 } }}>
      <FaCheckCircle size={14} /> Level 1: 12% | Level 2: 5% | Level 3: 1%
    </Typography>
    <Typography sx={{ display: "flex", alignItems: "center", gap: 1, fontSize: { xs: 12, sm: 14 } }}>
      <FaCheckCircle size={14} /> Click COPY, then share on WhatsApp, Telegram, etc.
    </Typography>
  </Box>

  {/* Referral Link */}
  <Box
    sx={{
      background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(32, 103, 127, 0.5)",
      p: { xs: 1.5, sm: 2 },
      borderRadius: { xs: 2, sm: 3 },
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      mt: { xs: 2, sm: 3 },
    }}
  >
    <Typography
      sx={{
        wordBreak: "break-all",
        flex: 1,
        pr: { xs: 1, sm: 2 },
        fontSize: { xs: 12, sm: 14 },
        color: darkMode ? "#fff" : "#ffffff",
      }}
    >
      {referralLink}
    </Typography>

    <Tooltip title="Copy Link">
      <IconButton
        onClick={handleCopyReferral}
        sx={{
          width: { xs: 32, sm: 40 },
          height: { xs: 32, sm: 40 },
          background: darkMode ? "#309cea" : "#3896d9",
          color: "#fff",
          "&:hover": {
            transform: "scale(1.1)",
            boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
          },
        }}
      >
        <HiOutlineClipboardDocument size={20} />
      </IconButton>
    </Tooltip>
  </Box>

  {/* Social Buttons */}
  <Box sx={{ display: "flex", gap: { xs: 1, sm: 2 }, mt: { xs: 1, sm: 2 } }}>
    <Tooltip title="Share on WhatsApp">
      <IconButton
        onClick={shareWhatsApp}
        sx={{
          width: { xs: 36, sm: 44 },
          height: { xs: 36, sm: 44 },
          background: "#25D366",
          color: "#fff",
          "&:hover": { transform: "scale(1.1)" },
        }}
      >
        <FaWhatsapp size={18} />
      </IconButton>
    </Tooltip>

    <Tooltip title="Share on Telegram">
      <IconButton
        onClick={shareTelegram}
        sx={{
          width: { xs: 36, sm: 44 },
          height: { xs: 36, sm: 44 },
          background: "#148fcc",
          color: "#fff",
          "&:hover": { transform: "scale(1.1)" },
        }}
      >
        <FaTelegramPlane size={18} />
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
          <Typography
            variant="h4"
            fontWeight="bold"
            color={darkMode ? "#fff" : "#111"}
          >
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
          <Typography
            variant="h4"
            fontWeight="bold"
            color={darkMode ? "#fff" : "#111"}
          >
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
              fontSize: "15px",
              textAlign: "center",
              fontFamily: "Poppins, sans-serif",
              background: level === lvl ? "#1565c0  " : "#ffffff",
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