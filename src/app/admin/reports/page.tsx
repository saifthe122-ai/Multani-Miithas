"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Report = {
  id: number;
  title: string;
  category: string;
  description: string;
  period: string;
  amount: number;
  status: "Ready" | "Demo";
};

const initialReports: Report[] = [
  {
    id: 1,
    title: "Sales Report",
    category: "Sales",
    description: "Sales totals and order revenue.",
    period: "October 2026",
    amount: 245000,
    status: "Demo",
  },
  {
    id: 2,
    title: "Profit & Loss Report",
    category: "Accounting",
    description: "Revenue, expenses and estimated net profit.",
    period: "October 2026",
    amount: 78500,
    status: "Demo",
  },
  {
    id: 3,
    title: "Inventory Valuation",
    category: "Inventory",
    description: "Estimated value of current stock.",
    period: "October 2026",
    amount: 98100,
    status: "Demo",
  },
  {
    id: 4,
    title: "Expense Report",
    category: "Accounting",
    description: "Recorded business expenses.",
    period: "October 2026",
    amount: 166500,
    status: "Demo",
  },
  {
    id: 5,
    title: "Payments Report",
    category: "Payments",
    description: "Payment collections and payment tracking.",
    period: "October 2026",
    amount: 215000,
    status: "Demo",
  },
  {
    id: 6,
    title: "Customer Report",
    category: "Customers",
    description: "Customer records and account activity.",
    period: "October 2026",
    amount: 0,
    status: "Demo",
  },
];

const money = (amount: number) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(amount);

