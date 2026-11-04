"use client";

import { useCallback, useEffect, useState } from "react";

type Review = {
  id: number; order_id: number; order_number: string; product_id: number;
  product_name: string; customer_name: string; rating: number;
  review_text: string; status: "pending" | "approved" | "rejected";
  admin_reply: string | null; created_at: string;
};

export default function ReviewsDashboard() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState("all");
  const [message, setMessage] = useState("Loading reviews…");
  const [busy, setBusy] = useState<number | null>(null);

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/reviews", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Reviews load nahi huay");
      setReviews(data.reviews || []);
      setMessage(data.reviews?.length ? "" : "Abhi koi saved product review nahi hai.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Reviews load nahi huay");
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function update(id: number, status: Review["status"]) {
    setBusy(id); setMessage("");
    try {
      const response = await fetch("/api/reviews", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Update failed");
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Review update failed");
    } finally { setBusy(null); }
  }

  const visible = reviews.filter(r => filter === "all" || r.status === filter);
  const card: React.CSSProperties = { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 18, marginTop: 14 };
  const button = (color: string): React.CSSProperties => ({ border: "1px solid " + color, color, background: "#fff", borderRadius: 8, padding: "8px 12px", cursor: "pointer", fontWeight: 700 });

  return <main style={{ minHeight: "100vh", background: "#f4f7f6", color: "#17201d", padding: 24, fontFamily: "Arial,sans-serif" }}>
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <a href="/admin" style={{ color: "#15803d" }}>← Admin Dashboard</a>
      <h1 style={{ fontSize: 30, marginBottom: 6 }}>Product Reviews</h1>
      <p style={{ color: "#64748b" }}>Database-backed reviews. Only approved reviews are shown publicly.</p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <select value={filter} onChange={e => setFilter(e.target.value)} style={{ padding: 10, borderRadius: 8 }}>
          <option value="all">All reviews</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option>
        </select>
        <button onClick={() => void load()} style={button("#166534")}>Refresh</button>
      </div>
      {message && <p role="status" style={{ padding: 14, background: "#fff7ed", borderRadius: 8 }}>{message}</p>}
      {visible.map(review => <article key={review.id} style={card}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div><strong>{review.customer_name}</strong><div style={{ color: "#64748b", fontSize: 13 }}>{review.product_name} · Order {review.order_number}</div></div>
          <strong>{review.status.toUpperCase()}</strong>
        </div>
        <p style={{ color: "#b7791f", fontSize: 20, margin: "12px 0" }}>{"★".repeat(review.rating)}{"☆".repeat(5-review.rating)}</p>
        <p style={{ whiteSpace: "pre-wrap" }}>{review.review_text || "No written comment."}</p>
        {review.admin_reply && <p><strong>Admin reply:</strong> {review.admin_reply}</p>}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button disabled={busy === review.id} onClick={() => void update(review.id, "approved")} style={button("#15803d")}>Approve</button>
          <button disabled={busy === review.id} onClick={() => void update(review.id, "rejected")} style={button("#b91c1c")}>Reject</button>
          <button disabled={busy === review.id} onClick={() => void update(review.id, "pending")} style={button("#a16207")}>Set pending</button>
        </div>
      </article>)}
    </div>
  </main>;
}
