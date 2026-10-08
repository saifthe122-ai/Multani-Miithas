"use client";

import { useState } from "react";

type ReviewStatus = "Pending" | "Approved" | "Rejected";

type Review = {
  id: string;
  customer: string;
  product: string;
  rating: number;
  review: string;
  order: string;
  date: string;
  status: ReviewStatus;
  hasImage: boolean;
};

const initialReviews: Review[] = [
  {
    id: "REV-001",
    customer: "Ali Raza",
    product: "Multani Sohan Halwa",
    rating: 5,
    review: "Excellent taste and very fresh. Highly recommended.",
    order: "MM-1008",
    date: "Today",
    status: "Pending",
    hasImage: true,
  },
  {
    id: "REV-002",
    customer: "Sara Malik",
    product: "Premium Barfi",
    rating: 5,
    review: "Beautiful packaging and great taste.",
    order: "MM-1006",
    date: "Today",
    status: "Approved",
    hasImage: false,
  },
  {
    id: "REV-003",
    customer: "Ahmed Khan",
    product: "Gift Box Premium",
    rating: 4,
    review: "Very good gift box. Delivery was also on time.",
    order: "MM-1007",
    date: "Yesterday",
    status: "Approved",
    hasImage: true,
  },
  {
    id: "REV-004",
    customer: "Hassan Ali",
    product: "Gulab Jamun",
    rating: 2,
    review: "Taste was okay but delivery took longer than expected.",
    order: "MM-1005",
    date: "Yesterday",
    status: "Pending",
    hasImage: false,
  },
];

const statusColors: Record<ReviewStatus, string> = {
  Pending: "#d97706",
  Approved: "#16a34a",
  Rejected: "#dc2626",
};

