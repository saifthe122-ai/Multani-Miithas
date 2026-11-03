"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type ServiceRequest = {
  id: number;
  request_reference: string;
  request_type: "cancellation" | "refund";
  order_number: string;
  customer_name: string;
  customer_phone: string;
  reason: string;
  details: string;
  requested_amount: number | null;
  approved_amount: number | null;
  status: string;
  admin_note: string;
  refund_transfer_reference: string;
  created_at: string;
};

const money = (value: number) => "PKR " + Number(value || 0).toLocaleString("en-PK");
const panel: React.CSSProperties = { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 18 };

export default function RefundsPage() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [type, setType] = useState<"all" | "cancellation" | "refund">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [selected, setSelected] = useState<ServiceRequest | null>(null);
  const [status, setStatus] = useState("under_review");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [transferReference, setTransferReference] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/order-service-requests" + (type === "all" ? "" : "?type=" + type), { cache: "no-store" });
      const data = await response.json();
      if (!response.ok || !data.success || !Array.isArray(data.requests)) throw new Error(data.message || "Requests load nahi ho sakin.");
      setRequests(data.requests);
    } catch (e) { setError(e instanceof Error ? e.message : "Requests load nahi ho sakin."); }
    finally { setLoading(false); }
  }
  useEffect(() => { void load(); }, [type]);

  function choose(row: ServiceRequest) {
    setSelected(row); setStatus(row.status === "requested" ? "under_review" : row.status);
    setAmount(String(row.approved_amount ?? row.requested_amount ?? ""));
    setNote(row.admin_note || ""); setTransferReference(row.refund_transfer_reference || "");
    setMessage("");
  }
  async function save() {
    if (!selected) return;
    setSaving(true); setMessage("");
    try {
      const response = await fetch("/api/order-service-requests", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestReference: selected.request_reference, status, adminNote: note,
          approvedAmount: selected.request_type === "refund" ? Number(amount) : null,
          refundTransferReference: transferReference,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Update nahi ho saki.");
      setMessage(data.message || "Update saved."); setSelected(null); await load();
    } catch (e) { setMessage(e instanceof Error ? e.message : "Update nahi ho saki."); }
    finally { setSaving(false); }
  }

  const stats = useMemo(() => ({
    total: requests.length,
    open: requests.filter((r) => ["requested", "under_review", "approved", "processing"].includes(r.status)).length,
    refunded: requests.filter((r) => r.status === "refunded").reduce((sum, r) => sum + Number(r.approved_amount ?? r.requested_amount ?? 0), 0),
  }), [requests]);

  return <main style={{ minHeight: "100vh", background: "#f5f7fb", color: "#172033", padding: 24, fontFamily: "Arial, sans-serif" }}>
    <div style={{ maxWidth: 1300, margin: "0 auto" }}>
      <Link href="/admin/accounting" style={{ color: "#8b2f12", textDecoration: "none", fontWeight: 700 }}>← Back to Accounting</Link>
      <header style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16, margin: "24px 0" }}>
        <div><h1 style={{ margin: 0, fontSize: 32 }}>Customer Requests</h1><p style={{ color: "#64748b" }}>Real customer cancellation and prepaid refund requests from the database.</p></div>
        <button onClick={() => void load()} style={{ padding: "11px 16px", border: 0, borderRadius: 8, background: "#172033", color: "#fff", cursor: "pointer" }}>Refresh</button>
      </header>
      {message && <p role="status" style={panel}>{message}</p>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 14, marginBottom: 18 }}>
        <div style={panel}><span style={{ color: "#64748b" }}>Requests</span><h2>{stats.total}</h2></div>
        <div style={panel}><span style={{ color: "#64748b" }}>Open / In Review</span><h2>{stats.open}</h2></div>
        <div style={panel}><span style={{ color: "#64748b" }}>Recorded Refund Transfers</span><h2>{money(stats.refunded)}</h2></div>
      </div>
      <div style={{ ...panel, marginBottom: 18 }}>
        <label>Show requests <select value={type} onChange={(e) => setType(e.target.value as typeof type)} style={{ padding: 10, marginLeft: 8, borderRadius: 7, border: "1px solid #cbd5e1" }}><option value="all">All</option><option value="cancellation">Cancellations</option><option value="refund">Refunds</option></select></label>
      </div>
      {error && <p role="alert" style={{ ...panel, color: "#b91c1c" }}>{error}</p>}
      <section style={{ ...panel, overflowX: "auto" }}>
        {loading ? <p>Loading requests…</p> : <table style={{ width: "100%", minWidth: 900, borderCollapse: "collapse", textAlign: "left" }}>
          <thead><tr>{["Date","Reference","Type","Order","Customer","Reason","Amount","Status","Action"].map((x) => <th key={x} style={{ padding: 11, borderBottom: "1px solid #e5e7eb" }}>{x}</th>)}</tr></thead>
          <tbody>{requests.map((r) => <tr key={r.id}>
            {[new Date(r.created_at).toLocaleString(), r.request_reference, r.request_type, r.order_number, r.customer_name + " · " + r.customer_phone, r.reason, r.request_type === "refund" ? money(Number(r.approved_amount ?? r.requested_amount ?? 0)) : "—", r.status].map((v, i) => <td key={i} style={{ padding: 11, borderBottom: "1px solid #eef0f3", verticalAlign: "top" }}>{v}</td>)}
            <td style={{ padding: 11, borderBottom: "1px solid #eef0f3" }}><button onClick={() => choose(r)} style={{ padding: "8px 12px", border: 0, borderRadius: 7, background: "#8b2f12", color: "#fff", cursor: "pointer" }}>Review</button></td>
          </tr>)}
          {!requests.length && <tr><td colSpan={9} style={{ padding: 25, textAlign: "center", color: "#64748b" }}>No real customer requests yet.</td></tr>}</tbody>
        </table>}
      </section>
      {selected && <section style={{ ...panel, marginTop: 20, display: "grid", gap: 12 }}>
        <h2 style={{ margin: 0 }}>Review {selected.request_reference}</h2>
        <p style={{ margin: 0 }}>Order: <strong>{selected.order_number}</strong> · {selected.customer_name} · {selected.customer_phone}</p>
        <p style={{ margin: 0 }}>Reason: {selected.reason}. {selected.details}</p>
        <label>Status <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ display: "block", padding: 10, marginTop: 5, borderRadius: 7, border: "1px solid #cbd5e1" }}>
          <option value="under_review">Under Review</option><option value="approved">Approved</option><option value="rejected">Rejected</option>{selected.request_type === "refund" && <><option value="processing">Processing</option><option value="refunded">Refunded (actual transfer completed)</option></>}
        </select></label>
        {selected.request_type === "refund" && <label>Approved refund amount (PKR)<input type="number" min="1" max={Number(selected.requested_amount)} step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} style={{ display: "block", padding: 10, width: "100%", maxWidth: 360, marginTop: 5, borderRadius: 7, border: "1px solid #cbd5e1" }} /></label>}
        {selected.request_type === "refund" && status === "refunded" && <label>Actual bank/wallet transfer reference (required)<input value={transferReference} onChange={(e) => setTransferReference(e.target.value)} maxLength={120} style={{ display: "block", padding: 10, width: "100%", maxWidth: 480, marginTop: 5, borderRadius: 7, border: "1px solid #cbd5e1" }} /></label>}
        <label>Admin note<textarea rows={3} maxLength={1500} value={note} onChange={(e) => setNote(e.target.value)} style={{ display: "block", padding: 10, width: "100%", marginTop: 5, borderRadius: 7, border: "1px solid #cbd5e1" }} /></label>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}><button disabled={saving} onClick={() => void save()} style={{ padding: 12, border: 0, borderRadius: 8, background: "#166534", color: "#fff", cursor: "pointer" }}>{saving ? "Saving…" : "Save Decision"}</button><button onClick={() => setSelected(null)} style={{ padding: 12, border: "1px solid #cbd5e1", borderRadius: 8, background: "#fff", cursor: "pointer" }}>Close</button></div>
        <p style={{ color: "#9a3412", fontSize: 13 }}>Important: Approving a refund does not transfer money. Select Refunded only after the actual bank/wallet transfer is complete and its reference is entered.</p>
      </section>}
    </div>
  </main>;
}
