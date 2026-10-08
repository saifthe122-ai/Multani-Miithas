"use client";

export default function FeedbackComplaintsDashboard() {
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
        Feedback & Complaints
      </h1>

      <p style={{ color: "#64748b" }}>
        Manage customer feedback, complaints, priorities and resolutions.
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
          ["New Complaints", "0"],
          ["In Progress", "0"],
          ["Resolved", "0"],
          ["High Priority", "0"],
          ["Customer Feedback", "0"],
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
                fontSize: "28px",
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
        <h2 style={{ marginTop: 0 }}>Complaint Management</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))",
            gap: "12px",
          }}
        >
          {[
            "New Complaints",
            "Open Complaints",
            "High Priority",
            "In Progress",
            "Resolved",
            "Complaint History",
            "Customer Response",
            "Staff Response",
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
        <h2 style={{ marginTop: 0 }}>Smart Complaint Insights</h2>

        <p
          style={{
            marginBottom: 0,
            color: "#475569",
            lineHeight: 1.6,
          }}
        >
          Future AI features will help identify repeated complaint patterns,
          urgent cases, common product issues, customer sentiment and
          resolution opportunities.
        </p>
      </section>
    </main>
  );
}