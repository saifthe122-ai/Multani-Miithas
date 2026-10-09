"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Bell,
  Building2,
  Calculator,
  Check,
  CreditCard,
  Globe,
  Package,
  RotateCcw,
  Save,
  Search,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Truck,
  Users,
  Wallet,
  X,
} from "lucide-react";

type SettingValue = string | boolean;

type SettingField = {
  key: string;
  label: string;
  type?: "text" | "email" | "tel" | "url" | "number" | "textarea" | "select" | "toggle";
  placeholder?: string;
  help?: string;
  options?: string[];
  min?: number;
};

type SettingSection = {
  id: string;
  title: string;
  description: string;
  fields: SettingField[];
};

const STORAGE_KEY = "multani-mithas-admin-settings-v1";

const sections: SettingSection[] = [
  {
    id: "business",
    title: "Business Profile",
    description: "Brand identity and business contact details.",
    fields: [
      { key: "businessName", label: "Business name", placeholder: "Multani Mithas" },
      { key: "tagline", label: "Business tagline", placeholder: "Traditional Pakistani sweets and bakery" },
      { key: "logoUrl", label: "Logo URL", type: "url", placeholder: "https://example.com/logo.png", help: "Paste an image URL. File upload is not included in this version." },
      { key: "businessEmail", label: "Business email", type: "email", placeholder: "hello@example.com" },
      { key: "businessPhone", label: "Business phone", type: "tel", placeholder: "+92..." },
      { key: "whatsappNumber", label: "WhatsApp number", type: "tel", placeholder: "923001234567" },
      { key: "address", label: "Business address", type: "textarea", placeholder: "Street, area, city, country" },
      { key: "businessHours", label: "Business hours", placeholder: "Mon–Sat, 9 AM–9 PM" },
    ],
  },
  {
    id: "products",
    title: "Products & Inventory",
    description: "Product display, units and stock preferences.",
    fields: [
      { key: "defaultCurrency", label: "Default currency", type: "select", options: ["PKR", "USD", "GBP", "EUR", "AED", "SAR"] },
      { key: "weightUnit", label: "Product weight unit", type: "select", options: ["g / kg", "oz / lb"] },
      { key: "lowStockThreshold", label: "Low-stock threshold", type: "number", min: 0 },
      { key: "hideOutOfStock", label: "Hide out-of-stock products", type: "toggle" },
      { key: "showBestSellers", label: "Show best sellers", type: "toggle" },
      { key: "showFeatured", label: "Show featured products", type: "toggle" },
    ],
  },
  {
    id: "orders",
    title: "Orders & Checkout",
    description: "Order numbering and checkout preferences.",
    fields: [
      { key: "orderPrefix", label: "Order number prefix", placeholder: "MM-" },
      { key: "minimumOrder", label: "Minimum order amount (PKR)", type: "number", min: 0 },
      { key: "guestCheckout", label: "Allow guest checkout", type: "toggle" },
      { key: "requireEmail", label: "Require customer email", type: "toggle" },
      { key: "requirePhone", label: "Require customer phone", type: "toggle" },
      { key: "allowOrderCancellation", label: "Allow cancellation requests", type: "toggle" },
      { key: "orderConfirmationMessage", label: "Order confirmation message", type: "textarea", placeholder: "Thank you for ordering from Multani Mithas." },
    ],
  },
  {
    id: "payments",
    title: "Payments",
    description: "Select payment methods to offer at checkout.",
    fields: [
      { key: "paymentCOD", label: "Cash on Delivery", type: "toggle" },
      { key: "paymentBank", label: "Bank transfer / Raast", type: "toggle" },
      { key: "paymentJazzCash", label: "JazzCash", type: "toggle" },
      { key: "paymentEasypaisa", label: "Easypaisa", type: "toggle" },
      { key: "paymentInternational", label: "International payments", type: "toggle" },
      { key: "bankPaymentInstructions", label: "Bank payment instructions", type: "textarea", placeholder: "Enter verified payment instructions." },
      { key: "refundPolicy", label: "Refund policy summary", type: "textarea", placeholder: "Describe your refund process." },
    ],
  },
  {
    id: "delivery",
    title: "Delivery & Riders",
    description: "Delivery charges, estimates and tracking preferences.",
    fields: [
      { key: "deliveryFee", label: "Default delivery fee (PKR)", type: "number", min: 0 },
      { key: "freeDeliveryMinimum", label: "Free delivery threshold (PKR)", type: "number", min: 0 },
      { key: "deliveryEstimate", label: "Estimated delivery time", placeholder: "1–3 business days" },
      { key: "deliveryCountries", label: "Delivery countries", placeholder: "Pakistan" },
      { key: "enableRiderAssignment", label: "Enable rider assignment preference", type: "toggle" },
      { key: "enableTracking", label: "Enable tracking preference", type: "toggle" },
    ],
  },
  {
    id: "customers",
    title: "Customers & Accounts",
    description: "Customer account and privacy preferences.",
    fields: [
      { key: "customerAccounts", label: "Allow customer accounts", type: "toggle" },
      { key: "emailVerification", label: "Require email verification", type: "toggle" },
      { key: "saveCustomerAddresses", label: "Allow saved addresses", type: "toggle" },
      { key: "privacyContact", label: "Privacy contact email", type: "email", placeholder: "privacy@example.com" },
      { key: "privacyPolicyUrl", label: "Privacy policy URL", type: "url", placeholder: "https://example.com/privacy" },
    ],
  },
  {
    id: "notifications",
    title: "Notifications",
    description: "Preferences for order, payment and stock alerts.",
    fields: [
      { key: "notifyNewOrders", label: "New order alerts", type: "toggle" },
      { key: "notifyPayments", label: "Payment status alerts", type: "toggle" },
      { key: "notifyDelivery", label: "Delivery status alerts", type: "toggle" },
      { key: "notifyLowStock", label: "Low-stock alerts", type: "toggle" },
      { key: "notifyComplaints", label: "Complaint alerts", type: "toggle" },
      { key: "notificationEmail", label: "Admin notification email", type: "email", placeholder: "admin@example.com" },
      { key: "whatsappAlerts", label: "WhatsApp alert preference", type: "toggle", help: "Sending messages requires a configured WhatsApp provider." },
    ],
  },
  {
    id: "website",
    title: "Website & Marketing",
    description: "Website metadata and social media links.",
    fields: [
      { key: "websiteTitle", label: "Website title", placeholder: "Multani Mithas | Premium Pakistani Sweets" },
      { key: "websiteDescription", label: "Website description", type: "textarea", placeholder: "Describe your business for search engines." },
      { key: "websiteUrl", label: "Website URL", type: "url", placeholder: "https://example.com" },
      { key: "whatsappUrl", label: "WhatsApp link", type: "url", placeholder: "https://wa.me/..." },
      { key: "facebookUrl", label: "Facebook URL", type: "url", placeholder: "https://facebook.com/..." },
      { key: "instagramUrl", label: "Instagram URL", type: "url", placeholder: "https://instagram.com/..." },
      { key: "youtubeUrl", label: "YouTube URL", type: "url", placeholder: "https://youtube.com/..." },
      { key: "tiktokUrl", label: "TikTok URL", type: "url", placeholder: "https://tiktok.com/@..." },
      { key: "linkedinUrl", label: "LinkedIn URL", type: "url", placeholder: "https://linkedin.com/..." },
      { key: "xUrl", label: "X / Twitter URL", type: "url", placeholder: "https://x.com/..." },
      { key: "maintenanceMode", label: "Maintenance mode preference", type: "toggle", help: "This preference alone does not take the public website offline." },
    ],
  },
  {
    id: "security",
    title: "Staff & Security",
    description: "Security preferences. Real access control must be enforced on the server.",
    fields: [
      { key: "sessionTimeout", label: "Preferred session timeout (minutes)", type: "number", min: 5 },
      { key: "loginAlerts", label: "Login alert preference", type: "toggle" },
      { key: "auditLogPreference", label: "Admin activity log preference", type: "toggle" },
      { key: "securityContact", label: "Security contact email", type: "email", placeholder: "security@example.com" },
    ],
  },
  {
    id: "accounting",
    title: "Accounting & Invoices",
    description: "Invoice numbering and reporting preferences.",
    fields: [
      { key: "invoicePrefix", label: "Invoice number prefix", placeholder: "MM-INV-" },
      { key: "invoiceTerms", label: "Default invoice terms", type: "select", options: ["Due on receipt", "Net 7", "Net 14", "Net 30"] },
      { key: "financialYearStart", label: "Financial year starts", type: "select", options: ["January", "April", "July", "October"] },
      { key: "accountingTaxNote", label: "Tax notes", type: "textarea", placeholder: "Add applicable tax notes." },
      { key: "enableExpenseAlerts", label: "Expense review reminders", type: "toggle" },
    ],
  },
  {
    id: "regional",
    title: "Regional & System",
    description: "Time zone, date and number formatting.",
    fields: [
      { key: "timeZone", label: "Time zone", type: "select", options: ["Asia/Karachi", "UTC", "Europe/London", "America/New_York", "Asia/Dubai"] },
      { key: "dateFormat", label: "Date format", type: "select", options: ["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"] },
      { key: "language", label: "Dashboard language", type: "select", options: ["English", "Urdu"] },
      { key: "numberFormat", label: "Number format", type: "select", options: ["1,234.56", "1.234,56"] },
      { key: "backupReminder", label: "Backup reminder preference", type: "toggle" },
    ],
  },
];

