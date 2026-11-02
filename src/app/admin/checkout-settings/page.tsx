
"use client";

import { useEffect, useState } from "react";

type CheckoutSettings = {
  deliveryFee: number;
  freeDeliveryMinimum: number;
  salesTaxEnabled: boolean;
  salesTaxRate: number;
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

  async function saveSettings(event: React.FormEvent<HTMLFormElement>) {
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
      setMessage("Settings successfully save ho gayi hain.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Settings save nahi ho sakin."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f5ef] p-6 text-[#123b3a]">
        Settings load ho rahi hain...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f5ef] p-4 text-[#123b3a] sm:p-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#a47b35]">
            Multani Mithas
          </p>
          <h1 className="mt-2 text-3xl font-bold">
            Checkout Settings
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Delivery charges aur sales tax manage karein.
          </p>
        </div>

        <form
          onSubmit={saveSettings}
          className="space-y-6 rounded-2xl border border-[#e6dfcf] bg-white p-5 shadow-sm sm:p-8"
        >
          <section>
            <h2 className="text-lg font-bold">Delivery Charges</h2>
            <p className="mb-4 mt-1 text-sm text-gray-500">
              Customer ke order par delivery fee set karein.
            </p>

            <label className="mb-2 block text-sm font-medium">
              Delivery Fee (PKR)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={settings.deliveryFee}
              onChange={(event) =>
                updateSetting("deliveryFee", Number(event.target.value))
              }
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#a47b35]"
              required
            />

            <label className="mb-2 mt-5 block text-sm font-medium">
              Free Delivery Minimum (PKR)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={settings.freeDeliveryMinimum}
              onChange={(event) =>
                updateSetting(
                  "freeDeliveryMinimum",
                  Number(event.target.value)
                )
              }
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#a47b35]"
              required
            />
            <p className="mt-2 text-xs text-gray-500">
              0 rakhne par free delivery threshold apply nahi hoga.
            </p>
          </section>

          <div className="border-t border-gray-200" />

          <section>
            <h2 className="text-lg font-bold">Sales Tax</h2>
            <label className="mt-4 flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={settings.salesTaxEnabled}
                onChange={(event) =>
                  updateSetting("salesTaxEnabled", event.target.checked)
                }
                className="h-5 w-5 accent-[#a47b35]"
              />
              <span className="text-sm font-medium">
                Enable sales tax
              </span>
            </label>

            <label className="mb-2 mt-5 block text-sm font-medium">
              Sales Tax Rate (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.001"
              value={settings.salesTaxRate}
              onChange={(event) =>
                updateSetting("salesTaxRate", Number(event.target.value))
              }
              disabled={!settings.salesTaxEnabled}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#a47b35] disabled:bg-gray-100"
              required
            />
          </section>

          {message && (
            <p
              role="status"
              className="rounded-xl bg-[#f7f5ef] p-3 text-sm"
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-[#123b3a] px-6 py-3 font-semibold text-white transition hover:bg-[#1b5552] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Checkout Settings"}
          </button>
        </form>
      </div>
    </main>
  );
}
