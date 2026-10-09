"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  Bot,
  CheckCircle2,
  CircleAlert,
  Code2,
  CreditCard,
  Globe,
  Layers3,
  Play,
  RefreshCw,
  Search,
  Share2,
  ShieldCheck,
  Truck,
  X,
  Zap,
} from "lucide-react";

type Integration = {
  id: string;
  name: string;
  category: string;
  description: string;
  endpoint: string | null;
  features: string[];
  icon: typeof Globe;
};

const integrations: Integration[] = [
  {
    id: "payments",
    name: "Payment Gateways",
    category: "Payments",
    description: "Manage payment methods and test payment API responses.",
    endpoint: "/api/payments",
    features: ["Cash on Delivery", "Bank Transfer", "JazzCash", "Easypaisa", "International Payments"],
    icon: CreditCard,
  },
  {
    id: "delivery",
    name: "Delivery & Logistics",
    category: "Delivery",
    description: "Test delivery requests and inspect API responses.",
    endpoint: "/api/delivery",
    features: ["Delivery requests", "Status validation", "Tracking preparation"],
    icon: Truck,
  },
  {
    id: "social",
    name: "Social Media Tracking",
    category: "Marketing",
    description: "Validate traffic sources from social platforms.",
    endpoint: "/api/social-tracking",
    features: ["Facebook", "Instagram", "YouTube", "TikTok", "LinkedIn", "WhatsApp", "X / Twitter"],
    icon: Share2,
  },
  {
    id: "newsletter",
    name: "Newsletter",
    category: "Marketing",
    description: "Test newsletter subscription requests.",
    endpoint: "/api/newsletter",
    features: ["Email validation", "Subscription requests"],
    icon: Zap,
  },
  {
    id: "referrals",
    name: "Referral System",
    category: "Marketing",
    description: "Validate referral code requests.",
    endpoint: "/api/referrals",
    features: ["Referral code validation", "Referral requests"],
    icon: Layers3,
  },
  {
    id: "products",
    name: "Products API",
    category: "Website APIs",
    description: "Inspect the product API response.",
    endpoint: "/api/products",
    features: ["Product requests", "Product categories", "Price validation"],
    icon: Globe,
  },
  {
    id: "orders",
    name: "Orders API",
    category: "Website APIs",
    description: "Test order request validation.",
    endpoint: "/api/orders",
    features: ["Customer details", "Order item validation"],
    icon: Activity,
  },
  {
    id: "customers",
    name: "Customers API",
    category: "Website APIs",
    description: "Test customer API responses.",
    endpoint: "/api/customers",
    features: ["Customer details", "Email validation"],
    icon: Layers3,
  },
  {
    id: "coupons",
    name: "Coupons API",
    category: "Website APIs",
    description: "Test coupon request validation.",
    endpoint: "/api/coupons",
    features: ["Coupon codes", "Discount validation"],
    icon: Zap,
  },
  {
    id: "reviews",
    name: "Reviews API",
    category: "Website APIs",
    description: "Test product review and rating requests.",
    endpoint: "/api/reviews",
    features: ["Product ratings", "Review requests"],
    icon: Activity,
  },
  {
    id: "feedback",
    name: "Feedback API",
    category: "Website APIs",
    description: "Test feedback and complaint requests.",
    endpoint: "/api/feedback",
    features: ["Customer feedback", "Complaint requests"],
    icon: Layers3,
  },
  {
    id: "ai",
    name: "AI & Automation",
    category: "AI & Automation",
    description: "Plan future business automation integrations.",
    endpoint: null,
    features: ["Sales insights", "Low-stock alerts", "Order assistance", "Automated reports"],
    icon: Bot,
  },
];

const categories = [
  "All Integrations",
  "Payments",
  "Delivery",
  "Marketing",
  "Website APIs",
  "AI & Automation",
];

type TestResult = {
  ok: boolean;
  message: string;
  status: number | null;
  data: unknown;
  checkedAt: string;
};

