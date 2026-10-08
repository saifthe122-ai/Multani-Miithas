"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Preparing"
  | "Out for Delivery"
  | "Delivered"
  | "Cancelled";

type PaymentStatus = "Paid" | "Pending" | "Failed" | "COD";

type Order = {
  id: string;
  customer: string;
  phone: string;
  email: string;
  items: string;
  quantity: number;
  amount: number;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  address: string;
  deliveryDate: string;
  deliveryTime: string;
  rider: string;
  priority: "Normal" | "High";
  createdAt: string;
};

const initialOrders: Order[] = [
  {
    id: "MM-1008",
    customer: "Ali Raza",
    phone: "0300-1234567",
    email: "ali@example.com",
    items: "Multani Sohan Halwa, Premium Barfi",
    quantity: 3,
    amount: 2850,
    paymentMethod: "JazzCash",
    paymentStatus: "Paid",
    status: "Confirmed",
    address: "Gulberg, Lahore",
    deliveryDate: "Today",
    deliveryTime: "4:00 PM - 6:00 PM",
    rider: "Not Assigned",
    priority: "High",
    createdAt: "09:10 AM",
  },
  {
    id: "MM-1007",
    customer: "Ahmed Khan",
    phone: "0312-9876543",
    email: "ahmed@example.com",
    items: "Gift Box Premium",
    quantity: 2,
    amount: 4200,
    paymentMethod: "Easypaisa",
    paymentStatus: "Paid",
    status: "Preparing",
    address: "DHA Phase 6, Lahore",
    deliveryDate: "Today",
    deliveryTime: "6:00 PM - 8:00 PM",
    rider: "Ali Delivery",
    priority: "Normal",
    createdAt: "08:42 AM",
  },
  {
    id: "MM-1006",
    customer: "Sara Malik",
    phone: "0321-5551234",
    email: "sara@example.com",
    items: "Gulab Jamun, Besan Ladoo",
    quantity: 4,
    amount: 2400,
    paymentMethod: "Cash on Delivery",
    paymentStatus: "COD",
    status: "Out for Delivery",
    address: "Johar Town, Lahore",
    deliveryDate: "Today",
    deliveryTime: "2:00 PM - 4:00 PM",
    rider: "Usman Delivery",
    priority: "Normal",
    createdAt: "08:15 AM",
  },
  {
    id: "MM-1005",
    customer: "Hassan Ali",
    phone: "0333-1112223",
    email: "hassan@example.com",
    items: "Sohan Halwa Family Pack",
    quantity: 1,
    amount: 3200,
    paymentMethod: "Bank Transfer",
    paymentStatus: "Pending",
    status: "Pending",
    address: "Model Town, Lahore",
    deliveryDate: "Tomorrow",
    deliveryTime: "11:00 AM - 1:00 PM",
    rider: "Not Assigned",
    priority: "High",
    createdAt: "Yesterday",
  },
  {
    id: "MM-1004",
    customer: "Fatima Noor",
    phone: "0345-4445566",
    email: "fatima@example.com",
    items: "Premium Barfi",
    quantity: 2,
    amount: 1800,
    paymentMethod: "Raast",
    paymentStatus: "Paid",
    status: "Delivered",
    address: "Bahria Town, Lahore",
    deliveryDate: "Yesterday",
    deliveryTime: "5:00 PM",
    rider: "Ali Delivery",
    priority: "Normal",
    createdAt: "Yesterday",
  },
];

const statusColors: Record<OrderStatus, string> = {
  Pending: "#f59e0b",
  Confirmed: "#2563eb",
  Preparing: "#8b5cf6",
  "Out for Delivery": "#0891b2",
  Delivered: "#16a34a",
  Cancelled: "#dc2626",
};

