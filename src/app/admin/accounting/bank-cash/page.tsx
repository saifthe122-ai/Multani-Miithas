
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type TransactionType = "Deposit" | "Withdrawal" | "Transfer";
type AccountType = "Bank" | "Cash";

type Transaction = {
  id: number;
  date: string;
  reference: string;
  description: string;
  account: string;
  type: TransactionType;
  amount: number;
  status: "Completed" | "Pending";
};

const initialTransactions: Transaction[] = [
  {
    id: 1,
    date: "2026-10-09",
    reference: "BC-1001",
    description: "Customer payment received",
    account: "Main Bank Account",
    type: "Deposit",
    amount: 25000,
    status: "Completed",
  },
  {
    id: 2,
    date: "2026-10-08",
    reference: "BC-1002",
    description: "Shop supplies purchase",
    account: "Cash in Hand",
    type: "Withdrawal",
    amount: 4500,
    status: "Completed",
  },
  {
    id: 3,
    date: "2026-10-07",
    reference: "BC-1003",
    description: "Online order payment",
    account: "Main Bank Account",
    type: "Deposit",
    amount: 12000,
    status: "Completed",
  },
  {
    id: 4,
    date: "2026-10-06",
    reference: "BC-1004",
    description: "Electricity bill",
    account: "Main Bank Account",
    type: "Withdrawal",
    amount: 6500,
    status: "Pending",
  },
  {
    id: 5,
    date: "2026-10-05",
    reference: "BC-1005",
    description: "Cash deposited into bank",
    account: "Cash in Hand",
    type: "Transfer",
    amount: 8000,
    status: "Completed",
  },
];

const startingBalances: Record<string, number> = {
  "Main Bank Account": 150000,
  "Business Savings": 75000,
  "Cash in Hand": 20000,
};

const money = (amount: number) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(amount);

