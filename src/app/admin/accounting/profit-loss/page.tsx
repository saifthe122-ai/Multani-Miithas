
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type EntryType = "Income" | "Expense";

type Entry = {
  id: number;
  date: string;
  reference: string;
  description: string;
  category: string;
  type: EntryType;
  amount: number;
};

const initialEntries: Entry[] = [
  {
    id: 1,
    date: "2026-10-01",
    reference: "INC-1001",
    description: "Sweets and bakery sales",
    category: "Sales Revenue",
    type: "Income",
    amount: 85000,
  },
  {
    id: 2,
    date: "2026-10-02",
    reference: "INC-1002",
    description: "Custom cake orders",
    category: "Sales Revenue",
    type: "Income",
    amount: 25000,
  },
  {
    id: 3,
    date: "2026-10-03",
    reference: "EXP-1001",
    description: "Raw materials and ingredients",
    category: "Cost of Goods Sold",
    type: "Expense",
    amount: 35000,
  },
  {
    id: 4,
    date: "2026-10-04",
    reference: "EXP-1002",
    description: "Shop rent",
    category: "Rent",
    type: "Expense",
    amount: 15000,
  },
  {
    id: 5,
    date: "2026-10-05",
    reference: "EXP-1003",
    description: "Staff salaries",
    category: "Salaries",
    type: "Expense",
    amount: 18000,
  },
  {
    id: 6,
    date: "2026-10-06",
    reference: "EXP-1004",
    description: "Electricity and gas",
    category: "Utilities",
    type: "Expense",
    amount: 5000,
  },
  {
    id: 7,
    date: "2026-10-07",
    reference: "EXP-1005",
    description: "Delivery and packaging",
    category: "Delivery & Packaging",
    type: "Expense",
    amount: 4000,
  },
];

const money = (amount: number) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(amount);

const today = "2026-10-09";

