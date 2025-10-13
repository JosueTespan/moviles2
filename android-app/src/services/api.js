// Cambia la URL por tu backend real
const API_BASE = "https://tu-api.com";

export async function registerDeviceOnBackend(payload) {
    const res = await fetch(`${API_BASE}/devices/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
    }
    return res.json().catch(() => ({}));
}
