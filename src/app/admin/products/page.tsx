"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

type PriceType = "per_kg" | "fixed";

type Product = {
  id: number | string;
  name: string;
  category: string;
  price: number;
  cost_price: number;
  price_type: PriceType;
  discount: number;
  stock: number;
  status: "Active" | "Inactive";
  weight: string;
  image: string;
  image_url: string;
  description: string;
  long_description: string;
  ingredients: string;
  rating: number;
};

type ProductForm = Omit<Product, "id" | "rating">;

const emptyProduct: ProductForm = {
  name: "",
  category: "Sweets",
  price: 0,
  cost_price: 0,
  price_type: "per_kg",
  discount: 0,
  stock: 0,
  status: "Active",
  weight: "",
  image: "🍬",
  image_url: "",
  description: "",
  long_description: "",
  ingredients: "",
};

const colors = {
  teal: "#103b3a",
  tealDark: "#092c2c",
  tealLight: "#1b5551",
  gold: "#c99b43",
  goldLight: "#f2dfb5",
  cream: "#faf6ed",
  creamDark: "#f1e9d9",
  white: "#ffffff",
  text: "#253b38",
  muted: "#788783",
  border: "#e7dfcf",
  red: "#b64242",
  green: "#28734e",
};

function money(value: number) {
  return `Rs. ${Number(value || 0).toLocaleString("en-PK", {
    maximumFractionDigits: 2,
  })}`;
}

