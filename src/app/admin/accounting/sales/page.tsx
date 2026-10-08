"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type SaleStatus = "Paid" | "Pending" | "Partial" | "Cancelled";

type Sale = {
  id: string;
  invoice: string;
  customer: string;
  phone: string;
  date: string;
  amount: number;
  paid: number;
  due: number;
  method: string;
  status: SaleStatus;
};

const initialSales: Sale[] = [
  {
    id: "SL-1001",
    invoice: "INV-1001",
    customer: "Ali Khan",
    phone: "0300-1234567",
    date: "2026-10-08",
    amount: 4500,
    paid: 4500,
    due: 0,
    method: "COD",
    status: "Paid",
  },
  {
    id: "SL-1002",
    invoice: "INV-1002",
    customer: "Ahmed Traders",
    phone: "0312-7654321",
    date: "2026-10-08",
    amount: 7800,
    paid: 5000,
    due: 2800,
    method: "JazzCash",
    status: "Partial",
  },
  {
    id: "SL-1003",
    invoice: "INV-1003",
    customer: "Sara Malik",
    phone: "0333-2221111",
    date: "2026-10-07",
    amount: 3200,
    paid: 0,
    due: 3200,
    method: "Bank Transfer",
    status: "Pending",
  },
  {
    id: "SL-1004",
    invoice: "INV-1004",
    customer: "Bilal Ahmed",
    phone: "0345-5558899",
    date: "2026-10-06",
    amount: 6500,
    paid: 6500,
    due: 0,
    method: "Easypaisa",
    status: "Paid",
  },
  {
    id: "SL-1005",
    invoice: "INV-1005",
    customer: "Fatima Noor",
    phone: "0301-8887766",
    date: "2026-10-05",
    amount: 2400,
    paid: 0,
    due: 2400,
    method: "COD",
    status: "Pending",
  },
];

const money = (value: number) =>
  `Rs. ${value.toLocaleString("en-PK")}`;

