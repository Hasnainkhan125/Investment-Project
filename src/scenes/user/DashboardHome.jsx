import React, { useState, useEffect, useRef } from "react";
import {
  Home,
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
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

// Pages are now loaded via Routes, so Outlet handles them

const navLinks = [
  { name: "Home", path: "" },
  { name: "Plan", path: "plan" },        // singular → matches <Route path="plan" />
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

  const userEmail = "user@example.com";

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.clear();
    navigate("/login");
  };

  const isActiveLink = (path) => {
    if (path === "" && location.pathname === "/user-dashboard") return true;
    return location.pathname === `/user-dashboard/${path}`;
  };

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

            {/* Dark Mode Toggle */}
            <div onClick={() => setDarkMode(!darkMode)} style={{ cursor: "pointer" }}>
              {darkMode ? <Sun size={20} color="#facc15" /> : <Moon size={20} />}
            </div>

            {/* Avatar */}
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
                  U
                </div>
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
                    background: darkMode ? "#0d1423" : "#0d1423",
                    borderRadius: 16,
                    padding: 18,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
                  }}
                >
                  <div style={{ marginBottom: 15 }}>
                    <div style={{ fontWeight: 600 }}>My Account</div>
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

            {/* Avatar + menu */}
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
                  U
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
                    <div style={{ fontWeight: 600 }}>My Account</div>
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

      {/* ================= Mobile Drawer omitted for brevity, apply same navigate logic ================= */}

      {/* Logout Confirmation Modal */}
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
            animation: "fadeIn 0.25s ease",
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
              transform: "scale(0.8)",
              opacity: 0,
              animation: "fadeScaleUp 0.3s forwards",
            }}
          >
            <h2 style={{ marginBottom: 12, fontSize: 22, fontWeight: 700 }}>Confirm Logout</h2>
            <p style={{ fontSize: 14, opacity: 0.8, marginBottom: 25 }}>Are you sure you want to sign out?</p>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setShowLogoutConfirm(false)} style={{ flex: 1, padding: "12px 0", borderRadius: 12, border: "none", cursor: "pointer", background: darkMode ? "#374151" : "#e2e8f0", fontWeight: 600 }}>Cancel</button>
              <button onClick={handleLogout} style={{ flex: 1, padding: "12px 0", borderRadius: 12, border: "none", cursor: "pointer", background: "#f59e0b", color: "#fff", fontWeight: 600 }}>Logout</button>
            </div>
          </div>
        </div>
      )}

      {/* ================= CONTENT ================= */}
      <div style={{ padding: "100px 6% 40px 6%" }}>
        <Outlet /> {/* <-- This renders the page based on current route */}
      </div>
    </div>
  );
};

export default Dashboard;


































// import React, { useState, useEffect, useRef } from "react";
// import {
//   Home,
//   Wallet,
//   ArrowDownCircle,
//   ArrowUpCircle,
//   User,
//   LogOut,
//   Menu,
//   X,
//   Zap,
//   Sun,
//   Moon,
//   ChevronDown,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// // Pages
// import HomePage from "./home.jsx";
// import Plans from "./plans.jsx";
// import Deposit from "./Deposit.jsx";
// import Withdraw from "./Withdraw.jsx";
// import Profile from "./profile.jsx";


// const navLinks = [
//   { name: "Home", icon: <Home size={18} /> },
//   { name: "Plans", icon: <Wallet size={18} /> },
//   { name: "Deposit", icon: <ArrowDownCircle size={18} /> },
//   { name: "Withdraw", icon: <ArrowUpCircle size={18} /> },
//   { name: "Profile", icon: <User size={18} /> },
// ];



// const Dashboard = () => {
//   const navigate = useNavigate();
//   const profileRef = useRef(null);

//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [activeTab, setActiveTab] = useState("Home");
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
//   const [darkMode, setDarkMode] = useState(true);
//   const [showProfileMenu, setShowProfileMenu] = useState(false);
//   const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

