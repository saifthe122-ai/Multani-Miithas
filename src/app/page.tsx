"use client";

import { useState } from "react";

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
const BUSINESS_EMAIL =
  process.env.NEXT_PUBLIC_BUSINESS_EMAIL || "";
const BUSINESS_PHONE =
  process.env.NEXT_PUBLIC_BUSINESS_PHONE || "";

const products = [
  {
    id: 1,
    name: "Multani Sohan Halwa",
    price: 1200,
    category: "Traditional Sweets",
    image:
      "https://images.unsplash.com/photo-1605197161470-5d6e5f7f2f4d?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 2,
    name: "Premium Barfi",
    price: 900,
    category: "Traditional Sweets",
    image:
      "https://images.unsplash.com/photo-1601303516534-2b1c2d6f5f8e?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 3,
    name: "Gulab Jamun",
    price: 650,
    category: "Traditional Sweets",
    image:
      "https://images.unsplash.com/photo-1666190094762-1e7f1a3e7e3b?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 4,
    name: "Besan Ladoo",
    price: 750,
    category: "Traditional Sweets",
    image:
      "https://images.unsplash.com/photo-1606471191009-63994c53433b?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 5,
    name: "Premium Gift Box",
    price: 2500,
    category: "Gift Boxes",
    image:
      "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 6,
    name: "Sweet Celebration Box",
    price: 3200,
    category: "Gift Boxes",
    image:
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 7,
    name: "Traditional Patisa",
    price: 1100,
    category: "Traditional Sweets",
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 8,
    name: "Bakery Special",
    price: 1800,
    category: "Bakery",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=700&q=85",
  },
];

const money = (amount: number) =>
  "PKR " + amount.toLocaleString("en-PK");

const sectionStyle = {
  padding: "76px 6%",
  scrollMarginTop: 25,
};

const goldButton = {
  background: "#D8AC55",
  color: "#172E30",
  padding: "13px 23px",
  border: "1px solid #E8C77F",
  borderRadius: 3,
  cursor: "pointer",
  fontWeight: 700,
  textDecoration: "none",
  display: "inline-block",
  letterSpacing: 0.5,
};

