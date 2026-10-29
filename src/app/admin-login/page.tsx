
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setMessage(result.message || "Login nahi ho saka.");
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch {
      setMessage("Connection ka masla hai. Dobara koshish karo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background: "#102f2c",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "32px",
          borderRadius: "16px",
          background: "#fffaf0",
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
        }}
      >
        <h1
          style={{
            margin: "0 0 8px",
            color: "#123d37",
            fontSize: "26px",
          }}
        >
          Multani Mithas
        </h1>

        <p style={{ color: "#6b6254", marginBottom: "26px" }}>
          Private Admin Login
        </p>

        <label
          htmlFor="admin-password"
          style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: 600,
            color: "#263c36",
          }}
        >
          Admin Password
        </label>

        <input
          id="admin-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          required
          maxLength={500}
          placeholder="Apna admin password likhein"
          style={{
            boxSizing: "border-box",
            width: "100%",
            padding: "13px",
            border: "1px solid #c9d3cc",
            borderRadius: "8px",
            fontSize: "16px",
            marginBottom: "16px",
          }}
        />

        {message && (
          <p role="alert" style={{ color: "#b42318", fontSize: "14px" }}>
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
            border: "none",
            borderRadius: "8px",
            background: loading ? "#68827b" : "#123d37",
            color: "#fff",
            fontWeight: 700,
            fontSize: "15px",
            cursor: loading ? "wait" : "pointer",
          }}
        >
          {loading ? "Checking..." : "Login to Admin"}
        </button>
      </form>
    </main>
  );
}
