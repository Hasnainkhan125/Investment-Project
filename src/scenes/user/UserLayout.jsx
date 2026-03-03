import React, { useState, useEffect, useRef } from "react";
import {
  User,
  LogOut,
  Zap,
  Sun,
  Moon,
  ChevronDown,
} from "lucide-react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { supabase } from "../../supabaseClient";

const navLinks = [
  { name: "Home", path: "" },
  { name: "Plan", path: "plan" },
  { name: "Deposit", path: "deposit" },
  { name: "Withdraw", path: "withdraw" },
  { name: "Team", path: "team" },
  { name: "Profile", path: "profile" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef(null);
  const logoutRef = useRef(null);

  const [darkMode, setDarkMode] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("");

  // ================= SCREEN DETECTION =================
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ================= FETCH USER SESSION =================
  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        navigate("/login");
        return;
      }

      const user = session.user;
      setUserEmail(user.email);
      setUserName(user.user_metadata?.name || "User");
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session) {
          navigate("/login");
        } else {
          setUserEmail(session.user.email);
          setUserName(session.user.user_metadata?.name || "User");
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, [navigate]);

  // ================= AUTO HIDE PROFILE MENU & LOGOUT DIALOG =================
  useEffect(() => {
    const handleClickOutside = (event) => {
      const profileContains = profileRef.current?.contains(event.target);
      const logoutContains = logoutRef.current?.contains(event.target);

      if (!profileContains && !logoutContains) {
        setShowProfileMenu(false);
        setShowLogoutConfirm(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ================= LOGOUT =================
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const isActiveLink = (path) => {
    if (path === "" && location.pathname === "/user-dashboard") return true;
    return location.pathname === `/user-dashboard/${path}`;
  };

  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: darkMode ? "#0f172a" : "#f8fafc",
        color: darkMode ? "#fff" : "#0f172a",
        fontFamily: "Inter, system-ui",
        transition: "0.3s",
      }}
    >
      {/* ================= NAVBAR ================= */}
      <div
        style={{
          position: "fixed",
          top: 0,
          background: darkMode ? "#0f1729" : "#ffffff",
          width: "100%",
          zIndex: 100,
          display: "flex",
          justifyContent: "space-between",
          padding: isMobile ? 16 : 19,
          alignItems: "center",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            cursor: "pointer",
            transition: "transform 0.2s ease",
          }}
          onClick={() => navigate("/user-dashboard")}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #3b82f6, #60a5fa)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          >
            <Zap size={22} color="#fff" />
          </div>
          <span
            style={{
              fontWeight: 700,
              fontSize: isMobile ? 20 : 22,
              background: "linear-gradient(90deg, #3b82f6, #60a5fa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            Invest Pro
          </span>
        </div>

        {/* Right Side */}
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          {!isMobile &&
            navLinks.map((link) => {
              const active = isActiveLink(link.path);
              return (
                <div
                  key={link.name}
                  onClick={() => navigate(`/user-dashboard/${link.path}`)}
                  style={{
                    cursor: "pointer",
                    padding: "8px 14px",
                    borderRadius: 9,
                    background: active ? "#309dea29" : "transparent",
                    color: active
                      ? "#309cea"
                      : darkMode
                      ? "#cbd5e1"
                      : "#000000",
                    fontWeight: 600,
                  }}
                >
                  {link.name}
                </div>
              );
            })}

          <div onClick={() => setDarkMode(!darkMode)} style={{ cursor: "pointer" }}>
            {darkMode ? <Sun size={20} color="#6fb9ee" /> : <Moon size={20} />}
          </div>

          {/* Profile Menu */}
{/* Profile Menu */}
<div ref={profileRef} style={{ position: "relative" }}>
  <div
    onClick={() => setShowProfileMenu(!showProfileMenu)}
    style={{
      display: "flex",
      alignItems: "center",
      gap: 6,
      cursor: "pointer",
    }}
  >
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        background: "#356fed",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#ffffff",
        fontWeight: 600,
      }}
    >
      {userInitial}
    </div>
    {!isMobile && <ChevronDown size={16} />}
  </div>

  {showProfileMenu && (
    <div
      style={{
        position: "absolute",
        top: 50,
        right: 0,
        width: 240,
        background: darkMode ? "#1f2937" : "#ffffff",
        borderRadius: 16,
        padding: 18,
        boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
      }}
    >
      <div style={{ marginBottom: 15 }}>
        <div style={{ fontWeight: 600 }}>{userName}</div>
        <div style={{ fontSize: 13, opacity: 0.7 }}>{userEmail}</div>
      </div>

      {/* Profile Setting */}
      <div
        onClick={() => {
          navigate("/user-dashboard/profile");
          setShowProfileMenu(false); // <-- hide menu
        }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 0",
          cursor: "pointer",
          fontWeight: 500,
        }}
      >
        <User size={18} />
        Profile Setting
      </div>

      {/* Sign Out */}
      <div
        onClick={() => {
          setShowLogoutConfirm(true);
          setShowProfileMenu(false); // <-- hide menu
        }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 0",
          cursor: "pointer",
          color: "#ef4444",
          fontWeight: 500,
        }}
      >
        <LogOut size={18} />
        Sign Out
      </div>
    </div>
  )}
</div>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div style={{ padding: "100px 6% 40px 6%" }}>
        <Outlet />
      </div>

{/* ================= MODERN LOGOUT DIALOG ================= */}
{showLogoutConfirm && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.3)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 200,
      backdropFilter: "blur(6px)",
      WebkitBackdropFilter: "blur(6px)",
      opacity: showLogoutConfirm ? 1 : 0,
      transition: "opacity 0.3s ease",
    }}
  >
    <div
      ref={logoutRef}
      style={{
        position: "relative",
        background: darkMode ? "rgba(30,41,59,0.95)" : "rgba(255,255,255,0.95)",
        padding: "36px 24px",
        borderRadius: 20,
        width: 380,
        maxWidth: "90%",
        textAlign: "center",
        boxShadow: darkMode
          ? "0 16px 48px rgba(0,0,0,0.7)"
          : "0 16px 48px rgba(0,0,0,0.15)",
        transform: showLogoutConfirm ? "scale(1)" : "scale(0.8)",
        opacity: showLogoutConfirm ? 1 : 0,
        transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease",
      }}
    >
      {/* Top Logout Icon */}
      <div
        style={{
          position: "absolute",
          top: 7,
          left: "50%",
          transform: "translateX(-50%)",
          background: darkMode ? "#374151" : "#f3f4f6",
          padding: 12,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          transition: "transform 0.2s ease",
          cursor: "default",
        }}
      >
        <LogOut
          size={45}
          color={darkMode ? "#f1f5f9" : "#111827"}
          style={{ transition: "transform 0.2s ease" }}
        />
      </div>

      {/* Title */}
      <div
        style={{
          marginTop: 50, // space for the icon
          marginBottom: 12,
          fontSize: 22,
          fontWeight: 700,
          color: darkMode ? "#f1f5f9" : "#111827",
        }}
      >
        Confirm Logout
      </div>

      {/* Description */}
      <div
        style={{
          marginBottom: 32,
          fontSize: 15,
          color: darkMode ? "#cbd5e1" : "#4b5563",
          lineHeight: 1.5,
        }}
      >
        Are you sure you want to log out? Any unsaved changes will be lost.
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", gap: 14 }}>
        <button
          onClick={() => setShowLogoutConfirm(false)}
          style={{
            flex: 1,
            padding: "14px 0",
            borderRadius: 12,
            border: "1px solid #9ca3af",
            background: darkMode ? "#374151" : "#f3f4f6",
            color: darkMode ? "#f1f5f9" : "#111827",
            cursor: "pointer",
            fontWeight: 600,
            transition: "all 0.2s ease",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = darkMode ? "#4b5563" : "#e5e7eb")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = darkMode ? "#374151" : "#f3f4f6")
          }
        >
          Cancel
        </button>
        <button
          onClick={handleLogout}
          style={{
            flex: 1,
            padding: "14px 0",
            borderRadius: 12,
            border: "none",
            background: "#ef4444",
            color: "#fff",
            cursor: "pointer",
            fontWeight: 600,
            transition: "all 0.2s ease",
            boxShadow: "0 6px 12px rgba(239,68,68,0.4)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#dc2626")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#ef4444")}
        >
          Logout
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default Dashboard;