function getProfit(
  product: Pick<Product, "price" | "cost_price" | "discount">
) {
  const sellingPrice =
    Number(product.price || 0) *
    (1 - Number(product.discount || 0) / 100);

  return sellingPrice - Number(product.cost_price || 0);
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [databaseError, setDatabaseError] = useState("");
  const [imageUploading, setImageUploading] = useState(false);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | string | null>(null);

  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);

  const [form, setForm] = useState<ProductForm>({ ...emptyProduct });

  const loadProducts = useCallback(async () => {
    try {
      setDatabaseError("");

      const response = await fetch("/api/products", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || data.error || "Products load nahi ho sake."
        );
      }

      const databaseProducts: Product[] = (data.products || []).map(
        (product: Partial<Product>) => ({
          id: product.id ?? "",
          name: product.name ?? "",
          category: product.category ?? "Sweets",
          price: Number(product.price ?? 0),
          cost_price: Number(product.cost_price ?? 0),
          price_type:
            product.price_type === "fixed" ? "fixed" : "per_kg",
          discount: Number(product.discount ?? 0),
          stock: Number(product.stock ?? 0),
          status: product.status === "Inactive" ? "Inactive" : "Active",
          weight: product.weight ?? "",
          image: product.image ?? "🍬",
          image_url: product.image_url ?? "",
          description: product.description ?? "",
          long_description: product.long_description ?? "",
          ingredients: product.ingredients ?? "",
          rating: Number(product.rating ?? 5),
        })
      );

      setProducts(databaseProducts);
    } catch (error) {
      setDatabaseError(
        error instanceof Error
          ? error.message
          : "Database connection mein masla hai."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  const categories = useMemo(
    () => [
      "All",
      ...Array.from(new Set(products.map((product) => product.category))),
    ],
    [products]
  );

  const filteredProducts = products.filter((product) => {
    const searchMatch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.category.toLowerCase().includes(search.toLowerCase());

    const categoryMatch =
      categoryFilter === "All" || product.category === categoryFilter;

    return searchMatch && categoryMatch;
  });

  const activeProducts = products.filter(
    (product) => product.status === "Active"
  ).length;

  const outOfStock = products.filter(
    (product) => product.stock === 0
  ).length;

  const categoryCount = new Set(
    products.map((product) => product.category)
  ).size;

  function openAddProduct() {
    setEditingId(null);
    setForm({ ...emptyProduct });
    setShowForm(true);
  }

  function openEditProduct(product: Product) {
    setEditingId(product.id);

    setForm({
      name: product.name,
      category: product.category,
      price: product.price,
      cost_price: product.cost_price,
      price_type: product.price_type,
      discount: product.discount,
      stock: product.stock,
      status: product.status,
      weight: product.weight,
      image: product.image,
      image_url: product.image_url ?? "",
      description: product.description ?? "",
      long_description: product.long_description ?? "",
      ingredients: product.ingredients ?? "",
    });

    setShowForm(true);
  }

  async function uploadProductImage(file: File | undefined) {
    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("JPG, PNG, WEBP ya GIF image select karo.");
      return;
    }

    if (file.size === 0 || file.size > 4 * 1024 * 1024) {
      alert("Image 4 MB se chhoti honi chahiye.");
      return;
    }

    setImageUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/media-upload", {
        method: "POST",
        credentials: "same-origin",
        body: formData,
      });

      const result: {
        url?: string;
        error?: string;
        warning?: string;
      } = await response.json();

      if (!response.ok || !result.url) {
        throw new Error(
          result.error || "Product image upload nahi ho saki."
        );
      }

      setForm((current) => ({
        ...current,
        image_url: result.url ?? "",
      }));

      alert(
        result.warning ||
          "Photo upload ho gayi. Ab Add Product / Save Changes dabao."
      );
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Image upload fail ho gayi."
      );
    } finally {
      setImageUploading(false);
    }
  }

  async function saveProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.name.trim()) {
      alert("Product name is required.");
      return;
    }

    if (form.price < 0 || form.cost_price < 0) {
      alert("Price aur cost negative nahi ho sakte.");
      return;
    }

    if (form.discount < 0 || form.discount > 100) {
      alert("Discount 0 se 100 ke darmiyan hona chahiye.");
      return;
    }

    if (form.price_type !== "per_kg" && form.price_type !== "fixed") {
      alert("Product price type select karo.");
      return;
    }

    try {
      const isEditing = editingId !== null;

      const payload = {
        ...form,
        name: form.name.trim(),
        price: Number(form.price),
        cost_price: Number(form.cost_price),
        discount: Number(form.discount),
        stock: Number(form.stock),
        rating: isEditing
          ? products.find((product) => product.id === editingId)?.rating ?? 5
          : 5,
      };

      const response = await fetch("/api/products", {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          isEditing ? { ...payload, id: editingId } : payload
        ),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || data.error || "Product save nahi ho saka."
        );
      }

      await loadProducts();

      setShowForm(false);
      setEditingId(null);
      setForm({ ...emptyProduct });

      alert(
        isEditing
          ? "Product update ho gaya!"
          : "Product database mein save ho gaya!"
      );
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Product save karte waqt masla hua."
      );
    }
  }

  async function removeProduct() {
    if (!deleteProduct) return;

    try {
      const response = await fetch(
        `/api/products?id=${encodeURIComponent(String(deleteProduct.id))}`,
        { method: "DELETE" }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || data.error || "Product delete nahi ho saka."
        );
      }

      setProducts((current) =>
        current.filter((product) => product.id !== deleteProduct.id)
      );

      setDeleteProduct(null);
      alert("Product database se delete ho gaya!");
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Product delete karte waqt masla hua."
      );
    }
  }

  const currentProfit = getProfit(form);

  return (
    <main style={pageStyle}>
      <header style={topHeaderStyle}>
        <div style={headerInnerStyle}>
          <div>
            <div style={eyebrowStyle}>MULTANI MITHAS · ADMIN PANEL</div>
            <h1 style={mainTitleStyle}>Products Management</h1>
            <p style={headerSubtitleStyle}>
              Premium products, pricing, costs aur inventory management
            </p>
          </div>

          <div style={headerActionsStyle}>
            <Link href="/admin" style={dashboardLinkStyle}>
              ← Dashboard
            </Link>
            <button onClick={openAddProduct} style={goldButtonStyle}>
              ＋ Add Product
            </button>
          </div>
        </div>
      </header>

      <div style={contentStyle}>
        {databaseError && (
          <div style={errorBoxStyle}>
            <strong>Database error:</strong> {databaseError}
            <button
              onClick={() => {
                setLoading(true);
                void loadProducts();
              }}
              style={retryButtonStyle}
            >
              Retry
            </button>
          </div>
        )}

        {loading && (
          <div style={loadingStyle}>
            Products database se load ho rahe hain...
          </div>
        )}

        <section style={statsGridStyle}>
          <StatCard
            icon="📦"
            title="Total Products"
            value={products.length}
            text="Products in catalog"
          />
          <StatCard
            icon="✦"
            title="Active Products"
            value={activeProducts}
            text="Currently available"
          />
          <StatCard
            icon="⚠"
            title="Out of Stock"
            value={outOfStock}
            text="Need stock update"
          />
          <StatCard
            icon="🏷"
            title="Categories"
                        value={categoryCount}
            text="Product categories"
          />
        </section>

        <section style={panelStyle}>
          <div style={searchRowStyle}>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products by name or category..."
              style={{ ...inputStyle, flex: 1, minWidth: 220 }}
            />

            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              style={{ ...inputStyle, minWidth: 170 }}
            >
              {categories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>

            <button onClick={openAddProduct} style={outlineGoldButtonStyle}>
              ＋ New Product
            </button>
          </div>
        </section>

        <section style={{ ...panelStyle, padding: 0, overflow: "hidden" }}>
          <div style={catalogHeaderStyle}>
            <div>
              <h2 style={catalogTitleStyle}>Product Catalog</h2>
              <p style={mutedTextStyle}>
                Products, selling prices, costs and profit margins
              </p>
            </div>
            <span style={countBadgeStyle}>
              {filteredProducts.length} Products
            </span>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={tableStyle}>
              <thead>
                <tr style={{ background: colors.cream }}>
                  {[
                    "Product",
                    "Category",
                    "Price Type",
                    "Selling Price",
                    "Cost Price",
                    "Margin",
                    "Stock",
                    "Status",
                    "Actions",
                  ].map((heading) => (
                    <th key={heading} style={headerCellStyle}>
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map((product) => {
                  const profit = getProfit(product);

                  return (
                    <tr key={product.id}>
                      <td style={cellStyle}>
                        <div style={productCellStyle}>
                          <div style={productThumbStyle}>
                            {product.image_url ? (
                              <img
                                src={product.image_url}
                                alt={product.name}
                                style={productThumbImageStyle}
                              />
                            ) : (
                              product.image
                            )}
                          </div>
                          <div>
                            <strong style={{ color: colors.teal }}>
                              {product.name}
                            </strong>
                            <span style={weightTextStyle}>
                              {product.weight}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td style={cellStyle}>{product.category}</td>

                      <td style={cellStyle}>
                        <span style={typeBadgeStyle}>
                          {product.price_type === "per_kg" ? "Per KG" : "Fixed"}
                        </span>
                      </td>

                      <td style={cellStyle}>
                        <strong>{money(product.price)}</strong>
                        {product.price_type === "per_kg" && (
                          <span style={smallMutedStyle}> / kg</span>
                        )}
                        {product.discount > 0 && (
                          <div style={discountStyle}>
                            {product.discount}% OFF
                          </div>
                        )}
                      </td>

                      <td style={cellStyle}>
                        {money(product.cost_price)}
                        {product.price_type === "per_kg" && (
                          <span style={smallMutedStyle}> / kg</span>
                        )}
                      </td>

                      <td style={cellStyle}>
                        <strong
                          style={{
                            color: profit >= 0 ? colors.green : colors.red,
                          }}
                        >
                          {money(profit)}
                        </strong>
                        {product.price_type === "per_kg" && (
                          <span style={smallMutedStyle}> / kg</span>
                        )}
                      </td>

                      <td style={cellStyle}>
                        <strong
                          style={{
                            color:
                              product.stock === 0 ? colors.red : colors.text,
                          }}
                        >
                          {product.stock}
                        </strong>
                      </td>

                      <td style={cellStyle}>
                        <span
                          style={{
                            ...statusBadgeStyle,
                            background:
                              product.status === "Active"
                                ? "#e8f2e9"
                                : "#f8eaea",
                            color:
                              product.status === "Active"
                                ? colors.green
                                : colors.red,
                          }}
                        >
                          {product.status}
                        </span>
                      </td>

                      <td style={cellStyle}>
                        <div style={tableActionsStyle}>
                          <SmallButton
                            text="View"
                            onClick={() => setViewProduct(product)}
                          />
                          <SmallButton
                            text="Edit"
                            onClick={() => openEditProduct(product)}
                          />
                          <button
                            onClick={() => setDeleteProduct(product)}
                            style={deleteButtonStyle}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={9} style={emptyTableStyle}>
                      <div style={{ fontSize: 38 }}>🔎</div>
                      <strong>No products found</strong>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {showForm && (
        <div style={overlayStyle}>
          <div style={formModalStyle}>
            <div style={modalHeaderStyle}>
              <div>
                <div style={eyebrowStyle}>PRODUCT MANAGEMENT</div>
                <h2 style={modalTitleStyle}>
                  {editingId !== null ? "Edit Product" : "Add New Product"}
                </h2>
              </div>

              <button
                onClick={() => setShowForm(false)}
                style={modalCloseStyle}
                type="button"
              >
                ✕
              </button>
            </div>

            <form onSubmit={saveProduct} style={formBodyStyle}>
              <section style={formSectionStyle}>
                <SectionHeading>01 · Basic Information</SectionHeading>

                <div style={formGridStyle}>
                  <Field label="Product Name">
                    <input
                      value={form.name}
                      onChange={(event) =>
                        setForm({ ...form, name: event.target.value })
                      }
                      placeholder="Multani Sohan Halwa"
                      style={inputStyle}
                      required
                    />
                  </Field>

                  <Field label="Category">
                    <select
                      value={form.category}
                      onChange={(event) =>
                        setForm({ ...form, category: event.target.value })
                      }
                      style={inputStyle}
                    >
                      <option>Sweets</option>
                      <option>Bakery</option>
                      <option>Namkeen</option>
                      <option>Gift Boxes</option>
                      <option>Cakes</option>
                      <option>Seasonal</option>
                    </select>
                  </Field>

                  <Field label="Price Type">
                    <select
                      value={form.price_type}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          price_type: event.target.value as PriceType,
                        })
                      }
                      style={inputStyle}
                    >
                      <option value="per_kg">Per KG (weight-based)</option>
                      <option value="fixed">Fixed Price (box/item)</option>
                    </select>
                  </Field>

                  <Field
                    label={
                      form.price_type === "per_kg"
                        ? "Selling Price per KG (Rs.)"
                        : "Selling Price per Item (Rs.)"
                    }
                  >
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.price}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          price: Number(event.target.value),
                        })
                      }
                      style={inputStyle}
                      required
                    />
                  </Field>

                  <Field
                    label={
                      form.price_type === "per_kg"
                        ? "Production Cost per KG (Rs.)"
                        : "Production Cost per Item (Rs.)"
                    }
                  >
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.cost_price}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          cost_price: Number(event.target.value),
                        })
                      }
                      style={inputStyle}
                      required
                    />
                  </Field>

                  <Field label="Discount (%)">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={form.discount}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          discount: Number(event.target.value),
                        })
                      }
                      style={inputStyle}
                    />
                  </Field>

                  <Field label="Stock Quantity">
                    <input
                      type="number"
                      min="0"
                      value={form.stock}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          stock: Number(event.target.value),
                        })
                      }
                      style={inputStyle}
                    />
                  </Field>

                  <Field label="Weight / Size (display)">
                    <input
                      value={form.weight}
                      onChange={(event) =>
                        setForm({ ...form, weight: event.target.value })
                      }
                      placeholder="500g / 1kg / 2kg box"
                      style={inputStyle}
                    />
                  </Field>

                  <Field label="Status">
                    <select
                      value={form.status}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          status: event.target.value as "Active" | "Inactive",
                        })
                      }
                      style={inputStyle}
                    >
                      <option>Active</option>
                      <option>Inactive</option>
                    </select>
                  </Field>

                  <Field label="Product Icon">
                    <input
                      value={form.image}
                      onChange={(event) =>
                        setForm({ ...form, image: event.target.value })
                      }
                      placeholder="🍯"
                      style={inputStyle}
                    />
                  </Field>
                </div>

                <div style={profitBoxStyle}>
                  <strong style={{ color: colors.gold }}>
                    Profit Preview
                  </strong>
                  <div
                    style={{
                      fontSize: 26,
                      fontWeight: 900,
                      marginTop: 8,
                      color: currentProfit >= 0 ? colors.green : colors.red,
                    }}
                  >
                    {money(currentProfit)}
                    {form.price_type === "per_kg" ? " per KG" : " per item"}
                  </div>
                  <p style={profitNoteStyle}>
                    Discount ke baad selling price minus production cost.
                    Packaging aur delivery is calculation mein shamil nahi.
                  </p>
                </div>

                {form.price_type === "per_kg" && (
                  <div style={infoBoxStyle}>
                    Customer weight select karega. Misal: Rs. 1,200/kg par
                    50g = Rs. 60, 250g = Rs. 300, 500g = Rs. 600.
                  </div>
                )}

                {form.price_type === "fixed" && (
                  <div style={infoBoxStyle}>
                    Is product ki price fixed rahegi. Weight se price multiply
                    nahi hogi.
                  </div>
                )}
              </section>

              <section style={formSectionStyle}>
                <SectionHeading>02 · Product Photography</SectionHeading>

                <p style={helperTextStyle}>
                  JPG, PNG, WEBP ya GIF — maximum 4 MB. Upload ke baad Add
                  Product / Save Changes zaroor dabao.
                </p>

                {form.image_url && (
                  <div style={{ marginBottom: 15 }}>
                    <img
                      src={form.image_url}
                      alt="Product preview"
                      style={imagePreviewStyle}
                    />
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, image_url: "" })}
                      style={{ ...outlineGoldButtonStyle, marginTop: 9 }}
                    >
                      Remove photo from product
                    </button>
                  </div>
                )}

                <label style={uploadBoxStyle}>
                  <strong>
                                        {imageUploading
                      ? "Uploading image..."
                      : "Choose product photo"}
                  </strong>
                  <span style={helperTextStyle}>
                    Select an image from your device
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    disabled={imageUploading}
                    onChange={(event) => {
                      void uploadProductImage(event.currentTarget.files?.[0]);
                      event.currentTarget.value = "";
                    }}
                    style={{ display: "block", marginTop: 12 }}
                  />
                </label>
              </section>

              <section style={formSectionStyle}>
                <SectionHeading>03 · Product Details & Article</SectionHeading>

                <Field label="Short Description">
                  <textarea
                    rows={4}
                    value={form.description}
                    onChange={(event) =>
                      setForm({ ...form, description: event.target.value })
                    }
                    placeholder="Product ka short introduction..."
                    style={textareaStyle}
                  />
                </Field>

                <div style={{ height: 16 }} />

                <Field label="Ingredients">
                  <textarea
                    rows={3}
                    value={form.ingredients}
                    onChange={(event) =>
                      setForm({ ...form, ingredients: event.target.value })
                    }
                    placeholder="Ingredients ki list..."
                    style={textareaStyle}
                  />
                </Field>

                <div style={{ height: 16 }} />

                <Field label="Detailed Product Article (Website Product Page)">
                  <textarea
                    rows={9}
                    value={form.long_description}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        long_description: event.target.value,
                      })
                    }
                    placeholder="Yahan product ki detailed information likhein: product introduction, taste, texture, preparation details aur serving suggestions..."
                    style={{
                      ...textareaStyle,
                      minHeight: 190,
                      lineHeight: 1.8,
                    }}
                  />
                </Field>

                <p style={helperTextStyle}>
                  Ye detailed article website ke product page par dikhaya ja
                  sakta hai. Sirf wohi ingredients aur product details likhein
                  jo waqai is product mein maujood hain.
                </p>
              </section>

              <div style={formFooterStyle}>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  style={outlineGoldButtonStyle}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={imageUploading}
                  style={{
                    ...goldButtonStyle,
                    opacity: imageUploading ? 0.6 : 1,
                  }}
                >
                  ✓ {editingId !== null ? "Save Changes" : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewProduct && (
        <div style={overlayStyle}>
          <div style={viewModalStyle}>
            <div style={viewHeaderStyle}>
              {viewProduct.image_url ? (
                <img
                  src={viewProduct.image_url}
                  alt={viewProduct.name}
                  style={viewImageStyle}
                />
              ) : (
                <div style={{ fontSize: 65 }}>{viewProduct.image}</div>
              )}

              <h2 style={viewTitleStyle}>{viewProduct.name}</h2>
              <span style={{ color: colors.goldLight }}>
                {viewProduct.category}
              </span>
            </div>

            <div style={viewBodyStyle}>
              <DetailRow
                label="Price Type"
                value={viewProduct.price_type === "per_kg" ? "Per KG" : "Fixed"}
              />
              <DetailRow
                label="Selling Price"
                value={`${money(viewProduct.price)}${
                  viewProduct.price_type === "per_kg" ? " / kg" : ""
                }`}
              />
              <DetailRow
                label="Cost Price"
                value={`${money(viewProduct.cost_price)}${
                  viewProduct.price_type === "per_kg" ? " / kg" : ""
                }`}
              />
              <DetailRow
                label="Profit after discount"
                value={`${money(getProfit(viewProduct))}${
                  viewProduct.price_type === "per_kg" ? " / kg" : ""
                }`}
              />
              <DetailRow label="Discount" value={`${viewProduct.discount}%`} />
              <DetailRow label="Stock" value={String(viewProduct.stock)} />
              <DetailRow
                label="Weight / Size"
                value={viewProduct.weight || "-"}
              />
              <DetailRow label="Status" value={viewProduct.status} />
              <DetailRow label="Rating" value={`⭐ ${viewProduct.rating}`} />

              <h4 style={detailHeadingStyle}>Short Description</h4>
              <p style={detailTextStyle}>
                {viewProduct.description || "No description."}
              </p>

              <h4 style={detailHeadingStyle}>Ingredients</h4>
              <p style={detailTextStyle}>
                {viewProduct.ingredients || "No ingredients."}
              </p>

              <h4 style={detailHeadingStyle}>Detailed Product Article</h4>
              <p style={articlePreviewStyle}>
                {viewProduct.long_description || "No detailed article added yet."}
              </p>

              <button
                onClick={() => setViewProduct(null)}
                style={{ ...goldButtonStyle, width: "100%", marginTop: 18 }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteProduct && (
        <div style={overlayStyle}>
          <div style={deleteModalStyle}>
            <div style={{ fontSize: 42 }}>🗑️</div>
            <h2 style={{ color: colors.teal }}>Remove Product?</h2>
            <p style={detailTextStyle}>
              Are you sure you want to remove{" "}
              <strong>{deleteProduct.name}</strong>?
            </p>

            <div style={deleteActionsStyle}>
              <button
                onClick={() => setDeleteProduct(null)}
                style={{ ...outlineGoldButtonStyle, flex: 1 }}
              >
                Cancel
              </button>
              <button
                onClick={removeProduct}
                style={{ ...deleteButtonStyle, flex: 1, padding: 12 }}
              >
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function StatCard({
  icon,
  title,
  value,
  text,
}: {
  icon: string;
  title: string;
  value: number;
  text: string;
}) {
  return (
    <div style={statCardStyle}>
      <div style={statTopStyle}>
        <span style={statLabelStyle}>{title}</span>
        <span style={statIconStyle}>{icon}</span>
      </div>
      <div style={statValueStyle}>{value}</div>
      <div style={statNoteStyle}>{text}</div>
    </div>
  );
}

function SmallButton({
  text,
  onClick,
}: {
  text: string;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} style={smallButtonStyle}>
      {text}
    </button>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label style={fieldLabelStyle}>
      <span style={fieldLabelTextStyle}>{label}</span>
      {children}
    </label>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h3 style={sectionHeadingStyle}>{children}</h3>;
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div style={detailRowStyle}>
      <span style={{ color: colors.muted }}>{label}</span>
      <strong style={{ color: colors.teal, textAlign: "right" }}>{value}</strong>
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: colors.cream,
  color: colors.text,
  fontFamily: "Arial, Helvetica, sans-serif",
};

const topHeaderStyle: React.CSSProperties = {
  background: `linear-gradient(120deg, ${colors.tealDark}, ${colors.teal}, ${colors.tealLight})`,
  color: colors.white,
  padding: "28px 24px",
  borderBottom: `3px solid ${colors.gold}`,
  boxShadow: "0 8px 28px rgba(9,44,44,0.18)",
};

const headerInnerStyle: React.CSSProperties = {
  maxWidth: 1500,
  margin: "auto",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 20,
  flexWrap: "wrap",
};

const eyebrowStyle: React.CSSProperties = {
  fontSize: 11,
  color: colors.goldLight,
  letterSpacing: 2,
  fontWeight: 800,
  marginBottom: 8,
};

const mainTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "clamp(24px, 4vw, 32px)",
  fontWeight: 900,
  letterSpacing: -0.5,
};

const headerSubtitleStyle: React.CSSProperties = {
  margin: "8px 0 0",
  color: "#d8e4df",
  fontSize: 13,
};

const headerActionsStyle: React.CSSProperties = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
  alignItems: "center",
};

const dashboardLinkStyle: React.CSSProperties = {
  textDecoration: "none",
  color: colors.white,
  border: "1px solid rgba(255,255,255,0.35)",
  padding: "12px 16px",
  borderRadius: 9,
  fontWeight: 800,
  fontSize: 13,
};

const contentStyle: React.CSSProperties = {
  maxWidth: 1500,
  margin: "auto",
  padding: "26px 22px 60px",
};

const statsGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(205px, 1fr))",
  gap: 15,
  marginBottom: 20,
};

