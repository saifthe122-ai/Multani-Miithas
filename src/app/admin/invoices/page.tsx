"use client";

import Link from "next/link";
import { useState } from "react";

type Invoice = {
  id: string;
  orderId: string;
  date: string;
  customer: string;
  phone: string;
  amount: number;
  payment: string;
  status: "Paid" | "Unpaid" | "Refunded" | "Cancelled";
  fbrStatus: "Not Submitted" | "Ready";
};

const initialInvoices: Invoice[] = [
  {
    id: "INV-1001",
    orderId: "MM-1001",
    date: "Today",
    customer: "Ahmed Khan",
    phone: "0300-1234567",
    amount: 4500,
    payment: "COD",
    status: "Unpaid",
    fbrStatus: "Not Submitted",
  },
  {
    id: "INV-1002",
    orderId: "MM-1002",
    date: "Today",
    customer: "Sara Ahmed",
    phone: "0312-7654321",
    amount: 7800,
    payment: "JazzCash",
    status: "Paid",
    fbrStatus: "Not Submitted",
  },
  {
    id: "INV-1003",
    orderId: "MM-1003",
    date: "Yesterday",
    customer: "Usman Ali",
    phone: "0333-9876543",
    amount: 6200,
    payment: "Bank Transfer",
    status: "Paid",
    fbrStatus: "Not Submitted",
  },
  {
    id: "INV-1004",
    orderId: "MM-1004",
    date: "Yesterday",
    customer: "Ayesha Malik",
    phone: "0345-5551234",
    amount: 3200,
    payment: "Easypaisa",
    status: "Refunded",
    fbrStatus: "Not Submitted",
  },
];

const cardStyle = {
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: 16,
  padding: 20,
  boxShadow: "0 6px 20px rgba(0,0,0,.06)",
};

