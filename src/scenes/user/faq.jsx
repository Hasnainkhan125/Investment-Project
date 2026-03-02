import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Collapse,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const FAQ = ({ darkMode }) => {
  const isDark = darkMode;

  const faqs = [
    {
      question: "How do I deposit funds?",
      answer:
        "Go to the Deposit page, select Easypaisa or Jazzcash, send money to the admin number shown, and upload the transaction screenshot.",
    },
    {
      question: "When can I withdraw?",
      answer:
        "You can withdraw anytime your balance is above the minimum limit (300 PKR). Withdrawals are usually processed within 24 hours..",
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
        mt: 2,
      }}
    >
      <Typography
        variant="h3"
        fontWeight={700}
        mb={4}
        color={isDark ? "#fff" : "#111"}
        sx={{
          fontFamily: "Poppins, sans-serif",
          textAlign: "center",
                  background: "linear-gradient(90deg, #309cea, #309cea)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
 Common Questions
      </Typography>

      {faqs.map((faq, index) => (
        <Paper
          key={index}
          elevation={3}
          sx={{
            mb: 3,
            borderRadius: 3,
            overflow: "hidden",
            backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "#fff",
            color: isDark ? "#fff" : "#111",
            transition: "transform 0.3s, box-shadow 0.3s",
            "&:hover": {
              transform: "translateY(-3px)",
              boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 2.2,
              cursor: "pointer",
              transition: "background 0.3s",
              background: expandedIndex === index
                ? isDark
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(245,158,11,0.1)"
                : "transparent",
            }}
            onClick={() => toggleExpand(index)}
          >
            <Typography fontWeight={600} fontSize={15}>
              {faq.question}
            </Typography>
            <IconButton
              sx={{
                transform:
                  expandedIndex === index ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.3s",
                color: isDark ? "#fff" : "#111",
              }}
            >
              <ExpandMoreIcon />
            </IconButton>
          </Box>

          <Collapse in={expandedIndex === index} timeout="auto" unmountOnExit>
            <Box
              sx={{
                p: 2,
                borderTop: isDark
                  ? "1px solid rgba(255,255,255,0.1)"
                  : "1px solid #eee",
                fontSize: 14,
                lineHeight: 1.6,
                color: isDark ? "#ddd" : "#333",
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.02)"
                  : "rgba(245,245,245,0.5)",
              }}
            >
              {faq.answer}
            </Box>
          </Collapse>
        </Paper>
      ))}
    </Box>
  );
};

export default FAQ;