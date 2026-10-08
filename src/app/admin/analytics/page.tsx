"use client";

import Link from "next/link";
import { useState } from "react";

type Metric = {
  name: string;
  value: string;
  change: string;
  description: string;
};

type ProductPerformance = {
  product: string;
  category: string;
  orders: number;
  revenue: string;
  growth: string;
};

type SourcePerformance = {
  source: string;
  customers: number;
  orders: number;
  conversion: string;
};

const metrics: Metric[] = [
  {
    name: "Total Sales",
    value: "Rs. 248,500",
    change: "+18.4%",
    description: "Compared with previous period",
  },
  {
    name: "Total Orders",
    value: "486",
    change: "+12.7%",
    description: "Orders received",
  },
  {
    name: "New Customers",
    value: "174",
    change: "+21.3%",
    description: "New customer registrations",
  },
  {
    name: "Repeat Customers",
    value: "96",
    change: "+9.8%",
    description: "Returning customers",
  },
  {
    name: "Average Order",
    value: "Rs. 1,275",
    change: "+6.2%",
    description: "Average order value",
  },
  {
    name: "Conversion Rate",
    value: "4.8%",
    change: "+1.1%",
    description: "Visitors converted to orders",
  },
];

const products: ProductPerformance[] = [
  {
    product: "Multani Sohan Halwa",
    category: "Sweets",
    orders: 142,
    revenue: "Rs. 86,400",
    growth: "+24%",
  },
  {
    product: "Premium Barfi",
    category: "Sweets",
    orders: 118,
    revenue: "Rs. 63,200",
    growth: "+17%",
  },
  {
    product: "Gulab Jamun",
    category: "Sweets",
    orders: 94,
    revenue: "Rs. 31,500",
    growth: "+11%",
  },
  {
    product: "Premium Gift Box",
    category: "Gift Boxes",
    orders: 76,
    revenue: "Rs. 45,600",
    growth: "+29%",
  },
  {
    product: "Besan Ladoo",
    category: "Sweets",
    orders: 56,
    revenue: "Rs. 21,800",
    growth: "+8%",
  },
];

const sources: SourcePerformance[] = [
  {
    source: "Instagram",
    customers: 246,
    orders: 112,
    conversion: "45.5%",
  },
  {
    source: "WhatsApp",
    customers: 321,
    orders: 158,
    conversion: "49.2%",
  },
  {
    source: "Facebook",
    customers: 184,
    orders: 76,
    conversion: "41.3%",
  },
  {
    source: "TikTok",
    customers: 94,
    orders: 41,
    conversion: "43.6%",
  },
  {
    source: "Direct Website",
    customers: 392,
    orders: 99,
    conversion: "25.3%",
  },
];

const cardStyle = {
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: 16,
  padding: 20,
  boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
};

