
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Order Cancellation Policy | Multani Mithas",
  description:
    "Understand when Multani Mithas orders can be cancelled, including preparation, packing, dispatch and prepaid order refund conditions.",
  alternates: { canonical: "/order-cancellation" },
};

const sections = [
  {
    title: "1. Requesting an Order Cancellation",
    paragraphs: [
      "If you need to cancel an order, contact Multani Mithas as soon as possible through the official WhatsApp or phone details displayed on our website.",
      "Please provide your order number, name and contact number. A cancellation request is not confirmed until our team reviews it and communicates the decision to you.",
    ],
  },
  {
    title: "2. Cancellation Before Preparation",
    paragraphs: [
      "You may request cancellation before preparation of your order has started. Requests received at this stage can generally be accepted after confirmation by our team.",
      "If payment has already been made, an eligible refund will be processed according to our Refund & Return Policy.",
    ],
  },
  {
    title: "3. After Preparation Begins",
    paragraphs: [
      "Our mithai, Sohan Halwa, bakery products and gift hampers may be freshly prepared, packed or arranged specifically for each order. Once preparation or packing has started, cancellation is generally not accepted.",
      "Customised, personalised or specially prepared gift hampers may have additional restrictions once work has begun. Exceptional requests may be reviewed individually.",
    ],
  },
  {
    title: "4. Ready for Packing, Dispatch and Delivery",
    paragraphs: [
      "Once an order reaches Ready for Packing, Shipped or Out for Delivery status, cancellation is generally no longer available.",
      "After an order has been handed over to the courier or delivery service, it cannot normally be stopped through our cancellation process. If you have an urgent concern, contact our team immediately.",
      "This cancellation restriction does not remove any applicable customer rights or protections relating to damaged, incorrect, missing or defective products.",
    ],
  },
  {
    title: "5. Cash on Delivery Orders",
    paragraphs: [
      "Customers who select Cash on Delivery (COD) should contact us immediately if they wish to cancel. We will check the preparation and dispatch status before confirming whether cancellation is possible.",
      "Please do not assume that an order has been cancelled until our team confirms it.",
    ],
  },
  {
    title: "6. Prepaid Orders and Refunds",
    paragraphs: [
      "If a prepaid order is approved for cancellation, an eligible refund will normally be initiated within 3–5 working days after confirmation.",
      "Where possible, refunds will be returned through the original payment method. For manual payments, including bank transfers or mobile wallet payments, an appropriate refund method may be arranged after transaction verification.",
      "The time taken for the amount to appear in your account may depend on the bank or payment provider.",
    ],
  },
  {
    title: "7. Changes to an Existing Order",
    paragraphs: [
      "If you need to change a product, quantity, delivery address or contact number, contact us as soon as possible.",
      "Changes depend on preparation and dispatch status and cannot always be guaranteed. Our team will confirm whether the requested change can be accommodated.",
    ],
  },
  {
    title: "8. Failed Delivery and Customer Unavailability",
    paragraphs: [
      "Please provide an accurate delivery address and an active contact number when placing your order. If delivery fails because of an incorrect address or customer unavailability, contact our team to discuss the available options.",
      "A redelivery may involve additional delivery charges. Any applicable charges will be communicated before arranging another delivery attempt.",
    ],
  },
  {
    title: "9. Damaged, Incorrect or Missing Products",
    paragraphs: [
      "If your order arrives damaged, incorrect, incomplete or with a genuine quality issue, please report it within 2 hours of delivery with your order number and clear photographs or video.",
      "Such complaints are handled under our Refund & Return Policy and are separate from ordinary order cancellation requests.",
    ],
  },
  {
    title: "10. Customer Rights and Policy Updates",
    paragraphs: [
      "Nothing in this policy is intended to exclude or restrict any rights or protections available to customers under applicable consumer protection laws.",
      "Multani Mithas may update this policy when business practices or applicable requirements change. The latest version will be published on this page.",
    ],
  },
];

export default function OrderCancellationPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#F8F4EA",
        color: "#263B36",
        padding: "48px 20px 64px",
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
        <Link
          href="/"
          style={{
            display: "inline-block",
            color: "#80602F",
            textDecoration: "none",
            fontSize: "14px",
            marginBottom: "30px",
          }}
        >
          ← Back to Multani Mithas
        </Link>

        <p
          style={{
            color: "#9A7338",
            fontSize: "12px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            marginBottom: "12px",
          }}
        >
          Customer Information
        </p>

        <h1
          style={{
            color: "#233D39",
            fontSize: "clamp(32px, 6vw, 48px)",
            lineHeight: 1.15,
            margin: "0 0 16px",
            fontWeight: 500,
          }}
        >
          Order Cancellation Policy
        </h1>

        <p
          style={{
            fontSize: "17px",
            lineHeight: 1.8,
            color: "#59645D",
            borderBottom: "1px solid #D9CFBA",
            paddingBottom: "28px",
            marginBottom: "30px",
          }}
        >
          At Multani Mithas, we prepare and pack our traditional
          Pakistani sweets, Sohan Halwa, bakery products and gift
          hampers with care. Because many of our products are
          perishable and prepared for individual orders, cancellation
          requests depend on the preparation and dispatch stage.
        </p>

        {sections.map((section) => (
          <section
            key={section.title}
            style={{ marginBottom: "28px" }}
          >
            <h2
              style={{
                color: "#233D39",
                fontSize: "21px",
                fontWeight: 500,
                margin: "0 0 10px",
              }}
            >
              {section.title}
            </h2>

            {section.paragraphs.map((paragraph, index) => (
              <p
                key={index}
                style={{
                  fontSize: "15px",
                  lineHeight: 1.85,
                  color: "#4F5B55",
                  margin: "0 0 12px",
                }}
              >
                {paragraph}
              </p>
            ))}
          </section>
        ))}

        <div
          style={{
            borderTop: "1px solid #D9CFBA",
            marginTop: "42px",
            paddingTop: "22px",
            fontSize: "13px",
            color: "#73776E",
          }}
        >
          <p style={{ margin: "0 0 12px" }}>
            Last updated: 2 November 2026
          </p>

          <p style={{ margin: 0 }}>
            © {new Date().getFullYear()} Multani Mithas. All rights reserved.
          </p>

          <p style={{ margin: "14px 0 0" }}>
            <Link
              href="/privacy-policy"
              style={{
                color: "#9A7338",
                textDecoration: "none",
              }}
            >
              Privacy Policy
            </Link>
            {" · "}
            <Link
              href="/refund-return"
              style={{
                color: "#9A7338",
                textDecoration: "none",
              }}
            >
              Refund & Return Policy
            </Link>
          </p>
        </div>
      </article>
    </main>
  );
}
