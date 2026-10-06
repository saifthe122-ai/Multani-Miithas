"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  discount: number;
  stock: number;
  status: "Active" | "Inactive";
  weight: string;
  image: string;
  description: string;
  ingredients: string;
  rating: number;
};

const demoProducts: Product[] = [
  {
    id: 1,
    name: "Multani Sohan Halwa",
    category: "Sweets",
    price: 1200,
    discount: 0,
    stock: 25,
    status: "Active",
    weight: "500g",
    image: "🍯",
    description: "Traditional premium Multani Sohan Halwa.",
    ingredients: "Milk, sugar, wheat flour, ghee, nuts",
    rating: 4.9,
  },
  {
    id: 2,
    name: "Premium Barfi",
    category: "Sweets",
    price: 900,
    discount: 5,
    stock: 18,
    status: "Active",
    weight: "500g",
    image: "🍬",
    description: "Soft and creamy traditional barfi.",
    ingredients: "Milk, sugar, khoya, nuts",
    rating: 4.8,
  },
  {
    id: 3,
    name: "Gulab Jamun",
    category: "Sweets",
    price: 700,
    discount: 0,
    stock: 0,
    status: "Active",
    weight: "1kg",
    image: "🟤",
    description: "Fresh traditional gulab jamun.",
    ingredients: "Milk powder, flour, sugar syrup",
    rating: 4.7,
  },
  {
    id: 4,
    name: "Besan Ladoo",
    category: "Sweets",
    price: 850,
    discount: 10,
    stock: 32,
    status: "Active",
    weight: "500g",
    image: "🟡",
    description: "Fresh homemade-style besan ladoo.",
    ingredients: "Gram flour, sugar, ghee, cardamom",
    rating: 4.8,
  },
  {
    id: 5,
    name: "Patisa",
    category: "Sweets",
    price: 950,
    discount: 0,
    stock: 14,
    status: "Active",
    weight: "500g",
    image: "🍰",
    description: "Traditional flaky and delicious patisa.",
    ingredients: "Gram flour, sugar, ghee",
    rating: 4.6,
  },
  {
    id: 6,
    name: "Premium Gift Box",
    category: "Gift Boxes",
    price: 2500,
    discount: 15,
    stock: 8,
    status: "Active",
    weight: "1kg",
    image: "🎁",
    description: "Premium assorted sweets gift box.",
    ingredients: "Assorted premium sweets",
    rating: 5,
  },
];

