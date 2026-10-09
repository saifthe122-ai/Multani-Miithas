"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function IntegrationsPage() {
const router = useRouter();

useEffect(() => {
router.replace("/admin/api-integrations");
}, [router]);

return (
<main
style={{
minHeight: "100vh",
display: "grid",
placeItems: "center",
fontFamily: "Arial, sans-serif",
background: "#f4f5fb",
color: "#20243a",
}}
> <p>Opening API & Integrations Dashboard...</p> </main>
);
}