const statCardStyle: React.CSSProperties = {
  background: colors.white,
  border: `1px solid ${colors.border}`,
  borderTop: `3px solid ${colors.gold}`,
  borderRadius: 13,
  padding: 20,
  boxShadow: "0 5px 20px rgba(16,59,58,0.05)",
};

const statTopStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const statLabelStyle: React.CSSProperties = {
  color: colors.muted,
  fontSize: 12,
  fontWeight: 800,
};

const statIconStyle: React.CSSProperties = {
  fontSize: 22,
  background: colors.cream,
  padding: 8,
  borderRadius: 9,
};

const statValueStyle: React.CSSProperties = {
  fontSize: 30,
  fontWeight: 900,
  marginTop: 12,
  color: colors.teal,
};

const statNoteStyle: React.CSSProperties = {
  color: colors.muted,
  fontSize: 11,
  marginTop: 4,
};
const panelStyle: React.CSSProperties = {
  background: colors.white,
  borderRadius: 13,
  padding: 17,
  border: `1px solid ${colors.border}`,
  boxShadow: "0 5px 22px rgba(16,59,58,0.05)",
  marginBottom: 18,
};

const searchRowStyle: React.CSSProperties = {
  display: "flex",
  gap: 11,
  flexWrap: "wrap",
  alignItems: "center",
};

