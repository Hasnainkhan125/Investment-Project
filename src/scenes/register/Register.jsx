// src/scenes/auth/Register.jsx
import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
  Slide,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import { HiBolt } from "react-icons/hi2";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { supabase } from "../../supabaseClient.js";

// Smooth slide-down animation for Snackbar
const SlideTransition = (props) => <Slide {...props} direction="down" />;

// Function to generate referral code
const generateReferralCode = () =>
  "REF" + Math.floor(100000 + Math.random() * 900000);

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [referralCode, setReferralCode] = useState(""); // Referral field

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successSnackbar, setSuccessSnackbar] = useState(false);
  const [errorSnackbar, setErrorSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    const { name, email, password } = formData;

    if (!name || !email || !password) {
      setErrorMessage("Please fill all required fields");
      setErrorSnackbar(true);
      return;
    }

    setLoading(true);

    try {
      const userReferralCode = referralCode.trim() || generateReferralCode();

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            referral_code: userReferralCode,
          },
        },
      });

      if (error) {
        setErrorMessage(error.message);
        setErrorSnackbar(true);
        return;
      }

      if (!data.user) {
        setErrorMessage("User creation failed");
        setErrorSnackbar(true);
        return;
      }

      setSuccessSnackbar(true);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error(err);
      setErrorMessage("Registration failed");
      setErrorSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  // Modern TextField styles
  const modernTextField = {
    mb: 4,
    "& .MuiInputLabel-root": {
      color: "rgba(255,255,255,0.6)",
      fontWeight: 500,
      fontSize: 19,
      mt: -1.4,

    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#309cea",
    },
    "& .MuiOutlinedInput-root": {
      borderRadius: 10,
      fontSize: "19px",
      background: "#111827",
      color: "#fff",
      "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
      "&:hover fieldset": { borderColor: "#3b82f6" },
      "&.Mui-focused fieldset": { borderColor: "#309cea" },
    },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#111827",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          width: 100,
          height: 100,
          borderRadius: 4,
          background: "linear-gradient(90deg, #309cea, #309cea)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 3,
        }}
      >
        <HiBolt size={50} color="#ffffff" />
      </Box>

      {/* Title */}
      <Typography
        sx={{
          fontSize: 48,
          fontWeight: 900,
          color: "#fff",
          letterSpacing: 2,
        }}
      >
        Register{" "}
        <span
          style={{
            background: "linear-gradient(90deg, #309cea, #1f83cb)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Now
        </span>
      </Typography>

      {/* Card */}
      <Box
        sx={{
          mt: 5,
          width: { xs: "100%", sm: 400 },
          background: "rgba(255,255,255,0.04)",
          borderRadius: 8,
          p: 4,
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Tabs */}
        <Box
          sx={{
            display: "flex",
            background: "#0b1225",
            borderRadius: 10,
            mb: 4,
          }}
        >
          <Box
            sx={{
              flex: 1,
              textAlign: "center",
              py: 1.5,
              background: "linear-gradient(90deg, #309cea, #309cea)",
              color: "#fff",
              borderRadius: 10,
              fontWeight: 600,
            }}
          >
            CREATE ACCOUNT
          </Box>
          <Box
            sx={{
              flex: 1,
              textAlign: "center",
              py: 1.5,
              fontSize: 13,
              color: "#6b7280",
              cursor: "pointer",
            }}
            onClick={() => navigate("/login")}
          >
            LOG IN
          </Box>
        </Box>

        {/* Name Field */}
        <TextField
          fullWidth
          label="Full Name"
          placeholder="John Doe"
          name="name"
          value={formData.name}
          onChange={handleChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonIcon sx={{ color: "#9ca3af" }} />
              </InputAdornment>
            ),
          }}
          sx={modernTextField}
        />

        {/* Email Field */}
        <TextField
          fullWidth
          label="Email"
          placeholder="user@gmail.com"
          name="email"
          value={formData.email}
          onChange={handleChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon sx={{ color: "#9ca3af" }} />
              </InputAdornment>
            ),
          }}
          sx={modernTextField}
        />

        {/* Password Field */}
        <TextField
          fullWidth
          label="Password"
          placeholder="Minimum 8 characters"
          name="password"
          type={showPassword ? "text" : "password"}
          value={formData.password}
          onChange={handleChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon sx={{ color: "#9ca3af" }} />
              </InputAdornment>
            ),
            endAdornment: (
              <IconButton onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            ),
          }}
          sx={modernTextField}
        />

        {/* Referral Code Field */}
        <TextField
          fullWidth
          label="Referral Code (Optional)"
          variant="outlined"
          value={referralCode}
          onChange={(e) => setReferralCode(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CardGiftcardIcon sx={{ color: "#9ca3af" }} />
              </InputAdornment>
            ),
          }}
          sx={modernTextField}
          placeholder="Enter referral code"
        />

        {/* Submit Button */}
        <Button
          fullWidth
          disabled={loading}
          onClick={handleRegister}
          sx={{
            mt: 2,
            py: 1.8,
            borderRadius: 10,
            fontWeight: 700,
            fontSize: "15px",
            background: "linear-gradient(90deg, #309cea, #309cea)",
            color: "#fff",
          }}
        >
          {loading ? <CircularProgress size={20} sx={{ color: "#fff" }} /> : "CREATE ACCOUNT"}
        </Button>

        {/* Login Link */}
        <Typography sx={{ textAlign: "center", mt: 3, color: "#9ca3af" }}>
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            style={{ color: "#3b82f6", cursor: "pointer" }}
          >
            Sign In
          </span>
        </Typography>
      </Box>

      {/* Snackbars */}
      {/* ERROR SNACKBAR */}
      <Snackbar
        open={errorSnackbar}
        autoHideDuration={2500}
        onClose={() => setErrorSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        TransitionComponent={SlideTransition}
      >
        <Alert
          onClose={() => setErrorSnackbar(false)}
          icon={<ErrorOutlineIcon />}
          severity="error"
          variant="filled"
          sx={{
            width: "90vw",
            maxWidth: 320,
            borderRadius: 12,
            fontWeight: 500,
            fontSize: 13,
            px: 2,
            py: 1.5,
            display: "flex",
            alignItems: "center",
            gap: 1,
            backdropFilter: "blur(12px)",
            backgroundColor: "#fde2e2",
            color: "#b91c1c",
            boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
          }}
        >
          {errorMessage || "Please check your inputs!"}
        </Alert>
      </Snackbar>

      {/* SUCCESS SNACKBAR */}
      <Snackbar
        open={successSnackbar}
        autoHideDuration={2000}
        onClose={() => setSuccessSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        TransitionComponent={SlideTransition}
      >
        <Alert
          onClose={() => setSuccessSnackbar(false)}
          icon={<CheckCircleIcon />}
          severity="success"
          variant="filled"
          sx={{
            width: "90vw",
            maxWidth: 320,
            borderRadius: 12,
            fontWeight: 500,
            fontSize: 13,
            px: 2,
            py: 1.5,
            display: "flex",
            alignItems: "center",
            gap: 1,
            backdropFilter: "blur(12px)",
            backgroundColor: "#e0f5e9",
            color: "#000000",
            boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
          }}
        >
          Account created successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Register;