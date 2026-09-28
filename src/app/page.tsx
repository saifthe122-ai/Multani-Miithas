
const products = [
  { name: "Multani Sohan Halwa", price: "Rs. 1,200", emoji: "🍯" },
  { name: "Premium Barfi", price: "Rs. 900", emoji: "🍬" },
  { name: "Gulab Jamun", price: "Rs. 650", emoji: "🍮" },
  { name: "Premium Gift Box", price: "Rs. 2,500", emoji: "🎁" },
];

export default function Home() {
  return (
    <main style={{ fontFamily: "Arial, sans-serif", color: "#302018" }}>
      <header style={{
        background: "#183d2b",
        color: "#fff4df",
        padding: "22px 7%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 16
      }}>
        <h2>Multani Mithas</h2>
        <nav>Home　 Products　 Gift Boxes　 Contact</nav>
      </header>

      <section style={{
        background: "#f7eddb",
        padding: "90px 7%",
        textAlign: "center"
      }}>
        <p>THE TRADITION OF MULTAN</p>
        <h1 style={{ fontSize: "clamp(36px, 6vw, 64px)" }}>
          A Sweet Taste of Tradition
        </h1>
        <p>Authentic Pakistani sweets, crafted for your special moments.</p>
        <a href="#products" style={{
          display: "inline-block",
          marginTop: 20,
          background: "#a66a35",
          color: "white",
          padding: "14px 28px",
          textDecoration: "none",
          borderRadius: 6
        }}>
          Explore Our Sweets
        </a>
      </section>

      <section id="products" style={{ padding: "50px 7%" }}>
        <h2 style={{ textAlign: "center", fontSize: 32 }}>
          Our Specialties
        </h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: 24,
          marginTop: 30
        }}>
          {products.map((product) => (
            <article key={product.name} style={{
              background: "#fffaf1",
              border: "1px solid #eadcc6",
              borderRadius: 12,
              padding: 24,
              textAlign: "center"
            }}>
              <div style={{ fontSize: 65 }}>{product.emoji}</div>
              <h3>{product.name}</h3>
              <p>{product.price}</p>
              <button style={{
                background: "#183d2b",
                color: "white",
                padding: "12px 22px",
                border: 0,
                borderRadius: 6,
                cursor: "pointer"
              }}>
                View Product
              </button>
            </article>
          ))}
        </div>
      </section>

      <footer style={{
        background: "#183d2b",
        color: "#fff4df",
        textAlign: "center",
        padding: 25
      }}>
        Multani Mithas — Tradition in Every Bite.
      </footer>
    </main>
  );
}
