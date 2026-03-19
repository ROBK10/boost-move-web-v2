<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"
import { getToken } from "@/services/api"

const router = useRouter()
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001"

const file = ref<File | null>(null)
const preview = ref<string | null>(null)
const weight = ref("")
const bodyFatPct = ref("")
const muscleMass = ref("")
const bmi = ref("")
const bodyWater = ref("")
const visceralFat = ref("")
const basalMetab = ref("")
const scanDate = ref(new Date().toISOString().slice(0, 10))
const notes = ref("")

const isLoading = ref(false)
const error = ref<string | null>(null)

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const f = input.files?.[0]
  if (!f) return
  file.value = f
  if (f.type.startsWith("image/")) {
    const reader = new FileReader()
    reader.onload = (ev) => { preview.value = ev.target?.result as string }
    reader.readAsDataURL(f)
  } else {
    preview.value = null
  }
}

async function submit() {
  isLoading.value = true
  error.value = null

  try {
    const form = new FormData()
    if (file.value) form.append("scan", file.value)
    if (weight.value) form.append("weight", weight.value)
    if (bodyFatPct.value) form.append("bodyFatPct", bodyFatPct.value)
    if (muscleMass.value) form.append("muscleMass", muscleMass.value)
    if (bmi.value) form.append("bmi", bmi.value)
    if (bodyWater.value) form.append("bodyWater", bodyWater.value)
    if (visceralFat.value) form.append("visceralFat", visceralFat.value)
    if (basalMetab.value) form.append("basalMetab", basalMetab.value)
    if (scanDate.value) form.append("scanDate", scanDate.value)
    if (notes.value) form.append("notes", notes.value)

    const token = getToken()
    const res = await fetch(`${API_BASE}/user/inbody`, {
      method: "POST",
      credentials: "include",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    })
    const text = await res.text()
    const json = text ? JSON.parse(text) : {}
    if (!res.ok) throw new Error(json?.error || `HTTP ${res.status}`)

    router.push("/inbody")
  } catch (e: any) {
    error.value = e?.message || "Kunne ikke lagre"
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="wrap">
    <header class="top">
      <button class="back-btn" @click="router.push('/min-helse')" aria-label="Tilbake">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
      </button>
      <h1 class="title">Ny kroppsanalyse</h1>
    </header>

    <!-- Image upload -->
    <section class="card">
      <h2 class="section-title">Bilde av skanning</h2>
      <label class="file-label">
        <input type="file" accept="image/*,application/pdf" class="file-input" @change="onFileChange" />
        <div class="file-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
          <span>{{ file ? file.name : 'Velg bilde eller PDF' }}</span>
        </div>
      </label>
      <img v-if="preview" :src="preview" alt="Forhåndsvisning" class="preview-img" />
    </section>

    <!-- Manual fields -->
    <section class="card">
      <h2 class="section-title">Verdier</h2>
      <div class="fields-grid">
        <div class="field">
          <label class="field-label">Vekt (kg)</label>
          <input v-model="weight" type="number" step="0.1" min="0" class="field-input" placeholder="f.eks. 78.5" />
        </div>
        <div class="field">
          <label class="field-label">Fettprosent (%)</label>
          <input v-model="bodyFatPct" type="number" step="0.1" min="0" max="100" class="field-input" placeholder="f.eks. 22.3" />
        </div>
        <div class="field">
          <label class="field-label">Muskelmasse (kg)</label>
          <input v-model="muscleMass" type="number" step="0.1" min="0" class="field-input" placeholder="f.eks. 34.2" />
        </div>
        <div class="field">
          <label class="field-label">BMI</label>
          <input v-model="bmi" type="number" step="0.1" min="0" class="field-input" placeholder="f.eks. 24.1" />
        </div>
        <div class="field">
          <label class="field-label">Kroppsvann (%)</label>
          <input v-model="bodyWater" type="number" step="0.1" min="0" max="100" class="field-input" placeholder="f.eks. 55.0" />
        </div>
        <div class="field">
          <label class="field-label">Visceralt fett</label>
          <input v-model="visceralFat" type="number" step="1" min="0" class="field-input" placeholder="f.eks. 8" />
        </div>
        <div class="field">
          <label class="field-label">Basalmetabolisme (kcal)</label>
          <input v-model="basalMetab" type="number" step="1" min="0" class="field-input" placeholder="f.eks. 1650" />
        </div>
        <div class="field">
          <label class="field-label">Dato</label>
          <input v-model="scanDate" type="date" class="field-input" />
        </div>
      </div>

      <div class="field" style="margin-top: 12px;">
        <label class="field-label">Notater</label>
        <textarea v-model="notes" class="field-input field-textarea" rows="3" placeholder="Valgfritt"></textarea>
      </div>
    </section>

    <p v-if="error" class="error">{{ error }}</p>

    <button class="btn primary" :disabled="isLoading" @click="submit">
      {{ isLoading ? 'Lagrer…' : 'Lagre' }}
    </button>
  </div>
</template>

<style scoped>
.wrap { max-width: 520px; margin: 0 auto; padding: 18px 16px 24px; display: flex; flex-direction: column; gap: 14px; }
.top { display: flex; align-items: center; gap: 12px; }
.back-btn { background: none; border: none; color: #D1E7E5; cursor: pointer; padding: 4px; }
.title { margin: 0; font-size: 24px; font-weight: 900; color: #FFFFFF; }
.card { background: #023238; border-radius: 18px; padding: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
.section-title { margin: 0 0 12px; font-size: 16px; font-weight: 900; color: #FFFFFF; }

.file-label { display: block; cursor: pointer; }
.file-input { display: none; }
.file-btn {
  display: flex; align-items: center; gap: 10px;
  padding: 14px 16px; border-radius: 14px;
  border: 2px dashed rgba(209,231,229,0.15);
  background: #034044; color: #D1E7E5;
  font-size: 14px; font-weight: 700;
  transition: border-color 0.15s;
}
.file-btn:hover { border-color: rgba(190,242,1,0.4); }
.preview-img { width: 100%; max-height: 300px; object-fit: contain; border-radius: 12px; margin-top: 12px; }

.fields-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.field { display: flex; flex-direction: column; gap: 4px; }
.field-label { font-size: 12px; font-weight: 900; color: rgba(209,231,229,0.6); text-transform: uppercase; letter-spacing: 0.04em; }
.field-input {
  height: 44px; border-radius: 12px;
  border: 2px solid rgba(209,231,229,0.1);
  background: #034044; padding: 0 12px;
  font-size: 15px; font-weight: 700; color: #D1E7E5;
  outline: none; font-family: inherit;
}
.field-input::placeholder { color: rgba(209,231,229,0.3); }
.field-input:focus { border-color: rgba(190,242,1,0.5); }
.field-textarea { height: auto; padding: 10px 12px; resize: vertical; }

.btn { height: 48px; border: none; border-radius: 14px; font-size: 15px; font-weight: 900; cursor: pointer; width: 100%; }
.btn.primary { background: #BEF201; color: #023238; }
.btn:disabled { opacity: 0.4; cursor: not-allowed; }
.error { margin: 0; color: #dc2626; font-weight: 800; font-size: 13px; }
</style>