export default function BankCashPage() {
  const [transactions, setTransactions] =
    useState<Transaction[]>(initialTransactions);
  const [search, setSearch] = useState("");
  const [accountFilter, setAccountFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState<TransactionType>("Deposit");

  const [date, setDate] = useState("2026-10-09");
  const [description, setDescription] = useState("");
  const [account, setAccount] = useState("Main Bank Account");
  const [amount, setAmount] = useState("");
  const [status, setStatus] =
    useState<"Completed" | "Pending">("Completed");

  const balances = useMemo(() => {
    const result = { ...startingBalances };

    transactions.forEach((transaction) => {
      if (transaction.status !== "Completed") return;

      if (transaction.type === "Deposit") {
        result[transaction.account] =
          (result[transaction.account] || 0) + transaction.amount;
      } else if (transaction.type === "Withdrawal") {
        result[transaction.account] =
          (result[transaction.account] || 0) - transaction.amount;
      } else if (transaction.type === "Transfer") {
        result[transaction.account] =
          (result[transaction.account] || 0) - transaction.amount;
      }
    });

    return result;
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    const query = search.toLowerCase().trim();

    return transactions.filter((transaction) => {
      const matchesSearch =
        transaction.reference.toLowerCase().includes(query) ||
        transaction.description.toLowerCase().includes(query) ||
        transaction.account.toLowerCase().includes(query);

      const matchesAccount =
        accountFilter === "All" || transaction.account === accountFilter;

      const matchesType =
        typeFilter === "All" || transaction.type === typeFilter;

      const matchesStatus =
        statusFilter === "All" || transaction.status === statusFilter;

      return (
        matchesSearch &&
        matchesAccount &&
        matchesType &&
        matchesStatus
      );
    });
  }, [transactions, search, accountFilter, typeFilter, statusFilter]);

  const totalBalance = Object.values(balances).reduce(
    (total, balance) => total + balance,
    0
  );

  const completedDeposits = transactions
    .filter(
      (transaction) =>
        transaction.status === "Completed" &&
        transaction.type === "Deposit"
    )
    .reduce((total, transaction) => total + transaction.amount, 0);

  const completedWithdrawals = transactions
    .filter(
      (transaction) =>
        transaction.status === "Completed" &&
        transaction.type === "Withdrawal"
    )
    .reduce((total, transaction) => total + transaction.amount, 0);

  function openForm(type: TransactionType) {
    setFormType(type);
    setDescription("");
    setAmount("");
    setDate("2026-10-09");
    setAccount("Main Bank Account");
    setStatus("Completed");
    setMessage("");
    setShowForm(true);
  }

  function addTransaction(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const numericAmount = Number(amount);

    if (!description.trim()) {
      setMessage("Transaction description likhein.");
      return;
    }

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setMessage("Amount zero se zyada enter karein.");
      return;
    }

    if (
      status === "Completed" &&
      formType !== "Deposit" &&
      numericAmount > (balances[account] || 0)
    ) {
      setMessage("Is account mein itna available balance nahi hai.");
      return;
    }

    const transaction: Transaction = {
      id: Date.now(),
      date,
      reference: `BC-${Date.now().toString().slice(-6)}`,
      description: description.trim(),
      account,
      type: formType,
      amount: numericAmount,
      status,
    };

    setTransactions((current) => [transaction, ...current]);
    setShowForm(false);
    setMessage(`${formType} transaction add ho gayi.`);
  }

  function updateStatus(id: number, nextStatus: "Completed" | "Pending") {
    const transaction = transactions.find((item) => item.id === id);

    if (!transaction) return;

    if (
      nextStatus === "Completed" &&
      transaction.status !== "Completed" &&
      transaction.type !== "Deposit" &&
      transaction.amount > (balances[transaction.account] || 0)
    ) {
      setMessage("Available balance kam hai. Transaction complete nahi hui.");
      return;
    }

    setTransactions((current) =>
      current.map((item) =>
        item.id === id ? { ...item, status: nextStatus } : item
      )
    );

    setMessage(`Transaction status ${nextStatus} kar diya gaya.`);
  }

  function deleteTransaction(id: number) {
    const confirmed = window.confirm(
      "Kya aap is demo transaction ko delete karna chahte hain?"
    );

    if (!confirmed) return;

    setTransactions((current) => current.filter((item) => item.id !== id));
    setMessage("Demo transaction delete ho gayi.");
  }

  const cardStyle: React.CSSProperties = {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: 14,
    padding: 20,
    boxShadow: "0 3px 12px rgba(15,23,42,0.04)",
  };

  const buttonStyle: React.CSSProperties = {
    padding: "10px 14px",
    borderRadius: 8,
    border: "1px solid #d1d5db",
    background: "#ffffff",
    color: "#111827",
    cursor: "pointer",
    fontWeight: 600,
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: 11,
    borderRadius: 8,
    border: "1px solid #d1d5db",
    marginTop: 6,
    boxSizing: "border-box",
    background: "#ffffff",
    color: "#111827",
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: 24,
        color: "#111827",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <nav
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            alignItems: "center",
            marginBottom: 22,
            fontSize: 14,
          }}
        >
          <Link
            href="/admin"
            style={{ color: "#2563eb", textDecoration: "none" }}
          >
            Admin
          </Link>
          <span>/</span>
          <Link
            href="/admin/accounting"
            style={{ color: "#2563eb", textDecoration: "none" }}
          >
            Accounting
          </Link>
          <span>/ Bank &amp; Cash</span>
        </nav>

        <header
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <div>
            <h1 style={{ margin: 0, fontSize: 30 }}>Bank &amp; Cash</h1>
            <p style={{ margin: "8px 0 0", color: "#6b7280" }}>
              Manage business accounts, cash balances and transactions.
            </p>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <button
              type="button"
              style={{ ...buttonStyle, background: "#dcfce7" }}
              onClick={() => openForm("Deposit")}
            >
              + Deposit
            </button>
            <button
              type="button"
              style={{ ...buttonStyle, background: "#fee2e2" }}
              onClick={() => openForm("Withdrawal")}
            >
              − Withdrawal
            </button>
            <button
              type="button"
              style={{ ...buttonStyle, background: "#dbeafe" }}
              onClick={() => openForm("Transfer")}
            >
              Transfer Out
            </button>
          </div>
        </header>

        {message && (
          <div
            role="status"
            style={{
              marginBottom: 18,
              padding: 12,
              borderRadius: 8,
              background: "#eff6ff",
              color: "#1d4ed8",
            }}
          >
            {message}
            <button
              type="button"
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

        {showForm && (
          <section
            style={{
              ...cardStyle,
              marginBottom: 24,
              borderTop: "4px solid #2563eb",
            }}
          >
            <h2 style={{ marginTop: 0 }}>
              Add {formType} Transaction
            </h2>

            <form onSubmit={addTransaction}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 16,
                }}
              >
                <label>
                  Transaction date
                  <input
                    type="date"
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                    required
                    style={inputStyle}
                  />
                </label>

                <label>
                  Account
                  <select
                    value={account}
                    onChange={(event) => setAccount(event.target.value)}
                    style={inputStyle}
                  >
                    <option value="Main Bank Account">Main Bank Account</option>
                    <option value="Business Savings">Business Savings</option>
                    <option value="Cash in Hand">Cash in Hand</option>
                  </select>
                </label>

                <label>
                  Amount (PKR)
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    placeholder="Enter amount"
                    required
                    style={inputStyle}
                  />
                </label>

                <label>
                  Status
                  <select
                    value={status}
                    onChange={(event) =>
                      setStatus(event.target.value as "Completed" | "Pending")
                    }
                    style={inputStyle}
                  >
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                  </select>
                </label>

                <label style={{ gridColumn: "1 / -1" }}>
                  Description
                  <input
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="e.g. Customer payment, rent, utility bill"
                    required
                    style={inputStyle}
                  />
                </label>
              </div>

              {formType === "Transfer" && (
                <p style={{ color: "#92400e", fontSize: 13 }}>
                  Transfer Out selected account se amount minus karega.
                  Doosre account mein amount automatically add nahi hoga.
                </p>
              )}

              <div
                style={{
                  display: "flex",
                  gap: 10,
                  marginTop: 20,
                  flexWrap: "wrap",
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
                  Save Transaction
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

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <div style={cardStyle}>
            <p style={{ margin: 0, color: "#6b7280" }}>Total Available Balance</p>
            <h2 style={{ margin: "12px 0", fontSize: 27 }}>
              {money(totalBalance)}
            </h2>
            <span style={{ color: "#6b7280", fontSize: 13 }}>
              Across all listed accounts
            </span>
          </div>

          <div style={cardStyle}>
            <p style={{ margin: 0, color: "#6b7280" }}>Recorded Deposits</p>
            <h2 style={{ margin: "12px 0", fontSize: 27, color: "#15803d" }}>
              {money(completedDeposits)}
            </h2>
            <span style={{ color: "#6b7280", fontSize: 13 }}>
              Completed transactions
            </span>
          </div>

          <div style={cardStyle}>
            <p style={{ margin: 0, color: "#6b7280" }}>Recorded Withdrawals</p>
            <h2 style={{ margin: "12px 0", fontSize: 27, color: "#b91c1c" }}>
              {money(completedWithdrawals)}
            </h2>
            <span style={{ color: "#6b7280", fontSize: 13 }}>
              Completed transactions
            </span>
          </div>

          <div style={cardStyle}>
            <p style={{ margin: 0, color: "#6b7280" }}>Pending Transactions</p>
            <h2 style={{ margin: "12px 0", fontSize: 27 }}>
              {transactions.filter((item) => item.status === "Pending").length}
            </h2>
            <span style={{ color: "#6b7280", fontSize: 13 }}>
              Awaiting completion
            </span>
          </div>
        </section>

        <section style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 21, marginBottom: 14 }}>Accounts Overview</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 16,
            }}
          >
            {Object.entries(balances).map(([name, balance]) => (
              <div key={name} style={cardStyle}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#6b7280", fontSize: 13 }}>
                    {name === "Cash in Hand" ? "CASH ACCOUNT" : "BANK ACCOUNT"}
                  </span>
                  <span aria-hidden="true">
                    {name === "Cash in Hand" ? "▣" : "▤"}
                  </span>
                </div>
                <h3 style={{ marginBottom: 8 }}>{name}</h3>
                <p
                  style={{
                    fontSize: 23,
                    fontWeight: 700,
                    margin: "10px 0",
                    color: balance < 0 ? "#b91c1c" : "#111827",
                  }}
                >
                  {money(balance)}
                </p>
                <button
                  type="button"
                  style={buttonStyle}
                  onClick={() => {
                    setAccountFilter(name);
                    setMessage(`Showing transactions for ${name}.`);
                    document
                      .getElementById("transactions")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  View Transactions
                </button>
              </div>
            ))}
          </div>
        </section>

        <section id="transactions" style={cardStyle}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              marginBottom: 18,
            }}
          >
            <div>
              <h2 style={{ margin: 0, fontSize: 22 }}>Transaction History</h2>
              <p style={{ color: "#6b7280", marginBottom: 0 }}>
                {filteredTransactions.length} transaction(s) found
              </p>
            </div>
            <button
              type="button"
              style={buttonStyle}
              onClick={() => {
                setSearch("");
                setAccountFilter("All");
                setTypeFilter("All");
                setStatusFilter("All");
                setMessage("Filters reset ho gaye.");
              }}
            >
              Reset Filters
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
              gap: 12,
              marginBottom: 18,
            }}
          >
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search reference, account..."
              aria-label="Search transactions"
              style={{ ...inputStyle, marginTop: 0 }}
            />

            <select
              value={accountFilter}
              onChange={(event) => setAccountFilter(event.target.value)}
              aria-label="Filter by account"
              style={{ ...inputStyle, marginTop: 0 }}
            >
              <option value="All">All Accounts</option>
              <option value="Main Bank Account">Main Bank Account</option>
              <option value="Business Savings">Business Savings</option>
              <option value="Cash in Hand">Cash in Hand</option>
            </select>

            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              aria-label="Filter by transaction type"
              style={{ ...inputStyle, marginTop: 0 }}
            >
              <option value="All">All Types</option>
              <option value="Deposit">Deposit</option>
              <option value="Withdrawal">Withdrawal</option>
              <option value="Transfer">Transfer Out</option>
            </select>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filter by status"
              style={{ ...inputStyle, marginTop: 0 }}
            >
              <option value="All">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
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
                <tr style={{ background: "#f9fafb" }}>
                  {[
                    "Date",
                    "Reference",
                    "Description",
                    "Account",
                    "Type",
                    "Amount",
                    "Status",
                    "Actions",
                  ].map((heading) => (
                    <th
                      key={heading}
                      style={{
                        padding: 12,
                        borderBottom: "1px solid #e5e7eb",
                        fontSize: 12,
                        color: "#6b7280",
                      }}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td style={{ padding: 12, borderBottom: "1px solid #e5e7eb" }}>
                      {transaction.date}
                    </td>
                    <td style={{ padding: 12, borderBottom: "1px solid #e5e7eb" }}>
                      {transaction.reference}
                    </td>
                    <td style={{ padding: 12, borderBottom: "1px solid #e5e7eb" }}>
                      {transaction.description}
                    </td>
                    <td style={{ padding: 12, borderBottom: "1px solid #e5e7eb" }}>
                      {transaction.account}
                    </td>
                    <td style={{ padding: 12, borderBottom: "1px solid #e5e7eb" }}>
                      {transaction.type}
                    </td>
                    <td
                      style={{
                        padding: 12,
                        borderBottom: "1px solid #e5e7eb",
                        fontWeight: 700,
                        color:
                          transaction.type === "Deposit" ? "#15803d" : "#b91c1c",
                      }}
                    >
                      {transaction.type === "Deposit" ? "+" : "−"}
                      {money(transaction.amount)}
                    </td>
                    <td style={{ padding: 12, borderBottom: "1px solid #e5e7eb" }}>
                      <span
                        style={{
                          padding: "5px 8px",
                          borderRadius: 20,
                          fontSize: 12,
                          background:
                            transaction.status === "Completed"
                              ? "#dcfce7"
                              : "#fef3c7",
                          color:
                            transaction.status === "Completed"
                              ? "#166534"
                              : "#92400e",
                        }}
                      >
                        {transaction.status}
                      </span>
                    </td>
                    <td style={{ padding: 12, borderBottom: "1px solid #e5e7eb" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          type="button"
                          style={buttonStyle}
                          aria-label={`Update ${transaction.reference} status`}
                          onClick={() =>
                            updateStatus(
                              transaction.id,
                              transaction.status === "Completed"
                                ? "Pending"
                                : "Completed"
                            )
                          }
                        >
                          {transaction.status === "Completed"
                            ? "Set Pending"
                            : "Complete"}
                        </button>
                        <button
                          type="button"
                          style={{
                            ...buttonStyle,
                            color: "#b91c1c",
                          }}
                          onClick={() => deleteTransaction(transaction.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredTransactions.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      style={{
                        padding: 30,
                        textAlign: "center",
                        color: "#6b7280",
                      }}
                    >
                      No transactions found. Search ya filters change karein.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <p style={{ color: "#6b7280", fontSize: 12, marginTop: 18 }}>
          Demo mode: data browser refresh ke baad reset ho sakta hai. Balances
          sample opening balances aur demo transactions par based hain. Real
          accounting records ke liye database aur access controls connect karna
          zaroori hai.
        </p>
      </div>
    </main>
  );
}
