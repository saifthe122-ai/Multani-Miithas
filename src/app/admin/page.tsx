
"use client";

import { useState } from "react";

const menu = [
  "Dashboard",
  "Products",
  "Orders",
  "Customers",
  "Social Media",
  "Delivery Tracking",
  "Feedback & Complaints",
  "Accounting",
  "Marketing",
  "Staff & Permissions",
  "Reports",
  "Settings",
];

const demoOrders = [
  { id: "MM-1001", customer: "Customer One", total: "Rs. 2,400", status: "Pending" },
  { id: "MM-1002", customer: "Customer Two", total: "Rs. 3,200", status: "Processing" },
  { id: "MM-1003", customer: "Customer Three", total: "Rs. 1,800", status: "Delivered" },
];

export default function AdminPage() {
  const [active, setActive] = useState("Dashboard");
  const [search, setSearch] = useState("");

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900 md:flex">
      <aside className="bg-slate-950 p-5 text-white md:min-h-screen md:w-64 md:shrink-0">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Multani Mithas</h1>
          <p className="mt-1 text-sm text-amber-300">Admin Panel</p>
        </div>

        <nav className="grid grid-cols-2 gap-2 md:grid-cols-1">
          {menu.map((item) => (
            <button
              key={item}
              onClick={() => setActive(item)}
              className={`rounded-lg px-3 py-3 text-left text-sm transition ${
                active === item
                  ? "bg-amber-500 font-semibold text-slate-950"
                  : "text-slate-200 hover:bg-slate-800"
              }`}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="mt-8 rounded-xl border border-slate-700 p-3 text-xs text-slate-300">
          <p className="font-semibold text-amber-300">Setup Status</p>
          <p className="mt-2">Dashboard interface</p>
          <p>Database: Not connected</p>
          <p>Secure login: Not connected</p>
        </div>
      </aside>

      <section className="min-w-0 flex-1 p-4 md:p-8">
        <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm text-slate-500">Multani Mithas / Admin</p>
            <h2 className="mt-1 text-3xl font-bold">{active}</h2>
            <p className="mt-2 text-sm text-slate-500">
              Manage your sweets, bakery and business operations.
            </p>
          </div>
          <a
            href="/"
            className="inline-block rounded-lg border border-slate-300 bg-white px-5 py-3 text-center text-sm font-semibold hover:bg-slate-50"
          >
            View Website ↗
          </a>
        </header>

        {active === "Dashboard" ? (
          <>
            <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              <strong>Development preview:</strong> The figures and sample orders
              below are demonstration data, not live business records.
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                ["Total Orders", "0", "Connect order database"],
                ["Products", "0", "Connect product database"],
                ["Customers", "0", "Customer records pending"],
                ["Revenue", "Rs. 0", "Real accounting not connected"],
              ].map(([title, value, note]) => (
                <article
                  key={title}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <p className="text-sm text-slate-500">{title}</p>
                  <p className="mt-3 text-2xl font-bold">{value}</p>
                  <p className="mt-2 text-xs text-slate-500">{note}</p>
                </article>
              ))}
            </div>

            <div className="mt-8 grid gap-6 xl:grid-cols-3">
              <article className="rounded-2xl border border-slate-200 bg-white p-5 xl:col-span-2">
                <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <h3 className="text-lg font-bold">Recent Orders</h3>
                  <button
                    onClick={() => setActive("Orders")}
                    className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white"
                  >
                    Manage Orders
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b text-slate-500">
                        <th className="pb-3 pr-4">Order ID</th>
                        <th className="pb-3 pr-4">Customer</th>
                        <th className="pb-3 pr-4">Total</th>
                        <th className="pb-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {demoOrders.map((order) => (
                        <tr key={order.id} className="border-b last:border-0">
                          <td className="py-4 pr-4 font-medium">{order.id}</td>
                          <td className="py-4 pr-4">{order.customer}</td>
                          <td className="py-4 pr-4">{order.total}</td>
                          <td className="py-4">
                            <span className="rounded-full bg-amber-100 px-2 py-1 text-xs">
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-4 text-xs text-slate-500">
                  Sample records only. No actual orders are stored here.
                </p>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="mb-4 text-lg font-bold">Business Modules</h3>
                <div className="space-y-3">
                  {[
                    ["Products & Stock", "Products"],
                    ["Customer Records", "Customers"],
                    ["Delivery Operations", "Delivery Tracking"],
                    ["Income & Expenses", "Accounting"],
                    ["Customer Complaints", "Feedback & Complaints"],
                  ].map(([label, target]) => (
                    <button
                      key={target}
                      onClick={() => setActive(target)}
                      className="flex w-full items-center justify-between rounded-lg border border-slate-200 p-3 text-left text-sm hover:bg-slate-50"
                    >
                      <span>{label}</span>
                      <span className="text-slate-400">→</span>
                    </button>
                  ))}
                </div>
              </article>
            </div>
          </>
        ) : (
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
              Module created
            </span>
            <h3 className="mt-5 text-xl font-bold">{active}</h3>
            <p className="mt-3 leading-7 text-slate-600">
              This module has its own navigation entry. Its live features,
              data forms, permissions and database operations still need
              implementation before business use.
            </p>

            <div className="mt-6 max-w-xl">
              <label htmlFor="module-search" className="mb-2 block text-sm font-medium">
                Search within this module
              </label>
              <input
                id="module-search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={`Search ${active.toLowerCase()}...`}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-amber-500"
              />
              {search && (
                <p className="mt-2 text-sm text-slate-500">
                  Search input is ready; database search is not connected.
                </p>
              )}
            </div>

            <button
              onClick={() => setActive("Dashboard")}
              className="mt-6 rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
            >
              ← Back to Dashboard
            </button>
          </article>
        )}

        <footer className="mt-8 border-t border-slate-200 pt-5 text-xs leading-6 text-slate-500">
          Multani Mithas Business Management System
          <br />
          Secure authentication, real records and server-side permissions must
          be configured before production use.
        </footer>
      </section>
    </main>
  );
}
