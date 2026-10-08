"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type TransactionType = "Sale" | "Expense" | "Refund";

type TransactionStatus = "Completed" | "Pending";

type Transaction = {
  id: string;
  reference: string;
  description: string;
  type: TransactionType;
  amount: number;
  method: string;
  date: string;
  status: TransactionStatus;
};

const initialTransactions: Transaction[] = [
  {
    id: "TX-1001",
    reference: "MM-1001",
    description: "Multani Sohan Halwa Order",
    type: "Sale",
    amount: 4500,
    method: "Cash on Delivery",
    date: "2026-10-08",
    status: "Pending",
  },
  {
    id: "TX-1002",
    reference: "MM-1002",
    description: "Premium Gift Box Order",
    type: "Sale",
    amount: 7800,
    method: "JazzCash",
    date: "2026-10-08",
    status: "Completed",
  },
  {
    id: "TX-1003",
    reference: "PUR-1001",
    description: "Raw Material Purchase",
    type: "Expense",
    amount: 3200,
    method: "Bank Transfer",
    date: "2026-10-07",
    status: "Completed",
  },
  {
    id: "TX-1004",
    reference: "EXP-1001",
    description: "Delivery Fuel Expense",
    type: "Expense",
    amount: 1800,
    method: "Cash",
    date: "2026-10-07",
    status: "Completed",
  },
  {
    id: "TX-1005",
    reference: "MM-0998",
    description: "Customer Order Refund",
    type: "Refund",
    amount: 1500,
    method: "Easypaisa",
    date: "2026-10-06",
    status: "Completed",
  },
  {
    id: "TX-1006",
    reference: "PUR-1002",
    description: "Packaging Material Purchase",
    type: "Expense",
    amount: 2400,
    method: "Bank Transfer",
    date: "2026-10-06",
    status: "Pending",
  },
];

const money = (value: number) =>
  `Rs. ${value.toLocaleString("en-PK")}`;

