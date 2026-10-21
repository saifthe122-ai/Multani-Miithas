"use client";

import { useEffect, useState } from "react";

type MediaItem = {
  name: string;
  url: string;
  type: "image" | "video";
  pathname?: string;
  size?: number;
};

type ProductStyle = {
  name: string;
  background: string;
  image: string;
  enabled: boolean;
};

type PublishedSettings = {
  heroTitle?: string;
  heroSubtitle?: string;
  brandColor?: string;
  backgroundColor?: string;
  products?: ProductStyle[];
  media?: MediaItem[];
};

type MediaLibraryResponse = {
  success?: boolean;
  error?: string;
  media?: Array<{
    url: string;
    pathname: string;
    size: number;
    contentType?: string;
  }>;
};

const initialProducts: ProductStyle[] = [
  { name: "Sohan Halwa", background: "#f4e6d1", image: "", enabled: true },
  { name: "Barfi", background: "#f7e5e8", image: "", enabled: true },
  { name: "Gulab Jamun", background: "#ead9c7", image: "", enabled: true },
  { name: "Ladoo", background: "#f6e6a9", image: "", enabled: true },
  { name: "Patisa", background: "#eee4d5", image: "", enabled: true },
  { name: "Cakes & Bakery", background: "#eadff5", image: "", enabled: true },
];