//   const userEmail = "user@example.com";

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 768);
//       if (window.innerWidth >= 768) setMobileOpen(false);
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // Close profile dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (profileRef.current && !profileRef.current.contains(event.target)) {
//         setShowProfileMenu(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     sessionStorage.clear();
//     navigate("/login");
//   };

//   // Pass darkMode to all pages
//   const renderContent = () => {
//     const pageProps = { darkMode }; // <--- new prop
//     switch (activeTab) {
//       case "Home":
//         return <HomePage {...pageProps} />;
//       case "Plans":
//         return <Plans {...pageProps} />;
//       case "Deposit":
//         return <Deposit {...pageProps} />;
//       case "Withdraw":
//         return <Withdraw {...pageProps} />;
//       case "Profile":
//         return <Profile {...pageProps} />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background: darkMode ? "#0f172a" : "#f8fafc",
//         color: darkMode ? "#fff" : "#0f172a",
//         fontFamily: "Inter, system-ui",
//         transition: "0.3s",
//       }}
//     >
//       {/* ================= NAVBAR ================= */}
//       <div
//         style={{
//           position: "fixed",
//           top: 0,
//            background: darkMode ? "#0f1729" : "#ffffff",
//           width: "100%",
//           zIndex: 100,
//           display: "flex",
//           justifyContent: "space-between",
//           padding: 19,
//           alignItems: "center",
//         }}
//       >
//    {/* Logo */}
// <div 
//   style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
//   onClick={() => {
//     setActiveTab("Home"); // set the active tab to Home
//     navigate("/user-dashboard");         // navigate to homepage
//   }}
// >
//   <Zap size={30} color="#ff9d00" />
//   <span style={{ fontWeight: 700, fontSize: 20, color: "#ff9d00" }}>
//     InvestPro
//   </span>
// </div>


//         {/* Desktop Nav */}
//         {!isMobile && (
//           <div style={{ display: "flex", gap: 25, alignItems: "center" }}>
//             {navLinks.map((link) => {
//               const isActive = activeTab === link.name;
//               return (
//                 <div
//                   key={link.name}
//                   onClick={() => setActiveTab(link.name)}
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 8,
//                     cursor: "pointer",
//                     padding: "8px 14px",
//                     borderRadius: 12,
//                     background: isActive ? "rgba(255,157,0,0.15)" : "transparent",
//                     color: isActive ? "#ff9d00" : darkMode ? "#cbd5e1" : "#000000",
//                     fontWeight: 600,
//                   }}
//                 >
//                   {link.icon}
//                   {link.name}
//                 </div>
//               );
//             })}

//             {/* Dark Mode Toggle */}
//             <div onClick={() => setDarkMode(!darkMode)} style={{ cursor: "pointer" }}>
//               {darkMode ? <Sun size={20} color="#facc15" /> : <Moon size={20} />}
//             </div>

//             {/* Avatar */}
//             <div ref={profileRef} style={{ position: "relative" }}>
//               <div
//                 onClick={() => setShowProfileMenu(!showProfileMenu)}
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 6,
//                   cursor: "pointer",
//                 }}
//               >
//                 <div
//                   style={{
//                     width: 40,
//                     height: 40,
//                     borderRadius: "50%",
//                     background: "linear-gradient(135deg, #ff9d00, #ff6a00)",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     color: "#fff",
//                     fontWeight: 600,
//                   }}
//                 >
//                   U
//                 </div>
//                 <ChevronDown size={16} />
//               </div>

//               {showProfileMenu && (
//                 <div
//                   style={{
//                     position: "absolute",
//                     top: 55,
//                     right: 0,
//                     width: 250,
//                     backdropFilter: "blur(20px)",
//                     background: darkMode ? "#0d1423" : "#0d1423",
//                     borderRadius: 16,
//                     padding: 18,
//                     boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
//                   }}
//                 >
//                   <div style={{ marginBottom: 15 }}>
//                     <div style={{ fontWeight: 600 }}>My Account</div>
//                     <div style={{ fontSize: 13, opacity: 0.7 }}>{userEmail}</div>
//                   </div>

