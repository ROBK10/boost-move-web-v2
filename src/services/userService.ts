const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001"

export async function updateProfile(data: { name?: string; bio?: string }) {
  const res = await fetch(`${API_BASE}/user/me`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  const text = await res.text()
  const json = text ? JSON.parse(text) : {}
  if (!res.ok) throw new Error(json?.error || `HTTP ${res.status}`)
  return json as { user: { id: string; name: string; email: string; role: string; companyId: string; bio?: string; avatarUrl?: string } }
}

export async function uploadAvatar(file: File) {
  const form = new FormData()
  form.append("avatar", file)
  const res = await fetch(`${API_BASE}/user/avatar`, {
    method: "POST",
    credentials: "include",
    body: form, // no Content-Type header — browser sets multipart/form-data boundary
  })
  const text = await res.text()
  const json = text ? JSON.parse(text) : {}
  if (!res.ok) throw new Error(json?.error || `HTTP ${res.status}`)
  return json as { avatarUrl: string }
}

export async function changePassword(data: { currentPassword: string; newPassword: string }) {
  const res = await fetch(`${API_BASE}/user/change-password`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  const text = await res.text()
  const json = text ? JSON.parse(text) : {}
  if (!res.ok) throw new Error(json?.error || `HTTP ${res.status}`)
  return json
}
