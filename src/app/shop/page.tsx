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

  const collections = [
    { title: "Mithai", slug: "mithai" },
    { title: "Barfi", slug: "barfi" },
    { title: "Sohan Halwa", slug: "sohan-halwa" },
    { title: "Desi Ghee", slug: "desi-ghee" },
    { title: "Pure Honey", slug: "pure-honey" },
    { title: "Dry Fruits", slug: "dry-fruits" },
  ];
  const matchesCollection = (product: Product, slug: string) => {
    const value = `${product.category} ${product.name}`.toLowerCase().replace(/[^a-z0-9]+/g, " ");
    if (slug === "barfi") return /barfi/.test(value);
    if (slug === "sohan-halwa") return /sohan/.test(value);
    if (slug === "desi-ghee") return /\bghee\b/.test(value);
    if (slug === "pure-honey") return /honey|shahad/.test(value);
    if (slug === "dry-fruits") return /dry\s*fruit|almond|badam|pista|cashew|kaju|akhrot|walnut/.test(value);
    if (slug === "honey-dry-fruits") return /honey|shahad|dry\s*fruit|almond|badam|pista|cashew|kaju|akhrot|walnut/.test(value);
    if (slug === "mithai") return !/barfi|sohan|\bghee\b|honey|dry\s*fruit|kheer|gajar|carrot\s*halwa|gift\s*box/.test(value) && (/mithai|sweet|gulab\s*jamun|rasgulla|rasgula|ladoo|laddu|motichoor|cham\s*cham|patisa|petha|coconut|traditional/.test(value));
    return false;
  };
  const collectionCards = collections.map((collection) => {
    const items = products.filter((product) => matchesCollection(product, collection.slug));
    return { ...collection, items, cover: items.find((product) => product.image_url || product.image) };
  }).filter((collection) => collection.items.length > 0);
  const isGiftCategory = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "") === "giftboxes";
  const giftProducts = products.filter((p) => isGiftCategory(p.category));
  const giftCover = giftProducts.find((p) => p.image_url || p.image);

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
      {loading ? <p style={{ textAlign: "center", padding: 40 }}>Loading collections…</p> : collectionCards.length === 0 && giftProducts.length === 0 ? <p style={{ textAlign: "center", padding: 40 }}>Products are being updated. Please check back shortly.</p> : (
        <section style={{ padding: "20px 6% 70px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 20 }}>
          {giftProducts.length > 0 && (
            <Link href="/shop/gift-boxes" style={{ minHeight: 310, border: "2px solid #C69A4A", borderRadius: 12, background: "#FFFCF5", color: "inherit", textDecoration: "none", display: "flex", flexDirection: "column", overflow: "hidden" }}>
              <div style={{ height: 235, padding: 14, display: "grid", placeItems: "center", background: "#F5EBDD" }}>
                {giftCover?.image_url || giftCover?.image ? <img src={giftCover.image_url || giftCover.image} alt="Gift Boxes collection" loading="lazy" style={{ display: "block", width: "100%", height: "100%", objectFit: "contain", objectPosition: "center" }} /> : <span style={{ fontSize: 64 }}>🎁</span>}
              </div>
              <div style={{ padding: "15px 18px", background: "#092F32", color: "#F6E9D0", marginTop: "auto" }}>
                <span style={{ fontSize: 12 }}>{giftProducts.length} {giftProducts.length === 1 ? "product" : "products"}</span>
                <h2 style={{ fontWeight: 400, margin: "5px 0" }}>🎁 Gift Boxes</h2>
                <span style={{ color: "#E6BD6C" }}>Explore gift collection →</span>
              </div>
            </Link>
          )}
          {collectionCards.map((collection) => (
            <Link key={collection.slug} href={`/shop/${collection.slug}`} style={{ minHeight: 310, border: "1px solid #D8C59F", borderRadius: 12, background: "#FFFCF5", color: "inherit", textDecoration: "none", display: "flex", flexDirection: "column", overflow: "hidden" }}>
              <div style={{ height: 235, padding: 14, display: "grid", placeItems: "center", background: "#F5EBDD" }}>
                {collection.cover?.image_url || collection.cover?.image ? <img src={collection.cover.image_url || collection.cover.image} alt={collection.title} loading="lazy" style={{ display: "block", width: "100%", height: "100%", objectFit: "contain", objectPosition: "center" }} /> : <span style={{ fontSize: 54 }}>✦</span>}
              </div>
              <div style={{ padding: "15px 18px", background: "#092F32", color: "#F6E9D0", marginTop: "auto" }}>
                <span style={{ fontSize: 12 }}>{collection.items.length} {collection.items.length === 1 ? "product" : "products"}</span>
                <h2 style={{ fontWeight: 400, margin: "5px 0" }}>{collection.title}</h2>
                <span style={{ color: "#E6BD6C" }}>Explore collection →</span>
              </div>
            </Link>
          ))}
        </section>
      )}
      <footer style={{ padding: 24, textAlign: "center", background: "#092F32", color: "#F6E9D0" }}>Multani Mithas · Multan ki Mithas, Dil Se</footer>
    </main>
  );
}
