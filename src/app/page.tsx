
"use client";

import { useState } from "react";

const products = [
  { id: 1, name: "Multani Sohan Halwa", price: 1200, emoji: "🍯", category: "Traditional Sweets" },
  { id: 2, name: "Premium Barfi", price: 900, emoji: "🍬", category: "Traditional Sweets" },
  { id: 3, name: "Gulab Jamun", price: 650, emoji: "🍮", category: "Traditional Sweets" },
  { id: 4, name: "Besan Ladoo", price: 750, emoji: "🟡", category: "Traditional Sweets" },
  { id: 5, name: "Premium Gift Box", price: 2500, emoji: "🎁", category: "Gift Boxes" },
  { id: 6, name: "Sweet Celebration Box", price: 3200, emoji: "🎀", category: "Gift Boxes" },
  { id: 7, name: "Traditional Patisa", price: 1100, emoji: "🍯", category: "Traditional Sweets" },
  { id: 8, name: "Bakery Special", price: 1800, emoji: "🎂", category: "Bakery" },
];

const money = (amount: number) =>
  "Rs. " + amount.toLocaleString("en-PK");

export default function Home() {
  const [cart, setCart] = useState<{ [id: number]: number }>({});
  const [message, setMessage] = useState("");

  const addToCart = (id: number) => {
    setCart((current) => ({
      ...current,
      [id]: (current[id] || 0) + 1,
    }));
    setMessage("Product cart mein add ho gaya!");
    setTimeout(() => setMessage(""), 2500);
  };

  const removeFromCart = (id: number) => {
    setCart((current) => {
      const updated = { ...current };
      if (updated[id] > 1) {
        updated[id]--;
      } else {
        delete updated[id];
      }
      return updated;
    });
  };

  const cartCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  const total = products.reduce(
    (sum, product) => sum + product.price * (cart[product.id] || 0),
    0
  );

  const orderText = products
    .filter((product) => cart[product.id])
    .map(
      (product) =>
        `${product.name} x ${cart[product.id]} = ${money(
          product.price * cart[product.id]
        )}`
    )
    .join("\n");

  const sendOrder = () => {
    if (cartCount === 0) {
      setMessage("Pehle koi product cart mein add karein.");
      return;
    }

    const text = `Assalam-o-Alaikum Multani Mithas!\nMain ye order karna chahta/chahti hoon:\n\n${orderText}\n\nTotal: ${money(total)}\n\nPlease delivery details batayein.`;
    const whatsappNumber = ""; // Yahan apna WhatsApp number country code ke sath likhein.
    if (!whatsappNumber) {
      setMessage("Order tayyar hai. WhatsApp number set karna abhi baqi hai.");
      return;
    }
    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  const sectionTitle = {
    color: "#214b35",
    fontSize: "clamp(28px, 4vw, 38px)",
    textAlign: "center" as const,
    marginBottom: 12,
  };

  return (
    <main
      style={{
        fontFamily: "Arial, sans-serif",
        color: "#30251d",
        background: "#fffdf8",
        margin: 0,
      }}
    >
      <header
        style={{
          background: "#183d2b",
          color: "#fff4df",
          padding: "20px 6%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <a
          href="#home"
          style={{ color: "inherit", textDecoration: "none" }}
        >
          <h2 style={{ margin: 0 }}>Multani Mithas</h2>
          <small>Tradition in Every Bite</small>
        </a>

        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            flexWrap: "wrap",
          }}
        >
          {[
            ["Home", "#home"],
            ["About", "#about"],
            ["Products", "#products"],
            ["Gift Boxes", "#gift-boxes"],
            ["Contact", "#contact"],
          ].map(([label, href]) => (
            <a
              key={label}
              href={href}
              style={{
                color: "#fff4df",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              {label}
            </a>
          ))}
          <a
            href="#cart"
            style={{
              background: "#f1c987",
              color: "#183d2b",
              padding: "10px 14px",
              borderRadius: 7,
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Cart ({cartCount})
          </a>
        </nav>
      </header>

      <section
        id="home"
        style={{
          background: "linear-gradient(135deg, #f8ead1, #fff8ed)",
          padding: "85px 7%",
          textAlign: "center",
          scrollMarginTop: 20,
        }}
      >
        <p
          style={{
            color: "#98622f",
            fontWeight: "bold",
            letterSpacing: 3,
          }}
        >
          THE TRADITION OF MULTAN
        </p>
        <h1
          style={{
            fontSize: "clamp(38px, 6vw, 66px)",
            color: "#214b35",
            margin: "18px 0",
          }}
        >
          A Sweet Taste of Tradition
        </h1>
        <p
          style={{
            fontSize: 18,
            lineHeight: 1.8,
            maxWidth: 650,
            margin: "0 auto",
          }}
        >
          Discover authentic Pakistani sweets, traditional Multani Sohan
          Halwa, delicious treats and thoughtful gift boxes for your special
          moments.
        </p>
        <a
          href="#products"
          style={{
            display: "inline-block",
            marginTop: 28,
            background: "#a66a35",
            color: "white",
            padding: "15px 28px",
            textDecoration: "none",
            borderRadius: 7,
            fontWeight: "bold",
          }}
        >
          Explore Our Sweets
        </a>
      </section>

      <section
        id="about"
        style={{
          padding: "65px 7%",
          textAlign: "center",
          scrollMarginTop: 20,
        }}
      >
        <h2 style={sectionTitle}>About Multani Mithas</h2>
        <p
          style={{
            maxWidth: 760,
            margin: "20px auto 0",
            lineHeight: 1.9,
            fontSize: 17,
          }}
        >
          Multani Mithas celebrates the traditional taste of Pakistani sweets.
          From the rich flavour of Sohan Halwa to classic mithai and beautifully
          presented gift boxes, our aim is to make every celebration sweeter.
        </p>
      </section>

      <section
        id="products"
        style={{
          padding: "60px 6%",
          background: "#f8f3e9",
          scrollMarginTop: 20,
        }}
      >
        <h2 style={sectionTitle}>Our Specialties</h2>
        <p style={{ textAlign: "center", lineHeight: 1.7 }}>
          Discover traditional favourites and special treats.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(215px, 1fr))",
            gap: 22,
            marginTop: 35,
          }}
        >
          {products
            .filter((product) => product.category !== "Gift Boxes")
            .map((product) => (
              <article
                key={product.id}
                style={{
                  background: "#fffdf8",
                  border: "1px solid #e8dcc8",
                  borderRadius: 12,
                  padding: 24,
                  textAlign: "center",
                  boxShadow: "0 4px 14px rgba(48,37,29,0.05)",
                }}
              >
                <div style={{ fontSize: 64, marginBottom: 12 }}>
                  {product.emoji}
                </div>
                <p style={{ color: "#98622f", fontSize: 13 }}>
                  {product.category}
                </p>
                <h3>{product.name}</h3>
                <p style={{ fontWeight: "bold", fontSize: 19 }}>
                  {money(product.price)}
                </p>
                <button
                  onClick={() => addToCart(product.id)}
                  style={{
                    background: "#214b35",
                    color: "white",
                    padding: "12px 18px",
                    border: 0,
                    borderRadius: 6,
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Add to Cart
                </button>
              </article>
            ))}
        </div>
      </section>

      <section
        id="gift-boxes"
        style={{
          padding: "65px 6%",
          scrollMarginTop: 20,
        }}
      >
        <h2 style={sectionTitle}>Sweet Gifts for Every Occasion</h2>
        <p style={{ textAlign: "center", lineHeight: 1.7 }}>
          Share happiness with a thoughtful box of traditional sweets.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
            gap: 22,
            maxWidth: 800,
            margin: "30px auto 0",
          }}
        >
          {products
            .filter((product) => product.category === "Gift Boxes")
            .map((product) => (
              <article
                key={product.id}
                style={{
                  border: "1px solid #e8dcc8",
                  borderRadius: 12,
                  padding: 26,
                  textAlign: "center",
                  background: "#fffaf1",
                }}
              >
                <div style={{ fontSize: 65 }}>{product.emoji}</div>
                <h3>{product.name}</h3>
                <p style={{ fontWeight: "bold", fontSize: 19 }}>
                  {money(product.price)}
                </p>
                <button
                  onClick={() => addToCart(product.id)}
                  style={{
                    background: "#214b35",
                    color: "white",
                    padding: "12px 18px",
                    border: 0,
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                >
                  Add to Cart
                </button>
              </article>
            ))}
        </div>
      </section>

      <section
        id="cart"
        style={{
          padding: "60px 7%",
          background: "#f8f3e9",
          scrollMarginTop: 20,
        }}
      >
        <h2 style={sectionTitle}>Your Shopping Cart</h2>
        {cartCount === 0 ? (
          <p style={{ textAlign: "center", lineHeight: 1.8 }}>
            Your cart is empty. Browse our products and add your favourites.
          </p>
        ) : (
          <div style={{ maxWidth: 700, margin: "25px auto" }}>
            {products
              .filter((product) => cart[product.id])
              .map((product) => (
                <div
                  key={product.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 12,
                    padding: "16px 0",
                    borderBottom: "1px solid #e1d4bf",
                  }}
                >
                  <div>
                    <strong>{product.name}</strong>
                    <p style={{ margin: "6px 0" }}>
                      {money(product.price)} × {cart[product.id]}
                    </p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <strong>
                      {money(product.price * cart[product.id])}
                    </strong>
                    <button
                      onClick={() => removeFromCart(product.id)}
                      aria-label={`Remove one ${product.name}`}
                      style={{
                        padding: "7px 12px",
                        cursor: "pointer",
                        border: "1px solid #c9b9a0",
                        borderRadius: 5,
                        background: "white",
                      }}
                    >
                      − Remove
                    </button>
                  </div>
                </div>
              ))}
            <h3 style={{ textAlign: "right", fontSize: 24 }}>
              Total: {money(total)}
            </h3>
            <button
              onClick={sendOrder}
              style={{
                display: "block",
                marginLeft: "auto",
                background: "#214b35",
                color: "white",
                padding: "14px 22px",
                border: 0,
                borderRadius: 7,
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Prepare My Order
            </button>
          </div>
        )}
      </section>

      <section
        id="contact"
        style={{
          padding: "60px 7%",
          textAlign: "center",
          scrollMarginTop: 20,
        }}
      >
        <h2 style={sectionTitle}>Contact Multani Mithas</h2>
        <p style={{ lineHeight: 1.8 }}>
          Have a question about our sweets or gift boxes? Get in touch with us
          for product and delivery information.
        </p>
        <a
          href="mailto:info@multanimithas.com?subject=Multani%20Mithas%20Enquiry"
          style={{
            display: "inline-block",
            marginTop: 12,
            background: "#a66a35",
            color: "white",
            padding: "13px 22px",
            borderRadius: 6,
            textDecoration: "none",
          }}
        >
          Email Us
        </a>
      </section>

      {message && (
        <div
          role="status"
          style={{
            position: "fixed",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#183d2b",
            color: "white",
            padding: "14px 20px",
            borderRadius: 8,
            boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
            zIndex: 1000,
            maxWidth: "90%",
            textAlign: "center",
          }}
        >
          {message}
        </div>
      )}

      <footer
        style={{
          background: "#183d2b",
          color: "#fff4df",
          textAlign: "center",
          padding: "28px 7%",
          lineHeight: 1.8,
        }}
      >
        <h3>Multani Mithas</h3>
        <p>Tradition in Every Bite.</p>
        <p>© {new Date().getFullYear()} Multani Mithas. All rights reserved.</p>
        <a href="#home" style={{ color: "#f1c987" }}>
          Back to Top ↑
        </a>
      </footer>
    </main>
  );
}