const catalogHeaderStyle: React.CSSProperties = {
  padding: "20px 22px",
  borderBottom: `1px solid ${colors.border}`,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 15,
  flexWrap: "wrap",
};

const catalogTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 19,
  fontWeight: 900,
  color: colors.teal,
};

const mutedTextStyle: React.CSSProperties = {
  margin: "5px 0 0",
  color: colors.muted,
  fontSize: 12,
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  minWidth: 1180,
  borderCollapse: "collapse",
};

const headerCellStyle: React.CSSProperties = {
  padding: "14px 15px",
  textAlign: "left",
  color: colors.teal,
  fontSize: 10,
  textTransform: "uppercase",
  letterSpacing: 0.7,
  whiteSpace: "nowrap",
};

const cellStyle: React.CSSProperties = {
  padding: "15px",
  borderTop: `1px solid ${colors.border}`,
  fontSize: 12,
  verticalAlign: "middle",
};

const productCellStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 11,
  minWidth: 190,
};

const productThumbStyle: React.CSSProperties = {
  width: 48,
  height: 48,
  borderRadius: 9,
  overflow: "hidden",
  background: colors.cream,
  border: `1px solid ${colors.border}`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 25,
  flexShrink: 0,
};

const productThumbImageStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const weightTextStyle: React.CSSProperties = {
  display: "block",
  marginTop: 4,
  color: colors.muted,
  fontSize: 11,
};

