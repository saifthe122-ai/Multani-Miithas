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
  const [busy, setBusy] = useState(false);

  async function uploadFiles(
    files: FileList | null,
    oldUrl?: string
  ) {
    if (!files || files.length === 0) return;

    const password = window.prompt("Enter admin media password");

    if (!password) {
      setNotice("Upload cancelled.");
      return;
    }

    const accepted = Array.from(files).filter(
      (file) =>
        file.type.startsWith("image/") ||
        file.type.startsWith("video/")
    );

    if (accepted.length === 0) {
      setNotice("Choose an image or video file.");
      return;
    }

    setBusy(true);
    let successCount = 0;
    let lastError = "";

    try {
      for (const file of accepted) {
        try {
          const formData = new FormData();
          formData.append("file", file);

          if (oldUrl) {
            formData.append("oldUrl", oldUrl);
          }

          const response = await fetch("/api/admin/media-upload", {
            method: "POST",
            headers: {
              "x-admin-media-password": password,
            },
            body: formData,
          });

          const result = await response.json();

          if (!response.ok) {
            lastError = result.error || `Upload failed: ${file.name}`;
            continue;
          }

          setMedia((old) => [
            ...old.filter((item) => item.url !== oldUrl),
            {
              name: file.name,
              url: result.url,
              type: result.type as "image" | "video",
            },
          ]);

          successCount++;

          if (result.warning) {
            lastError = result.warning;
          }
        } catch {
          lastError = `Upload failed: ${file.name}`;
        }
      }

      if (successCount > 0 && lastError) {
        setNotice(
          `${successCount} file(s) uploaded. Warning: ${lastError}`
        );
      } else if (successCount > 0) {
        setNotice(
          `${successCount} of ${accepted.length} file(s) uploaded to storage.`
        );
      } else {
        setNotice(lastError || "Upload failed.");
      }
    } finally {
      setBusy(false);
    }
  }

  async function deleteMedia(item: MediaItem) {
    const confirmed = window.confirm(
      `Permanently delete "${item.name}" from media storage?`
    );

    if (!confirmed) return;

    const password = window.prompt("Enter admin media password");

    if (!password) {
      setNotice("Delete cancelled.");
      return;
    }

    setBusy(true);

    try {
      const response = await fetch("/api/admin/media-upload", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-admin-media-password": password,
        },
        body: JSON.stringify({ url: item.url }),
      });

      const result = await response.json();

      if (!response.ok) {
        setNotice(result.error || "Delete failed.");
        return;
      }

      setMedia((old) =>
        old.filter((file) => file.url !== item.url)
      );

      setNotice("Media file deleted from storage.");
    } catch {
      setNotice("Delete failed. Check your connection.");
    } finally {
      setBusy(false);
    }
  }

  function saveDraft() {
    const settings = {
      heroTitle,
      heroSubtitle,
      brandColor,
      backgroundColor,
      products,
      media,
    };

    try {
      localStorage.setItem(
        "multani-mithas-design-draft",
        JSON.stringify(settings)
      );

      setNotice(
"Design settings saved successfully."      );
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
    cursor: busy ? "wait" : "pointer",
    fontWeight: 600,
    opacity: busy ? 0.7 : 1,
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
          <div
            style={{
              fontSize: 13,
              color: "#80616a",
              marginBottom: 8,
            }}
          >
            MULTANI MITHAS / ADMIN
          </div>

          <h1 style={{ fontSize: 30, margin: "0 0 8px" }}>
            Website Design & Media
          </h1>

          <p style={{ color: "#75676b", lineHeight: 1.6 }}>
            Manage homepage previews, product backgrounds, images, videos
            and brand appearance from one place.
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
                Upload images and short videos. Supported formats include
                JPG, PNG, WEBP, GIF, MP4 and WEBM. Each file must be no
                larger than 4 MB.
              </p>

              <label
                style={{
                  display: "block",
                  border: "2px dashed #d9c4c9",
                  borderRadius: 12,
                  padding: 24,
                  cursor: busy ? "wait" : "pointer",
                  textAlign: "center",
                  lineHeight: 1.8,
                }}
              >
                <strong>
                  {busy ? "Please wait..." : "Choose images or videos"}
                </strong>

                <br />

                <span style={{ color: "#75676b" }}>
                  Select one or more files from your device
                </span>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"
                  multiple
                  disabled={busy}
                  onChange={(event) => {
                    void uploadFiles(event.target.files);
                    event.currentTarget.value = "";
                  }}
                  style={{
                    display: "block",
                    margin: "14px auto 0",
                  }}
                />
              </label>
            </div>

            <div style={panelStyle}>
              <h2 style={{ marginTop: 0 }}>Media Library Preview</h2>

             <p style={{ color: "#75676b", lineHeight: 1.6 }}>
  Uploaded files are stored in Vercel Blob. This preview list
  currently exists in this page&apos;s session and is not yet
  automatically reloaded from storage.
</p>

              {media.length === 0 ? (
                <p style={{ color: "#75676b" }}>
                  No preview files in this session. Upload a file above
                  to see it here.
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
                  {media.map((item) => (
                    <div
                      key={item.url}
                      style={{
                        border: "1px solid #eadfd8",
                        borderRadius: 12,
                        overflow: "hidden",
                        background: "#fff",
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
                          playsInline
                          preload="metadata"
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

                        <label
                          style={{
                            ...buttonStyle,
                            display: "block",
                            textAlign: "center",
                            marginBottom: 8,
                          }}
                        >
                          Replace image/video

                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"
                            disabled={busy}
                            style={{ display: "none" }}
                            onChange={(event) => {
                              void uploadFiles(
                                event.target.files,
                                item.url
                              );
                              event.currentTarget.value = "";
                            }}
                          />
                        </label>

                        <button
                          type="button"
                          disabled={busy}
                          style={{
                            ...buttonStyle,
                            width: "100%",
                            background: "#f6e8e8",
                            color: "#8a263c",
                          }}
                          onClick={() => void deleteMedia(item)}
                        >
                          Delete from storage
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
                Choose a separate background color for each product
                category. Changes update this preview immediately.
              </p>
            </div>

            {products.map((product, index) => (
              <div
                key={product.name}
                style={{
                  ...panelStyle,
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(190px, 1fr))",
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
                  onChange={(event) =>
                    setHeroSubtitle(event.target.value)
                  }
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
                Homepage preview only
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
                style={{
                  display: "block",
                  width: 80,
                  height: 45,
                  marginTop: 8,
                }}
              />

              <span>{brandColor}</span>
            </label>

            <label>
              Website background

              <input
                type="color"
                value={backgroundColor}
                onChange={(event) =>
                  setBackgroundColor(event.target.value)
                }
                style={{
                  display: "block",
                  width: 80,
                  height: 45,
                  marginTop: 8,
                }}
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
          <button
            type="button"
            style={buttonStyle}
            onClick={saveDraft}
          >
            Save Design Draft
          </button>

          <span
            style={{
              color: "#75676b",
              fontSize: 13,
              lineHeight: 1.6,
            }}
          >
            This saves design settings in this browser. Live homepage
            publishing and automatic media-library loading still need
            to be connected.
          </span>
        </div>
      </div>
    </main>
  );
}