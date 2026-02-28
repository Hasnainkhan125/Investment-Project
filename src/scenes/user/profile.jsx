
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  TextField,
  Button,
  Grid,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
  Tooltip,
  Fade,
  InputAdornment,
  Paper,
  Slide,
} from "@mui/material";

import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { supabase } from "../../supabaseClient";

function SlideTransition(props) {
  return <Slide {...props} direction="down" />;
}

const Profile = ({ darkMode }) => {
  const isDark = darkMode;

  const storedData = JSON.parse(localStorage.getItem("profileData")) || {};

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: storedData.phone || "",
    easypaisaNumber: storedData.easypaisaNumber || "",
    easypaisaHolder: storedData.easypaisaHolder || "",
    jazzcashNumber: storedData.jazzcashNumber || "",
    jazzcashHolder: storedData.jazzcashHolder || "",
  });

  const [profilePic, setProfilePic] = useState(
    storedData.dp || "https://i.pravatar.cc/300"
  );

  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [hover, setHover] = useState(false);
  const [copiedField, setCopiedField] = useState("");

  // ✅ AUTO DETECT SUPABASE USER
  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        setFormData((prev) => ({
          ...prev,
          name: session.user.user_metadata?.name || "",
          email: session.user.email || "",
        }));
      }
    };

    getUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setProfilePic(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setLoading(true);

    setTimeout(() => {
      const dataToSave = { ...formData, dp: profilePic };
      localStorage.setItem("profileData", JSON.stringify(dataToSave));

      setLoading(false);
      setSnackbarMessage("Profile Updated Successfully!");
      setOpenSnackbar(true);
    }, 1000);
  };

  const handleCopy = (text, label) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setSnackbarMessage(`${label} copied successfully!`);
    setOpenSnackbar(true);
    setTimeout(() => setCopiedField(""), 2000);
  };

  const textColor = isDark ? "#fff" : "#111";
  const secondaryText = isDark ? "#94a3b8" : "#7d7c7c";
  

const modernInput = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 10, // modern rounded corners
    background: isDark ? "rgba(255,255,255,0.05)" : "#f5f5f5", // soft bg
    minHeight: 44, // slightly taller for better click area
    fontSize: 14,
    padding: "0 12px", // horizontal padding only
    "& fieldset": {
      borderColor: isDark ? "rgba(255,255,255,0.2)" : "#ccc", // subtle border
      borderWidth: 1.2, // thicker for better visibility
    },
    "&:hover fieldset": {
      borderColor: "#ff9705", // accent on hover
    },
    "&.Mui-focused fieldset": {
      borderColor: "#ff9705", // accent on focus
      boxShadow: isDark
        ? "0 0 6px rgba(255,151,5,0.25)"
        : "0 0 6px rgba(255,151,5,0.25)", // soft glow
    },
  },
  "& .MuiInputLabel-root": {
    color: isDark ? "#94a3b8" : "#74727a",
    fontSize: 13,
    fontWeight: 500,
    "&.Mui-focused": {
      color: "#ff9705", // highlight label on focus
      transform: "translate(12px, -6px) scale(0.85)", // smooth float
    },
  },
  "& .MuiInputBase-input": {
    color: isDark ? "#f5f5f5" : "#111111",
    padding: "14px 0 6px", // top padding to avoid label overlap
    fontSize: 14,
    lineHeight: 1.4,
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderRadius: 10, // keep consistent with root
  },
  "& .MuiInputBase-input::placeholder": {
    color: isDark ? "#cbd5e1" : "#999999",
    opacity: 1,
  },
  transition: "all 0.3s ease", // smooth animations
};
  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 500,
          borderRadius: 4,
          background: 'none',
          p: 1,
          backdropFilter: "blur(20px)",
          color: textColor,
          position: "relative",
        }}
      >
        {/* Header */}
        <Box textAlign="center" mb={3}>
          <Typography
            variant="h2"
            fontWeight={'bold'}
            sx={{
              background: isDark
                ? "linear-gradient(90deg, #ff9705, #ff9705)"
                : "linear-gradient(90deg, #ff9705, #ff9705)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Edit Profile
          </Typography>
          <Typography variant="body2" sx={{ color: secondaryText, mt: 0.5 }}>
            Manage your personal information securely
          </Typography>
        </Box>

        {/* Avatar */}
        <Box textAlign="center" mb={3}>
          <Box
            position="relative"
            display="inline-block"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            <Avatar
              src={profilePic}
              sx={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                border: "2px solid transparent",
                background: isDark
                  ? "linear-gradient(135deg, #f8b538, #f8b538)"
                  : "linear-gradient(135deg, #f8b538, #f8b538)",
              }}
            />
            <Fade in={hover}>
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  background: isDark ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backdropFilter: "blur(4px)",
                }}
              >
                <Tooltip title="Change Picture">
                  <IconButton
                    component="label"
                    sx={{ color: isDark ? "#38bdf8" : "#2563eb" }}
                  >
                    <PhotoCameraIcon />
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </IconButton>
                </Tooltip>
              </Box>
            </Fade>
          </Box>
        </Box>

        {/* Form */}
        <Grid container spacing={2}>