const typeBadgeStyle: React.CSSProperties = {
  background: colors.cream,
  color: colors.teal,
  border: `1px solid ${colors.border}`,
  borderRadius: 6,
  padding: "6px 8px",
  fontSize: 10,
  fontWeight: 800,
  whiteSpace: "nowrap",
};

const statusBadgeStyle: React.CSSProperties = {
  padding: "6px 9px",
  borderRadius: 20,
  fontSize: 10,
  fontWeight: 900,
};

const smallMutedStyle: React.CSSProperties = {
  color: colors.muted,
  fontSize: 10,
};

const discountStyle: React.CSSProperties = {
  color: "#a36c17",
  fontSize: 10,
  fontWeight: 800,
  marginTop: 4,
};

const tableActionsStyle: React.CSSProperties = {
  display: "flex",
  gap: 5,
  flexWrap: "wrap",
};

const emptyTableStyle: React.CSSProperties = {
  padding: 55,
  textAlign: "center",
  color: colors.muted,
};

const countBadgeStyle: React.CSSProperties = {
  background: colors.cream,
  color: colors.teal,
  border: `1px solid ${colors.gold}`,
  borderRadius: 20,
  padding: "7px 12px",
  fontSize: 11,
  fontWeight: 900,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px 13px",
  borderRadius: 8,
  border: `1px solid ${colors.border}`,
  background: "#fffefa",
  color: colors.text,
  fontSize: 13,
  outline: "none",
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  resize: "vertical",
  lineHeight: 1.6,
};

