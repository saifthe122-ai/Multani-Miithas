import Link from "next/link";

export default function DeliveryDashboard() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f4f7f5",
        color: "#17251d",
        fontFamily: "Arial, sans-serif",
        padding: "30px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ maxWidth: "1250px", margin: "0 auto" }}>
        <Link
          href="/admin"
          style={{
            color: "#104d36",
            textDecoration: "none",
            fontSize: "13px",
            fontWeight: 700,
          }}
        >
          ← Back to Admin Dashboard
        </Link>

        <div style={{ marginTop: "25px", marginBottom: "25px" }}>
          <div style={{ fontSize: "11px", color: "#718078" }}>
            ADMIN / OPERATIONS / DELIVERY
          </div>

          <h1 style={{ fontSize: "30px", margin: "8px 0", fontWeight: 800 }}>
            Delivery & Location
          </h1>

          <p style={{ color: "#718078", fontSize: "14px" }}>
            Manage customer addresses, delivery orders and location tracking.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
            marginBottom: "22px",
          }}
        >
          {[
            ["Active Deliveries", "0", "#2563eb"],
            ["Pending Orders", "0", "#d97706"],
            ["Delivery Staff", "0", "#15803d"],
            ["Customer Locations", "0", "#9333ea"],
          ].map(([title, value, color]) => (
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
                  fontSize: "30px",
                  fontWeight: 800,
                  color,
                  marginTop: "10px",
                }}
              >
                {value}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            background: "#104d36",
            color: "#fff",
            borderRadius: "15px",
            padding: "23px",
            marginBottom: "22px",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "21px" }}>
            📍 Customer Location & Delivery Tracking
          </h2>

          <p
            style={{
              color: "#d3e7dc",
              fontSize: "13px",
              lineHeight: 1.7,
              marginBottom: 0,
            }}
          >
            Customer delivery addresses and map locations will be connected
            here when the customer address system and mapping service are
            enabled.
          </p>
        </div>

        <div
          style={{
            background: "#fff",
            border: "1px solid #e1e8e3",
            borderRadius: "15px",
            padding: "22px",
            marginBottom: "22px",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "19px" }}>
            🗺️ Delivery Map
          </h2>

          <p style={{ color: "#718078", fontSize: "13px" }}>
            Customer and delivery staff locations will appear on this map.
          </p>

          <div
            style={{
              height: "330px",
              borderRadius: "12px",
              background: "linear-gradient(135deg,#e7f0eb,#d8e6de)",
              border: "1px dashed #9fbaab",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              color: "#557063",
              fontSize: "14px",
              lineHeight: 1.8,
            }}
          >
            📍 MAP AREA
            <br />
            Customer locations + delivery staff tracking
            <br />
            will appear here
          </div>
        </div>

        <div
          style={{
            background: "#fff",
            border: "1px solid #e1e8e3",
            borderRadius: "15px",
            padding: "22px",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "19px" }}>
            Customer Delivery Records
          </h2>

          <div
            style={{
              marginTop: "18px",
              padding: "18px",
              background: "#f6f8f7",
              borderRadius: "10px",
              color: "#718078",
              fontSize: "13px",
              lineHeight: 1.8,
            }}
          >
            No customer delivery records yet.
            <br />
            Future records will include:
            <br />
            Country · Province/State · City · Area · Complete Address · Postal
            Code · Map Location · Order · Delivery Status
          </div>
        </div>
      </div>
    </main>
  );
}