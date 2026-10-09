"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type InventoryItem = {
  id: number;
  sku: string;
  name: string;
  category: string;
  quantity: number;
  unitCost: number;
  reorderLevel: number;
};

const initialItems: InventoryItem[] = [
  { id: 1, sku: "INV-1001", name: "Sohan Halwa", category: "Sweets", quantity: 100, unitCost: 650, reorderLevel: 20 },
  { id: 2, sku: "INV-1002", name: "Pista Barfi", category: "Sweets", quantity: 45, unitCost: 900, reorderLevel: 15 },
  { id: 3, sku: "INV-1003", name: "Gulab Jamun", category: "Sweets", quantity: 12, unitCost: 450, reorderLevel: 15 },
  { id: 4, sku: "INV-1004", name: "Besan Ladoo", category: "Sweets", quantity: 30, unitCost: 500, reorderLevel: 10 },
  { id: 5, sku: "INV-1005", name: "Cake Box", category: "Bakery", quantity: 8, unitCost: 1200, reorderLevel: 10 },
  { id: 6, sku: "INV-1006", name: "Gift Box", category: "Packaging", quantity: 25, unitCost: 700, reorderLevel: 8 },
];

const money = (amount: number) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(amount);

export default function InventoryCostPage() {
  const [items, setItems] = useState<InventoryItem[]>(initialItems);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [stockFilter, setStockFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    sku: "",
    name: "",
    category: "Sweets",
    quantity: "0",
    unitCost: "0",
    reorderLevel: "10",
  });

  const inventoryValue = items.reduce(
    (total, item) => total + item.quantity * item.unitCost,
    0
  );

  const totalUnits = items.reduce((total, item) => total + item.quantity, 0);

  const lowStockCount = items.filter(
    (item) => item.quantity <= item.reorderLevel
  ).length;

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.sku.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        categoryFilter === "All" || item.category === categoryFilter;

      const matchesStock =
        stockFilter === "All" ||
        (stockFilter === "Low Stock" &&
          item.quantity <= item.reorderLevel) ||
        (stockFilter === "In Stock" &&
          item.quantity > item.reorderLevel);

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [items, search, categoryFilter, stockFilter]);

  function openAddForm() {
    setEditingId(null);
    setForm({
      sku: `INV-${Date.now().toString().slice(-6)}`,
      name: "",
      category: "Sweets",
      quantity: "0",
      unitCost: "0",
      reorderLevel: "10",
    });
    setShowForm(true);
    setMessage("");
  }

  function openEditForm(item: InventoryItem) {
    setEditingId(item.id);
    setForm({
      sku: item.sku,
      name: item.name,
      category: item.category,
      quantity: String(item.quantity),
      unitCost: String(item.unitCost),
      reorderLevel: String(item.reorderLevel),
    });
    setShowForm(true);
    setMessage("");
  }

  function saveItem(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const quantity = Number(form.quantity);
    const unitCost = Number(form.unitCost);
    const reorderLevel = Number(form.reorderLevel);

    if (
      !form.sku.trim() ||
      !form.name.trim() ||
      !Number.isFinite(quantity) ||
      !Number.isFinite(unitCost) ||
      !Number.isFinite(reorderLevel) ||
      quantity < 0 ||
      unitCost < 0 ||
      reorderLevel < 0
    ) {
      setMessage("Please enter valid item details and non-negative numbers.");
      return;
    }

    if (editingId !== null) {
      setItems((current) =>
        current.map((item) =>
          item.id === editingId
            ? {
                ...item,
                sku: form.sku.trim(),
                name: form.name.trim(),
                category: form.category,
                quantity,
                unitCost,
                reorderLevel,
              }
            : item
        )
      );
      setMessage("Inventory item updated successfully.");
    } else {
      setItems((current) => [
        ...current,
        {
          id: Math.max(0, ...current.map((item) => item.id)) + 1,
          sku: form.sku.trim(),
          name: form.name.trim(),
          category: form.category,
          quantity,
          unitCost,
          reorderLevel,
        },
      ]);
      setMessage("Inventory item added successfully.");
    }

    setShowForm(false);
  }

  function deleteItem(item: InventoryItem) {
    const confirmed = window.confirm(
      `Delete "${item.name}" from inventory?`
    );

    if (!confirmed) return;

    setItems((current) => current.filter((entry) => entry.id !== item.id));
    setMessage(`${item.name} deleted from inventory.`);
  }

  function exportCSV() {
    const header = [
      "SKU",
      "Product",
      "Category",
      "Quantity",
      "Unit Cost PKR",
      "Total Cost PKR",
      "Reorder Level",
      "Stock Status",
    ];

    const rows = filteredItems.map((item) => [
      item.sku,
      item.name,
      item.category,
      item.quantity,
      item.unitCost,
      item.quantity * item.unitCost,
      item.reorderLevel,
      item.quantity <= item.reorderLevel ? "Low Stock" : "In Stock",
    ]);

    const csv = [header, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "inventory-cost-report.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  const buttonStyle: React.CSSProperties = {
    padding: "9px 13px",
    borderRadius: 8,
    border: "1px solid #d1d5db",
    background: "#ffffff",
    color: "#111827",
    cursor: "pointer",
    fontWeight: 600,
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: 10,
    border: "1px solid #d1d5db",
    borderRadius: 8,
    marginTop: 5,
    boxSizing: "border-box",
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: 24,
        color: "#172033",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: 1250, margin: "0 auto" }}>
        <Link
          href="/admin/accounting"
          style={{
            color: "#374151",
            textDecoration: "none",
            display: "inline-block",
            marginBottom: 18,
          }}
        >
          ← Back to Accounting
        </Link>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 22,
          }}
        >
          <div>
            <h1 style={{ fontSize: 30, margin: "0 0 8px" }}>
              Inventory Cost
            </h1>
            <p style={{ margin: 0, color: "#64748b" }}>
              Track stock quantities, product costs and inventory value.
            </p>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <button onClick={exportCSV} style={buttonStyle}>
              Export CSV
            </button>
            <button
              onClick={openAddForm}
              style={{
                ...buttonStyle,
                background: "#1d4ed8",
                color: "#ffffff",
                borderColor: "#1d4ed8",
              }}
            >
              + Add Inventory Item
            </button>
          </div>
        </div>

        {message && (
          <div
            role="status"
            style={{
              padding: 12,
              marginBottom: 16,
              borderRadius: 8,
              background: "#e8f5e9",
              color: "#166534",
            }}
          >
            {message}
            <button
              onClick={() => setMessage("")}
              style={{
                float: "right",
                border: 0,
                background: "transparent",
                cursor: "pointer",
              }}
              aria-label="Dismiss message"
            >
              ×
            </button>
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
            gap: 16,
            marginBottom: 22,
          }}
        >
          {[
            {
              title: "Total Inventory Value",
              value: money(inventoryValue),
              detail: "Current stock × unit cost",
            },
            {
              title: "Total Stock Units",
              value: totalUnits.toLocaleString(),
              detail: "Units across all products",
            },
            {
              title: "Inventory Items",
              value: items.length.toString(),
              detail: "Products and supplies",
            },
            {
              title: "Low Stock Items",
              value: lowStockCount.toString(),
              detail: "At or below reorder level",
            },
          ].map((card) => (
            <section
              key={card.title}
              style={{
                background: "#ffffff",
                padding: 20,
                borderRadius: 12,
                border: "1px solid #e5e7eb",
                boxShadow: "0 2px 8px rgba(15,23,42,0.04)",
              }}
            >
              <p style={{ margin: "0 0 10px", color: "#64748b" }}>
                {card.title}
              </p>
              <h2 style={{ margin: "0 0 8px", fontSize: 25 }}>
                {card.value}
              </h2>
              <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>
                {card.detail}
              </p>
            </section>
          ))}
        </div>

        {showForm && (
          <section
            style={{
              background: "#ffffff",
              padding: 22,
              borderRadius: 12,
              border: "1px solid #dbeafe",
              marginBottom: 22,
            }}
          >
            <h2 style={{ marginTop: 0 }}>
              {editingId === null ? "Add Inventory Item" : "Edit Inventory Item"}
            </h2>

            <form onSubmit={saveItem}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
                  gap: 14,
                }}
              >
                <label>
                  SKU / Item Code
                  <input
                    style={inputStyle}
                    value={form.sku}
                    onChange={(e) =>
                      setForm({ ...form, sku: e.target.value })
                    }
                    required
                  />
                </label>

                <label>
                  Product Name
                  <input
                    style={inputStyle}
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    required
                  />
                </label>

                <label>
                  Category
                  <select
                    style={inputStyle}
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                  >
                    <option value="Sweets">Sweets</option>
                    <option value="Bakery">Bakery</option>
                    <option value="Packaging">Packaging</option>
                    <option value="Ingredients">Ingredients</option>
                    <option value="Other">Other</option>
                  </select>
                </label>

                <label>
                  Quantity
                  <input
                    style={inputStyle}
                    type="number"
                    min="0"
                    step="1"
                    value={form.quantity}
                    onChange={(e) =>
                      setForm({ ...form, quantity: e.target.value })
                    }
                    required
                  />
                </label>

                <label>
                  Unit Cost (PKR)
                  <input
                    style={inputStyle}
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.unitCost}
                    onChange={(e) =>
                      setForm({ ...form, unitCost: e.target.value })
                    }
                    required
                  />
                </label>

                <label>
                  Reorder Level
                  <input
                    style={inputStyle}
                    type="number"
                    min="0"
                    step="1"
                    value={form.reorderLevel}
                    onChange={(e) =>
                      setForm({ ...form, reorderLevel: e.target.value })
                    }
                    required
                  />
                </label>
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  marginTop: 18,
                }}
              >
                <button
                  type="submit"
                  style={{
                    ...buttonStyle,
                    background: "#1d4ed8",
                    color: "#ffffff",
                    borderColor: "#1d4ed8",
                  }}
                >
                  {editingId === null ? "Save Item" : "Update Item"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  style={buttonStyle}
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        <section
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            padding: 18,
          }}
        >
          <h2 style={{ marginTop: 0, marginBottom: 16 }}>
            Inventory Items
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
              gap: 12,
              marginBottom: 18,
            }}
          >
            <input
              style={{ ...inputStyle, marginTop: 0 }}
              placeholder="Search product or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search inventory"
            />

            <select
              style={{ ...inputStyle, marginTop: 0 }}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label="Filter by category"
            >
              <option value="All">All Categories</option>
              <option value="Sweets">Sweets</option>
              <option value="Bakery">Bakery</option>
              <option value="Packaging">Packaging</option>
              <option value="Ingredients">Ingredients</option>
              <option value="Other">Other</option>
            </select>

            <select
              style={{ ...inputStyle, marginTop: 0 }}
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              aria-label="Filter by stock"
            >
              <option value="All">All Stock Statuses</option>
              <option value="Low Stock">Low Stock</option>
              <option value="In Stock">In Stock</option>
            </select>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: 850,
                textAlign: "left",
              }}
            >
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {[
                    "SKU",
                    "Product",
                    "Category",
                    "Quantity",
                    "Unit Cost",
                    "Total Cost",
                    "Stock Status",
                    "Actions",
                  ].map((heading) => (
                    <th
                      key={heading}
                      style={{
                        padding: 12,
                        borderBottom: "1px solid #e5e7eb",
                        fontSize: 13,
                      }}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredItems.map((item) => {
                  const isLow = item.quantity <= item.reorderLevel;

                  return (
                    <tr key={item.id}>
                      <td style={cellStyle}>{item.sku}</td>
                      <td style={cellStyle}>
                        <strong>{item.name}</strong>
                      </td>
                      <td style={cellStyle}>{item.category}</td>
                      <td style={cellStyle}>{item.quantity}</td>
                      <td style={cellStyle}>{money(item.unitCost)}</td>
                      <td style={cellStyle}>
                        <strong>
                          {money(item.quantity * item.unitCost)}
                        </strong>
                      </td>
                      <td style={cellStyle}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "5px 9px",
                            borderRadius: 20,
                            fontSize: 12,
                            fontWeight: 700,
                            background: isLow ? "#fee2e2" : "#dcfce7",
                            color: isLow ? "#991b1b" : "#166534",
                          }}
                        >
                          {isLow ? "Low Stock" : "In Stock"}
                        </span>
                      </td>
                      <td style={cellStyle}>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button
                            style={buttonStyle}
                            onClick={() => openEditForm(item)}
                          >
                            Edit
                          </button>
                          <button
                            style={{
                              ...buttonStyle,
                              color: "#b91c1c",
                            }}
                            onClick={() => deleteItem(item)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredItems.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      style={{
                        padding: 28,
                        textAlign: "center",
                        color: "#64748b",
                      }}
                    >
                      No inventory items match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <p style={{ color: "#64748b", fontSize: 13, marginBottom: 0 }}>
            Showing {filteredItems.length} of {items.length} items. Inventory
            value is calculated from current quantity multiplied by unit cost.
          </p>
        </section>

        <p
          style={{
            marginTop: 18,
            color: "#64748b",
            fontSize: 12,
          }}
        >
          Demo mode: changes are held in page memory and reset when the page
          refreshes. This dashboard is not yet connected to a database.
        </p>
      </div>
    </main>
  );
}

const cellStyle: React.CSSProperties = {
  padding: 12,
  borderBottom: "1px solid #e5e7eb",
  fontSize: 13,
  verticalAlign: "middle",
};
