"use client";

import { FormEvent, useState } from "react";

export default function RefundRequestForm() {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [reference, setReference] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries());
    setBusy(true); setMessage(""); setReference("");
    try {
      const response = await fetch("/api/order-service-requests", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, requestType: "refund" }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Refund request submit nahi ho saki.");
      setReference(String(data.request.request_reference));
      setMessage(data.message || "Request submit ho gayi.");
      form.reset();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Refund request submit nahi ho saki."); }
    finally { setBusy(false); }
  }
  const field: React.CSSProperties = { display: "block", width: "100%", boxSizing: "border-box", padding: 12, marginTop: 6, border: "1px solid #D9CFBA", borderRadius: 7, background: "#fff" };
  return <section style={{ marginTop: 32, padding: "clamp(18px, 4vw, 30px)", border: "1px solid #E5D6B8", borderRadius: 12, background: "#F8F4EA" }}>
    <h2 style={{ color: "#233D39", marginTop: 0 }}>Submit a Refund Request</h2>
    <p style={{ color: "#59645D" }}>Refund requests require an existing delivered/cancelled order with verified prepaid payment. Enter the same phone number used for the order. A request is not a confirmation of refund.</p>
    <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
      <label>Order Number<input name="orderNumber" required maxLength={40} placeholder="MM-XXXXXXXXXXXX" style={field} /></label>
      <label>Customer Name<input name="customerName" required maxLength={150} style={field} /></label>
      <label>Order Phone Number<input name="phone" required inputMode="tel" maxLength={40} style={field} /></label>
      <label>Reason<select name="reason" required style={field}><option value="">Select a reason</option><option>Damaged product</option><option>Incorrect product</option><option>Missing item</option><option>Approved order cancellation</option><option>Other eligible issue</option></select></label>
      <label>Requested amount (PKR)<input name="requestedAmount" required type="number" min="1" step="0.01" style={field} /></label>
      <label>Details<textarea name="details" rows={3} maxLength={2000} style={field} /></label>
      <button disabled={busy} type="submit" style={{ padding: 14, border: 0, borderRadius: 8, background: "#233D39", color: "#fff", fontWeight: 700, cursor: busy ? "wait" : "pointer" }}>{busy ? "Submitting..." : "Submit Refund Request"}</button>
      {message && <p role="status" aria-live="polite" style={{ margin: 0, color: "#233D39" }}>{message}{reference ? " Reference: " + reference : ""}</p>}
    </form>
  </section>;
}
