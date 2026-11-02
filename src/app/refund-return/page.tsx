
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Refund & Return Policy | Multani Mithas",
  description:
    "Read the Multani Mithas refund and return policy for traditional sweets, Sohan Halwa, bakery products, damaged orders and delivery issues.",
  alternates: {
    canonical: "/refund-return",
  },
};

const sections = [
  {
    title: "1. Our Commitment to Quality",
    text: "At Multani Mithas, we take care in preparing, packaging and delivering our traditional sweets, Sohan Halwa, bakery products and gift hampers. If your order arrives with a genuine problem, we want to help resolve it.",
  },
  {
    title: "2. When Can You Request a Refund or Replacement?",
    text: "You may contact us if you receive a damaged, spoiled or expired product, an incorrect item, a missing product, or an order that does not match your confirmed purchase. Genuine product quality concerns will also be reviewed individually.",
  },
  {
    title: "3. Reporting a Problem",
    text: "Please contact us within 24 hours of receiving your order. Share your order number, a brief description of the issue and clear photographs or video of the product and packaging. Please keep the product and its packaging until our team has reviewed your complaint.",
  },
  {
    title: "4. Food Safety and Non-Returnable Items",
    text: "For food safety and hygiene reasons, we generally cannot accept returns for a change of mind, personal taste preference or an order no longer wanted by the customer. Products that have been opened, consumed, improperly stored or damaged after delivery are generally not eligible for return. Genuine quality concerns will still be considered.",
  },
  {
    title: "5. Refunds and Replacements",
    text: "After reviewing an eligible complaint, Multani Mithas may offer a replacement, refund for the affected item or another mutually agreed resolution. If a replacement is unavailable, an appropriate refund may be arranged. The resolution will depend on the nature of the issue and the available product.",
  },
  {
    title: "6. Refund Processing",
    text: "Approved refunds will normally be initiated within 3–5 working days. Where possible, refunds will be sent through the original payment method. For Cash on Delivery or manual payments, an appropriate bank or mobile wallet transfer may be arranged with the customer. Bank and payment provider processing times may vary.",
  },
  {
    title: "7. Delivery Charges",
    text: "Where an order problem is confirmed to be our responsibility, applicable delivery charges will also be considered for refund. Delivery charges for other situations will be reviewed according to the circumstances of the order.",
  },
  {
    title: "8. Order Verification",
    text: "Our team may contact you to verify order details, payment information and the reported issue before approving a refund or replacement. This helps us handle every complaint fairly.",
  },
  {
    title: "9. Contact and Support",
    text: "For refund, replacement or product quality enquiries, please contact Multani Mithas through the contact details provided on our website. Please include your order number so our team can assist you efficiently.",
  },
  {
    title: "10. Customer Rights and Policy Updates",
    text: "This policy does not limit any rights available to customers under applicable consumer protection laws. Multani Mithas may update this policy when its products or business practices change. The latest version will be published on this page.",
  },
];

export default function RefundReturnPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#F8F4EA",
        color: "#233D39",
        padding: "42px 18px",
        fontFamily: "Georgia, serif",
      }}
    >
      <article
        style={{
          maxWidth: "820px",
          margin: "0 auto",
          background: "#FFFEFA",
          padding: "clamp(24px, 5vw, 54px)",
          border: "1px solid #E5D6B8",
          borderRadius: "5px",
          lineHeight: 1.85,
        }}
      >
        <p
          style={{
            color: "#A47D3D",
            letterSpacing: "3px",
            fontSize: "12px",
            fontWeight: 700,
          }}
        >
          MULTANI MITHAS
        </p>

        <h1
          style={{
            fontSize: "clamp(29px, 5vw, 40px)",
            lineHeight: 1.25,
            fontWeight: 500,
            margin: "12px 0",
          }}
        >
          Refund & Return Policy
        </h1>

        <div
          style={{
            width: "55px",
            height: "2px",
            background: "#B18A49",
            margin: "22px 0",
          }}
        />

        <p style={{ fontStyle: "italic", color: "#8A6C3D" }}>
          Multan Ki Mithas, Dil Se.
        </p>

        <p>
          Your satisfaction matters to us. We believe every
          order should reflect the care, quality and tradition
          associated with Multani Mithas. This policy explains
          how we handle product complaints, returns,
          replacements and refunds.
        </p>

        {sections.map((section, index) => (
          <section
            key={section.title}
            style={{ marginTop: "28px" }}
          >
            <h2
              style={{
                color: "#9A7338",
                fontSize: "19px",
                fontWeight: 600,
                lineHeight: 1.4,
              }}
            >
              {String(index + 1).padStart(2, "0")}.{" "}
              {section.title}
            </h2>

            <p style={{ marginTop: "8px", fontSize: "15px" }}>
              {section.text}
            </p>
          </section>
        ))}

        <div
          style={{
            borderTop: "1px solid #E5D6B8",
            marginTop: "38px",
            paddingTop: "22px",
          }}
        >
          <p style={{ fontSize: "13px", color: "#817968" }}>
            Last updated: 2 November 2026
          </p>

          <Link
            href="/"
            style={{
              display: "inline-block",
              marginTop: "12px",
              color: "#9A7338",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: 700,
            }}
          >
            ← Return to Multani Mithas
          </Link>
        </div>
      </article>
    </main>
  );
}
