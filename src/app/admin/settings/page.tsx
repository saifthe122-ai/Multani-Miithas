"use client";

import Link from "next/link";

const groups = [
  {
    title: "Storefront & Catalogue",
    description: "Customer website, product information, category visibility and media.",
    links: [
      ["Products & Categories", "/admin/products", "Edit names, categories, weights, prices, stock and product packaging charges."],
      ["Website Design & Media", "/admin/website-design", "Manage hero image, transparent logo, offers, and social channel links."],
    ],
  },
  {
    title: "Orders & Payments",
    description: "Keep customer orders and payment verification in sync.",
    links: [
      ["Order Management", "/admin/orders", "Current orders, previous orders, CSV export, status and archive."],
      ["Payment Accounts & Methods", "/admin/payments", "Enable, deactivate, edit or permanently unlink payment accounts."],
    ],
  },
  {
    title: "Checkout & Delivery",
    description: "Control the final amount customers see before placing an order.",
    links: [
      ["Checkout Settings", "/admin/checkout-settings", "Review checkout defaults and per-weight product delivery, packaging and tax configuration."],
      ["Delivery & Tracking", "/admin/delivery", "Manage delivery operations and tracking."],
    ],
  },
];

export default function AdminSettingsPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#f4f7f5", color: "#17251d", padding: "clamp(16px,4vw,36px)", fontFamily: "Arial,sans-serif" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <header style={{ background: "linear-gradient(135deg,#104d36,#123f42)", color: "#fff", borderRadius: 16, padding: "24px clamp(18px,4vw,32px)", borderBottom: "4px solid #b58a43" }}>
          <Link href="/admin" style={{ color: "#e6d2a8", textDecoration: "none", fontSize: 13 }}>← Admin Dashboard</Link>
          <p style={{ color: "#d9c18f", letterSpacing: 2, fontSize: 11, fontWeight: 700, marginBottom: 8 }}>MULTANI MITHAS · BUSINESS CONTROL CENTER</p>
          <h1 style={{ margin: 0, fontSize: "clamp(25px,4vw,34px)" }}>All Settings</h1>
          <p style={{ color: "#e0eee5", marginBottom: 0 }}>Manage the important parts of your store from one simple place.</p>
        </header>
        <section style={{ display: "grid", gap: 18, marginTop: 22 }}>
          {groups.map((group) => (
            <article key={group.title} style={{ background: "#fff", border: "1px solid #e1e8e3", borderRadius: 14, padding: "20px clamp(16px,3vw,26px)" }}>
              <h2 style={{ margin: "0 0 5px", fontSize: 20, color: "#104d36" }}>{group.title}</h2>
              <p style={{ color: "#718078", marginTop: 0, fontSize: 13 }}>{group.description}</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,260px),1fr))", gap: 12 }}>
                {group.links.map(([label, href, detail]) => (
                  <Link key={href} href={href} style={{ display: "block", border: "1px solid #e1e8e3", borderRadius: 10, padding: 16, textDecoration: "none", color: "#17251d", background: "#fbfdfb" }}>
                    <strong style={{ display: "block", color: "#104d36", marginBottom: 7 }}>{label} ↗</strong>
                    <span style={{ color: "#718078", fontSize: 13, lineHeight: 1.6 }}>{detail}</span>
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </section>
        <p style={{ marginTop: 20, textAlign: "center", fontSize: 13 }}>
          <Link href="/admin-login" style={{ color: "#104d36", fontWeight: 700 }}>Admin Login</Link>
          {" · "}
          <Link href="/" style={{ color: "#104d36" }}>Open Customer Website</Link>
        </p>
      </div>
    </main>
  );
}
