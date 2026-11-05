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

  const collections = [
    { title: "Mithai", slug: "mithai" },
    { title: "Barfi", slug: "barfi" },
    { title: "Sohan Halwa", slug: "sohan-halwa" },
    { title: "Desi Ghee", slug: "desi-ghee" },
    { title: "Honey & Dry Fruits", slug: "honey-dry-fruits" },
  ];
  const matchesCollection = (product: Product, slug: string) => {
    const value = `${product.category} ${product.name}`.toLowerCase().replace(/[^a-z0-9]+/g, " ");
    if (slug === "barfi") return /barfi/.test(value);
    if (slug === "sohan-halwa") return /sohan/.test(value);
    if (slug === "desi-ghee") return /\\bghee\\b/.test(value);
    if (slug === "honey-dry-fruits") return /honey|dry\\s*fruit|kheer|gajar|carrot\\s*halwa/.test(value);
    if (slug === "mithai") return !/barfi|sohan|\\bghee\\b|honey|dry\\s*fruit|kheer|gajar|carrot\\s*halwa|gift\\s*box/.test(value) && (/mithai|sweet|gulab\\s*jamun|rasgulla|rasgula|ladoo|laddu|motichoor|cham\\s*cham|patisa|petha|coconut|traditional/.test(value));
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
            <Link href="/shop/gift-boxes" style={{ minHeight: 230, padding: 24, border: "2px solid #C69A4A", borderRadius: 12, background: giftCover?.image_url || giftCover?.image ? `linear-gradient(0deg,rgba(9,47,50,.94),rgba(9,47,50,.16)),url("${giftCover.image_url || giftCover.image}")` : "linear-gradient(145deg,#145154,#082F32)", color: "inherit", textDecoration: "none", display: "flex", flexDirection: "column", justifyContent: "end", backgroundSize: "cover", backgroundPosition: "center" }}>
              <span style={{ color: "#F6E9D0", fontSize: 12 }}>{giftProducts.length} {giftProducts.length === 1 ? "product" : "products"}</span>
              <h2 style={{ color: "#FFF1D7", fontWeight: 400, margin: "6px 0" }}>🎁 Gift Boxes</h2>
              <span style={{ color: "#E6BD6C" }}>Explore gift collection →</span>
            </Link>
          )}
          {collectionCards.map((collection) => (
            <Link key={collection.slug} href={`/shop/${collection.slug}`} style={{ minHeight: 230, padding: 24, border: "1px solid #D8C59F", borderRadius: 12, background: collection.cover?.image_url || collection.cover?.image ? `linear-gradient(0deg,rgba(9,47,50,.92),rgba(9,47,50,.08)),url("${collection.cover.image_url || collection.cover.image}")` : "linear-gradient(145deg,#EAD8B7,#FFF8EA)", color: "inherit", textDecoration: "none", display: "flex", flexDirection: "column", justifyContent: "end", backgroundSize: "cover", backgroundPosition: "center" }}>
              <span style={{ color: "#F6E9D0", fontSize: 12 }}>{collection.items.length} {collection.items.length === 1 ? "product" : "products"}</span>
              <h2 style={{ color: "#FFF1D7", fontWeight: 400, margin: "6px 0" }}>{collection.title}</h2>
              <span style={{ color: "#E6BD6C" }}>Explore collection →</span>
            </Link>
          ))}}
        </section>
      )}
      <footer style={{ padding: 24, textAlign: "center", background: "#092F32", color: "#F6E9D0" }}>Multani Mithas · Multan ki Mithas, Dil Se</footer>
    </main>
  );
}