const emptyProduct: Omit<Product, "id" | "rating"> = {
  name: "",
  category: "Sweets",
  price: 0,
  discount: 0,
  stock: 0,
  status: "Active",
  weight: "",
  image: "🍬",
  description: "",
  ingredients: "",
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(demoProducts);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);

  const [form, setForm] =
    useState<Omit<Product, "id" | "rating">>(emptyProduct);

  const categories = useMemo(() => {
    return [
      "All",
      ...Array.from(new Set(products.map((product) => product.category))),
    ];
  }, [products]);

  const filteredProducts = products.filter((product) => {
    const searchMatch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.category.toLowerCase().includes(search.toLowerCase());

    const categoryMatch =
      categoryFilter === "All" ||
      product.category === categoryFilter;

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
    setForm(emptyProduct);
    setShowForm(true);
  }

  function openEditProduct(product: Product) {
    setEditingId(product.id);

    setForm({
      name: product.name,
      category: product.category,
      price: product.price,
      discount: product.discount,
      stock: product.stock,
      status: product.status,
      weight: product.weight,
      image: product.image,
      description: product.description,
      ingredients: product.ingredients,
    });

    setShowForm(true);
  }

  function saveProduct(event: React.FormEvent) {
    event.preventDefault();

    if (!form.name.trim()) {
      alert("Product name is required.");
      return;
    }

    if (editingId !== null) {
      setProducts((current) =>
        current.map((product) =>
          product.id === editingId
            ? {
                ...product,
                ...form,
              }
            : product
        )
      );
    } else {
      const newProduct: Product = {
        id: Date.now(),
        ...form,
        rating: 5,
      };

      setProducts((current) => [newProduct, ...current]);
    }

    setShowForm(false);
    setEditingId(null);
    setForm(emptyProduct);
  }

  function removeProduct() {
    if (!deleteProduct) return;

    setProducts((current) =>
      current.filter((product) => product.id !== deleteProduct.id)
    );

    setDeleteProduct(null);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #eef8f1 0%, #f7faf8 45%, #edf5ef 100%)",
        color: "#183025",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      {/* HEADER */}
      <header
        style={{
          background:
            "linear-gradient(135deg, #0f5b32 0%, #178044 100%)",
          color: "#fff",
          padding: "25px 30px",
          boxShadow: "0 5px 20px rgba(16, 86, 47, 0.18)",
        }}
      >
        <div
          style={{
            maxWidth: 1500,
            margin: "auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 12,
                opacity: 0.75,
                letterSpacing: 1,
                marginBottom: 7,
              }}
            >
              MULTANI MITHAS • ADMIN
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: 30,
                fontWeight: 900,
              }}
            >
              🍬 Products Management
            </h1>

            <p
              style={{
                margin: "8px 0 0",
                opacity: 0.82,
                fontSize: 14,
              }}
            >
              Manage sweets, bakery products, gift boxes and inventory.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/admin"
              style={{
                textDecoration: "none",
                background: "rgba(255,255,255,0.14)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.3)",
                padding: "11px 17px",
                borderRadius: 10,
                fontWeight: 800,
                fontSize: 13,
              }}
            >
              ← Dashboard
            </Link>

            <button
              onClick={openAddProduct}
              style={{
                background: "#fff",
                color: "#126638",
                border: 0,
                padding: "11px 18px",
                borderRadius: 10,
                fontWeight: 900,
                cursor: "pointer",
                fontSize: 13,
                boxShadow: "0 5px 15px rgba(0,0,0,0.12)",
              }}
            >
              ＋ Add Product
            </button>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <div
        style={{
          maxWidth: 1500,
          margin: "auto",
          padding: "28px 30px 60px",
        }}
      >
        {/* STAT CARDS */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 17,
            marginBottom: 22,
          }}
        >
          <StatCard
            icon="📦"
            title="Total Products"
            value={products.length}
            text="Products in catalog"
            background="linear-gradient(135deg, #ffffff, #eaf7ef)"
          />

          <StatCard
            icon="🟢"
            title="Active Products"
            value={activeProducts}
            text="Currently available"
            background="linear-gradient(135deg, #ffffff, #edf9f0)"
          />

          <StatCard
            icon="⚠️"
            title="Out of Stock"
            value={outOfStock}
            text="Need stock update"
            background="linear-gradient(135deg, #ffffff, #fff8e8)"
          />

          <StatCard
            icon="🏷️"
            title="Categories"
            value={categoryCount}
            text="Product categories"
            background="linear-gradient(135deg, #ffffff, #eef4ff)"
          />
        </section>

        {/* SEARCH PANEL */}
        <section
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: 18,
            border: "1px solid #dfeae2",
            boxShadow: "0 8px 30px rgba(23, 74, 44, 0.07)",
            marginBottom: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <div
              style={{
                flex: 1,
                minWidth: 260,
                position: "relative",
              }}
            >
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="🔍  Search products by name or category..."
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "14px 16px",
                  border: "1px solid #d6e2da",
                  borderRadius: 10,
                  fontSize: 14,
                  outline: "none",
                  background: "#fbfdfc",
                }}
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(event) =>
                setCategoryFilter(event.target.value)
              }
              style={{
                padding: "14px 16px",
                border: "1px solid #d6e2da",
                borderRadius: 10,
                background: "#fbfdfc",
                minWidth: 190,
                fontSize: 14,
                fontWeight: 700,
                color: "#274735",
              }}
            >
              {categories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>

            <button
              onClick={openAddProduct}
              style={{
                padding: "14px 19px",
                border: 0,
                borderRadius: 10,
                background: "#e9f7ed",
                color: "#116535",
                fontWeight: 900,
                cursor: "pointer",
              }}
            >
              ＋ New Product
            </button>
          </div>
        </section>

        {/* PRODUCT TABLE */}
        <section
          style={{
            background: "#fff",
            borderRadius: 16,
            overflow: "hidden",
            border: "1px solid #dfeae2",
            boxShadow: "0 10px 35px rgba(23, 74, 44, 0.08)",
          }}
        >
          <div
            style={{
              padding: "21px 23px",
              borderBottom: "1px solid #e6eee9",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 15,
              flexWrap: "wrap",
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 20,
                  fontWeight: 900,
                }}
              >
                Product Catalog
              </h2>

              <p
                style={{
                  margin: "5px 0 0",
                  color: "#738078",
                  fontSize: 13,
                }}
              >
                Add, edit, view or remove your products.
              </p>
            </div>

            <div
              style={{
                background: "#eaf7ee",
                color: "#126438",
                borderRadius: 20,
                padding: "8px 13px",
                fontSize: 12,
                fontWeight: 900,
              }}
            >
              {filteredProducts.length} Products
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                minWidth: 1050,
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr
                  style={{
                    background:
                      "linear-gradient(90deg, #f1f8f3, #f8fbf9)",
                  }}
                >
                  <th style={headerStyle}>Product</th>
                  <th style={headerStyle}>Category</th>
                  <th style={headerStyle}>Price</th>
                  <th style={headerStyle}>Stock</th>
                  <th style={headerStyle}>Status</th>
                  <th style={headerStyle}>Rating</th>
                  <th style={headerStyle}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td style={cellStyle}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                        }}
                      >
                        <div
                          style={{
                            width: 52,
                            height: 52,
                            borderRadius: 12,
                            background:
                              "linear-gradient(135deg, #eaf7ee, #f7fbf8)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 28,
                            boxShadow:
                              "inset 0 0 0 1px #dcebe1",
                          }}
                        >
                          {product.image}
                        </div>

                        <div>
                          <strong
                            style={{
                              display: "block",
                              fontSize: 14,
                              color: "#20382b",
                            }}
                          >
                            {product.name}
                          </strong>

                          <span
                            style={{
                              display: "block",
                              marginTop: 4,
                              color: "#89938d",
                              fontSize: 12,
                            }}
                          >
                            {product.weight}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td style={cellStyle}>
                      <span
                        style={{
                          background: "#edf6f0",
                          color: "#286040",
                          borderRadius: 8,
                          padding: "7px 10px",
                          fontSize: 11,
                          fontWeight: 800,
                        }}
                      >
                        {product.category}
                      </span>
                    </td>

                    <td style={cellStyle}>
                      <strong>
                        Rs. {product.price.toLocaleString()}
                      </strong>

                      {product.discount > 0 && (
                        <div
                          style={{
                            color: "#c27a00",
                            fontSize: 11,
                            fontWeight: 800,
                            marginTop: 4,
                          }}
                        >
                          {product.discount}% OFF
                        </div>
                      )}
                    </td>

                    <td style={cellStyle}>
                      <span
                        style={{
                          color:
                            product.stock === 0
                              ? "#c62828"
                              : "#294438",
                          fontWeight: 800,
                        }}
                      >
                        {product.stock}
                      </span>
                    </td>

                    <td style={cellStyle}>
                      <span
                        style={{
                          padding: "7px 11px",
                          borderRadius: 20,
                          background:
                            product.status === "Active"
                              ? "#e4f7ea"
                              : "#f9eaea",
                          color:
                            product.status === "Active"
                              ? "#17713d"
                              : "#b32626",
                          fontSize: 11,
                          fontWeight: 900,
                        }}
                      >
                        {product.status === "Active"
                          ? "● Active"
                          : "● Inactive"}
                      </span>
                    </td>

                    <td style={cellStyle}>
                      <span
                        style={{
                          color: "#b97900",
                          fontWeight: 800,
                        }}
                      >
                        ⭐ {product.rating}
                      </span>
                    </td>

                    <td style={cellStyle}>
                      <div
                        style={{
                          display: "flex",
                          gap: 6,
                          flexWrap: "wrap",
                        }}
                      >
                        <SmallButton
                          text="View"
                          onClick={() =>
                            setViewProduct(product)
                          }
                        />

                        <SmallButton
                          text="Edit"
                          onClick={() =>
                            openEditProduct(product)
                          }
                        />

                        <button
                          onClick={() =>
                            setDeleteProduct(product)
                          }
                          style={{
                            border: "1px solid #f0cccc",
                            background: "#fff7f7",
                            color: "#b32626",
                            padding: "7px 9px",
                            borderRadius: 7,
                            cursor: "pointer",
                            fontSize: 11,
                            fontWeight: 900,
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredProducts.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      style={{
                        padding: 60,
                        textAlign: "center",
                        color: "#7b8780",
                      }}
                    >
                      <div style={{ fontSize: 40 }}>🔎</div>
                      <strong
                        style={{
                          display: "block",
                          marginTop: 10,
                          fontSize: 16,
                        }}
                      >
                        No products found
                      </strong>
                      <span
                        style={{
                          display: "block",
                          marginTop: 5,
                          fontSize: 13,
                        }}
                      >
                        Try another search or category.
                      </span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* ADD / EDIT MODAL */}
      {showForm && (
        <div style={overlayStyle}>
          <div
            style={{
              width: "min(780px, 95vw)",
              maxHeight: "92vh",
              overflowY: "auto",
              background: "#fff",
              borderRadius: 20,
              boxShadow: "0 25px 80px rgba(0,0,0,0.25)",
            }}
          >
            <div
              style={{
                background:
                  "linear-gradient(135deg, #0f5b32, #19934e)",
                color: "#fff",
                padding: "23px 25px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 12,
                    opacity: 0.75,
                    letterSpacing: 1,
                  }}
                >
                  PRODUCT MANAGEMENT
                </div>

                <h2
                  style={{
                    margin: "5px 0 0",
                    fontSize: 23,
                  }}
                >
                  {editingId !== null
                    ? "✏️ Edit Product"
                    : "✨ Add New Product"}
                </h2>
              </div>

              <button
                onClick={() => setShowForm(false)}
                style={modalCloseStyle}
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={saveProduct}
              style={{ padding: 25 }}
            >
              <div
                style={{
                  background: "#f4faf6",
                  border: "1px solid #dcebe1",
                  borderRadius: 13,
                  padding: 18,
                  marginBottom: 18,
                }}
              >
                <h3
                  style={{
                    margin: "0 0 16px",
                    color: "#17683a",
                    fontSize: 15,
                  }}
                >
                  📋 Basic Information
                </h3>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(230px, 1fr))",
                    gap: 15,
                  }}
                >
                  <Field label="Product Name">
                    <input
                      value={form.name}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          name: e.target.value,
                        })
                      }
                      placeholder="Multani Sohan Halwa"
                      style={inputStyle}
                      required
                    />
                  </Field>

                  <Field label="Category">
                    <select
                      value={form.category}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          category: e.target.value,
                        })
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

                  <Field label="Price (Rs.)">
                    <input
                      type="number"
                      min="0"
                      value={form.price}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          price: Number(e.target.value),
                        })
                      }
                      style={inputStyle}
                    />
                  </Field>

                  <Field label="Discount (%)">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={form.discount}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          discount: Number(e.target.value),
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
                      onChange={(e) =>
                        setForm({
                          ...form,
                          stock: Number(e.target.value),
                        })
                      }
                      style={inputStyle}
                    />
                  </Field>

                  <Field label="Weight / Size">
                    <input
                      value={form.weight}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          weight: e.target.value,
                        })
                      }
                      placeholder="500g / 1kg"
                      style={inputStyle}
                    />
                  </Field>

                  <Field label="Status">
                    <select
                      value={form.status}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          status: e.target.value as
                            | "Active"
                            | "Inactive",
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
                      onChange={(e) =>
                        setForm({
                          ...form,
                          image: e.target.value,
                        })
                      }
                      placeholder="🍯"
                      style={inputStyle}
                    />
                  </Field>
                </div>
              </div>

              {/* IMAGE AREA */}
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #f7f3ff, #f1f6ff)",
                  border: "1px solid #dddff0",
                  borderRadius: 13,
                  padding: 18,
                  marginBottom: 18,
                }}
              >
                <h3
                  style={{
                    margin: "0 0 6px",
                    color: "#4b4d82",
                    fontSize: 15,
                  }}
                >
                  🖼️ Product Images
                </h3>

                <p
                  style={{
                    margin: "0 0 14px",
                    color: "#777b91",
                    fontSize: 12,
                  }}
                >
                  Image upload/storage will be connected with the
                  product API later.
                </p>

                <div
                  style={{
                    border: "2px dashed #c8cbe0",
                    borderRadius: 12,
                    padding: 24,
                    textAlign: "center",
                    background: "rgba(255,255,255,0.7)",
                  }}
                >
                  <div style={{ fontSize: 35 }}>📷</div>

                  <strong
                    style={{
                      display: "block",
                      marginTop: 7,
                      color: "#4e5472",
                    }}
                  >
                    Product image area ready
                  </strong>

                  <span
                    style={{
                      display: "block",
                      marginTop: 5,
                      color: "#85899c",
                      fontSize: 12,
                    }}
                  >
                    Multiple image upload will be connected next.
                  </span>
                </div>
              </div>

              {/* DETAILS */}
              <div
                style={{
                  background: "#fff9ef",
                  border: "1px solid #f0e2c8",
                  borderRadius: 13,
                  padding: 18,
                }}
              >
                <h3
                  style={{
                    margin: "0 0 16px",
                    color: "#9a6500",
                    fontSize: 15,
                  }}
                >
                  📝 Product Details
                </h3>

                <Field label="Description">
                  <textarea
                    rows={4}
                    value={form.description}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        description: e.target.value,
                      })
                    }
                    placeholder="Describe this product..."
                    style={{
                      ...inputStyle,
                      resize: "vertical",
                    }}
                  />
                </Field>

                <div style={{ height: 14 }} />

                <Field label="Ingredients">
                  <textarea
                    rows={3}
                    value={form.ingredients}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        ingredients: e.target.value,
                      })
                    }
                    placeholder="Milk, sugar, ghee, nuts..."
                    style={{
                      ...inputStyle,
                      resize: "vertical",
                    }}
                  />
                </Field>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 10,
                  marginTop: 22,
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  style={{
                    padding: "12px 19px",
                    borderRadius: 9,
                    border: "1px solid #d6dfd9",
                    background: "#fff",
                    cursor: "pointer",
                    fontWeight: 800,
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  style={{
                    padding: "12px 22px",
                    borderRadius: 9,
                    border: 0,
                    background:
                      "linear-gradient(135deg, #126638, #19944e)",
                    color: "#fff",
                    cursor: "pointer",
                    fontWeight: 900,
                    boxShadow:
                      "0 6px 15px rgba(18,102,56,0.22)",
                  }}
                >
                  ✓{" "}
                  {editingId !== null
                    ? "Save Changes"
                    : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {viewProduct && (
        <div style={overlayStyle}>
          <div
            style={{
              width: "min(560px, 94vw)",
              background: "#fff",
              borderRadius: 20,
              overflow: "hidden",
              boxShadow: "0 25px 80px rgba(0,0,0,0.25)",
            }}
          >
            <div
              style={{
                background:
                  "linear-gradient(135deg, #0f5b32, #19934e)",
                color: "#fff",
                padding: 30,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 65 }}>
                {viewProduct.image}
              </div>

              <h2 style={{ margin: "10px 0 5px" }}>
                {viewProduct.name}
              </h2>

              <span style={{ opacity: 0.8 }}>
                {viewProduct.category}
              </span>
            </div>

            <div style={{ padding: 25 }}>
              <DetailRow
                label="Price"
                value={`Rs. ${viewProduct.price.toLocaleString()}`}
              />

              <DetailRow
                label="Discount"
                value={`${viewProduct.discount}%`}
              />

              <DetailRow
                label="Stock"
                value={String(viewProduct.stock)}
              />

              <DetailRow
                label="Weight / Size"
                value={viewProduct.weight || "-"}
              />

              <DetailRow
                label="Status"
                value={viewProduct.status}
              />

              <DetailRow
                label="Rating"
                value={`⭐ ${viewProduct.rating}`}
              />

              <h4 style={{ marginBottom: 5 }}>
                Description
              </h4>

              <p
                style={{
                  color: "#6f7b74",
                  lineHeight: 1.6,
                  fontSize: 13,
                }}
              >
                {viewProduct.description || "No description."}
              </p>

              <h4 style={{ marginBottom: 5 }}>
                Ingredients
              </h4>

              <p
                style={{
                  color: "#6f7b74",
                  lineHeight: 1.6,
                  fontSize: 13,
                }}
              >
                {viewProduct.ingredients || "No ingredients."}
              </p>

              <button
                onClick={() => setViewProduct(null)}
                style={{
                  width: "100%",
                  padding: 12,
                  marginTop: 10,
                  border: 0,
                  borderRadius: 9,
                  background: "#176b3a",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: 900,
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteProduct && (
        <div style={overlayStyle}>
          <div
            style={{
              width: "min(430px, 92vw)",
              background: "#fff",
              borderRadius: 20,
              padding: 30,
              textAlign: "center",
              boxShadow: "0 25px 80px rgba(0,0,0,0.25)",
            }}
          >
            <div
              style={{
                width: 70,
                height: 70,
                margin: "0 auto",
                borderRadius: "50%",
                background: "#fff0f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 34,
              }}
            >
              🗑️
            </div>

            <h2 style={{ margin: "17px 0 8px" }}>
              Remove Product?
            </h2>

            <p
              style={{
                color: "#737e77",
                fontSize: 14,
                lineHeight: 1.6,
              }}
            >
              Are you sure you want to remove{" "}
              <strong>{deleteProduct.name}</strong>?
            </p>

            <div
              style={{
                display: "flex",
                gap: 10,
                marginTop: 22,
              }}
            >
              <button
                onClick={() => setDeleteProduct(null)}
                style={{
                  flex: 1,
                  padding: 12,
                  borderRadius: 9,
                  border: "1px solid #d6dfd9",
                  background: "#fff",
                  cursor: "pointer",
                  fontWeight: 800,
                }}
              >
                Cancel
              </button>

              <button
                onClick={removeProduct}
                style={{
                  flex: 1,
                  padding: 12,
                  borderRadius: 9,
                  border: 0,
                  background: "#c62828",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: 900,
                }}
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
  background,
}: {
  icon: string;
  title: string;
  value: number;
  text: string;
  background: string;
}) {
  return (
    <div
      style={{
        background,
        border: "1px solid #dce9e0",
        borderRadius: 16,
        padding: 21,
        boxShadow: "0 8px 25px rgba(26, 76, 47, 0.07)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            color: "#65736b",
            fontSize: 12,
            fontWeight: 800,
          }}
        >
          {title}
        </span>

        <span
          style={{
            fontSize: 25,
            background: "rgba(255,255,255,0.75)",
            borderRadius: 10,
            padding: 7,
          }}
        >
          {icon}
        </span>
      </div>

      <div
        style={{
          fontSize: 30,
          fontWeight: 900,
          marginTop: 13,
          color: "#183a28",
        }}
      >
        {value}
      </div>

      <div
        style={{
          color: "#829088",
          fontSize: 11,
          marginTop: 4,
        }}
      >
        {text}
      </div>
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
    <button
      onClick={onClick}
      style={{
        border: "1px solid #d5e2d9",
        background: "#f8fbf9",
        color: "#28583b",
        padding: "7px 9px",
        borderRadius: 7,
        cursor: "pointer",
        fontSize: 11,
        fontWeight: 900,
      }}
    >
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
    <label
      style={{
        display: "block",
        fontSize: 12,
        fontWeight: 800,
        color: "#43554b",
      }}
    >
      <span
        style={{
          display: "block",
          marginBottom: 7,
        }}
      >
        {label}
      </span>

      {children}
    </label>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 20,
        padding: "11px 0",
        borderBottom: "1px solid #edf1ee",
        fontSize: 13,
      }}
    >
      <span style={{ color: "#78847d" }}>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

const headerStyle: React.CSSProperties = {
  padding: "14px 16px",
  textAlign: "left",
  color: "#66746c",
  fontSize: 11,
  textTransform: "uppercase",
  letterSpacing: 0.5,
};

const cellStyle: React.CSSProperties = {
  padding: "16px",
  borderTop: "1px solid #edf1ee",
  fontSize: 13,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px 13px",
  borderRadius: 9,
  border: "1px solid #d5e1d9",
  background: "#fff",
  fontSize: 13,
  outline: "none",
};

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 100,
  background: "rgba(12, 31, 20, 0.62)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 20,
};

const modalCloseStyle: React.CSSProperties = {
  width: 38,
  height: 38,
  borderRadius: 9,
  border: "1px solid rgba(255,255,255,0.25)",
  background: "rgba(255,255,255,0.12)",
  color: "#fff",
  cursor: "pointer",
  fontWeight: 900,
  fontSize: 15,
};