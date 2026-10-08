"use client";

import Link from "next/link";
import { useState } from "react";

type SocialAccount = {
  id: string;
  platform: string;
  username: string;
  followers: string;
  customers: number;
  orders: number;
  status: "Connected" | "Pending";
};

const initialAccounts: SocialAccount[] = [
  {
    id: "SOC-001",
    platform: "Facebook",
    username: "Multani Mithas",
    followers: "12.4K",
    customers: 184,
    orders: 76,
    status: "Connected",
  },
  {
    id: "SOC-002",
    platform: "Instagram",
    username: "@multanimithas",
    followers: "18.7K",
    customers: 246,
    orders: 112,
    status: "Connected",
  },
  {
    id: "SOC-003",
    platform: "WhatsApp",
    username: "Business",
    followers: "—",
    customers: 321,
    orders: 158,
    status: "Connected",
  },
  {
    id: "SOC-004",
    platform: "TikTok",
    username: "@multanimithas",
    followers: "8.2K",
    customers: 94,
    orders: 41,
    status: "Pending",
  },
];

const cardStyle = {
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 16,
  padding: 20,
  boxShadow: "0 6px 20px rgba(0,0,0,.06)",
};

export default function SocialMediaDashboard() {
  const [accounts, setAccounts] =
    useState<SocialAccount[]>(initialAccounts);

  const [search, setSearch] = useState("");

  const connected = accounts.filter(
    (item) => item.status === "Connected"
  ).length;

  const totalCustomers = accounts.reduce(
    (sum, item) => sum + item.customers,
    0
  );

  const totalOrders = accounts.reduce(
    (sum, item) => sum + item.orders,
    0
  );

  const filtered = accounts.filter((item) =>
    item.platform
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const toggleStatus = (id: string) => {
    setAccounts((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              status:
                item.status === "Connected"
                  ? "Pending"
                  : "Connected",
            }
          : item
      )
    );
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f7f9",
        padding: 28,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <Link
          href="/admin"
          style={{
            display: "inline-block",
            marginBottom: 18,
            color: "#166534",
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          ← Back to Admin Dashboard
        </Link>

        <header
          style={{
            background:
              "linear-gradient(135deg,#166534,#15803d)",
            color: "#fff",
            borderRadius: 20,
            padding: 28,
            marginBottom: 24,
          }}
        >
          <h1 style={{ margin: 0, fontSize: 30 }}>
            Social Media Management
          </h1>

          <p style={{ margin: "8px 0 0", opacity: 0.9 }}>
            Track social platforms, customer sources,
            referrals and orders.
          </p>
        </header>

        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(190px,1fr))",
            gap: 16,
            marginBottom: 24,
          }}
        >
          {[
            [
              "Social Accounts",
              accounts.length,
              "Configured platforms",
            ],
            [
              "Connected",
              connected,
              "Active connections",
            ],
            [
              "Social Customers",
              totalCustomers,
              "Customers attributed",
            ],
            [
              "Social Orders",
              totalOrders,
              "Orders attributed",
            ],
          ].map(([title, value, note]) => (
            <div key={title} style={cardStyle}>
              <div
                style={{
                  color: "#6b7280",
                  fontSize: 14,
                  marginBottom: 10,
                }}
              >
                {title}
              </div>

              <div
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: "#111827",
                }}
              >
                {value}
              </div>

              <div
                style={{
                  marginTop: 7,
                  color: "#16a34a",
                  fontSize: 13,
                }}
              >
                {note}
              </div>
            </div>
          ))}
        </section>

        <section style={cardStyle}>
          <h2 style={{ marginTop: 0 }}>
            Social Media Operations
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(190px,1fr))",
              gap: 12,
            }}
          >
            {[
              "Add Social Account",
              "Track Customer Source",
              "Social Campaigns",
              "Referral Sources",
              "Social Orders",
              "Campaign Performance",
            ].map((item) => (
              <button
                key={item}
                style={{
                  padding: "14px 16px",
                  borderRadius: 12,
                  border: "1px solid #d1d5db",
                  background: "#f9fafb",
                  cursor: "pointer",
                  fontWeight: 700,
                  color: "#374151",
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        <section
          style={{
            ...cardStyle,
            marginTop: 24,
          }}
        >
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search social platform..."
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "13px 15px",
              borderRadius: 10,
              border: "1px solid #d1d5db",
              fontSize: 14,
            }}
          />
        </section>

        <section
          style={{
            ...cardStyle,
            marginTop: 24,
          }}
        >
          <h2 style={{ marginTop: 0 }}>
            Social Accounts
          </h2>

          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: 850,
              }}
            >
              <thead>
                <tr>
                  {[
                    "Platform",
                    "Account",
                    "Followers",
                    "Customers",
                    "Orders",
                    "Status",
                    "Action",
                  ].map((heading) => (
                    <th
                      key={heading}
                      style={{
                        textAlign: "left",
                        padding: 14,
                        borderBottom:
                          "2px solid #e5e7eb",
                        color: "#6b7280",
                        fontSize: 13,
                      }}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id}>
                    <td
                      style={{
                        padding: 14,
                        fontWeight: 800,
                      }}
                    >
                      {item.platform}
                    </td>

                    <td style={{ padding: 14 }}>
                      {item.username}
                    </td>

                    <td style={{ padding: 14 }}>
                      {item.followers}
                    </td>

                    <td style={{ padding: 14 }}>
                      {item.customers}
                    </td>

                    <td style={{ padding: 14 }}>
                      {item.orders}
                    </td>

                    <td style={{ padding: 14 }}>
                      <span
                        style={{
                          padding: "6px 10px",
                          borderRadius: 20,
                          fontSize: 12,
                          fontWeight: 700,
                          background:
                            item.status ===
                            "Connected"
                              ? "#dcfce7"
                              : "#fef3c7",
                          color:
                            item.status ===
                            "Connected"
                              ? "#166534"
                              : "#92400e",
                        }}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td style={{ padding: 14 }}>
                      <button
                        onClick={() =>
                          toggleStatus(item.id)
                        }
                        style={{
                          border: "none",
                          background:
                            item.status ===
                            "Connected"
                              ? "#fee2e2"
                              : "#dcfce7",
                          color:
                            item.status ===
                            "Connected"
                              ? "#991b1b"
                              : "#166534",
                          padding: "8px 12px",
                          borderRadius: 8,
                          cursor: "pointer",
                          fontWeight: 700,
                        }}
                      >
                        {item.status ===
                        "Connected"
                          ? "Disconnect"
                          : "Connect"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section
          style={{
            ...cardStyle,
            marginTop: 24,
            background: "#ecfdf5",
            borderColor: "#bbf7d0",
          }}
        >
          <h2 style={{ marginTop: 0 }}>
            Social & Referral Intelligence
          </h2>

          <p>
            • Record where every customer discovered
            Multani Mithas.
          </p>

          <p>
            • Identify Facebook, Instagram, WhatsApp,
            TikTok and other high-performing sources.
          </p>

          <p>
            • Connect social source with customer,
            order and referral history.
          </p>

          <p style={{ marginBottom: 0 }}>
            • Future API integrations can automatically
            update campaign and conversion data.
          </p>
        </section>
      </div>
    </main>
  );
}