const goldButtonStyle: React.CSSProperties = {
  background: `linear-gradient(135deg, ${colors.gold}, #dfbb70)`,
  color: colors.tealDark,
  border: `1px solid ${colors.gold}`,
  padding: "12px 18px",
  borderRadius: 9,
  fontWeight: 900,
  cursor: "pointer",
  fontSize: 12,
  boxShadow: "0 4px 12px rgba(201,155,67,0.18)",
};

const outlineGoldButtonStyle: React.CSSProperties = {
  padding: "11px 15px",
  border: `1px solid ${colors.gold}`,
  borderRadius: 8,
  background: colors.cream,
  color: colors.teal,
  cursor: "pointer",
  fontWeight: 800,
  fontSize: 12,
};

const smallButtonStyle: React.CSSProperties = {
  border: `1px solid ${colors.border}`,
  background: colors.cream,
  color: colors.teal,
  padding: "7px 9px",
  borderRadius: 6,
  cursor: "pointer",
  fontSize: 10,
  fontWeight: 900,
};

const deleteButtonStyle: React.CSSProperties = {
  border: "1px solid #edcaca",
  background: "#fff6f5",
  color: colors.red,
  padding: "7px 9px",
  borderRadius: 6,
  cursor: "pointer",
  fontSize: 10,
  fontWeight: 900,
};

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 100,
  background: "rgba(5, 25, 25, 0.76)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 12,
};

