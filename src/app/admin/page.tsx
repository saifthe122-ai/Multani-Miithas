"use client";

import Link from "next/link";
import { useState } from "react";

const menuGroups = [
  {
    title: "MAIN",
    items: [
      { icon: "▦", label: "Dashboard", href: "/admin" },
      { icon: "▣", label: "Products", href: "/admin/products" },
      { icon: "🛍", label: "Orders", href: "/admin/orders" },
      { icon: "♙", label: "Customers", href: "/admin/customers" },
    ],
  },
  {
    title: "OPERATIONS",
    items: [
      { icon: "📍", label: "Delivery & Tracking", href: "/admin/delivery" },
      { icon: "💬", label: "Feedback & Complaints", href: "/admin/feedback" },
      { icon: "⭐", label: "Reviews", href: "/admin/reviews" },
    ],
  },
  {
    title: "MARKETING",
    items: [
      { icon: "📣", label: "Marketing", href: "/admin/marketing" },
      { icon: "🎟", label: "Coupons", href: "/admin/coupons" },
      { icon: "🔗", label: "Referrals", href: "/admin/referrals" },
    { icon: "📱", label: "Social Media", href: "/admin/social-media" },
      { icon: "📊", label: "Analytics", href: "/admin/analytics" },
    ],
  },
  {
    title: "FINANCE",
    items: [
      { icon: "💳", label: "Payments", href: "/admin/payments" },
      { icon: "🧾", label: "Accounting", href: "/admin/accounting" },
      { icon: "📈", label: "Reports", href: "/admin/reports" },
    ],
  },
  {
    title: "TEAM",
    items: [
      { icon: "👥", label: "Staff & Permissions", href: "/admin/staff" },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      { icon: "🔌", label: "API & Integrations", href: "/admin/integrations" },
      { icon: "⚙", label: "Settings", href: "/admin/settings" },
    ],
  },
];

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f4f7f5",
        color: "#17251d",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ display: "flex", minHeight: "100vh" }}>
        {/* SIDEBAR */}
        <aside
          style={{
            width: sidebarOpen ? "245px" : "0px",
            overflow: "hidden",
            flexShrink: 0,
            background: "#104d36",
            color: "#fff",
            transition: "width .2s ease",
          }}
        >
          <div style={{ width: "245px", padding: "25px 16px", boxSizing: "border-box" }}>
            <div
              style={{
                fontSize: "23px",
                fontWeight: 800,
                marginBottom: "4px",
              }}
            >
              Multani Mithas
            </div>

            <div
              style={{
                fontSize: "10px",
                color: "#afd1bf",
                letterSpacing: "1px",
                marginBottom: "30px",
              }}
            >
              BUSINESS CONTROL CENTER
            </div>

            {menuGroups.map((group) => (
              <div key={group.title} style={{ marginBottom: "22px" }}>
                <div
                  style={{
                    fontSize: "10px",
                    color: "#9fc7b2",
                    fontWeight: 700,
                    marginBottom: "8px",
                  }}
                >
                  {group.title}
                </div>

                {group.items.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "11px",
                      padding: "10px 11px",
                      marginBottom: "3px",
                      borderRadius: "8px",
                      color: "#e3eee8",
                      textDecoration: "none",
                      fontSize: "13px",
                    }}
                  >
                    <span style={{ width: "20px", textAlign: "center" }}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            ))}

            <div
              style={{
                marginTop: "25px",
                padding: "13px",
                background: "rgba(255,255,255,.08)",
                borderRadius: "10px",
                fontSize: "11px",
                lineHeight: 1.8,
                color: "#d3e6dc",
              }}
            >
              <strong>System Status</strong>
              <div>● API system ready</div>
              <div>● Testing mode</div>
              <div>● Live connections: 0</div>
            </div>
          </div>
        </aside>

        {/* MAIN AREA */}
        <section style={{ flex: 1, minWidth: 0 }}>
          {/* TOP BAR */}
          <header
            style={{
              height: "72px",
              background: "#fff",
              borderBottom: "1px solid #e1e8e3",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 28px",
              boxSizing: "border-box",
            }}
          >
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                border: "1px solid #dce5df",
                background: "#fff",
                borderRadius: "8px",
                padding: "8px 11px",
                cursor: "pointer",
                fontSize: "18px",
              }}
            >
              ☰
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
              <span style={{ fontSize: "13px", color: "#65766d" }}>
                Business Admin
              </span>

              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "#104d36",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                }}
              >
                MM
              </div>
            </div>
          </header>

          {/* CONTENT */}
          <div style={{ padding: "30px" }}>
            <div style={{ marginBottom: "28px" }}>
              <div
                style={{
                  fontSize: "11px",
                  color: "#728279",
                  marginBottom: "7px",
                }}
              >
                MULTANI MITHAS / ADMIN
              </div>

              <h1
                style={{
                  fontSize: "30px",
                  margin: 0,
                  fontWeight: 800,
                }}
              >
                Business Dashboard
              </h1>

              <p
                style={{
                  color: "#718078",
                  fontSize: "14px",
                  marginTop: "8px",
                }}
              >
                Monitor your sweets business from one place.
              </p>
            </div>

            {/* STATS */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "16px",
                marginBottom: "22px",
              }}
            >
              {[
                ["Today's Orders", "0", "No live orders yet", "#2563eb"],
                ["Revenue", "Rs. 0", "Live accounting pending", "#15803d"],
                ["Customers", "0", "Database pending", "#9333ea"],
                ["Delivery", "0", "No active deliveries", "#d97706"],
              ].map(([title, value, detail, color]) => (
                <div
                  key={title}
                  style={{
                    background: "#fff",
                    border: "1px solid #e1e8e3",
                    borderRadius: "13px",
                    padding: "20px",
                    boxShadow: "0 3px 12px rgba(15,23,42,.04)",
                  }}
                >
                  <div style={{ fontSize: "12px", color: "#718078" }}>
                    {title}
                  </div>

                  <div
                    style={{
                      fontSize: "29px",
                      fontWeight: 800,
                      color,
                      margin: "10px 0 6px",
                    }}
                  >
                    {value}
                  </div>

                  <div style={{ fontSize: "11px", color: "#89958f" }}>
                    {detail}
                  </div>
                </div>
              ))}
            </div>

            {/* QUICK ACTIONS */}
            <div
              style={{
                background: "#104d36",
                borderRadius: "15px",
                padding: "24px",
                color: "#fff",
                marginBottom: "22px",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  color: "#b8d8c8",
                  marginBottom: "7px",
                }}
              >
                QUICK ACCESS
              </div>

              <h2 style={{ margin: 0, fontSize: "21px" }}>
                Business Operations
              </h2>

              <p
                style={{
                  color: "#d3e7dc",
                  fontSize: "13px",
                  marginBottom: "18px",
                }}
              >
                Quickly open the most important business areas.
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(160px, 1fr))",
                  gap: "10px",
                }}
              >
                <Link
                  href="/admin/delivery"
                  style={quickButton}
                >
                  📍 Delivery
                </Link>

                <Link
                  href="/admin/integrations"
                  style={quickButton}
                >
                  🔌 Integrations
                </Link>

                <Link
                  href="/admin/orders"
                  style={quickButton}
                >
                  🛍 Orders
                </Link>

                <Link
                  href="/admin/customers"
                  style={quickButton}
                >
                  ♙ Customers
                </Link>
              </div>
            </div>

            {/* LOCATION PREVIEW */}
            <div
              style={{
                background: "#fff",
                border: "1px solid #e1e8e3",
                borderRadius: "15px",
                padding: "22px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "15px",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <h2 style={{ margin: 0, fontSize: "19px" }}>
                    📍 Delivery & Customer Locations
                  </h2>

                  <p
                    style={{
                      margin: "7px 0 0",
                      color: "#78867e",
                      fontSize: "13px",
                    }}
                  >
                    Customer addresses and map-based delivery tracking.
                  </p>
                </div>

                <Link
                  href="/admin/delivery"
                  style={{
                    background: "#104d36",
                    color: "#fff",
                    textDecoration: "none",
                    padding: "10px 15px",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: 700,
                  }}
                >
                  Open Delivery Dashboard →
                </Link>
              </div>

              <div
                style={{
                  marginTop: "18px",
                  height: "150px",
                  borderRadius: "11px",
                  background:
                    "linear-gradient(135deg,#e9f1ed,#dce9e1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#557063",
                  fontSize: "13px",
                  textAlign: "center",
                }}
              >
                📍 Map & customer locations will appear here
                <br />
                after address/location data is connected.
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

const quickButton = {
  background: "rgba(255,255,255,.12)",
  border: "1px solid rgba(255,255,255,.18)",
  color: "#fff",
  textDecoration: "none",
  padding: "12px",
  borderRadius: "8px",
  fontSize: "12px",
  fontWeight: 700,
  textAlign: "center" as const,
};