import React from "react";
import { Box, Typography, Paper, Button } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";

import { useNavigate } from "react-router-dom"; // ✅ Import here
const TaskList = ({
  userName = "User",
  tasks = [],
  hasActivePlan = false, // 👈 IMPORTANT
}) => {
  const navigate = useNavigate(); // ✅ INSIDE component

  return (
    <Box
      sx={{
        maxWidth: 1000,
        mx: "auto",
      }}
    >
      {/* If NO PLAN → Show Locked Screen */}
      {!hasActivePlan ? (
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 6 },
            borderRadius: 4,
            textAlign: "center",
            background: "#f3f4f6",
            border: "1px solid #e5e7eb",
          }}
        >
          <LockOutlinedIcon
            sx={{ fontSize: 60, color: "#3b3a3a", mb: 2 }}
          />

          <Typography variant="h3"  color={"#3b3a3a"} fontWeight={800} mb={1}>
            No Active Plans
          </Typography>

          <Typography variant="h5" color="#6b7280" mb={3}>
            You need an active plan to access daily tasks.
          </Typography>

          <Button 
           onClick={() => navigate("/user-dashboard/plan")}

            variant="contained"
            startIcon={<WorkspacePremiumIcon />}
            sx={{
              px: 7,
              py: 1,
              fontSize: "1.4rem",
              borderRadius: "30px",
              textTransform: "none",
              background:
                "linear-gradient(90deg, #0080ff, #0061c2)",
            }}
          >
            View Plans
          </Button>
        </Paper>
      ) : (
        <>
          {/* Welcome Message */}
          <Typography
            sx={{
              fontSize: "1.2rem",
              fontWeight: 500,
              color: "#64748b",
              mb: 4,
            }}
          >
            Welcome back,{" "}
            <Box
              component="span"
              sx={{
                fontWeight: 700,
                background:
                  "linear-gradient(90deg, #5480e7, #3b82f6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {userName}
            </Box>{" "}
            👋
          </Typography>

          {/* Tasks */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {tasks.map((task, index) => (
              <Paper
                key={index}
                sx={{
                  p: 3,
                  borderRadius: 3,
                }}
              >
                <Typography fontWeight={600}>
                  {task.title}
                </Typography>
                <Typography color="text.secondary">
                  {task.description}
                </Typography>
                <Typography fontSize={12} color="#94a3b8" mt={1}>
                  Due: {task.dueDate}
                </Typography>
              </Paper>
            ))}
          </Box>
        </>
      )}
    </Box>
  );
};

export default TaskList;