export default function InvoicesDashboard() {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<Invoice | null>(null);

  const money = (amount: number) =>
    `Rs. ${amount.toLocaleString("en-PK")}`;

  const paid = invoices.filter((x) => x.status === "Paid").length;
  const unpaid = invoices.filter((x) => x.status === "Unpaid").length;
  const refunded = invoices.filter((x) => x.status === "Refunded").length;

  const totalValue = invoices.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const filteredInvoices = invoices.filter((item) => {
    const q = search.toLowerCase();

    const matchesSearch =
      item.id.toLowerCase().includes(q) ||
      item.orderId.toLowerCase().includes(q) ||
      item.customer.toLowerCase().includes(q) ||
      item.phone.toLowerCase().includes(q);

    const matchesFilter =
      filter === "All" || item.status === filter;

    return matchesSearch && matchesFilter;
  });

  const markPaid = (id: string) => {
    setInvoices((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, status: "Paid" }
          : item
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
      <div style={{ maxWidth: 1450, margin: "0 auto" }}>

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

        {/* HEADER */}

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
          <div
            style={{
              fontSize: 12,
              opacity: 0.8,
              letterSpacing: 1,
            }}
          >
            MULTANI MITHAS / FINANCE
          </div>

          <h1
            style={{
              margin: "6px 0 0",
              fontSize: 30,
            }}
          >
            Invoice Management
          </h1>

          <p
            style={{
              margin: "8px 0 0",
              opacity: 0.9,
            }}
          >
            Manage customer invoices, payments, refunds and
            future digital invoicing integration.
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
            ["Total Invoices", invoices.length, "All generated invoices"],
            ["Paid", paid, "Paid invoices"],
            ["Unpaid", unpaid, "Payment pending"],
            ["Refunded", refunded, "Refunded invoices"],
            ["Invoice Value", money(totalValue), "Total invoice value"],
          ].map(([title, value, note]) => (
            <div key={title} style={cardStyle}>
              <div
                style={{
                  color: "#6b7280",
                  fontSize: 13,
                }}
              >
                {title}
              </div>

              <div
                style={{
                  fontSize: 25,
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

        {/* INVOICE OPERATIONS */}

        <section style={cardStyle}>
          <h2 style={{ marginTop: 0 }}>
            Invoice Operations
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(220px,1fr))",
              gap: 14,
            }}
          >
            {[
              ["🧾", "Create Invoice", "Generate invoice from an order"],
              ["🖨️", "Print Invoice", "Print customer invoice"],
              ["📄", "PDF Invoice", "Generate downloadable PDF"],
              ["📱", "WhatsApp Invoice", "Share invoice with customer"],
              ["✉️", "Email Invoice", "Send invoice by email"],
              ["↩️", "Refund / Adjustment", "Create refund record"],
              ["📑", "Credit Note", "Future credit note system"],
              ["📑", "Debit Note", "Future debit note system"],
            ].map(([icon, title, description]) => (
              <div
                key={title}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 14,
                  padding: 18,
                  background: "#fafafa",
                }}
              >
                <div style={{ fontSize: 25 }}>
                  {icon}
                </div>

                <h3 style={{ margin: "10px 0 5px" }}>
                  {title}
                </h3>

                <p
                  style={{
                    margin: 0,
                    color: "#6b7280",
                    fontSize: 13,
                  }}
                >
                  {description}
                </p>
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
          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              marginBottom: 18,
            }}
          >
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search invoice, order, customer or phone..."
              style={{
                flex: 1,
                minWidth: 250,
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
                padding: "0 14px",
                borderRadius: 10,
                border: "1px solid #d1d5db",
                minWidth: 150,
              }}
            >
              <option>All</option>
              <option>Paid</option>
              <option>Unpaid</option>
              <option>Refunded</option>
              <option>Cancelled</option>
            </select>
          </div>

          {/* TABLE */}

          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                minWidth: 1100,
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr>
                  {[
                    "Invoice",
                    "Order",
                    "Customer",
                    "Date",
                    "Amount",
                    "Payment",
                    "Status",
                    "FBR",
                    "Actions",
                  ].map((heading) => (
                    <th
                      key={heading}
                      style={{
                        textAlign: "left",
                        padding: 12,
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
                {filteredInvoices.map((item) => (
                  <tr key={item.id}>

                    <td style={{ padding: 12 }}>
                      <strong>{item.id}</strong>
                    </td>

                    <td style={{ padding: 12 }}>
                      {item.orderId}
                    </td>

                    <td style={{ padding: 12 }}>
                      <strong>{item.customer}</strong>
                      <div
                        style={{
                          color: "#6b7280",
                          fontSize: 12,
                          marginTop: 3,
                        }}
                      >
                        {item.phone}
                      </div>
                    </td>

                    <td style={{ padding: 12 }}>
                      {item.date}
                    </td>

                    <td style={{ padding: 12 }}>
                      {money(item.amount)}
                    </td>

                    <td style={{ padding: 12 }}>
                      {item.payment}
                    </td>

                    <td style={{ padding: 12 }}>
                      <span
                        style={{
                          padding: "5px 9px",
                          borderRadius: 20,
                          fontSize: 11,
                          fontWeight: 700,
                          background:
                            item.status === "Paid"
                              ? "#dcfce7"
                              : item.status === "Refunded"
                              ? "#fee2e2"
                              : "#fef3c7",
                          color:
                            item.status === "Paid"
                              ? "#166534"
                              : item.status === "Refunded"
                              ? "#991b1b"
                              : "#92400e",
                        }}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td style={{ padding: 12 }}>
                      <span
                        style={{
                          padding: "5px 9px",
                          borderRadius: 20,
                          background: "#f3f4f6",
                          fontSize: 11,
                        }}
                      >
                        {item.fbrStatus}
                      </span>
                    </td>

                    <td style={{ padding: 12 }}>
                      <div
                        style={{
                          display: "flex",
                          gap: 7,
                          flexWrap: "wrap",
                        }}
                      >
                        <button
                          onClick={() => setSelected(item)}
                          style={{
                            border: "none",
                            borderRadius: 8,
                            padding: "8px 10px",
                            cursor: "pointer",
                            background: "#dbeafe",
                            color: "#1d4ed8",
                            fontWeight: 700,
                          }}
                        >
                          View
                        </button>

                        {item.status === "Unpaid" && (
                          <button
                            onClick={() => markPaid(item.id)}
                            style={{
                              border: "none",
                              borderRadius: 8,
                              padding: "8px 10px",
                              cursor: "pointer",
                              background: "#dcfce7",
                              color: "#166534",
                              fontWeight: 700,
                            }}
                          >
                            Mark Paid
                          </button>
                        )}
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FUTURE READY SECTION */}

        <section
          style={{
            ...cardStyle,
            marginTop: 24,
            background: "#fffbeb",
            borderColor: "#fde68a",
          }}
        >
          <h2 style={{ marginTop: 0 }}>
            🔗 Future Digital Invoice Architecture
          </h2>

          <p>
            Every customer order will eventually generate a
            unique invoice automatically.
          </p>

          <p>
            Verified payment status will be connected with
            the invoice.
          </p>

          <p>
            Refunds and cancellations will create the required
            financial adjustment records.
          </p>

          <p>
            FBR invoice number, QR verification, integration
            status and response/reference fields are reserved
            for the real integration stage.
          </p>

          <p style={{ marginBottom: 0 }}>
            Credit notes and debit notes are also reserved in
            the architecture.
          </p>
        </section>

        {/* MODAL */}

        {selected && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,.55)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
              zIndex: 1000,
            }}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: 18,
                padding: 28,
                width: "100%",
                maxWidth: 650,
                maxHeight: "90vh",
                overflowY: "auto",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 15,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "#6b7280",
                    }}
                  >
                    INVOICE
                  </div>

                  <h2 style={{ margin: "5px 0" }}>
                    {selected.id}
                  </h2>
                </div>

                <button
                  onClick={() => setSelected(null)}
                  style={{
                    border: "none",
                    background: "#f3f4f6",
                    borderRadius: 8,
                    padding: "8px 12px",
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              </div>

              <hr style={{ margin: "20px 0" }} />

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit,minmax(220px,1fr))",
                  gap: 16,
                }}
              >
                <div>
                  <strong>Customer</strong>
                  <p>{selected.customer}</p>
                </div>

                <div>
                  <strong>Phone</strong>
                  <p>{selected.phone}</p>
                </div>

                <div>
                  <strong>Order</strong>
                  <p>{selected.orderId}</p>
                </div>

                <div>
                  <strong>Date</strong>
                  <p>{selected.date}</p>
                </div>

                <div>
                  <strong>Payment</strong>
                  <p>{selected.payment}</p>
                </div>

                <div>
                  <strong>Status</strong>
                  <p>{selected.status}</p>
                </div>

                <div>
                  <strong>Total</strong>
                  <p>{money(selected.amount)}</p>
                </div>

                <div>
                  <strong>FBR Status</strong>
                  <p>{selected.fbrStatus}</p>
                </div>
              </div>

              <div
                style={{
                  marginTop: 20,
                  padding: 16,
                  borderRadius: 12,
                  background: "#f9fafb",
                }}
              >
                <strong>Invoice actions</strong>

                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    flexWrap: "wrap",
                    marginTop: 12,
                  }}
                >
                  <button
                    onClick={() => window.print()}
                    style={{
                      padding: "10px 14px",
                      borderRadius: 9,
                      border: "1px solid #d1d5db",
                      background: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    🖨️ Print
                  </button>

                  <button
                    style={{
                      padding: "10px 14px",
                      borderRadius: 9,
                      border: "none",
                      background: "#dcfce7",
                      color: "#166534",
                      cursor: "pointer",
                      fontWeight: 700,
                    }}
                  >
                    📄 PDF Architecture
                  </button>

                  <button
                    style={{
                      padding: "10px 14px",
                      borderRadius: 9,
                      border: "none",
                      background: "#dcfce7",
                      color: "#166534",
                      cursor: "pointer",
                      fontWeight: 700,
                    }}
                  >
                    📱 WhatsApp
                  </button>
                </div>
              </div>

              <p
                style={{
                  marginTop: 20,
                  color: "#6b7280",
                  fontSize: 13,
                }}
              >
                PDF generation, WhatsApp sending and real
                invoice data will be connected to the backend
                after the database/API layer is ready.
              </p>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}