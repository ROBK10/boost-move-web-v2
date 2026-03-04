const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001"

export async function apiFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data?.error || "Request failed")
  return data
}