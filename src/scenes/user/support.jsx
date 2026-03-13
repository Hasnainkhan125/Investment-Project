import React from "react";
import { Box, Typography, Button, Paper, IconButton } from "@mui/material";
import TelegramIcon from "@mui/icons-material/Telegram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Support = () => {
  const navigate = useNavigate();
  const telegramLink = "https://t.me/your_telegram";
  const whatsappLink = "https://wa.me/923711580024";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Top Back Arrow */}
      <Box sx={{ width: "100%", maxWidth: 1100,}}>
<IconButton
  onClick={() => navigate("/user-dashboard")}
  sx={{
    color: "#fff",
    background: "linear-gradient(135deg, #1e88e5, #1565c0)",
    borderRadius: "12px",
    p: 1.5,
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "scale(1.1)",
      background: "linear-gradient(135deg, #1565c0, #1e88e5)",
    },
  }}
>
  <ArrowBackIosNewIcon fontSize="medium" />
</IconButton>
      </Box>

      {/* Top Support Image with fade-in motion */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ textAlign: "center", marginBottom: 24 }}
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/4961/4961759.png"
          alt="Support"
          style={{
            width: "100%",
            maxWidth: "300px",
            marginBottom: 15,
          }}
        />
      </motion.div>

      {/* Card Section with scale & fade-in */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <Paper
          elevation={6}
          sx={{
            width: "95%",
            maxWidth: "1100px",
            borderRadius: 4,
            p: { xs: 3, sm: 5 },
            textAlign: "center",
            backgroundColor: "#f8f9fa",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              fontSize: 24,
              fontFamily: "sans-serif",
              mb: 1,
              color: "#333",
            }}
          >
            Contact Support
          </Typography>

          <Typography sx={{ mb: 4, color: "#666", fontSize: 15 }}>
            Facing issues? Our team is available 24/7 to assist you. Choose your preferred platform below.
          </Typography>

          {/* WhatsApp Button */}
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<WhatsAppIcon />}
              onClick={() => window.open(whatsappLink, "_blank")}
              sx={{
                background: "linear-gradient(90deg, #25D366, #128C7E)",
                py: 1.7,
                fontSize: 16,
                fontWeight: 600,
                textTransform: "none",
                borderRadius: 2,
                mb: 2,
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                "&:hover": {
                  background: "linear-gradient(90deg, #1ebe5d, #0f7865)",
                  transform: "translateY(-2px) scale(1.03)",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                },
              }}
            >
              WhatsApp (+92 3711580024)
            </Button>
          </motion.div>

          {/* Telegram Button */}
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<TelegramIcon />}
              onClick={() => window.open(telegramLink, "_blank")}
              sx={{
                background: "linear-gradient(90deg, #0088cc, #00c6ff)",
                py: 1.7,
                fontSize: 16,
                fontWeight: 600,
                textTransform: "none",
                borderRadius: 2,
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                "&:hover": {
                  background: "linear-gradient(90deg, #007ab8, #00bfff)",
                  transform: "translateY(-2px) scale(1.03)",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                },
              }}
            >
              Telegram
            </Button>
          </motion.div>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default Support;