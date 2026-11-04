"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  discount?: number;
  stock: number;
  image_url?: string;
  image?: string;
  description?: string;
};

const slugify = (value: string) => value.toLowerCase().trim().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => setProducts(Array.isArray(data?.products) ? data.products.filter((p: Product) => String(p.category || "").trim()) : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const categories = Array.from(new Set(products.map((p) => p.category))).sort((a, b) => a.localeCompare(b));

  return (
    <main style={{ minHeight: "100vh", background: "#FFF8EA", color: "#123F42", fontFamily: "Georgia, serif" }}>
      <header style={{ padding: "20px 6%", background: "#092F32", color: "#F6E9D0", display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <Link href="/" style={{ color: "#E4BD69", textDecoration: "none", letterSpacing: 2 }}>✧ MULTANI MITHAS ✧</Link>
        <Link href="/" style={{ color: "#F6E9D0" }}>Home</Link>
      </header>
      <section style={{ padding: "56px 6% 28px", textAlign: "center" }}>
        <p style={{ color: "#A16B16", letterSpacing: 3, fontSize: 12 }}>SHOP BY COLLECTION</p>
        <h1 style={{ fontWeight: 400, fontSize: "clamp(32px,5vw,52px)", margin: "8px 0" }}>Our Products</h1>
        <p style={{ color: "#6C5A43" }}>Browse every collection in its own space. New active products appear here automatically.</p>
      </section>
      {loading ? <p style={{ textAlign: "center", padding: 40 }}>Loading collections…</p> : categories.length === 0 ? <p style={{ textAlign: "center", padding: 40 }}>Products are being updated. Please check back shortly.</p> : (
        <section style={{ padding: "20px 6% 70px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 20 }}>
          {categories.map((category) => {
            const items = products.filter((p) => p.category === category);
            const cover = items.find((p) => p.image_url || p.image);
            return <Link key={category} href={`/shop/${slugify(category)}`} style={{ minHeight: 230, padding: 24, border: "1px solid #D8C59F", borderRadius: 12, background: "#FFFCF5", color: "inherit", textDecoration: "none", display: "flex", flexDirection: "column", justifyContent: "end", backgroundImage: cover?.image_url || cover?.image ? `linear-gradient(0deg,rgba(9,47,50,.92),rgba(9,47,50,.08)),url("${cover.image_url || cover.image}")` : "linear-gradient(145deg,#EAD8B7,#FFF8EA)", backgroundSize: "cover", backgroundPosition: "center" }}>
              <span style={{ color: "#F6E9D0", fontSize: 12 }}>{items.length} {items.length === 1 ? "product" : "products"}</span>
              <h2 style={{ color: "#FFF1D7", fontWeight: 400, margin: "6px 0" }}>{category}</h2>
              <span style={{ color: "#E6BD6C" }}>Explore collection →</span>
            </Link>;
          })}
        </section>
      )}
      <footer style={{ padding: 24, textAlign: "center", background: "#092F32", color: "#F6E9D0" }}>Multani Mithas · Multan ki Mithas, Dil Se</footer>
    </main>
  );
}
