import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  IconButton,
  Checkbox,
  FormControlLabel,
  Snackbar,
  Alert,
  Slide,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { HiBolt } from "react-icons/hi2";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { supabase } from "../../supabaseClient";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [successSnackbar, setSuccessSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showLoader, setShowLoader] = useState(true);

  // Slide animation for snackbars
  const SlideTransition = (props) => <Slide {...props} direction="down" />;

  // Loader effect
  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Load remembered user
  useEffect(() => {
    const rememberedData = JSON.parse(localStorage.getItem("rememberedUser"));
    if (rememberedData) {
      setFormData(rememberedData);
      setRememberMe(true);
    }
  }, []);

  // Redirect if user is already logged in
useEffect(() => {
  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const role = session.user.user_metadata?.role;
      navigate(role === "admin" ? "/admin-dashboard" : "/user-dashboard");
    }
  };
  checkSession();
}, [navigate]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogin = async () => {
    const { email, password } = formData;
    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: { persistSession: true },
      });

      if (error) {
        if (error.message.includes("Email not confirmed")) {
          setErrorMessage(
            "Please confirm your email before logging in. Check your inbox!"
          );
        } else {
          setErrorMessage(error.message);
        }
        setOpenSnackbar(true);
        return;
      }

      const user = data.user;

      if (!user) {
        setErrorMessage("Login failed!");
        setOpenSnackbar(true);
        return;
      }

      localStorage.setItem("authUser", JSON.stringify(user));

      if (rememberMe) {
        localStorage.setItem("rememberedUser", JSON.stringify(formData));
      } else {
        localStorage.removeItem("rememberedUser");
      }

      setSuccessSnackbar(true);

      setTimeout(() => {
        const role = user.user_metadata?.role;
        navigate(role === "admin" ? "/admin-dashboard" : "/user-dashboard");
      }, 1500);
    } catch (err) {
      console.error(err);
      setErrorMessage("Login failed!");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  if (showLoader) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "#111827",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress sx={{ color: "#ea910c" }} />
      </Box>
    );
  }

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
          background: "linear-gradient(90deg, #f59e0b, #ea580c)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 3,
        }}
      >
        <HiBolt size={50} color="#ffe100" />
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
        Invest{" "}
        <span
          style={{
            background: "linear-gradient(90deg, #f59e0b, #ea580c)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          PRO
        </span>
      </Typography>

      <Typography sx={{ color: "#fff", letterSpacing: 2 }}>
        Secure Access Portal
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
              fontSize: 13,
              color: "#6b7280",
              cursor: "pointer",
            }}
            onClick={() => navigate("/register")}
          >
            CREATE ACCOUNT
          </Box>

          <Box
            sx={{
              flex: 1,
              textAlign: "center",
              py: 1.5,
              background: "linear-gradient(90deg, #f59e0b, #ea580c)",
              color: "#fff",
              borderRadius: 10,
              fontWeight: 600,
            }}
          >
            LOG IN
          </Box>
        </Box>

        {/* Email */}
        <TextField
          fullWidth
          placeholder="user@investpro.com"
          name="email"
          value={formData.email}
          onChange={handleChange}
          sx={{
            mb: 3,
            "& .MuiOutlinedInput-root": {
              borderRadius: 10,
              background: "#111827",
              fontSize: "19px",
              color: "#fff",
              "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
            },
          }}
        />

        {/* Password */}
        <TextField
          fullWidth
          placeholder="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          value={formData.password}
          onChange={handleChange}
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: 10,
              fontSize: "19px",
              background: "#111827",
              color: "#fff",
            },
          }}
          InputProps={{
            endAdornment: (
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                sx={{ color: "#9ca3af" }}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            ),
          }}
        />

        {/* Remember */}
        <FormControlLabel
          control={
            <Checkbox
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              sx={{
                color: "#3b82f6",
                "&.Mui-checked": { color: "#e2e2e2" },
              }}
            />
          }
          label={<Typography sx={{ color: "#fff" }}>Remember me</Typography>}
        />

        <Button
          fullWidth
          disabled={loading}
          onClick={handleLogin}
          sx={{
            mt: 2,
            py: 1.8,
            borderRadius: 10,
            fontSize: "15px",
            fontWeight: 700,
            background: "linear-gradient(90deg, #f59e0b, #ea580c)",
            color: "#fff",
          }}
        >
          {loading ? (
            <CircularProgress size={20} sx={{ color: "#fff" }} />
          ) : (
            "LOG IN"
          )}
        </Button>
      </Box>

      {/* ERROR SNACKBAR */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2500}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        TransitionComponent={SlideTransition}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          icon={<ErrorIcon />}
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
          {errorMessage}
        </Alert>
      </Snackbar>

      {/* SUCCESS SNACKBAR */}
      <Snackbar
        open={successSnackbar}
        autoHideDuration={1500}
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
            color: "#1d1d1d",
            boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
          }}
        >
          Login successful!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login;