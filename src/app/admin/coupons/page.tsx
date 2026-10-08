"use client";

import Link from "next/link";
import { useState } from "react";

type Coupon = {
  id: string;
  code: string;
  discount: string;
  type: "Percentage" | "Fixed";
  usage: number;
  limit: number;
  status: "Active" | "Expired" | "Scheduled";
  expiry: string;
};

const initialCoupons: Coupon[] = [
  {
    id: "CP-1001",
    code: "WELCOME10",
    discount: "10%",
    type: "Percentage",
    usage: 128,
    limit: 500,
    status: "Active",
    expiry: "31 Dec 2026",
  },
  {
    id: "CP-1002",
    code: "EID500",
    discount: "Rs. 500",
    type: "Fixed",
    usage: 74,
    limit: 200,
    status: "Active",
    expiry: "20 Dec 2026",
  },
  {
    id: "CP-1003",
    code: "OLD20",
    discount: "20%",
    type: "Percentage",
    usage: 300,
    limit: 300,
    status: "Expired",
    expiry: "30 Sep 2026",
  },
];

const cardStyle = {
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: 16,
  padding: 20,
  boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
};

export default function CouponsDashboard() {
  const [coupons, setCoupons] =
    useState<Coupon[]>(initialCoupons);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);

  const [newCode, setNewCode] = useState("");
  const [newDiscount, setNewDiscount] = useState("");
  const [newType, setNewType] =
    useState<"Percentage" | "Fixed">("Percentage");

  const filteredCoupons = coupons.filter((coupon) => {
    const matchesSearch =
      coupon.code
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      coupon.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const activeCoupons = coupons.filter(
    (coupon) => coupon.status === "Active"
  ).length;

  const expiredCoupons = coupons.filter(
    (coupon) => coupon.status === "Expired"
  ).length;

  const totalUsage = coupons.reduce(
    (total, coupon) => total + coupon.usage,
    0
  );

  const createCoupon = () => {
    if (!newCode.trim() || !newDiscount.trim()) {
      return;
    }

    const newCoupon: Coupon = {
      id: `CP-${1000 + coupons.length + 1}`,
      code: newCode.toUpperCase(),
      discount:
        newType === "Percentage"
          ? `${newDiscount}%`
          : `Rs. ${newDiscount}`,
      type: newType,
      usage: 0,
      limit: 100,
      status: "Active",
      expiry: "Not set",
    };

    setCoupons((current) => [
      ...current,
      newCoupon,
    ]);

    setNewCode("");
    setNewDiscount("");
    setNewType("Percentage");
    setShowForm(false);
  };

  const toggleCoupon = (id: string) => {
    setCoupons((current) =>
      current.map((coupon) =>
        coupon.id === id
          ? {
              ...coupon,
              status:
                coupon.status === "Active"
                  ? "Expired"
                  : "Active",
            }
          : coupon
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
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
        }}
      >
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

        {/* Header */}
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
          <h1
            style={{
              margin: 0,
              fontSize: 30,
            }}
          >
            Coupons & Discounts
          </h1>

          <p
            style={{
              margin: "8px 0 0",
              opacity: 0.9,
            }}
          >
            Create and manage discount coupons,
            promotional codes and customer offers.
          </p>
        </header>

        {/* Stats */}
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
              "Total Coupons",
              coupons.length,
              "All created coupons",
            ],
            [
              "Active Coupons",
              activeCoupons,
              "Currently available",
            ],
            [
              "Expired",
              expiredCoupons,
              "No longer active",
            ],
            [
              "Total Usage",
              totalUsage,
              "Coupon redemptions",
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
                  fontSize: 13,
                  color: "#16a34a",
                }}
              >
                {note}
              </div>
            </div>
          ))}
        </section>

        {/* Actions */}
        <section style={cardStyle}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 15,
              flexWrap: "wrap",
            }}
          >
            <div>
              <h2 style={{ margin: 0 }}>
                Coupon Management
              </h2>

              <p
                style={{
                  color: "#6b7280",
                  marginBottom: 0,
                }}
              >
                Manage customer discount offers.
              </p>
            </div>

            <button
              onClick={() => setShowForm(true)}
              style={{
                background: "#166534",
                color: "white",
                border: "none",
                borderRadius: 10,
                padding: "13px 18px",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              + Create Coupon
            </button>
          </div>
        </section>

        {/* Search */}
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
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search coupon code..."
              style={{
                flex: 1,
                minWidth: 260,
                padding: "13px 15px",
                borderRadius: 10,
                border:
                  "1px solid #d1d5db",
                fontSize: 14,
              }}
            />

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              style={{
                padding: "13px 15px",
                borderRadius: 10,
                border:
                  "1px solid #d1d5db",
                background: "white",
                minWidth: 170,
              }}
            >
              <option value="All">
                All Statuses
              </option>
              <option value="Active">
                Active
              </option>
              <option value="Expired">
                Expired
              </option>
              <option value="Scheduled">
                Scheduled
              </option>
            </select>
          </div>
        </section>

        {/* Coupon table */}
        <section
          style={{
            ...cardStyle,
            marginTop: 24,
          }}
        >
          <h2 style={{ marginTop: 0 }}>
            Coupon List
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
                    "Code",
                    "Discount",
                    "Type",
                    "Usage",
                    "Status",
                    "Expiry",
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
                {filteredCoupons.map(
                  (coupon) => (
                    <tr key={coupon.id}>
                      <td
                        style={{
                          padding: 14,
                          fontWeight: 800,
                        }}
                      >
                        {coupon.code}
                      </td>

                      <td style={{ padding: 14 }}>
                        {coupon.discount}
                      </td>

                      <td style={{ padding: 14 }}>
                        {coupon.type}
                      </td>

                      <td style={{ padding: 14 }}>
                        {coupon.usage} /{" "}
                        {coupon.limit}
                      </td>

                      <td style={{ padding: 14 }}>
                        <span
                          style={{
                            padding:
                              "6px 10px",
                            borderRadius: 20,
                            fontSize: 12,
                            fontWeight: 700,
                            background:
                              coupon.status ===
                              "Active"
                                ? "#dcfce7"
                                : coupon.status ===
                                  "Expired"
                                ? "#fee2e2"
                                : "#fef3c7",
                            color:
                              coupon.status ===
                              "Active"
                                ? "#166534"
                                : coupon.status ===
                                  "Expired"
                                ? "#991b1b"
                                : "#92400e",
                          }}
                        >
                          {coupon.status}
                        </span>
                      </td>

                      <td style={{ padding: 14 }}>
                        {coupon.expiry}
                      </td>

                      <td style={{ padding: 14 }}>
                        <button
                          onClick={() =>
                            toggleCoupon(
                              coupon.id
                            )
                          }
                          style={{
                            border: "none",
                            background:
                              coupon.status ===
                              "Active"
                                ? "#fee2e2"
                                : "#dcfce7",
                            color:
                              coupon.status ===
                              "Active"
                                ? "#991b1b"
                                : "#166534",
                            padding:
                              "8px 12px",
                            borderRadius: 8,
                            cursor: "pointer",
                            fontWeight: 700,
                          }}
                        >
                          {coupon.status ===
                          "Active"
                            ? "Disable"
                            : "Activate"}
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          {filteredCoupons.length === 0 && (
            <p
              style={{
                textAlign: "center",
                color: "#6b7280",
                padding: 30,
              }}
            >
              No coupons found.
            </p>
          )}
        </section>

        {/* Smart marketing section */}
        <section
          style={{
            ...cardStyle,
            marginTop: 24,
            background: "#ecfdf5",
            borderColor: "#bbf7d0",
          }}
        >
          <h2 style={{ marginTop: 0 }}>
            Smart Coupon Strategy
          </h2>

          <p>
            • Track which coupons generate the most
            orders.
          </p>

          <p>
            • Connect coupon usage with customer
            acquisition and repeat purchases.
          </p>

          <p>
            • Support seasonal campaigns, gift boxes
            and special events.
          </p>

          <p style={{ marginBottom: 0 }}>
            • Future database integration will preserve
            coupon history and redemption records.
          </p>
        </section>

        {/* Create coupon modal */}
        {showForm && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background:
                "rgba(0,0,0,0.55)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
              zIndex: 1000,
            }}
          >
            <div
              style={{
                background: "white",
                width: "100%",
                maxWidth: 500,
                borderRadius: 18,
                padding: 26,
                boxShadow:
                  "0 20px 50px rgba(0,0,0,0.25)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "center",
                }}
              >
                <h2 style={{ margin: 0 }}>
                  Create Coupon
                </h2>

                <button
                  onClick={() =>
                    setShowForm(false)
                  }
                  style={{
                    border: "none",
                    background:
                      "#f3f4f6",
                    borderRadius: 8,
                    padding: "8px 12px",
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              </div>

              <label
                style={{
                  display: "block",
                  marginTop: 20,
                  fontWeight: 700,
                }}
              >
                Coupon Code
              </label>

              <input
                value={newCode}
                onChange={(e) =>
                  setNewCode(
                    e.target.value
                  )
                }
                placeholder="Example: SAVE10"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  marginTop: 8,
                  padding: 12,
                  borderRadius: 9,
                  border:
                    "1px solid #d1d5db",
                }}
              />

              <label
                style={{
                  display: "block",
                  marginTop: 16,
                  fontWeight: 700,
                }}
              >
                Discount Type
              </label>

              <select
                value={newType}
                onChange={(e) =>
                  setNewType(
                    e.target.value as
                      | "Percentage"
                      | "Fixed"
                  )
                }
                style={{
                  width: "100%",
                  marginTop: 8,
                  padding: 12,
                  borderRadius: 9,
                  border:
                    "1px solid #d1d5db",
                  background: "white",
                }}
              >
                <option value="Percentage">
                  Percentage
                </option>
                <option value="Fixed">
                  Fixed Amount
                </option>
              </select>

              <label
                style={{
                  display: "block",
                  marginTop: 16,
                  fontWeight: 700,
                }}
              >
                Discount Value
              </label>

              <input
                type="number"
                value={newDiscount}
                onChange={(e) =>
                  setNewDiscount(
                    e.target.value
                  )
                }
                placeholder={
                  newType === "Percentage"
                    ? "10"
                    : "500"
                }
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  marginTop: 8,
                  padding: 12,
                  borderRadius: 9,
                  border:
                    "1px solid #d1d5db",
                }}
              />

              <button
                onClick={createCoupon}
                style={{
                  width: "100%",
                  marginTop: 22,
                  padding: 14,
                  border: "none",
                  borderRadius: 10,
                  background: "#166534",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: 800,
                }}
              >
                Create Coupon
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}