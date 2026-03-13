import { useEffect, useState, lazy, Suspense } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { CssBaseline, ThemeProvider, CircularProgress, Box } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import ProtectedRoute from "./ProtectedRoute.jsx";
import { supabase } from "./supabaseClient.js";

// 🔹 Layout
import UserLayout from "./scenes/user/UserLayout";

// 🔹 User Pages
import Plan from "./scenes/user/plans.jsx";
import Deposit from "./scenes/user/Deposit";
import Withdraw from "./scenes/user/Withdraw";
import Profile from "./scenes/user/profile";
import Home from "./scenes/user/home.jsx";
import Team from "./scenes/user/team.jsx";
import TaskList from "./scenes/user/task.jsx";
import DepositHistory from "./scenes/user/deposithistory.jsx";
import Support from "./scenes/user/support.jsx";
import AdminDashboard from "./scenes/user/adminpage.jsx";// 🔹 Auth
import Login from "./scenes/login/Login";
import Register from "./scenes/register/Register";
import ChoosePanel from "./components/ChoosePanel";

// 🔹 Lazy Load
const FAQPage = lazy(() => import("./scenes/user/faq.jsx"));

function App() {
  const [theme, colorMode] = useMode();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Tasks state
  const [tasks, setTasks] = useState([]);

  // ✅ Listen to Supabase session
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);

      // Fetch tasks for logged-in user
      if (data.session) {
        fetchTasks(data.session.user.id);
      }
    };

    const fetchTasks = async (userId) => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", userId);

      if (!error && data) {
        setTasks(data);
      } else {
        // fallback mock tasks
        setTasks([
          { title: "Submit Report", description: "Submit monthly report", dueDate: "2026-03-05" },
          { title: "Team Meeting", description: "Discuss project updates", dueDate: "2026-03-06" },
        ]);
      }
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchTasks(session.user.id);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Suspense
          fallback={
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress />
            </Box>
          }
        >
          <Routes>
            {/* Default */}
<Route
  path="/"
  element={
    session ? <Navigate to="/user-dashboard" replace /> : <Navigate to="/register" replace />
  }
/>

{/* Auth */}
<Route
  path="/login"
  element={session ? <Navigate to="/user-dashboard" replace /> : <Login />}
/>
<Route path="/register" element={<Register />} />
<Route path="/choose-panel" element={<ChoosePanel />} />

            {/* ================= USER DASHBOARD ================= */}
            <Route
              path="/user-dashboard/*"
              element={
                <ProtectedRoute>
                  <UserLayout />
                </ProtectedRoute>
              }
            >
              
              <Route index element={<Home />} />
              <Route path="plan" element={<Plan />} />
              <Route path="deposit" element={<Deposit />} />
              <Route path="withdraw" element={<Withdraw />} />
              <Route path="profile" element={<Profile />} />
              <Route path="team" element={<Team />} />
              <Route path="faq" element={<FAQPage />} />
              <Route path="deposit-history" element={<DepositHistory />} />
              <Route path="support" element={<Support />} />
// Inside <Route path="/user-dashboard/*">
<Route
  index
  element={
    session?.user?.email === "admin@gmail.com" && localStorage.getItem("isAdmin")
      ? <AdminDashboard />
      : <Home />
  }
/>
</Route>
              {/* ✅ TaskList Route */}
              <Route
                path="tasks"
                element={<TaskList userName={session?.user?.email || "User"} tasks={tasks} />}
              />

              <Route path="*" element={<Navigate to="/user-dashboard" replace />} />
            </Route>

            {/* ================= ADMIN DASHBOARD ================= */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute>
                  <div className="app">
                    <main className="content">
                      <Outlet />
                    </main>
                  </div>
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
            </Route>

            {/* Catch All */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;