//                   <div
//                     onClick={() => {
//                       setActiveTab("Profile");
//                       setShowProfileMenu(false);
//                     }}
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: 10,
//                       padding: "10px 0",
//                       cursor: "pointer",
//                       fontWeight: 500,
//                     }}
//                   >
//                     <User size={18} />
//                     Profile Setting
//                   </div>

//                   <div
//                     onClick={() => setShowLogoutConfirm(true)}
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: 10,
//                       padding: "10px 0",
//                       cursor: "pointer",
//                       color: "#ef4444",
//                       fontWeight: 500,
//                     }}
//                   >
//                     <LogOut size={18} />
//                     Sign Out
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Mobile Controls */}
//         {isMobile && (
//           <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
//             <div onClick={() => setDarkMode(!darkMode)} style={{ cursor: "pointer" }}>
//               {darkMode ? <Sun size={20} color="#facc15" /> : <Moon size={20} />}
//             </div>

//             {/* Avatar */}
//             <div ref={profileRef} style={{ position: "relative" }}>
//               <div
//                 onClick={() => setShowProfileMenu(!showProfileMenu)}
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 6,
//                   cursor: "pointer",
//                 }}
//               >
//                 <div
//                   style={{
//                     width: 36,
//                     height: 36,
//                     borderRadius: "50%",
//                     background: "linear-gradient(135deg, #ff9d00, #ff6a00)",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     color: "#fff",
//                     fontWeight: 600,
//                   }}
//                 >
//                   U
//                 </div>
//                 <ChevronDown size={14} />
//               </div>

//               {showProfileMenu && (
//                 <div
//                   style={{
//                     position: "absolute",
//                     top: 50,
//                     right: 0,
//                     width: 220,
//                     backdropFilter: "blur(20px)",
//                     background: darkMode ? "#101a2c" : "#ffffff",
//                     borderRadius: 14,
//                     padding: 16,
//                     boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
//                     zIndex: 300,
//                   }}
//                 >
//                   <div style={{ marginBottom: 10 }}>
//                     <div style={{ fontWeight: 600 }}>My Account</div>
//                     <div style={{ fontSize: 12, opacity: 0.7 }}>{userEmail}</div>
//                   </div>

//                   <div
//                     onClick={() => {
//                       setActiveTab("Profile");
//                       setShowProfileMenu(false);
//                     }}
//                     style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", cursor: "pointer" }}
//                   >
//                     <User size={16} />
//                     Profile Settings
//                   </div>

//                   <div
//                     onClick={() => setShowLogoutConfirm(true)}
//                     style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", cursor: "pointer", color: "#ef4444" }}
//                   >
//                     <LogOut size={16} />
//                     Sign Out
//                   </div>
//                 </div>
//               )}
//             </div>

//             <Menu size={24} onClick={() => setMobileOpen(true)} />
//           </div>
//         )}
//       </div>

//    {/* ================= Modern Mobile Menu Drawer ================= */}
// {isMobile && (
//   <>
//     {/* Backdrop Overlay */}
//     <div
//       onClick={() => setMobileOpen(false)}
//       style={{
//         position: "fixed",
//         inset: 0,
//         background: mobileOpen ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0)",
//         backdropFilter: mobileOpen ? "blur(4px)" : "none",
//         transition: "0.3s ease",
//         zIndex: mobileOpen ? 190 : -1,
//       }}
//     />