function getMediaType(name: string, contentType = ""): "image" | "video" {
  if (contentType.startsWith("video/")) return "video";
  if (contentType.startsWith("image/")) return "image";
  return /\.(mp4|webm)(?:$|[?#])/i.test(name) ? "video" : "image";
}

function getDisplayName(pathname: string) {
  const fileName = pathname.split("/").pop() || "Uploaded media";
  return fileName.replace(/^[0-9a-f-]{36}-/i, "");
}

export default function WebsiteDesignPage() {
  const [activeTab, setActiveTab] = useState("media");
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [products, setProducts] = useState<ProductStyle[]>(initialProducts);
  const [heroTitle, setHeroTitle] = useState("Multan Ki Mithas,");
  const [heroSubtitle, setHeroSubtitle] = useState(
    "Saraiki Wasib ki riwayat, har mithai ke saath. Discover the timeless taste and sweet heritage of Multan, Pakistan."
  );
  const [brandColor, setBrandColor] = useState("#D8AC55");
  const [backgroundColor, setBackgroundColor] = useState("#F3E8D4");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [mediaPassword, setMediaPassword] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadSavedData() {
      let savedSettings: PublishedSettings | null = null;

      try {
        const response = await fetch("/api/site-media", { cache: "no-store" });
        const result: { success?: boolean; settings?: PublishedSettings | null } = await response.json();
        if (response.ok && result.success && result.settings) {
          savedSettings = result.settings;
          if (mounted) {
            setHeroTitle(savedSettings.heroTitle || "Multan Ki Mithas,");
            setHeroSubtitle(savedSettings.heroSubtitle || "Saraiki Wasib ki riwayat, har mithai ke saath.");
            setBrandColor(savedSettings.brandColor || "#D8AC55");
            setBackgroundColor(savedSettings.backgroundColor || "#F3E8D4");
            if (Array.isArray(savedSettings.products) && savedSettings.products.length) {
              setProducts(savedSettings.products);
            }
          }
        }
      } catch {
        if (mounted) setNotice("Published settings load nahi huin. Aap phir bhi media upload kar sakte hain.");
      }

      const password = window.prompt(
        "Enter admin media password to reload files saved in Vercel Blob. Cancel to skip this step."
      );
      if (!password) {
        if (mounted && savedSettings?.media) setMedia(savedSettings.media);
        return;
      }

      try {
        const response = await fetch("/api/admin/media-upload", {
          method: "GET",
          headers: { "x-admin-media-password": password },
          cache: "no-store",
        });
        const result: MediaLibraryResponse = await response.json();
        if (!response.ok || !result.success || !Array.isArray(result.media)) {
          throw new Error(result.error || "Stored media load nahi ho saka.");
        }

        const savedMedia = Array.isArray(savedSettings?.media) ? savedSettings.media : [];
        const storedMedia: MediaItem[] = result.media.map((item) => {
          const savedAlias = savedMedia.find((saved) => saved.url === item.url);
          const name = getDisplayName(item.pathname);
          return {
            name: savedAlias?.name || name,
            url: item.url,
            type: savedAlias?.type || getMediaType(name, item.contentType),
            pathname: item.pathname,
            size: item.size,
          };
        });

        if (mounted) {
          setMediaPassword(password);
          setMedia(storedMedia);
          setNotice(`${storedMedia.length} saved file(s) loaded from Vercel Blob.`);
        }
      } catch (error) {
        if (mounted) {
          if (savedSettings?.media) setMedia(savedSettings.media);
          setNotice(error instanceof Error ? error.message : "Stored media load nahi ho saka.");
        }
      }
    }

    void loadSavedData();
    return () => {
      mounted = false;
    };
  }, []);

  async function uploadFiles(files: FileList | null, oldUrl?: string) {
    if (!files || files.length === 0) return;

    const accepted = Array.from(files).filter(
      (file) =>
        ["image/jpeg", "image/png", "image/webp", "image/gif", "video/mp4", "video/webm"].includes(file.type)
    );
    if (accepted.length === 0) {
      setNotice("JPG, PNG, WEBP, GIF, MP4 ya WEBM file select karein.");
      return;
    }
    const tooLarge = accepted.find((file) => file.size === 0 || file.size > 4 * 1024 * 1024);
    if (tooLarge) {
      setNotice(`File 4 MB se chhoti honi chahiye: ${tooLarge.name}`);
      return;
    }

    const password = mediaPassword || window.prompt("Enter admin media password");
    if (!password) {
      setNotice("Upload cancelled.");
      return;
    }
    setMediaPassword(password);
    setBusy(true);
    let successCount = 0;
    let lastError = "";

    try {
      for (const file of accepted) {
        try {
          const formData = new FormData();
          formData.append("file", file);
          if (oldUrl) formData.append("oldUrl", oldUrl);

          const response = await fetch("/api/admin/media-upload", {
            method: "POST",
            headers: { "x-admin-media-password": password },
            body: formData,
          });
          const result: { url?: string; pathname?: string; type?: string; error?: string; warning?: string } = await response.json();
          if (!response.ok || !result.url) {
            lastError = result.error || `Upload failed: ${file.name}`;
            continue;
          }

          const oldItem = oldUrl ? media.find((item) => item.url === oldUrl) : undefined;
          const newItem: MediaItem = {
            name: oldItem?.name || file.name,
            url: result.url,
            type: result.type === "video" ? "video" : "image",
            pathname: result.pathname,
            size: file.size,
          };
          setMedia((current) => [
            ...current.filter((item) => item.url !== oldUrl && item.url !== newItem.url),
            newItem,
          ]);
          successCount++;
          if (result.warning) lastError = result.warning;
        } catch {
          lastError = `Upload failed: ${file.name}`;
        }
      }

      if (successCount > 0 && lastError) setNotice(`${successCount} file(s) uploaded. Warning: ${lastError}`);
      else if (successCount > 0) setNotice(`${successCount} of ${accepted.length} file(s) uploaded to Vercel Blob. Ab “Save & Publish” bhi dabayein.`);
      else setNotice(lastError || "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  async function deleteMedia(item: MediaItem) {
    if (!window.confirm(`Permanently delete "${item.name}" from Vercel Blob?`)) return;
    const password = mediaPassword || window.prompt("Enter admin media password");
    if (!password) return;
    setMediaPassword(password);
    setBusy(true);
    try {
      const response = await fetch("/api/admin/media-upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", "x-admin-media-password": password },
        body: JSON.stringify({ url: item.url }),
      });
      const result: { error?: string } = await response.json();
      if (!response.ok) throw new Error(result.error || "Delete failed.");
      setMedia((current) => current.filter((file) => file.url !== item.url));
      setNotice("Media file Vercel Blob se delete ho gayi. Website par changes publish karne ke liye Save & Publish dabayein.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Delete failed.");
    } finally {
      setBusy(false);
    }
  }

  function assignMediaRole(item: MediaItem, role: "hero-banner" | "homepage-video" | "heritage-story" | "gift-banner") {
    const extension = item.name.match(/\.[a-z0-9]+$/i)?.[0] || (item.type === "video" ? ".mp4" : ".jpg");
    const roleName = `${role}${extension}`;
    setMedia((current) => current.map((file) => file.url === item.url ? { ...file, name: roleName } : file));
    setNotice(`“${roleName}” set ho gaya. Live website par apply karne ke liye Save & Publish dabayein.`);
  }

  async function publishSettings() {
    const password = mediaPassword || window.prompt("Enter admin media password to publish website changes");
    if (!password) {
      setNotice("Publishing cancelled.");
      return;
    }
    setMediaPassword(password);
    setBusy(true);
    const settings: PublishedSettings = {
      heroTitle,
      heroSubtitle,
      brandColor,
      backgroundColor,
      products,
      media: media.map(({ name, url, type }) => ({ name, url, type })),
    };

    try {
      const response = await fetch("/api/site-media", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-media-password": password,
        },
        body: JSON.stringify({ settings }),
      });
      const result: { success?: boolean; error?: string; message?: string } = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || "Website settings publish nahi huin.");
      setNotice("Design, banner/video selection aur media list Vercel Blob mein save ho gayi. Live homepage refresh karke check karein.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Publishing failed.");
    } finally {
      setBusy(false);
    }
  }

  function updateProduct(index: number, changes: Partial<ProductStyle>) {
    setProducts((current) => current.map((product, i) => i === index ? { ...product, ...changes } : product));
  }

  const panelStyle = {
    border: "1px solid #eadfd8",
    borderRadius: 14,
    padding: 18,
    background: "#ffffff",
  } as const;

  const buttonStyle = {
    border: "none",
    borderRadius: 9,
    padding: "11px 15px",
    background: brandColor,
    color: "#ffffff",
    cursor: busy ? "wait" : "pointer",
    fontWeight: 700,
    opacity: busy ? 0.7 : 1,
  } as const;

  return (
    <main style={{ minHeight: "100vh", padding: "28px 18px", background: "#f8f3ee", color: "#30232a", fontFamily: "Arial, sans-serif" }}>
      <div style={{ maxWidth: 1150, margin: "0 auto" }}>
        <header style={{ marginBottom: 25 }}>
          <div style={{ fontSize: 13, color: "#80616a", marginBottom: 8 }}>MULTANI MITHAS / ADMIN</div>
          <h1 style={{ fontSize: 30, margin: "0 0 8px" }}>Website Design & Media</h1>
          <p style={{ color: "#75676b", lineHeight: 1.6 }}>Homepage banner, short video, product backgrounds aur brand appearance manage karein.</p>
        </header>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 22 }}>
          {[["media", "Images & Videos"], ["products", "Product Backgrounds"], ["homepage", "Homepage Design"], ["theme", "Theme & Colors"]].map(([id, label]) => (
            <button key={id} type="button" onClick={() => setActiveTab(id)} style={{ ...buttonStyle, background: activeTab === id ? brandColor : "#fff", color: activeTab === id ? "#fff" : "#49353d", border: activeTab === id ? "1px solid transparent" : "1px solid #eadfd8" }}>{label}</button>
          ))}
        </div>

        {notice && <div role="status" style={{ ...panelStyle, marginBottom: 18, background: "#fffaf0", lineHeight: 1.6 }}>{notice}</div>}

        {activeTab === "media" && (
          <section style={{ display: "grid", gap: 18 }}>
            <div style={panelStyle}>
              <h2 style={{ marginTop: 0 }}>Upload Images & Short Videos</h2>
              <p style={{ color: "#75676b", lineHeight: 1.6 }}>JPG, PNG, WEBP, GIF, MP4 ya WEBM. Har file maximum 4 MB. Upload ke baad homepage ke liye role select karein aur Save & Publish dabayein.</p>
              <label style={{ display: "block", border: "2px dashed #d9c4c9", borderRadius: 12, padding: 24, cursor: busy ? "wait" : "pointer", textAlign: "center", lineHeight: 1.8 }}>
                <strong>{busy ? "Please wait..." : "Choose images or videos"}</strong><br />
                <span style={{ color: "#75676b" }}>Device se ek ya zyada files select karein</span>
                <input type="file" accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm" multiple disabled={busy} onChange={(event) => { void uploadFiles(event.currentTarget.files); event.currentTarget.value = ""; }} style={{ display: "block", margin: "14px auto 0" }} />
              </label>
            </div>

            <div style={panelStyle}>
              <h2 style={{ marginTop: 0 }}>Media Library ({media.length})</h2>
              {media.length === 0 ? <p style={{ color: "#75676b" }}>Abhi koi media load nahi hua. Page reload par password enter karein taake Blob files load ho sakein.</p> : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
                  {media.map((item) => (
                    <div key={item.url} style={{ border: "1px solid #eadfd8", borderRadius: 12, overflow: "hidden", minWidth: 0 }}>
                      {item.type === "image" ? <img src={item.url} alt={item.name} style={{ width: "100%", height: 160, objectFit: "cover", display: "block" }} /> : <video src={item.url} controls style={{ width: "100%", height: 160, objectFit: "cover", display: "block" }} />}
                      <div style={{ padding: 12 }}>
                        <div style={{ overflowWrap: "anywhere", fontSize: 13, fontWeight: 700, marginBottom: 8 }}>{item.name}</div>
                        <div style={{ color: "#75676b", fontSize: 12, marginBottom: 10 }}>{item.type.toUpperCase()} {item.size ? `• ${(item.size / 1024 / 1024).toFixed(2)} MB` : ""}</div>
                        {item.type === "image" ? <div style={{ display: "grid", gap: 6 }}>
                          <button type="button" disabled={busy} style={buttonStyle} onClick={() => assignMediaRole(item, "hero-banner")}>Set as Homepage Banner</button>
                          <button type="button" disabled={busy} style={buttonStyle} onClick={() => assignMediaRole(item, "heritage-story")}>Set as Heritage Image</button>
                          <button type="button" disabled={busy} style={buttonStyle} onClick={() => assignMediaRole(item, "gift-banner")}>Set as Gift Banner</button>
                        </div> : <button type="button" disabled={busy} style={buttonStyle} onClick={() => assignMediaRole(item, "homepage-video")}>Set as Homepage Video</button>}
                        <label style={{ display: "block", marginTop: 10, padding: 9, border: "1px solid #eadfd8", borderRadius: 8, textAlign: "center", cursor: busy ? "wait" : "pointer", fontSize: 13 }}>
                          Replace this file
                          <input type="file" accept={item.type === "image" ? "image/jpeg,image/png,image/webp,image/gif" : "video/mp4,video/webm"} disabled={busy} onChange={(event) => { void uploadFiles(event.currentTarget.files, item.url); event.currentTarget.value = ""; }} style={{ display: "block", marginTop: 6, width: "100%" }} />
                        </label>
                        <button type="button" disabled={busy} onClick={() => void deleteMedia(item)} style={{ ...buttonStyle, background: "#8a263c", width: "100%", marginTop: 8 }}>Delete from storage</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {activeTab === "products" && (
          <section style={{ display: "grid", gap: 14 }}>
            <div style={panelStyle}><h2 style={{ marginTop: 0 }}>Product Background Manager</h2><p style={{ color: "#75676b", lineHeight: 1.6 }}>Category background aur visibility yahan se set karein. Changes Save & Publish ke baad homepage par apply honge.</p></div>
            {products.map((product, index) => (
              <div key={product.name} style={{ ...panelStyle, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 18, alignItems: "center" }}>
                <div style={{ minHeight: 135, borderRadius: 12, background: product.background, padding: 18, display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center" }}><strong>{product.name}</strong><span style={{ fontSize: 12, marginTop: 8 }}>Background preview</span></div>
                <div>
                  <h3 style={{ marginTop: 0 }}>{product.name}</h3>
                  <label style={{ display: "block", marginBottom: 12 }}>Background color<input type="color" value={product.background} onChange={(event) => updateProduct(index, { background: event.target.value })} style={{ display: "block", width: 80, height: 42, marginTop: 7 }} /></label>
                  <label style={{ display: "flex", gap: 8, alignItems: "center" }}><input type="checkbox" checked={product.enabled} onChange={(event) => updateProduct(index, { enabled: event.target.checked })} /> Show this category on homepage</label>
                </div>
              </div>
            ))}
          </section>
        )}

        {activeTab === "homepage" && (
          <section style={{ display: "grid", gap: 18 }}>
            <div style={panelStyle}>
              <h2 style={{ marginTop: 0 }}>Homepage Content</h2>
              <label style={{ display: "block", marginBottom: 16 }}>Main heading<input value={heroTitle} onChange={(event) => setHeroTitle(event.target.value)} style={{ display: "block", width: "100%", boxSizing: "border-box", padding: 12, marginTop: 7, border: "1px solid #d9c8c8", borderRadius: 8 }} /></label>
              <label style={{ display: "block" }}>Supporting text<textarea value={heroSubtitle} onChange={(event) => setHeroSubtitle(event.target.value)} rows={3} style={{ display: "block", width: "100%", boxSizing: "border-box", padding: 12, marginTop: 7, border: "1px solid #d9c8c8", borderRadius: 8 }} /></label>
            </div>
            <div style={{ ...panelStyle, background: backgroundColor, borderTop: `7px solid ${brandColor}`, textAlign: "center", padding: "38px 18px" }}>
              <div style={{ fontSize: 12, letterSpacing: 3 }}>MULTANI MITHAS</div><h2 style={{ fontSize: 32 }}>{heroTitle}</h2><p style={{ lineHeight: 1.7 }}>{heroSubtitle}</p>
              {media.find((item) => item.name.toLowerCase().includes("hero-banner") && item.type === "image") ? <img src={media.find((item) => item.name.toLowerCase().includes("hero-banner") && item.type === "image")?.url} alt="Homepage banner preview" style={{ width: "100%", maxHeight: 250, objectFit: "cover", borderRadius: 10 }} /> : <span style={{ color: brandColor, fontWeight: 700 }}>Choose an image and click Set as Homepage Banner in Images & Videos.</span>}
              {media.find((item) => item.name.toLowerCase().includes("homepage-video") && item.type === "video") ? <video src={media.find((item) => item.name.toLowerCase().includes("homepage-video") && item.type === "video")?.url} controls style={{ width: "100%", maxHeight: 250, marginTop: 15 }} /> : null}
            </div>
          </section>
        )}

        {activeTab === "theme" && (
          <section style={{ ...panelStyle, display: "grid", gap: 22 }}>
            <h2 style={{ margin: 0 }}>Brand Theme & Appearance</h2>
            <label>Brand color<input type="color" value={brandColor} onChange={(event) => setBrandColor(event.target.value)} style={{ display: "block", width: 80, height: 45, marginTop: 8 }} /><span>{brandColor}</span></label>
            <label>Website background<input type="color" value={backgroundColor} onChange={(event) => setBackgroundColor(event.target.value)} style={{ display: "block", width: 80, height: 45, marginTop: 8 }} /><span>{backgroundColor}</span></label>
            <div style={{ padding: 24, borderRadius: 12, background: backgroundColor, border: `2px solid ${brandColor}` }}><strong style={{ color: brandColor }}>Multani Mithas — Theme Preview</strong><p>Preview your selected brand and background colors.</p></div>
          </section>
        )}

        <div style={{ ...panelStyle, marginTop: 22, display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
          <button type="button" style={buttonStyle} disabled={busy} onClick={() => void publishSettings()}>{busy ? "Please wait..." : "Save & Publish to Website"}</button>
          <span style={{ color: "#75676b", fontSize: 13, lineHeight: 1.6 }}>Settings Vercel Blob mein save hongi aur refresh ke baad media list dobara load hogi.</span>
        </div>
      </div>
    </main>
  );
}
