"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

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
  price_type?: string;
  weight_options?: Array<{ weight: number | string; price: number | string }>;
};

const slugify = (value: string) => value.toLowerCase().trim().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const money = (value: number) => "PKR " + value.toLocaleString("en-PK");

export default function CategoryPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => setProducts(Array.isArray(data?.products) ? data.products.filter((p: Product) => String(p.category || "").trim()) : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const collectionNames: Record<string, string> = {
    mithai: "Mithai",
    barfi: "Barfi",
    "sohan-halwa": "Sohan Halwa",
    "desi-ghee": "Desi Ghee",
    "honey-dry-fruits": "Honey & Dry Fruits",
    "gift-boxes": "Gift Boxes",
  };
  const matchesCollection = (product: Product) => {
    const category = `${product.category} ${product.name}`.toLowerCase().replace(/[^a-z0-9]+/g, " ");
    const name = product.name.toLowerCase();
    if (slug === "gift-boxes") return /gift\s*box|gift\s*hamper/.test(category);
    if (slug === "barfi") return /barfi/.test(category);
    if (slug === "sohan-halwa") return /sohan/.test(category);
    if (slug === "desi-ghee") return /\bghee\b/.test(category);
    if (slug === "honey-dry-fruits") return /honey|dry\s*fruit|kheer|gajar|carrot\s*halwa/.test(category);
    if (slug === "mithai") {
      const excluded = /barfi|sohan|\bghee\b|honey|dry\s*fruit|kheer|gajar|carrot\s*halwa|gift\s*box/.test(category);
      return !excluded && (/mithai|sweet|gulab\s*jamun|rasgulla|rasgula|ladoo|laddu|motichoor|cham\s*cham|patisa|petha|coconut/.test(category) || /traditional/.test(product.category.toLowerCase()));
    }
    return slugify(product.category) === slug;
  };
  const categoryProducts = useMemo(() => products.filter(matchesCollection), [products, slug]);
  const categoryName = collectionNames[slug] || categoryProducts[0]?.category || slug.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
  const subcategories = Array.from(new Set(categoryProducts.map((product) => product.category).filter(Boolean)));

  return (
    <main style={{ minHeight: "100vh", background: "#FFF8EA", color: "#123F42", fontFamily: "Georgia, serif" }}>
      <header style={{ padding: "20px 6%", background: "#092F32", color: "#F6E9D0", display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <Link href="/" style={{ color: "#E4BD69", textDecoration: "none", letterSpacing: 2 }}>✧ MULTANI MITHAS ✧</Link>
        <nav style={{ display: "flex", gap: 18 }}><Link href="/" style={{ color: "#F6E9D0" }}>Home</Link><Link href="/shop" style={{ color: "#F6E9D0" }}>All Categories</Link></nav>
      </header>
      <section style={{ padding: "52px 6% 24px", textAlign: "center" }}>
        <p style={{ color: "#A16B16", letterSpacing: 3, fontSize: 12 }}>MULTANI MITHAS COLLECTION</p>
        <h1 style={{ fontWeight: 400, fontSize: "clamp(32px,5vw,52px)", margin: "8px 0" }}>{categoryName}</h1>
        <p style={{ color: "#6C5A43" }}>Explore our complete {categoryName.toLowerCase()} collection.</p>
        {subcategories.length > 1 && <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 8, margin: "18px auto", maxWidth: 900 }}>{subcategories.map((item) => <span key={item} style={{ border: "1px solid #D8C59F", borderRadius: 30, padding: "7px 13px", fontSize: 12, background: "#FFFCF5" }}>{item}</span>)}</div>}
        <p><Link href="/shop" style={{ color: "#8B642B" }}>← All categories</Link></p>
      </section>
      {loading ? <p style={{ textAlign: "center", padding: 40 }}>Loading products…</p> : categoryProducts.length === 0 ? <p style={{ textAlign: "center", padding: 40 }}>No active products in this collection yet.</p> : (
        <section style={{ padding: "20px 6% 70px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 22 }}>
          {categoryProducts.map((product) => {
            const optionPrices = (product.weight_options ?? [])
              .map((option) => Number(option.price))
              .filter((price) => Number.isFinite(price) && price >= 0);
            const basePrice = product.price_type === "per_kg"
              ? Number(product.price ?? 0)
              : optionPrices.length
                ? Math.min(...optionPrices)
                : Number(product.price ?? 0);
            const finalPrice = basePrice * (1 - Math.max(0, Math.min(100, Number(product.discount || 0))) / 100);
            const image = product.image_url || "";
            return <article key={product.id} style={{ background: "#FFFCF5", border: "1px solid #D8C59F", borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              {image ? <img src={image} alt={product.name} loading="lazy" style={{ width: "100%", height: 220, objectFit: "cover" }} /> : <div style={{ height: 220, display: "grid", placeItems: "center", background: "#EAD8B7", fontSize: 42 }}>{product.image || "✦"}</div>}
              <div style={{ padding: 18, display: "flex", flexDirection: "column", flex: 1 }}>
                <span style={{ color: "#A16B16", fontSize: 12 }}>{product.category}</span>
                <h2 style={{ fontWeight: 400, fontSize: 21, margin: "6px 0" }}>{product.name}</h2>
                {product.description && <p style={{ color: "#6C5A43", fontSize: 13 }}>{product.description}</p>}
                <strong style={{ fontSize: 19 }}>
                  {product.price_type === "fixed" && optionPrices.length > 1 ? "From " : ""}
                  {money(finalPrice)}{product.price_type === "per_kg" ? " / kg" : ""}
                </strong>
                {Number(product.discount || 0) > 0 && <span style={{ color: "#8B642B", fontSize: 12 }}>{product.discount}% discount</span>}
                <span style={{ color: product.stock > 0 ? "#356B45" : "#9A3B32", fontSize: 13, margin: "8px 0 14px" }}>{product.stock > 0 ? "In stock" : "Out of stock"}</span>
                <Link href={`/?category=${encodeURIComponent(product.category)}#${slugify(product.category) === "gift-boxes" ? "gift-products" : "products"}`} style={{ marginTop: "auto", textAlign: "center", padding: "12px 16px", background: "#D8AC55", color: "#092F32", textDecoration: "none", fontWeight: 700, borderRadius: 4 }}>View & Order →</Link>
              </div>
            </article>;
          })}
        </section>
      )}
      <footer style={{ padding: 24, textAlign: "center", background: "#092F32", color: "#F6E9D0" }}>Multani Mithas · Multan ki Mithas, Dil Se</footer>
    </main>
  );
}
