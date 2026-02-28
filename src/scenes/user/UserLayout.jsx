  import React, { useState, useEffect, useRef } from "react";
import {
  User,
  LogOut,
  Menu,
  X,
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
  { name: "Profile", path: "profile" },
];
const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef(null);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [darkMode, setDarkMode] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // ✅ REAL AUTH STATE
  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("");

  // ================= FETCH USER SESSION =================
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        navigate("/login");
        return;
      }

      const user = session.user;
      setUserEmail(user.email);
      setUserName(user.user_metadata?.name || "User");
    };

    getSession();

    // 🔥 Listen to login/logout changes
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

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [navigate]);

  // ================= RESPONSIVE =================
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ================= CLOSE PROFILE MENU =================
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
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
            padding: 19,
            alignItems: "center",
          }}
        >
          {/* Logo */}
          <div
            style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
            onClick={() => navigate("/user-dashboard")}
          >
            <Zap size={30} color="#ff9d00" />
            <span style={{ fontWeight: 700, fontSize: 20, color: "#ff9d00" }}>InvestPro</span>
          </div>

          {/* Desktop Nav */}
          {!isMobile && (
            <div style={{ display: "flex", gap: 25, alignItems: "center" }}>
              {navLinks.map((link) => {
                const active = isActiveLink(link.path);
                return (
                  <div
                    key={link.name}
                    onClick={() => navigate(`/user-dashboard/${link.path}`)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      cursor: "pointer",
                      padding: "8px 14px",
                      borderRadius: 12,
                      background: active ? "rgba(255,157,0,0.15)" : "transparent",
                      color: active ? "#ff9d00" : darkMode ? "#cbd5e1" : "#000000",
                      fontWeight: 600,
                    }}
                  >
                    {link.icon}
                    {link.name}
                  </div>
                );
              })}

              <div onClick={() => setDarkMode(!darkMode)} style={{ cursor: "pointer" }}>
                {darkMode ? <Sun size={20} color="#facc15" /> : <Moon size={20} />}
              </div>

              <div ref={profileRef} style={{ position: "relative" }}>
                <div
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #ff9d00, #ff6a00)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontWeight: 600,
                    }}
                  >
{userInitial}                  </div>
                  <ChevronDown size={16} />
                </div>

                {showProfileMenu && (
                  <div
                    style={{
                      position: "absolute",
                      top: 55,
                      right: 0,
                      width: 250,
                      backdropFilter: "blur(20px)",
                      background: darkMode ? "#0d1423" : "#ffffff",
                      borderRadius: 16,
                      padding: 18,
                      boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
                    }}
                  >
                    <div style={{ marginBottom: 15 }}>
                      <div style={{ fontWeight: 600 }}>{userName}</div>
                      <div style={{ fontSize: 13, opacity: 0.7 }}>{userEmail}</div>
                    </div>
                    <div
                      onClick={() => navigate("/user-dashboard/profile")}
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
                    <div
                      onClick={() => setShowLogoutConfirm(true)}
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
          )}

          {/* Mobile Controls */}
          {isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
              <div onClick={() => setDarkMode(!darkMode)} style={{ cursor: "pointer" }}>
                {darkMode ? <Sun size={20} color="#facc15" /> : <Moon size={20} />}
              </div>
              <div ref={profileRef} style={{ position: "relative" }}>
                <div
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #ff9d00, #ff6a00)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontWeight: 600,
                    }}
                  >
                    {userInitial}
                  </div>
                  <ChevronDown size={14} />
                </div>
                {showProfileMenu && (
                  <div
                    style={{
                      position: "absolute",
                      top: 50,
                      right: 0,
                      width: 220,
                      backdropFilter: "blur(20px)",
                      background: darkMode ? "#101a2c" : "#ffffff",
                      borderRadius: 14,
                      padding: 16,
                      boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
                      zIndex: 300,
                    }}
                  >
                    <div style={{ marginBottom: 10 }}>
                      <div style={{ fontWeight: 600 }}>{userName}</div>
                      <div style={{ fontSize: 12, opacity: 0.7 }}>{userEmail}</div>
                    </div>
                    <div
                      onClick={() => navigate("/user-dashboard/profile")}
                      style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", cursor: "pointer" }}
                    >
                      <User size={16} />
                      Profile Settings
                    </div>
                    <div
                      onClick={() => setShowLogoutConfirm(true)}
                      style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", cursor: "pointer", color: "#ef4444" }}
                    >
                      <LogOut size={16} />
                      Sign Out
                    </div>
                  </div>
                )}
              </div>
              <Menu size={24} onClick={() => setMobileOpen(true)} />
            </div>
          )}
        </div>


        
  {/* ================= Mobile Drawer ================= */}
  {isMobile && (
    <>
      {/* Overlay */}
      {mobileOpen && (
  <div
    onClick={() => setMobileOpen(false)}
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.3)", // slightly lighter for blur
      backdropFilter: "blur(5px)",   // add blur effect
      WebkitBackdropFilter: "blur(5px)", // for Safari support
      zIndex: 299,
    }}
  />
      )}

      {/* Drawer */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: mobileOpen ? 0 : "-100%",
          width: 290,
          height: "100%",
          background: darkMode ? "#0f172a" : "#ffffff",
          zIndex: 350,
          padding: 20,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          transition: "right 0.3s ease",
          boxShadow: darkMode ? "-5px 0 15px rgba(0,0,0,0.5)" : "-5px 0 15px rgba(0,0,0,0.1)",
          borderTopLeftRadius: 16,
          borderBottomLeftRadius: 16,
        }}
      >
        <div>
          {/* Close button */}
          <div
            style={{ alignSelf: "flex-end", cursor: "pointer", marginBottom: 20 }}
            onClick={() => setMobileOpen(false)}
          >
            <X size={24} />
          </div>

          {/* Avatar + Email */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #ff9d00, #ff6a00)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 600,
                fontSize: 18,
              }}
            >
{userInitial}            </div>
            <div>
              <div style={{ fontWeight: 600, color: darkMode ? "#fff" : "#111827" }}>{userName}</div>
              <div style={{ fontSize: 10, opacity: 0.7 }}>{userEmail}</div>
            </div>
          </div>

          {/* Navigation Links */}
          {navLinks.map((link) => {
            const active = isActiveLink(link.path);
            return (
              <div
                key={link.name}
                onClick={() => {
                  navigate(`/user-dashboard/${link.path}`);
                  setMobileOpen(false); // close after click
                }}
                style={{
                  padding: "15px 16px",
                  marginBottom: 22,
                  borderRadius: 12,
                  background: active
                    ? "linear-gradient(135deg, #ff9d00, #ea580c)"
                    : darkMode
                    ? "#1f2937"
                    : "#f3f4f6",
                  color: active ? "#fff" : darkMode ? "#cbd5e1" : "#111827",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 15,
                }}
              >
                {link.icon}
                {link.name}
              </div>
            );
          })}

  {/* Dark Mode Toggle */}
  <div
    onClick={() => setDarkMode(!darkMode)}
    style={{
      padding: "12px 16px",
      borderRadius: 14,
      background: darkMode
        ? "linear-gradient(135deg, #1e293b, #0f172a)"
        : "linear-gradient(135deg, #e2e8f0, #ffffff)",
      cursor: "pointer",
      fontWeight: 600,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      marginTop: 15,
      border: darkMode
        ? "1px solid rgba(255,255,255,0.1)"
        : "1px solid rgba(0,0,0,0.08)",
      transition: "0.3s",
    }}
  >
    {darkMode ? <Sun size={18} color="#facc15" /> : <Moon size={18} />}
    {darkMode ? "Light Mode" : "Dark Mode"}
  </div>
        </div>

  {/* Logout Button */}
  <div
    onClick={() => {
      setShowLogoutConfirm(true);
      setMobileOpen(false);
    }}
    style={{
      padding: "14px 16px",
      borderRadius: 16,
      background: "linear-gradient(135deg, #ff9d00, #ea580c)",
      color: "#fff",
      fontWeight: 600,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      cursor: "pointer",
      boxShadow: "0 10px 25px rgba(239,68,68,0.3)",
      transition: "0.3s",
    }}
  >
    <LogOut size={18} />
    Sign Out
  </div>
      </div>
    </>
  )}

        {/* ================= Logout Modal ================= */}
        {showLogoutConfirm && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0,0,0,0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 500,
            }}
            onClick={() => setShowLogoutConfirm(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "90%",
                maxWidth: 380,
                background: darkMode ? "#1f2937" : "#ffffff",
                padding: 30,
                borderRadius: 20,
                textAlign: "center",
                boxShadow: darkMode ? "0 15px 40px rgba(0,0,0,0.5)" : "0 15px 40px rgba(0,0,0,0.15)",
              }}
            >
              <h2 style={{ marginBottom: 12, fontSize: 22, fontWeight: 700 }}>Confirm Logout</h2>
              <p style={{ fontSize: 14, opacity: 0.8, marginBottom: 25 }}>Are you sure you want to sign out?</p>
              <div style={{ display: "flex", gap: 12 }}>
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  style={{
                    flex: 1,
                    padding: "12px 0",
                    borderRadius: 12,
                    border: "none",
                    cursor: "pointer",
                    background: darkMode ? "#374151" : "#e2e8f0",
                    fontWeight: 600,
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  style={{
                    flex: 1,
                    padding: "12px 0",
                    borderRadius: 12,
                    border: "none",
                    cursor: "pointer",
                    background: "#f59e0b",
                    color: "#fff",
                    fontWeight: 600,
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= CONTENT ================= */}
        <div style={{ padding: "100px 6% 40px 6%" }}>
          <Outlet />
        </div>

      </div>
    );
  };

  export default Dashboard;



