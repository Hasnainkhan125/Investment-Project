import { useEffect } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import ProtectedRoute from "./ProtectedRoute.jsx";

// 🔹 Import Supabase client
import { supabase } from "./supabaseClient.js";

// 🔹 USER DASHBOARD LAYOUT
import UserLayout from "./scenes/user/UserLayout";

// 🔹 USER DASHBOARD PAGES
import DashboardHome from "./scenes/user/DashboardHome";
import Plan from "./scenes/user/plans.jsx";
import Deposit from "./scenes/user/Deposit";
import Withdraw from "./scenes/user/Withdraw";
import Profile from "./scenes/user/profile";
import Home from "./scenes/user/home.jsx";

// 🔹 Auth
import Login from "./scenes/login/Login";
import Register from "./scenes/register/Register";
import ChoosePanel from "./components/ChoosePanel";

function App() {
  const [theme, colorMode] = useMode();
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

  useEffect(() => {
    const savedMode = localStorage.getItem("themeMode") || "dark";
    document.body.dataset.theme = savedMode;
  }, [theme]);

  // Example: check Supabase session on app load
  useEffect(() => {
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) console.log("Supabase session error:", error);
      else console.log("Supabase session:", session);
    };
    getSession();
  }, []);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <Routes>
          {/* DEFAULT ROUTE → LOGIN */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* LOGIN WITH AUTO REDIRECT */}
          <Route
            path="/login"
            element={
              currentUser?.role ? (
                currentUser.role === "admin" ? (
                  <Navigate to="/admin/dashboard" replace />
                ) : (
                  <Navigate to="/user-dashboard" replace />
                )
              ) : (
                <Login />
              )
            }
          />

          <Route path="/register" element={<Register />} />
          <Route path="/choose-panel" element={<ChoosePanel />} />

          <Route
            path="/user-dashboard/*"
            element={
              <ProtectedRoute roles={["user", "admin"]}>
                <UserLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Home />} />
            <Route path="plan" element={<Plan />} />
            <Route path="deposit" element={<Deposit />} />
            <Route path="withdraw" element={<Withdraw />} />
            <Route path="profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/user-dashboard" replace />} />
          </Route>

          {/* ================= ADMIN DASHBOARD ================= */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute roles={["admin"]}>
                <div className="app">
                  <main className="content">
                    <Outlet />
                  </main>
                </div>
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="*" element={<Navigate to="/admin/dashboard" />} />
          </Route>

          {/* Catch All */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;