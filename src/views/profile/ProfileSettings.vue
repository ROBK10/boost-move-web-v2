<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"
import { useAuthStore } from "@/stores/authStore"

const router = useRouter()
const auth = useAuthStore()

// Konto fields
const name = ref(auth.user?.name ?? "")
const bio = ref(auth.user?.bio ?? "")
const saving = ref(false)
const saveError = ref<string | null>(null)
const saveSuccess = ref(false)

async function save() {
  if (!name.value.trim()) return
  saving.value = true
  saveError.value = null
  saveSuccess.value = false
  try {
    await auth.updateProfile({ name: name.value.trim(), bio: bio.value.trim() || undefined })
    saveSuccess.value = true
    setTimeout(() => { saveSuccess.value = false }, 2000)
  } catch (e: any) {
    saveError.value = e?.message || "Noe gikk galt"
  } finally {
    saving.value = false
  }
}

// Notifications
const notificationsOn = ref(localStorage.getItem("bm-notifications") !== "false")

function toggleNotifications() {
  notificationsOn.value = !notificationsOn.value
  localStorage.setItem("bm-notifications", String(notificationsOn.value))
}

async function onLogout() {
  await auth.logout()
  router.push("/login")
}
</script>

<template>
  <div class="page">
    <div class="container">
      <header class="top">
        <button class="back" type="button" @click="router.push('/profil')" aria-label="Tilbake">
          <span class="chev" aria-hidden="true"></span>
        </button>
        <h1 class="title">Innstillinger</h1>
      </header>

      <!-- Section: Konto -->
      <div class="section-label">Konto</div>
      <div class="card">
        <div class="field">
          <label class="field-label" for="settings-name">Navn</label>
          <input
            id="settings-name"
            v-model="name"
            class="field-input"
            type="text"
            placeholder="Ditt navn"
            autocomplete="name"
          />
        </div>

        <div class="divider"></div>

        <div class="field">
          <label class="field-label" for="settings-bio">Bio <span class="optional">(valgfritt)</span></label>
          <textarea
            id="settings-bio"
            v-model="bio"
            class="field-input field-textarea"
            rows="3"
            placeholder="Kort om deg…"
          />
        </div>

        <p v-if="saveError" class="error-msg">{{ saveError }}</p>

        <button
          class="save-btn"
          type="button"
          @click="save"
          :disabled="saving || !name.trim()"
        >
          <span v-if="saving">Lagrer…</span>
          <span v-else-if="saveSuccess">Lagret!</span>
          <span v-else>Lagre</span>
        </button>
      </div>

      <!-- Section: App -->
      <div class="section-label">App</div>
      <div class="card card--list">
        <div class="list-row">
          <span class="row-icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </span>
          <span class="row-label">Varslinger</span>
          <button
            class="toggle"
            :class="{ on: notificationsOn }"
            type="button"
            role="switch"
            :aria-checked="notificationsOn"
            @click="toggleNotifications"
          >
            <span class="toggle-thumb"></span>
          </button>
        </div>
      </div>

      <!-- Section: Konto handlinger -->
      <div class="section-label">Konto handlinger</div>
      <div class="card card--list">
        <button class="list-row list-row--danger" type="button" @click="onLogout" :disabled="auth.isLoading">
          <span class="row-icon row-icon--danger" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </span>
          <span class="row-label row-label--danger">{{ auth.isLoading ? "Logger ut…" : "Logg ut" }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page { width: 100%; }

.container {
  max-width: 520px;
  margin: 0 auto;
  padding: 18px 16px 60px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.top {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 10px;
}

.back {
  width: 42px;
  height: 42px;
  border: none;
  background: white;
  border-radius: 999px;
  box-shadow: 0 10px 30px rgba(20, 20, 20, 0.08);
  cursor: pointer;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.chev {
  width: 12px;
  height: 12px;
  border-left: 2px solid rgba(17, 24, 39, 0.55);
  border-bottom: 2px solid rgba(17, 24, 39, 0.55);
  transform: rotate(45deg);
}

.title {
  margin: 0;
  font-size: 28px;
  font-weight: 900;
  letter-spacing: -0.03em;
  color: #111827;
}

.section-label {
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(17, 24, 39, 0.42);
  padding: 14px 4px 6px;
}

.card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(20, 20, 20, 0.06);
  border: 1px solid rgba(17, 24, 39, 0.05);
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.card--list {
  padding: 0;
  overflow: hidden;
  gap: 0;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-size: 13px;
  font-weight: 800;
  color: rgba(17, 24, 39, 0.55);
}

.optional {
  font-weight: 600;
  color: rgba(17, 24, 39, 0.35);
}

.field-input {
  border: 1.5px solid rgba(17, 24, 39, 0.10);
  border-radius: 14px;
  padding: 12px 14px;
  font-size: 15px;
  font-weight: 600;
  font-family: inherit;
  color: #111827;
  background: rgba(17, 24, 39, 0.025);
  transition: border-color 140ms ease, box-shadow 140ms ease;
  -webkit-appearance: none;
}

.field-input:focus {
  outline: none;
  border-color: rgba(17, 24, 39, 0.28);
  box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.05);
}

.field-textarea {
  resize: none;
  line-height: 1.5;
}

.divider {
  height: 1px;
  background: rgba(17, 24, 39, 0.06);
}

.error-msg {
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  color: #dc2626;
}

.save-btn {
  height: 50px;
  border: none;
  border-radius: 14px;
  background: #111827;
  color: white;
  font-size: 15px;
  font-weight: 900;
  font-family: inherit;
  cursor: pointer;
  transition: opacity 150ms ease;
}

.save-btn:disabled {
  opacity: 0.45;
  cursor: default;
}

/* List rows */
.list-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  cursor: default;
}

.list-row--danger {
  cursor: pointer;
}

.list-row--danger:active {
  background: rgba(220, 38, 38, 0.03);
}

.list-row--danger:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.row-icon {
  width: 36px;
  height: 36px;
  background: rgba(17, 24, 39, 0.05);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(17, 24, 39, 0.65);
  flex-shrink: 0;
}

.row-icon--danger {
  background: rgba(220, 38, 38, 0.08);
  color: #dc2626;
}

.row-label {
  flex: 1;
  font-size: 15px;
  font-weight: 800;
  color: #111827;
}

.row-label--danger {
  color: #dc2626;
}

/* Toggle */
.toggle {
  position: relative;
  width: 48px;
  height: 28px;
  border-radius: 999px;
  background: rgba(17, 24, 39, 0.15);
  border: none;
  cursor: pointer;
  transition: background 200ms ease;
  flex-shrink: 0;
  padding: 0;
}

.toggle.on { background: #16a34a; }

.toggle-thumb {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 22px;
  height: 22px;
  border-radius: 999px;
  background: white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.18);
  transition: transform 200ms ease;
}

.toggle.on .toggle-thumb { transform: translateX(20px); }
</style>
