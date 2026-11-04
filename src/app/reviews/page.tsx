"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";

type Product = { id: string | number; name: string };
type PublishedReview = { id: number; product_name: string; customer_name: string; rating: number; review_text: string; admin_reply: string | null; created_at: string };
const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#F8F4EA", color: "#263B36", padding: "42px 18px 64px", fontFamily: "Georgia,serif" },
  container: { maxWidth: 760, margin: "0 auto" },
  label: { display: "block", color: "#34443D", fontSize: 14, marginBottom: 8 },
  input: { width: "100%", boxSizing: "border-box", border: "1px solid #D8CEBA", borderRadius: 7, padding: "13px 14px", background: "#fff", color: "#263B36", fontSize: 15, marginBottom: 18 },
};

export default function ReviewsPage() {
  const [products,setProducts] = useState<Product[]>([]);
  const [publishedReviews,setPublishedReviews] = useState<PublishedReview[]>([]);
  const [productId,setProductId] = useState("");
  const [name,setName] = useState("");
  const [phone,setPhone] = useState("");
  const [orderNumber,setOrderNumber] = useState("");
  const [rating,setRating] = useState("5");
  const [review,setReview] = useState("");
  const [message,setMessage] = useState("Loading products…");
  const [submitting,setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/reviews",{cache:"no-store"}).then(async response => { const data = await response.json(); if (response.ok && data.success && active) setPublishedReviews(data.reviews || []); }).catch(() => undefined);
    fetch("/api/products",{cache:"no-store"}).then(async response => {
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Products load nahi huay");
      if (active) {
        const list = (data.products || []) as Product[];
        setProducts(list);
        setProductId(list[0] ? String(list[0].id) : "");
        setMessage(list.length ? "" : "Filhal review ke liye koi product available nahi.");
      }
    }).catch(error => { if(active) setMessage(error instanceof Error ? error.message : "Products load nahi huay"); });
    return () => { active = false; };
  },[]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSubmitting(true); setMessage("");
    try {
      const response = await fetch("/api/reviews",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({productId,customerName:name,phone,orderNumber,rating:Number(rating),reviewText:review})
      });
      const data = await response.json();
      if(!response.ok || !data.success) throw new Error(data.message || "Review submit nahi ho saka");
      setMessage("Shukriya! Aap ka review save ho gaya hai. Admin approval ke baad website par nazar aaye ga.");
      setName("");setPhone("");setOrderNumber("");setRating("5");setReview("");
    } catch(error) { setMessage(error instanceof Error ? error.message : "Review submit nahi ho saka"); }
    finally { setSubmitting(false); }
  }

  return <main style={styles.page}><div style={styles.container}>
    <Link href="/" style={{display:"inline-block",color:"#80602F",textDecoration:"none",marginBottom:28}}>← Back to Multani Mithas</Link>
    <p style={{color:"#9A7338",fontSize:12,letterSpacing:2,textTransform:"uppercase"}}>Your Experience Matters</p>
    <h1 style={{color:"#233D39",fontSize:"clamp(32px,6vw,46px)",fontWeight:500,margin:"12px 0"}}>Review a Product</h1>
    <p style={{color:"#59645D",fontSize:16,lineHeight:1.8,marginBottom:30}}>Review submit karne ke liye apna delivered order number aur wahi phone number dein jo order mein use kiya tha. Sirf order mein shamil product ka review accept hoga.</p>
    <section style={{background:"#FFFDF8",border:"1px solid #DED5C2",borderRadius:12,padding:"clamp(20px,5vw,34px)"}}>
      <form onSubmit={submit}>
        <label style={styles.label} htmlFor="review-product">Product *</label>
        <select id="review-product" required value={productId} onChange={e=>setProductId(e.target.value)} style={styles.input}>
          {products.map(product=><option key={product.id} value={String(product.id)}>{product.name}</option>)}
        </select>
        <label style={styles.label} htmlFor="review-name">Your name *</label>
        <input id="review-name" required maxLength={120} value={name} onChange={e=>setName(e.target.value)} style={styles.input} autoComplete="name"/>
        <label style={styles.label} htmlFor="review-phone">Order phone number *</label>
        <input id="review-phone" required maxLength={40} value={phone} onChange={e=>setPhone(e.target.value)} style={styles.input} autoComplete="tel" placeholder="Same phone number used for the order"/>
        <label style={styles.label} htmlFor="review-order">Delivered order number *</label>
        <input id="review-order" required maxLength={40} value={orderNumber} onChange={e=>setOrderNumber(e.target.value)} style={styles.input} placeholder="MM-XXXXXXXXXXXX"/>
        <label style={styles.label} htmlFor="review-rating">Rating *</label>
        <select id="review-rating" value={rating} onChange={e=>setRating(e.target.value)} style={styles.input}>
          <option value="5">★★★★★ — Excellent</option><option value="4">★★★★☆ — Very Good</option><option value="3">★★★☆☆ — Good</option><option value="2">★★☆☆☆ — Fair</option><option value="1">★☆☆☆☆ — Poor</option>
        </select>
        <label style={styles.label} htmlFor="review-text">Your review</label>
        <textarea id="review-text" rows={5} maxLength={2000} value={review} onChange={e=>setReview(e.target.value)} style={{...styles.input,resize:"vertical",lineHeight:1.7}} placeholder="Share your experience with this product"/>
        <button type="submit" disabled={submitting || !products.length} style={{width:"100%",border:0,borderRadius:7,padding:15,background:"#233D39",color:"#F8F4EA",fontSize:15,cursor:"pointer",opacity:submitting?0.65:1}}>{submitting?"Submitting…":"Submit Review"}</button>
      </form>
      {message && <p role="status" aria-live="polite" style={{marginTop:18,color:"#52634F",lineHeight:1.7}}>{message}</p>}
    </section>
    <section style={{marginTop:32}}><h2 style={{color:"#233D39",fontSize:28,fontWeight:500}}>Customer Reviews</h2>{publishedReviews.length ? publishedReviews.map(item => <article key={item.id} style={{background:"#FFFDF8",border:"1px solid #DED5C2",borderRadius:10,padding:18,marginTop:12}}><strong>{item.product_name}</strong><div style={{color:"#9A7338",margin:"8px 0"}}>{"★".repeat(item.rating)}{"☆".repeat(5-item.rating)}</div><p style={{lineHeight:1.7}}>{item.review_text || "Rated this product."}</p><small style={{color:"#64748b"}}>By {item.customer_name}</small>{item.admin_reply && <p style={{borderTop:"1px solid #e5dccb",paddingTop:10}}><strong>Multani Mithas:</strong> {item.admin_reply}</p>}</article>) : <p style={{color:"#64748b"}}>Abhi approved reviews maujood nahi hain. Aap apna verified order review kar sakte hain.</p>}</section>\n    <p style={{color:"#73776E",fontSize:13,lineHeight:1.7,marginTop:20}}>Reviews are checked by the team before public display. Do not share payment PINs, passwords or OTPs.</p>
  </div></main>;
}
