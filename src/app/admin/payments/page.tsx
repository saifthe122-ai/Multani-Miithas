"use client";

import Link from "next/link";
import { useState } from "react";

type PaymentMethod = {
  id: string;
  name: string;
  description: string;
  status: "Enabled" | "Disabled";
  type: string;
  instructions: string;
};

type PaymentRecord = {
  id: string;
  orderId: string;
  customer: string;
  amount: number;
  method: string;
  status:
    | "Pending"
    | "Paid"
    | "Failed"
    | "Cancelled"
    | "Refunded"
    | "Partially Refunded";
  transactionId: string;
  date: string;
};

const initialMethods: PaymentMethod[] = [
  {
    id: "cod",
    name: "Cash on Delivery",
    description: "Customer pays when order is delivered.",
    status: "Enabled",
    type: "Manual",
    instructions: "Collect payment at delivery.",
  },
  {
    id: "jazzcash",
    name: "JazzCash",
    description: "Pakistan local digital payment.",
    status: "Disabled",
    type: "Gateway",
    instructions: "Gateway integration required.",
  },
  {
    id: "easypaisa",
    name: "Easypaisa",
    description: "Pakistan local digital payment.",
    status: "Disabled",
    type: "Gateway",
    instructions: "Gateway integration required.",
  },
  {
    id: "raast",
    name: "Raast",
    description: "Pakistan instant payment option.",
    status: "Disabled",
    type: "Manual / Gateway",
    instructions: "Raast ID or Till details will be configured.",
  },
  {
    id: "bank",
    name: "Bank Transfer",
    description: "Customer transfers payment to business bank account.",
    status: "Disabled",
    type: "Manual",
    instructions: "Bank details will be configured.",
  },
  {
    id: "payoneer",
    name: "Payoneer",
    description: "International payment option where eligible.",
    status: "Disabled",
    type: "Gateway",
    instructions: "Provider integration required.",
  },
];

const initialPayments: PaymentRecord[] = [
  {
    id: "PAY-001",
    orderId: "MM-1001",
    customer: "Ahmed Khan",
    amount: 4500,
    method: "Cash on Delivery",
    status: "Pending",
    transactionId: "—",
    date: "Today",
  },
  {
    id: "PAY-002",
    orderId: "MM-1002",
    customer: "Sara Ali",
    amount: 7800,
    method: "JazzCash",
    status: "Paid",
    transactionId: "JC-DEMO-1002",
    date: "Today",
  },
  {
    id: "PAY-003",
    orderId: "MM-1003",
    customer: "Usman Ahmed",
    amount: 12500,
    method: "Bank Transfer",
    status: "Pending",
    transactionId: "BANK-DEMO-1003",
    date: "Yesterday",
  },
];

const cardStyle = {
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: 16,
  padding: 20,
  boxShadow: "0 6px 20px rgba(0,0,0,.06)",
};

