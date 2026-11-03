
"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";

const styles = {
  page: {
    minHeight: "100vh",
    background: "#F8F4EA",
    color: "#263B36",
    padding: "42px 18px 64px",
    fontFamily: "Georgia, serif",
  } as const,
  container: {
    maxWidth: "760px",
    margin: "0 auto",
  } as const,
  back: {
    display: "inline-block",
    color: "#80602F",
    textDecoration: "none",
    fontSize: "14px",
    marginBottom: "28px",
  } as const,
  eyebrow: {
    color: "#9A7338",
    fontSize: "12px",
    letterSpacing: "2px",
    textTransform: "uppercase" as const,
  },
  heading: {
    color: "#233D39",
    fontSize: "clamp(32px, 6vw, 46px)",
    lineHeight: 1.15,
    fontWeight: 500,
    margin: "12px 0",
  } as const,
  intro: {
    color: "#59645D",
    fontSize: "16px",
    lineHeight: 1.8,
    marginBottom: "30px",
  } as const,
  card: {
    background: "#FFFDF8",
    border: "1px solid #DED5C2",
    borderRadius: "12px",
    padding: "clamp(20px, 5vw, 34px)",
  } as const,
  label: {
    display: "block",
    color: "#34443D",
    fontSize: "14px",
    marginBottom: "8px",
  } as const,
  input: {
    width: "100%",
    boxSizing: "border-box" as const,
    border: "1px solid #D8CEBA",
    borderRadius: "7px",
    padding: "13px 14px",
    background: "#FFFFFF",
    color: "#263B36",
    fontSize: "15px",
    marginBottom: "20px",
    outlineColor: "#A47D3D",
  } as const,
  button: {
    width: "100%",
    border: 0,
    borderRadius: "7px",
    padding: "15px 20px",
    background: "#233D39",
    color: "#F8F4EA",
    fontSize: "15px",
    cursor: "pointer",
    fontFamily: "Georgia, serif",
  } as const,
};

export default function ReviewsPage() {
  const [name, setName] = useState("");
  const [rating, setRating] = useState("5");
  const [orderNumber, setOrderNumber] = useState("");
  const [review, setReview] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          rating: Number(rating),
          orderNumber: orderNumber.trim(),
          review: review.trim(),
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.error || data.message || "Review submit nahi ho saka."
        );
      }

      setMessage(
        "Shukriya! Aap ka review submit ho gaya hai. Review publish hone se pehle check kiya ja sakta hai."
      );
      setName("");
      setRating("5");
      setOrderNumber("");
      setReview("");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Review submit nahi ho saka. Dobara koshish karein."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <Link href="/" style={styles.back}>
          ← Back to Multani Mithas
        </Link>

        <p style={styles.eyebrow}>Your Experience Matters</p>
        <h1 style={styles.heading}>Share Your Experience</h1>

        <p style={styles.intro}>
          Multani Mithas se mithai, Sohan Halwa ya bakery products
          order kiye? Apna experience share karein. Aap ki feedback
          humein behtar service dene mein madad karti hai.
        </p>

        <section style={styles.card}>
          <form onSubmit={handleSubmit}>
            <label htmlFor="review-name" style={styles.label}>
              Your Name *
            </label>
            <input
              id="review-name"
              name="name"
              type="text"
              autoComplete="name"
              maxLength={80}
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter your name"
              style={styles.input}
            />

            <label htmlFor="review-rating" style={styles.label}>
              Your Rating *
            </label>
            <select
              id="review-rating"
              name="rating"
              required
              value={rating}
              onChange={(event) => setRating(event.target.value)}
              style={styles.input}
            >
              <option value="5">★★★★★ — Excellent</option>
              <option value="4">★★★★☆ — Very Good</option>
              <option value="3">★★★☆☆ — Good</option>
              <option value="2">★★☆☆☆ — Fair</option>
              <option value="1">★☆☆☆☆ — Poor</option>
            </select>

            <label htmlFor="review-order" style={styles.label}>
              Order Number (Optional)
            </label>
            <input
              id="review-order"
              name="orderNumber"
              type="text"
              maxLength={50}
              value={orderNumber}
              onChange={(event) => setOrderNumber(event.target.value)}
              placeholder="Example: MM-1001"
              style={styles.input}
            />

            <label htmlFor="review-message" style={styles.label}>
              Your Review *
            </label>
            <textarea
              id="review-message"
              name="review"
              required
              minLength={10}
              maxLength={1000}
              rows={6}
              value={review}
              onChange={(event) => setReview(event.target.value)}
              placeholder="Share your experience with our products and service..."
              style={{
                ...styles.input,
                resize: "vertical",
                lineHeight: 1.7,
              }}
            />

            <button
              type="submit"
              disabled={submitting}
              style={{
                ...styles.button,
                opacity: submitting ? 0.65 : 1,
                cursor: submitting ? "not-allowed" : "pointer",
              }}
            >
              {submitting ? "Submitting..." : "Submit Your Review"}
            </button>

            {message && (
              <p
                role="status"
                aria-live="polite"
                style={{
                  margin: "18px 0 0",
                  color: "#52634F",
                  fontSize: "14px",
                  lineHeight: 1.7,
                }}
              >
                {message}
              </p>
            )}
          </form>
        </section>

        <p
          style={{
            color: "#73776E",
            fontSize: "13px",
            lineHeight: 1.7,
            marginTop: "20px",
          }}
        >
          Please share honest feedback. Reviews may be checked before
          they are displayed publicly. Do not include payment passwords,
          PINs or OTPs in your review.
        </p>
      </div>
    </main>
  );
}
