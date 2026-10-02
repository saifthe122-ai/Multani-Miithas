
"use client";

import { useState } from "react";

const WHATSAPP_NUMBER = ""; // Business number: country code ke sath, + ke baghair
const BUSINESS_EMAIL = ""; // Apna business email yahan add karna
const BUSINESS_PHONE = ""; // Misal: +923001234567

const products = [
  { id: 1, name: "Multani Sohan Halwa", price: 1200, emoji: "🍯", category: "Traditional Sweets" },
  { id: 2, name: "Premium Barfi", price: 900, emoji: "🍬", category: "Traditional Sweets" },
  { id: 3, name: "Gulab Jamun", price: 650, emoji: "🍮", category: "Traditional Sweets" },
  { id: 4, name: "Besan Ladoo", price: 750, emoji: "🟡", category: "Traditional Sweets" },
  { id: 5, name: "Premium Gift Box", price: 2500, emoji: "🎁", category: "Gift Boxes" },
  { id: 6, name: "Sweet Celebration Box", price: 3200, emoji: "🎀", category: "Gift Boxes" },
  { id: 7, name: "Traditional Patisa", price: 1100, emoji: "🥮", category: "Traditional Sweets" },
  { id: 8, name: "Bakery Special", price: 1800, emoji: "🎂", category: "Bakery" },
];

const money = (amount: number) =>
  "PKR " + amount.toLocaleString("en-PK");

const buttonStyle = {
  background: "#214b35",
  color: "#ffffff",
  padding: "12px 18px",
  border: 0,
  borderRadius: 7,
  cursor: "pointer",
  fontWeight: "bold" as const,
  textDecoration: "none",
  display: "inline-block",
};

const sectionStyle = {
  padding: "55px 6%",
  scrollMarginTop: 20,
};

