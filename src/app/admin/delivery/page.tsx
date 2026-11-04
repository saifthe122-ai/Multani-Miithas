"use client";

import { useCallback, useEffect, useState } from "react";

type Delivery = {
  id: number | null; order_id: number; order_number: string; customer_name: string;
  customer_phone: string; delivery_address: string; total: number;
  order_status: string; provider: string | null; assigned_to: string | null;
  assigned_phone: string | null; delivery_status: string | null;
  tracking_reference: string | null; notes: string | null;
};

export default function DeliveryDashboard() {
  const [rows, setRows] = useState<Delivery[]>([]);
  const [message, setMessage] = useState("Loading orders…");
  const [saving, setSaving] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, Record<string,string>>>({});

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/delivery", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Delivery orders load nahi huay");
      setRows(data.deliveries || []);
      setMessage(data.deliveries?.length ? "" : "Abhi koi active order nahi.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Delivery data load failed"); }
  }, []);

  useEffect(() => { void load(); }, [load]);

  function value(row: Delivery, key: string) {
    return drafts[row.order_number]?.[key] ?? String((row as unknown as Record<string, unknown>)[key] ?? "");
  }
  function setValue(order: string, key: string, next: string) {
    setDrafts(current => ({ ...current, [order]: { ...current[order], [key]: next } }));
  }
  async function save(row: Delivery) {
    const order = row.order_number;
    setSaving(order); setMessage("");
    try {
      const d = drafts[order] || {};
      const response = await fetch("/api/delivery", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNumber: order, provider: d.provider ?? row.provider ?? "In-house delivery",
          assignedTo: d.assigned_to ?? row.assigned_to ?? "",
          assignedPhone: d.assigned_phone ?? row.assigned_phone ?? "",
          trackingReference: d.tracking_reference ?? row.tracking_reference ?? "",
          notes: d.notes ?? row.notes ?? "",
          status: d.delivery_status ?? row.delivery_status ?? "pending",
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Delivery save failed");
      await load();
      setDrafts(current => { const next = { ...current }; delete next[order]; return next; });
      setMessage("Delivery record saved for " + order);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Delivery save failed"); }
    finally { setSaving(null); }
  }

  const input: React.CSSProperties = { width: "100%", boxSizing: "border-box", padding: 9, border: "1px solid #cbd5e1", borderRadius: 7, marginTop: 5 };
  return <main style={{ minHeight: "100vh", background: "#f4f7f5", color: "#17251d", fontFamily: "Arial,sans-serif", padding: 22 }}>
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <a href="/admin" style={{ color: "#166534" }}>← Admin Dashboard</a>
      <h1 style={{ fontSize: 30, marginBottom: 5 }}>Order Delivery Management</h1>
      <p style={{ color: "#64748b" }}>Assign in-house delivery staff, add tracking references and update parcel status. Live GPS tracking requires a separate staff app/device integration.</p>
      <button onClick={() => void load()} style={{ padding: "9px 14px", borderRadius: 8, border: "1px solid #166534", background: "#fff", color: "#166534", cursor: "pointer" }}>Refresh orders</button>
      {message && <p role="status" style={{ background: "#fff", padding: 12, borderRadius: 8 }}>{message}</p>}
      {rows.map(row => <section key={row.order_number} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 18, marginTop: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div><h2 style={{ margin: 0 }}>{row.order_number}</h2><strong>{row.customer_name} · {row.customer_phone}</strong><p style={{ margin: "5px 0", color: "#475569" }}>{row.delivery_address}</p></div>
          <div><strong>Rs {Number(row.total).toLocaleString("en-PK")}</strong><div style={{ color: "#64748b", fontSize: 13 }}>Order: {row.order_status}</div></div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 12, marginTop: 14 }}>
          <label>Delivery provider<input style={input} value={value(row,"provider")} onChange={e=>setValue(row.order_number,"provider",e.target.value)} placeholder="In-house delivery" /></label>
          <label>Assigned person<input style={input} value={value(row,"assigned_to")} onChange={e=>setValue(row.order_number,"assigned_to",e.target.value)} placeholder="Rider name" /></label>
          <label>Rider phone<input style={input} value={value(row,"assigned_phone")} onChange={e=>setValue(row.order_number,"assigned_phone",e.target.value)} placeholder="03xx..." /></label>
          <label>Tracking reference<input style={input} value={value(row,"tracking_reference")} onChange={e=>setValue(row.order_number,"tracking_reference",e.target.value)} placeholder="Optional tracking ID" /></label>
          <label>Status<select style={input} value={value(row,"delivery_status") || "pending"} onChange={e=>setValue(row.order_number,"delivery_status",e.target.value)}>
            {["pending","assigned","dispatched","in_transit","delivered","failed","returned"].map(s=><option key={s} value={s}>{s.replace("_"," ")}</option>)}
          </select></label>
          <label>Notes<input style={input} value={value(row,"notes")} onChange={e=>setValue(row.order_number,"notes",e.target.value)} placeholder="Delivery instructions" /></label>
        </div>
        <button disabled={saving===row.order_number} onClick={()=>void save(row)} style={{ marginTop: 14, padding: "10px 16px", border: 0, borderRadius: 8, background: "#14532d", color: "#fff", cursor: "pointer" }}>{saving===row.order_number ? "Saving…" : "Save delivery update"}</button>
      </section>)}
    </div>
  </main>;
}