const formModalStyle: React.CSSProperties = {
  width: "min(850px, 96vw)",
  maxHeight: "94vh",
  overflowY: "auto",
  background: colors.cream,
  border: `1px solid ${colors.gold}`,
  borderRadius: 15,
  boxShadow: "0 25px 80px rgba(0,0,0,0.35)",
};

const modalHeaderStyle: React.CSSProperties = {
  background: `linear-gradient(120deg, ${colors.tealDark}, ${colors.tealLight})`,
  color: colors.white,
  padding: "21px 23px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: `2px solid ${colors.gold}`,
};

const modalTitleStyle: React.CSSProperties = {
  margin: "5px 0 0",
  fontSize: 22,
  fontWeight: 900,
};

const modalCloseStyle: React.CSSProperties = {
  width: 36,
  height: 36,
  borderRadius: 8,
  border: "1px solid rgba(255,255,255,0.3)",
  background: "rgba(255,255,255,0.1)",
  color: colors.white,
  cursor: "pointer",
  fontWeight: 900,
  fontSize: 15,
};

const formBodyStyle: React.CSSProperties = {
  padding: 20,
};

const formSectionStyle: React.CSSProperties = {
  background: colors.white,
  border: `1px solid ${colors.border}`,
  borderRadius: 11,
  padding: 17,
  marginBottom: 16,
};