export default function AccountingDashboard() {
  const [transactions, setTransactions] =
    useState<Transaction[]>(initialTransactions);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const totals = useMemo(() => {
    const sales = transactions
      .filter((item) => item.type === "Sale")
      .reduce((sum, item) => sum + item.amount, 0);

    const expenses = transactions
      .filter((item) => item.type === "Expense")
      .reduce((sum, item) => sum + item.amount, 0);

    const refunds = transactions
      .filter((item) => item.type === "Refund")
      .reduce((sum, item) => sum + item.amount, 0);

    const netRevenue = sales - refunds;
    const estimatedProfit = netRevenue - expenses;

    const pending = transactions.filter(
      (item) => item.status === "Pending"
    ).length;

    return {
      sales,
      expenses,
      refunds,
      netRevenue,
      estimatedProfit,
      pending,
    };
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((item) => {
      const matchesSearch =
        item.id.toLowerCase().includes(search.toLowerCase()) ||
        item.reference.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase()) ||
        item.method.toLowerCase().includes(search.toLowerCase());

      const matchesType =
        typeFilter === "All" || item.type === typeFilter;

      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [transactions, search, typeFilter, statusFilter]);

  const markCompleted = (id: string) => {
    setTransactions((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, status: "Completed" }
          : item
      )
    );
  };

  const statCards = [
    {
      title: "Total Sales",
      value: money(totals.sales),
      icon: "💰",
      note: "Recorded sales",
      bg: "#ecfdf5",
    },
    {
      title: "Expenses",
      value: money(totals.expenses),
      icon: "💸",
      note: "Business expenses",
      bg: "#fff7ed",
    },
    {
      title: "Refunds",
      value: money(totals.refunds),
      icon: "↩️",
      note: "Customer refunds",
      bg: "#fef2f2",
    },
    {
      title: "Net Revenue",
      value: money(totals.netRevenue),
      icon: "📊",
      note: "Sales minus refunds",
      bg: "#eff6ff",
    },
    {
      title: "Estimated Profit",
      value: money(totals.estimatedProfit),
      icon: "📈",
      note: "Before final accounting",
      bg: "#f5f3ff",
    },
    {
      title: "Pending Entries",
      value: totals.pending.toString(),
      icon: "⏳",
      note: "Need attention",
      bg: "#fffbeb",
    },
  ];

 
const operations = [
  {
    title: "Sales Ledger",
    icon: "🛒",
    description: "Track all sales and order revenue.",
    href: "/admin/accounting/sales",
  },
  {
    title: "Expense Ledger",
    icon: "💸",
    description: "Manage business expenses and costs.",
    href: "/admin/accounting/expenses",
  },
  {
    title: "Refunds",
    icon: "↩️",
    description: "Track refunds and financial adjustments.",
    href: "/admin/accounting/refunds",
  },
  {
    title: "Bank & Cash",
    icon: "🏦",
    description: "Monitor cash and bank movements.",
    href: "/admin/accounting/bank-cash",
  },
  {
    title: "Inventory Cost",
    icon: "📦",
    description: "Track product and raw-material costs.",
    href: "/admin/accounting/inventory-cost",
  },
  {
    title: "Profit & Loss",
    icon: "📈",
    description: "Understand business profitability.",
    href: "/admin/accounting/profit-loss",
  },
];
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f6f8fb",
        padding: "28px",
        color: "#172033",
        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
      }}
    >
      <div style={{ maxWidth: "1450px", margin: "0 auto" }}>
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
            marginBottom: "28px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "13px",
                color: "#667085",
                marginBottom: "8px",
              }}
            >
              Admin / Finance / Accounting
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: "32px",
                fontWeight: 800,
              }}
            >
              Accounting Dashboard
            </h1>

            <p
              style={{
                margin: "8px 0 0",
                color: "#667085",
                fontSize: "15px",
              }}
            >
              Manage sales, expenses, refunds, cash flow and business
              profitability.
            </p>
          </div>

          <Link
            href="/admin"
            style={{
              textDecoration: "none",
              background: "#111827",
              color: "#fff",
              padding: "11px 18px",
              borderRadius: "10px",
              fontWeight: 700,
              fontSize: "14px",
            }}
          >
            ← Admin Dashboard
          </Link>
        </div>

        {/* DEMO NOTICE */}
        <div
          style={{
            background: "#fff7ed",
            border: "1px solid #fed7aa",
            borderRadius: "14px",
            padding: "16px 18px",
            marginBottom: "22px",
            display: "flex",
            alignItems: "flex-start",
            gap: "12px",
          }}
        >
          <div style={{ fontSize: "22px" }}>⚠️</div>

          <div>
            <div
              style={{
                fontWeight: 800,
                color: "#9a3412",
                marginBottom: "4px",
              }}
            >
              Accounting data is currently in demo mode
            </div>

            <div
              style={{
                color: "#7c2d12",
                fontSize: "14px",
                lineHeight: 1.6,
              }}
            >
              These figures are sample records. Later the accounting
              system will automatically receive verified orders,
              payments, refunds, purchases, expenses and inventory costs.
            </div>
          </div>
        </div>

        {/* STAT CARDS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
            marginBottom: "28px",
          }}
        >
          {statCards.map((card) => (
            <div
              key={card.title}
              style={{
                background: "#fff",
                borderRadius: "16px",
                padding: "20px",
                boxShadow: "0 5px 20px rgba(15,23,42,0.06)",
                border: "1px solid #e8ecf2",
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: card.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "22px",
                  marginBottom: "15px",
                }}
              >
                {card.icon}
              </div>

              <div
                style={{
                  fontSize: "13px",
                  color: "#667085",
                  marginBottom: "6px",
                }}
              >
                {card.title}
              </div>

              <div
                style={{
                  fontSize: "23px",
                  fontWeight: 800,
                  marginBottom: "5px",
                }}
              >
                {card.value}
              </div>

              <div
                style={{
                  fontSize: "12px",
                  color: "#98a2b3",
                }}
              >
                {card.note}
              </div>
            </div>
          ))}
        </div>

        {/* OVERVIEW */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "18px",
            marginBottom: "28px",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "22px",
              border: "1px solid #e8ecf2",
              boxShadow: "0 5px 20px rgba(15,23,42,0.05)",
            }}
          >
            <h2
              style={{
                margin: "0 0 18px",
                fontSize: "18px",
              }}
            >
              Revenue Overview
            </h2>

            <div style={{ marginBottom: "15px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "7px",
                  fontSize: "13px",
                }}
              >
                <span>Gross Sales</span>
                <strong>{money(totals.sales)}</strong>
              </div>

              <div
                style={{
                  height: "9px",
                  background: "#e5e7eb",
                  borderRadius: "20px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: "82%",
                    height: "100%",
                    background: "#16a34a",
                    borderRadius: "20px",
                  }}
                />
              </div>
            </div>

            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "7px",
                  fontSize: "13px",
                }}
              >
                <span>Refunds</span>
                <strong>{money(totals.refunds)}</strong>
              </div>

              <div
                style={{
                  height: "9px",
                  background: "#e5e7eb",
                  borderRadius: "20px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: "18%",
                    height: "100%",
                    background: "#ef4444",
                    borderRadius: "20px",
                  }}
                />
              </div>
            </div>
          </div>

          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "22px",
              border: "1px solid #e8ecf2",
              boxShadow: "0 5px 20px rgba(15,23,42,0.05)",
            }}
          >
            <h2
              style={{
                margin: "0 0 18px",
                fontSize: "18px",
              }}
            >
              Expense Overview
            </h2>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "12px 0",
                borderBottom: "1px solid #edf0f4",
              }}
            >
              <span>Business Expenses</span>
              <strong>{money(totals.expenses)}</strong>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "12px 0",
              }}
            >
              <span>Estimated Profit</span>
              <strong style={{ color: "#15803d" }}>
                {money(totals.estimatedProfit)}
              </strong>
            </div>
          </div>

          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "22px",
              border: "1px solid #e8ecf2",
              boxShadow: "0 5px 20px rgba(15,23,42,0.05)",
            }}
          >
            <h2
              style={{
                margin: "0 0 18px",
                fontSize: "18px",
              }}
            >
              Financial Health
            </h2>

            <div
              style={{
                fontSize: "30px",
                fontWeight: 800,
                color:
                  totals.estimatedProfit >= 0
                    ? "#15803d"
                    : "#dc2626",
              }}
            >
              {totals.estimatedProfit >= 0
                ? "Positive"
                : "Needs Attention"}
            </div>

            <p
              style={{
                margin: "8px 0 0",
                color: "#667085",
                fontSize: "14px",
                lineHeight: 1.6,
              }}
            >
              Current demo calculation compares net revenue against
              recorded expenses.
            </p>
          </div>
        </div>

        {/* ACCOUNTING OPERATIONS */}
        <section
          style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "24px",
            border: "1px solid #e8ecf2",
            boxShadow: "0 5px 20px rgba(15,23,42,0.05)",
            marginBottom: "28px",
          }}
        >
          <div style={{ marginBottom: "20px" }}>
            <h2
              style={{
                margin: 0,
                fontSize: "21px",
              }}
            >
              Accounting Operations
            </h2>

            <p
              style={{
                margin: "7px 0 0",
                color: "#667085",
                fontSize: "14px",
              }}
            >
              Core financial areas for the Multani Mithas business.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "14px",
            }}
          >
            {operations.map((operation) => (
              <button
                key={operation.title}
                type="button"
                style={{
                  textAlign: "left",
                  background: "#f8fafc",
                  border: "1px solid #e5e7eb",
                  borderRadius: "13px",
                  padding: "17px",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    fontSize: "25px",
                    marginBottom: "10px",
                  }}
                >
                  {operation.icon}
                </div>

                <div
                  style={{
                    fontWeight: 800,
                    marginBottom: "5px",
                  }}
                >
                  {operation.title}
                </div>

                <div
                  style={{
                    color: "#667085",
                    fontSize: "13px",
                    lineHeight: 1.5,
                  }}
                >
                  {operation.description}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* TRANSACTIONS */}
        <section
          style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "24px",
            border: "1px solid #e8ecf2",
            boxShadow: "0 5px 20px rgba(15,23,42,0.05)",
            marginBottom: "28px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "15px",
              flexWrap: "wrap",
              marginBottom: "20px",
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "21px",
                }}
              >
                Financial Transactions
              </h2>

              <p
                style={{
                  margin: "7px 0 0",
                  color: "#667085",
                  fontSize: "14px",
                }}
              >
                Sales, expenses and refunds recorded in the system.
              </p>
            </div>

            <div
              style={{
                padding: "8px 12px",
                borderRadius: "20px",
                background: "#f1f5f9",
                fontSize: "13px",
                fontWeight: 700,
              }}
            >
              {filteredTransactions.length} Records
            </div>
          </div>

          {/* FILTERS */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "minmax(220px, 1fr) 180px 180px",
              gap: "12px",
              marginBottom: "20px",
            }}
          >
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search transaction, order, description..."
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "12px 14px",
                border: "1px solid #d9dee7",
                borderRadius: "10px",
                outline: "none",
                fontSize: "14px",
              }}
            />

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              style={{
                padding: "12px 14px",
                border: "1px solid #d9dee7",
                borderRadius: "10px",
                background: "#fff",
                fontSize: "14px",
              }}
            >
              <option value="All">All Types</option>
              <option value="Sale">Sales</option>
              <option value="Expense">Expenses</option>
              <option value="Refund">Refunds</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: "12px 14px",
                border: "1px solid #d9dee7",
                borderRadius: "10px",
                background: "#fff",
                fontSize: "14px",
              }}
            >
              <option value="All">All Status</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          {/* TABLE */}
          <div
            style={{
              overflowX: "auto",
              border: "1px solid #edf0f4",
              borderRadius: "12px",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: "900px",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "#f8fafc",
                    textAlign: "left",
                  }}
                >
                  {[
                    "Transaction",
                    "Reference",
                    "Description",
                    "Type",
                    "Amount",
                    "Method",
                    "Status",
                    "Action",
                  ].map((heading) => (
                    <th
                      key={heading}
                      style={{
                        padding: "14px",
                        fontSize: "12px",
                        color: "#667085",
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredTransactions.map((item) => (
                  <tr key={item.id}>
                    <td
                      style={{
                        padding: "15px 14px",
                        borderBottom: "1px solid #edf0f4",
                        fontWeight: 800,
                      }}
                    >
                      {item.id}
                      <div
                        style={{
                          fontSize: "11px",
                          color: "#98a2b3",
                          marginTop: "3px",
                        }}
                      >
                        {item.date}
                      </div>
                    </td>

                    <td
                      style={{
                        padding: "15px 14px",
                        borderBottom: "1px solid #edf0f4",
                        fontWeight: 700,
                      }}
                    >
                      {item.reference}
                    </td>

                    <td
                      style={{
                        padding: "15px 14px",
                        borderBottom: "1px solid #edf0f4",
                        color: "#475467",
                      }}
                    >
                      {item.description}
                    </td>

                    <td
                      style={{
                        padding: "15px 14px",
                        borderBottom: "1px solid #edf0f4",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          padding: "5px 9px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: 700,
                          background:
                            item.type === "Sale"
                              ? "#dcfce7"
                              : item.type === "Expense"
                              ? "#ffedd5"
                              : "#fee2e2",
                          color:
                            item.type === "Sale"
                              ? "#166534"
                              : item.type === "Expense"
                              ? "#9a3412"
                              : "#991b1b",
                        }}
                      >
                        {item.type}
                      </span>
                    </td>

                    <td
                      style={{
                        padding: "15px 14px",
                        borderBottom: "1px solid #edf0f4",
                        fontWeight: 800,
                      }}
                    >
                      {money(item.amount)}
                    </td>

                    <td
                      style={{
                        padding: "15px 14px",
                        borderBottom: "1px solid #edf0f4",
                        color: "#475467",
                      }}
                    >
                      {item.method}
                    </td>

                    <td
                      style={{
                        padding: "15px 14px",
                        borderBottom: "1px solid #edf0f4",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          padding: "5px 9px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: 700,
                          background:
                            item.status === "Completed"
                              ? "#dcfce7"
                              : "#fef3c7",
                          color:
                            item.status === "Completed"
                              ? "#166534"
                              : "#92400e",
                        }}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td
                      style={{
                        padding: "15px 14px",
                        borderBottom: "1px solid #edf0f4",
                      }}
                    >
                      {item.status === "Pending" ? (
                        <button
                          type="button"
                          onClick={() => markCompleted(item.id)}
                          style={{
                            border: "none",
                            background: "#111827",
                            color: "#fff",
                            padding: "7px 10px",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontSize: "12px",
                            fontWeight: 700,
                          }}
                        >
                          Complete
                        </button>
                      ) : (
                        <span
                          style={{
                            fontSize: "12px",
                            color: "#98a2b3",
                          }}
                        >
                          Recorded
                        </span>
                      )}
                    </td>
                  </tr>
                ))}

                {filteredTransactions.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      style={{
                        padding: "35px",
                        textAlign: "center",
                        color: "#667085",
                      }}
                    >
                      No accounting transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* FUTURE ARCHITECTURE */}
        <section
          style={{
            background: "#111827",
            color: "#fff",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "20px",
          }}
        >
          <h2
            style={{
              margin: "0 0 10px",
              fontSize: "20px",
            }}
          >
            🔐 Accounting Architecture
          </h2>

          <p
            style={{
              margin: "0 0 18px",
              color: "#cbd5e1",
              fontSize: "14px",
              lineHeight: 1.7,
            }}
          >
            This module is prepared for connection with the rest of the
            Multani Mithas business system.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "12px",
            }}
          >
            {[
              "Orders create sales records",
              "Verified payments update financial records",
              "Invoices connect to sales",
              "Refunds update accounting",
              "Purchases create expense records",
              "Inventory costs affect profit",
              "Delivery expenses affect profit",
              "Reports read accounting data",
            ].map((item) => (
              <div
                key={item}
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "10px",
                  padding: "12px",
                  fontSize: "13px",
                }}
              >
                ✓ {item}
              </div>
            ))}
          </div>
        </section>

        <div
          style={{
            textAlign: "center",
            color: "#98a2b3",
            fontSize: "12px",
            padding: "10px",
          }}
        >
          Multani Mithas • Accounting Management System
        </div>
      </div>
    </main>
  );
}