export default function OrdersDashboard() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = useMemo(() => {
    const query = search.toLowerCase().trim();

    return orders.filter((order) => {
      const matchesSearch =
        !query ||
        order.id.toLowerCase().includes(query) ||
        order.customer.toLowerCase().includes(query) ||
        order.phone.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || order.status === statusFilter;

      const matchesPayment =
        paymentFilter === "All" || order.paymentStatus === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [orders, search, statusFilter, paymentFilter]);

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "Pending").length,
    confirmed: orders.filter((o) => o.status === "Confirmed").length,
    preparing: orders.filter((o) => o.status === "Preparing").length,
    delivery: orders.filter((o) => o.status === "Out for Delivery").length,
    delivered: orders.filter((o) => o.status === "Delivered").length,
    cancelled: orders.filter((o) => o.status === "Cancelled").length,
  };

  const revenue = orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, order) => sum + order.amount, 0);

  function updateStatus(id: string, status: OrderStatus) {
    setOrders((current) =>
      current.map((order) =>
        order.id === id ? { ...order, status } : order
      )
    );

    setSelectedOrder((current) =>
      current?.id === id ? { ...current, status } : current
    );
  }

  function assignRider(id: string, rider: string) {
    setOrders((current) =>
      current.map((order) =>
        order.id === id ? { ...order, rider } : order
      )
    );

    setSelectedOrder((current) =>
      current?.id === id ? { ...current, rider } : current
    );
  }

  return (
    <main style={styles.page}>
      {/* HEADER */}
      <section style={styles.header}>
        <div>
          <Link href="/admin" style={styles.backLink}>
            ← Admin Dashboard
          </Link>

          <h1 style={styles.title}>Order Management</h1>

          <p style={styles.subtitle}>
            Manage orders, payments, customers, delivery and order status from
            one place.
          </p>
        </div>

        <div style={styles.headerActions}>
          <button
            style={styles.refreshButton}
            onClick={() => window.location.reload()}
          >
            ↻ Refresh
          </button>

          <button
            style={styles.primaryButton}
            onClick={() => alert("New order form will be connected to the customer checkout/API.")}
          >
            + New Order
          </button>
        </div>
      </section>

      {/* ALERT */}
      {stats.pending > 0 && (
        <section style={styles.alert}>
          <div style={styles.alertIcon}>!</div>

          <div>
            <strong>{stats.pending} order(s) need attention</strong>
            <p style={{ margin: "4px 0 0", color: "#92400e" }}>
              Review pending orders and confirm payment/order details before
              preparation.
            </p>
          </div>
        </section>
      )}

      {/* STATS */}
      <section style={styles.statsGrid}>
        <StatCard title="Total Orders" value={stats.total} icon="🛍️" />
        <StatCard title="Pending" value={stats.pending} icon="⏳" />
        <StatCard title="Confirmed" value={stats.confirmed} icon="✓" />
        <StatCard title="Preparing" value={stats.preparing} icon="👨‍🍳" />
        <StatCard title="Out for Delivery" value={stats.delivery} icon="🚚" />
        <StatCard title="Delivered" value={stats.delivered} icon="📦" />
        <StatCard title="Cancelled" value={stats.cancelled} icon="✕" />
        <StatCard
          title="Order Value"
          value={`Rs. ${revenue.toLocaleString()}`}
          icon="💰"
        />
      </section>

      {/* AI INSIGHTS */}
      <section style={styles.aiBox}>
        <div style={styles.aiIcon}>✦</div>

        <div style={{ flex: 1 }}>
          <h2 style={styles.sectionTitle}>Smart Order Insights</h2>

          <div style={styles.insightGrid}>
            <div style={styles.insight}>
              <strong>Priority Alert</strong>
              <span>
                {orders.filter((o) => o.priority === "High").length} high
                priority order(s) require attention.
              </span>
            </div>

            <div style={styles.insight}>
              <strong>Payment Check</strong>
              <span>
                {
                  orders.filter((o) => o.paymentStatus === "Pending").length
                } payment(s) still need verification.
              </span>
            </div>

            <div style={styles.insight}>
              <strong>Delivery Check</strong>
              <span>
                {
                  orders.filter(
                    (o) =>
                      o.status === "Confirmed" &&
                      o.rider === "Not Assigned"
                  ).length
                } confirmed order(s) have no rider assigned.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* FILTERS */}
      <section style={styles.panel}>
        <div style={styles.filterHeader}>
          <div>
            <h2 style={styles.sectionTitle}>Orders</h2>
            <p style={styles.muted}>
              {filteredOrders.length} order(s) currently displayed
            </p>
          </div>

          <div style={styles.filters}>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search order, customer or phone..."
              style={styles.search}
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={styles.select}
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Preparing">Preparing</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              style={styles.select}
            >
              <option value="All">All Payments</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
              <option value="COD">COD</option>
            </select>
          </div>
        </div>

        {/* TABLE */}
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Order</th>
                <th style={styles.th}>Customer</th>
                <th style={styles.th}>Items</th>
                <th style={styles.th}>Amount</th>
                <th style={styles.th}>Payment</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Rider</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td style={styles.td}>
                    <strong>{order.id}</strong>
                    <div style={styles.smallText}>{order.createdAt}</div>
                  </td>

                  <td style={styles.td}>
                    <strong>{order.customer}</strong>
                    <div style={styles.smallText}>{order.phone}</div>
                  </td>

                  <td style={styles.td}>
                    <div>{order.items}</div>
                    <div style={styles.smallText}>
                      Qty: {order.quantity}
                    </div>
                  </td>

                  <td style={styles.td}>
                    <strong>Rs. {order.amount.toLocaleString()}</strong>
                  </td>

                  <td style={styles.td}>
                    <div>{order.paymentMethod}</div>
                    <PaymentBadge status={order.paymentStatus} />
                  </td>

                  <td style={styles.td}>
                    <StatusBadge status={order.status} />
                  </td>

                  <td style={styles.td}>
                    <span
                      style={{
                        color:
                          order.rider === "Not Assigned"
                            ? "#dc2626"
                            : "#166534",
                        fontWeight: 700,
                      }}
                    >
                      {order.rider}
                    </span>
                  </td>

                  <td style={styles.td}>
                    <button
                      style={styles.viewButton}
                      onClick={() => setSelectedOrder(order)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}

              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={8} style={styles.empty}>
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* OPERATIONS */}
      <section style={styles.bottomGrid}>
        <div style={styles.panel}>
          <h2 style={styles.sectionTitle}>Order Operations</h2>

          <div style={styles.operationGrid}>
            <OperationCard
              icon="📋"
              title="Pending Orders"
              value={stats.pending}
              text="Review and confirm"
            />

            <OperationCard
              icon="👨‍🍳"
              title="Preparing"
              value={stats.preparing}
              text="Kitchen preparation"
            />

            <OperationCard
              icon="🚚"
              title="Delivery"
              value={stats.delivery}
              text="Track active deliveries"
            />

            <OperationCard
              icon="💳"
              title="Payment Review"
              value={
                orders.filter((o) => o.paymentStatus === "Pending").length
              }
              text="Verify payments"
            />
          </div>
        </div>

        <div style={styles.panel}>
          <h2 style={styles.sectionTitle}>Order Workflow</h2>

          <div style={styles.workflow}>
            <span>1. Customer Order</span>
            <span>→</span>
            <span>2. Confirmation</span>
            <span>→</span>
            <span>3. Preparation</span>
            <span>→</span>
            <span>4. Rider</span>
            <span>→</span>
            <span>5. Delivered</span>
          </div>

          <p style={styles.workflowNote}>
            Later this workflow will connect directly with the customer
            checkout, payment verification, delivery dashboard and accounting
            system.
          </p>
        </div>
      </section>

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <div>
                <h2 style={{ margin: 0 }}>Order {selectedOrder.id}</h2>
                <p style={styles.muted}>Complete order information</p>
              </div>

              <button
                style={styles.closeButton}
                onClick={() => setSelectedOrder(null)}
              >
                ×
              </button>
            </div>

            <div style={styles.detailGrid}>
              <Detail label="Customer" value={selectedOrder.customer} />
              <Detail label="Phone" value={selectedOrder.phone} />
              <Detail label="Email" value={selectedOrder.email || "Not provided"} />
              <Detail label="Products" value={selectedOrder.items} />
              <Detail
                label="Quantity"
                value={String(selectedOrder.quantity)}
              />
              <Detail
                label="Total"
                value={`Rs. ${selectedOrder.amount.toLocaleString()}`}
              />
              <Detail
                label="Payment Method"
                value={selectedOrder.paymentMethod}
              />
              <Detail
                label="Payment Status"
                value={selectedOrder.paymentStatus}
              />
              <Detail
                label="Delivery Address"
                value={selectedOrder.address}
              />
              <Detail
                label="Delivery Date"
                value={selectedOrder.deliveryDate}
              />
              <Detail
                label="Delivery Time"
                value={selectedOrder.deliveryTime}
              />
              <Detail label="Current Rider" value={selectedOrder.rider} />
            </div>

            <div style={styles.modalSection}>
              <h3 style={styles.modalSectionTitle}>Change Order Status</h3>

              <div style={styles.buttonRow}>
                {(
                  [
                    "Pending",
                    "Confirmed",
                    "Preparing",
                    "Out for Delivery",
                    "Delivered",
                    "Cancelled",
                  ] as OrderStatus[]
                ).map((status) => (
                  <button
                    key={status}
                    onClick={() => updateStatus(selectedOrder.id, status)}
                    style={{
                      ...styles.statusButton,
                      borderColor: statusColors[status],
                      color: statusColors[status],
                    }}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div style={styles.modalSection}>
              <h3 style={styles.modalSectionTitle}>Assign Delivery Rider</h3>

              <select
                value={selectedOrder.rider}
                onChange={(e) =>
                  assignRider(selectedOrder.id, e.target.value)
                }
                style={styles.fullSelect}
              >
                <option>Not Assigned</option>
                <option>Ali Delivery</option>
                <option>Usman Delivery</option>
                <option>Ahmed Delivery</option>
              </select>
            </div>

            <div style={styles.futureNotice}>
              <strong>Future automation foundation</strong>
              <p>
                This order screen is designed to connect later with the real
                Orders API, customer records, verified payment callbacks,
                delivery tracking, notifications and accounting records.
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: string;
}) {
  return (
    <div style={styles.statCard}>
      <div style={styles.statIcon}>{icon}</div>
      <div>
        <div style={styles.statTitle}>{title}</div>
        <div style={styles.statValue}>{value}</div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      style={{
        ...styles.badge,
        background: `${statusColors[status]}18`,
        color: statusColors[status],
      }}
    >
      {status}
    </span>
  );
}

function PaymentBadge({ status }: { status: PaymentStatus }) {
  const color =
    status === "Paid"
      ? "#16a34a"
      : status === "Failed"
      ? "#dc2626"
      : status === "COD"
      ? "#7c3aed"
      : "#d97706";

  return (
    <span
      style={{
        ...styles.badge,
        background: `${color}18`,
        color,
      }}
    >
      {status}
    </span>
  );
}

function OperationCard({
  icon,
  title,
  value,
  text,
}: {
  icon: string;
  title: string;
  value: number;
  text: string;
}) {
  return (
    <div style={styles.operationCard}>
      <div style={{ fontSize: 28 }}>{icon}</div>
      <strong>{title}</strong>
      <div style={styles.operationValue}>{value}</div>
      <span style={styles.smallText}>{text}</span>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div style={styles.detail}>
      <div style={styles.detailLabel}>{label}</div>
      <div style={styles.detailValue}>{value}</div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#f4f7f6",
    padding: "28px",
    color: "#17201d",
    fontFamily: "Arial, sans-serif",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 20,
    marginBottom: 24,
  },

  backLink: {
    color: "#15803d",
    textDecoration: "none",
    fontWeight: 700,
    fontSize: 14,
  },

  title: {
    margin: "10px 0 5px",
    fontSize: 32,
    fontWeight: 800,
  },

  subtitle: {
    margin: 0,
    color: "#64748b",
    maxWidth: 700,
  },

  headerActions: {
    display: "flex",
    gap: 10,
  },

  refreshButton: {
    border: "1px solid #d1d5db",
    background: "#fff",
    borderRadius: 10,
    padding: "11px 16px",
    cursor: "pointer",
    fontWeight: 700,
  },

  primaryButton: {
    border: "none",
    background: "#15803d",
    color: "#fff",
    borderRadius: 10,
    padding: "11px 17px",
    cursor: "pointer",
    fontWeight: 700,
  },

  alert: {
    display: "flex",
    gap: 14,
    alignItems: "center",
    background: "#fffbeb",
    border: "1px solid #fde68a",
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
  },

  alertIcon: {
    width: 38,
    height: 38,
    borderRadius: "50%",
    background: "#f59e0b",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 900,
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
    gap: 14,
    marginBottom: 20,
  },

  statCard: {
    background: "#fff",
    borderRadius: 14,
    padding: 18,
    boxShadow: "0 5px 18px rgba(15,23,42,.07)",
    display: "flex",
    gap: 13,
    alignItems: "center",
  },

  statIcon: {
    width: 45,
    height: 45,
    borderRadius: 12,
    background: "#f0fdf4",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 22,
  },

  statTitle: {
    fontSize: 13,
    color: "#64748b",
    marginBottom: 5,
  },

  statValue: {
    fontSize: 22,
    fontWeight: 800,
  },

  aiBox: {
    background: "linear-gradient(135deg,#ecfdf5,#eff6ff)",
    border: "1px solid #dbeafe",
    borderRadius: 16,
    padding: 20,
    display: "flex",
    gap: 15,
    marginBottom: 20,
  },

  aiIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    background: "#2563eb",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 22,
    fontWeight: 900,
  },

  sectionTitle: {
    margin: 0,
    fontSize: 19,
    fontWeight: 800,
  },

  insightGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
    gap: 12,
    marginTop: 13,
  },

  insight: {
    background: "rgba(255,255,255,.8)",
    padding: 13,
    borderRadius: 10,
    display: "flex",
    flexDirection: "column",
    gap: 5,
  },

  panel: {
    background: "#fff",
    borderRadius: 16,
    padding: 20,
    boxShadow: "0 5px 18px rgba(15,23,42,.07)",
    marginBottom: 20,
  },

  filterHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: 15,
    alignItems: "flex-end",
    marginBottom: 18,
    flexWrap: "wrap",
  },

  muted: {
    color: "#64748b",
    margin: "5px 0 0",
    fontSize: 13,
  },

  filters: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
  },

  search: {
    minWidth: 250,
    border: "1px solid #d1d5db",
    borderRadius: 9,
    padding: "10px 12px",
    outline: "none",
  },

  select: {
    border: "1px solid #d1d5db",
    borderRadius: 9,
    padding: "10px 12px",
    background: "#fff",
  },

  tableWrap: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: 1050,
  },

  th: {
    textAlign: "left",
    padding: "12px 10px",
    borderBottom: "2px solid #e5e7eb",
    color: "#64748b",
    fontSize: 12,
    textTransform: "uppercase",
  },

  td: {
    padding: "14px 10px",
    borderBottom: "1px solid #eef2f1",
    verticalAlign: "top",
    fontSize: 13,
  },

  smallText: {
    color: "#64748b",
    fontSize: 12,
    marginTop: 3,
  },

  badge: {
    display: "inline-block",
    padding: "5px 8px",
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 800,
    marginTop: 5,
  },

  viewButton: {
    border: "1px solid #15803d",
    color: "#15803d",
    background: "#fff",
    padding: "7px 11px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 700,
  },

  empty: {
    textAlign: "center",
    padding: 40,
    color: "#64748b",
  },

  bottomGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 20,
  },

  operationGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2,1fr)",
    gap: 12,
    marginTop: 15,
  },

  operationCard: {
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: 15,
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },

  operationValue: {
    fontSize: 24,
    fontWeight: 900,
  },

  workflow: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    alignItems: "center",
    marginTop: 18,
    fontSize: 13,
    fontWeight: 700,
  },

  workflowNote: {
    color: "#64748b",
    fontSize: 13,
    lineHeight: 1.6,
    marginTop: 20,
  },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15,23,42,.65)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    zIndex: 100,
  },

  modal: {
    width: "min(900px,100%)",
    maxHeight: "90vh",
    overflowY: "auto",
    background: "#fff",
    borderRadius: 18,
    padding: 24,
    boxShadow: "0 25px 70px rgba(0,0,0,.25)",
  },

  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },

  closeButton: {
    border: "none",
    background: "#f1f5f9",
    width: 38,
    height: 38,
    borderRadius: 10,
    fontSize: 25,
    cursor: "pointer",
  },

  detailGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2,1fr)",
    gap: 12,
  },

  detail: {
    background: "#f8fafc",
    padding: 13,
    borderRadius: 10,
  },

  detailLabel: {
    fontSize: 11,
    color: "#64748b",
    textTransform: "uppercase",
    fontWeight: 800,
    marginBottom: 5,
  },

  detailValue: {
    fontWeight: 700,
    lineHeight: 1.4,
  },

  modalSection: {
    marginTop: 22,
  },

  modalSectionTitle: {
    fontSize: 15,
    marginBottom: 10,
  },

  buttonRow: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
  },

  statusButton: {
    background: "#fff",
    border: "1px solid",
    borderRadius: 8,
    padding: "8px 10px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 12,
  },

  fullSelect: {
    width: "100%",
    padding: 11,
    border: "1px solid #d1d5db",
    borderRadius: 9,
    background: "#fff",
  },

  futureNotice: {
    marginTop: 22,
    padding: 15,
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: 12,
    color: "#166534",
    fontSize: 13,
    lineHeight: 1.6,
  },
};