
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type PaymentMethod = {
  id: string;
  methodKey: string;
  name: string;
  description: string;
  enabled: boolean;
  type: string;
  provider: string;
  instructions: string;
};

type BusinessAccount = {
  id: string;
  accountName: string;
  accountType: string;
  provider: string;
  accountTitle: string;
  accountNumber: string;
  iban: string;
  currency: string;
  isPrimary: boolean;
  isActive: boolean;
};

type PaymentRecord = {
  id: string;
  orderId: string;
  customer: string;
  amount: number;
  method: string;
  status:
    | "Pending"
    | "Paid"
    | "Failed"
    | "Cancelled"
    | "Refunded"
    | "Partially Refunded";
  transactionId: string;
  date: string;
};

const cardStyle = {
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: 16,
  padding: 20,
  boxShadow: "0 6px 20px rgba(0,0,0,.06)",
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box" as const,
  padding: "12px 13px",
  borderRadius: 9,
  border: "1px solid #d1d5db",
  fontSize: 14,
  marginTop: 6,
};

const buttonStyle = {
  border: "none",
  borderRadius: 9,
  padding: "11px 16px",
  cursor: "pointer",
  fontWeight: 700,
};

export default function PaymentsDashboard() {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [accounts, setAccounts] = useState<BusinessAccount[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  const [accountName, setAccountName] = useState("");
  const [accountType, setAccountType] = useState("wallet");
  const [provider, setProvider] = useState("JazzCash");
  const [accountTitle, setAccountTitle] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [iban, setIban] = useState("");
  const [currency, setCurrency] = useState("PKR");
  const [isPrimary, setIsPrimary] = useState(false);

  async function loadPaymentSettings() {
    try {
      setLoading(true);

      const response = await fetch("/api/admin/payments", {
        cache: "no-store",
      });
      const payload = await response.json();

      if (!response.ok || payload.success !== true) {
        throw new Error(payload.error || "Payment settings load nahi huin.");
      }

      setMethods(
        (Array.isArray(payload.methods) ? payload.methods : []).map(
          (item: Record<string, unknown>) => ({
            id: String(item.id),
            methodKey: String(item.method_key ?? ""),
            name: String(item.name ?? ""),
            description: String(item.description ?? ""),
            enabled: Boolean(item.is_enabled),
            type: String(item.payment_type ?? "manual"),
            provider: String(item.provider ?? ""),
            instructions: String(item.instructions ?? ""),
          })
        )
      );

      setAccounts(
        (Array.isArray(payload.accounts) ? payload.accounts : []).map(
          (item: Record<string, unknown>) => ({
            id: String(item.id),
            accountName: String(item.account_name ?? ""),
            accountType: String(item.account_type ?? ""),
            provider: String(item.provider ?? ""),
            accountTitle: String(item.account_title ?? ""),
            accountNumber: String(item.account_number ?? ""),
            iban: String(item.iban ?? ""),
            currency: String(item.currency ?? "PKR"),
            isPrimary: Boolean(item.is_primary),
            isActive: Boolean(item.is_active),
          })
        )
      );
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : "Payment settings load nahi huin."
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadPayments() {
    try {
      const response = await fetch("/api/orders", {
        cache: "no-store",
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Orders load nahi huay.");
      }

      const rows = Array.isArray(payload.orders) ? payload.orders : [];

      setPayments(
        rows.map((order: Record<string, unknown>, index: number) => {
          const paymentStatus = String(
            order.payment_status ?? order.paymentStatus ?? "pending"
          ).toLowerCase();

          const statusMap: Record<string, PaymentRecord["status"]> = {
            paid: "Paid",
            failed: "Failed",
            cancelled: "Cancelled",
            refunded: "Refunded",
            partially_refunded: "Partially Refunded",
            "partially refunded": "Partially Refunded",
          };

          return {
            id: String(order.id ?? order.order_number ?? index),
            orderId: String(
              order.order_number ?? order.orderNumber ?? order.id ?? "—"
            ),
            customer: String(
              order.customer_name ?? order.customerName ?? "Customer"
            ),
            amount: Number(
              order.total ?? order.total_amount ?? order.amount ?? 0
            ),
            method: String(
              order.payment_method ?? order.paymentMethod ?? "Unknown"
            ),
            status: statusMap[paymentStatus] ?? "Pending",
            transactionId: "—",
            date: String(order.created_at ?? order.createdAt ?? "—"),
          };
        })
      );
    } catch (error) {
      console.error("Payments loading failed:", error);
    }
  }

  useEffect(() => {
    loadPaymentSettings();
    loadPayments();
  }, []);

  async function toggleMethod(method: PaymentMethod) {
    try {
      const response = await fetch("/api/admin/payments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_method",
          id: Number(method.id),
          isEnabled: !method.enabled,
        }),
      });

      const result = await response.json();

      if (!response.ok || result.success !== true) {
        throw new Error(result.error || "Payment method update nahi hua.");
      }

      setMethods((current) =>
        current.map((item) =>
          item.id === method.id
            ? { ...item, enabled: !item.enabled }
            : item
        )
      );

      setNotice(`${method.name} ka status database mein save ho gaya.`);
    } catch (error) {
      setNotice(
        error instanceof Error ? error.message : "Update failed."
      );
    }
  }

  async function addAccount(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!accountName.trim() || !accountTitle.trim()) {
      setNotice("Account name aur account title zaroori hain.");
      return;
    }

    if (!accountNumber.trim() && !iban.trim()) {
      setNotice("Account number ya IBAN mein se ek zaroor dein.");
      return;
    }

    try {
      setSaving(true);
      setNotice("");

      const response = await fetch("/api/admin/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_account",
          accountName: accountName.trim(),
          accountType,
          provider: provider.trim(),
          accountTitle: accountTitle.trim(),
          accountNumber: accountNumber.trim(),
          iban: iban.trim(),
          currency,
          isPrimary,
        }),
      });

      const result = await response.json();

      if (!response.ok || result.success !== true) {
        throw new Error(result.error || "Account save nahi hua.");
      }

      setAccountName("");
      setAccountTitle("");
      setAccountNumber("");
      setIban("");
      setIsPrimary(false);

      await loadPaymentSettings();
      setNotice("Business payment account database mein save ho gaya.");
    } catch (error) {
      setNotice(
        error instanceof Error ? error.message : "Account save nahi hua."
      );
    } finally {
      setSaving(false);
    }
  }

  async function updateAccount(
    account: BusinessAccount,
    changes: { isActive?: boolean; isPrimary?: boolean }
  ) {
    try {
      const response = await fetch("/api/admin/payments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_account",
          id: Number(account.id),
          ...changes,
        }),
      });

      const result = await response.json();

      if (!response.ok || result.success !== true) {
        throw new Error(result.error || "Account update nahi hua.");
      }

      await loadPaymentSettings();
      setNotice("Account settings database mein save ho gayi hain.");
    } catch (error) {
      setNotice(
        error instanceof Error ? error.message : "Account update nahi hua."
      );
    }
  }

  async function updatePaymentStatus(
    payment: PaymentRecord,
    status: PaymentRecord["status"]
  ) {
    const paymentStatusMap: Record<string, string> = {
      Pending: "pending",
      Paid: "paid",
      Failed: "failed",
      Cancelled: "cancelled",
      Refunded: "refunded",
      "Partially Refunded": "partially_refunded",
    };

    try {
      const response = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNumber: payment.orderId,
          paymentStatus: paymentStatusMap[status],
        }),
      });

      const result = await response.json();

      if (!response.ok || result.success !== true) {
        throw new Error(result.message || result.error || "Status save nahi hua.");
      }

      setPayments((current) =>
        current.map((item) =>
          item.id === payment.id ? { ...item, status } : item
        )
      );

      setNotice("Payment status database mein save ho gaya.");
    } catch (error) {
      setNotice(
        error instanceof Error ? error.message : "Payment status save nahi hua."
      );
    }
  }

  const money = (value: number) =>
    `Rs. ${value.toLocaleString("en-PK")}`;

  const enabledMethods = methods.filter((item) => item.enabled).length;
  const paidPayments = payments.filter((item) => item.status === "Paid");
  const pendingPayments = payments.filter(
    (item) => item.status === "Pending"
  );
  const totalPaid = paidPayments.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const filteredPayments = payments.filter((item) => {
    const value = search.toLowerCase();
    return (
      item.orderId.toLowerCase().includes(value) ||
      item.customer.toLowerCase().includes(value) ||
      item.method.toLowerCase().includes(value) ||
      item.status.toLowerCase().includes(value)
    );
  });

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f7f9",
        padding: 28,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <Link
          href="/admin"
          style={{
            display: "inline-block",
            marginBottom: 18,
            color: "#166534",
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          ← Back to Admin Dashboard
        </Link>

        <header
          style={{
            background: "linear-gradient(135deg,#123b3a,#176b61)",
            color: "#fff",
            borderRadius: 20,
            padding: 28,
            marginBottom: 24,
          }}
        >
          <div style={{ fontSize: 12, opacity: 0.8 }}>
            MULTANI MITHAS / FINANCE
          </div>
          <h1 style={{ margin: "6px 0 0", fontSize: 30 }}>
            Payments Management
          </h1>
          <p style={{ margin: "8px 0 0", opacity: 0.9 }}>
            Manage business accounts, payment methods and customer transactions.
          </p>
        </header>

        {notice && (
          <div
            style={{
              ...cardStyle,
              marginBottom: 20,
              background: "#fffbeb",
              borderColor: "#fcd34d",
            }}
          >
            {notice}
            <button
              onClick={() => setNotice("")}
              style={{ ...buttonStyle, float: "right", padding: "2px 8px" }}
            >
              ×
            </button>
          </div>
        )}

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))",
            gap: 16,
            marginBottom: 24,
          }}
        >
          {[
            ["Payment Methods", methods.length],
            ["Enabled Methods", enabledMethods],
            ["Business Accounts", accounts.length],
            ["Paid Transactions", paidPayments.length],
            ["Pending Payments", pendingPayments.length],
            ["Paid Amount", money(totalPaid)],
          ].map(([title, value]) => (
            <div key={String(title)} style={cardStyle}>
              <div style={{ color: "#6b7280", fontSize: 13 }}>{title}</div>
              <div
                style={{
                  fontSize: 27,
                  fontWeight: 800,
                  marginTop: 9,
                  color: "#111827",
                }}
              >
                {value}
              </div>
            </div>
          ))}
        </section>

        {/* BUSINESS PAYMENT ACCOUNTS */}
        <section style={{ ...cardStyle, marginBottom: 24 }}>
          <h2 style={{ marginTop: 0 }}>My Business Payment Accounts</h2>
          <p style={{ color: "#6b7280" }}>
            Yahan apne business ke JazzCash, Easypaisa, Raast aur bank accounts
            add karo. Customer ko sirf account title aur payment details dikhayi
            jayengi.
          </p>

          <form
            onSubmit={addAccount}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
              gap: 16,
              marginTop: 20,
            }}
          >
            <label>
              Account Name *
              <input
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                placeholder="Example: Main JazzCash Account"
                style={inputStyle}
                required
              />
            </label>

            <label>
              Account Type *
              <select
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
                style={inputStyle}
              >
                <option value="wallet">Mobile Wallet</option>
                <option value="bank">Bank Account</option>
                <option value="raast">Raast</option>
                <option value="other">Other</option>
              </select>
            </label>

            <label>
              Provider
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                style={inputStyle}
              >
                <option>JazzCash</option>
                <option>Easypaisa</option>
                <option>Raast</option>
                <option>Bank</option>
                <option>Other</option>
              </select>
            </label>

            <label>
              Account Title *
              <input
                value={accountTitle}
                onChange={(e) => setAccountTitle(e.target.value)}
                placeholder="Name shown on transfer"
                style={inputStyle}
                required
              />
            </label>

            <label>
              Account Number
              <input
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Wallet or bank account number"
                style={inputStyle}
              />
            </label>

            <label>
              IBAN
              <input
                value={iban}
                onChange={(e) => setIban(e.target.value)}
                placeholder="PK..."
                style={inputStyle}
              />
            </label>

            <label>
              Currency
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                style={inputStyle}
              >
                <option value="PKR">PKR</option>
                <option value="USD">USD</option>
                <option value="GBP">GBP</option>
                <option value="AED">AED</option>
                <option value="EUR">EUR</option>
              </select>
            </label>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                paddingTop: 25,
              }}
            >
              <input
                type="checkbox"
                checked={isPrimary}
                onChange={(e) => setIsPrimary(e.target.checked)}
              />
              Set as primary account
            </label>

            <div style={{ gridColumn: "1 / -1" }}>
              <button
                type="submit"
                disabled={saving}
                style={{
                  ...buttonStyle,
                  background: "#145b50",
                  color: "#fff",
                  opacity: saving ? 0.6 : 1,
                }}
              >
                {saving ? "Saving..." : "Save Business Account"}
              </button>
            </div>
          </form>

          <hr style={{ border: 0, borderTop: "1px solid #e5e7eb", margin: "25px 0" }} />

          <h3>Saved Business Accounts</h3>

          {loading ? (
            <p>Accounts load ho rahe hain...</p>
          ) : accounts.length === 0 ? (
            <p style={{ color: "#6b7280" }}>
              Abhi koi business account add nahi hua.
            </p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
                gap: 14,
              }}
            >
              {accounts.map((account) => (
                <div
                  key={account.id}
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: 13,
                    padding: 17,
                    background: account.isActive ? "#f0fdf4" : "#fafafa",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 8,
                    }}
                  >
                    <strong>{account.accountName}</strong>
                    {account.isPrimary && (
                      <span style={{ color: "#166534", fontSize: 12 }}>
                        Primary
                      </span>
                    )}
                  </div>

                  <p style={{ marginBottom: 5, color: "#6b7280" }}>
                    {account.provider} · {account.accountType}
                  </p>
                  <p style={{ margin: "8px 0 4px" }}>
                    <strong>Title:</strong> {account.accountTitle}
                  </p>
                  {account.accountNumber && (
                    <p style={{ margin: "4px 0" }}>
                      <strong>Account:</strong> {account.accountNumber}
                    </p>
                  )}
                  {account.iban && (
                    <p style={{ margin: "4px 0" }}>
                      <strong>IBAN:</strong> {account.iban}
                    </p>
                  )}
                  <p style={{ margin: "4px 0 14px" }}>
                    <strong>Currency:</strong> {account.currency}
                  </p>

                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button
                      onClick={() =>
                        updateAccount(account, { isActive: !account.isActive })
                      }
                      style={{
                        ...buttonStyle,
                        background: account.isActive ? "#fee2e2" : "#dcfce7",
                        color: account.isActive ? "#991b1b" : "#166534",
                      }}
                    >
                      {account.isActive ? "Deactivate" : "Activate"}
                    </button>

                    {!account.isPrimary && account.isActive && (
                      <button
                        onClick={() =>
                          updateAccount(account, { isPrimary: true })
                        }
                        style={{
                          ...buttonStyle,
                          background: "#e0f2fe",
                          color: "#075985",
                        }}
                      >
                        Make Primary
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* PAYMENT METHODS */}
        <section style={{ ...cardStyle, marginBottom: 24 }}>
          <h2 style={{ marginTop: 0 }}>Customer Payment Methods</h2>
          <p style={{ color: "#6b7280" }}>
            Yahan se checkout par payment methods enable ya disable karo.
          </p>

          {loading ? (
            <p>Payment methods load ho rahe hain...</p>
          ) : methods.length === 0 ? (
            <p>Database mein payment methods nahi milay.</p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
                gap: 16,
              }}
            >
              {methods.map((method) => (
                <div
                  key={method.id}
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: 14,
                    padding: 18,
                    background: method.enabled ? "#f0fdf4" : "#fafafa",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 10,
                    }}
                  >
                    <h3 style={{ margin: 0 }}>{method.name}</h3>
                    <strong
                      style={{
                        color: method.enabled ? "#166534" : "#991b1b",
                        fontSize: 12,
                      }}
                    >
                      {method.enabled ? "Enabled" : "Disabled"}
                    </strong>
                  </div>
                  <p style={{ color: "#6b7280", fontSize: 13 }}>
                    {method.description}
                  </p>
                  <p style={{ color: "#6b7280", fontSize: 12 }}>
                    Type: {method.type}
                  </p>
                  <button
                    onClick={() => toggleMethod(method)}
                    style={{
                      ...buttonStyle,
                      width: "100%",
                      background: method.enabled ? "#fee2e2" : "#dcfce7",
                      color: method.enabled ? "#991b1b" : "#166534",
                    }}
                  >
                    {method.enabled ? "Disable Method" : "Enable Method"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* TRANSACTIONS */}
        <section style={cardStyle}>
          <h2 style={{ marginTop: 0 }}>Payment Transactions</h2>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order, customer, method or status..."
            style={inputStyle}
          />

          <div style={{ overflowX: "auto", marginTop: 18 }}>
            <table
              style={{
                width: "100%",
                minWidth: 950,
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr>
                  {[
                    "Payment ID",
                    "Order",
                    "Customer",
                    "Amount",
                    "Method",
                    "Status",
                    "Transaction ID",
                    "Action",
                  ].map((heading) => (
                    <th
                      key={heading}
                      style={{
                        textAlign: "left",
                        padding: 13,
                        borderBottom: "2px solid #e5e7eb",
                        color: "#6b7280",
                        fontSize: 12,
                      }}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => (
                  <tr key={payment.id}>
                    <td style={{ padding: 13 }}>{payment.id}</td>
                    <td style={{ padding: 13 }}>{payment.orderId}</td>
                    <td style={{ padding: 13 }}>{payment.customer}</td>
                    <td style={{ padding: 13 }}>{money(payment.amount)}</td>
                    <td style={{ padding: 13 }}>{payment.method}</td>
                    <td style={{ padding: 13 }}>{payment.status}</td>
                    <td style={{ padding: 13 }}>{payment.transactionId}</td>
                    <td style={{ padding: 13 }}>
                      <select
                        value={payment.status}
                        onChange={(e) =>
                          updatePaymentStatus(
                            payment,
                            e.target.value as PaymentRecord["status"]
                          )
                        }
                        style={{
                          padding: 8,
                          borderRadius: 8,
                          border: "1px solid #d1d5db",
                        }}
                      >
                        <option>Pending</option>
                        <option>Paid</option>
                        <option>Failed</option>
                        <option>Cancelled</option>
                        <option>Refunded</option>
                        <option>Partially Refunded</option>
                      </select>
                    </td>
                  </tr>
                ))}
                {filteredPayments.length === 0 && (
                  <tr>
                    <td colSpan={8} style={{ padding: 20, color: "#6b7280" }}>
                      Koi payment transaction nahi mili.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section
          style={{
            ...cardStyle,
            marginTop: 24,
            background: "#fffbeb",
            borderColor: "#fde68a",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Payment Security</h2>
          <p>
            Customer ko sirf business account title, account number ya IBAN
            dikhaya jana chahiye.
          </p>
          <p>
            Personal wallet PIN, OTP aur password website par kabhi save ya
            display nahi karne.
          </p>
          <p style={{ marginBottom: 0 }}>
            Manual transfer ko payment proof aur admin verification ke baad hi
            Paid mark karna hai. Gateway payment ke liye provider ki server-side
            confirmation zaroori hogi.
          </p>
        </section>
      </div>
    </main>
  );
}
