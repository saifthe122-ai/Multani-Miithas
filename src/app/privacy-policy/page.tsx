
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Multani Mithas",
  description:
    "Learn how Multani Mithas handles customer information, traditional Multani sweets and bakery orders, payments and delivery details.",
  alternates: {
    canonical: "/privacy-policy",
  },
};

const sections = [
  {
    title: "Information We Collect",
    text: "When you order Sohan Halwa, traditional mithai, bakery products or gift hampers from Multani Mithas, we may collect your name, mobile number, delivery address, order details and selected payment method.",
  },
  {
    title: "How We Use Your Information",
    text: "Your information helps us confirm orders, prepare and package your selected products, arrange delivery, communicate order updates and provide customer support.",
  },
  {
    title: "Payments and Verification",
    text: "Depending on the available checkout options, payments may be made through Cash on Delivery, JazzCash, Easypaisa, Raast or Bank Transfer. For manual payments, we may request a transaction reference or payment screenshot for verification. Never share your PIN, password or OTP.",
  },
  {
    title: "Order Preparation and Delivery",
    text: "Relevant customer details may be used by our authorised team and delivery service providers to prepare, dispatch and deliver your sweets, bakery products and gift orders.",
  },
  {
    title: "Customer Reviews",
    text: "Information voluntarily submitted through customer reviews or feedback may be used to display or respond to your comments. Please do not include private payment details in a public review.",
  },
  {
    title: "Sharing of Information",
    text: "We do not sell customer personal information. Information may be processed by service providers when necessary for website hosting, data storage, order processing and delivery.",
  },
  {
    title: "Information Security",
    text: "We take reasonable steps to protect customer and order information. However, no online service can guarantee absolute security.",
  },
  {
    title: "Data Retention",
    text: "Order and payment records may be retained for customer support, business records and applicable legal or accounting requirements.",
  },
  {
    title: "Your Privacy Requests",
    text: "You may contact Multani Mithas to ask questions about the personal information you have provided or request correction of inaccurate details, subject to applicable requirements.",
  },
  {
    title: "Policy Updates",
    text: "This policy may be updated when our website or business practices change. The latest version will be published on this page.",
  },
];

export default function PrivacyPolicyPage() {
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
            fontSize: "clamp(30px, 5vw, 42px)",
            lineHeight: 1.2,
            fontWeight: 500,
            margin: "12px 0",
          }}
        >
          Privacy Policy
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
          At Multani Mithas, every order is received with care
          and respect. We also value the trust you place in us
          when sharing your information. This policy explains
          how we handle information when you browse our website
          or order our traditional sweets, bakery products and
          gift collections.
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

          <a
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
          </a>
        </div>
      </article>
    </main>
  );
}