export default function AnalyticsDashboard() {
  const [period, setPeriod] = useState("This Month");

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f7f9",
        padding: 28,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: 1450, margin: "0 auto" }}>
        <Link
          href="/admin"
          style={{
            display: "inline-block",
            marginBottom: 18,
            color: "#166534",
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          ← Back to Admin Dashboard
        </Link>

        {/* Header */}
        <header
          style={{
            background:
              "linear-gradient(135deg,#166534,#15803d)",
            color: "#fff",
            borderRadius: 20,
            padding: 28,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 15,
              flexWrap: "wrap",
            }}
          >
            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: 30,
                }}
              >
                Business Analytics
              </h1>

              <p
                style={{
                  margin: "8px 0 0",
                  opacity: 0.9,
                }}
              >
                Understand sales, customers, products,
                marketing and business performance.
              </p>
            </div>

            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              style={{
                padding: "11px 14px",
                borderRadius: 10,
                border: "none",
                background: "#fff",
                color: "#111827",
                fontWeight: 700,
              }}
            >
              <option>This Week</option>
              <option>This Month</option>
              <option>This Quarter</option>
              <option>This Year</option>
            </select>
          </div>
        </header>

        {/* Main Metrics */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(200px,1fr))",
            gap: 16,
            marginBottom: 24,
          }}
        >
          {metrics.map((metric) => (
            <div key={metric.name} style={cardStyle}>
              <div
                style={{
                  color: "#6b7280",
                  fontSize: 14,
                  marginBottom: 10,
                }}
              >
                {metric.name}
              </div>

              <div
                style={{
                  fontSize: 26,
                  fontWeight: 800,
                  color: "#111827",
                }}
              >
                {metric.value}
              </div>

              <div
                style={{
                  marginTop: 8,
                  color: "#16a34a",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                {metric.change}
              </div>

              <div
                style={{
                  marginTop: 5,
                  color: "#9ca3af",
                  fontSize: 12,
                }}
              >
                {metric.description}
              </div>
            </div>
          ))}
        </section>

        {/* Sales Overview */}
        <section
          style={{
            ...cardStyle,
            marginBottom: 24,
          }}
        >
          <h2 style={{ marginTop: 0 }}>
            Sales Overview
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(180px,1fr))",
              gap: 14,
            }}
          >
            {[
              ["Monday", "Rs. 28,400"],
              ["Tuesday", "Rs. 34,200"],
              ["Wednesday", "Rs. 31,800"],
              ["Thursday", "Rs. 42,500"],
              ["Friday", "Rs. 38,600"],
              ["Saturday", "Rs. 46,200"],
              ["Sunday", "Rs. 26,800"],
            ].map(([day, amount]) => (
              <div
                key={day}
                style={{
                  padding: 18,
                  borderRadius: 12,
                  background: "#f9fafb",
                  border: "1px solid #e5e7eb",
                }}
              >
                <div
                  style={{
                    color: "#6b7280",
                    fontSize: 13,
                  }}
                >
                  {day}
                </div>

                <div
                  style={{
                    marginTop: 8,
                    fontSize: 20,
                    fontWeight: 800,
                  }}
                >
                  {amount}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Product Performance */}
        <section
          style={{
            ...cardStyle,
            marginBottom: 24,
          }}
        >
          <h2 style={{ marginTop: 0 }}>
            Product Performance
          </h2>

          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: 800,
              }}
            >
              <thead>
                <tr>
                  {[
                    "Product",
                    "Category",
                    "Orders",
                    "Revenue",
                    "Growth",
                  ].map((heading) => (
                    <th
                      key={heading}
                      style={{
                        textAlign: "left",
                        padding: 14,
                        borderBottom:
                          "2px solid #e5e7eb",
                        color: "#6b7280",
                        fontSize: 13,
                      }}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr key={product.product}>
                    <td
                      style={{
                        padding: 14,
                        fontWeight: 700,
                      }}
                    >
                      {product.product}
                    </td>

                    <td style={{ padding: 14 }}>
                      {product.category}
                    </td>

                    <td style={{ padding: 14 }}>
                      {product.orders}
                    </td>

                    <td style={{ padding: 14 }}>
                      {product.revenue}
                    </td>

                    <td
                      style={{
                        padding: 14,
                        color: "#16a34a",
                        fontWeight: 700,
                      }}
                    >
                      {product.growth}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Customer Analytics */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(260px,1fr))",
            gap: 20,
            marginBottom: 24,
          }}
        >
          <div style={cardStyle}>
            <h2 style={{ marginTop: 0 }}>
              Customer Analytics
            </h2>

            <p>
              <strong>New Customers:</strong> 174
            </p>

            <p>
              <strong>Repeat Customers:</strong> 96
            </p>

            <p>
              <strong>Active Customers:</strong> 438
            </p>

            <p style={{ marginBottom: 0 }}>
              <strong>Average Orders:</strong> 2.7
            </p>
          </div>

          <div style={cardStyle}>
            <h2 style={{ marginTop: 0 }}>
              Delivery Analytics
            </h2>

            <p>
              <strong>Delivered:</strong> 412
            </p>

            <p>
              <strong>Average Delivery:</strong> 42 min
            </p>

            <p>
              <strong>Failed:</strong> 9
            </p>

            <p style={{ marginBottom: 0 }}>
              <strong>On-Time Rate:</strong> 94.6%
            </p>
          </div>

          <div style={cardStyle}>
            <h2 style={{ marginTop: 0 }}>
              Complaint Analytics
            </h2>

            <p>
              <strong>Total:</strong> 28
            </p>

            <p>
              <strong>Open:</strong> 7
            </p>

            <p>
              <strong>Resolved:</strong> 21
            </p>

            <p style={{ marginBottom: 0 }}>
              <strong>Resolution Rate:</strong> 75%
            </p>
          </div>
        </section>

        {/* Social Sources */}
        <section
          style={{
            ...cardStyle,
            marginBottom: 24,
          }}
        >
          <h2 style={{ marginTop: 0 }}>
            Customer Source & Social Performance
          </h2>

          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: 750,
              }}
            >
              <thead>
                <tr>
                  {[
                    "Source",
                    "Customers",
                    "Orders",
                    "Conversion",
                  ].map((heading) => (
                    <th
                      key={heading}
                      style={{
                        textAlign: "left",
                        padding: 14,
                        borderBottom:
                          "2px solid #e5e7eb",
                        color: "#6b7280",
                        fontSize: 13,
                      }}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {sources.map((source) => (
                  <tr key={source.source}>
                    <td
                      style={{
                        padding: 14,
                        fontWeight: 700,
                      }}
                    >
                      {source.source}
                    </td>

                    <td style={{ padding: 14 }}>
                      {source.customers}
                    </td>

                    <td style={{ padding: 14 }}>
                      {source.orders}
                    </td>

                    <td
                      style={{
                        padding: 14,
                        color: "#166534",
                        fontWeight: 800,
                      }}
                    >
                      {source.conversion}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Smart Intelligence */}
        <section
          style={{
            ...cardStyle,
            background: "#ecfdf5",
            borderColor: "#bbf7d0",
          }}
        >
          <h2 style={{ marginTop: 0 }}>
            Smart Business Intelligence
          </h2>

          <p>
            • Identify best-selling products and
            profitable categories.
          </p>

          <p>
            • Compare new customers with repeat
            customers.
          </p>

          <p>
            • Track which social platforms generate
            customers and orders.
          </p>

          <p>
            • Measure delivery performance and
            complaint resolution.
          </p>

          <p style={{ marginBottom: 0 }}>
            • Future database integration will replace
            demo metrics with real-time business data.
          </p>
        </section>
      </div>
    </main>
  );
}