const defaults: Record<string, SettingValue> = {
  businessName: "Multani Mithas",
  tagline: "Traditional Pakistani sweets and bakery",
  logoUrl: "",
  businessEmail: "",
  businessPhone: "",
  whatsappNumber: "",
  address: "",
  businessHours: "Mon–Sat, 9:00 AM–9:00 PM",
  defaultCurrency: "PKR",
  weightUnit: "g / kg",
  lowStockThreshold: "5",
  hideOutOfStock: true,
  showBestSellers: true,
  showFeatured: true,
  orderPrefix: "MM-",
  minimumOrder: "0",
  guestCheckout: true,
  requireEmail: false,
  requirePhone: true,
  allowOrderCancellation: true,
  orderConfirmationMessage: "Thank you for ordering from Multani Mithas.",
  paymentCOD: true,
  paymentBank: true,
  paymentJazzCash: false,
  paymentEasypaisa: false,
  paymentInternational: false,
  bankPaymentInstructions: "",
  refundPolicy: "",
  deliveryFee: "0",
  freeDeliveryMinimum: "0",
  deliveryEstimate: "1–3 business days",
  deliveryCountries: "Pakistan",
  enableRiderAssignment: true,
  enableTracking: false,
  customerAccounts: true,
  emailVerification: false,
  saveCustomerAddresses: true,
  privacyContact: "",
  privacyPolicyUrl: "",
  notifyNewOrders: true,
  notifyPayments: true,
  notifyDelivery: true,
  notifyLowStock: true,
  notifyComplaints: true,
  notificationEmail: "",
  whatsappAlerts: false,
  websiteTitle: "Multani Mithas | Premium Pakistani Sweets",
  websiteDescription: "",
  websiteUrl: "https://multani-miithas.vercel.app",
  whatsappUrl: "",
  facebookUrl: "",
  instagramUrl: "",
  youtubeUrl: "",
  tiktokUrl: "",
  linkedinUrl: "",
  xUrl: "",
  maintenanceMode: false,
  sessionTimeout: "30",
  loginAlerts: true,
  auditLogPreference: true,
  securityContact: "",
  invoicePrefix: "MM-INV-",
  invoiceTerms: "Due on receipt",
  financialYearStart: "July",
  accountingTaxNote: "",
  enableExpenseAlerts: true,
  timeZone: "Asia/Karachi",
  dateFormat: "DD/MM/YYYY",
  language: "English",
  numberFormat: "1,234.56",
  backupReminder: true,
};