//     {/* Drawer */}
//     <div
//       style={{
//         position: "fixed",
//         top: 0,
//         right: 0,
//         width: "85%",
//         maxWidth: 360,
//         height: "100vh",
//         padding: "28px 22px",
//         background: darkMode
//           ? "linear-gradient(145deg, #0f172a, #111827)"
//           : "linear-gradient(145deg, #ffffff, #f8fafc)",
//         backdropFilter: "blur(20px)",
//         boxShadow: "-10px 0 40px rgba(0,0,0,0.25)",
//         transform: mobileOpen ? "translateX(0)" : "translateX(110%)",
//         transition: "transform 0.4s cubic-bezier(.77,0,.18,1)",
//         zIndex: 200,
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "space-between",
//         borderTopLeftRadius: 24,
//         borderBottomLeftRadius: 24,
//       }}
//     >
//       <div>
//         {/* Close Button */}
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "flex-end",
//             marginBottom: 20,
//           }}
//         >
//           <X
//             size={26}
//             style={{ cursor: "pointer", opacity: 0.7, transition: "0.2s" }}
//             onMouseEnter={(e) => (e.target.style.opacity = 1)}
//             onMouseLeave={(e) => (e.target.style.opacity = 0.7)}
//             onClick={() => setMobileOpen(false)}
//           />
//         </div>

//         {/* ================= Profile Section ================= */}
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: 14,
//             marginBottom: 12,
//             padding: "12px 16px",
//             borderRadius: 16,
//             background: darkMode
//               ? "rgba(255,255,255,0.05)"
//               : "rgba(0,0,0,0.03)",
//           }}
//         >
//           <div
//             style={{
//               width: 48,
//               height: 48,
//               borderRadius: "50%",
//               background: "linear-gradient(135deg,#ff9d00,#ff6a00)",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               color: "#fff",
//               fontWeight: 700,
//               fontSize: 18,
//             }}
//           >
//             U
//           </div>
//           <div>
//             <div style={{ fontWeight: 600, fontSize: 15 }}>User</div>
//             <div style={{ fontSize: 12, opacity: 0.7 }}>{userEmail}</div>
//           </div>
//         </div>

       

//         {/* Navigation Links */}
//         {navLinks.map((link) => {
//           const isActive = activeTab === link.name;
//           return (
//             <div
//               key={link.name}
//               onClick={() => {
//                 setActiveTab(link.name);
//                 setMobileOpen(false);
//               }}
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 14,
//                 padding: "14px 18px",
//                 borderRadius: 16,
//                 marginBottom: 12,
//                 cursor: "pointer",
//                 position: "relative",
//                 fontWeight: 600,
//                 fontSize: 15,
//                 transition: "all 0.25s ease",
//                 background: isActive
//                   ? "rgba(255,157,0,0.12)"
//                   : "transparent",
//                 color: isActive
//                   ? "#ff9d00"
//                   : darkMode
//                   ? "#e5e7eb"
//                   : "#111827",
//               }}
//               onMouseEnter={(e) => {
//                 if (!isActive)
//                   e.currentTarget.style.background =
//                     "rgba(255,255,255,0.05)";
//               }}
//               onMouseLeave={(e) => {
//                 if (!isActive) e.currentTarget.style.background = "transparent";
//               }}
//             >
//               {isActive && (
//                 <div
//                   style={{
//                     position: "absolute",
//                     left: 0,
//                     top: "20%",
//                     height: "60%",
//                     width: 4,
//                     borderRadius: 4,
//                     background: "#ff9d00",
//                   }}
//                 />
//               )}
//               {link.icon}
//               {link.name}
//             </div>
//           );
//         })}
//       </div>
      

//       {/* Bottom Section */}
//       <div>
//         {/* Divider */}
//         <div
//           style={{
//             margin: "20px 0",
//             height: 1,
//             background: darkMode
//               ? "rgba(255,255,255,0.08)"
//               : "rgba(0,0,0,0.08)",
//             borderRadius: 2,
//           }}
//         />

