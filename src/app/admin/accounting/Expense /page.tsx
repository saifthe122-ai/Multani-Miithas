"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Expense = {
id: number;
date: string;
reference: string;
description: string;
category: string;
amount: number;
status: "Paid" | "Pending";
};

const initialExpenses: Expense[] = [
{
id: 1,
date: "2026-10-01",
reference: "EXP-1001",
description: "Shop electricity bill",
category: "Utilities",
amount: 8500,
status: "Paid",
},
{
id: 2,
date: "2026-10-03",
reference: "EXP-1002",
description: "Packaging material",
category: "Packaging",
amount: 4200,
status: "Paid",
},
{
id: 3,
date: "2026-10-05",
reference: "EXP-1003",
description: "Delivery fuel",
category: "Delivery",
amount: 2500,
status: "Pending",
},
{
id: 4,
date: "2026-10-06",
reference: "EXP-1004",
description: "Shop rent",
category: "Rent",
amount: 18000,
status: "Paid",
},
];

const formatPKR = (amount: number) =>
new Intl.NumberFormat("en-PK", {
style: "currency",
currency: "PKR",
maximumFractionDigits: 0,
}).format(amount);

export default function ExpensesPage() {
const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
const [search, setSearch] = useState("");
const [filter, setFilter] = useState("All");
const [message, setMessage] = useState("");

const filteredExpenses = useMemo(() => {
const query = search.trim().toLowerCase();

```
return expenses.filter((expense) => {
  const matchesSearch =
    expense.reference.toLowerCase().includes(query) ||
    expense.description.toLowerCase().includes(query) ||
    expense.category.toLowerCase().includes(query);

  const matchesStatus =
    filter === "All" || expense.status === filter;

  return matchesSearch && matchesStatus;
});
```

}, [expenses, search, filter]);

const totalExpenses = expenses.reduce(
(sum, expense) => sum + expense.amount,
0
);

const paidExpenses = expenses
.filter((expense) => expense.status === "Paid")
.reduce((sum, expense) => sum + expense.amount, 0);

const pendingExpenses = expenses
.filter((expense) => expense.status === "Pending")
.reduce((sum, expense) => sum + expense.amount, 0);

function addExpense() {
const description = window.prompt("Expense ki detail likhein:");
if (!description || !description.trim()) return;

```
const amountInput = window.prompt("Amount PKR mein likhein:");
if (amountInput === null || amountInput.trim() === "") return;

const amount = Number(amountInput);

if (!Number.isFinite(amount) || amount <= 0) {
  setMessage("Ghalat amount. Positive number likhein.");
  return;
}

const newExpense: Expense = {
  id: Date.now(),
  date: new Date().toISOString().slice(0, 10),
  reference: `EXP-${Date.now().toString().slice(-6)}`,
  description: description.trim(),
  category: "Other",
  amount,
  status: "Pending",
};

setExpenses((current) => [newExpense, ...current]);
setMessage("Demo expense list mein add ho gaya hai.");
```

}

function toggleStatus(id: number) {
setExpenses((current) =>
current.map((expense) =>
expense.id === id
? {
...expense,
status: expense.status === "Paid" ? "Pending" : "Paid",
}
: expense
)
);

```
setMessage("Expense status update ho gaya hai.");
```

}

const cardStyle = {
background: "#ffffff",
border: "1px solid #e2e8f0",
borderRadius: 14,
padding: 18,
minWidth: 0,
boxShadow: "0 3px 12px rgba(15,23,42,0.04)",
} as const;

const buttonStyle = {
border: "none",
borderRadius: 9,
padding: "11px 15px",
background: "#7c2d12",
color: "#ffffff",
cursor: "pointer",
fontWeight: 700,
} as const;

return (
<main
style={{
minHeight: "100vh",
background: "#f8fafc",
color: "#172033",
padding: 24,
fontFamily: "Arial, sans-serif",
}}
>
<div style={{ maxWidth: 1200, margin: "0 auto" }}>
<Link
href="/admin/accounting"
style={{
color: "#9a3412",
textDecoration: "none",
fontWeight: 700,
}}
>
← Back to Accounting </Link>

```
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 16,
        margin: "22px 0",
      }}
    >
      <div>
        <h1 style={{ fontSize: 30, margin: "0 0 8px" }}>
          Expense Ledger
        </h1>
        <p style={{ margin: 0, color: "#64748b" }}>
          Business expenses, payment status aur expense records.
        </p>
      </div>

      <button onClick={addExpense} style={buttonStyle}>
        + Add Expense
      </button>
    </header>

    {message && (
      <div
        role="status"
        style={{
          background: "#fff7ed",
          border: "1px solid #fed7aa",
          padding: 12,
          borderRadius: 10,
          marginBottom: 16,
        }}
      >
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
          ✕
        </button>
      </div>
    )}

    <div
      style={{
        background: "#fff7ed",
        border: "1px solid #fed7aa",
        borderRadius: 12,
        padding: 14,
        marginBottom: 20,
        color: "#9a3412",
      }}
    >
      Demo mode: naye records filhaal temporary hain. Page refresh karne
      par reset ho jayenge. Database abhi connected nahi hai.
    </div>

    <section
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
        gap: 14,
        marginBottom: 22,
      }}
    >
      <div style={cardStyle}>
        <p style={{ color: "#64748b", margin: "0 0 10px" }}>
          Total Expenses
        </p>
        <h2 style={{ margin: 0 }}>{formatPKR(totalExpenses)}</h2>
      </div>

      <div style={cardStyle}>
        <p style={{ color: "#64748b", margin: "0 0 10px" }}>
          Paid Expenses
        </p>
        <h2 style={{ margin: 0, color: "#15803d" }}>
          {formatPKR(paidExpenses)}
        </h2>
      </div>

      <div style={cardStyle}>
        <p style={{ color: "#64748b", margin: "0 0 10px" }}>
          Pending Expenses
        </p>
        <h2 style={{ margin: 0, color: "#c2410c" }}>
          {formatPKR(pendingExpenses)}
        </h2>
      </div>

      <div style={cardStyle}>
        <p style={{ color: "#64748b", margin: "0 0 10px" }}>
          Total Records
        </p>
        <h2 style={{ margin: 0 }}>{expenses.length}</h2>
      </div>
    </section>

    <section style={{ ...cardStyle, padding: 0, overflow: "hidden" }}>
      <div
        style={{
          padding: 18,
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search reference, detail, category..."
          aria-label="Search expenses"
          style={{
            flex: "1 1 260px",
            minWidth: 0,
            padding: 11,
            border: "1px solid #cbd5e1",
            borderRadius: 9,
          }}
        />

        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          aria-label="Filter expense status"
          style={{
            padding: 11,
            border: "1px solid #cbd5e1",
            borderRadius: 9,
            background: "#ffffff",
          }}
        >
          <option value="All">All statuses</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
            minWidth: 760,
          }}
        >
          <thead style={{ background: "#f1f5f9" }}>
            <tr>
              {[
                "Date",
                "Reference",
                "Description",
                "Category",
                "Amount",
                "Status",
                "Action",
              ].map((heading) => (
                <th
                  key={heading}
                  style={{
                    padding: 13,
                    fontSize: 13,
                    borderBottom: "1px solid #e2e8f0",
                  }}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredExpenses.map((expense) => (
              <tr key={expense.id}>
                <td style={{ padding: 13, borderBottom: "1px solid #e2e8f0" }}>
                  {expense.date}
                </td>
                <td style={{ padding: 13, borderBottom: "1px solid #e2e8f0" }}>
                  {expense.reference}
                </td>
                <td style={{ padding: 13, borderBottom: "1px solid #e2e8f0" }}>
                  {expense.description}
                </td>
                <td style={{ padding: 13, borderBottom: "1px solid #e2e8f0" }}>
                  {expense.category}
                </td>
                <td
                  style={{
                    padding: 13,
                    borderBottom: "1px solid #e2e8f0",
                    fontWeight: 700,
                  }}
                >
                  {formatPKR(expense.amount)}
                </td>
                <td style={{ padding: 13, borderBottom: "1px solid #e2e8f0" }}>
                  <span
                    style={{
                      display: "inline-block",
                      borderRadius: 20,
                      padding: "5px 9px",
                      background:
                        expense.status === "Paid" ? "#dcfce7" : "#ffedd5",
                      color:
                        expense.status === "Paid" ? "#166534" : "#9a3412",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    {expense.status}
                  </span>
                </td>
                <td style={{ padding: 13, borderBottom: "1px solid #e2e8f0" }}>
                  <button
                    onClick={() => toggleStatus(expense.id)}
                    style={{
                      border: "1px solid #cbd5e1",
                      background: "#ffffff",
                      borderRadius: 8,
                      padding: "7px 10px",
                      cursor: "pointer",
                    }}
                  >
                    Change Status
                  </button>
                </td>
              </tr>
            ))}

            {filteredExpenses.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  style={{
                    padding: 30,
                    textAlign: "center",
                    color: "#64748b",
                  }}
                >
                  Koi matching expense nahi mila.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={{ padding: 14, color: "#64748b", fontSize: 13 }}>
        Showing {filteredExpenses.length} of {expenses.length} records.
      </div>
    </section>

    <nav
      style={{
        display: "flex",
        gap: 10,
        flexWrap: "wrap",
        marginTop: 20,
      }}
    >
      {[
        ["Sales Ledger", "/admin/accounting/sales"],
        ["Refunds", "/admin/accounting/refunds"],
        ["Bank & Cash", "/admin/accounting/bank-cash"],
        ["Inventory Cost", "/admin/accounting/inventory-cost"],
        ["Profit & Loss", "/admin/accounting/profit-loss"],
      ].map(([label, href]) => (
        <Link
          key={href}
          href={href}
          style={{
            ...buttonStyle,
            display: "inline-block",
            textDecoration: "none",
          }}
        >
          {label}
        </Link>
      ))}
    </nav>
  </div>
</main>
```

);
}
