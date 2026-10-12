
"use client";

import { useState } from "react";

type MediaItem = {
  name: string;
  url: string;
  type: "image" | "video";
};

type ProductStyle = {
  name: string;
  background: string;
  image: string;
  enabled: boolean;
};

const initialProducts: ProductStyle[] = [
  { name: "Sohan Halwa", background: "#f4e6d1", image: "", enabled: true },
  { name: "Barfi", background: "#f7e5e8", image: "", enabled: true },
  { name: "Gulab Jamun", background: "#ead9c7", image: "", enabled: true },
  { name: "Ladoo", background: "#f6e6a9", image: "", enabled: true },
  { name: "Patisa", background: "#eee4d5", image: "", enabled: true },
  { name: "Cakes & Bakery", background: "#eadff5", image: "", enabled: true },
];

export default function WebsiteDesignPage() {
  const [activeTab, setActiveTab] = useState("media");
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [products, setProducts] = useState(initialProducts);
  const [heroTitle, setHeroTitle] = useState("A Taste of Tradition");
  const [heroSubtitle, setHeroSubtitle] = useState(
    "Discover the authentic sweetness of Multani Mithas."
  );
  const [brandColor, setBrandColor] = useState("#6d2639");
  const [backgroundColor, setBackgroundColor] = useState("#fff8f0");
  const [notice, setNotice] = useState("");

  function uploadFiles(files: FileList | null) {
    if (!files) return;

    const accepted = Array.from(files).filter(
      (file) =>
        file.type.startsWith("image/") ||
        file.type.startsWith("video/")
    );

    const newItems = accepted.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type.startsWith("video/") ? "video" as const : "image" as const,
    }));

    setMedia((old) => [...old, ...newItems]);
    setNotice(
      newItems.length
        ? `${newItems.length} file(s) added to the preview.`
        : "Choose an image or video file."
    );
  }

  function saveDraft() {
    const settings = {
      heroTitle,
      heroSubtitle,
      brandColor,
      backgroundColor,
      products: products.map(({ name, background, enabled }) => ({
        name,
        background,
        enabled,
      })),
      mediaNames: media.map((item) => item.name),
    };

    try {
      localStorage.setItem(
        "multani-mithas-design-draft",
        JSON.stringify(settings)
      );
      setNotice(
        "Draft saved in this browser. Permanent website publishing still needs storage and database connection."
      );
    } catch {
      setNotice("Could not save the draft in this browser.");
    }
  }

  function updateProduct(
    index: number,
    changes: Partial<ProductStyle>
  ) {
    setProducts((old) =>
      old.map((product, i) =>
        i === index ? { ...product, ...changes } : product
      )
    );
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
    cursor: "pointer",
    fontWeight: 600,
  } as const;

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "28px 18px",
        background: "#f8f3ee",
        color: "#30232a",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: 1150, margin: "0 auto" }}>
        <header style={{ marginBottom: 25 }}>
          <div style={{ fontSize: 13, color: "#80616a", marginBottom: 8 }}>
            MULTANI MITHAS / ADMIN
          </div>
          <h1 style={{ fontSize: 30, margin: "0 0 8px" }}>
            Website Design & Media
          </h1>
          <p style={{ color: "#75676b", lineHeight: 1.6 }}>
            Manage your homepage, product backgrounds, images, videos and
            brand appearance from one place.
          </p>
        </header>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            marginBottom: 22,
          }}
        >
          {[
            ["media", "Images & Videos"],
            ["products", "Product Backgrounds"],
            ["homepage", "Homepage Design"],
            ["theme", "Theme & Colors"],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              style={{
                ...buttonStyle,
                background: activeTab === id ? brandColor : "#ffffff",
                color: activeTab === id ? "#ffffff" : "#49353d",
                border:
                  activeTab === id
                    ? "1px solid transparent"
                    : "1px solid #eadfd8",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {notice && (
          <div
            role="status"
            style={{
              ...panelStyle,
              marginBottom: 18,
              background: "#fffaf0",
              lineHeight: 1.6,
            }}
          >
            {notice}
          </div>
        )}

        {activeTab === "media" && (
          <section style={{ display: "grid", gap: 18 }}>
            <div style={panelStyle}>
              <h2 style={{ marginTop: 0 }}>Upload Images & Videos</h2>
              <p style={{ color: "#75676b", lineHeight: 1.6 }}>
                Select photos for products and banners, or videos for the
                homepage. Supported formats depend on your browser.
              </p>
              <label
                style={{
                  display: "block",
                  border: "2px dashed #d9c4c9",
                  borderRadius: 12,
                  padding: 24,
                  cursor: "pointer",
                  textAlign: "center",
                  lineHeight: 1.8,
                }}
              >
                <strong>Choose images or videos</strong>
                <br />
                <span style={{ color: "#75676b" }}>
                  Select one or more files from your device
                </span>
                <input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={(event) => {
                    uploadFiles(event.target.files);
                    event.currentTarget.value = "";
                  }}
                  style={{ display: "block", margin: "14px auto 0" }}
                />
              </label>
            </div>

            <div style={panelStyle}>
              <h2 style={{ marginTop: 0 }}>Media Library Preview</h2>
              {media.length === 0 ? (
                <p style={{ color: "#75676b" }}>
                  No preview files added yet. Upload files above to see them
                  here.
                </p>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: 14,
                  }}
                >
                  {media.map((item, index) => (
                    <div
                      key={`${item.name}-${index}`}
                      style={{
                        border: "1px solid #eadfd8",
                        borderRadius: 12,
                        overflow: "hidden",
                      }}
                    >
                      {item.type === "image" ? (
                        <img
                          src={item.url}
                          alt={item.name}
                          style={{
                            width: "100%",
                            height: 150,
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <video
                          src={item.url}
                          controls
                          style={{
                            width: "100%",
                            height: 150,
                            objectFit: "cover",
                          }}
                        />
                      )}
                      <div style={{ padding: 12 }}>
                        <div
                          style={{
                            overflowWrap: "anywhere",
                            fontSize: 13,
                            marginBottom: 10,
                          }}
                        >
                          {item.name}
                        </div>
                        <button
                          style={{
                            ...buttonStyle,
                            background: "#f6e8e8",
                            color: "#8a263c",
                          }}
                          onClick={() => {
                            URL.revokeObjectURL(item.url);
                            setMedia((old) =>
                              old.filter((_, i) => i !== index)
                            );
                            setNotice("File removed from this preview.");
                          }}
                        >
                          Remove from preview
                        </button>
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
            <div style={panelStyle}>
              <h2 style={{ marginTop: 0 }}>Product Background Manager</h2>
              <p style={{ color: "#75676b", lineHeight: 1.6 }}>
                Choose a separate background color for each product category.
                Changes below update the preview immediately.
              </p>
            </div>
            {products.map((product, index) => (
              <div
                key={product.name}
                style={{
                  ...panelStyle,
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
                  gap: 18,
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    minHeight: 135,
                    borderRadius: 12,
                    background: product.background,
                    padding: 18,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    textAlign: "center",
                  }}
                >
                  <strong>{product.name}</strong>
                  <span style={{ fontSize: 12, marginTop: 8 }}>
                    Background preview
                  </span>
                </div>
                <div>
                  <h3 style={{ marginTop: 0 }}>{product.name}</h3>
                  <label style={{ display: "block", marginBottom: 12 }}>
                    Background color
                    <input
                      type="color"
                      value={product.background}
                      onChange={(event) =>
                        updateProduct(index, {
                          background: event.target.value,
                        })
                      }
                      style={{
                        display: "block",
                        width: 70,
                        height: 40,
                        marginTop: 7,
                      }}
                    />
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={product.enabled}
                      onChange={(event) =>
                        updateProduct(index, {
                          enabled: event.target.checked,
                        })
                      }
                    />{" "}
                    Show this category
                  </label>
                </div>
              </div>
            ))}
          </section>
        )}

        {activeTab === "homepage" && (
          <section style={{ display: "grid", gap: 18 }}>
            <div style={panelStyle}>
              <h2 style={{ marginTop: 0 }}>Homepage Content</h2>
              <label style={{ display: "block", marginBottom: 16 }}>
                Main heading
                <input
                  value={heroTitle}
                  onChange={(event) => setHeroTitle(event.target.value)}
                  style={{
                    display: "block",
                    width: "100%",
                    boxSizing: "border-box",
                    padding: 12,
                    marginTop: 7,
                    border: "1px solid #d9c8c8",
                    borderRadius: 8,
                  }}
                />
              </label>
              <label style={{ display: "block" }}>
                Supporting text
                <textarea
                  value={heroSubtitle}
                  onChange={(event) => setHeroSubtitle(event.target.value)}
                  rows={3}
                  style={{
                    display: "block",
                    width: "100%",
                    boxSizing: "border-box",
                    padding: 12,
                    marginTop: 7,
                    border: "1px solid #d9c8c8",
                    borderRadius: 8,
                  }}
                />
              </label>
            </div>

            <div
              style={{
                ...panelStyle,
                background: backgroundColor,
                borderTop: `7px solid ${brandColor}`,
                textAlign: "center",
                padding: "38px 18px",
              }}
            >
              <div style={{ fontSize: 12, letterSpacing: 3 }}>
                MULTANI MITHAS
              </div>
              <h2 style={{ fontSize: 32 }}>{heroTitle}</h2>
              <p style={{ lineHeight: 1.7 }}>{heroSubtitle}</p>
              <span style={{ color: brandColor, fontWeight: 700 }}>
                Homepage preview
              </span>
            </div>
          </section>
        )}

        {activeTab === "theme" && (
          <section style={{ ...panelStyle, display: "grid", gap: 22 }}>
            <h2 style={{ margin: 0 }}>Brand Theme & Appearance</h2>
            <label>
              Brand color
              <input
                type="color"
                value={brandColor}
                onChange={(event) => setBrandColor(event.target.value)}
                style={{ display: "block", width: 80, height: 45, marginTop: 8 }}
              />
              <span>{brandColor}</span>
            </label>
            <label>
              Website background
              <input
                type="color"
                value={backgroundColor}
                onChange={(event) => setBackgroundColor(event.target.value)}
                style={{ display: "block", width: 80, height: 45, marginTop: 8 }}
              />
              <span>{backgroundColor}</span>
            </label>
            <div
              style={{
                padding: 24,
                borderRadius: 12,
                background: backgroundColor,
                border: `2px solid ${brandColor}`,
              }}
            >
              <strong style={{ color: brandColor }}>
                Multani Mithas — Theme Preview
              </strong>
              <p>Preview your selected brand and background colors.</p>
            </div>
          </section>
        )}

        <div
          style={{
            ...panelStyle,
            marginTop: 22,
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            alignItems: "center",
          }}
        >
          <button style={buttonStyle} onClick={saveDraft}>
            Save Design Draft
          </button>
          <span style={{ color: "#75676b", fontSize: 13, lineHeight: 1.6 }}>
            This first version saves settings in this browser only. It does not
            yet publish changes to the customer website or permanently upload
            files to shared storage.
          </span>
        </div>
      </div>
    </main>
  );
}
