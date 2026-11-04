"use client";

import { FormEvent, useState } from "react";

export default function CancellationRequestForm() {
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
        body: JSON.stringify({ ...values, requestType: "cancellation" }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Request submit nahi ho saki.");
      setReference(String(data.request.request_reference));
      setMessage(data.message || "Request submit ho gayi.");
      form.reset();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Request submit nahi ho saki.");
    } finally { setBusy(false); }
  }
  const field: React.CSSProperties = { display: "block", width: "100%", boxSizing: "border-box", padding: 12, marginTop: 6, border: "1px solid #D9CFBA", borderRadius: 7, background: "#fff" };
  return <section style={{ margin: "28px 0", padding: "clamp(18px, 4vw, 30px)", border: "1px solid #E5D6B8", borderRadius: 12, background: "#F8F4EA" }}>
    <h2 style={{ color: "#233D39", marginTop: 0 }}>Submit a Cancellation Request</h2>
    <p style={{ color: "#59645D" }}>Order number aur wohi phone number enter karein jo order place karte waqt diya tha. Online request sirf Pending ya Confirmed orders ke liye submit ho sakti hai. Cancellation team ki confirmation ke baad hi final hogi.</p>
    <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
      <label>Order Number<input name="orderNumber" required maxLength={40} placeholder="MM-XXXXXXXXXXXX" style={field} /></label>
      <label>Customer Name<input name="customerName" required maxLength={150} style={field} /></label>
      <label>Order Phone Number<input name="phone" required inputMode="tel" maxLength={40} style={field} /></label>
      <label>Reason<select name="reason" required style={field}><option value="">Select a reason</option><option>Placed order by mistake</option><option>Need to change order</option><option>Delivery timing issue</option><option>Other</option></select></label>
      <label>Additional details<textarea name="details" rows={3} maxLength={2000} style={field} /></label>
      <button disabled={busy} type="submit" style={{ padding: 14, border: 0, borderRadius: 8, background: "#233D39", color: "#fff", fontWeight: 700, cursor: busy ? "wait" : "pointer" }}>{busy ? "Submitting..." : "Submit Cancellation Request"}</button>
      {message && <p role="status" aria-live="polite" style={{ margin: 0, color: "#233D39" }}>{message}{reference ? " Reference: " + reference : ""}</p>}
    </form>
  </section>;
}
