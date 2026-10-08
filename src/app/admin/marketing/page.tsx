"use client";

export default function MarketingDashboard() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f4f7f6",
        padding: "32px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <a
        href="/admin"
        style={{
          color: "#15803d",
          textDecoration: "none",
          fontWeight: 700,
        }}
      >
        ← Admin Dashboard
      </a>

      <h1
        style={{
          fontSize: "32px",
          margin: "18px 0 8px",
          color: "#17201d",
        }}
      >
        Marketing
      </h1>

      <p style={{ color: "#64748b" }}>
        Manage campaigns, promotions, banners, customer targeting and
        marketing performance.
      </p>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))",
          gap: "16px",
          marginTop: "28px",
        }}
      >
        {[
          ["Active Campaigns", "0"],
          ["Promotions", "0"],
          ["Customers Reached", "0"],
          ["Conversions", "0"],
          ["Campaign Revenue", "Rs. 0"],
        ].map(([title, value]) => (
          <div
            key={title}
            style={{
              background: "#fff",
              padding: "22px",
              borderRadius: "14px",
              boxShadow: "0 5px 18px rgba(15,23,42,.07)",
            }}
          >
            <div style={{ color: "#64748b", fontSize: "14px" }}>
              {title}
            </div>

            <div
              style={{
                fontSize: "26px",
                fontWeight: 800,
                marginTop: "8px",
              }}
            >
              {value}
            </div>
          </div>
        ))}
      </section>

      <section
        style={{
          background: "#fff",
          borderRadius: "14px",
          padding: "24px",
          marginTop: "22px",
          boxShadow: "0 5px 18px rgba(15,23,42,.07)",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Marketing Operations</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))",
            gap: "12px",
          }}
        >
          {[
            "Create Campaign",
            "Promotional Banners",
            "Seasonal Campaigns",
            "Customer Segments",
            "Gift Promotions",
            "Email Marketing",
            "WhatsApp Marketing",
            "Social Campaigns",
            "Campaign History",
            "Conversion Tracking",
          ].map((item) => (
            <button
              key={item}
              style={{
                padding: "15px",
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "10px",
                textAlign: "left",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      <section
        style={{
          marginTop: "22px",
          background: "#eff6ff",
          border: "1px solid #bfdbfe",
          borderRadius: "14px",
          padding: "20px",
        }}
      >
        <h2 style={{ marginTop: 0 }}>AI Marketing Intelligence</h2>

        <p
          style={{
            marginBottom: 0,
            color: "#475569",
            lineHeight: 1.6,
          }}
        >
          Future AI features can identify high-value customers, suggest
          campaign audiences, detect the best-performing promotions, recommend
          suitable products and help predict campaign performance.
        </p>
      </section>
    </main>
  );
}