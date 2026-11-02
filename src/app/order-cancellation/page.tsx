
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Order Cancellation Policy | Multani Mithas",
  description:
    "Read the Multani Mithas order cancellation policy for Sohan Halwa, traditional sweets, bakery products and gift hampers.",
  alternates: { canonical: "/order-cancellation" },
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "#F8F4EA",
    color: "#263B36",
    padding: "48px 20px 64px",
    fontFamily: "Georgia, serif",
  } as const,
  article: {
    maxWidth: "820px",
    margin: "0 auto",
  } as const,
  back: {
    display: "inline-block",
    color: "#80602F",
    textDecoration: "none",
    fontSize: "14px",
    marginBottom: "30px",
  } as const,
  label: {
    color: "#9A7338",
    fontSize: "12px",
    letterSpacing: "2px",
    textTransform: "uppercase" as const,
    marginBottom: "12px",
  },
  heading: {
    color: "#233D39",
    fontSize: "clamp(32px, 6vw, 48px)",
    lineHeight: 1.15,
    margin: "0 0 16px",
    fontWeight: 500,
  } as const,
  intro: {
    fontSize: "17px",
    lineHeight: 1.8,
    color: "#59645D",
    borderBottom: "1px solid #D9CFBA",
    paddingBottom: "28px",
    marginBottom: "30px",
  } as const,
  section: {
    marginBottom: "28px",
  } as const,
  subheading: {
    color: "#233D39",
    fontSize: "21px",
    fontWeight: 500,
    margin: "0 0 10px",
  } as const,
  paragraph: {
    fontSize: "15px",
    lineHeight: 1.85,
    color: "#4F5B55",
    margin: "0 0 12px",
  } as const,
  list: {
    paddingLeft: "22px",
    margin: "10px 0",
    color: "#4F5B55",
    fontSize: "15px",
    lineHeight: 1.9,
  } as const,
  footer: {
    borderTop: "1px solid #D9CFBA",
    marginTop: "42px",
    paddingTop: "22px",
    fontSize: "13px",
    color: "#73776E",
  } as const,
};

export default function OrderCancellationPage() {
  return (
    <main style={styles.page}>
      <article style={styles.article}>
        <Link href="/" style={styles.back}>
          ← Back to Multani Mithas
        </Link>

        <p style={styles.label}>Customer Information</p>
        <h1 style={styles.heading}>Order Cancellation Policy</h1>

        <p style={styles.intro}>
          At Multani Mithas, we prepare and pack our traditional sweets,
          bakery products and gift hampers with care. Our cancellation policy
          explains when an order can be cancelled and how eligible payments
          are handled.
        </p>

        <section style={styles.section}>
          <h2 style={styles.subheading}>1. Requesting a Cancellation</h2>
          <p style={styles.paragraph}>
            If you need to cancel an order, contact our customer support as
            soon as possible. Please provide your order number, name and
            contact number so we can locate your order.
          </p>
          <p style={styles.paragraph}>
            A cancellation request is not confirmed until our team reviews
            it and communicates the decision to you.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subheading}>2. Before Preparation Begins</h2>
          <p style={styles.paragraph}>
            Cancellation requests received before preparation or packing
            begins can generally be accepted. If you have already paid,
            an eligible refund will be arranged after confirmation.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subheading}>3. After Preparation Begins</h2>
          <p style={styles.paragraph}>
            Our sweets and bakery products may be freshly prepared,
            packed or arranged specifically for your order. Once preparation
            has started, cancellation may not be possible.
          </p>
          <p style={styles.paragraph}>
            Specially prepared, personalised or custom gift hampers may
            have additional limitations after work has begun. We will
            review genuine exceptional requests individually.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subheading}>4. After Dispatch</h2>
          <p style={styles.paragraph}>
            Once an order has been handed over to the delivery service,
            it generally cannot be cancelled through our normal process.
            Please contact us immediately if there is an urgent issue.
          </p>
          <p style={styles.paragraph}>
            If an order is damaged, incorrect, missing or has a genuine
            quality issue, please refer to our Refund & Return Policy.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subheading}>5. Cash on Delivery Orders</h2>
          <p style={styles.paragraph}>
            If you selected Cash on Delivery (COD), contact us as early
            as possible if you no longer want the order. We will check
            whether preparation or dispatch has started and confirm
            whether cancellation is possible.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subheading}>6. Prepaid Orders and Refunds</h2>
          <p style={styles.paragraph}>
            If a prepaid order is approved for cancellation, the eligible
            refund will be initiated within 3–5 working days after
            confirmation.
          </p>
          <p style={styles.paragraph}>
            Refunds will normally be returned through the original
            payment method where possible. For manual payments, such as
            bank transfer or mobile wallet payments, we may arrange an
            appropriate refund method after verifying the transaction.
          </p>
          <p style={styles.paragraph}>
            The time taken for the refunded amount to appear in your
            account may depend on the bank or payment provider.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subheading}>7. Changes to an Existing Order</h2>
          <p style={styles.paragraph}>
            If you need to change a product, quantity, delivery address
            or contact number, contact us immediately. Changes depend
            on order preparation and dispatch status and cannot always
            be guaranteed.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subheading}>8. How to Contact Us</h2>
          <p style={styles.paragraph}>
            For cancellation requests or questions about an existing
            order, contact Multani Mithas through the official contact
            details displayed on our website. Include your order number
            to help us assist you.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subheading}>9. Customer Rights</h2>
          <p style={styles.paragraph}>
            Nothing in this policy is intended to limit any rights or
            protections available to customers under applicable consumer
            protection laws.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subheading}>10. Policy Updates</h2>
          <p style={styles.paragraph}>
            Multani Mithas may update this policy when business practices
            or applicable requirements change. The latest version will
            be published on this page.
          </p>
        </section>

        <div style={styles.footer}>
          <p style={{ margin: "0 0 12px" }}>
            Last updated: 2 November 2026
          </p>
          <p style={{ margin: 0 }}>
            © {new Date().getFullYear()} Multani Mithas. All rights reserved.
          </p>
          <p style={{ margin: "14px 0 0" }}>
            <Link href="/privacy-policy" style={styles.back}>
              Privacy Policy
            </Link>
            {" · "}
            <Link href="/refund-return" style={styles.back}>
              Refund & Return Policy
            </Link>
          </p>
        </div>
      </article>
    </main>
  );
}
