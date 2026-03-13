import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Collapse,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ArrowBackIosNew as ArrowBackIosNewIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const FAQ = ({ darkMode }) => {
  const isDark = darkMode;
  const navigate = useNavigate();
  const faqs = [
    {
      question: "How do I deposit funds?",
      answer:
        "Go to the Deposit page, select Easypaisa or Jazzcash, send money to the admin number shown, and upload the transaction screenshot.",
    },
    {
      question: "When can I withdraw?",
      answer:
        "You can withdraw anytime your balance is above the minimum limit (300 PKR). Withdrawals are usually processed within 24 hours.",
    },
    {
      question: "How does the commission system work?",
      answer:
        "We offer 3 levels of commission: Level 1 (20%), Level 2 (3%), and Level 3 (1%). You earn when your team activates a plan.",
    },
    {
      question: "Can I activate multiple plans?",
      answer:
        "Yes, you can activate different plans simultaneously to maximize your daily earnings.",
    },
  ];

  const [expandedIndex, setExpandedIndex] = useState(null);
  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 900,
        mx: "auto",
      }}
    >
      <IconButton
  onClick={() => navigate("/user-dashboard")}
  sx={{
    color: "#fff",
    background: "linear-gradient(135deg, #1e88e5, #1565c0)",
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
      {/* Title */}
      <Typography
        variant="h4"
        fontWeight={800}
        mb={4}
        textAlign="center"
        sx={{
          background: "linear-gradient(90deg, #2563eb, #3b82f6)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Common Questions
      </Typography>

      {faqs.map((faq, index) => {
        const isOpen = expandedIndex === index;

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Paper
              elevation={0}
              sx={{
                mb: 3,
                borderRadius: 4,
                overflow: "hidden",
                backdropFilter: "blur(10px)",
                background: isDark
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(255,255,255,0.9)",
                border: isDark
                  ? "1px solid rgba(255,255,255,0.08)"
                  : "1px solid rgba(0,0,0,0.06)",
                transition: "all 0.3s ease",
                boxShadow: isOpen
                  ? "0 15px 40px rgba(37,99,235,0.15)"
                  : "0 5px 15px rgba(0,0,0,0.05)",
              }}
            >
              {/* Question */}
              <Box
                onClick={() => toggleExpand(index)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 2.5,
                  cursor: "pointer",
                }}
              >
                <Typography
                  fontWeight={600}
                  fontSize={15}
                  color={isDark ? "#fff" : "#111"}
                >
                  {faq.question}
                </Typography>

                <IconButton
                  sx={{
                    transform: isOpen
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                    transition: "all 0.3s ease",
                    color: isDark ? "#fff" : "#111",
                  }}
                >
                  <ExpandMoreIcon />
                </IconButton>
              </Box>

              {/* Answer */}
              <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <Box
                  sx={{
                    px: 2.5,
                    pb: 2.5,
                    pt: 1,
                    fontSize: 14,
                    lineHeight: 1.7,
                    color: isDark ? "#ccc" : "#444",
                    borderTop: isDark
                      ? "1px solid rgba(255,255,255,0.08)"
                      : "1px solid rgba(0,0,0,0.05)",
                  }}
                >
                  {faq.answer}
                </Box>
              </Collapse>
            </Paper>
          </motion.div>
        );
      })}
    </Box>
  );
};

export default FAQ;