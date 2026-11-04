
import type { Metadata } from "next";
import Link from "next/link";
import RefundRequestForm from "./refund-request-form";

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
    title: "No Return & No Refund Policy",
    text: "All sales of mithai, sweets, bakery products and other perishable food items are generally final. We do not accept returns or offer refunds for change of mind, personal taste preference or orders no longer wanted by the customer once preparation or dispatch has taken place. This policy helps protect food hygiene, product freshness and customer safety. Genuine complaints involving damaged, incorrect, missing or defective products will be reviewed under the conditions below.",
  },
  {
    title: "Damaged, Incorrect or Missing Items",
    text: "If you receive a damaged product, an incorrect item, a missing item or a product with a genuine quality issue, please contact us within 2 hours of delivery. For missing items, please check your order and report the issue as soon as possible within this period. Our team will review verified complaints individually.",
  },
  {
    title: "How to Report a Problem",
    text: "Please provide your order number, a brief description of the issue and clear photographs or video showing the product and its packaging. Keep the affected product and packaging until our team has reviewed your complaint. Please do not consume the affected product before reporting a suspected defect or quality issue.",
  },
  {
    title: "Resolution of Verified Complaints",
    text: "After reviewing the available evidence, Multani Mithas may offer a replacement of the affected item, store credit for a future purchase or an appropriate refund. The resolution will depend on the nature of the complaint, verification of the issue and product availability. Refunds or replacements are not automatic and will be considered on a case-by-case basis, subject to applicable consumer protection laws.",
  },
  {
    title: "Food Safety and Product Storage",
    text: "Our products are prepared and packed with care. Customers should follow any storage and consumption instructions provided with the product. We cannot accept responsibility for quality deterioration caused by improper storage, handling or consumption after delivery. Products that have been opened, consumed or damaged after delivery are generally not eligible for return, except where a genuine product defect or applicable consumer rights require a different outcome.",
  },
  {
    title: "Return Shipping & Courier Charges",
    text: "Where a return is exceptionally approved by Multani Mithas, the customer may be required to arrange and pay the courier charges for sending the item back to us. Please do not send any product back without first receiving instructions from our support team. For damaged, incorrect, missing or verified quality-related complaints caused by an issue on our side, we will review the appropriate return arrangements and courier costs fairly. Customers will not automatically be charged for return shipping when the issue is our responsibility.",
  },
  {
    title: "Refund Processing",
    text: "If a refund is approved, it will normally be initiated within 3–5 working days after confirmation. Where possible, refunds will be sent through the original payment method. For Cash on Delivery or manual payments, an appropriate bank or mobile wallet transfer may be arranged after payment details are verified. The time taken for the amount to appear in your account may depend on the bank or payment provider.",
  },
  {
    title: "Delivery Delays and Failed Delivery",
    text: "Delivery times are estimates and may vary due to traffic, weather, courier operations or high order volume. If delivery fails because of an incorrect address or customer unavailability, please contact our team to discuss available options. A redelivery may involve additional delivery charges, which will be communicated before arranging it. Any refund request will be reviewed according to the circumstances and applicable consumer protection laws.",
  },
  {
    title: "Order Verification",
    text: "Our team may contact you to verify your order number, delivery details, payment information and reported issue before approving a replacement, store credit or refund. This helps us investigate complaints and handle each case fairly.",
  },
  {
    title: "Contact and Support",
    text: "For a complaint, refund request or product quality concern, contact Multani Mithas through the official contact details displayed on our website. Please include your order number and report the issue within 2 hours of delivery so our team can review it promptly.",
  },
  {
    title: "Customer Rights and Policy Updates",
    text: "Nothing in this policy is intended to exclude or restrict any rights or protections available to customers under applicable consumer protection laws. If any part of this policy conflicts with applicable law, the legal requirements will apply. Multani Mithas may update this policy when its products or business practices change. The latest version will be published on this page.",
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
          At Multani Mithas, we take pride in delivering traditional
          Pakistani sweets, Sohan Halwa and bakery products with care.
          Because our products are perishable food items, this policy
          explains how we handle returns, product complaints,
          replacements and refunds while maintaining food hygiene
          and customer safety.
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

        <RefundRequestForm />

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
