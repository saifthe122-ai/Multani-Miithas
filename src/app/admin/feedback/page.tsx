"use client";

import Link from "next/link";
import { useState } from "react";

type Complaint = {
  id: string;
  customer: string;
  order: string;
  category: string;
  priority: "High" | "Medium" | "Low";
  status: "New" | "In Progress" | "Resolved";
  message: string;
  date: string;
};

const initialComplaints: Complaint[] = [
  {
    id: "CMP-1001",
    customer: "Ahmed Khan",
    order: "MM-1001",
    category: "Late Delivery",
    priority: "High",
    status: "New",
    message: "Order delivery was delayed.",
    date: "Today",
  },
  {
    id: "CMP-1002",
    customer: "Fatima Ali",
    order: "MM-1002",
    category: "Product Quality",
    priority: "Medium",
    status: "In Progress",
    message: "Customer reported an issue with product quality.",
    date: "Today",
  },
  {
    id: "CMP-1003",
    customer: "Usman Raza",
    order: "MM-1003",
    category: "Payment",
    priority: "Low",
    status: "Resolved",
    message: "Payment status required clarification.",
    date: "Yesterday",
  },
];

const cardStyle = {
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: 16,
  padding: 20,
  boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
};

export default function FeedbackComplaintsDashboard() {
  const [complaints, setComplaints] =
    useState<Complaint[]>(initialComplaints);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState<Complaint | null>(null);

  const filteredComplaints = complaints.filter((complaint) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      complaint.customer.toLowerCase().includes(searchText) ||
      complaint.order.toLowerCase().includes(searchText) ||
      complaint.id.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "All" ||
      complaint.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const updateStatus = (
    id: string,
    status: Complaint["status"]
  ) => {
    setComplaints((current) =>
      current.map((complaint) =>
        complaint.id === id
          ? { ...complaint, status }
          : complaint
      )
    );

    setSelected(null);
  };

  const total = complaints.length;

  const newComplaints = complaints.filter(
    (item) => item.status === "New"
  ).length;

  const inProgress = complaints.filter(
    (item) => item.status === "In Progress"
  ).length;

  const resolved = complaints.filter(
    (item) => item.status === "Resolved"
  ).length;

  const highPriority = complaints.filter(
    (item) => item.priority === "High"
  ).length;

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
          <h1 style={{ margin: 0, fontSize: 30 }}>
            Feedback & Complaints
          </h1>

          <p
            style={{
              margin: "8px 0 0",
              opacity: 0.9,
            }}
          >
            Manage customer complaints, feedback, priorities
            and support responses.
          </p>
        </header>

        {/* Statistics */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(180px,1fr))",
            gap: 16,
            marginBottom: 24,
          }}
        >
          {[
            ["Total Complaints", total, "All complaints"],
            ["New", newComplaints, "Need attention"],
            ["In Progress", inProgress, "Currently handling"],
            ["Resolved", resolved, "Successfully closed"],
            ["High Priority", highPriority, "Urgent cases"],
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

        {/* Management buttons */}
        <section style={cardStyle}>
          <h2 style={{ marginTop: 0 }}>
            Complaint Management
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(180px,1fr))",
              gap: 12,
            }}
          >
            {[
              "New Complaint",
              "Customer Feedback",
              "High Priority",
              "Staff Response",
              "Complaint History",
            ].map((item) => (
              <button
                key={item}
                style={{
                  padding: "14px 16px",
                  borderRadius: 12,
                  border: "1px solid #d1d5db",
                  background: "#f9fafb",
                  cursor: "pointer",
                  fontWeight: 700,
                  color: "#374151",
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        {/* Search and filters */}
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
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search complaint, customer or order..."
              style={{
                flex: 1,
                minWidth: 260,
                padding: "13px 15px",
                borderRadius: 10,
                border: "1px solid #d1d5db",
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
                border: "1px solid #d1d5db",
                background: "white",
                minWidth: 170,
              }}
            >
              <option value="All">All Statuses</option>
              <option value="New">New</option>
              <option value="In Progress">
                In Progress
              </option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </section>

        {/* Complaints table */}
        <section
          style={{
            ...cardStyle,
            marginTop: 24,
          }}
        >
          <h2 style={{ marginTop: 0 }}>
            Customer Complaints
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
                    "Complaint",
                    "Customer",
                    "Order",
                    "Category",
                    "Priority",
                    "Status",
                    "Date",
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
                {filteredComplaints.map((complaint) => (
                  <tr key={complaint.id}>
                    <td style={{ padding: 14 }}>
                      <strong>{complaint.id}</strong>
                    </td>

                    <td style={{ padding: 14 }}>
                      {complaint.customer}
                    </td>

                    <td style={{ padding: 14 }}>
                      {complaint.order}
                    </td>

                    <td style={{ padding: 14 }}>
                      {complaint.category}
                    </td>

                    <td style={{ padding: 14 }}>
                      <span
                        style={{
                          padding: "6px 10px",
                          borderRadius: 20,
                          fontSize: 12,
                          fontWeight: 700,
                          background:
                            complaint.priority === "High"
                              ? "#fee2e2"
                              : complaint.priority ===
                                "Medium"
                              ? "#fef3c7"
                              : "#dcfce7",
                          color:
                            complaint.priority === "High"
                              ? "#991b1b"
                              : complaint.priority ===
                                "Medium"
                              ? "#92400e"
                              : "#166534",
                        }}
                      >
                        {complaint.priority}
                      </span>
                    </td>

                    <td style={{ padding: 14 }}>
                      <span
                        style={{
                          padding: "6px 10px",
                          borderRadius: 20,
                          fontSize: 12,
                          fontWeight: 700,
                          background:
                            complaint.status === "Resolved"
                              ? "#dcfce7"
                              : complaint.status === "New"
                              ? "#dbeafe"
                              : "#fef3c7",
                          color:
                            complaint.status === "Resolved"
                              ? "#166534"
                              : complaint.status === "New"
                              ? "#1d4ed8"
                              : "#92400e",
                        }}
                      >
                        {complaint.status}
                      </span>
                    </td>

                    <td style={{ padding: 14 }}>
                      {complaint.date}
                    </td>

                    <td style={{ padding: 14 }}>
                      <button
                        onClick={() =>
                          setSelected(complaint)
                        }
                        style={{
                          border: "none",
                          background: "#166534",
                          color: "white",
                          padding: "9px 13px",
                          borderRadius: 8,
                          cursor: "pointer",
                          fontWeight: 700,
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredComplaints.length === 0 && (
            <p
              style={{
                textAlign: "center",
                color: "#6b7280",
                padding: 30,
              }}
            >
              No complaints found.
            </p>
          )}
        </section>

        {/* Smart insights */}
        <section
          style={{
            ...cardStyle,
            marginTop: 24,
            background: "#ecfdf5",
            borderColor: "#bbf7d0",
          }}
        >
          <h2 style={{ marginTop: 0 }}>
            Smart Complaint Insights
          </h2>

          <p>
            • High-priority complaints should be handled first.
          </p>

          <p>
            • Complaint history will later be connected with
            customer profiles and orders.
          </p>

          <p>
            • Product, delivery and payment complaints can be
            analysed separately.
          </p>

          <p style={{ marginBottom: 0 }}>
            • Future database integration will preserve the
            complete complaint history.
          </p>
        </section>

        {/* Details Modal */}
        {selected && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.55)",
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
                maxWidth: 600,
                borderRadius: 18,
                padding: 26,
                boxShadow:
                  "0 20px 50px rgba(0,0,0,0.25)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 20,
                  alignItems: "center",
                }}
              >
                <h2 style={{ margin: 0 }}>
                  {selected.id}
                </h2>

                <button
                  onClick={() => setSelected(null)}
                  style={{
                    border: "none",
                    background: "#f3f4f6",
                    borderRadius: 8,
                    padding: "8px 12px",
                    cursor: "pointer",
                    fontWeight: 700,
                  }}
                >
                  Close
                </button>
              </div>

              <div
                style={{
                  marginTop: 22,
                  lineHeight: 1.8,
                  color: "#374151",
                }}
              >
                <p>
                  <strong>Customer:</strong>{" "}
                  {selected.customer}
                </p>

                <p>
                  <strong>Order:</strong>{" "}
                  {selected.order}
                </p>

                <p>
                  <strong>Category:</strong>{" "}
                  {selected.category}
                </p>

                <p>
                  <strong>Priority:</strong>{" "}
                  {selected.priority}
                </p>

                <p>
                  <strong>Current Status:</strong>{" "}
                  {selected.status}
                </p>

                <p>
                  <strong>Complaint:</strong>{" "}
                  {selected.message}
                </p>
              </div>

              <h3>Update Status</h3>

              <div
                style={{
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap",
                }}
              >
                <button
                  onClick={() =>
                    updateStatus(selected.id, "New")
                  }
                  style={{
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: "1px solid #93c5fd",
                    background: "#dbeafe",
                    cursor: "pointer",
                  }}
                >
                  New
                </button>

                <button
                  onClick={() =>
                    updateStatus(
                      selected.id,
                      "In Progress"
                    )
                  }
                  style={{
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: "1px solid #fcd34d",
                    background: "#fef3c7",
                    cursor: "pointer",
                  }}
                >
                  In Progress
                </button>

                <button
                  onClick={() =>
                    updateStatus(
                      selected.id,
                      "Resolved"
                    )
                  }
                  style={{
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: "1px solid #86efac",
                    background: "#dcfce7",
                    cursor: "pointer",
                  }}
                >
                  Resolve Complaint
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}