
import Link from "next/link";

const groups = [
  {
    title: "Payment Gateways",
    description: "Customer checkout and payment processing",
    items: [
      ["Cash on Delivery", "Manual order payment"],
      ["JazzCash", "Pakistan payments"],
      ["Easypaisa", "Pakistan payments"],
      ["Raast / Bank Transfer", "Local bank payments"],
      ["International Gateway", "Overseas card payments"],
    ],
  },
  {
    title: "Delivery & Logistics",
    description: "Shipping, dispatch and parcel tracking",
    items: [
      ["Courier Services", "Booking and shipping labels"],
      ["Order Tracking", "Shipment status updates"],
      ["Delivery Staff", "Assignment and delivery status"],
      ["International Shipping", "Overseas delivery"],
    ],
  },
  {
    title: "Social Media & Marketing",
    description: "Campaigns and traffic-source reporting",
    items: [
      ["Facebook", "Social links and campaigns"],
      ["Instagram", "Social links and campaigns"],
      ["YouTube", "Video and promotional links"],
      ["TikTok", "Video and promotional links"],
      ["LinkedIn / X", "Business and social links"],
      ["WhatsApp", "Customer contact and order enquiries"],
    ],
  },
  {
    title: "AI Agents & Automation",
    description: "Future assistants and business automation",
    items: [
      ["Customer Support Agent", "Answer common customer questions"],
      ["Order Assistant", "Help with order enquiries"],
      ["Marketing Assistant", "Campaign planning support"],
      ["Business Reports Agent", "Assist with report summaries"],
    ],
  },
  {
    title: "Website APIs",
    description: "Internal endpoints created for Multani Mithas",
    items: [
      ["Products API", "/api/products"],
      ["Orders API", "/api/orders"],
      ["Payments API", "/api/payments"],
      ["Delivery API", "/api/delivery"],
      ["Customers API", "/api/customers"],
      ["Feedback API", "/api/feedback"],
      ["Reviews API", "/api/reviews"],
      ["Coupons API", "/api/coupons"],
      ["Newsletter API", "/api/newsletter"],
      ["Referrals API", "/api/referrals"],
      ["Social Tracking API", "/api/social-tracking"],
    ],
  },
];

export default function IntegrationsPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-4 text-gray-900 sm:p-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/admin"
          className="mb-6 inline-block text-sm font-semibold text-emerald-700 hover:underline"
        >
          ← Back to Admin Dashboard
        </Link>

        <header className="mb-8 rounded-2xl bg-emerald-900 p-6 text-white sm:p-8">
          <p className="mb-2 text-sm font-medium text-emerald-200">
            MULTANI MITHAS · BUSINESS MANAGEMENT
          </p>
          <h1 className="text-3xl font-bold sm:text-4xl">
            API & Integrations
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-100">
            Manage the integration plan for payments, delivery, marketing,
            AI agents and website services from one place.
          </p>
        </header>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Integration Categories</p>
            <p className="mt-2 text-3xl font-bold">{groups.length}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Live Connections</p>
            <p className="mt-2 text-3xl font-bold text-amber-600">0</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Current Mode</p>
            <p className="mt-2 text-xl font-bold">Planning / Testing</p>
          </div>
        </div>

        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
          <strong>Important:</strong> This page is a management overview only.
          The listed services are not connected automatically. Real payments,
          tracking, AI agents and database operations require secure
          configuration and provider setup.
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {groups.map((group) => (
            <section
              key={group.title}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"
            >
              <h2 className="text-xl font-bold">{group.title}</h2>
              <p className="mt-1 text-sm text-gray-500">
                {group.description}
              </p>

              <div className="mt-5 space-y-3">
                {group.items.map(([name, detail]) => (
                  <div
                    key={name}
                    className="flex items-start justify-between gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold">{name}</p>
                      <p className="mt-1 break-words text-xs text-gray-500">
                        {detail}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-gray-200 px-2 py-1 text-xs font-medium text-gray-700">
                      Not Connected
                    </span>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <footer className="mt-8 rounded-xl border border-gray-200 bg-white p-5 text-sm leading-6 text-gray-600">
          <h2 className="mb-2 font-bold text-gray-900">
            Security & Next Steps
          </h2>
          Keep provider secret keys on the server, never in public website
          code. Before enabling real customer data, add authenticated admin
          access, server-side permission checks, database storage and
          provider-specific configuration.
        </footer>
      </div>
    </main>
  );
}