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
    mithai: "Sweets & Mithai",
    barfi: "Barfi",
    "sohan-halwa": "Sohan Halwa",
    "desi-ghee": "Desi Ghee",
    "pure-honey": "Pure Honey",
    "dry-fruits": "Dry Fruits",
    "gift-boxes": "Gift Boxes",
  };
  const matchesCollection = (product: Product) => {
    const category = `${product.category} ${product.name}`.toLowerCase().replace(/[^a-z0-9]+/g, " ");
    if (slug === "gift-boxes") return /gift\s*box|gift\s*hamper/.test(category);
    if (slug === "barfi") return /barfi/.test(category);
    if (slug === "sohan-halwa") return /sohan/.test(category);
    if (slug === "desi-ghee") return /\bghee\b/.test(category);
    if (slug === "pure-honey") return /honey|shahad/.test(category);
    if (slug === "dry-fruits") return /dry\s*fruit/.test(product.category.toLowerCase());
    if (slug === "pure-honey") return /honey|shahad/.test(product.category.toLowerCase()) || /^(pure\s+)?(honey|shahad)(\s+(jar|bottle))?$/i.test(product.name.trim());
    if (slug === "desi-ghee") return /ghee/.test(product.category.toLowerCase()) || /^desi\s+ghee$/i.test(product.name.trim());
    if (slug === "mithai") {
      const standaloneCollection = /sohan|\\bghee\\b|honey|shahad|dry\\s*fruit|gift\\s*box/.test(product.category.toLowerCase());
      return !standaloneCollection && (/mithai|sweet|gulab\\s*jamun|rasgulla|rasgula|ladoo|laddu|motichoor|cham\\s*cham|patisa|petha|coconut|barfi/.test(category) || /traditional/.test(product.category.toLowerCase()));
    }
    return slugify(product.category) === slug;
  };
  const categoryProducts = useMemo(() => products.filter(matchesCollection), [products, slug]);
  const categoryName = collectionNames[slug] || categoryProducts[0]?.category || slug.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
  const getSubcategory = (product: Product) => {
    const details = `${product.category} ${product.name}`.toLowerCase();
    if (/sohan/.test(details)) return /akhrot|walnut/.test(details) ? "Akhroti Sohan Halwa" : "Simple Sohan Halwa";
    if (/mix\s*mithai/.test(details)) return "Mix Mithai";
    if (/special\s*mithai/.test(details)) return "Special Mithai";
    if (/barfi/.test(details)) return "Barfi";
    if (/ladoo|laddu/.test(details)) return "Ladoo";
    if (/kheer/.test(details)) return "Kheer";
    if (/gajar|carrot/.test(details)) return "Gajar ka Halwa";
    if (/dry\s*fruit|almond|badam|pista|cashew|kaju|akhrot|walnut/.test(details)) return "Dry Fruits";
    if (/honey|shahad/.test(details)) return "Honey";
    if (/ghee/.test(details)) return "Desi Ghee";
    return product.category || "Other";
  };
  const subcategories = Array.from(new Set(categoryProducts.map(getSubcategory))).sort((a, b) => a.localeCompare(b));
  const [selectedSubcategory, setSelectedSubcategory] = useState("All");
  const [expandedImage, setExpandedImage] = useState<{ src: string; alt: string } | null>(null);
  const visibleProducts = selectedSubcategory === "All"
    ? categoryProducts
    : categoryProducts.filter((product) => getSubcategory(product) === selectedSubcategory);

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
        {subcategories.length > 0 && <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 8, margin: "18px auto", maxWidth: 1000 }}>
          <button type="button" onClick={() => setSelectedSubcategory("All")} style={{ border: "1px solid #D8C59F", borderRadius: 30, padding: "8px 14px", fontSize: 12, background: selectedSubcategory === "All" ? "#123F42" : "#FFFCF5", color: selectedSubcategory === "All" ? "#FFF8EA" : "#123F42", cursor: "pointer" }}>All</button>
          {subcategories.map((item) => <button key={item} type="button" onClick={() => setSelectedSubcategory(item)} style={{ border: "1px solid #D8C59F", borderRadius: 30, padding: "8px 14px", fontSize: 12, background: selectedSubcategory === item ? "#123F42" : "#FFFCF5", color: selectedSubcategory === item ? "#FFF8EA" : "#123F42", cursor: "pointer" }}>{item}</button>)}
        </div>}
        <p><Link href="/shop" style={{ color: "#8B642B" }}>← All categories</Link></p>
      </section>
      {loading ? <p style={{ textAlign: "center", padding: 40 }}>Loading products…</p> : visibleProducts.length === 0 ? <p style={{ textAlign: "center", padding: 40 }}>No active products in this collection yet.</p> : (
        <section style={{ padding: "20px 6% 70px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 22 }}>
          {visibleProducts.map((product) => {
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
              {image ? <button type="button" onClick={() => setExpandedImage({ src: image, alt: product.name })} aria-label={`View full-size image of ${product.name}`} style={{ display: "block", width: "100%", height: 300, padding: 8, border: 0, cursor: "zoom-in", background: "#F5EBDD" }}><img src={image} alt={product.name} loading="lazy" decoding="async" style={{ display: "block", width: "100%", height: "100%", objectFit: "contain", objectPosition: "center" }} /></button> : <div style={{ height: 220, display: "grid", placeItems: "center", background: "#EAD8B7", fontSize: 42 }}>{product.image || "✦"}</div>}
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
      {expandedImage && <div role="dialog" aria-modal="true" aria-label={`Full-size product image: ${expandedImage.alt}`} onClick={() => setExpandedImage(null)} style={{ position: "fixed", inset: 0, zIndex: 1000, display: "grid", placeItems: "center", padding: 18, background: "rgba(4, 22, 23, .94)" }}><button type="button" onClick={() => setExpandedImage(null)} aria-label="Close full-size image" style={{ position: "absolute", top: 16, right: 18, zIndex: 1, width: 44, height: 44, borderRadius: "50%", border: "1px solid #E6BD6C", background: "#092F32", color: "#FFF8EA", fontSize: 28, cursor: "pointer" }}>×</button><img src={expandedImage.src} alt={expandedImage.alt} onClick={(event) => event.stopPropagation()} style={{ display: "block", maxWidth: "min(100%, 1100px)", maxHeight: "88dvh", width: "auto", height: "auto", objectFit: "contain", background: "#FFF8EA", borderRadius: 8 }} /></div>}
      <footer style={{ padding: 24, textAlign: "center", background: "#092F32", color: "#F6E9D0" }}>Multani Mithas · Multan ki Mithas, Dil Se</footer>
    </main>
  );
}