export default function Home() {
  const [cart, setCart] = useState<Record<number, number>>({});
  const [message, setMessage] = useState("");

  const addToCart = (id: number) => {
    setCart((old) => ({ ...old, [id]: (old[id] || 0) + 1 }));
    setMessage("Product cart mein add ho gaya!");
  };

  const removeFromCart = (id: number) => {
    setCart((old) => {
      const next = { ...old };
      if (next[id] > 1) next[id]--;
      else delete next[id];
      return next;
    });
    setMessage("Cart update ho gaya.");
  };

  const cartCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const total = products.reduce(
    (sum, p) => sum + p.price * (cart[p.id] || 0),
    0
  );

  const orderLines = products
    .filter((p) => cart[p.id])
    .map((p) => `${p.name} x ${cart[p.id]} = ${money(p.price * cart[p.id])}`)
    .join("\n");

  const sendOrder = () => {
    if (!cartCount) {
      setMessage("Pehle cart mein product add karein.");
      return;
    }

    const order = `Assalam-o-Alaikum Multani Mithas!\n\nMera order:\n${orderLines}\n\nSubtotal: ${money(total)}\nDelivery charges abhi confirm karne hain.\n\nMera naam:\nDelivery country:\nCity / postal code:\nFull address:\n\nPlease order aur delivery confirm karein.`;

    if (!WHATSAPP_NUMBER.trim()) {
      setMessage("WhatsApp number abhi set nahi hua. Code mein number add karein.");
      return;
    }

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}?text=${encodeURIComponent(order)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const contactEmail = BUSINESS_EMAIL.trim();

  return (
    <main style={{ fontFamily: "Arial, sans-serif", color: "#30251d", background: "#fffdf8", lineHeight: 1.7 }}>
      <header style={{ background: "#183d2b", color: "#fff4df", padding: "18px 6%", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
        <a href="#home" style={{ color: "inherit", textDecoration: "none" }}>
          <h2 style={{ margin: 0 }}>Multani Mithas</h2>
          <small>Tradition in Every Bite</small>
        </a>
        <nav style={{ display: "flex", flexWrap: "wrap", gap: 15, alignItems: "center" }}>
          {[
            ["Home", "#home"],
            ["About", "#about"],
            ["Products", "#products"],
            ["Gift Boxes", "#gifts"],
            ["Delivery", "#delivery"],
            ["Contact", "#contact"],
          ].map(([label, href]) => (
            <a key={label} href={href} style={{ color: "#fff4df", textDecoration: "none", fontWeight: "bold" }}>{label}</a>
          ))}
          <a href="#cart" style={{ background: "#f1c987", color: "#183d2b", padding: "8px 12px", borderRadius: 6, textDecoration: "none", fontWeight: "bold" }}>
            Cart ({cartCount})
          </a>
        </nav>
      </header>

      <section id="home" style={{ padding: "85px 7%", textAlign: "center", background: "linear-gradient(135deg, #f8ead1, #fff8ed)" }}>
        <p style={{ color: "#98622f", fontWeight: "bold", letterSpacing: 3 }}>THE TRADITION OF MULTAN</p>
        <h1 style={{ color: "#214b35", fontSize: "clamp(38px, 6vw, 66px)", lineHeight: 1.15 }}>A Sweet Taste of Tradition</h1>
        <p style={{ maxWidth: 680, margin: "20px auto", fontSize: 18 }}>
          Discover traditional Pakistani sweets, Multani Sohan Halwa and thoughtful gift boxes for every special moment.
        </p>
        <a href="#products" style={buttonStyle}>Explore Our Sweets</a>
        <p style={{ marginTop: 18, fontSize: 14 }}>Pakistan orders and international enquiries welcome.</p>
      </section>

      <section id="about" style={{ ...sectionStyle, textAlign: "center" }}>
        <h2>About Multani Mithas</h2>
        <p style={{ maxWidth: 780, margin: "auto" }}>
          Multani Mithas celebrates the traditional taste of Pakistani sweets.
          Explore our mithai, bakery treats and gift boxes for family, friends,
          celebrations and special occasions.
        </p>
      </section>

      <section id="products" style={{ ...sectionStyle, background: "#f8f3e9" }}>
        <h2 style={{ textAlign: "center" }}>Our Products</h2>
        <p style={{ textAlign: "center" }}>Prices are displayed in Pakistani rupees (PKR).</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 22, marginTop: 30 }}>
          {products.filter((p) => p.category !== "Gift Boxes").map((p) => (
            <article key={p.id} style={{ background: "#fffdf8", border: "1px solid #e8dcc8", borderRadius: 12, padding: 24, textAlign: "center" }}>
              <div style={{ fontSize: 58 }}>{p.emoji}</div>
              <small>{p.category}</small>
              <h3>{p.name}</h3>
              <p style={{ fontWeight: "bold", fontSize: 19 }}>{money(p.price)}</p>
              <button onClick={() => addToCart(p.id)} style={buttonStyle}>Add to Cart</button>
            </article>
          ))}
        </div>
      </section>

      <section id="gifts" style={sectionStyle}>
        <h2 style={{ textAlign: "center" }}>Gift Boxes & Celebrations</h2>
        <p style={{ textAlign: "center" }}>Share traditional sweetness on special occasions.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 22, maxWidth: 750, margin: "30px auto" }}>
          {products.filter((p) => p.category === "Gift Boxes").map((p) => (
            <article key={p.id} style={{ border: "1px solid #e8dcc8", borderRadius: 12, padding: 25, textAlign: "center", background: "#fffaf1" }}>
              <div style={{ fontSize: 60 }}>{p.emoji}</div>
              <h3>{p.name}</h3>
              <p style={{ fontWeight: "bold", fontSize: 19 }}>{money(p.price)}</p>
              <button onClick={() => addToCart(p.id)} style={buttonStyle}>Add to Cart</button>
            </article>
          ))}
        </div>
      </section>

      <section id="cart" style={{ ...sectionStyle, background: "#f8f3e9" }}>
        <h2 style={{ textAlign: "center" }}>Your Shopping Cart</h2>
        {cartCount === 0 ? (
          <p style={{ textAlign: "center" }}>Your cart is empty. Add your favourite products to begin.</p>
        ) : (
          <div style={{ maxWidth: 720, margin: "25px auto" }}>
            {products.filter((p) => cart[p.id]).map((p) => (
              <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", padding: "14px 0", borderBottom: "1px solid #ddd0bc" }}>
                <div>
                  <strong>{p.name}</strong>
                  <div>{money(p.price)} × {cart[p.id]}</div>
                </div>
                <div>
                  <strong>{money(p.price * cart[p.id])} </strong>
                  <button onClick={() => removeFromCart(p.id)} style={{ padding: "7px 10px", cursor: "pointer" }}>− Remove</button>
                </div>
              </div>
            ))}
            <h3 style={{ textAlign: "right" }}>Subtotal: {money(total)}</h3>
            <p>Delivery charges, destination eligibility and final total must be confirmed before payment.</p>
            <button onClick={sendOrder} style={buttonStyle}>Continue to WhatsApp Order</button>
          </div>
        )}
      </section>

      <section id="delivery" style={sectionStyle}>
        <h2 style={{ textAlign: "center" }}>Delivery Information</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
          <article style={{ padding: 22, border: "1px solid #e8dcc8", borderRadius: 10 }}>
            <h3>🇵🇰 Pakistan</h3>
            <p>Contact us to confirm delivery areas, delivery charges, estimated timing and payment arrangements before placing an order.</p>
          </article>
          <article style={{ padding: 22, border: "1px solid #e8dcc8", borderRadius: 10 }}>
            <h3>🌍 International Enquiries</h3>
            <p>Tell us your destination country and postal code. Overseas delivery depends on courier availability, food import rules, product eligibility and shipping costs.</p>
          </article>
        </div>
        <p style={{ textAlign: "center", fontSize: 14 }}>International delivery is not confirmed until the destination and courier arrangements are checked.</p>
      </section>

      <section id="payments" style={{ ...sectionStyle, background: "#f8f3e9" }}>
        <h2 style={{ textAlign: "center" }}>Payment Information</h2>
        <p style={{ maxWidth: 800, margin: "auto", textAlign: "center" }}>
          Payment methods will be confirmed directly before your order is accepted.
          Local transfer, cash-on-delivery or digital payment options may be offered
          where available. International card payments require an eligible payment provider.
          Do not send card details or passwords through WhatsApp.
        </p>
      </section>

      <section id="contact" style={{ ...sectionStyle, textAlign: "center" }}>
        <h2>Contact Multani Mithas</h2>
        <p>For product questions, bulk orders, gifts, delivery and international enquiries, contact our team.</p>
        {BUSINESS_PHONE ? (
          <p>Phone: <a href={`tel:${BUSINESS_PHONE}`}>{BUSINESS_PHONE}</a></p>
        ) : (
          <p>Business phone number will be added soon.</p>
        )}
        {contactEmail ? (
          <p>Email: <a href={`mailto:${contactEmail}`}>{contactEmail}</a></p>
        ) : (
          <p>Business email will be added soon.</p>
        )}
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 12, marginTop: 20 }}>
          {WHATSAPP_NUMBER ? (
            <a href={`https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}?text=${encodeURIComponent("Assalam-o-Alaikum Multani Mithas, I have a question about your products and delivery.")}`} target="_blank" rel="noreferrer" style={buttonStyle}>WhatsApp Us</a>
          ) : (
            <span style={{ padding: 12, border: "1px solid #d8cbb7", borderRadius: 7 }}>WhatsApp contact will be activated after adding your number.</span>
          )}
          {contactEmail && <a href={`mailto:${contactEmail}`} style={buttonStyle}>Email Us</a>}
        </div>
      </section>

      <section id="policies" style={{ ...sectionStyle, background: "#fff8ed" }}>
        <h2 style={{ textAlign: "center" }}>Customer Information & Policies</h2>
        <div style={{ maxWidth: 850, margin: "auto" }}>
          <h3>Orders and cancellations</h3>
          <p>An order is not confirmed until the business confirms product availability, final price, delivery and payment arrangements.</p>
          <h3>Shipping and customs</h3>
          <p>International shipping charges, customs duties, import restrictions and delivery times vary by destination. These must be confirmed before accepting an overseas order.</p>
          <h3>Refunds and product issues</h3>
          <p>Please contact the business about damaged, incorrect or missing items. A complete refund and return policy must be finalised and published before accepting online payments.</p>
          <h3>Privacy</h3>
          <p>Only provide the personal information needed to handle an enquiry or order. A full privacy policy should be published before collecting customer data through a live order system.</p>
        </div>
      </section>

      <footer style={{ background: "#183d2b", color: "#fff4df", textAlign: "center", padding: 28 }}>
        <h3>Multani Mithas</h3>
        <p>Tradition in Every Bite.</p>
        <p>© {new Date().getFullYear()} Multani Mithas. All rights reserved.</p>
        <p style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 16 }}>
          <a href="#policies" style={{ color: "#f1c987" }}>Customer Policies</a>
          <a href="#delivery" style={{ color: "#f1c987" }}>Delivery</a>
          <a href="#contact" style={{ color: "#f1c987" }}>Contact</a>
          <a href="#home" style={{ color: "#f1c987" }}>Back to Top ↑</a>
        </p>
        <p style={{ fontSize: 12 }}>Prices, delivery and payment details must be verified before orders are confirmed.</p>
      </footer>

      {message && (
        <div role="status" style={{ position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)", background: "#183d2b", color: "white", padding: "12px 18px", borderRadius: 8, zIndex: 1000, maxWidth: "90%", textAlign: "center" }}>
          {message}
          <button onClick={() => setMessage("")} style={{ marginLeft: 12, cursor: "pointer" }}>×</button>
        </div>
      )}
    </main>
  );
}