export default function PaymentsDashboard() {
  const [methods, setMethods] = useState(initialMethods);
  const [payments, setPayments] = useState(initialPayments);
  const [search, setSearch] = useState("");

  const enabledMethods = methods.filter(
    (item) => item.status === "Enabled"
  ).length;

  const paidPayments = payments.filter(
    (item) => item.status === "Paid"
  ).length;

  const pendingPayments = payments.filter(
    (item) => item.status === "Pending"
  ).length;

  const totalPaid = payments
    .filter((item) => item.status === "Paid")
    .reduce((sum, item) => sum + item.amount, 0);

  const toggleMethod = (id: string) => {
    setMethods((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              status:
                item.status === "Enabled"
                  ? "Disabled"
                  : "Enabled",
            }
          : item
      )
    );
  };

  const filteredPayments = payments.filter((item) => {
    const value = search.toLowerCase();

    return (
      item.orderId.toLowerCase().includes(value) ||
      item.customer.toLowerCase().includes(value) ||
      item.method.toLowerCase().includes(value) ||
      item.status.toLowerCase().includes(value)
    );
  });

  const updatePaymentStatus = (
    id: string,
    status: PaymentRecord["status"]
  ) => {
    setPayments((current) =>
      current.map((item) =>
        item.id === id ? { ...item, status } : item
      )
    );
  };

  const money = (value: number) =>
    `Rs. ${value.toLocaleString("en-PK")}`;

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
          <div style={{ fontSize: 12, opacity: 0.8 }}>
            MULTANI MITHAS / FINANCE
          </div>

          <h1 style={{ margin: "6px 0 0", fontSize: 30 }}>
            Payments Management
          </h1>

          <p style={{ margin: "8px 0 0", opacity: 0.9 }}>
            Manage payment methods, transactions, payment status
            and future gateway integrations.
          </p>
        </header>

        {/* STATS */}
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
              "Payment Methods",
              methods.length,
              "Configured methods",
            ],
            [
              "Enabled Methods",
              enabledMethods,
              "Customer-visible methods",
            ],
            [
              "Paid Transactions",
              paidPayments,
              "Verified paid records",
            ],
            [
              "Pending Payments",
              pendingPayments,
              "Require action",
            ],
            [
              "Paid Amount",
              money(totalPaid),
              "Demo/local data",
            ],
          ].map(([title, value, note]) => (
            <div key={title} style={cardStyle}>
              <div style={{ color: "#6b7280", fontSize: 13 }}>
                {title}
              </div>

              <div
                style={{
                  fontSize: 27,
                  fontWeight: 800,
                  marginTop: 9,
                  color: "#111827",
                }}
              >
                {value}
              </div>

              <div
                style={{
                  marginTop: 7,
                  color: "#16a34a",
                  fontSize: 12,
                }}
              >
                {note}
              </div>
            </div>
          ))}
        </section>

        {/* PAYMENT METHODS */}
        <section style={cardStyle}>
          <h2 style={{ marginTop: 0 }}>
            Customer Payment Methods
          </h2>

          <p style={{ color: "#6b7280" }}>
            Enable only the payment methods that customers should
            see at checkout.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(280px,1fr))",
              gap: 16,
            }}
          >
            {methods.map((method) => (
              <div
                key={method.id}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 14,
                  padding: 18,
                  background:
                    method.status === "Enabled"
                      ? "#f0fdf4"
                      : "#fafafa",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <div>
                    <h3 style={{ margin: 0 }}>
                      {method.name}
                    </h3>

                    <p
                      style={{
                        color: "#6b7280",
                        fontSize: 13,
                      }}
                    >
                      {method.description}
                    </p>
                  </div>

                  <span
                    style={{
                      height: "fit-content",
                      padding: "5px 9px",
                      borderRadius: 20,
                      fontSize: 11,
                      fontWeight: 700,
                      background:
                        method.status === "Enabled"
                          ? "#dcfce7"
                          : "#fee2e2",
                      color:
                        method.status === "Enabled"
                          ? "#166534"
                          : "#991b1b",
                    }}
                  >
                    {method.status}
                  </span>
                </div>

                <div
                  style={{
                    fontSize: 12,
                    color: "#6b7280",
                    marginBottom: 14,
                  }}
                >
                  Type: {method.type}
                </div>

                <button
                  onClick={() => toggleMethod(method.id)}
                  style={{
                    width: "100%",
                    border: "none",
                    borderRadius: 9,
                    padding: "10px 12px",
                    cursor: "pointer",
                    fontWeight: 700,
                    background:
                      method.status === "Enabled"
                        ? "#fee2e2"
                        : "#dcfce7",
                    color:
                      method.status === "Enabled"
                        ? "#991b1b"
                        : "#166534",
                  }}
                >
                  {method.status === "Enabled"
                    ? "Disable Method"
                    : "Enable Method"}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* SEARCH */}
        <section
          style={{
            ...cardStyle,
            marginTop: 24,
          }}
        >
          <h2 style={{ marginTop: 0 }}>
            Payment Transactions
          </h2>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order, customer, method or status..."
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "13px 15px",
              borderRadius: 10,
              border: "1px solid #d1d5db",
              fontSize: 14,
            }}
          />

          <div
            style={{
              overflowX: "auto",
              marginTop: 18,
            }}
          >
            <table
              style={{
                width: "100%",
                minWidth: 950,
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr>
                  {[
                    "Payment ID",
                    "Order",
                    "Customer",
                    "Amount",
                    "Method",
                    "Status",
                    "Transaction ID",
                    "Action",
                  ].map((heading) => (
                    <th
                      key={heading}
                      style={{
                        textAlign: "left",
                        padding: 13,
                        borderBottom:
                          "2px solid #e5e7eb",
                        color: "#6b7280",
                        fontSize: 12,
                      }}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredPayments.map((payment) => (
                  <tr key={payment.id}>
                    <td style={{ padding: 13 }}>
                      <strong>{payment.id}</strong>
                    </td>

                    <td style={{ padding: 13 }}>
                      {payment.orderId}
                    </td>

                    <td style={{ padding: 13 }}>
                      {payment.customer}
                    </td>

                    <td style={{ padding: 13 }}>
                      {money(payment.amount)}
                    </td>

                    <td style={{ padding: 13 }}>
                      {payment.method}
                    </td>

                    <td style={{ padding: 13 }}>
                      <span
                        style={{
                          padding: "6px 9px",
                          borderRadius: 20,
                          fontSize: 11,
                          fontWeight: 700,
                          background:
                            payment.status === "Paid"
                              ? "#dcfce7"
                              : payment.status === "Pending"
                              ? "#fef3c7"
                              : "#fee2e2",
                          color:
                            payment.status === "Paid"
                              ? "#166534"
                              : payment.status === "Pending"
                              ? "#92400e"
                              : "#991b1b",
                        }}
                      >
                        {payment.status}
                      </span>
                    </td>

                    <td style={{ padding: 13 }}>
                      {payment.transactionId}
                    </td>

                    <td style={{ padding: 13 }}>
                      <select
                        value={payment.status}
                        onChange={(e) =>
                          updatePaymentStatus(
                            payment.id,
                            e.target.value as PaymentRecord["status"]
                          )
                        }
                        style={{
                          padding: "8px",
                          borderRadius: 8,
                          border:
                            "1px solid #d1d5db",
                        }}
                      >
                        <option>Pending</option>
                        <option>Paid</option>
                        <option>Failed</option>
                        <option>Cancelled</option>
                        <option>Refunded</option>
                        <option>
                          Partially Refunded
                        </option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* SECURITY */}
        <section
          style={{
            ...cardStyle,
            marginTop: 24,
            background: "#fffbeb",
            borderColor: "#fde68a",
          }}
        >
          <h2 style={{ marginTop: 0 }}>
            🔐 Payment Security Architecture
          </h2>

          <p>
            Payment status must eventually be updated only after
            verified gateway/server confirmation.
          </p>

          <p>
            Gateway secret keys must remain server-side and must
            never be placed in customer-facing browser code.
          </p>

          <p style={{ marginBottom: 0 }}>
            Refunds, cancellations, transaction IDs and gateway
            callbacks will be connected when the actual payment
            providers are integrated.
          </p>
        </section>
      </div>
    </main>
  );
}