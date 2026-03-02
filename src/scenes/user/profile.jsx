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
  Dialog,
  Fade,
  Paper,
  Slide,
  Alert,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom"; // <-- import this at top

import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import LockIcon from "@mui/icons-material/Lock";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { supabase } from "../../supabaseClient";

function SlideTransition(props) {
  return <Slide {...props} direction="top" />;
}


const Profile = ({ darkMode }) => {
  const isDark = darkMode;
  const storedData = JSON.parse(localStorage.getItem("profileData")) || {};
  const navigate = useNavigate(); // <-- add this

  const [activePage, setActivePage] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: storedData.phone || "",
  });
  const [profilePic, setProfilePic] = useState(
    storedData.dp || "https://i.pravatar.cc/300"
  );
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [hover, setHover] = useState(false);

  // Fetch Supabase user
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

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

  const textColor = isDark ? "#fff" : "#111";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        py: 4,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 500,
          borderRadius: 4,
          background: "none",
          p: 1,
          backdropFilter: "blur(20px)",
          color: textColor,
          position: "relative",
        }}
      >
        {/* HEADER */}
        <Box
          sx={{
            position: "relative",
            borderRadius: 4,
            p: 4,
            mb: 4,
            textAlign: "center",
                  background: "linear-gradient(90deg, #309cea, #309cea)",
            color: "#fff",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: -40,
              right: -40,
              width: 150,
              height: 150,
              background: "rgba(255,255,255,0.15)",
              borderRadius: "50%",
              filter: "blur(40px)",
            }}
          />

          <Box
            position="relative"
            display="inline-block"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            sx={{ mb: 2 }}
          >
            <Avatar
              src={profilePic}
              sx={{
                width: 110,
                height: 110,
                border: "2px solid #ffffff2e",
                backdropFilter: "blur(10px)",
              }}
            />
            <Fade in={hover}>
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  background: "rgba(0,0,0,0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Tooltip title="Change Picture">
                  <IconButton component="label" sx={{ color: "#fff" }}>
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

          <Typography
            variant="h3"
            fontWeight={700}
            sx={{ mt: 1, fontFamily: "Poppins, sans-serif" }}
          >
            {formData.name || "User Name"}
          </Typography>

          <Typography variant="body2" sx={{ opacity: 0.85, fontSize: 13 }}>
            {formData.email || "user@email.com"}
          </Typography>
        </Box>

        {/* COLORED STATS CARDS */}
        <Grid container spacing={2} mb={3}>
          {[
            { label: "Wallet Balance", value: 0, color: "linear-gradient(135deg,#3b82f6,#2563eb)" },
            { label: "Total Commission", value: 0, color: "linear-gradient(135deg,#10b981,#059669)" },
            { label: "Total Deposit", value: 0, color: "linear-gradient(135deg,#f59e0b,#ea580c)" },
            { label: "Total Withdraw", value: 0, color: "linear-gradient(135deg,#ef4444,#dc2626)" },
          ].map((item, index) => (
            <Grid item xs={6} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  textAlign: "center",
                  background: item.color,
                  color: "#fff",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
                }}
              >
                <Typography fontSize={20} fontWeight={700}>
                  {item.value}
                </Typography>
                <Typography fontSize={12} sx={{ opacity: 0.9 }}>
                  {item.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

<Paper elevation={1} sx={{ mt: 3, borderRadius: 3, overflow: "hidden" }}>
  {[
    { label: "Change Password", key: "password", icon: <LockIcon /> },
    { label: "Deposit Record", key: "deposit", icon: <ReceiptLongIcon /> },
    { label: "Withdraw Record", key: "withdraw", icon: <ReceiptLongIcon /> },
    { label: "Help & FAQ", key: "faq", icon: <HelpOutlineIcon /> },
  ].map((item, index) => (
    <Box
      key={index}
      onClick={() => {
        switch (item.key) {
          case "password":
            setActivePage("password");
            break;
          case "deposit":
            navigate("/user-dashboard/deposit-history"); // ✅ full nested path
            break;
          case "withdraw":
            navigate("/user-dashboard/withdraw-history"); // ✅ full nested path
            break;
          case "faq":
            navigate("/user-dashboard/faq"); // ✅ full nested path
            break;
          default:
            break;
        }
      }}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        p: 2,
        cursor: "pointer",
        backgroundColor: "#fff",
        "&:hover": { backgroundColor: "#f9fafb" },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Box sx={{ color: "#0088f8" }}>{item.icon}</Box>
        <Typography fontSize={14} color="#111">
          {item.label}
        </Typography>
      </Box>
      <ArrowForwardIosIcon sx={{ fontSize: 14, color: "#999" }} />
    </Box>
  ))}
</Paper>

        {/* Save Button */}
        <Box mt={3} textAlign="center">
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={loading}
            fullWidth
            sx={{
                  background: "linear-gradient(90deg, #309cea, #309cea)",
              color: "#fff",
              borderRadius: 2,
              textTransform: "none",
              px: { xs: 6, sm: 8 },
              py: 1.5,
              fontSize: 16,
              fontWeight: 600,
              transition: "all 0.3s ease",
              "&:hover": {
                  background: "linear-gradient(90deg, #2f88c8, #6fbcf4)",
                transform: "translateY(-3px) scale(1.05)",
              },
            }}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : "Save"}
          </Button>
        </Box>

        {/* Snackbar */}
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

{/* ===== MODERN ADVANCED PASSWORD DIALOG ===== */}
<Dialog
  open={activePage === "password"}
  onClose={() => setActivePage(null)}
  fullWidth
  maxWidth="xs"
  PaperProps={{
    sx: {
      borderRadius: { xs: 3, sm: 4 },
      p: { xs: 3, sm: 4 },
      background: isDark ? "rgba(25,25,25,0.95)" : "rgba(255,255,255,0.95)",
      backdropFilter: "blur(20px)",
      boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
      border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.08)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
    },
  }}
  BackdropProps={{
    sx: {
      backgroundColor: "rgba(0, 0, 0, 0.69)",
    },
  }}
