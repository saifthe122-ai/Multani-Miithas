
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard, ShoppingBag, Package, Users, Truck,
  ChartNoAxesCombined, MessageSquare, Settings, Megaphone,
  Wallet, Search, Bell, Menu, ArrowUpRight, ArrowDownRight,
  CircleCheck, Clock, MoreHorizontal, Plus, ExternalLink,
  Store, ShieldCheck, Globe, Video
} from "lucide-react";

const nav = [
  { title: "MAIN MENU", items: [
    { label: "Dashboard", icon: LayoutDashboard },
    { label: "Orders", icon: ShoppingBag },
    { label: "Products", icon: Package },
    { label: "Customers", icon: Users },
  ]},
  { title: "BUSINESS", items: [
    { label: "Delivery Tracking", icon: Truck },
    { label: "Marketing", icon: Megaphone },
    { label: "Social Media", icon: Globe },
    { label: "Feedback", icon: MessageSquare },
    { label: "Accounting", icon: Wallet },
    { label: "Reports", icon: ChartNoAxesCombined },
  ]},
  { title: "SYSTEM", items: [
    { label: "Settings", icon: Settings },
  ]},
];

const stats = [
  { label: "Total Revenue", value: "Rs. 0", change: "Sales overview", icon: Wallet, color: "#dbeafe", ink: "#2563eb" },
  { label: "Total Orders", value: "0", change: "All orders", icon: ShoppingBag, color: "#dcfce7", ink: "#15803d" },
  { label: "Total Products", value: "0", change: "Product catalogue", icon: Package, color: "#f3e8ff", ink: "#7e22ce" },
  { label: "Total Customers", value: "0", change: "Customer records", icon: Users, color: "#ffedd5", ink: "#c2410c" },
];

