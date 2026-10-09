"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";

type StaffRole = "Owner" | "Manager" | "Accountant" | "Sales" | "Delivery";

type StaffMember = {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: StaffRole;
  status: "Active" | "Inactive";
  permissions: string[];
};

const allPermissions = [
  "View Dashboard",
  "Manage Orders",
  "Manage Products",
  "Manage Customers",
  "Manage Delivery",
  "View Reports",
  "Manage Accounting",
  "Manage Staff",
  "Manage Settings",
];

const initialStaff: StaffMember[] = [
  {
    id: 1,
    name: "Business Owner",
    email: "owner@example.com",
    phone: "",
    role: "Owner",
    status: "Active",
    permissions: [...allPermissions],
  },
  {
    id: 2,
    name: "Accounts Staff",
    email: "accounts@example.com",
    phone: "",
    role: "Accountant",
    status: "Active",
    permissions: [
      "View Dashboard",
      "View Reports",
      "Manage Accounting",
    ],
  },
  {
    id: 3,
    name: "Delivery Staff",
    email: "delivery@example.com",
    phone: "",
    role: "Delivery",
    status: "Active",
    permissions: ["View Dashboard", "Manage Delivery", "Manage Orders"],
  },
];

const roleOptions: StaffRole[] = [
  "Owner",
  "Manager",
  "Accountant",
  "Sales",
  "Delivery",
];

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  role: "Sales" as StaffRole,
  status: "Active" as "Active" | "Inactive",
  permissions: ["View Dashboard"],
};