const sectionIcons: Record<string, typeof Building2> = {
  business: Building2,
  products: Package,
  orders: ShoppingBag,
  payments: CreditCard,
  delivery: Truck,
  customers: Users,
  notifications: Bell,
  website: Globe,
  security: ShieldCheck,
  accounting: Calculator,
  regional: SlidersHorizontal,
};

export default function SettingsPage() {
  const [values, setValues] = useState<Record<string, SettingValue>>(defaults);
  const [savedValues, setSavedValues] = useState<Record<string, SettingValue>>(defaults);
  const [activeSection, setActiveSection] = useState("business");
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          const merged = { ...defaults, ...(parsed as Record<string, SettingValue>) };
          setValues(merged);
          setSavedValues(merged);
        }
      }
    } catch {
      setNotice("Saved browser settings could not be read. Default settings are shown.");
    } finally {
      setLoaded(true);
    }
  }, []);

  const filteredSections = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return sections;
    return sections
      .map((section) => ({
        ...section,
        fields: section.fields.filter((field) =>
          `${field.label} ${field.placeholder ?? ""} ${field.help ?? ""} ${section.title}`.toLowerCase().includes(query)
        ),
      }))
      .filter((section) => section.fields.length > 0);
  }, [search]);

  useEffect(() => {
    if (search.trim() && filteredSections.length > 0) {
      if (!filteredSections.some((section) => section.id === activeSection)) {
        setActiveSection(filteredSections[0].id);
      }
    }
  }, [search, filteredSections, activeSection]);

  const active =
    filteredSections.find((section) => section.id === activeSection) ??
    filteredSections[0];

  const changed = JSON.stringify(values) !== JSON.stringify(savedValues);
  const enabledCount = Object.values(values).filter((value) => value === true).length;

  function updateValue(key: string, value: SettingValue) {
    setValues((current) => ({ ...current, [key]: value }));
    setNotice("");
  }

  function saveSettings() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
      setSavedValues({ ...values });
      setNotice("Settings saved in this browser.");
    } catch {
      setNotice("Could not save settings in this browser. Check browser storage settings.");
    }
  }

  function resetSection() {
    if (!active) return;
    const resetValues = { ...values };
    active.fields.forEach((field) => {
      resetValues[field.key] = defaults[field.key] ?? "";
    });
    setValues(resetValues);
    setNotice("Section reset. Click Save Changes to keep these defaults.");
  }

  function renderField(field: SettingField) {
    const value = values[field.key] ?? "";

    const commonStyle: React.CSSProperties = {
      width: "100%",
      boxSizing: "border-box",
      border: "1px solid #d9deea",
      borderRadius: 10,
      padding: "11px 12px",
      color: "#252a3d",
      background: "#fff",
      outlineColor: "#6755d9",
      fontSize: 14,
    };

    if (field.type === "toggle") {
      return (
        <button
          type="button"
          role="switch"
          aria-label={field.label}
          aria-checked={value === true}
          onClick={() => updateValue(field.key, value !== true)}
          style={{
            width: 48,
            height: 28,
            border: 0,
            borderRadius: 99,
            padding: 3,
            background: value === true ? "#6755d9" : "#cbd1df",
            cursor: "pointer",
            display: "flex",
            justifyContent: value === true ? "flex-end" : "flex-start",
            alignItems: "center",
          }}
        >
          <span style={{ width: 22, height: 22, borderRadius: "50%", background: "#fff", boxShadow: "0 1px 3px #0002" }} />
        </button>
      );
    }

    if (field.type === "textarea") {
      return (
        <textarea
          id={`setting-${field.key}`}
          value={String(value)}
          onChange={(event) => updateValue(field.key, event.target.value)}
          placeholder={field.placeholder}
          rows={3}
          style={{ ...commonStyle, resize: "vertical", minHeight: 82 }}
        />
      );
    }

    if (field.type === "select") {
      return (
        <select
          id={`setting-${field.key}`}
          value={String(value)}
          onChange={(event) => updateValue(field.key, event.target.value)}
          style={commonStyle}
        >
          {(field.options ?? []).map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      );
    }

    return (
      <input
        id={`setting-${field.key}`}
        type={field.type ?? "text"}
        value={String(value)}
        min={field.min}
        onChange={(event) => updateValue(field.key, event.target.value)}
        placeholder={field.placeholder}
        style={commonStyle}
      />
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "#f4f5fb", color: "#22263b", padding: "24px 16px", fontFamily: "Arial, Helvetica, sans-serif" }}>
      <div style={{ maxWidth: 1440, margin: "0 auto" }}>
        <header style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 18, marginBottom: 24 }}>
          <div>
            <p style={{ color: "#6755d9", fontWeight: 800, letterSpacing: 1.5, fontSize: 11, margin: "0 0 9px" }}>MULTANI MITHAS · ADMIN CONTROL CENTER</p>
            <h1 style={{ fontSize: 32, lineHeight: 1.2, margin: "0 0 8px", letterSpacing: -0.7 }}>Settings</h1>
            <p style={{ margin: 0, color: "#737b91", fontSize: 14, lineHeight: 1.6 }}>Manage your business preferences from one place.</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 9 }}>
            <a href="/admin" style={{ display: "inline-block", textDecoration: "none", padding: "11px 14px", borderRadius: 10, border: "1px solid #d9deea", background: "#fff", color: "#343950", fontWeight: 700, fontSize: 13 }}>← Admin Dashboard</a>
            <button type="button" onClick={() => { setValues({ ...savedValues }); setNotice("Unsaved changes discarded."); }} disabled={!changed} style={{ padding: "11px 14px", borderRadius: 10, border: "1px solid #d9deea", background: "#fff", color: "#343950", fontWeight: 700, cursor: changed ? "pointer" : "not-allowed", opacity: changed ? 1 : 0.5, fontSize: 13 }}>Discard changes</button>
            <button type="button" onClick={saveSettings} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 16px", borderRadius: 10, border: "1px solid #6755d9", background: "#6755d9", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 13 }}><Save size={16} /> Save Changes</button>
          </div>
        </header>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 13, marginBottom: 20 }}>
          {[
            { label: "Settings sections", value: sections.length, icon: SlidersHorizontal },
            { label: "Available preferences", value: sections.reduce((sum, section) => sum + section.fields.length, 0), icon: Activity },
            { label: "Enabled options", value: enabledCount, icon: Check },
            { label: "Save status", value: changed ? "Unsaved" : loaded ? "Saved" : "Loading", icon: Wallet },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} style={{ background: "#fff", border: "1px solid #e5e8f0", borderRadius: 15, padding: 17, boxShadow: "0 4px 14px #20243a06" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "#737b91", fontSize: 12, gap: 8 }}><span>{item.label}</span><Icon size={18} color="#6755d9" /></div>
                <div style={{ fontSize: typeof item.value === "number" ? 28 : 21, fontWeight: 800, marginTop: 11 }}>{item.value}</div>
              </div>
            );
          })}
        </section>

        {notice && <div role="status" style={{ marginBottom: 16, border: "1px solid #d8d3ff", background: "#f0edff", color: "#493a9e", borderRadius: 11, padding: "12px 14px", fontSize: 13 }}>{notice}</div>}

        <div style={{ display: "grid", gridTemplateColumns: "minmax(230px, 280px) minmax(0, 1fr)", gap: 18, alignItems: "start" }}>
          <aside style={{ background: "#fff", border: "1px solid #e5e8f0", borderRadius: 15, padding: 13 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9, border: "1px solid #dfe3ed", borderRadius: 10, padding: "0 10px", marginBottom: 12 }}>
              <Search size={17} color="#737b91" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search settings..." aria-label="Search settings" style={{ minWidth: 0, width: "100%", border: 0, outline: 0, padding: "12px 0", fontSize: 13, color: "#22263b", background: "transparent" }} />
              {search && <button type="button" onClick={() => setSearch("")} aria-label="Clear search" style={{ border: 0, background: "transparent", cursor: "pointer", padding: 3 }}><X size={15} /></button>}
            </div>
            <div style={{ display: "grid", gap: 4 }}>
              {filteredSections.map((section) => {
                const Icon = sectionIcons[section.id] ?? SlidersHorizontal;
                const selected = active?.id === section.id;
                return (
                  <button key={section.id} type="button" onClick={() => setActiveSection(section.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "11px 10px", border: 0, borderRadius: 9, background: selected ? "#efedff" : "transparent", color: selected ? "#5543c0" : "#515970", fontWeight: selected ? 800 : 600, textAlign: "left", cursor: "pointer", fontSize: 13 }}>
                    <Icon size={17} /><span style={{ flex: 1 }}>{section.title}</span><span style={{ fontSize: 11, opacity: 0.7 }}>{section.fields.length}</span>
                  </button>
                );
              })}
              {filteredSections.length === 0 && <p style={{ color: "#737b91", fontSize: 13, padding: 10 }}>No settings found.</p>}
            </div>
          </aside>

          <section style={{ minWidth: 0, background: "#fff", border: "1px solid #e5e8f0", borderRadius: 15, padding: 20, boxShadow: "0 4px 14px #20243a06" }}>
            {active ? (
              <>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap", borderBottom: "1px solid #edf0f5", paddingBottom: 17, marginBottom: 19 }}>
                  <div>
                    <h2 style={{ fontSize: 21, margin: "0 0 7px" }}>{active.title}</h2>
                    <p style={{ color: "#737b91", fontSize: 13, lineHeight: 1.6, margin: 0 }}>{active.description}</p>
                  </div>
                  <button type="button" onClick={resetSection} style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 11px", border: "1px solid #dfe3ed", borderRadius: 9, background: "#fff", color: "#515970", fontWeight: 700, fontSize: 12, cursor: "pointer" }}><RotateCcw size={14} /> Reset section</button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18 }}>
                  {active.fields.map((field) => (
                    <div key={field.key} style={{ minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 8 }}>
                        <label htmlFor={`setting-${field.key}`} style={{ color: "#343950", fontSize: 13, fontWeight: 700 }}>{field.label}</label>
                        {field.type === "toggle" && <span style={{ fontSize: 11, fontWeight: 700, color: values[field.key] === true ? "#18794e" : "#737b91" }}>{values[field.key] === true ? "ON" : "OFF"}</span>}
                      </div>
                      {renderField(field)}
                      {field.help && <p style={{ color: "#81889a", fontSize: 11, lineHeight: 1.5, margin: "7px 0 0" }}>{field.help}</p>}
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 24, borderTop: "1px solid #edf0f5", paddingTop: 17, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <p style={{ color: "#737b91", fontSize: 12, margin: 0 }}>{active.fields.length} settings in this section</p>
                  <button type="button" onClick={saveSettings} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 16px", borderRadius: 10, border: "1px solid #6755d9", background: "#6755d9", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 13 }}><Save size={15} /> Save section changes</button>
                </div>
              </>
            ) : (
              <div style={{ padding: 30, textAlign: "center", color: "#737b91" }}>Choose a settings section or change your search.</div>
            )}
          </section>
        </div>

        <footer style={{ display: "flex", alignItems: "flex-start", gap: 11, marginTop: 19, border: "1px solid #f0dca9", background: "#fff9e9", borderRadius: 12, padding: 15, color: "#765a16", fontSize: 12, lineHeight: 1.7 }}>
          <ShieldCheck size={20} style={{ flexShrink: 0, marginTop: 1 }} />
          <p style={{ margin: 0 }}><strong>Important:</strong> Settings currently save in this browser only. They are not shared between devices and do not automatically change checkout, payments, delivery, notifications or security enforcement. Those features require a secured backend and persistent database. Never enter payment secret keys or passwords here.</p>
        </footer>
      </div>
    </main>
  );
}