>
  <Fade in={activePage === "password"} timeout={400}>
    <Box sx={{ width: "100%" }}>
      {/* Title */}
      <Typography
        variant="h5"
        fontWeight={700}
        textAlign="center"
        color={isDark ? "#fff" : "#111"}
        mb={1}
        sx={{ fontFamily: "Poppins, sans-serif", fontSize: { xs: 20, sm: 24 } }}
      >
        Update Password
      </Typography>

         <Typography  textAlign={'center'} variant="body2" sx={{  textDecoration: 'underline', cursor: 'pointer',  fontSize: 15 , color: isDark ? "#aaa" : "#666", mb: 2 }}>
            {formData.email || "user@email.com"}
          </Typography>

      {/* Modern Input */}
      <TextField
        fullWidth
        type={showPassword ? "text" : "password"}
        label="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="Enter password"
        size="medium"
        sx={{
          mb: 3,
          "& .MuiOutlinedInput-root": {
            borderRadius: 3,
            background: isDark ? "rgba(255,255,255,0.05)" : "#f5f5f5",
            "& fieldset": { borderColor: isDark ? "rgba(255,255,255,0.2)" : "#ccc" },
            "&:hover fieldset": { borderColor: "#3b82f6" },
            "&.Mui-focused fieldset": {
              borderColor: "#3b82f6",
              boxShadow: "0 0 12px rgba(59,130,246,0.3)",
            },
          },
          "& .MuiInputLabel-root": {
            color: isDark ? "#aaa" : "#666",
            fontWeight: 500,
            "&.Mui-focused": { color: "#3b82f6" },
          },
          "& .MuiInputBase-input": {
            color: isDark ? "#fff" : "#111",
            padding: "14px 12px",
            fontSize: { xs: 14, sm: 15 },
          },
        }}
        InputProps={{
          endAdornment: (
<IconButton
  onClick={(e) => {
    e.stopPropagation(); // prevent dialog close
    setShowPassword((prev) => !prev);
  }}
  edge="end"
  sx={{
    background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
    color: isDark ? "#fff" : "#111",
    borderRadius: 1.5,
    p: 1,
    transition: "all 0.3s ease",
    "&:hover": {
      background: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)",
      transform: "scale(1.1)",
      color: "#3b82f6",
    },
  }}
>
  {showPassword ? <Visibility fontSize="small" /> : <VisibilityOff fontSize="small" />}
</IconButton>
          ),
        }}
      />

      {/* Buttons */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
        }}
      >
        {/* Cancel */}
        <Button
          fullWidth
          variant="outlined"
          onClick={() => setActivePage(null)}
          sx={{
            borderRadius: 3,
            textTransform: "none",
            borderColor: isDark ? "rgba(255,255,255,0.3)" : "#ccc",
            color: isDark ? "#fff" : "#111",
            py: { xs: 1.5, sm: 1.8 },
            fontSize: { xs: 14, sm: 15 },
            "&:hover": {
              borderColor: "#3b82f6",
              background: isDark ? "rgba(255,255,255,0.05)" : "#f0f0f0",
              
            },
          }}
        >
          Cancel
        </Button>

        {/* Update */}
        <Button
          fullWidth
          variant="contained"
          onClick={async () => {
            if (!newPassword) return;
            setLoading(true);
            const { error } = await supabase.auth.updateUser({ password: newPassword });
            setLoading(false);
            if (!error) {
              setSnackbarMessage("Password Updated Successfully!");
              setOpenSnackbar(true);
              setNewPassword("");
              setActivePage(null);
            }
          }}
          sx={{
            borderRadius: 3,
            textTransform: "none",
            background: "linear-gradient(135deg, #3b82f6, #2563eb)",
            py: { xs: 1.5, sm: 1.8 },
            fontSize: { xs: 14, sm: 15 },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            "&:hover": {
              background: "linear-gradient(135deg, #2563eb, #215bd8)",
              transform: "translateY(-2px) scale(1.02)",
            },
            transition: "all 0.3s ease",
          }}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : "Update"}
        </Button>
      </Box>

      {/* Snackbar inside Dialog */}
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
            width: "90%",
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
            backgroundColor: isDark ? "#333" : "#fff",
            color: isDark ? "#fff" : "#111",
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  </Fade>
</Dialog>
      </Paper>
    </Box>
  );
};

export default Profile;