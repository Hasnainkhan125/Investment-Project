import React from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  Chip,
  Tooltip,
} from "@mui/material";
import LockPersonIcon from "@mui/icons-material/LockPerson";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { ArrowBackIosNew as ArrowBackIosNewIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const TaskList = ({ userName = "User", tasks = [], hasActivePlan = false }) => {
  const navigate = useNavigate();

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "error";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "default";
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 1000,
        mx: "auto",
      }}
    >
      {/* Back Button */}
      <IconButton
        onClick={() => navigate("/user-dashboard")}
        sx={{
          color: "#fff",
          background: "linear-gradient(135deg, #1e88e5, #1565c0)",
          borderRadius: "12px",
          p: 1.5,
          mb: 3,
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "scale(1.1)",
            background: "linear-gradient(135deg, #1565c0, #1e88e5)",
          },
        }}
      >
        <ArrowBackIosNewIcon fontSize="medium" />
      </IconButton>

      {/* Locked Screen */}
      {!hasActivePlan ? (
        <Paper
          elevation={3}
          sx={{
            p: { xs: 4, md: 6 },
            borderRadius: 4,
            textAlign: "center",
            background: "linear-gradient(135deg, #dbeafe, #f0f9ff)",
            border: "1px solid #93c5fd",
            boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
          }}
        >
          <LockPersonIcon sx={{ fontSize: 60, color: "#2563eb", mb: 2 }} />
          <Typography variant="h3" fontWeight={800} color="#1e40af" mb={2}>
            No Active Plan
          </Typography>
          <Typography variant="h6" color="#475569" mb={4}>
            You need an active plan to access your daily tasks.
          </Typography>
          <Button
            onClick={() => navigate("/user-dashboard/plan")}
            variant="contained"
            startIcon={<WorkspacePremiumIcon />}
            sx={{
              px: { xs: 4, sm: 6 },
              py: 1.5,
              fontSize: { xs: "1rem", sm: "1.3rem" },
              borderRadius: "30px",
              textTransform: "none",
              background: "linear-gradient(90deg, #3b82f6, #1e40af)",
              boxShadow: "0 4px 15px rgba(59,130,246,0.4)",
              "&:hover": {
                background: "linear-gradient(90deg, #1e3a8a, #1e40af)",
                boxShadow: "0 6px 20px rgba(59,130,246,0.5)",
              },
            }}
          >
            View Plans
          </Button>
        </Paper>
      ) : (
        <>
          {/* Welcome */}
          <Typography
            sx={{
              fontSize: { xs: "1rem", sm: "1.3rem" },
              fontWeight: 500,
              color: "#475569",
              mb: 4,
              mt: 2,
            }}
          >
            Welcome back,{" "}
            <Box
              component="span"
              sx={{
                fontWeight: 700,
                background: "linear-gradient(90deg, #3b82f6, #2563eb)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {userName}
            </Box>{" "}
            👋
          </Typography>

          {/* Tasks List */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            {tasks.length === 0 && (
              <Typography
                color="#94a3b8"
                textAlign="center"
                sx={{ mt: 4, fontSize: { xs: "0.9rem", sm: "1rem" } }}
              >
                No tasks for today 🎉
              </Typography>
            )}

            {tasks.map((task, index) => (
              <Paper
                key={index}
                sx={{
                  p: { xs: 2, sm: 3 },
                  borderRadius: 3,
                  background: "#ffffff",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                  transition: "all 0.3s",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 1,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <TaskAltIcon sx={{ color: "#3b82f6", fontSize: { xs: 18, sm: 20 } }} />
                    <Typography fontWeight={600} fontSize={{ xs: 14, sm: 16 }}>
                      {task.title}
                    </Typography>
                  </Box>
                  {task.completed ? (
                    <Chip
                      icon={<CheckCircleIcon />}
                      label="Completed"
                      color="success"
                      size="small"
                    />
                  ) : (
                    <Chip
                      label={task.priority || "Normal"}
                      color={getPriorityColor(task.priority)}
                      size="small"
                    />
                  )}
                </Box>
                <Typography color="#64748b" fontSize={{ xs: 12, sm: 14 }}>
                  {task.description}
                </Typography>
                <Typography fontSize={{ xs: 11, sm: 12 }} color="#94a3b8" mt={1}>
                  Due: {task.dueDate}
                </Typography>
                {!task.completed && (
                  <Button
                    variant="contained"
                    sx={{
                      mt: 2,
                      alignSelf: "flex-start",
                      px: 3,
                      py: 0.8,
                      fontSize: { xs: 12, sm: 13 },
                      borderRadius: "20px",
                      background: "linear-gradient(90deg, #3b82f6, #2563eb)",
                      "&:hover": {
                        background: "linear-gradient(90deg, #1e40af, #1e3a8a)",
                      },
                    }}
                  >
                    Mark Complete
                  </Button>
                )}
              </Paper>
            ))}
          </Box>
        </>
      )}
    </Box>
  );
};

export default TaskList;