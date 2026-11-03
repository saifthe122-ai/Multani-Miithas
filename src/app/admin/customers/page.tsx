"use client";

import { useCallback, useEffect, useState } from "react";

type Customer = {
  id: number | string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  created_at: string | null;
  order_count: number | string;
  total_paid: number | string;
  last_order_at: string | null;
};

export default function CustomersDashboard() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCustomers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/customers", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Customers load nahi ho sake.");
      setCustomers(Array.isArray(data.customers) ? data.customers : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Customers load nahi ho sake.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadCustomers(); }, [loadCustomers]);

  const repeatCustomers = customers.filter((customer) => Number(customer.order_count) > 1).length;
  const customersWithOrders = customers.filter((customer) => Number(customer.order_count) > 0).length;
  const totalPaid = customers.reduce((sum, customer) => sum + Number(customer.total_paid || 0), 0);

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <div>
          <a href="/admin" style={styles.backLink}>← Admin Dashboard</a>
          <h1 style={styles.title}>Customers</h1>
          <p style={styles.subtitle}>Real customer records and order activity from the connected database.</p>
        </div>
        <button onClick={() => void loadCustomers()} style={styles.refreshButton} disabled={loading}>
          {loading ? "Loading..." : "Refresh data"}
        </button>
      </header>

      <section style={styles.stats}>
        <Stat title="Total Customers" value={customers.length.toLocaleString()} />
        <Stat title="Repeat Customers" value={repeatCustomers.toLocaleString()} />
        <Stat title="Customers with Orders" value={customersWithOrders.toLocaleString()} />
        <Stat title="Verified Payments" value={\`Rs. \${totalPaid.toLocaleString("en-PK", { maximumFractionDigits: 2 })\`} />
      </section>

      {error && <div role="alert" style={styles.error}>{error}</div>}

      <section style={styles.panel}>
        <div style={styles.panelHeader}>
          <div>
            <h2 style={styles.sectionTitle}>Customer Records</h2>
            <p style={styles.muted}>Showing up to 500 customers, newest first.</p>
          </div>
          <span style={styles.count}>{customers.length} records</span>
        </div>

        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead><tr>
              <th style={styles.th}>Customer</th>
              <th style={styles.th}>Contact</th>
              <th style={styles.th}>Orders</th>
              <th style={styles.th}>Verified Paid</th>
              <th style={styles.th}>Last Order</th>
              <th style={styles.th}>Joined</th>
            </tr></thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={String(customer.id)}>
                  <td style={styles.td}><strong>{customer.name}</strong><div style={styles.secondary}>ID: {customer.id}</div></td>
                  <td style={styles.td}>
                    <div>{customer.phone || "No phone"}</div>
                    <div style={styles.secondary}>{customer.email || "No email"}</div>
                    {customer.address && <div style={styles.secondary}>{customer.address}</div>}
                  </td>
                  <td style={styles.td}>{Number(customer.order_count).toLocaleString()}</td>
                  <td style={styles.td}>Rs. {Number(customer.total_paid || 0).toLocaleString("en-PK", { maximumFractionDigits: 2 })}</td>
                  <td style={styles.td}>{formatDate(customer.last_order_at)}</td>
                  <td style={styles.td}>{formatDate(customer.created_at)}</td>
                </tr>
              ))}
              {!loading && !error && customers.length === 0 && (
                <tr><td style={styles.empty} colSpan={6}>Abhi database mein koi customer record nahi hai. Customer ka pehla order ya profile save hone par yahan nazar aayega.</td></tr>
              )}
              {loading && <tr><td style={styles.empty} colSpan={6}>Customer records load ho rahe hain...</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
      <p style={styles.note}>Payment total sirf un orders ko count karta hai jinka payment status Paid hai. COD payment delivery ke baad Paid mark hone par count hogi.</p>
    </main>
  );
}

function formatDate(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString("en-PK");
}

function Stat({ title, value }: { title: string; value: string }) {
  return <div style={styles.stat}><div style={styles.statTitle}>{title}</div><div style={styles.statValue}>{value}</div></div>;
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#f4f7f6", padding: "28px", color: "#17201d", fontFamily: "Arial, sans-serif" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, flexWrap: "wrap", marginBottom: 24 },
  backLink: { color: "#15803d", textDecoration: "none", fontWeight: 700 },
  title: { fontSize: 32, margin: "14px 0 6px", fontWeight: 800 },
  subtitle: { color: "#64748b", margin: 0 },
  refreshButton: { border: "1px solid #15803d", background: "#fff", color: "#15803d", borderRadius: 10, padding: "11px 16px", fontWeight: 700, cursor: "pointer" },
  stats: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 14, marginBottom: 20 },
  stat: { background: "#fff", borderRadius: 14, padding: 18, boxShadow: "0 5px 18px rgba(15,23,42,.06)" },
  statTitle: { color: "#64748b", fontSize: 13, marginBottom: 8 },
  statValue: { color: "#17201d", fontSize: 24, fontWeight: 800, overflowWrap: "anywhere" },
  panel: { background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 5px 18px rgba(15,23,42,.06)" },
  panelHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 16 },
  sectionTitle: { margin: 0, fontSize: 19, fontWeight: 800 },
  muted: { color: "#64748b", fontSize: 13, margin: "5px 0 0" },
  count: { background: "#f0fdf4", color: "#166534", borderRadius: 999, padding: "7px 11px", fontSize: 12, fontWeight: 700 },
  tableWrap: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse", minWidth: 850 },
  th: { textAlign: "left", padding: "12px 10px", borderBottom: "2px solid #e5e7eb", color: "#64748b", fontSize: 12, textTransform: "uppercase" },
  td: { padding: "14px 10px", borderBottom: "1px solid #eef2f1", verticalAlign: "top", fontSize: 13 },
  secondary: { color: "#64748b", fontSize: 12, marginTop: 4, overflowWrap: "anywhere" },
  empty: { textAlign: "center", padding: 36, color: "#64748b", lineHeight: 1.6 },
  error: { background: "#fef2f2", border: "1px solid #fecaca", color: "#991b1b", padding: 14, borderRadius: 10, marginBottom: 18 },
  note: { color: "#64748b", fontSize: 12, lineHeight: 1.6, marginTop: 14 },
};