export default function ProfitLossPage() {
  const [entries, setEntries] = useState<Entry[]>(initialEntries);
  const [startDate, setStartDate] = useState("2026-10-01");
  const [endDate, setEndDate] = useState(today);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");

  const [date, setDate] = useState(today);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Sales Revenue");
  const [type, setType] = useState<EntryType>("Income");
  const [amount, setAmount] = useState("");

  const filteredEntries = useMemo(() => {
    const query = search.toLowerCase().trim();

    return entries.filter((entry) => {
      const matchesDate = entry.date >= startDate && entry.date <= endDate;
      const matchesSearch =
        entry.description.toLowerCase().includes(query) ||
        entry.reference.toLowerCase().includes(query) ||
        entry.category.toLowerCase().includes(query);
      const matchesType = typeFilter === "All" || entry.type === typeFilter;
      const matchesCategory =
        categoryFilter === "All" || entry.category === categoryFilter;

      return matchesDate && matchesSearch && matchesType && matchesCategory;
    });
  }, [entries, startDate, endDate, search, typeFilter, categoryFilter]);

  const report = useMemo(() => {
    const income = filteredEntries
      .filter((entry) => entry.type === "Income")
      .reduce((sum, entry) => sum + entry.amount, 0);

    const expenses = filteredEntries
      .filter((entry) => entry.type === "Expense")
      .reduce((sum, entry) => sum + entry.amount, 0);

    const costOfGoods = filteredEntries
      .filter(
        (entry) =>
          entry.type === "Expense" &&
          entry.category === "Cost of Goods Sold"
      )
      .reduce((sum, entry) => sum + entry.amount, 0);

    const grossProfit = income - costOfGoods;
    const otherExpenses = expenses - costOfGoods;
    const netProfit = income - expenses;
    const margin = income > 0 ? (netProfit / income) * 100 : 0;

    return {
      income,
      expenses,
      costOfGoods,
      grossProfit,
      otherExpenses,
      netProfit,
      margin,
    };
  }, [filteredEntries]);

  const categories = Array.from(
    new Set(entries.map((entry) => entry.category))
  );

  function openEntryForm(entryType: EntryType) {
    setType(entryType);
    setCategory(entryType === "Income" ? "Sales Revenue" : "Operating Expenses");
    setDescription("");
    setAmount("");
    setDate(today);
    setMessage("");
    setShowForm(true);
  }

  function addEntry(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const numericAmount = Number(amount);

    if (!description.trim()) {
      setMessage("Description enter karein.");
      return;
    }

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setMessage("Amount zero se zyada hona chahiye.");
      return;
    }

    const newEntry: Entry = {
      id: Date.now(),
      date,
      reference: `${type === "Income" ? "INC" : "EXP"}-${Date.now()
        .toString()
        .slice(-6)}`,
      description: description.trim(),
      category,
      type,
      amount: numericAmount,
    };

    setEntries((current) => [newEntry, ...current]);
    setShowForm(false);
    setMessage(`${type} entry add ho gayi. Report update ho gayi.`);
  }

  function deleteEntry(id: number) {
    if (!window.confirm("Kya aap is demo entry ko delete karna chahte hain?")) {
      return;
    }

    setEntries((current) => current.filter((entry) => entry.id !== id));
    setMessage("Entry delete ho gayi.");
  }

  function exportCsv() {
    const header = [
      "Date",
      "Reference",
      "Description",
      "Category",
      "Type",
      "Amount PKR",
    ];

    const rows = filteredEntries.map((entry) => [
      entry.date,
      entry.reference,
      entry.description,
      entry.category,
      entry.type,
      String(entry.amount),
    ]);

    const csv = [header, ...rows]
      .map((row) =>
        row
          .map((value) => `"${value.replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = "multani-mithas-profit-loss.csv";
    anchor.click();

    URL.revokeObjectURL(url);
    setMessage("CSV report export ho gayi.");
  }

  const cardStyle: React.CSSProperties = {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: 14,
    padding: 20,
    boxShadow: "0 3px 12px rgba(15,23,42,0.04)",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    padding: 11,
    border: "1px solid #d1d5db",
    borderRadius: 8,
    background: "#ffffff",
    color: "#111827",
    marginTop: 6,
  };

  const buttonStyle: React.CSSProperties = {
    padding: "10px 14px",
    borderRadius: 8,
    border: "1px solid #d1d5db",
    background: "#ffffff",
    color: "#111827",
    cursor: "pointer",
    fontWeight: 600,
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: 24,
        color: "#111827",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <nav
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            marginBottom: 22,
            fontSize: 14,
          }}
        >
          <Link href="/admin" style={{ color: "#2563eb" }}>
            Admin
          </Link>
          <span>/</span>
          <Link href="/admin/accounting" style={{ color: "#2563eb" }}>
            Accounting
          </Link>
          <span>/ Profit &amp; Loss</span>
        </nav>

        <header
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <div>
            <h1 style={{ fontSize: 30, margin: 0 }}>Profit &amp; Loss</h1>
            <p style={{ color: "#6b7280", marginBottom: 0 }}>
              Review revenue, costs, expenses and estimated net profit.
            </p>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <button
              type="button"
              style={{
                ...buttonStyle,
                background: "#dcfce7",
              }}
              onClick={() => openEntryForm("Income")}
            >
              + Add Income
            </button>
            <button
              type="button"
              style={{
                ...buttonStyle,
                background: "#fee2e2",
              }}
              onClick={() => openEntryForm("Expense")}
            >
              + Add Expense
            </button>
            <button type="button" style={buttonStyle} onClick={exportCsv}>
              Export CSV
            </button>
          </div>
        </header>

        {message && (
          <div
            role="status"
            style={{
              padding: 12,
              background: "#eff6ff",
              color: "#1d4ed8",
              borderRadius: 8,
              marginBottom: 18,
            }}
          >
            {message}
            <button
              type="button"
              onClick={() => setMessage("")}
              style={{
                float: "right",
                border: 0,
                background: "transparent",
                cursor: "pointer",
              }}
              aria-label="Dismiss message"
            >
              ×
            </button>
          </div>
        )}

        {showForm && (
          <section style={{ ...cardStyle, marginBottom: 24 }}>
            <h2 style={{ marginTop: 0 }}>Add {type} Entry</h2>

            <form onSubmit={addEntry}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: 16,
                }}
              >
                <label>
                  Date
                  <input
                    type="date"
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                    required
                    style={inputStyle}
                  />
                </label>

                <label>
                  Entry type
                  <select
                    value={type}
                    onChange={(event) => {
                      const nextType = event.target.value as EntryType;
                      setType(nextType);
                      setCategory(
                        nextType === "Income"
                          ? "Sales Revenue"
                          : "Operating Expenses"
                      );
                    }}
                    style={inputStyle}
                  >
                    <option value="Income">Income</option>
                    <option value="Expense">Expense</option>
                  </select>
                </label>

                <label>
                  Category
                  <select
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    style={inputStyle}
                  >
                    {type === "Income" ? (
                      <>
                        <option value="Sales Revenue">Sales Revenue</option>
                        <option value="Other Income">Other Income</option>
                        <option value="Service Income">Service Income</option>
                      </>
                    ) : (
                      <>
                        <option value="Cost of Goods Sold">
                          Cost of Goods Sold
                        </option>
                        <option value="Operating Expenses">
                          Operating Expenses
                        </option>
                        <option value="Rent">Rent</option>
                        <option value="Salaries">Salaries</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Delivery & Packaging">
                          Delivery &amp; Packaging
                        </option>
                        <option value="Marketing">Marketing</option>
                        <option value="Other Expenses">Other Expenses</option>
                      </>
                    )}
                  </select>
                </label>

                <label>
                  Amount (PKR)
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    required
                    style={inputStyle}
                  />
                </label>

                <label style={{ gridColumn: "1 / -1" }}>
                  Description
                  <input
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Enter income or expense details"
                    required
                    style={inputStyle}
                  />
                </label>
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 10,
                  marginTop: 18,
                }}
              >
                <button
                  type="submit"
                  style={{
                    ...buttonStyle,
                    background: "#1d4ed8",
                    color: "#ffffff",
                    borderColor: "#1d4ed8",
                  }}
                >
                  Save Entry
                </button>
                <button
                  type="button"
                  style={buttonStyle}
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        <section style={{ ...cardStyle, marginBottom: 24 }}>
          <h2 style={{ marginTop: 0 }}>Report Period</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
              gap: 16,
            }}
          >
            <label>
              Start date
              <input
                type="date"
                value={startDate}
                max={endDate}
                onChange={(event) => setStartDate(event.target.value)}
                style={inputStyle}
              />
            </label>
            <label>
              End date
              <input
                type="date"
                value={endDate}
                min={startDate}
                onChange={(event) => setEndDate(event.target.value)}
                style={inputStyle}
              />
            </label>
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <div style={cardStyle}>
            <p style={{ color: "#6b7280", margin: 0 }}>Total Revenue</p>
            <h2 style={{ color: "#15803d", fontSize: 26 }}>
              {money(report.income)}
            </h2>
          </div>
          <div style={cardStyle}>
            <p style={{ color: "#6b7280", margin: 0 }}>Cost of Goods Sold</p>
            <h2 style={{ fontSize: 26 }}>{money(report.costOfGoods)}</h2>
          </div>
          <div style={cardStyle}>
            <p style={{ color: "#6b7280", margin: 0 }}>Gross Profit</p>
            <h2 style={{ color: "#2563eb", fontSize: 26 }}>
              {money(report.grossProfit)}
            </h2>
          </div>
          <div style={cardStyle}>
            <p style={{ color: "#6b7280", margin: 0 }}>Total Expenses</p>
            <h2 style={{ color: "#b91c1c", fontSize: 26 }}>
              {money(report.expenses)}
            </h2>
          </div>
          <div style={cardStyle}>
            <p style={{ color: "#6b7280", margin: 0 }}>Net Profit / Loss</p>
            <h2
              style={{
                color: report.netProfit >= 0 ? "#15803d" : "#b91c1c",
                fontSize: 26,
              }}
            >
              {money(report.netProfit)}
            </h2>
            <span style={{ color: "#6b7280", fontSize: 13 }}>
              Margin: {report.margin.toFixed(1)}%
            </span>
          </div>
        </section>

        <section style={{ ...cardStyle, marginBottom: 24 }}>
          <h2 style={{ marginTop: 0 }}>Profit &amp; Loss Statement</h2>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              {[
                ["Revenue", report.income],
                ["Less: Cost of Goods Sold", -report.costOfGoods],
                ["Gross Profit", report.grossProfit],
                ["Less: Other Expenses", -report.otherExpenses],
                ["Net Profit / (Loss)", report.netProfit],
              ].map(([label, value], index) => (
                <tr key={String(label)}>
                  <td
                    style={{
                      padding: 14,
                      borderBottom: "1px solid #e5e7eb",
                      fontWeight: index === 2 || index === 4 ? 700 : 400,
                    }}
                  >
                    {label}
                  </td>
                  <td
                    style={{
                      padding: 14,
                      textAlign: "right",
                      borderBottom: "1px solid #e5e7eb",
                      fontWeight: index === 2 || index === 4 ? 700 : 400,
                    }}
                  >
                    {money(Number(value))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section style={cardStyle}>
          <h2 style={{ marginTop: 0 }}>Income &amp; Expense Entries</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 12,
              marginBottom: 18,
            }}
          >
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search entries..."
              aria-label="Search entries"
              style={{ ...inputStyle, marginTop: 0 }}
            />

            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              aria-label="Filter by entry type"
              style={{ ...inputStyle, marginTop: 0 }}
            >
              <option value="All">All Types</option>
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              aria-label="Filter by category"
              style={{ ...inputStyle, marginTop: 0 }}
            >
              <option value="All">All Categories</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                minWidth: 750,
                borderCollapse: "collapse",
                textAlign: "left",
              }}
            >
              <thead>
                <tr style={{ background: "#f9fafb" }}>
                  {[
                    "Date",
                    "Reference",
                    "Description",
                    "Category",
                    "Type",
                    "Amount",
                    "Action",
                  ].map((heading) => (
                    <th
                      key={heading}
                      style={{
                        padding: 12,
                        borderBottom: "1px solid #e5e7eb",
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
                {filteredEntries.map((entry) => (
                  <tr key={entry.id}>
                    <td style={{ padding: 12, borderBottom: "1px solid #e5e7eb" }}>
                      {entry.date}
                    </td>
                    <td style={{ padding: 12, borderBottom: "1px solid #e5e7eb" }}>
                      {entry.reference}
                    </td>
                    <td style={{ padding: 12, borderBottom: "1px solid #e5e7eb" }}>
                      {entry.description}
                    </td>
                    <td style={{ padding: 12, borderBottom: "1px solid #e5e7eb" }}>
                      {entry.category}
                    </td>
                    <td style={{ padding: 12, borderBottom: "1px solid #e5e7eb" }}>
                      {entry.type}
                    </td>
                    <td
                      style={{
                        padding: 12,
                        borderBottom: "1px solid #e5e7eb",
                        fontWeight: 700,
                        color: entry.type === "Income" ? "#15803d" : "#b91c1c",
                      }}
                    >
                      {money(entry.amount)}
                    </td>
                    <td style={{ padding: 12, borderBottom: "1px solid #e5e7eb" }}>
                      <button
                        type="button"
                        style={{ ...buttonStyle, color: "#b91c1c" }}
                        onClick={() => deleteEntry(entry.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredEntries.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      style={{
                        padding: 28,
                        textAlign: "center",
                        color: "#6b7280",
                      }}
                    >
                      Is period mein koi entry nahi mili.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <p style={{ color: "#6b7280", fontSize: 12, marginTop: 18 }}>
          Demo mode: sample entries use ki gayi hain. Data refresh ke baad reset
          ho sakta hai. Accurate financial reporting ke liye tamam sales aur
          expenses ko verify karke permanent database se connect karna zaroori
          hai. Yeh report tax filing ya final accounts ka substitute nahi hai.
        </p>
      </div>
    </main>
  );
}