export default function ReportsDashboard() {
  const [reports] = useState<Report[]>(initialReports);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [startDate, setStartDate] = useState("2026-10-01");
  const [endDate, setEndDate] = useState("2026-10-31");
  const [message, setMessage] = useState("");

  const categories = [
    "All",
    "Sales",
    "Accounting",
    "Inventory",
    "Payments",
    "Customers",
  ];

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchesSearch =
        report.title.toLowerCase().includes(search.toLowerCase()) ||
        report.description.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || report.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [reports, search, category]);

  const totalReportValue = reports.reduce(
    (sum, report) => sum + report.amount,
    0
  );

  function exportCSV() {
    const header = [
      "Report",
      "Category",
      "Period",
      "Amount PKR",
      "Status",
      "Description",
    ];

    const rows = filteredReports.map((report) => [
      report.title,
      report.category,
      report.period,
      report.amount,
      report.status,
      report.description,
    ]);

    const csv = [header, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "multani-mithas-reports.csv";
    anchor.click();
    URL.revokeObjectURL(url);
    setMessage("CSV report downloaded.");
  }

  function printReport(report: Report) {
    setSelectedReport(report);
    window.setTimeout(() => window.print(), 100);
  }

  const cardStyle: React.CSSProperties = {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: 20,
    boxShadow: "0 2px 8px rgba(15,23,42,0.04)",
  };

  const buttonStyle: React.CSSProperties = {
    padding: "9px 13px",
    borderRadius: 8,
    border: "1px solid #d1d5db",
    background: "#ffffff",
    color: "#172033",
    cursor: "pointer",
    fontWeight: 600,
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    padding: 10,
    border: "1px solid #d1d5db",
    borderRadius: 8,
    background: "#ffffff",
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: 24,
        color: "#172033",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Link
          href="/admin"
          style={{
            display: "inline-block",
            marginBottom: 18,
            color: "#374151",
            textDecoration: "none",
          }}
        >
          ← Back to Admin Dashboard
        </Link>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
            marginBottom: 24,
          }}
        >
          <div>
            <h1 style={{ fontSize: 30, margin: "0 0 8px" }}>
              Reports Dashboard
            </h1>
            <p style={{ color: "#64748b", margin: 0 }}>
              View, filter, print and export business reports.
            </p>
          </div>

          <button
            onClick={exportCSV}
            style={{
              ...buttonStyle,
              background: "#1d4ed8",
              color: "#ffffff",
              borderColor: "#1d4ed8",
            }}
          >
            Export Reports CSV
          </button>
        </div>

        {message && (
          <div
            role="status"
            style={{
              background: "#dcfce7",
              color: "#166534",
              padding: 12,
              borderRadius: 8,
              marginBottom: 18,
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
            >
              ×
            </button>
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
            gap: 16,
            marginBottom: 22,
          }}
        >
          <section style={cardStyle}>
            <p style={{ color: "#64748b", marginTop: 0 }}>Available Reports</p>
            <h2 style={{ fontSize: 30, margin: "8px 0" }}>
              {reports.length}
            </h2>
            <p style={{ color: "#64748b", fontSize: 13, marginBottom: 0 }}>
              Sales, accounting, inventory and more
            </p>
          </section>

          <section style={cardStyle}>
            <p style={{ color: "#64748b", marginTop: 0 }}>
              Combined Demo Values
            </p>
            <h2 style={{ fontSize: 30, margin: "8px 0" }}>
              {money(totalReportValue)}
            </h2>
            <p style={{ color: "#64748b", fontSize: 13, marginBottom: 0 }}>
              Sample figures, not verified live totals
            </p>
          </section>

          <section style={cardStyle}>
            <p style={{ color: "#64748b", marginTop: 0 }}>Report Categories</p>
            <h2 style={{ fontSize: 30, margin: "8px 0" }}>
              {categories.length - 1}
            </h2>
            <p style={{ color: "#64748b", fontSize: 13, marginBottom: 0 }}>
              Filter reports by business area
            </p>
          </section>
        </div>

        <section style={{ ...cardStyle, marginBottom: 22 }}>
          <h2 style={{ marginTop: 0 }}>Report Filters</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
              gap: 14,
            }}
          >
            <label>
              Search Reports
              <input
                style={{ ...inputStyle, marginTop: 6 }}
                placeholder="Search report name..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>

            <label>
              Category
              <select
                style={{ ...inputStyle, marginTop: 6 }}
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Start Date
              <input
                style={{ ...inputStyle, marginTop: 6 }}
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
              />
            </label>

            <label>
              End Date
              <input
                style={{ ...inputStyle, marginTop: 6 }}
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
              />
            </label>
          </div>

          <p style={{ color: "#64748b", fontSize: 12, marginBottom: 0 }}>
            Selected period: {startDate || "No start date"} to{" "}
            {endDate || "No end date"}. Date filters are for display only in
            this demo; live transaction data is not connected.
          </p>
        </section>

        <section style={cardStyle}>
          <h2 style={{ marginTop: 0 }}>Business Reports</h2>

          <div style={{ display: "grid", gap: 14 }}>
            {filteredReports.map((report) => (
              <article
                key={report.id}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 10,
                  padding: 16,
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 16,
                }}
              >
                <div style={{ flex: "1 1 260px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 8,
                    }}
                  >
                    <h3 style={{ margin: "0 0 7px" }}>{report.title}</h3>
                    <span
                      style={{
                        fontSize: 11,
                        padding: "4px 8px",
                        borderRadius: 20,
                        background: "#eff6ff",
                        color: "#1d4ed8",
                        fontWeight: 700,
                      }}
                    >
                      {report.category}
                    </span>
                  </div>

                  <p style={{ margin: "0 0 7px", color: "#64748b" }}>
                    {report.description}
                  </p>

                  <p
                    style={{
                      margin: 0,
                      fontSize: 12,
                      color: "#64748b",
                    }}
                  >
                    Period: {report.period} · Status: {report.status}
                  </p>
                </div>

                <div style={{ minWidth: 140 }}>
                  <p style={{ color: "#64748b", margin: "0 0 5px" }}>
                    Sample Amount
                  </p>
                  <strong style={{ fontSize: 19 }}>
                    {money(report.amount)}
                  </strong>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  <button
                    style={buttonStyle}
                    onClick={() => setSelectedReport(report)}
                  >
                    View
                  </button>
                  <button
                    style={buttonStyle}
                    onClick={() => printReport(report)}
                  >
                    Print
                  </button>
                </div>
              </article>
            ))}

            {filteredReports.length === 0 && (
              <p style={{ color: "#64748b", textAlign: "center", padding: 20 }}>
                No reports match your search or category.
              </p>
            )}
          </div>
        </section>

        {selectedReport && (
          <section
            style={{
              ...cardStyle,
              marginTop: 22,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <h2 style={{ marginTop: 0 }}>{selectedReport.title}</h2>
              <button
                style={buttonStyle}
                onClick={() => setSelectedReport(null)}
              >
                Close Report
              </button>
            </div>

            <p>{selectedReport.description}</p>
            <p>
              <strong>Category:</strong> {selectedReport.category}
            </p>
            <p>
              <strong>Period:</strong> {selectedReport.period}
            </p>
            <p>
              <strong>Sample amount:</strong> {money(selectedReport.amount)}
            </p>
            <p>
              <strong>Status:</strong> {selectedReport.status}
            </p>
            <p style={{ color: "#64748b", fontSize: 13 }}>
              This is sample report information. Connect your database and
              accounting records before using these figures for business
              decisions.
            </p>
            <button
              style={{
                ...buttonStyle,
                background: "#1d4ed8",
                color: "#ffffff",
                borderColor: "#1d4ed8",
              }}
              onClick={() => window.print()}
            >
              Print This Report
            </button>
          </section>
        )}

        <p style={{ color: "#64748b", fontSize: 12, marginTop: 18 }}>
          Demo dashboard: report values are sample data. They do not update
          automatically from orders, payments or accounting transactions.
        </p>
      </div>
    </main>
  );
}
