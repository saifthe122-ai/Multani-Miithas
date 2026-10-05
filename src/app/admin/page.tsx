
import Link from "next/link";

const sections = [
  {
    title: "Payment Gateways",
    icon: "💳",
    color: "#2563eb",
    items: ["JazzCash", "Easypaisa", "Raast / Bank Transfer", "International Payments"],
  },
  {
    title: "Delivery & Logistics",
    icon: "🚚",
    color: "#0891b2",
    items: ["Courier Services", "Live Order Tracking", "Delivery Staff", "International Shipping"],
  },
  {
    title: "Social Media",
    icon: "📣",
    color: "#9333ea",
    items: ["Facebook", "Instagram", "YouTube", "TikTok", "WhatsApp", "LinkedIn / X"],
  },
  {
    title: "AI Agents",
    icon: "🤖",
    color: "#d97706",
    items: ["Customer Support Agent", "Order Assistant", "Marketing Assistant", "Business Reports Agent"],
  },
  {
    title: "Website APIs",
    icon: "⚙️",
    color: "#15803d",
    items: [
      "Products API", "Orders API", "Payments API", "Delivery API",
      "Customers API", "Reviews API", "Coupons API", "Feedback API",
      "Newsletter API", "Referrals API", "Social Tracking API",
    ],
  },
];

const cardStyle = {
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: "14px",
  padding: "20px",
  boxShadow: "0 3px 12px rgba(15,23,42,0.04)",
};

