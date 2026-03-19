<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useAuthStore } from "@/stores/authStore"
import { subscribePush, unsubscribePush, isPushSubscribed, sendTestPush } from "@/services/pushService"
import { isBreakReminderEnabled, startBreakReminder, stopBreakReminder, getBreakInterval, setBreakInterval } from "@/services/breakReminder"

const router = useRouter()
const auth = useAuthStore()

// Push state
const pushEnabled = ref(false)
const pushLoading = ref(false)

// Break reminder state
const breakEnabled = ref(false)
const breakInterval = ref(45)

onMounted(async () => {
  pushEnabled.value = await isPushSubscribed()
  breakEnabled.value = isBreakReminderEnabled()
  breakInterval.value = getBreakInterval()
})

function toggleBreak() {
  if (breakEnabled.value) {
    stopBreakReminder()
    breakEnabled.value = false
  } else {
    startBreakReminder()
    breakEnabled.value = true
  }
}

// Weekly goal
const weeklyGoal = ref(auth.user?.weeklyGoal ?? 150)

async function onGoalChange(e: Event) {
  const v = Number((e.target as HTMLSelectElement).value)
  weeklyGoal.value = v
  try { await auth.updateProfile({ weeklyGoal: v }) } catch { /* ignore */ }
}

function onBreakIntervalChange(e: Event) {
  const v = Number((e.target as HTMLSelectElement).value)
  breakInterval.value = v
  setBreakInterval(v)
}

async function togglePush() {
  pushLoading.value = true
  try {
    if (pushEnabled.value) {
      await unsubscribePush()
      pushEnabled.value = false
    } else {
      const ok = await subscribePush()
      pushEnabled.value = ok
    }
  } finally {
    pushLoading.value = false
  }
}

async function testPush() {
  try { await sendTestPush() } catch { /* ignore */ }
}

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

      <!-- Section: Mål -->
      <div class="section-label">Aktivitetsmål</div>
      <div class="card card--list">
        <div class="list-row">
          <span class="row-icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <circle cx="12" cy="12" r="6"/>
              <circle cx="12" cy="12" r="2"/>
            </svg>
          </span>
          <span class="row-label">Ukentlig mål</span>
          <select class="interval-select" :value="weeklyGoal" @change="onGoalChange">
            <option value="10">10 min</option>
            <option value="30">30 min</option>
            <option value="75">75 min</option>
            <option value="150">150 min</option>
            <option value="300">300 min</option>
          </select>
        </div>
      </div>

      <!-- Section: Påminnelser -->
      <div class="section-label">Påminnelser</div>
      <div class="card card--list">
        <div class="list-row">
          <span class="row-icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </span>
          <span class="row-label">Push-påminnelser</span>
          <button
            class="toggle"
            :class="{ on: pushEnabled }"
            type="button"
            role="switch"
            :aria-checked="pushEnabled"
            :disabled="pushLoading"
            @click="togglePush"
          >
            <span class="toggle-thumb"></span>
          </button>
        </div>
        <div v-if="pushEnabled" class="list-row" style="border-top: 1px solid rgba(209,231,229,0.08)">
          <span class="row-label" style="font-size: 13px; color: rgba(209,231,229,0.6)">Send test-varsling</span>
          <button class="test-btn" type="button" @click="testPush">Test</button>
        </div>
      </div>

      <!-- Section: Sittepause -->
      <div class="section-label">Sittepause</div>
      <div class="card card--list">
        <div class="list-row">
          <span class="row-icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </span>
          <span class="row-label">Påminnelse om å reise deg</span>
          <button
            class="toggle"
            :class="{ on: breakEnabled }"
            type="button"
            role="switch"
            :aria-checked="breakEnabled"
            @click="toggleBreak"
          >
            <span class="toggle-thumb"></span>
          </button>
        </div>
        <div v-if="breakEnabled" class="list-row" style="border-top: 1px solid rgba(209,231,229,0.08)">
          <span class="row-label" style="font-size: 13px; color: rgba(209,231,229,0.6)">Intervall</span>
          <select class="interval-select" :value="breakInterval" @change="onBreakIntervalChange">
            <option value="30">Hvert 30 min</option>
            <option value="45">Hvert 45 min</option>
            <option value="60">Hver time</option>
          </select>
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
  background: #023238;
  border-radius: 999px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  cursor: pointer;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.chev {
  width: 12px;
  height: 12px;
  border-left: 2px solid rgba(209,231,229,0.5);
  border-bottom: 2px solid rgba(209,231,229,0.5);
  transform: rotate(45deg);
}

.title {
  margin: 0;
  font-size: 28px;
  font-weight: 900;
  letter-spacing: -0.03em;
  color: #FFFFFF;
}

.section-label {
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(209,231,229,0.35);
  padding: 14px 4px 6px;
}

.card {
  background: #023238;
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.25);
  border: 1px solid rgba(209,231,229,0.08);
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
  color: rgba(209,231,229,0.6);
}

.optional {
  font-weight: 600;
  color: rgba(209,231,229,0.35);
}

.field-input {
  border: 1.5px solid rgba(209,231,229,0.1);
  border-radius: 14px;
  padding: 12px 14px;
  font-size: 15px;
  font-weight: 600;
  font-family: inherit;
  color: #FFFFFF;
  background: rgba(209,231,229,0.04);
  transition: border-color 140ms ease, box-shadow 140ms ease;
  -webkit-appearance: none;
}

.field-input:focus {
  outline: none;
  border-color: rgba(209,231,229,0.25);
  box-shadow: 0 0 0 3px rgba(209,231,229,0.08);
}

.field-textarea {
  resize: none;
  line-height: 1.5;
}

.divider {
  height: 1px;
  background: rgba(209,231,229,0.06);
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
  background: #023238;
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
  background: rgba(209,231,229,0.06);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(209,231,229,0.6);
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
  color: #FFFFFF;
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
  background: rgba(209,231,229,0.12);
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
  background: #023238;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.18);
  transition: transform 200ms ease;
}

.toggle.on .toggle-thumb { transform: translateX(20px); }

.interval-select {
  height: 36px; padding: 0 12px; border-radius: 10px;
  border: 1.5px solid rgba(209,231,229,0.1); background: #023238;
  font-size: 14px; font-weight: 700; font-family: inherit;
  color: #FFFFFF; cursor: pointer;
}

.test-btn {
  height: 32px; padding: 0 14px; border-radius: 10px;
  border: none; background: rgba(209,231,229,0.06);
  font-size: 13px; font-weight: 800; cursor: pointer;
}
</style>