export default function SalesLedgerPage() {
  const [sales, setSales] = useState(initialSales);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const totals = useMemo(() => {
    const totalSales = sales
      .filter((sale) => sale.status !== "Cancelled")
      .reduce((sum, sale) => sum + sale.amount, 0);

    const totalReceived = sales.reduce(
      (sum, sale) => sum + sale.paid,
      0
    );

    const totalDue = sales.reduce(
      (sum, sale) => sum + sale.due,
      0
    );

    const paidOrders = sales.filter(
      (sale) => sale.status === "Paid"
    ).length;

    const pendingOrders = sales.filter(
      (sale) =>
        sale.status === "Pending" ||
        sale.status === "Partial"
    ).length;

    return {
      totalSales,
      totalReceived,
      totalDue,
      paidOrders,
      pendingOrders,
    };
  }, [sales]);

  const filteredSales = sales.filter((sale) => {
    const query = search.toLowerCase();

    const matchesSearch =
      sale.id.toLowerCase().includes(query) ||
      sale.invoice.toLowerCase().includes(query) ||
      sale.customer.toLowerCase().includes(query) ||
      sale.phone.includes(query);

    const matchesStatus =
      statusFilter === "All" || sale.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const markPaid = (id: string) => {
    setSales((current) =>
      current.map((sale) =>
        sale.id === id
          ? {
              ...sale,
              paid: sale.amount,
              due: 0,
              status: "Paid",
            }
          : sale
      )
    );
  };

  const stats = [
    {
      title: "Total Sales",
      value: money(totals.totalSales),
      icon: "💰",
      bg: "#ecfdf5",
    },
    {
      title: "Amount Received",
      value: money(totals.totalReceived),
      icon: "✅",
      bg: "#eff6ff",
    },
    {
      title: "Amount Due",
      value: money(totals.totalDue),
      icon: "⏳",
      bg: "#fff7ed",
    },
    {
      title: "Paid Orders",
      value: totals.paidOrders,
      icon: "🧾",
      bg: "#f5f3ff",
    },
    {
      title: "Pending / Partial",
      value: totals.pendingOrders,
      icon: "⚠️",
      bg: "#fef2f2",
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
          "Inter, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
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
            flexWrap: "wrap",
            marginBottom: "25px",
          }}
        >
          <div>
            <div
              style={{
                color: "#667085",
                fontSize: "13px",
                marginBottom: "7px",
              }}
            >
              Admin / Accounting / Sales Ledger
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: "31px",
                fontWeight: 800,
              }}
            >
              Sales Ledger
            </h1>

            <p
              style={{
                margin: "8px 0 0",
                color: "#667085",
              }}
            >
              Track sales, received payments and outstanding customer
              balances.
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <Link
              href="/admin/accounting"
              style={{
                textDecoration: "none",
                background: "#111827",
                color: "#fff",
                padding: "11px 17px",
                borderRadius: "10px",
                fontWeight: 700,
                fontSize: "14px",
              }}
            >
              ← Accounting
            </Link>

            <Link
              href="/admin/invoices"
              style={{
                textDecoration: "none",
                background: "#fff",
                color: "#111827",
                padding: "11px 17px",
                borderRadius: "10px",
                fontWeight: 700,
                fontSize: "14px",
                border: "1px solid #d9dee7",
              }}
            >
              🧾 Invoices
            </Link>
          </div>
        </div>

        {/* NOTICE */}
        <div
          style={{
            background: "#fff7ed",
            border: "1px solid #fed7aa",
            borderRadius: "14px",
            padding: "15px 18px",
            marginBottom: "22px",
            color: "#9a3412",
            fontSize: "14px",
          }}
        >
          ⚠️ Sales Ledger is currently using demo records. Later it
          will automatically receive sales from confirmed customer
          orders and invoices.
        </div>

        {/* STATS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
            marginBottom: "25px",
          }}
        >
          {stats.map((stat) => (
            <div
              key={stat.title}
              style={{
                background: "#fff",
                border: "1px solid #e8ecf2",
                borderRadius: "16px",
                padding: "20px",
                boxShadow: "0 5px 20px rgba(15,23,42,0.05)",
              }}
            >
              <div
                style={{
                  width: "43px",
                  height: "43px",
                  borderRadius: "12px",
                  background: stat.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "21px",
                  marginBottom: "13px",
                }}
              >
                {stat.icon}
              </div>

              <div
                style={{
                  color: "#667085",
                  fontSize: "13px",
                  marginBottom: "5px",
                }}
              >
                {stat.title}
              </div>

              <div
                style={{
                  fontSize: "22px",
                  fontWeight: 800,
                }}
              >
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* SALES LEDGER */}
        <section
          style={{
            background: "#fff",
            border: "1px solid #e8ecf2",
            borderRadius: "16px",
            padding: "24px",
            boxShadow: "0 5px 20px rgba(15,23,42,0.05)",
          }}
        >
          <div style={{ marginBottom: "20px" }}>
            <h2
              style={{
                margin: 0,
                fontSize: "21px",
              }}
            >
              Sales Transactions
            </h2>

            <p
              style={{
                margin: "7px 0 0",
                color: "#667085",
                fontSize: "14px",
              }}
            >
              Every confirmed sale will eventually appear here.
            </p>
          </div>

          {/* FILTERS */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "minmax(250px, 1fr) 190px",
              gap: "12px",
              marginBottom: "20px",
            }}
          >
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search sale, invoice, customer or phone..."
              style={{
                padding: "12px 14px",
                border: "1px solid #d9dee7",
                borderRadius: "10px",
                fontSize: "14px",
                outline: "none",
              }}
            />

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
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Partial">Partial</option>
              <option value="Cancelled">Cancelled</option>
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
                minWidth: "1050px",
                borderCollapse: "collapse",
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
                    "Sale",
                    "Invoice",
                    "Customer",
                    "Date",
                    "Total",
                    "Received",
                    "Due",
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
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredSales.map((sale) => (
                  <tr key={sale.id}>
                    <td
                      style={{
                        padding: "15px 14px",
                        borderBottom: "1px solid #edf0f4",
                        fontWeight: 800,
                      }}
                    >
                      {sale.id}
                    </td>

                    <td
                      style={{
                        padding: "15px 14px",
                        borderBottom: "1px solid #edf0f4",
                        fontWeight: 700,
                      }}
                    >
                      {sale.invoice}
                    </td>

                    <td
                      style={{
                        padding: "15px 14px",
                        borderBottom: "1px solid #edf0f4",
                      }}
                    >
                      <strong>{sale.customer}</strong>
                      <div
                        style={{
                          fontSize: "11px",
                          color: "#98a2b3",
                          marginTop: "3px",
                        }}
                      >
                        {sale.phone}
                      </div>
                    </td>

                    <td
                      style={{
                        padding: "15px 14px",
                        borderBottom: "1px solid #edf0f4",
                        color: "#667085",
                      }}
                    >
                      {sale.date}
                    </td>

                    <td
                      style={{
                        padding: "15px 14px",
                        borderBottom: "1px solid #edf0f4",
                        fontWeight: 800,
                      }}
                    >
                      {money(sale.amount)}
                    </td>

                    <td
                      style={{
                        padding: "15px 14px",
                        borderBottom: "1px solid #edf0f4",
                        color: "#15803d",
                        fontWeight: 700,
                      }}
                    >
                      {money(sale.paid)}
                    </td>

                    <td
                      style={{
                        padding: "15px 14px",
                        borderBottom: "1px solid #edf0f4",
                        color:
                          sale.due > 0 ? "#dc2626" : "#667085",
                        fontWeight: 700,
                      }}
                    >
                      {money(sale.due)}
                    </td>

                    <td
                      style={{
                        padding: "15px 14px",
                        borderBottom: "1px solid #edf0f4",
                      }}
                    >
                      {sale.method}
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
                            sale.status === "Paid"
                              ? "#dcfce7"
                              : sale.status === "Partial"
                              ? "#fef3c7"
                              : sale.status === "Pending"
                              ? "#ffedd5"
                              : "#fee2e2",
                          color:
                            sale.status === "Paid"
                              ? "#166534"
                              : sale.status === "Partial"
                              ? "#92400e"
                              : sale.status === "Pending"
                              ? "#9a3412"
                              : "#991b1b",
                        }}
                      >
                        {sale.status}
                      </span>
                    </td>

                    <td
                      style={{
                        padding: "15px 14px",
                        borderBottom: "1px solid #edf0f4",
                      }}
                    >
                      {sale.status !== "Paid" &&
                      sale.status !== "Cancelled" ? (
                        <button
                          type="button"
                          onClick={() => markPaid(sale.id)}
                          style={{
                            background: "#111827",
                            color: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            padding: "7px 10px",
                            fontSize: "12px",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          Mark Paid
                        </button>
                      ) : (
                        <span
                          style={{
                            color: "#98a2b3",
                            fontSize: "12px",
                          }}
                        >
                          Recorded
                        </span>
                      )}
                    </td>
                  </tr>
                ))}

                {filteredSales.length === 0 && (
                  <tr>
                    <td
                      colSpan={10}
                      style={{
                        padding: "40px",
                        textAlign: "center",
                        color: "#667085",
                      }}
                    >
                      No sales records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* FUTURE CONNECTION */}
        <section
          style={{
            marginTop: "25px",
            background: "#111827",
            color: "#fff",
            borderRadius: "16px",
            padding: "24px",
          }}
        >
          <h2
            style={{
              margin: "0 0 10px",
              fontSize: "20px",
            }}
          >
            🔗 Future Sales Integration
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "12px",
            }}
          >
            {[
              "Confirmed orders create sales entries",
              "Invoices connect to sales",
              "Verified payments update received amount",
              "Partial payments create outstanding balance",
              "Refunds reverse the relevant financial entry",
              "Sales automatically feed Profit & Loss",
            ].map((item) => (
              <div
                key={item}
                style={{
                  background: "rgba(255,255,255,0.08)",
                  borderRadius: "10px",
                  padding: "13px",
                  fontSize: "13px",
                  lineHeight: 1.5,
                }}
              >
                ✓ {item}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}