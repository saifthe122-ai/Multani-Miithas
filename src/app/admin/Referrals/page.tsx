"use client";

import Link from "next/link";
import { useState } from "react";

type Referral = {
  id: string;
  referrer: string;
  referred: string;
  code: string;
  orders: number;
  reward: string;
  status: "Active" | "Pending" | "Completed";
};

const initialReferrals: Referral[] = [
  {
    id: "REF-1001",
    referrer: "Ahmed Khan",
    referred: "Bilal Ahmed",
    code: "AHMED10",
    orders: 2,
    reward: "Rs. 500",
    status: "Completed",
  },
  {
    id: "REF-1002",
    referrer: "Fatima Ali",
    referred: "Sana Malik",
    code: "FATIMA10",
    orders: 1,
    reward: "Rs. 250",
    status: "Pending",
  },
  {
    id: "REF-1003",
    referrer: "Usman Raza",
    referred: "Hamza Shah",
    code: "USMAN10",
    orders: 3,
    reward: "Rs. 750",
    status: "Active",
  },
];

const cardStyle = {
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: 16,
  padding: 20,
  boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
};

export default function ReferralsDashboard() {
  const [referrals, setReferrals] =
    useState<Referral[]>(initialReferrals);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filtered = referrals.filter((item) => {
    const text = search.toLowerCase();

    const matchesSearch =
      item.referrer.toLowerCase().includes(text) ||
      item.referred.toLowerCase().includes(text) ||
      item.code.toLowerCase().includes(text);

    const matchesFilter =
      filter === "All" || item.status === filter;

    return matchesSearch && matchesFilter;
  });

  const completed = referrals.filter(
    (item) => item.status === "Completed"
  ).length;

  const pending = referrals.filter(
    (item) => item.status === "Pending"
  ).length;

  const totalOrders = referrals.reduce(
    (sum, item) => sum + item.orders,
    0
  );

  const totalRewards = referrals.reduce(
    (sum, item) =>
      sum + Number(item.reward.replace(/[^0-9]/g, "")),
    0
  );

  const changeStatus = (
    id: string,
    status: Referral["status"]
  ) => {
    setReferrals((current) =>
      current.map((item) =>
        item.id === id ? { ...item, status } : item
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
            color: "white",
            borderRadius: 20,
            padding: 28,
            marginBottom: 24,
          }}
        >
          <h1 style={{ margin: 0, fontSize: 30 }}>
            Referral Management
          </h1>

          <p style={{ margin: "8px 0 0", opacity: 0.9 }}>
            Track customer referrals, referral codes,
            successful orders and rewards.
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
            ["Total Referrals", referrals.length, "All referrals"],
            ["Completed", completed, "Successful referrals"],
            ["Pending", pending, "Waiting for conversion"],
            ["Referral Orders", totalOrders, "Orders generated"],
            [
              "Rewards",
              `Rs. ${totalRewards.toLocaleString()}`,
              "Recorded rewards",
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
                  fontSize: 27,
                  fontWeight: 800,
                  color: "#111827",
                }}
              >
                {value}
              </div>

              <div
                style={{
                  marginTop: 7,
                  fontSize: 13,
                  color: "#16a34a",
                }}
              >
                {note}
              </div>
            </div>
          ))}
        </section>

        <section style={cardStyle}>
          <h2 style={{ marginTop: 0 }}>
            Referral Operations
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
              "Create Referral Code",
              "Referral Customers",
              "Reward History",
              "Top Referrers",
              "Referral Campaign",
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
          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search referrer, customer or code..."
              style={{
                flex: 1,
                minWidth: 280,
                padding: "13px 15px",
                borderRadius: 10,
                border: "1px solid #d1d5db",
                fontSize: 14,
              }}
            />

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{
                padding: "13px 15px",
                borderRadius: 10,
                border: "1px solid #d1d5db",
                background: "white",
                minWidth: 170,
              }}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </section>

        <section
          style={{
            ...cardStyle,
            marginTop: 24,
          }}
        >
          <h2 style={{ marginTop: 0 }}>
            Referral Records
          </h2>

          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: 900,
              }}
            >
              <thead>
                <tr>
                  {[
                    "Referral",
                    "Referrer",
                    "New Customer",
                    "Code",
                    "Orders",
                    "Reward",
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
                    <td style={{ padding: 14, fontWeight: 700 }}>
                      {item.id}
                    </td>

                    <td style={{ padding: 14 }}>
                      {item.referrer}
                    </td>

                    <td style={{ padding: 14 }}>
                      {item.referred}
                    </td>

                    <td style={{ padding: 14, fontWeight: 700 }}>
                      {item.code}
                    </td>

                    <td style={{ padding: 14 }}>
                      {item.orders}
                    </td>

                    <td style={{ padding: 14 }}>
                      {item.reward}
                    </td>

                    <td style={{ padding: 14 }}>
                      <span
                        style={{
                          padding: "6px 10px",
                          borderRadius: 20,
                          fontSize: 12,
                          fontWeight: 700,
                          background:
                            item.status === "Completed"
                              ? "#dcfce7"
                              : item.status === "Pending"
                              ? "#fef3c7"
                              : "#dbeafe",
                          color:
                            item.status === "Completed"
                              ? "#166534"
                              : item.status === "Pending"
                              ? "#92400e"
                              : "#1d4ed8",
                        }}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td style={{ padding: 14 }}>
                      <select
                        value={item.status}
                        onChange={(e) =>
                          changeStatus(
                            item.id,
                            e.target.value as Referral["status"]
                          )
                        }
                        style={{
                          padding: "8px 10px",
                          borderRadius: 8,
                          border:
                            "1px solid #d1d5db",
                          background: "white",
                        }}
                      >
                        <option value="Active">Active</option>
                        <option value="Pending">Pending</option>
                        <option value="Completed">
                          Completed
                        </option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <p
              style={{
                textAlign: "center",
                color: "#6b7280",
                padding: 30,
              }}
            >
              No referral records found.
            </p>
          )}
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
            Smart Referral Intelligence
          </h2>

          <p>
            • Identify customers who bring the most new
            customers.
          </p>

          <p>
            • Track referral source, referral code and resulting
            orders.
          </p>

          <p>
            • Connect rewards with customer and order history.
          </p>

          <p style={{ marginBottom: 0 }}>
            • Future API/database integration will preserve
            referral activity permanently.
          </p>
        </section>
      </div>
    </main>
  );
}