import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  Slide,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useNavigate } from "react-router-dom";

// Slide transition for the dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const LoginSuccessDialog = ({ open, setOpen, redirectTo = "/user-dashboard" }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        setOpen(false);
        navigate(redirectTo); // Redirect to dashboard after 5 seconds
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [open, setOpen, navigate, redirectTo]);

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          background: "linear-gradient(135deg, #38bdf8, #22c55e)",
          color: "#fff",
          textAlign: "center",
          p: 3,
        },
      }}
    >
      <DialogContent>
        <CheckCircleIcon sx={{ fontSize: 70, mb: 2, color: "#fff" }} />
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          Login Successful!
        </Typography>
        <Typography sx={{ fontSize: 15, opacity: 0.9 }}>
          Welcome back! Redirecting you to your dashboard...
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", mt: 1 }}>
        <Button
          variant="contained"
          sx={{
            background: "#fff",
            color: "#22c55e",
            fontWeight: 700,
            borderRadius: 3,
            px: 3,
            py: 1,
            "&:hover": { background: "#f0f0f0" },
          }}
          onClick={() => {
            setOpen(false);
            navigate(redirectTo);
          }}
        >
          Go Now
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LoginSuccessDialog;