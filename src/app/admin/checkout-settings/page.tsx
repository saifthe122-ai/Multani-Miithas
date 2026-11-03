
"use client";

import { useEffect, useState } from "react";
import type { CSSProperties, FormEvent } from "react";

type CheckoutSettings = {
  deliveryFee: number;
  freeDeliveryMinimum: number;
  salesTaxEnabled: boolean;
  salesTaxRate: number;
};

const colors = {
  background: "#f4f7f5",
  green: "#104d36",
  gold: "#b58a43",
  text: "#17251d",
  muted: "#718078",
  border: "#e1e8e3",
  white: "#ffffff",
};

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "13px 15px",
  border: `1px solid ${colors.border}`,
  borderRadius: "9px",
  background: "#ffffff",
  color: colors.text,
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle: CSSProperties = {
  display: "block",
  marginBottom: "8px",
  fontSize: "13px",
  fontWeight: 700,
  color: colors.text,
};

export default function CheckoutSettingsPage() {
  const [settings, setSettings] = useState<CheckoutSettings>({
    deliveryFee: 0,
    freeDeliveryMinimum: 0,
    salesTaxEnabled: false,
    salesTaxRate: 0,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success"
  );

  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await fetch("/api/checkout-settings", {
          cache: "no-store",
        });
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Settings load nahi ho sakin.");
        }

        setSettings(data.settings);
      } catch (error) {
        setMessage(
          error instanceof Error
            ? error.message
            : "Settings load nahi ho sakin."
        );
        setMessageType("error");
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  function updateSetting(
    field: keyof CheckoutSettings,
    value: number | boolean
  ) {
    setSettings((current) => ({ ...current, [field]: value }));
  }

  async function saveSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/checkout-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Settings save nahi ho sakin.");
      }

      setSettings(data.settings);
      setMessage("Checkout settings successfully save ho gayi hain.");
      setMessageType("success");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Settings save nahi ho sakin."
      );
      setMessageType("error");
    } finally {
      setSaving(false);
    }
  }

  const cardStyle: CSSProperties = {
    background: colors.white,
    border: `1px solid ${colors.border}`,
    borderRadius: "15px",
    padding: "24px",
    boxShadow: "0 3px 12px rgba(15,23,42,.04)",
  };

  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          padding: "35px",
          background: colors.background,
          color: colors.green,
          fontFamily: "Arial, sans-serif",
        }}
      >
        Checkout settings load ho rahi hain...
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "25px",
        background: colors.background,
        color: colors.text,
        fontFamily: "Arial, sans-serif",
        boxSizing: "border-box",
      }}
    >
      <div style={{ maxWidth: "1050px", margin: "0 auto" }}>
        <header
          style={{
            background: colors.green,
            color: colors.white,
            borderRadius: "16px",
            padding: "27px 30px",
            marginBottom: "25px",
            borderBottom: `4px solid ${colors.gold}`,
          }}
        >
          <div
            style={{
              color: "#d9c18f",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "2px",
              marginBottom: "10px",
            }}
          >
            MULTANI MITHAS · BUSINESS CONTROL CENTER
          </div>

          <h1 style={{ fontSize: "28px", fontWeight: 800, margin: 0 }}>
            Checkout Settings
          </h1>

          <p
            style={{
              color: "#d3e7dc",
              fontSize: "13px",
              margin: "9px 0 0",
            }}
          >
            Manage delivery charges and sales tax for customer orders.
          </p>
        </header>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "15px",
            marginBottom: "22px",
          }}
        >
          <div style={cardStyle}>
            <div style={{ color: colors.muted, fontSize: "12px" }}>
              Current Delivery Fee
            </div>
            <div
              style={{
                color: colors.green,
                fontSize: "25px",
                fontWeight: 800,
                marginTop: "9px",
              }}
            >
              Rs. {settings.deliveryFee.toLocaleString("en-PK")}
            </div>
          </div>

          <div style={cardStyle}>
            <div style={{ color: colors.muted, fontSize: "12px" }}>
              Free Delivery Minimum
            </div>
            <div
              style={{
                color: colors.green,
                fontSize: "25px",
                fontWeight: 800,
                marginTop: "9px",
              }}
            >
              Rs. {settings.freeDeliveryMinimum.toLocaleString("en-PK")}
            </div>
          </div>

          <div style={cardStyle}>
            <div style={{ color: colors.muted, fontSize: "12px" }}>
              Sales Tax Status
            </div>
            <div
              style={{
                color: settings.salesTaxEnabled ? "#15803d" : "#9a6b25",
                fontSize: "20px",
                fontWeight: 800,
                marginTop: "12px",
              }}
            >
              {settings.salesTaxEnabled ? "Enabled" : "Disabled"}
            </div>
          </div>
        </div>

        <form onSubmit={saveSettings} style={cardStyle}>
          <section>
            <div style={{ marginBottom: "22px" }}>
              <div
                style={{
                  color: colors.gold,
                  fontSize: "11px",
                  fontWeight: 800,
                  letterSpacing: "1.5px",
                }}
              >
                DELIVERY MANAGEMENT
              </div>
              <h2
                style={{
                  color: colors.green,
                  fontSize: "20px",
                  fontWeight: 800,
                  margin: "7px 0",
                }}
              >
                Delivery Charges
              </h2>
              <p style={{ color: colors.muted, fontSize: "13px", margin: 0 }}>
                Set the delivery fee and free delivery order threshold.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "20px",
              }}
            >
              <div>
                <label htmlFor="deliveryFee" style={labelStyle}>
                  Delivery Fee (PKR)
                </label>
                <input
                  id="deliveryFee"
                  type="number"
                  min="0"
                  max="1000000"
                  step="0.01"
                  value={settings.deliveryFee}
                  onChange={(event) =>
                    updateSetting("deliveryFee", Number(event.target.value))
                  }
                  style={inputStyle}
                  required
                />
                <p style={{ color: colors.muted, fontSize: "11px" }}>
                  Standard delivery charge per order.
                </p>
              </div>

              <div>
                <label htmlFor="freeDeliveryMinimum" style={labelStyle}>
                  Free Delivery Minimum (PKR)
                </label>
                <input
                  id="freeDeliveryMinimum"
                  type="number"
                  min="0"
                  max="100000000"
                  step="0.01"
                  value={settings.freeDeliveryMinimum}
                  onChange={(event) =>
                    updateSetting(
                      "freeDeliveryMinimum",
                      Number(event.target.value)
                    )
                  }
                  style={inputStyle}
                  required
                />
                <p style={{ color: colors.muted, fontSize: "11px" }}>
                  0 rakhne par free delivery threshold apply nahi hoga.
                </p>
              </div>
            </div>
          </section>

          <div
            style={{
              height: "1px",
              background: colors.border,
              margin: "28px 0",
            }}
          />

          <section>
            <div style={{ marginBottom: "20px" }}>
              <div
                style={{
                  color: colors.gold,
                  fontSize: "11px",
                  fontWeight: 800,
                  letterSpacing: "1.5px",
                }}
              >
                TAX MANAGEMENT
              </div>
              <h2
                style={{
                  color: colors.green,
                  fontSize: "20px",
                  fontWeight: 800,
                  margin: "7px 0",
                }}
              >
                Sales Tax
              </h2>
              <p style={{ color: colors.muted, fontSize: "13px", margin: 0 }}>
                Enable or disable sales tax for checkout.
              </p>
            </div>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "16px",
                background: "#f4f7f5",
                border: `1px solid ${colors.border}`,
                borderRadius: "10px",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={settings.salesTaxEnabled}
                onChange={(event) =>
                  updateSetting("salesTaxEnabled", event.target.checked)
                }
                style={{
                  width: "19px",
                  height: "19px",
                  accentColor: colors.green,
                }}
              />
              <span style={{ fontSize: "13px", fontWeight: 700 }}>
                Enable sales tax
              </span>
            </label>

            <div style={{ marginTop: "20px", maxWidth: "420px" }}>
              <label htmlFor="salesTaxRate" style={labelStyle}>
                Sales Tax Rate (%)
              </label>
              <input
                id="salesTaxRate"
                type="number"
                min="0"
                max="100"
                step="0.001"
                value={settings.salesTaxRate}
                onChange={(event) =>
                  updateSetting("salesTaxRate", Number(event.target.value))
                }
                disabled={!settings.salesTaxEnabled}
                style={{
                  ...inputStyle,
                  background: settings.salesTaxEnabled ? "#fff" : "#f1f3f2",
                  cursor: settings.salesTaxEnabled ? "text" : "not-allowed",
                }}
                required
              />
              <p style={{ color: colors.muted, fontSize: "11px" }}>
                Tax rate 0 se 100 percent ke darmiyan enter karein.
              </p>
            </div>
          </section>

          {message && (
            <div
              role="status"
              style={{
                marginTop: "25px",
                padding: "14px 16px",
                borderRadius: "9px",
                background: messageType === "success" ? "#e9f5ed" : "#fff0ed",
                color: messageType === "success" ? "#166534" : "#b42318",
                border: `1px solid ${
                  messageType === "success" ? "#bbdfc5" : "#f2c5bd"
                }`,
                fontSize: "13px",
              }}
            >
              {message}
            </div>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "28px",
              paddingTop: "20px",
              borderTop: `1px solid ${colors.border}`,
            }}
          >
            <button
              type="submit"
              disabled={saving}
              style={{
                background: saving ? "#789087" : colors.green,
                color: "#fff",
                border: `1px solid ${colors.gold}`,
                borderRadius: "9px",
                padding: "14px 25px",
                fontSize: "13px",
                fontWeight: 800,
                cursor: saving ? "not-allowed" : "pointer",
                width: "100%",
                maxWidth: "260px",
              }}
            >
              {saving ? "Saving..." : "Save Checkout Settings"}
            </button>
          </div>
        </form>

        <p
          style={{
            color: colors.muted,
            fontSize: "11px",
            textAlign: "center",
            marginTop: "20px",
          }}
        >
          Multani Mithas · Business Control Center
        </p>
      </div>
    </main>
  );
}