export default function AdminPage() {
  const [active, setActive] = useState("Dashboard");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7fb", color: "#172033", fontFamily: "Arial, sans-serif", display: "flex" }}>
      <style>{`
        * { box-sizing: border-box; }
        button, input { font: inherit; }
        .mm-sidebar { width: 252px; background: #142d25; color: #d8e5dc; padding: 25px 16px; flex-shrink: 0; min-height: 100vh; }
        .mm-main { min-width: 0; flex: 1; }
        .mm-card { background: white; border: 1px solid #e8edf3; border-radius: 14px; padding: 21px; }
        .mm-stat-grid { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 16px; }
        .mm-content-grid { display: grid; grid-template-columns: minmax(0,1.65fr) minmax(260px,1fr); gap: 20px; }
        .mm-nav { width: 100%; display: flex; align-items: center; gap: 12px; padding: 11px 12px; border: 0; border-radius: 9px; background: transparent; color: #c7d5cd; cursor: pointer; text-align: left; font-size: 13px; margin: 3px 0; }
        .mm-nav.active { background: #285642; color: white; font-weight: 700; }
        .mm-btn { border: 1px solid #e1e7ed; background: white; color: #253247; padding: 10px 13px; border-radius: 9px; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 8px; font-size: 12px; font-weight: 700; }
        .mm-primary { background: #18754e; border-color: #18754e; color: white; }
        .mm-table { width: 100%; border-collapse: collapse; font-size: 12px; }
        .mm-table th { text-align: left; padding: 13px 10px; color: #7a8799; font-size: 10px; letter-spacing: .06em; border-bottom: 1px solid #e9edf2; }
        .mm-table td { padding: 15px 10px; border-bottom: 1px solid #eef1f5; }
        .mm-table tr:last-child td { border-bottom: 0; }
        @media(max-width:1100px) { .mm-stat-grid { grid-template-columns: repeat(2,minmax(0,1fr)); } .mm-content-grid { grid-template-columns: 1fr; } }
        @media(max-width:720px) { .mm-sidebar { display: none; } .mm-stat-grid { grid-template-columns: 1fr 1fr; gap: 10px; } .mm-card { padding: 15px; } .mm-table th,.mm-table td { padding: 11px 6px; } .mm-hide-mobile { display: none; } .mm-heading { font-size: 21px !important; } }
        @media(max-width:390px) { .mm-stat-grid { grid-template-columns: 1fr; } }
      `}</style>

      <aside className="mm-sidebar">
        <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 32, padding: "0 7px" }}>
          <div style={{ width: 43, height: 43, borderRadius: 12, background: "#e8b85d", color: "#17382b", display: "grid", placeItems: "center" }}>
            <Store size={24} />
          </div>
          <div>
            <div style={{ color: "white", fontWeight: 800, fontSize: 16 }}>MULTANI MITHAS</div>
            <div style={{ color: "#9eb8a9", fontSize: 10, marginTop: 4 }}>BUSINESS MANAGEMENT</div>
          </div>
        </div>

        {nav.map((group) => (
          <div key={group.title} style={{ marginBottom: 23 }}>
            <div style={{ fontSize: 10, letterSpacing: "1.5px", color: "#91a99b", padding: "0 12px", marginBottom: 10, fontWeight: 700 }}>{group.title}</div>
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <button key={item.label} className={`mm-nav ${active === item.label ? "active" : ""}`} onClick={() => { setActive(item.label); setMobileMenu(false); }}>
                  <Icon size={17} strokeWidth={1.8} />
                  <span>{item.label}</span>
                  {active === item.label && <span style={{ marginLeft: "auto", width: 5, height: 5, borderRadius: 5, background: "#e8b85d" }} />}
                </button>
              );
            })}
          </div>
        ))}

        <div style={{ marginTop: 30, padding: 15, background: "#1b3c30", border: "1px solid #315343", borderRadius: 12 }}>
          <ShieldCheck size={21} color="#e8b85d" />
          <div style={{ color: "white", fontSize: 12, fontWeight: 700, marginTop: 10 }}>Business Control Center</div>
          <div style={{ color: "#a9beb1", fontSize: 11, lineHeight: 1.6, marginTop: 6 }}>Manage your business from one place.</div>
        </div>
        <div style={{ color: "#91a99b", fontSize: 10, marginTop: 28, padding: "0 7px" }}>MULTANI MITHAS • ADMIN</div>
      </aside>

      <main className="mm-main">
        <header style={{ background: "white", borderBottom: "1px solid #e7ebf0", padding: "15px 25px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button className="mm-btn" onClick={() => setMobileMenu(!mobileMenu)} style={{ padding: 9 }}><Menu size={18} /></button>
            <div>
              <div style={{ fontSize: 11, color: "#8792a3" }}>Multani Mithas / Admin</div>
              <div style={{ fontSize: 16, fontWeight: 800, marginTop: 4 }}>{active}</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="mm-hide-mobile" style={{ position: "relative" }}>
              <Search size={15} color="#8995a5" style={{ position: "absolute", left: 11, top: 11 }} />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search dashboard..." style={{ width: 190, padding: "10px 12px 10px 33px", border: "1px solid #e1e7ed", borderRadius: 9, outline: "none", fontSize: 12 }} />
            </div>
            <button className="mm-btn" aria-label="Notifications" style={{ padding: 10, position: "relative" }}><Bell size={17} /><span style={{ position: "absolute", top: 6, right: 6, width: 6, height: 6, borderRadius: 6, background: "#e05252" }} /></button>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#e0eee5", color: "#17643f", display: "grid", placeItems: "center", fontWeight: 800, fontSize: 12 }}>MM</div>
          </div>
        </header>

        {mobileMenu && <div style={{ background: "#142d25", padding: 14, display: "flex", flexWrap: "wrap", gap: 6 }}>
          {nav.flatMap(g => g.items).map(item => <button key={item.label} className="mm-nav" style={{ width: "auto" }} onClick={() => { setActive(item.label); setMobileMenu(false); }}>{item.label}</button>)}
        </div>}

        <div style={{ padding: "26px", maxWidth: 1600, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14, marginBottom: 23 }}>
            <div>
              <h1 className="mm-heading" style={{ fontSize: 27, margin: 0, letterSpacing: "-.7px" }}>Welcome back, Admin 👋</h1>
              <p style={{ color: "#7a8799", fontSize: 13, marginTop: 8, marginBottom: 0 }}>Here is your Multani Mithas business overview.</p>
            </div>
            <div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}>
              <Link href="/" className="mm-btn" style={{ textDecoration: "none" }}><ExternalLink size={14} /> View Website</Link>
              <button className="mm-btn mm-primary" onClick={() => setActive("Products")}><Plus size={15} /> Manage Products</button>
            </div>
          </div>

          <div style={{ background: "#eaf5ed", border: "1px solid #cfe6d5", borderRadius: 12, padding: "13px 16px", display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 22 }}>
            <CircleCheck size={18} color="#20804b" style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#21643c" }}>Admin dashboard design is ready</div>
              <div style={{ fontSize: 11, color: "#4d765b", marginTop: 4, lineHeight: 1.6 }}>This is the visual dashboard. Database connection, secure login, live orders and accounting still need to be configured.</div>
            </div>
          </div>

          <div className="mm-stat-grid" style={{ marginBottom: 22 }}>
            {stats.map((s) => {
              const Icon = s.icon;
              return <div className="mm-card" key={s.label}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                  <span style={{ color: "#748195", fontSize: 12, fontWeight: 600 }}>{s.label}</span>
                  <div style={{ background: s.color, color: s.ink, width: 39, height: 39, borderRadius: 11, display: "grid", placeItems: "center" }}><Icon size={19} /></div>
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-.5px", marginTop: 16 }}>{s.value}</div>
                <div style={{ color: "#8b96a5", fontSize: 11, marginTop: 8 }}>{s.change}</div>
              </div>;
            })}
          </div>

          <div className="mm-content-grid" style={{ marginBottom: 22 }}>
            <section className="mm-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div><h2 style={{ fontSize: 15, margin: 0 }}>Recent Orders</h2><p style={{ fontSize: 11, color: "#8994a4", marginTop: 5 }}>Latest order activity</p></div>
                <button className="mm-btn" onClick={() => setActive("Orders")}>View all <ArrowUpRight size={14} /></button>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table className="mm-table">
                  <thead><tr><th>ORDER</th><th>CUSTOMER</th><th>AMOUNT</th><th>STATUS</th></tr></thead>
                  <tbody>
                    <tr><td colSpan={4} style={{ padding: "28px 10px", textAlign: "center", color: "#8994a4" }}>No live orders yet. Orders will appear here after the backend is connected.</td></tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mm-card">
              <h2 style={{ fontSize: 15, margin: 0 }}>Business Setup</h2>
              <p style={{ fontSize: 11, color: "#8994a4", marginTop: 5, marginBottom: 20 }}>Progress towards a working business system</p>
              {[
                { label: "Dashboard design", status: "Ready", color: "#16804a", bg: "#dcfce7", icon: CircleCheck },
                { label: "Product database", status: "Pending", color: "#a16207", bg: "#fef3c7", icon: Clock },
                { label: "Secure admin login", status: "Pending", color: "#a16207", bg: "#fef3c7", icon: Clock },
                { label: "Order management", status: "Pending", color: "#a16207", bg: "#fef3c7", icon: Clock },
              ].map((r) => {
                const Icon = r.icon;
                return <div key={r.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, padding: "12px 0", borderBottom: "1px solid #eef1f5" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 12 }}><Icon size={16} color={r.color} />{r.label}</div>
                  <span style={{ background: r.bg, color: r.color, borderRadius: 6, padding: "5px 8px", fontSize: 10, fontWeight: 700 }}>{r.status}</span>
                </div>;
              })}
            </section>
          </div>

          <div className="mm-content-grid">
            <section className="mm-card">
              <h2 style={{ fontSize: 15, margin: 0 }}>Business Shortcuts</h2>
              <p style={{ fontSize: 11, color: "#8994a4", marginTop: 5, marginBottom: 18 }}>Choose a section to continue managing your business.</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(145px,1fr))", gap: 10 }}>
                {[
                  { label: "Products", desc: "Catalogue & pricing", icon: Package, color: "#2563eb", bg: "#eff6ff" },
                  { label: "Orders", desc: "Order processing", icon: ShoppingBag, color: "#15803d", bg: "#f0fdf4" },
                  { label: "Marketing", desc: "Offers & campaigns", icon: Megaphone, color: "#9333ea", bg: "#faf5ff" },
                  { label: "Accounting", desc: "Income & expenses", icon: Wallet, color: "#c2410c", bg: "#fff7ed" },
                  { label: "Delivery Tracking", desc: "Delivery operations", icon: Truck, color: "#0f766e", bg: "#f0fdfa" },
                  { label: "Feedback", desc: "Customer reviews", icon: MessageSquare, color: "#be123c", bg: "#fff1f2" },
                ].map((item) => {
                  const Icon = item.icon;
                  return <button key={item.label} onClick={() => setActive(item.label)} style={{ textAlign: "left", border: "1px solid #e8edf3", background: "white", borderRadius: 11, padding: 14, cursor: "pointer" }}>
                    <div style={{ width: 36, height: 36, borderRadius: 9, display: "grid", placeItems: "center", color: item.color, background: item.bg }}><Icon size={18} /></div>
                    <div style={{ fontSize: 12, fontWeight: 800, marginTop: 12 }}>{item.label}</div>
                    <div style={{ fontSize: 10, color: "#8994a4", marginTop: 5 }}>{item.desc}</div>
                  </button>;
                })}
              </div>
            </section>
            <section className="mm-card">
              <h2 style={{ fontSize: 15, margin: 0 }}>Quick Information</h2>
              <p style={{ fontSize: 11, color: "#8994a4", marginTop: 5 }}>System status</p>
              <div style={{ padding: 14, background: "#f8fafc", border: "1px solid #edf0f4", borderRadius: 10, marginTop: 15 }}>
                <div style={{ display: "flex", gap: 9, alignItems: "center" }}><Store size={18} color="#18754e" /><span style={{ fontSize: 12, fontWeight: 700 }}>Multani Mithas Store</span></div>
                <div style={{ fontSize: 11, color: "#8994a4", marginTop: 9, lineHeight: 1.7 }}>Your dashboard interface is displayed. Connect a database before storing real customer or business records.</div>
              </div>
              <div style={{ marginTop: 13, display: "flex", alignItems: "center", gap: 9, fontSize: 11, color: "#748195" }}><Video size={16} /> Product images and videos can be added in a later step.</div>
              <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 9, fontSize: 11, color: "#748195" }}><ShieldCheck size={16} /> Secure login is not yet configured.</div>
            </section>
          </div>

          <footer style={{ borderTop: "1px solid #e5eaf0", marginTop: 25, padding: "18px 0 4px", color: "#8b96a5", fontSize: 10, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <span>© Multani Mithas • Business Management</span>
            <span>Dashboard UI • Live data not connected</span>
          </footer>
        </div>
      </main>
    </div>
  );
}