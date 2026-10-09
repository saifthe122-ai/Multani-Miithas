```tsx
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
  { id: 1, date: "2026-10-01", reference: "EXP-1001", description: "Shop electricity bill", category: "Utilities", amount: 8500, status: "Paid" },
  { id: 2, date: "2026-10-03", reference: "EXP-1002", description: "Packaging material", category: "Packaging", amount: 4200, status: "Paid" },
  { id: 3, date: "2026-10-05", reference: "EXP-1003", description: "Delivery fuel", category: "Delivery", amount: 2500, status: "Pending" },
  { id: 4, date: "2026-10-06", reference: "EXP-1004", description: "Shop rent", category: "Rent", amount: 18000, status: "Paid" },
];

const money = (amount: number) =>
  "PKR " + amount.toLocaleString("en-PK");

const cardStyle = {
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: "14px",
  padding: "20px",
  boxShadow: "0 3px 12px rgba(15,23,42,0.04)",
} as const;

const buttonStyle = {
  background: "#8b2f12",
  color: "#ffffff",
  border: "none",
  borderRadius: "9px",
  padding: "11px 16px",
  fontWeight: 700,
  cursor: "pointer",
  textDecoration: "none",
  display: "inline-block",
} as const;

export default function ExpenseLedgerPage() {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [message, setMessage] = useState("");

  const filteredExpenses = useMemo(() => {
    const query = search.trim().toLowerCase();

    return expenses.filter((expense) => {
      const matchesSearch = [
        expense.reference,
        expense.description,
        expense.category,
        expense.date,
      ].some((value) => value.toLowerCase().includes(query));

      const matchesStatus =
        statusFilter === "All" || expense.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [expenses, search, statusFilter]);

  const totalExpenses = expenses.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const paidExpenses = expenses
    .filter((item) => item.status === "Paid")
    .reduce((sum, item) => sum + item.amount, 0);

  const pendingExpenses = expenses
    .filter((item) => item.status === "Pending")
    .reduce((sum, item) => sum + item.amount, 0);

  function addExpense() {
    const description = window.prompt("Expense ki detail likhein:");
    if (!description?.trim()) return;

    const amountInput = window.prompt("Amount PKR mein likhein:");
    if (!amountInput) return;

    const amount = Number(amountInput.replace(/,/g, ""));

    if (!Number.isFinite(amount) || amount <= 0) {
      window.alert("Valid amount likhein.");
      return;
    }

    const category =
      window.prompt("Expense category likhein:", "General")?.trim() ||
      "General";

    const newExpense: Expense = {
      id: Date.now(),
      date: new Date().toISOString().slice(0, 10),
      reference: `EXP-${Date.now().toString().slice(-6)}`,
      description: description.trim(),
      category,
      amount,
      status: "Pending",
    };

    setExpenses((current) => [newExpense, ...current]);
    setMessage("Expense add ho gaya. Yeh demo record hai.");
  }

  function toggleStatus(id: number) {
    setExpenses((current) =>
      current.map((expense) =>
        expense.id === id
          ? {
              ...expense,
              status:
                expense.status === "Paid" ? "Pending" : "Paid",
            }
          : expense
      )
    );

    setMessage("Expense status update ho gaya.");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "28px",
        color: "#172033",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <Link
          href="/admin/accounting"
          style={{
            color: "#8b2f12",
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          ← Back to Accounting
        </Link>

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
            <h1 style={{ fontSize: "clamp(28px, 4vw, 38px)", margin: 0 }}>
              Expense Ledger
            </h1>
            <p style={{ color: "#64748b" }}>
              Manage business expenses and payment records.
            </p>
          </div>

          <button onClick={addExpense} style={buttonStyle}>
            + Add Expense
          </button>
        </header>

        <div
          style={{
            padding: "14px 18px",
            background: "#fff3e8",
            border: "1px solid #fed7aa",
            borderRadius: "10px",
            color: "#9a3412",
            marginBottom: "22px",
          }}
        >
          Demo mode: records refresh par reset ho sakte hain. Database
          abhi connected nahi hai.
        </div>

        {message && (
          <div
            role="status"
            style={{ ...cardStyle, marginBottom: "20px", color: "#166534" }}
          >
            {message}
            <button
              onClick={() => setMessage("")}
              aria-label="Dismiss message"
              style={{
                float: "right",
                border: 0,
                background: "transparent",
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          </div>
        )}

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          {[
            {
              title: "Total Expenses",
              amount: money(totalExpenses),
              color: "#172033",
            },
            {
              title: "Paid Expenses",
              amount: money(paidExpenses),
              color: "#15803d",
            },
            {
              title: "Pending Expenses",
              amount: money(pendingExpenses),
              color: "#c2410c",
            },
            {
              title: "Total Records",
              amount: String(expenses.length),
              color: "#1d4ed8",
            },
          ].map((item) => (
            <div key={item.title} style={cardStyle}>
              <p style={{ color: "#64748b" }}>{item.title}</p>
              <h2
                style={{
                  margin: 0,
                  color: item.color,
                  fontSize: "25px",
                }}
              >
                {item.amount}
              </h2>
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
              placeholder="Search expenses..."
              aria-label="Search expenses"
              style={{
                flex: "1 1 280px",
                minWidth: 0,
                padding: "12px 14px",
                border: "1px solid #cbd5e1",
                borderRadius: "9px",
              }}
            />

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filter status"
              style={{
                padding: "12px 14px",
                border: "1px solid #cbd5e1",
                borderRadius: "9px",
                background: "#fff",
              }}
            >
              <option value="All">All statuses</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          <table
            style={{
              width: "100%",
              minWidth: "850px",
              borderCollapse: "collapse",
              textAlign: "left",
            }}
          >
            <thead>
              <tr style={{ background: "#eef2f7" }}>
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
                      padding: "14px 12px",
                      borderBottom: "1px solid #dbe2ea",
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
                  <td style={cellStyle}>{expense.date}</td>
                  <td style={{ ...cellStyle, fontWeight: 700 }}>
                    {expense.reference}
                  </td>
                  <td style={cellStyle}>{expense.description}</td>
                  <td style={cellStyle}>{expense.category}</td>
                  <td style={{ ...cellStyle, fontWeight: 700 }}>
                    {money(expense.amount)}
                  </td>
                  <td style={cellStyle}>
                    <span
                      style={{
                        background:
                          expense.status === "Paid" ? "#dcfce7" : "#ffedd5",
                        color:
                          expense.status === "Paid" ? "#166534" : "#c2410c",
                        padding: "6px 11px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: 700,
                      }}
                    >
                      {expense.status}
                    </span>
                  </td>
                  <td style={cellStyle}>
                    <button
                      onClick={() => toggleStatus(expense.id)}
                      style={{
                        background: "#fff",
                        color: "#172033",
                        border: "1px solid #cbd5e1",
                        borderRadius: "8px",
                        padding: "9px 11px",
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
                      padding: "30px",
                      textAlign: "center",
                      color: "#64748b",
                    }}
                  >
                    Koi expense record nahi mila.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <p style={{ color: "#64748b", fontSize: "14px" }}>
            Showing {filteredExpenses.length} of {expenses.length} records.
          </p>
        </section>

        <nav
          aria-label="Other accounting pages"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "12px",
            marginTop: "28px",
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
              style={{ ...buttonStyle, textAlign: "center" }}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </main>
  );
}

const cellStyle = {
  padding: "14px 12px",
  borderBottom: "1px solid #e5e7eb",
} as const;
```