//         {/* Sign Out */}
// <div
//   onClick={() => {
//     setShowLogoutConfirm(true);
//     window.scrollTo({ top: 0, behavior: "smooth" }); // scroll to top
//   }}
//   style={{
//     display: "flex",
//     position: 'relative',
//     alignItems: "center",
//     gap: 14,
//     padding: "14px 18px",
//     borderRadius: 16,
//     cursor: "pointer",
//     fontWeight: 600,
//     fontSize: 15,
//     color: "#ef4444",
//     transition: "all 0.25s ease",
//   }}
//   onMouseEnter={(e) => {
//     e.currentTarget.style.background = "rgba(239,68,68,0.1)";
//   }}
//   onMouseLeave={(e) => {
//     e.currentTarget.style.background = "transparent";
//   }}
// >
//   <LogOut size={18} />
//   Sign Out
// </div>

//       </div>
//     </div>
//   </>
// )}


//       {/* ================= Modern Logout Confirmation Modal ================= */}
//       {showLogoutConfirm && (
//         <div
//           style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             width: "100%",
//             height: "100%",
//             background: "rgba(0,0,0,0.5)",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             zIndex: 500,
//             animation: "fadeIn 0.25s ease",
//           }}
//           onClick={() => setShowLogoutConfirm(false)}
//         >
//           <div
//             onClick={(e) => e.stopPropagation()}
//             style={{
//               width: "90%",
//               maxWidth: 380,
//               background: darkMode ? "#1f2937" : "#ffffff",
//               padding: 30,
//               borderRadius: 20,
//               textAlign: "center",
//               boxShadow: darkMode
//                 ? "0 15px 40px rgba(0,0,0,0.5)"
//                 : "0 15px 40px rgba(0,0,0,0.15)",
//               transform: "scale(0.8)",
//               opacity: 0,
//               animation: "fadeScaleUp 0.3s forwards",
//             }}
//           >
//             <h2 style={{ marginBottom: 12, fontSize: 22, fontWeight: 700 }}>Confirm Logout</h2>
//             <p style={{ fontSize: 14, opacity: 0.8, marginBottom: 25 }}>
//               Are you sure you want to sign out?
//             </p>

//             <div style={{ display: "flex", gap: 12 }}>
//               <button
//                 onClick={() => setShowLogoutConfirm(false)}
//                 style={{
//                   flex: 1,
//                   padding: "12px 0",
//                   borderRadius: 12,
//                   border: "none",
//                   cursor: "pointer",
//                   background: darkMode ? "#374151" : "#e2e8f0",
//                   fontWeight: 600,
//                   transition: "0.2s",
//                 }}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleLogout}
//                 style={{
//                   flex: 1,
//                   padding: "12px 0",
//                   borderRadius: 12,
//                   border: "none",
//                   cursor: "pointer",
//                   background: "#f59e0b",
//                   color: "#fff",
//                   fontWeight: 600,
//                   transition: "0.2s",
//                 }}
//               >
//                 Logout
//               </button>
//             </div>
//           </div>

//           <style>
//             {`
//               @keyframes fadeIn {
//                 from { opacity: 0; }
//                 to { opacity: 1; }
//               }

//               @keyframes fadeScaleUp {
//                 0% { opacity: 0; transform: scale(0.8); }
//                 60% { opacity: 1; transform: scale(1.05); }
//                 100% { opacity: 1; transform: scale(1); }
//               }

//               button:hover {
//                 transform: scale(1.03);
//               }
//             `}
//           </style>
//         </div>
//       )}
      

//       {/* ================= Content ================= */}
//       <div style={{ padding: "100px 6% 40px 6%" }}>{renderContent()}</div>
//       {/* ================= Footer ================= */}
// <div
//   style={{
//     marginTop: 50,
//     padding: "20px 6%",
//     borderTop: darkMode ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)",
//     textAlign: "center",
//     fontSize: 14,
//     color: darkMode ? "#cbd5e1" : "#475569",
//   }}
// >
//   © 2026 <span style={{ fontWeight: 600, color: "#ff9d00" }}>InvestPro</span>. All rights reserved.
// </div>

//     </div>
    
//   );
// };

// export default Dashboard;