<Grid item xs={12}>
  <Tooltip title="Registered Name" arrow placement="top">
    <Box>
      <TextField
        fullWidth
        label="Full Name"
        name="name"
        value={formData.name}
        size="small"
        sx={{
          ...modernInput,
          "& .MuiOutlinedInput-root": {
            ...modernInput["& .MuiOutlinedInput-root"],
            background: isDark
              ? "rgba(255, 255, 255, 0.05)" // dark mode subtle blur
              : "rgba(255, 255, 255, 0.4)", // light mode frosted
            backdropFilter: "blur(6px)",
            cursor: "not-allowed",
          },
          "& .MuiInputBase-input": {
            ...modernInput["& .MuiInputBase-input"],
            color: isDark ? "#f5f5f5" : "#555", // softer text
            cursor: "not-allowed",
          },
          "& .MuiInputLabel-root": {
            ...modernInput["& .MuiInputLabel-root"],
            color: isDark ? "#94a3b8" : "#666", // softer label
          },
        }}
        InputProps={{
          readOnly: true,
          startAdornment: (
            <InputAdornment position="start">
              <PersonIcon sx={{ color: isDark ? "#f8b538" : "#2563eb" }} />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  </Tooltip>
</Grid>

<Grid item xs={12}>
  <Tooltip title="Registered Email" arrow placement="top">
    <Box>
      <TextField
        fullWidth
        label="Email Address"
        name="email"
        value={formData.email}
        size="small"
        sx={{
          ...modernInput,
          "& .MuiOutlinedInput-root": {
            ...modernInput["& .MuiOutlinedInput-root"],
            background: isDark
              ? "rgba(255, 255, 255, 0.05)" // dark mode subtle blur
              : "rgba(255, 255, 255, 0.4)", // light mode frosted
            backdropFilter: "blur(6px)",
            cursor: "not-allowed",
          },
          "& .MuiInputBase-input": {
            ...modernInput["& .MuiInputBase-input"],
            color: isDark ? "#f5f5f5" : "#555", // softer text for read-only
            cursor: "not-allowed",
          },
          "& .MuiInputLabel-root": {
            ...modernInput["& .MuiInputLabel-root"],
            color: isDark ? "#94a3b8" : "#666", // softer label
          },
        }}
        InputProps={{
          readOnly: true,
          startAdornment: (
            <InputAdornment position="start">
              <EmailIcon sx={{ color: isDark ? "#38bdf8" : "#2563eb" }} />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  </Tooltip>
</Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              sx={modernInput}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon sx={{ color: isDark ? "#38bdf8" : "#2563eb" }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
          </Grid>

          {/* EasyPaisa */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" color={isDark ? "#22c55e" : "#16a34a"}>
              EasyPaisa
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Number"
              name="easypaisaNumber"
              value={formData.easypaisaNumber}
              onChange={handleChange}
              sx={modernInput}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountBalanceWalletIcon sx={{ color: isDark ? "#22c55e" : "#16a34a" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        handleCopy(formData.easypaisaNumber, "EasyPaisa")
                      }
                      disabled={!formData.easypaisaNumber}
                      sx={{ color: isDark ? "#22c55e" : "#16a34a" }}
                      size="small"
                    >
                      {copiedField === "EasyPaisa" ? (
                        <CheckCircleIcon />
                      ) : (
                        <ContentCopyIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Account Holder"
              name="easypaisaHolder"
              value={formData.easypaisaHolder}
              onChange={handleChange}
              sx={modernInput}
              size="small"
            />
          </Grid>

          {/* JazzCash */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" color={isDark ? "#f97316" : "#ea580c"}>
              JazzCash
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Number"
              name="jazzcashNumber"
              value={formData.jazzcashNumber}
              onChange={handleChange}
              sx={modernInput}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountBalanceWalletIcon sx={{ color: isDark ? "#f97316" : "#ea580c" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        handleCopy(formData.jazzcashNumber, "JazzCash")
                      }
                      disabled={!formData.jazzcashNumber}
                      sx={{ color: isDark ? "#f97316" : "#ea580c" }}
                      size="small"
                    >
                      {copiedField === "JazzCash" ? (
                        <CheckCircleIcon />
                      ) : (
                        <ContentCopyIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Account Holder"
              name="jazzcashHolder"
              value={formData.jazzcashHolder}
              onChange={handleChange}
              sx={modernInput}
              size="small"
            />
          </Grid>
        </Grid>

        {/* Save Button */}
        <Box mt={3} textAlign="center">
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={loading}
            fullWidth
        sx={{
      background: "linear-gradient(90deg, #f59e0b, #ea580c)",
      color: "#fff",
      borderRadius: 2,
      textTransform: "none",
      px: { xs: 6, sm: 8 },
      py: 1.5,
      fontSize: 16,
      fontWeight: 600,
      transition: "all 0.3s ease",
      "&:hover": {
        background: "linear-gradient(90deg, #ea580c, #f59e0b)",
        transform: "translateY(-3px) scale(1.05)",
      },
    }}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : "Save"}
          </Button>
        </Box>
      </Paper>

      {/* Small Full-width Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2500}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        TransitionComponent={SlideTransition}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          icon={<CheckCircleIcon />}
          severity="success"
          variant="filled"
          sx={{
            width: "90vw",
            maxWidth: 300,
            borderRadius: 12,
            fontWeight: 500,
            fontSize: 13,
            px: 2,
            py: 1.5,
            display: "flex",
            alignItems: "center",
            gap: 1,
            backdropFilter: "blur(12px)",
            backgroundColor: isDark ? "#edecec" : "#f0f0f0",
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Profile;