const sectionHeadingStyle: React.CSSProperties = {
  margin: "0 0 16px",
  color: colors.teal,
  fontSize: 14,
  fontWeight: 900,
  paddingBottom: 10,
  borderBottom: `1px solid ${colors.border}`,
};

const formGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 14,
};

const fieldLabelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 800,
  color: colors.teal,
};

const fieldLabelTextStyle: React.CSSProperties = {
  display: "block",
  marginBottom: 7,
};

const profitBoxStyle: React.CSSProperties = {
  marginTop: 18,
  padding: 16,
  borderRadius: 10,
  background: colors.tealDark,
  border: `1px solid ${colors.gold}`,
};

const profitNoteStyle: React.CSSProperties = {
  margin: "7px 0 0",
  color: "#d2dfd9",
  fontSize: 11,
  lineHeight: 1.6,
};

const infoBoxStyle: React.CSSProperties = {
  marginTop: 13,
  padding: 13,
  background: "#fbf3df",
  border: `1px solid ${colors.goldLight}`,
  borderRadius: 8,
  color: "#75551c",
  fontSize: 12,
  lineHeight: 1.6,
};

const helperTextStyle: React.CSSProperties = {
  margin: "0 0 13px",
  color: colors.muted,
  fontSize: 11,
  lineHeight: 1.6,
};

const imagePreviewStyle: React.CSSProperties = {
  display: "block",
  width: 180,
  height: 140,
  objectFit: "cover",
  borderRadius: 9,
  border: `1px solid ${colors.gold}`,
};

const uploadBoxStyle: React.CSSProperties = {
  display: "block",
  border: `2px dashed ${colors.gold}`,
  borderRadius: 10,
  padding: 17,
  background: colors.cream,
  cursor: "pointer",
  color: colors.teal,
};

const formFooterStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  gap: 10,
  flexWrap: "wrap",
  marginTop: 20,
};

const viewModalStyle: React.CSSProperties = {
  width: "min(600px, 96vw)",
  maxHeight: "92vh",
  overflowY: "auto",
  background: colors.cream,
  border: `1px solid ${colors.gold}`,
  borderRadius: 15,
  boxShadow: "0 25px 80px rgba(0,0,0,0.35)",
};

const viewHeaderStyle: React.CSSProperties = {
  background: `linear-gradient(135deg, ${colors.tealDark}, ${colors.tealLight})`,
  color: colors.white,
  padding: 25,
  textAlign: "center",
  borderBottom: `2px solid ${colors.gold}`,
};

const viewImageStyle: React.CSSProperties = {
  width: 150,
  height: 120,
  objectFit: "cover",
  borderRadius: 10,
  margin: "0 auto 10px",
  display: "block",
  border: `1px solid ${colors.gold}`,
};

const viewTitleStyle: React.CSSProperties = {
  margin: "10px 0 5px",
  fontSize: 22,
};

const viewBodyStyle: React.CSSProperties = {
  padding: 22,
};

const detailRowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 16,
  padding: "10px 0",
  borderBottom: `1px solid ${colors.border}`,
  fontSize: 12,
};

const detailHeadingStyle: React.CSSProperties = {
  color: colors.teal,
  margin: "19px 0 7px",
  fontSize: 13,
};

const detailTextStyle: React.CSSProperties = {
  color: colors.muted,
  lineHeight: 1.7,
  fontSize: 12,
  whiteSpace: "pre-wrap",
};

const articlePreviewStyle: React.CSSProperties = {
  ...detailTextStyle,
  background: colors.white,
  border: `1px solid ${colors.border}`,
  borderRadius: 9,
  padding: 13,
  maxHeight: 260,
  overflowY: "auto",
};

const deleteModalStyle: React.CSSProperties = {
  width: "min(430px, 94vw)",
  background: colors.cream,
  border: `1px solid ${colors.gold}`,
  borderRadius: 14,
  padding: 27,
  textAlign: "center",
  boxShadow: "0 25px 80px rgba(0,0,0,0.3)",
};

const deleteActionsStyle: React.CSSProperties = {
  display: "flex",
  gap: 10,
  marginTop: 22,
};

const errorBoxStyle: React.CSSProperties = {
  background: "#fff0ed",
  color: "#a13b32",
  border: "1px solid #efc7c0",
  padding: 14,
  borderRadius: 9,
  marginBottom: 17,
  fontSize: 13,
};

const retryButtonStyle: React.CSSProperties = {
  marginLeft: 12,
  padding: "6px 10px",
  border: "1px solid #d9aaa3",
  borderRadius: 6,
  background: "#fff",
  color: "#8d3029",
  cursor: "pointer",
};

const loadingStyle: React.CSSProperties = {
  textAlign: "center",
  padding: 20,
  color: colors.teal,
  fontSize: 13,
};