export default function ReviewsDashboard() {
  const [reviews, setReviews] = useState(initialReviews);
  const [filter, setFilter] = useState<"All" | ReviewStatus>("All");
  const [search, setSearch] = useState("");

  const filteredReviews = reviews.filter((review) => {
    const matchesStatus = filter === "All" || review.status === filter;

    const query = search.toLowerCase();

    const matchesSearch =
      review.customer.toLowerCase().includes(query) ||
      review.product.toLowerCase().includes(query) ||
      review.order.toLowerCase().includes(query);

    return matchesStatus && matchesSearch;
  });

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((total, review) => total + review.rating, 0) /
          reviews.length
        ).toFixed(1)
      : "0.0";

  function changeStatus(id: string, status: ReviewStatus) {
    setReviews((current) =>
      current.map((review) =>
        review.id === id ? { ...review, status } : review
      )
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f4f7f6",
        padding: "32px",
        fontFamily: "Arial, sans-serif",
        color: "#17201d",
      }}
    >
      <a
        href="/admin"
        style={{
          color: "#15803d",
          textDecoration: "none",
          fontWeight: 700,
        }}
      >
        ← Admin Dashboard
      </a>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 20,
          flexWrap: "wrap",
          marginTop: 15,
        }}
      >
        <div>
          <h1 style={{ fontSize: 32, margin: "0 0 8px" }}>
            Reviews Management
          </h1>

          <p style={{ color: "#64748b", margin: 0 }}>
            Manage customer ratings, reviews, approval and admin responses.
          </p>
        </div>

        <button
          onClick={() =>
            alert("Review moderation tools will connect to the Reviews API.")
          }
          style={{
            border: "none",
            background: "#15803d",
            color: "#fff",
            padding: "11px 17px",
            borderRadius: 10,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          + Review Settings
        </button>
      </div>

      {/* STATS */}

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))",
          gap: 16,
          marginTop: 28,
        }}
      >
        <StatCard title="Total Reviews" value={reviews.length} icon="💬" />

        <StatCard
          title="Pending Reviews"
          value={reviews.filter((r) => r.status === "Pending").length}
          icon="⏳"
        />

        <StatCard
          title="Approved"
          value={reviews.filter((r) => r.status === "Approved").length}
          icon="✓"
        />

        <StatCard
          title="Rejected"
          value={reviews.filter((r) => r.status === "Rejected").length}
          icon="✕"
        />

        <StatCard title="Average Rating" value={`${averageRating} / 5`} icon="⭐" />
      </section>

      {/* SMART INSIGHTS */}

      <section
        style={{
          marginTop: 22,
          background: "linear-gradient(135deg,#ecfdf5,#eff6ff)",
          border: "1px solid #dbeafe",
          borderRadius: 16,
          padding: 22,
        }}
      >
        <h2 style={{ margin: "0 0 8px" }}>
          ✦ Smart Review Insights
        </h2>

        <p
          style={{
            color: "#475569",
            lineHeight: 1.6,
            marginBottom: 0,
          }}
        >
          Future AI tools can detect customer sentiment, identify repeated
          product complaints, highlight highly praised products, detect
          suspicious review patterns and summarize customer feedback for the
          business team.
        </p>
      </section>

      {/* REVIEW MANAGEMENT */}

      <section
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: 22,
          marginTop: 22,
          boxShadow: "0 5px 18px rgba(15,23,42,.07)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 15,
            flexWrap: "wrap",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <div>
            <h2 style={{ margin: 0 }}>Customer Reviews</h2>

            <p
              style={{
                color: "#64748b",
                fontSize: 13,
                margin: "5px 0 0",
              }}
            >
              Moderate and manage customer reviews.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customer, product..."
              style={{
                padding: "10px 12px",
                border: "1px solid #d1d5db",
                borderRadius: 9,
                minWidth: 220,
              }}
            />

            <select
              value={filter}
              onChange={(e) =>
                setFilter(e.target.value as "All" | ReviewStatus)
              }
              style={{
                padding: "10px 12px",
                border: "1px solid #d1d5db",
                borderRadius: 9,
                background: "#fff",
              }}
            >
              <option value="All">All Reviews</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* REVIEWS */}

        <div
          style={{
            display: "grid",
            gap: 14,
          }}
        >
          {filteredReviews.map((review) => (
            <div
              key={review.id}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 13,
                padding: 18,
                background: "#fff",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 15,
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <strong style={{ fontSize: 16 }}>
                    {review.customer}
                  </strong>

                  <div
                    style={{
                      color: "#64748b",
                      fontSize: 13,
                      marginTop: 4,
                    }}
                  >
                    {review.product} · Order {review.order}
                  </div>
                </div>

                <span
                  style={{
                    background: `${statusColors[review.status]}18`,
                    color: statusColors[review.status],
                    padding: "6px 10px",
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 800,
                  }}
                >
                  {review.status}
                </span>
              </div>

              <div
                style={{
                  marginTop: 12,
                  fontSize: 20,
                  letterSpacing: 2,
                }}
              >
                {"★".repeat(review.rating)}
                <span style={{ color: "#d1d5db" }}>
                  {"★".repeat(5 - review.rating)}
                </span>
              </div>

              <p
                style={{
                  color: "#475569",
                  lineHeight: 1.6,
                  margin: "10px 0",
                }}
              >
                {review.review}
              </p>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 10,
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    color: "#64748b",
                  }}
                >
                  {review.date}
                  {review.hasImage ? " · 📷 Customer image attached" : ""}
                </div>

                <div style={{ display: "flex", gap: 7 }}>
                  <button
                    onClick={() => changeStatus(review.id, "Approved")}
                    style={actionStyle("#16a34a")}
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => changeStatus(review.id, "Rejected")}
                    style={actionStyle("#dc2626")}
                  >
                    Reject
                  </button>

                  <button
                    onClick={() =>
                      alert(
                        "Admin reply feature will connect to the Reviews API."
                      )
                    }
                    style={actionStyle("#2563eb")}
                  >
                    Reply
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredReviews.length === 0 && (
            <div
              style={{
                padding: 35,
                textAlign: "center",
                color: "#64748b",
              }}
            >
              No reviews found.
            </div>
          )}
        </div>
      </section>

      {/* FUTURE FEATURES */}

      <section
        style={{
          marginTop: 22,
          background: "#fff",
          borderRadius: 16,
          padding: 22,
          boxShadow: "0 5px 18px rgba(15,23,42,.07)",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Review Intelligence</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
            gap: 12,
          }}
        >
          {[
            "Sentiment Analysis",
            "Product Rating Trends",
            "Negative Review Alerts",
            "Review Spam Detection",
            "Customer Sentiment",
            "AI Review Summary",
            "Admin Replies",
            "Review Images",
          ].map((item) => (
            <div
              key={item}
              style={{
                padding: 15,
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: 10,
                fontWeight: 700,
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: string;
}) {
  return (
    <div
      style={{
        background: "#fff",
        padding: 20,
        borderRadius: 14,
        boxShadow: "0 5px 18px rgba(15,23,42,.07)",
        display: "flex",
        gap: 13,
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: 45,
          height: 45,
          borderRadius: 12,
          background: "#f0fdf4",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 21,
        }}
      >
        {icon}
      </div>

      <div>
        <div style={{ color: "#64748b", fontSize: 13 }}>
          {title}
        </div>

        <div
          style={{
            fontSize: 22,
            fontWeight: 800,
            marginTop: 4,
          }}
        >
          {value}
        </div>
      </div>
    </div>
  );
}

function actionStyle(color: string): React.CSSProperties {
  return {
    background: "#fff",
    border: `1px solid ${color}`,
    color,
    borderRadius: 8,
    padding: "7px 10px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 12,
  };
}