export default function Home() {
  const [cart, setCart] = useState<Record<number, number>>({});
  const [message, setMessage] = useState("");

  const addToCart = (id: number) => {
    setCart((old) => ({
      ...old,
      [id]: (old[id] || 0) + 1,
    }));
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

  const cartCount = Object.values(cart).reduce(
    (sum, qty) => sum + qty,
    0
  );

  const total = products.reduce(
    (sum, product) =>
      sum + product.price * (cart[product.id] || 0),
    0
  );

  const orderLines = products
    .filter((product) => cart[product.id])
    .map(
      (product) =>
        `${product.name} x ${cart[product.id]} = ${money(
          product.price * cart[product.id]
        )}`
    )
    .join("\n");

  const sendOrder = () => {
    if (!cartCount) {
      setMessage("Pehle cart mein product add karein.");
      return;
    }

    const order =
      `Assalam-o-Alaikum Multani Mithas!\n\nMera order:\n` +
      `${orderLines}\n\nSubtotal: ${money(total)}` +
      `\nDelivery charges abhi confirm karne hain.` +
      `\n\nMera naam:\nDelivery country:\nCity / postal code:` +
      `\nFull address:\n\nPlease order aur delivery confirm karein.`;

    if (!WHATSAPP_NUMBER.trim()) {
      setMessage("WhatsApp number configure karna abhi baqi hai.");
      return;
    }

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER.replace(
        /\D/g,
        ""
      )}?text=${encodeURIComponent(order)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const contactEmail = BUSINESS_EMAIL.trim();

  const regularProducts = products.filter(
    (product) => product.category !== "Gift Boxes"
  );

  const giftProducts = products.filter(
    (product) => product.category === "Gift Boxes"
  );

  const categories = [
    { name: "Sohan Halwa", symbol: "✦", target: "#products" },
    { name: "Barfi", symbol: "❖", target: "#products" },
    { name: "Gulab Jamun", symbol: "✧", target: "#products" },
    { name: "Ladoo", symbol: "❋", target: "#products" },
    { name: "Patisa", symbol: "✦", target: "#products" },
    { name: "Cakes & Bakery", symbol: "❖", target: "#products" },
    { name: "Gift Boxes", symbol: "✧", target: "#gifts" },
  ];

  return (
    <main
      style={{
        background: "#F3E8D4",
        color: "#243537",
        fontFamily: "Georgia, 'Times New Roman', serif",
        lineHeight: 1.7,
        overflow: "hidden",
      }}
    >
      <style>{`
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }

        body { margin: 0; }

        .mm-topbar {
          background: #092F32;
          color: #F6E9D0;
          border-bottom: 1px solid rgba(216,172,85,.55);
          padding: 13px 5%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
        }

        .mm-brand {
          text-decoration: none;
          color: #E4BD69;
          min-width: 190px;
        }

        .mm-brand-title {
          margin: 0;
          font-size: 25px;
          letter-spacing: 2px;
          line-height: 1.3;
        }

        .mm-brand-subtitle {
          font-size: 10px;
          letter-spacing: 3px;
          color: #F3E8D4;
        }

        .mm-nav {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 20px;
        }

        .mm-nav a {
          color: #F3E8D4;
          text-decoration: none;
          font-size: 13px;
          transition: color .2s ease;
        }

        .mm-nav a:hover { color: #E4BD69; }

        .mm-cart-link {
          color: #092F32 !important;
          background: #D8AC55;
          padding: 9px 14px;
          border-radius: 2px;
          font-weight: bold;
        }

        .mm-hero {
          position: relative;
          min-height: 540px;
          display: flex;
          align-items: center;
          padding: 65px 8%;
          color: #FFF4E0;
          background-color: #123638;
          background-image:
            linear-gradient(
              90deg,
              rgba(5,25,27,.92) 0%,
              rgba(5,25,27,.72) 43%,
              rgba(5,25,27,.12) 100%
            ),
            url('/images/multan-hero.jpg');
          background-size: cover;
          background-position: center;
          border-bottom: 4px solid #C89A43;
        }

        .mm-hero-content {
          position: relative;
          z-index: 1;
          max-width: 610px;
        }

        .mm-eyebrow {
          color: #E6BD6C;
          letter-spacing: 4px;
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
        }

        .mm-hero h1 {
          color: #FFF1D7;
          font-size: clamp(42px, 6vw, 76px);
          line-height: 1.08;
          margin: 17px 0;
          font-weight: normal;
          text-shadow: 0 3px 22px rgba(0,0,0,.3);
        }

        .mm-hero-script {
          display: block;
          color: #E6BD6C;
          font-style: italic;
          font-size: .88em;
        }

        .mm-hero-description {
          font-size: 18px;
          max-width: 450px;
          color: #F5E7CE;
          margin: 20px 0 28px;
        }

        .mm-outline-button {
          display: inline-block;
          padding: 12px 22px;
          border: 1px solid #D8AC55;
          color: #F6E9D0;
          text-decoration: none;
          margin-left: 10px;
        }

        .mm-section-heading {
          text-align: center;
          color: #123F42;
          font-size: clamp(28px, 4vw, 39px);
          line-height: 1.2;
          font-weight: normal;
          margin: 0 0 12px;
        }

        .mm-section-intro {
          text-align: center;
          max-width: 700px;
          margin: 0 auto 35px;
          color: #6C5A43;
          font-size: 15px;
        }

        .mm-ornament {
          text-align: center;
          color: #B88A38;
          font-size: 23px;
          margin: 0 auto 10px;
          letter-spacing: 8px;
        }

        .mm-category-grid {
          display: grid;
          grid-template-columns: repeat(7, minmax(0, 1fr));
          gap: 13px;
          margin-top: 35px;
        }

        .mm-category {
          display: flex;
          min-height: 105px;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 5px;
          text-align: center;
          text-decoration: none;
          color: #F6E9D0;
          background:
            linear-gradient(145deg, #145154, #082F32);
          border: 1px solid #C69A4A;
          padding: 14px 7px;
          transition: transform .2s ease, background .2s ease;
        }

        .mm-category:hover {
          transform: translateY(-4px);
          background: #1A6263;
        }

        .mm-category-symbol {
          color: #E3BD70;
          font-size: 27px;
          line-height: 1.2;
        }

        .mm-category-name {
          font-size: 12px;
          font-weight: bold;
        }

        .mm-card {
          background: #FFF8EA;
          border: 1px solid #D8C59F;
          overflow: hidden;
          box-shadow: 0 5px 16px rgba(47,38,22,.07);
          transition: transform .25s ease, box-shadow .25s ease;
        }

        .mm-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 13px 26px rgba(30,41,34,.15);
        }

        .mm-product-image {
          display: block;
          width: 100%;
          height: 235px;
          object-fit: cover;
          background: #E7D7B9;
        }

        .mm-card-body {
          padding: 20px 15px 23px;
          text-align: center;
        }

        .mm-card-category {
          color: #9A7132;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .mm-card-title {
          color: #153E40;
          font-size: 19px;
          line-height: 1.4;
          margin: 8px 0;
        }

        .mm-price {
          color: #8A5630;
          font-size: 20px;
          font-weight: bold;
          margin: 10px 0 16px;
        }

        .mm-gold-button {
          background: #D8AC55;
          color: #173639;
          border: 1px solid #BD8E36;
          border-radius: 2px;
          padding: 11px 18px;
          cursor: pointer;
          font-weight: bold;
          font-family: inherit;
          transition: background .2s ease;
        }

        .mm-gold-button:hover { background: #E7C77F; }

        .mm-heritage {
          position: relative;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 45px;
          background:
            radial-gradient(ellipse at top left, #1B5251, transparent 50%),
            #092F32;
          color: #F3E8D4;
          border-top: 3px solid #C89A43;
          border-bottom: 3px solid #C89A43;
        }

        .mm-heritage-image {
          width: 100%;
          aspect-ratio: 4 / 3;
          object-fit: cover;
          border: 2px solid #D8AC55;
          display: block;
        }

        .mm-heritage h2 {
          font-size: clamp(30px, 4vw, 43px);
          font-weight: normal;
          line-height: 1.2;
          color: #FFF0D4;
          margin: 12px 0 20px;
        }

        .mm-heritage p { color: #E8DCC5; }

        .mm-video {
          width: 100%;
          display: block;
          aspect-ratio: 16 / 9;
          object-fit: cover;
          background: #061F21;
          border: 2px solid #C89A43;
        }

        .mm-benefits {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 15px;
          text-align: center;
        }

        .mm-benefit {
          border-right: 1px solid #D6BD8D;
          padding: 8px;
          color: #244547;
          font-size: 13px;
        }

        .mm-benefit:last-child { border-right: 0; }

        .mm-benefit-symbol {
          color: #A87929;
          font-size: 27px;
          display: block;
          margin-bottom: 8px;
        }

        .mm-gift-banner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 25px;
          min-height: 300px;
          padding: 35px;
          color: #FFF1D8;
          background:
            linear-gradient(90deg, rgba(35,12,18,.2), rgba(45,10,20,.88)),
            url('/images/multan-gift-hamper.jpg') center / cover,
            #702F3B;
          border: 2px solid #C99B4A;
        }

        .mm-gift-banner h2 {
          font-size: clamp(30px, 4vw, 45px);
          line-height: 1.2;
          font-weight: normal;
          margin: 10px 0;
        }

        .mm-info-card {
          padding: 24px;
          background: #FFF8EA;
          border: 1px solid #D8C59F;
        }

        .mm-input {
          width: 100%;
          padding: 11px;
          border: 1px solid #D8C59F;
          background: #FFFDF7;
          color: #243537;
          font: inherit;
        }

        .mm-footer {
          background: #082D30;
          color: #F3E8D4;
          padding: 45px 6% 25px;
          text-align: center;
          border-top: 3px solid #C89A43;
        }

        .mm-footer a {
          color: #E6BD6C;
          text-decoration: none;
        }

        .mm-toast {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1000;
          background: #092F32;
          color: #FFF5DF;
          border: 1px solid #D8AC55;
          padding: 12px 18px;
          max-width: 90%;
          box-shadow: 0 5px 20px rgba(0,0,0,.2);
        }

        @media (max-width: 1000px) {
          .mm-category-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }

          .mm-benefits {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .mm-heritage { gap: 25px; }
        }

        @media (max-width: 650px) {
          .mm-topbar { justify-content: center; text-align: center; }
          .mm-brand { width: 100%; }
          .mm-nav { gap: 13px; }
          .mm-nav a { font-size: 12px; }

          .mm-hero {
            min-height: 510px;
            padding: 60px 7%;
            background-position: 62% center;
          }

          .mm-hero h1 { font-size: 43px; }
          .mm-hero-description { font-size: 16px; }

          .mm-outline-button {
            margin: 12px 0 0;
          }

          .mm-category-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 10px;
          }

          .mm-product-image { height: 190px; }

          .mm-heritage { grid-template-columns: 1fr; }
          .mm-benefits { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .mm-benefit { border-right: 0; border-bottom: 1px solid #D6BD8D; }

          .mm-gift-banner {
            grid-template-columns: 1fr;
            padding: 25px;
            min-height: 350px;
            background-position: center;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            scroll-behavior: auto !important;
            transition: none !important;
          }
        }
      `}</style>

      {/* HEADER */}
      <header className="mm-topbar">
        <a href="#home" className="mm-brand">
          <h2 className="mm-brand-title">✧ MULTANI MITHAS ✧</h2>
          <span className="mm-brand-subtitle">
            MULTAN KI MITHAS, DIL SE
          </span>
        </a>

        <nav className="mm-nav">
          <a href="#home">Home</a>
          <a href="#products">Shop</a>
          <a href="#about">Our Story</a>
          <a href="#gallery">Gallery</a>
          <a href="#video">Our Video</a>
          <a href="#contact">Contact</a>
          <a href="#cart" className="mm-cart-link">
            Cart ({cartCount})
          </a>
        </nav>
      </header>

      {/* CINEMATIC MULTAN HERO */}
      <section id="home" className="mm-hero">
        <div className="mm-hero-content">
          <p className="mm-eyebrow">
            Authentic Multani Sweets
          </p>

          <h1>
            Multan Ki Mithas,
            <span className="mm-hero-script"> Dil Se</span>
          </h1>

          <p className="mm-hero-description">
            Saraiki Wasib ki riwayat, har mithai ke saath.
            Discover the timeless taste and sweet heritage of
            Multan, Pakistan.
          </p>

          <a href="#products" style={goldButton}>
            Shop Our Mithai →
          </a>

          <a href="#about" className="mm-outline-button">
            Discover Our Story
          </a>

          <p style={{ fontSize: 12, color: "#E6BD6C", marginTop: 25 }}>
            TRADITION · HERITAGE · SWEETNESS
          </p>
        </div>
      </section>

      {/* SIGNATURE COLLECTION */}
      <section
        id="categories"
        style={{
          ...sectionStyle,
          background: "#F3E8D4",
          paddingTop: 45,
          paddingBottom: 48,
        }}
      >
        <div className="mm-ornament">❖ ✦ ❖</div>
        <h2 className="mm-section-heading">
          Our Signature Collection
        </h2>
        <p className="mm-section-intro">
          Traditional favourites, inspired by the sweet heritage
          of Multan and the warmth of the Saraiki Wasib.
        </p>

        <div className="mm-category-grid">
          {categories.map((category) => (
            <a
              key={category.name}
              href={category.target}
              className="mm-category"
            >
              <span className="mm-category-symbol">
                {category.symbol}
              </span>
              <span className="mm-category-name">
                {category.name}
              </span>
              <span style={{ color: "#E3BD70" }}>↗</span>
            </a>
          ))}
        </div>
      </section>

      {/* PRODUCTS */}
      <section
        id="products"
        style={{
          ...sectionStyle,
          background: "#FFF8EA",
        }}
      >
        <div className="mm-ornament">✦ ❖ ✦</div>
        <h2 className="mm-section-heading">
          The Taste of Multan
        </h2>
        <p className="mm-section-intro">
          Explore our traditional sweets and bakery favourites.
          Prices are displayed in Pakistani rupees.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 22,
          }}
        >
          {regularProducts.map((product) => (
            <article key={product.id} className="mm-card">
              <img
                className="mm-product-image"
                src={product.image}
                alt={product.name}
                loading="lazy"
              />

              <div className="mm-card-body">
                <span className="mm-card-category">
                  {product.category}
                </span>

                <h3 className="mm-card-title">
                  {product.name}
                </h3>

                <p className="mm-price">
                  {money(product.price)}
                </p>

                <button
                  className="mm-gold-button"
                  onClick={() => addToCart(product.id)}
                >
                  Add to Cart +
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* HERITAGE STORY */}
      <section
        id="about"
        className="mm-heritage"
        style={sectionStyle}
      >
        <div>
          <img
            src="/images/multan-shrine-story.jpg"
            alt="Multan heritage and traditional architecture"
            className="mm-heritage-image"
            loading="lazy"
          />

          <p
            style={{
              fontSize: 12,
              color: "#E6BD6C",
              textAlign: "center",
            }}
          >
            THE HERITAGE OF MULTAN
          </p>
        </div>

        <div>
          <p className="mm-eyebrow">Our Heritage</p>

          <h2>From the Heart of Multan</h2>

          <p>
            Multani Mithas is more than sweets. It is a celebration
            of tradition, family, hospitality and the cultural
            richness of South Punjab.
          </p>

          <p>
            Inspired by Multan's iconic blue tilework, historic
            architecture and the warmth of the Saraiki Wasib,
            we bring a taste of heritage to every special moment.
          </p>

          <a href="#video" style={goldButton}>
            Watch Our Story →
          </a>
        </div>
      </section>

      {/* GALLERY */}
      <section
        id="gallery"
        style={{
          ...sectionStyle,
          background: "#F3E8D4",
        }}
      >
        <div className="mm-ornament">❖ ✦ ❖</div>
        <h2 className="mm-section-heading">
          A Celebration of Sweetness
        </h2>

        <p className="mm-section-intro">
          From everyday treats to unforgettable gifts,
          discover the moments that bring families together.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(230px, 1fr))",
            gap: 20,
          }}
        >
          {[
            {
              image: products[0].image,
              title: "Our Traditional Sweets",
            },
            {
              image: products[4].image,
              title: "Gifts for Loved Ones",
            },
            {
              image: products[7].image,
              title: "Celebration Treats",
            },
          ].map((item) => (
            <article key={item.title} className="mm-card">
              <img
                src={item.image}
                alt={item.title}
                className="mm-product-image"
                loading="lazy"
                style={{ height: 260 }}
              />

              <div className="mm-card-body">
                <h3 className="mm-card-title">{item.title}</h3>
                <a
                  href="#products"
                  style={{
                    color: "#8B642B",
                    textDecoration: "none",
                  }}
                >
                  Explore collection →
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CINEMATIC VIDEO */}
      <section
        id="video"
        style={{
          ...sectionStyle,
          background: "#092F32",
          color: "#F3E8D4",
        }}
      >
        <div className="mm-ornament">✦ ❖ ✦</div>

        <p
          className="mm-eyebrow"
          style={{ textAlign: "center" }}
        >
          Our Story · Our City · Our Tradition
        </p>

        <h2
          className="mm-section-heading"
          style={{ color: "#FFF1D7" }}
        >
          Experience the Magic of Multan
        </h2>

        <p
          className="mm-section-intro"
          style={{ color: "#D9D0BE" }}
        >
          A visual journey through our heritage, traditional
          sweets and the city that inspires our story.
        </p>

        <div style={{ maxWidth: 950, margin: "auto" }}>
          <video
            className="mm-video"
            controls
            playsInline
            preload="metadata"
            poster="/images/multan-shrine-story.jpg"
          >
            <source
              src="/videos/multani-mithas-promo.mp4"
              type="video/mp4"
            />
            Your browser does not support video playback.
          </video>

          <p
            style={{
              textAlign: "center",
              fontSize: 13,
              color: "#D9D0BE",
              marginTop: 15,
            }}
          >
            Our Multani Mithas brand film.
          </p>
        </div>
      </section>

      {/* BRAND BENEFITS */}
      <section
        style={{
          ...sectionStyle,
          paddingTop: 32,
          paddingBottom: 32,
          background: "#E8D6B4",
        }}
      >
        <div className="mm-benefits">
          {[
            ["✿", "Traditional Taste", "Inspired by Multan"],
            ["❖", "Premium Quality", "Carefully presented"],
            ["♧", "Easy Ordering", "Simple shopping"],
            ["♧", "Delivery Enquiries", "Confirm before ordering"],
            ["♡", "Customer Care", "Here to help"],
          ].map(([symbol, title, subtitle]) => (
            <div key={title} className="mm-benefit">
              <span className="mm-benefit-symbol">{symbol}</span>
              <strong>{title}</strong>
              <br />
              <span>{subtitle}</span>
            </div>
          ))}
        </div>
      </section>

      {/* GIFT COLLECTION */}
      <section
        id="gifts"
        style={{
          ...sectionStyle,
          background: "#FFF8EA",
        }}
      >
        <div className="mm-gift-banner">
          <div>
            <p className="mm-eyebrow">Special Collection</p>
            <h2>Gifts Filled with Tradition</h2>
            <p>
              Share the sweetness of Multan with family,
              friends and loved ones.
            </p>
            <a href="#gift-products" style={goldButton}>
              Explore Gift Boxes →
            </a>
          </div>
        </div>

        <h2
          className="mm-section-heading"
          style={{ marginTop: 45 }}
        >
          Gift Boxes & Celebrations
        </h2>

        <p className="mm-section-intro">
          Thoughtful gifts for weddings, celebrations,
          family gatherings and special occasions.
        </p>

        <div
          id="gift-products"
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(230px, 1fr))",
            gap: 22,
            maxWidth: 800,
            margin: "auto",
          }}
        >
          {giftProducts.map((product) => (
            <article key={product.id} className="mm-card">
              <img
                className="mm-product-image"
                src={product.image}
                alt={product.name}
                loading="lazy"
              />

              <div className="mm-card-body">
                <h3 className="mm-card-title">{product.name}</h3>
                <p className="mm-price">{money(product.price)}</p>

                <button
                  className="mm-gold-button"
                  onClick={() => addToCart(product.id)}
                >
                  Add to Cart +
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* SHOPPING CART */}
      <section
        id="cart"
        style={{
          ...sectionStyle,
          background: "#F3E8D4",
        }}
      >
        <div className="mm-ornament">❖ ✦ ❖</div>

        <h2 className="mm-section-heading">
          Your Shopping Cart
        </h2>

        <p className="mm-section-intro">
          Review your selection before sending your order enquiry.
        </p>

        {cartCount === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: 30,
              border: "1px solid #D8C59F",
              background: "#FFF8EA",
              maxWidth: 650,
              margin: "auto",
            }}
          >
            Your cart is empty. Explore our collection
            and choose your favourite sweets.
          </div>
        ) : (
          <div
            style={{
              maxWidth: 800,
              margin: "auto",
              padding: 25,
              background: "#FFF8EA",
              border: "1px solid #D8C59F",
            }}
          >
            {products
              .filter((product) => cart[product.id])
              .map((product) => (
                <div
                  key={product.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 12,
                    flexWrap: "wrap",
                    padding: "15px 0",
                    borderBottom: "1px solid #D8C59F",
                  }}
                >
                  <div>
                    <strong>{product.name}</strong>
                    <div>
                      {money(product.price)} × {cart[product.id]}
                    </div>
                  </div>

                  <div>
                    <strong>
                      {money(product.price * cart[product.id])}
                    </strong>{" "}
                    <button
                      onClick={() => removeFromCart(product.id)}
                      style={{
                        padding: "7px 10px",
                        marginLeft: 8,
                        cursor: "pointer",
                        border: "1px solid #C8B48C",
                        background: "#F3E8D4",
                      }}
                    >
                      − Remove
                    </button>
                  </div>
                </div>
              ))}

            <h3 style={{ textAlign: "right", color: "#123F42" }}>
              Subtotal: {money(total)}
            </h3>

            <p style={{ fontSize: 14 }}>
              Delivery charges, destination eligibility and final
              total must be confirmed before payment.
            </p>

            <button
              onClick={sendOrder}
              className="mm-gold-button"
              style={{ width: "100%" }}
            >
              Continue to WhatsApp Order →
            </button>
          </div>
        )}
      </section>

      {/* DELIVERY */}
      <section
        id="delivery"
        style={{
          ...sectionStyle,
          background: "#FFF8EA",
        }}
      >
        <h2 className="mm-section-heading">
          Delivery Information
        </h2>

        <p className="mm-section-intro">
          Contact us to confirm availability and delivery
          arrangements for your destination.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 20,
          }}
        >
          <article className="mm-info-card">
            <p className="mm-eyebrow">Pakistan</p>
            <h3>Domestic Orders</h3>
            <p>
              Delivery areas, charges, estimated timing and
              payment arrangements must be confirmed before
              an order is accepted.
            </p>
          </article>

          <article className="mm-info-card">
            <p className="mm-eyebrow">Worldwide</p>
            <h3>International Enquiries</h3>
            <p>
              Overseas delivery depends on courier availability,
              food import rules, product eligibility and shipping
              costs for the destination.
            </p>
          </article>
        </div>
      </section>

      {/* PAYMENTS */}
      <section
        id="payments"
        style={{
          ...sectionStyle,
          background: "#E8D6B4",
        }}
      >
        <h2 className="mm-section-heading">
          Payment Information
        </h2>

        <p
          style={{
            maxWidth: 800,
            margin: "auto",
            textAlign: "center",
          }}
        >
          Payment methods will be confirmed directly before
          your order is accepted. Available local transfer,
          cash-on-delivery or digital payment options depend
          on business arrangements. International card payments
          require an eligible payment provider. Never send
          card details or passwords through WhatsApp.
        </p>
      </section>

      {/* CONTACT */}
      <section
        id="contact"
        style={{
          ...sectionStyle,
          background: "#FFF8EA",
          textAlign: "center",
        }}
      >
        <div className="mm-ornament">✦ ❖ ✦</div>
        <h2 className="mm-section-heading">
          Contact Multani Mithas
        </h2>

        <p className="mm-section-intro">
          Product questions, bulk orders, gift collections
          and delivery enquiries — we are here to help.
        </p>

        {BUSINESS_PHONE ? (
          <p>
            Phone:{" "}
            <a href={`tel:${BUSINESS_PHONE}`}>
              {BUSINESS_PHONE}
            </a>
          </p>
        ) : (
          <p>Business phone number will be added soon.</p>
        )}

        {contactEmail ? (
          <p>
            Email:{" "}
            <a href={`mailto:${contactEmail}`}>
              {contactEmail}
            </a>
          </p>
        ) : (
          <p>Business email will be added soon.</p>
        )}

        {WHATSAPP_NUMBER ? (
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER.replace(
              /\D/g,
              ""
            )}?text=${encodeURIComponent(
              "Assalam-o-Alaikum Multani Mithas, I have a question about your products and delivery."
            )}`}
            target="_blank"
            rel="noreferrer"
            style={goldButton}
          >
            Contact Us on WhatsApp
          </a>
        ) : (
          <p>
            WhatsApp contact will be activated after
            adding your number.
          </p>
        )}
      </section>

      {/* POLICIES */}
      <section
        id="policies"
        style={{
          ...sectionStyle,
          background: "#F3E8D4",
        }}
      >
        <h2 className="mm-section-heading">
          Customer Information & Policies
        </h2>

        <div style={{ maxWidth: 850, margin: "auto" }}>
          <h3>Orders and cancellations</h3>
          <p>
            An order is not confirmed until the business confirms
            product availability, final price, delivery and
            payment arrangements.
          </p>

          <h3>Shipping and customs</h3>
          <p>
            International shipping charges, customs duties,
            import restrictions and delivery times vary by
            destination and must be confirmed before acceptance.
          </p>

          <h3>Refunds and product issues</h3>
          <p>
            Contact the business about damaged, incorrect or
            missing items. Finalise and publish the refund and
            return policy before accepting online payments.
          </p>

          <h3>Privacy</h3>
          <p>
            Only provide the personal information needed to
            handle an enquiry or order. Publish a complete
            privacy policy before collecting customer data
            through a live order system.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mm-footer">
        <div className="mm-ornament">✦ ❖ ✦</div>

        <h2
          style={{
            color: "#E6BD6C",
            letterSpacing: 3,
            fontSize: 26,
            marginBottom: 4,
          }}
        >
          MULTANI MITHAS
        </h2>

        <p style={{ fontStyle: "italic" }}>
          Multan Ki Mithas, Dil Se.
        </p>

        <p style={{ fontSize: 12, color: "#D9D0BE" }}>
          Inspired by the heritage and traditions of Multan,
          South Punjab, Pakistan.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: 20,
            margin: "25px 0",
            fontSize: 13,
          }}
        >
          <a href="#policies">Customer Policies</a>
          <a href="#delivery">Delivery</a>
          <a href="#payments">Payments</a>
          <a href="#contact">Contact</a>
          <a href="#home">Back to Top ↑</a>
        </div>

        <div
          style={{
            borderTop: "1px solid rgba(216,172,85,.4)",
            paddingTop: 18,
            fontSize: 12,
          }}
        >
          © {new Date().getFullYear()} Multani Mithas.
          All rights reserved.
        </div>
      </footer>

      {/* CART NOTIFICATION */}
      {message && (
        <div className="mm-toast" role="status">
          {message}
          <button
            onClick={() => setMessage("")}
            aria-label="Dismiss notification"
            style={{
              marginLeft: 15,
              cursor: "pointer",
              color: "#E6BD6C",
              background: "transparent",
              border: 0,
              fontSize: 18,
            }}
          >
            ×
          </button>
        </div>
      )}
    </main>
  );
}