export default function StaffPermissionsPage() {
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");

  const filteredStaff = useMemo(() => {
    return staff.filter((member) => {
      const term = search.toLowerCase();

      const matchesSearch =
        member.name.toLowerCase().includes(term) ||
        member.email.toLowerCase().includes(term) ||
        member.phone.toLowerCase().includes(term);

      const matchesRole =
        roleFilter === "All" || member.role === roleFilter;

      const matchesStatus =
        statusFilter === "All" || member.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [staff, search, roleFilter, statusFilter]);

  const activeCount = staff.filter(
    (member) => member.status === "Active"
  ).length;

  const inactiveCount = staff.length - activeCount;

  function openAddForm() {
    setEditingId(null);
    setForm({ ...emptyForm, permissions: ["View Dashboard"] });
    setShowForm(true);
    setMessage("");
  }

  function openEditForm(member: StaffMember) {
    setEditingId(member.id);
    setForm({
      name: member.name,
      email: member.email,
      phone: member.phone,
      role: member.role,
      status: member.status,
      permissions: [...member.permissions],
    });
    setShowForm(true);
    setMessage("");
  }

  function togglePermission(permission: string) {
    setForm((current) => ({
      ...current,
      permissions: current.permissions.includes(permission)
        ? current.permissions.filter((item) => item !== permission)
        : [...current.permissions, permission],
    }));
  }

  function applyRolePermissions(role: StaffRole) {
    let permissions: string[] = ["View Dashboard"];

    if (role === "Owner") {
      permissions = [...allPermissions];
    } else if (role === "Manager") {
      permissions = [
        "View Dashboard",
        "Manage Orders",
        "Manage Products",
        "Manage Customers",
        "Manage Delivery",
        "View Reports",
      ];
    } else if (role === "Accountant") {
      permissions = [
        "View Dashboard",
        "View Reports",
        "Manage Accounting",
      ];
    } else if (role === "Sales") {
      permissions = [
        "View Dashboard",
        "Manage Orders",
        "Manage Customers",
      ];
    } else if (role === "Delivery") {
      permissions = [
        "View Dashboard",
        "Manage Delivery",
        "Manage Orders",
      ];
    }

    setForm((current) => ({
      ...current,
      role,
      permissions,
    }));
  }

  function saveStaff(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.name.trim() || !form.email.trim()) {
      setMessage("Please enter the staff member's name and email.");
      return;
    }

    const duplicateEmail = staff.some(
      (member) =>
        member.email.toLowerCase() === form.email.trim().toLowerCase() &&
        member.id !== editingId
    );

    if (duplicateEmail) {
      setMessage("This email is already used by another staff member.");
      return;
    }

    if (editingId !== null) {
      const existing = staff.find((member) => member.id === editingId);

      if (existing?.role === "Owner" && form.role !== "Owner") {
        setMessage(
          "Demo safety: the existing Owner role cannot be changed here."
        );
        return;
      }

      setStaff((current) =>
        current.map((member) =>
          member.id === editingId
            ? {
                ...member,
                name: form.name.trim(),
                email: form.email.trim(),
                phone: form.phone.trim(),
                role: form.role,
                status: form.status,
                permissions:
                  form.role === "Owner"
                    ? [...allPermissions]
                    : [...form.permissions],
              }
            : member
        )
      );

      setMessage("Staff member updated successfully.");
    } else {
      if (form.role === "Owner") {
        setMessage(
          "A new Owner cannot be created from this demo form. Choose another role."
        );
        return;
      }

      setStaff((current) => [
        ...current,
        {
          id: Math.max(0, ...current.map((member) => member.id)) + 1,
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          role: form.role,
          status: form.status,
          permissions: [...form.permissions],
        },
      ]);

      setMessage("Staff member added successfully.");
    }

    setShowForm(false);
  }

  function deleteStaff(member: StaffMember) {
    if (member.role === "Owner") {
      setMessage("The Owner account cannot be deleted from this dashboard.");
      return;
    }

    if (!window.confirm(`Delete staff member "${member.name}"?`)) return;

    setStaff((current) =>
      current.filter((entry) => entry.id !== member.id)
    );

    setMessage(`${member.name} has been deleted.`);
  }

  function exportCSV() {
    const header = [
      "Name",
      "Email",
      "Phone",
      "Role",
      "Status",
      "Permissions",
    ];

    const rows = filteredStaff.map((member) => [
      member.name,
      member.email,
      member.phone,
      member.role,
      member.status,
      member.permissions.join("; "),
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
    anchor.download = "staff-permissions.csv";
    anchor.click();
    URL.revokeObjectURL(url);
    setMessage("Staff report exported.");
  }

  const buttonStyle: React.CSSProperties = {
    padding: "9px 12px",
    border: "1px solid #d1d5db",
    borderRadius: 8,
    background: "#ffffff",
    color: "#172033",
    cursor: "pointer",
    fontWeight: 600,
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    padding: 10,
    marginTop: 6,
    border: "1px solid #d1d5db",
    borderRadius: 8,
    background: "#ffffff",
  };

  const cardStyle: React.CSSProperties = {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: 20,
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
          href="/admin"
          style={{
            display: "inline-block",
            marginBottom: 18,
            textDecoration: "none",
            color: "#374151",
          }}
        >
          ← Back to Admin Dashboard
        </Link>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
            marginBottom: 24,
          }}
        >
          <div>
            <h1 style={{ margin: "0 0 8px", fontSize: 30 }}>
              Staff & Permissions
            </h1>
            <p style={{ margin: 0, color: "#64748b" }}>
              Manage staff records, roles and assigned permissions.
            </p>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button onClick={exportCSV} style={buttonStyle}>
              Export CSV
            </button>
            <button
              onClick={openAddForm}
              style={{
                ...buttonStyle,
                background: "#1d4ed8",
                borderColor: "#1d4ed8",
                color: "#ffffff",
              }}
            >
              + Add Staff
            </button>
          </div>
        </div>

        {message && (
          <div
            role="status"
            style={{
              padding: 12,
              borderRadius: 8,
              background: "#e0f2fe",
              color: "#075985",
              marginBottom: 18,
            }}
          >
            {message}
            <button
              onClick={() => setMessage("")}
              aria-label="Dismiss message"
              style={{
                float: "right",
                border: 0,
                background: "transparent",
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
            gap: 16,
            marginBottom: 22,
          }}
        >
          {[
            { title: "Total Staff", value: staff.length },
            { title: "Active Staff", value: activeCount },
            { title: "Inactive Staff", value: inactiveCount },
            {
              title: "Available Permissions",
              value: allPermissions.length,
            },
          ].map((item) => (
            <section key={item.title} style={cardStyle}>
              <p style={{ margin: "0 0 10px", color: "#64748b" }}>
                {item.title}
              </p>
              <h2 style={{ margin: 0, fontSize: 30 }}>{item.value}</h2>
            </section>
          ))}
        </div>

        {showForm && (
          <section style={{ ...cardStyle, marginBottom: 22 }}>
            <h2 style={{ marginTop: 0 }}>
              {editingId === null ? "Add Staff Member" : "Edit Staff Member"}
            </h2>

            <form onSubmit={saveStaff}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
                  gap: 14,
                }}
              >
                <label>
                  Full Name *
                  <input
                    style={inputStyle}
                    value={form.name}
                    onChange={(event) =>
                      setForm({ ...form, name: event.target.value })
                    }
                    required
                  />
                </label>

                <label>
                  Email Address *
                  <input
                    style={inputStyle}
                    type="email"
                    value={form.email}
                    onChange={(event) =>
                      setForm({ ...form, email: event.target.value })
                    }
                    required
                  />
                </label>

                <label>
                  Phone Number
                  <input
                    style={inputStyle}
                    value={form.phone}
                    onChange={(event) =>
                      setForm({ ...form, phone: event.target.value })
                    }
                  />
                </label>

                <label>
                  Staff Role
                  <select
                    style={inputStyle}
                    value={form.role}
                    onChange={(event) =>
                      applyRolePermissions(event.target.value as StaffRole)
                    }
                  >
                    {roleOptions
                      .filter((role) => role !== "Owner" || editingId !== null)
                      .map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                  </select>
                </label>

                <label>
                  Account Status
                  <select
                    style={inputStyle}
                    value={form.status}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        status: event.target.value as "Active" | "Inactive",
                      })
                    }
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </label>
              </div>

              <h3 style={{ marginTop: 24 }}>Assigned Permissions</h3>
              <p style={{ color: "#64748b", fontSize: 13 }}>
                Select the areas this staff member should be allowed to access.
                These selections are demo records and do not enforce real
                website security.
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 10,
                }}
              >
                {allPermissions.map((permission) => (
                  <label
                    key={permission}
                    style={{
                      display: "flex",
                      gap: 9,
                      alignItems: "center",
                      border: "1px solid #e5e7eb",
                      borderRadius: 8,
                      padding: 12,
                      background: "#f8fafc",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={
                        form.role === "Owner" ||
                        form.permissions.includes(permission)
                      }
                      disabled={form.role === "Owner"}
                      onChange={() => togglePermission(permission)}
                    />
                    {permission}
                  </label>
                ))}
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  marginTop: 20,
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
                  {editingId === null ? "Save Staff Member" : "Update Staff"}
                </button>
                <button
                  type="button"
                  style={buttonStyle}
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        <section style={cardStyle}>
          <h2 style={{ marginTop: 0 }}>Staff Directory</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 12,
              marginBottom: 18,
            }}
          >
            <input
              style={inputStyle}
              placeholder="Search name, email or phone..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            <select
              style={inputStyle}
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value)}
            >
              <option value="All">All Roles</option>
              {roleOptions.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>

            <select
              style={inputStyle}
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                minWidth: 850,
                borderCollapse: "collapse",
                textAlign: "left",
              }}
            >
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {[
                    "Staff Member",
                    "Contact",
                    "Role",
                    "Permissions",
                    "Status",
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
                {filteredStaff.map((member) => (
                  <tr key={member.id}>
                    <td style={cellStyle}>
                      <strong>{member.name}</strong>
                    </td>
                    <td style={cellStyle}>
                      <div>{member.email}</div>
                      <div style={{ color: "#64748b", marginTop: 4 }}>
                        {member.phone || "No phone added"}
                      </div>
                    </td>
                    <td style={cellStyle}>{member.role}</td>
                    <td style={cellStyle}>
                      {member.permissions.length} assigned
                    </td>
                    <td style={cellStyle}>
                      <span
                        style={{
                          padding: "5px 9px",
                          borderRadius: 20,
                          fontSize: 12,
                          fontWeight: 700,
                          background:
                            member.status === "Active" ? "#dcfce7" : "#fee2e2",
                          color:
                            member.status === "Active" ? "#166534" : "#991b1b",
                        }}
                      >
                        {member.status}
                      </span>
                    </td>
                    <td style={cellStyle}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          style={buttonStyle}
                          onClick={() => openEditForm(member)}
                        >
                          Edit
                        </button>
                        <button
                          style={{ ...buttonStyle, color: "#b91c1c" }}
                          onClick={() => deleteStaff(member)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredStaff.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      style={{ padding: 24, textAlign: "center" }}
                    >
                      No staff members match these filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <p style={{ color: "#64748b", fontSize: 12, marginBottom: 0 }}>
            Showing {filteredStaff.length} of {staff.length} staff members.
          </p>
        </section>

        <p style={{ color: "#64748b", fontSize: 12, marginTop: 18 }}>
          Demo only: staff records reset when this page refreshes. Real login,
          secure permissions and database storage must be configured separately
          before using this for actual staff access.
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
