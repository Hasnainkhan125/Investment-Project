import React from "react";

const Plans = () => {
  const plans = [
   { title: "VIP 1", investment: "₨10.00", dailyPercent: "5%", duration: "30d", total: "₨15.00", dailyProfit: "₨0.50" },
  { title: "VIP 2", investment: "₨30.00", dailyPercent: "6%", duration: "30d", total: "₨54.00", dailyProfit: "₨1.80" },
  { title: "VIP 3", investment: "₨50.00", dailyPercent: "7%", duration: "40d", total: "₨140.00", dailyProfit: "₨3.50" },
  { title: "VIP 4", investment: "₨100.00", dailyPercent: "8%", duration: "40d", total: "₨320.00", dailyProfit: "₨8.00" },
  { title: "VIP 5", investment: "₨300.00", dailyPercent: "9%", duration: "50d", total: "₨1,350.00", dailyProfit: "₨27.00" },
  { title: "VIP 6", investment: "₨500.00", dailyPercent: "10%", duration: "60d", total: "₨3,000.00", dailyProfit: "₨50.00" },
  { title: "VIP 7", investment: "₨1000.00", dailyPercent: "12%", duration: "60d", total: "₨7,200.00", dailyProfit: "₨120.00" },
  { title: "Golden Plan", investment: "₨2000.00", dailyPercent: "15%", duration: "90d", total: "₨27,000.00", dailyProfit: "₨300.00" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "clamp(15px, 4vw, 40px)",
        animation: "fadeInPage 0.9s ease forwards",
      }}
    >
      {/* Page Heading */}
<div
  style={{
    textAlign: "center",
    marginBottom: "clamp(25px, 6vw, 50px)",
  }}
>
  <h1
    style={{
      fontSize: "clamp(26px, 6vw, 42px)",
      fontFamily: 'sans-serif',
      fontWeight: 800,
      margin: 0,
      letterSpacing: 1,
    }}
  >
    Investment Plans
  </h1>

  <p
    style={{
      marginTop: 12,
      fontSize: "clamp(14px, 3vw, 18px)",
      color: "#94a3b8",
      maxWidth: 600,
      marginLeft: "auto",
      marginRight: "auto",
      lineHeight: 1.6,
    }}
  >
    Select a plan to begin generating daily recurring dividends.
  </p>
</div>
      {/* Animation Styles */}
      <style>
        {`
          @keyframes fadeInPage {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes cardReveal {
            0% {
              opacity: 0;
              transform: translateY(40px) scale(0.95);
            }
            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          .plan-card {
            opacity: 0;
            animation: cardReveal 0.8s cubic-bezier(.22,1,.36,1) forwards;
          }

          .plan-card:hover {
            transform: translateY(-6px);
            transition: 0.3s ease;
          }
        `}
      </style>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "clamp(15px, 9vw, 30px)",
        }}
      >
        
        {plans.map((plan, index) => (
          <div
            key={index}
            className="plan-card"
            style={{
              animationDelay: `${index * 0.15}s`,
              borderRadius: 20,
              overflow: "hidden",
              fontFamily: "sans-serif",
            }}
          >
            {/* HEADER */}
            <div
              style={{
                padding: "14px 18px",
                background: "linear-gradient(135deg, #309cea, #309cea)",

                fontWeight: "bold",
                fontSize: "clamp(14px, 3vw, 18px)",
                textAlign: "center",
              }}
            >
              🎁 {plan.title}
            </div>

            {/* CONTENT */}
            <div
              style={{
                padding: "clamp(18px, 4vw, 25px)",
                textAlign: "center",
              background: "linear-gradient(135deg, #1f1f1f, #1f1f1f)",

              }}
            >
              <h1
                style={{
                  margin: 0,
                  fontSize: "clamp(26px, 6vw, 38px)",
                  fontWeight: 900,
                  fontFamily:'sans-serif',
                  color: "#ffffff"
                }}
              >
                {plan.investment}
              </h1>

              <p style={{  marginTop: 6,color: "#bababa" }}>
                Investment Amount
              </p>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 20,
                  marginBottom: 18,
                  gap: 10,
                }}
              >
                <StatBlock value={plan.dailyPercent} label="Daily" green />
                <StatBlock value={plan.duration} label="Duration" gold/>
                <StatBlock value={plan.total} label="Total" gold />
              </div>

              <p style={{ color: "#7e8a9c" }}>
                Daily Profit:{" "}
                <span style={{ color: "#22c55e", fontWeight: "bold" }}>
                  {plan.dailyProfit}
                </span>
              </p>

              <button
                style={{
                  width: "100%",
                  marginTop: 20,
                  padding: "clamp(10px, 3vw, 14px)",
                  borderRadius: 14,
               background: "linear-gradient(135deg, #4aa2e1, #4aa2e1)",

                  border: "none",
                  fontWeight: "bold",
                  fontSize: "clamp(14px, 3vw, 16px)",
                  cursor: "pointer",
                  color: "#111",
                }}
              >
                Buy Plan
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const StatBlock = ({ value, label, green, gold }) => (
  <div style={{ flex: 1, textAlign: "center" }}>
    <div
      style={{
        fontSize: "clamp(14px, 3.5vw, 20px)",
        fontWeight: "bold",
        color: green ? "#22c55e" : gold ? "#4aa2e1" : "#ffffff",
      }}
    >
      {value}
    </div>
    <div
      style={{
        fontSize: "clamp(11px, 3vw, 14px)",
        color: "#94a3b8",
        marginTop: 4,
      }}
    >
      {label}
    </div>
  </div>
);

export default Plans;