export default function ApiIntegrationsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Integrations");
  const [selected, setSelected] = useState<Integration | null>(null);
  const [results, setResults] = useState<Record<string, TestResult>>({});
  const [testing, setTesting] = useState<string[]>([]);

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();

    return integrations.filter((item) => {
      const matchesCategory =
        category === "All Integrations" || item.category === category;

      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.features.some((feature) =>
          feature.toLowerCase().includes(query)
        );

      return matchesCategory && matchesSearch;
    });
  }, [search, category]);

  const testedCount = Object.keys(results).length;
  const successfulCount = Object.values(results).filter(
    (result) => result.ok
  ).length;

  async function testApi(item: Integration) {
    if (!item.endpoint || testing.includes(item.id)) return;

    setTesting((current) => [...current, item.id]);

    try {
      const response = await fetch(item.endpoint, {
        method: "GET",
        cache: "no-store",
        headers: { Accept: "application/json" },
      });

      let data: unknown;

      try {
        data = await response.json();
      } catch {
        data = { message: "Endpoint did not return JSON." };
      }

      setResults((current) => ({
        ...current,
        [item.id]: {
          ok: response.ok,
          message: response.ok
            ? "Endpoint responded successfully"
            : "Endpoint returned an error",
          status: response.status,
          data,
          checkedAt: new Date().toLocaleString(),
        },
      }));
    } catch {
      setResults((current) => ({
        ...current,
        [item.id]: {
          ok: false,
          message: "Request failed. Check deployment and endpoint.",
          status: null,
          data: null,
          checkedAt: new Date().toLocaleString(),
        },
      }));
    } finally {
      setTesting((current) =>
        current.filter((id) => id !== item.id)
      );
    }
  }

  const page: React.CSSProperties = {
    minHeight: "100vh",
    background: "#f4f5fb",
    color: "#20243a",
    padding: "28px",
    fontFamily: "Arial, Helvetica, sans-serif",
  };

  const card: React.CSSProperties = {
    background: "#ffffff",
    border: "1px solid #e7e9f1",
    borderRadius: 16,
    padding: 20,
    boxShadow: "0 5px 18px rgba(32,36,58,0.035)",
  };

  const muted: React.CSSProperties = { color: "#737b91" };

  const button: React.CSSProperties = {
    border: "1px solid #dfe3ed",
    borderRadius: 10,
    padding: "10px 13px",
    background: "#ffffff",
    color: "#303650",
    cursor: "pointer",
    fontWeight: 600,
  };

  return (
    <main style={page}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <header
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 18,
            marginBottom: 26,
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                color: "#6755d9",
                fontWeight: 700,
                fontSize: 12,
                letterSpacing: 1.5,
                marginBottom: 12,
              }}
            >
              <Code2 size={17} />
              BUSINESS CONTROL CENTER
            </div>

            <h1
              style={{
                fontSize: 30,
                margin: "0 0 10px",
                letterSpacing: -0.8,
              }}
            >
              API & Integrations
            </h1>

            <p style={{ ...muted, margin: 0, lineHeight: 1.6 }}>
              Manage, inspect and test Multani Mithas integrations.
            </p>
          </div>

          <div
            style={{
              ...card,
              display: "flex",
              gap: 12,
              alignItems: "center",
              padding: "13px 17px",
            }}
          >
            <ShieldCheck size={25} color="#6755d9" />
            <div>
              <div style={{ fontWeight: 700, fontSize: 13 }}>
                Security overview
              </div>
              <div style={{ ...muted, fontSize: 12, marginTop: 4 }}>
                Provider connections not assumed
              </div>
            </div>
          </div>
        </header>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
            gap: 16,
            marginBottom: 25,
          }}
        >
          <div style={card}>
            <div style={{ ...muted, fontSize: 13 }}>Total integrations</div>
            <div style={{ fontSize: 31, fontWeight: 800, margin: "12px 0 5px" }}>
              {integrations.length}
            </div>
            <div style={{ ...muted, fontSize: 12 }}>Across all categories</div>
          </div>

          <div style={card}>
            <div style={{ ...muted, fontSize: 13 }}>Testable endpoints</div>
            <div style={{ fontSize: 31, fontWeight: 800, margin: "12px 0 5px" }}>
              {integrations.filter((item) => item.endpoint).length}
            </div>
            <div style={{ ...muted, fontSize: 12 }}>GET request tests available</div>
          </div>

          <div style={card}>
            <div style={{ ...muted, fontSize: 13 }}>Successful API tests</div>
            <div style={{ fontSize: 31, fontWeight: 800, color: "#17845b", margin: "12px 0 5px" }}>
              {successfulCount}
            </div>
            <div style={{ ...muted, fontSize: 12 }}>
              Out of {testedCount} tested endpoints
            </div>
          </div>

          <div style={card}>
            <div style={{ ...muted, fontSize: 13 }}>Live connections</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#b7791f", margin: "17px 0 10px" }}>
              Not verified
            </div>
            <div style={{ ...muted, fontSize: 12 }}>
              Requires real provider setup
            </div>
          </div>
        </section>

        <section style={{ ...card, marginBottom: 22 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 14,
              justifyContent: "space-between",
              marginBottom: 18,
            }}
          >
            <div>
              <h2 style={{ fontSize: 18, margin: "0 0 6px" }}>
                Integration directory
              </h2>
              <p style={{ ...muted, margin: 0, fontSize: 13 }}>
                Search integrations or choose a category.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                gap: 9,
                alignItems: "center",
                border: "1px solid #e0e3ed",
                borderRadius: 10,
                padding: "0 12px",
                background: "#fff",
                minWidth: 230,
              }}
            >
              <Search size={17} color="#737b91" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search integrations..."
                aria-label="Search integrations"
                style={{
                  border: 0,
                  outline: 0,
                  padding: "12px 0",
                  width: "100%",
                  background: "transparent",
                  color: "#20243a",
                }}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                style={{
                  ...button,
                  background: category === item ? "#6755d9" : "#fff",
                  color: category === item ? "#fff" : "#4c536a",
                  borderColor: category === item ? "#6755d9" : "#e0e3ed",
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(265px, 1fr))",
            gap: 17,
          }}
        >
          {filtered.map((item) => {
            const Icon = item.icon;
            const result = results[item.id];
            const isTesting = testing.includes(item.id);

            return (
              <article
                key={item.id}
                style={{
                  ...card,
                  display: "flex",
                  flexDirection: "column",
                  minWidth: 0,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      display: "grid",
                      placeItems: "center",
                      borderRadius: 14,
                      background: "#f0edff",
                      color: "#6755d9",
                    }}
                  >
                    <Icon size={23} />
                  </div>

                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "7px 9px",
                      borderRadius: 20,
                      background: result
                        ? result.ok
                          ? "#e5f7ed"
                          : "#fff0ed"
                        : "#fff5df",
                      color: result
                        ? result.ok
                          ? "#18794e"
                          : "#b42318"
                        : "#946200",
                    }}
                  >
                    {result
                      ? result.ok
                        ? "API Responding"
                        : "Test Failed"
                      : "Not Verified"}
                  </span>
                </div>

                <div style={{ marginTop: 18 }}>
                  <div style={{ ...muted, fontSize: 12, marginBottom: 7 }}>
                    {item.category}
                  </div>
                  <h3 style={{ fontSize: 18, margin: "0 0 9px" }}>
                    {item.name}
                  </h3>
                  <p
                    style={{
                      ...muted,
                      fontSize: 13,
                      lineHeight: 1.6,
                      minHeight: 42,
                      margin: 0,
                    }}
                  >
                    {item.description}
                  </p>
                </div>

                <div
                  style={{
                    background: "#f7f8fc",
                    borderRadius: 9,
                    padding: 11,
                    marginTop: 16,
                    fontSize: 12,
                    color: "#626a80",
                    overflowWrap: "anywhere",
                  }}
                >
                  <div style={{ fontWeight: 700, marginBottom: 5 }}>
                    API endpoint
                  </div>
                  {item.endpoint ?? "Not configured"}
                </div>

                {result && (
                  <div
                    style={{
                      fontSize: 12,
                      color: result.ok ? "#18794e" : "#b42318",
                      marginTop: 12,
                      display: "flex",
                      gap: 7,
                      alignItems: "center",
                    }}
                  >
                    {result.ok ? (
                      <CheckCircle2 size={15} />
                    ) : (
                      <CircleAlert size={15} />
                    )}
                    {result.message}
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    gap: 9,
                    marginTop: "auto",
                    paddingTop: 20,
                  }}
                >
                  <button
                    onClick={() => setSelected(item)}
                    style={{ ...button, flex: 1 }}
                  >
                    View details{" "}
                    <ArrowUpRight size={14} style={{ verticalAlign: "middle" }} />
                  </button>

                  {item.endpoint && (
                    <button
                      onClick={() => testApi(item)}
                      disabled={isTesting}
                      style={{
                        ...button,
                        background: "#6755d9",
                        color: "#fff",
                        borderColor: "#6755d9",
                        opacity: isTesting ? 0.65 : 1,
                      }}
                    >
                      {isTesting ? (
                        <RefreshCw size={15} style={{ verticalAlign: "middle" }} />
                      ) : (
                        <Play size={15} style={{ verticalAlign: "middle" }} />
                      )}{" "}
                      {isTesting ? "Testing" : "Test"}
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </section>

        {filtered.length === 0 && (
          <div style={{ ...card, textAlign: "center", padding: 45 }}>
            <Search size={30} color="#737b91" />
            <h3>No integrations found</h3>
            <p style={muted}>Try another search or category.</p>
            <button
              style={button}
              onClick={() => {
                setSearch("");
                setCategory("All Integrations");
              }}
            >
              Clear filters
            </button>
          </div>
        )}

        <section
          style={{
            ...card,
            marginTop: 24,
            display: "flex",
            gap: 14,
            alignItems: "flex-start",
          }}
        >
          <ShieldCheck size={24} color="#6755d9" />
          <div>
            <h3 style={{ margin: "0 0 8px", fontSize: 15 }}>
              Security & connection status
            </h3>
            <p style={{ ...muted, fontSize: 13, lineHeight: 1.7, margin: 0 }}>
              An API test only confirms that an endpoint responds. It does not
              prove a payment provider, delivery company, database or social
              platform is connected. Keep secret keys in secure server-side
              environment variables.
            </p>
          </div>
        </section>
      </div>

      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            background: "rgba(22,25,44,0.45)",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <aside
            role="dialog"
            aria-modal="true"
            aria-label={`${selected.name} details`}
            onClick={(event) => event.stopPropagation()}
            style={{
              width: "min(480px, 100%)",
              height: "100%",
              overflowY: "auto",
              background: "#fff",
              padding: 28,
              boxShadow: "-10px 0 40px rgba(0,0,0,0.12)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div style={{ color: "#6755d9", fontWeight: 700, fontSize: 12 }}>
                INTEGRATION DETAILS
              </div>
              <button
                onClick={() => setSelected(null)}
                aria-label="Close details"
                style={button}
              >
                <X size={18} />
              </button>
            </div>

            <h2 style={{ fontSize: 25, marginTop: 24 }}>
              {selected.name}
            </h2>
            <p style={{ ...muted, lineHeight: 1.7 }}>
              {selected.description}
            </p>

            <div style={{ ...card, marginTop: 22 }}>
              <div style={{ ...muted, fontSize: 12 }}>CATEGORY</div>
              <div style={{ fontWeight: 700, marginTop: 7 }}>
                {selected.category}
              </div>

              <div style={{ ...muted, fontSize: 12, marginTop: 20 }}>
                ENDPOINT
              </div>
              <div style={{ fontWeight: 600, marginTop: 7, overflowWrap: "anywhere" }}>
                {selected.endpoint ?? "No endpoint configured"}
              </div>

              <div style={{ ...muted, fontSize: 12, marginTop: 20 }}>
                CONNECTION
              </div>
              <div style={{ fontWeight: 700, marginTop: 7, color: "#946200" }}>
                {results[selected.id]
                  ? results[selected.id].ok
                    ? "Endpoint responding — provider connection unverified"
                    : "Last API test failed"
                  : "Not verified"}
              </div>
            </div>

            <h3 style={{ fontSize: 16, marginTop: 25 }}>Features</h3>
            <div style={{ display: "grid", gap: 10 }}>
              {selected.features.map((feature) => (
                <div
                  key={feature}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    background: "#f7f8fc",
                    padding: 12,
                    borderRadius: 9,
                    fontSize: 13,
                  }}
                >
                  <CheckCircle2 size={16} color="#6755d9" />
                  {feature}
                </div>
              ))}
            </div>

            {results[selected.id] && (
              <div style={{ marginTop: 24 }}>
                <h3 style={{ fontSize: 16 }}>Latest test result</h3>
                <p style={{ ...muted, fontSize: 12 }}>
                  {results[selected.id].checkedAt}
                  {results[selected.id].status !== null
                    ? ` · HTTP ${results[selected.id].status}`
                    : ""}
                </p>
                <pre
                  style={{
                    whiteSpace: "pre-wrap",
                    overflowWrap: "anywhere",
                    maxHeight: 300,
                    overflowY: "auto",
                    background: "#171a2c",
                    color: "#e8eaff",
                    borderRadius: 12,
                    padding: 15,
                    fontSize: 12,
                    lineHeight: 1.6,
                  }}
                >
                  {JSON.stringify(
                    results[selected.id].data ?? {
                      message: results[selected.id].message,
                    },
                    null,
                    2
                  )}
                </pre>
              </div>
            )}

            {selected.endpoint && (
              <button
                onClick={() => testApi(selected)}
                disabled={testing.includes(selected.id)}
                style={{
                  ...button,
                  width: "100%",
                  marginTop: 24,
                  background: "#6755d9",
                  color: "#fff",
                  borderColor: "#6755d9",
                }}
              >
                <Play size={15} style={{ verticalAlign: "middle" }} />{" "}
                {testing.includes(selected.id)
                  ? "Testing endpoint..."
                  : "Run API test"}
              </button>
            )}
          </aside>
        </div>
      )}
    </main>
  );
}