export default function IntegrationsPage() {
  return (
    <main style={{
      minHeight: "100vh",
      background: "#f3f6f4",
      color: "#17251d",
      fontFamily: "Arial, sans-serif",
    }}>
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <aside style={{
          width: "235px",
          flexShrink: 0,
          background: "#124c35",
          color: "white",
          padding: "28px 18px",
          boxSizing: "border-box",
        }}>
          <div style={{ fontSize: "24px", fontWeight: 800, marginBottom: "5px" }}>
            Multani Mithas
          </div>
          <div style={{ color: "#b9dbc9", fontSize: "12px", marginBottom: "38px" }}>
            BUSINESS CONTROL CENTER
          </div>

          <div style={{ color: "#a8d0bb", fontSize: "11px", marginBottom: "12px" }}>
            MAIN MENU
          </div>

          {[
            ["▦", "Dashboard", "/admin"],
            ["▣", "Products", "/admin"],
            ["🛍", "Orders", "/admin"],
            ["♙", "Customers", "/admin"],
          ].map(([icon, label, href]) => (
            <Link key={label} href={href} style={{
              display: "flex",
              gap: "12px",
              padding: "13px 12px",
              marginBottom: "5px",
              borderRadius: "9px",
              textDecoration: "none",
              color: "#e0eee6",
              fontSize: "14px",
            }}>
              <span>{icon}</span>{label}
            </Link>
          ))}

          <div style={{ color: "#a8d0bb", fontSize: "11px", margin: "28px 0 12px" }}>
            SYSTEM SETTINGS
          </div>

          <div style={{
            background: "#246749",
            border: "1px solid #438565",
            borderRadius: "9px",
            padding: "13px 12px",
            fontSize: "14px",
            fontWeight: 700,
          }}>
            🔌 API & Integrations
          </div>

          <div style={{
            marginTop: "35px",
            padding: "14px",
            background: "rgba(255,255,255,0.08)",
            borderRadius: "10px",
            fontSize: "12px",
            lineHeight: 1.7,
            color: "#d4e8dc",
          }}>
            <strong>System Status</strong>
            <div style={{ marginTop: "6px" }}>● Testing Mode</div>
            <div>● Live connections: 0</div>
          </div>
        </aside>

        <section style={{
          flex: 1,
          minWidth: 0,
          padding: "28px",
          boxSizing: "border-box",
        }}>
          <header style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            marginBottom: "28px",
          }}>
            <div>
              <div style={{ fontSize: "12px", color: "#688074", marginBottom: "8px" }}>
                ADMIN / SETTINGS / INTEGRATIONS
              </div>
              <h1 style={{ fontSize: "30px", margin: 0, fontWeight: 800 }}>
                API & Integrations
              </h1>
              <p style={{ color: "#6b7d73", fontSize: "14px", marginTop: "8px" }}>
                Manage your business connections from one place.
              </p>
            </div>
            <div style={{
              background: "#ffffff",
              border: "1px solid #dce5df",
              padding: "11px 16px",
              borderRadius: "10px",
              fontSize: "13px",
              fontWeight: 700,
            }}>
              🛡️ Integration Center
            </div>
          </header>

          <div style={{
            ...cardStyle,
            background: "#124c35",
            color: "white",
            padding: "25px",
            marginBottom: "22px",
          }}>
            <div style={{ fontSize: "12px", color: "#b9dbc9", marginBottom: "9px" }}>
              MULTANI MITHAS · SYSTEM OVERVIEW
            </div>
            <h2 style={{ fontSize: "23px", margin: "0 0 9px" }}>
              One place for every connection
            </h2>
            <p style={{ color: "#d5e9dd", fontSize: "14px", lineHeight: 1.7, margin: 0 }}>
              Prepare payment providers, delivery services, marketing tools and AI agents for future integration.
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "16px",
            marginBottom: "28px",
          }}>
            {[
              ["Integration Categories", "05", "All services grouped by purpose", "#2563eb"],
              ["Live Connections", "00", "No providers connected yet", "#d97706"],
              ["Internal API Routes", "11", "Routes prepared for testing", "#15803d"],
            ].map(([title, value, description, color]) => (
              <div key={title} style={cardStyle}>
                <div style={{ color: "#64756b", fontSize: "12px" }}>{title}</div>
                <div style={{ color, fontSize: "32px", fontWeight: 800, margin: "12px 0 7px" }}>
                  {value}
                </div>
                <div style={{ color: "#7a8980", fontSize: "12px" }}>{description}</div>
              </div>
            ))}
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
            gap: "18px",
          }}>
            {sections.map((section) => (
              <div key={section.title} style={cardStyle}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "18px" }}>
                  <div style={{
                    background: `${section.color}15`,
                    borderRadius: "11px",
                    padding: "12px",
                    fontSize: "24px",
                  }}>
                    {section.icon}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: "17px" }}>{section.title}</h3>
                    <div style={{ color: "#819087", fontSize: "12px", marginTop: "4px" }}>
                      {section.items.length} integrations planned
                    </div>
                  </div>
                </div>

                {section.items.map((item) => (
                  <div key={item} style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "8px",
                    borderTop: "1px solid #edf0ee",
                    padding: "12px 0",
                  }}>
                    <span style={{ fontSize: "13px", fontWeight: 600 }}>{item}</span>
                    <span style={{
                      background: "#fff4df",
                      color: "#996515",
                      borderRadius: "20px",
                      padding: "5px 8px",
                      fontSize: "10px",
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                    }}>
                      Not Connected
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div style={{
            ...cardStyle,
            marginTop: "22px",
            borderLeft: "4px solid #d97706",
            fontSize: "13px",
            lineHeight: 1.8,
            color: "#58675e",
          }}>
            <strong style={{ color: "#17251d" }}>Security Notice</strong>
            <p style={{ marginBottom: 0 }}>
              This page is a visual management overview. Real payment processing,
              database storage, courier tracking and AI services require secure
              server-side integration and authorized admin access. Do not enter
              secret API keys on this page.
            </p>
          </div>

          <footer style={{
            textAlign: "center",
            color: "#819087",
            fontSize: "12px",
            padding: "25px 0",
          }}>
            Multani Mithas · Business Management System
          </footer>
        </section>
      </div>
    </main>
  );
}