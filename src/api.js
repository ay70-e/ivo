// Simple API helper using fetch and Vite env for base URL
const BASE = import.meta.env.VITE_API_BASE_URL || "";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiGet(path) {
  const res = await fetch(BASE + path, { headers: { "Content-Type": "application/json", ...getAuthHeaders() } });
  if (!res.ok) throw res;
  return res.json();
}

export async function apiPost(path, body) {
  const res = await fetch(BASE + path, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw res;
  return res.json();
}

export async function apiPut(path, body) {
  const res = await fetch(BASE + path, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw res;
  return res.json();
}

export async function apiDelete(path) {
  const res = await fetch(BASE + path, { method: "DELETE", headers: { ...getAuthHeaders() } });
  if (!res.ok) throw res;
  return res.json();
}

export async function apiPostFormData(path, formData) {
  const res = await fetch(BASE + path, {
    method: "POST",
    headers: { ...getAuthHeaders() },
    body: formData,
  });
  if (!res.ok) throw res;
  return res.json();
}

export default { apiGet, apiPost, apiPut, apiDelete, apiPostFormData };
