"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Refund = {
id: number;
date: string;
reference: string;
customer: string;
orderReference: string;
reason: string;
amount: number;
status: "Pending" | "Approved" | "Rejected" | "Refunded";
};

const initialRefunds: Refund[] = [
{
id: 1,
date: "2026-10-02",
reference: "REF-1001",
customer: "Ahmed Ali",
orderReference: "MM-1001",
reason: "Damaged packaging",
amount: 1500,
status: "Pending",
},
{
id: 2,
date: "2026-10-04",
reference: "REF-1002",
customer: "Sara Khan",
orderReference: "MM-1002",
reason: "Incorrect item received",
amount: 2200,
status: "Approved",
},
{
id: 3,
date: "2026-10-06",
reference: "REF-1003",
customer: "Usman Ahmed",
orderReference: "MM-1003",
reason: "Order cancelled",
amount: 800,
status: "Refunded",
},
];

const money = (amount: number) => "PKR " + amount.toLocaleString("en-PK");

const cardStyle = {
background: "#ffffff",
border: "1px solid #e5e7eb",
borderRadius: "12px",
padding: "18px",
} as const;

export default function RefundsPage() {
const [refunds, setRefunds] = useState<Refund[]>(initialRefunds);
const [search, setSearch] = useState("");
const [filter, setFilter] = useState("All");
const [message, setMessage] = useState("");

const filteredRefunds = useMemo(() => {
const query = search.trim().toLowerCase();

```
return refunds.filter((refund) => {
  const matchesSearch = [
    refund.reference,
    refund.customer,
    refund.orderReference,
    refund.reason,
  ].some((value) => value.toLowerCase().includes(query));

  return matchesSearch && (filter === "All" || refund.status === filter);
});
```

}, [refunds, search, filter]);

const totalAmount = refunds.reduce((sum, item) => sum + item.amount, 0);

const pendingAmount = refunds
.filter((item) => item.status === "Pending")
.reduce((sum, item) => sum + item.amount, 0);

const refundedAmount = refunds
.filter((item) => item.status === "Refunded")
.reduce((sum, item) => sum + item.amount, 0);

function addRefund() {
const customer = window.prompt("Customer ka naam likhein:");
if (!customer?.trim()) return;

```
const orderReference = window.prompt("Order reference likhein:");
if (!orderReference?.trim()) return;

const reason = window.prompt("Refund ki wajah likhein:");
if (!reason?.trim()) return;

const amountInput = window.prompt("Refund amount PKR mein likhein:");
if (!amountInput) return;

const amount = Number(amountInput.replace(/,/g, ""));

if (!Number.isFinite(amount) || amount <= 0) {
  window.alert("Valid amount enter karein.");
  return;
}

const refund: Refund = {
  id: Date.now(),
  date: new Date().toISOString().slice(0, 10),
  reference: `REF-${Date.now().toString().slice(-6)}`,
  customer: customer.trim(),
  orderReference: orderReference.trim(),
  reason: reason.trim(),
  amount,
  status: "Pending",
};

setRefunds((current) => [refund, ...current]);
setMessage("Refund request add ho gayi. Demo record hai.");
```

}

function updateStatus(id: number, status: Refund["status"]) {
setRefunds((current) =>
current.map((refund) =>
refund.id === id ? { ...refund, status } : refund
)
);
setMessage("Refund status update ho gaya. Yeh demo change hai.");
}

return (
<main
style={{
minHeight: "100vh",
background: "#f5f7fb",
color: "#172033",
padding: "28px",
fontFamily: "Arial, Helvetica, sans-serif",
}}
>
<div style={{ maxWidth: "1400px", margin: "0 auto" }}>
<Link
href="/admin/accounting"
style={{ color: "#8b2f12", textDecoration: "none", fontWeight: 700 }}
>
← Back to Accounting </Link>

```
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "16px",
        margin: "24px 0",
      }}
    >
      <div>
        <h1 style={{ fontSize: "36px", margin: 0 }}>Refunds Dashboard</h1>
        <p style={{ color: "#64748b" }}>
          Manage customer refund requests and their statuses.
        </p>
      </div>

      <button
        onClick={addRefund}
        style={{
          background: "#8b2f12",
          color: "#fff",
          border: 0,
          borderRadius: "9px",
          padding: "12px 16px",
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        + Add Refund
      </button>
    </header>

    <div
      style={{
        ...cardStyle,
        background: "#fff7ed",
        color: "#9a3412",
        marginBottom: "20px",
      }}
    >
      Demo mode: refund records browser refresh par reset ho sakte hain.
      Abhi database ya payment provider connected nahi hai. Status change
      karna asal payment refund process nahi karta.
    </div>

    {message && (
      <div role="status" style={{ ...cardStyle, marginBottom: "20px" }}>
        {message}
        <button
          onClick={() => setMessage("")}
          style={{
            float: "right",
            border: 0,
            background: "transparent",
            cursor: "pointer",
          }}
          aria-label="Dismiss message"
        >
          X
        </button>
      </div>
    )}

    <section
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "16px",
        marginBottom: "24px",
      }}
    >
      {[
        { title: "Total Refunds", value: money(totalAmount) },
        { title: "Pending Amount", value: money(pendingAmount) },
        { title: "Refunded Amount", value: money(refundedAmount) },
        { title: "Total Requests", value: String(refunds.length) },
      ].map((item) => (
        <div key={item.title} style={cardStyle}>
          <p style={{ color: "#64748b", marginTop: 0 }}>{item.title}</p>
          <h2 style={{ marginBottom: 0, fontSize: "24px" }}>{item.value}</h2>
        </div>
      ))}
    </section>

    <section style={{ ...cardStyle, overflowX: "auto" }}>
      <div
        style={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search customer, order or reference..."
          aria-label="Search refunds"
          style={{
            flex: "1 1 280px",
            padding: "12px",
            border: "1px solid #cbd5e1",
            borderRadius: "8px",
          }}
        />

        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          aria-label="Filter refund status"
          style={{
            padding: "12px",
            border: "1px solid #cbd5e1",
            borderRadius: "8px",
            background: "#fff",
          }}
        >
          <option value="All">All statuses</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
          <option value="Refunded">Refunded</option>
        </select>
      </div>

      <table
        style={{
          width: "100%",
          minWidth: "1000px",
          borderCollapse: "collapse",
          textAlign: "left",
        }}
      >
        <thead>
          <tr style={{ background: "#eef2f7" }}>
            {[
              "Date",
              "Refund Ref",
              "Customer",
              "Order",
              "Reason",
              "Amount",
              "Status",
              "Update Status",
            ].map((heading) => (
              <th
                key={heading}
                style={{
                  padding: "13px 10px",
                  borderBottom: "1px solid #dbe2ea",
                }}
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {filteredRefunds.map((refund) => (
            <tr key={refund.id}>
              {[
                refund.date,
                refund.reference,
                refund.customer,
                refund.orderReference,
                refund.reason,
                money(refund.amount),
              ].map((value, index) => (
                <td
                  key={index}
                  style={{
                    padding: "13px 10px",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  {value}
                </td>
              ))}

              <td style={{ padding: "10px", borderBottom: "1px solid #e5e7eb" }}>
                <span
                  style={{
                    background:
                      refund.status === "Refunded"
                        ? "#dcfce7"
                        : refund.status === "Rejected"
                        ? "#fee2e2"
                        : refund.status === "Approved"
                        ? "#dbeafe"
                        : "#ffedd5",
                    color:
                      refund.status === "Refunded"
                        ? "#166534"
                        : refund.status === "Rejected"
                        ? "#991b1b"
                        : refund.status === "Approved"
                        ? "#1d4ed8"
                        : "#9a3412",
                    padding: "6px 9px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: 700,
                  }}
                >
                  {refund.status}
                </span>
              </td>

              <td style={{ padding: "10px", borderBottom: "1px solid #e5e7eb" }}>
                <select
                  value={refund.status}
                  onChange={(event) =>
                    updateStatus(
                      refund.id,
                      event.target.value as Refund["status"]
                    )
                  }
                  aria-label={`Update ${refund.reference} status`}
                  style={{
                    padding: "8px",
                    border: "1px solid #cbd5e1",
                    borderRadius: "7px",
                    background: "#fff",
                  }}
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Refunded">Refunded</option>
                </select>
              </td>
            </tr>
          ))}

          {filteredRefunds.length === 0 && (
            <tr>
              <td
                colSpan={8}
                style={{ padding: "28px", textAlign: "center" }}
              >
                Koi refund record nahi mila.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <p style={{ color: "#64748b", fontSize: "14px" }}>
        Showing {filteredRefunds.length} of {refunds.length} requests.
      </p>
    </section>

    <p style={{ color: "#64748b", fontSize: "13px", marginTop: "20px" }}>
      Note: Yeh sample data hai. Refunds ko real customers ya payment
      transactions se connect karne ke liye database aur payment
      integration alag se configure karni hogi.
    </p>
  </div>
</main>
```

);
}
