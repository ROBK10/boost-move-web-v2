<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { useRouter } from "vue-router"
import { useAuthStore } from "@/stores/authStore"
import { useBoostStore } from "@/stores/boostStore"
import { useMinHelseStore } from "@/stores/minHelseStore"
import { useTeamStore } from "@/stores/teamStore"

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001"

const router = useRouter()
const auth = useAuthStore()
const boost = useBoostStore()
const minHelse = useMinHelseStore()
const teamStore = useTeamStore()

const user = computed(() => auth.user)
const boostTotal = computed(() => boost.monthTotal)
const healthScore = computed(() => minHelse.latestScore)
const teamScore = computed(() =>
  teamStore.available && teamStore.avgScore !== null ? teamStore.avgScore : null
)

const initials = computed(() => {
  const name = user.value?.name ?? ""
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return (parts[0]?.[0] ?? "?").toUpperCase()
})

const workplace = computed(() => {
  const email = user.value?.email ?? ""
  const domain = email.split("@")[1]
  return domain ? domain.split(".")[0] : null
})

const notificationsOn = ref(localStorage.getItem("bm-notifications") !== "false")
const settingsFlashing = ref(false)

function toggleNotifications() {
  notificationsOn.value = !notificationsOn.value
  localStorage.setItem("bm-notifications", String(notificationsOn.value))
}

// Avatar upload
const fileInput = ref<HTMLInputElement | null>(null)
const avatarPreview = ref<string | null>(null)
const avatarUploading = ref(false)
const avatarError = ref<string | null>(null)

const fullAvatarUrl = computed(() => {
  if (avatarPreview.value) return avatarPreview.value
  if (auth.user?.avatarUrl) return `${API_BASE}${auth.user.avatarUrl}`
  return null
})

function triggerAvatarPick() {
  fileInput.value?.click()
}

async function onAvatarChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return

  avatarError.value = null
  avatarPreview.value = URL.createObjectURL(file)
  avatarUploading.value = true
  try {
    await auth.uploadAvatar(file)
    avatarPreview.value = null
  } catch (err: any) {
    avatarPreview.value = null
    avatarError.value = err?.message || "Kunne ikke laste opp bilde. Prøv igjen."
    setTimeout(() => { avatarError.value = null }, 4000)
  } finally {
    avatarUploading.value = false
    if (fileInput.value) fileInput.value.value = ""
  }
}

onMounted(async () => {
  await Promise.allSettled([
    boost.fetchMonthBoosts(boost.monthKey),
    minHelse.fetchMonthCheckins(minHelse.monthKey),
    teamStore.fetchTeamStatus(),
  ])
})

async function onLogout() {
  await auth.logout()
  router.push("/login")
}
</script>

<template>
  <div class="profil">
    <!-- HEADER -->
    <header class="top">
      <h1 class="title">Profil</h1>
      <button class="gear-btn" type="button" aria-label="Innstillinger" @click="router.push('/profil/innstillinger')">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
      </button>
    </header>

    <!-- PROFILE SECTION -->
    <section class="profile-section">
      <button class="avatar-wrap" type="button" @click="triggerAvatarPick" aria-label="Endre profilbilde" :disabled="avatarUploading">
        <div class="avatar" :class="{ 'avatar--uploading': avatarUploading }">
          <img v-if="fullAvatarUrl" :src="fullAvatarUrl" class="avatar-img" alt="Profilbilde" />
          <span v-else class="avatar-initials">{{ initials }}</span>
        </div>
        <div class="edit-badge" aria-hidden="true">
          <svg v-if="!avatarUploading" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          <span v-else class="badge-spinner" aria-hidden="true"></span>
        </div>
      </button>
      <input ref="fileInput" type="file" accept="image/*" class="hidden-input" @change="onAvatarChange" />
      <p v-if="avatarError" class="avatar-error" role="alert">{{ avatarError }}</p>
      <div class="user-name">{{ user?.name ?? "—" }}</div>
      <div class="user-email">{{ user?.email ?? "—" }}</div>

      <div v-if="user?.role" class="user-role-badge">{{ user.role }}</div>

      <div v-if="workplace" class="user-meta-row">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
        <span>{{ workplace }}</span>
      </div>

      <button class="dm-btn" type="button" @click="router.push('/chat')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        Send direktemelding
      </button>
    </section>

    <!-- STATISTICS ROW -->
    <div class="stats-row">
      <div class="stat-card">
        <span class="stat-icon" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
            <path d="M4 22h16"/>
            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
          </svg>
        </span>
        <div class="stat-value">{{ boostTotal }}</div>
        <div class="stat-label">BOOSTS</div>
      </div>

      <div class="stat-card">
        <span class="stat-icon" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="20" x2="18" y2="10"/>
            <line x1="12" y1="20" x2="12" y2="4"/>
            <line x1="6" y1="20" x2="6" y2="14"/>
          </svg>
        </span>
        <div class="stat-value">{{ healthScore ?? "—" }}</div>
        <div class="stat-label">SCORE</div>
      </div>

      <div class="stat-card">
        <span class="stat-icon" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D1E7E5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </span>
        <div class="stat-value">{{ teamScore !== null ? teamScore : "—" }}</div>
        <div class="stat-label">LAGSCORE</div>
      </div>
    </div>

    <!-- MINE GRUPPER -->
    <div class="section-card">
      <div class="section-head">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        <span class="section-title">Mine grupper</span>
      </div>
      <div class="group-empty">
        Ingen grupper ennå
      </div>
    </div>

    <!-- ACTION LIST -->
    <div id="settings-section" class="action-list" :class="{ 'action-list--flash': settingsFlashing }">
      <button class="action-row action-row--nav" type="button" @click="router.push('/profil/personlige-detaljer')">
        <span class="action-icon" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </span>
        <span class="action-label">Personlige detaljer</span>
        <span class="chev" aria-hidden="true"></span>
      </button>

      <div class="action-divider"></div>

      <button class="action-row action-row--nav" type="button" @click="router.push('/profil/min-situasjon')">
        <span class="action-icon action-icon--sit" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
          </svg>
        </span>
        <span class="action-label">Min situasjon</span>
        <span class="chev" aria-hidden="true"></span>
      </button>

      <div class="action-divider"></div>

      <button class="action-row action-row--nav" type="button" @click="router.push('/helsekalkulator')">
        <span class="action-icon action-icon--calc" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="4" y="2" width="16" height="20" rx="2"/>
            <line x1="8" y1="6" x2="16" y2="6"/>
            <line x1="8" y1="10" x2="10" y2="10"/>
            <line x1="14" y1="10" x2="16" y2="10"/>
            <line x1="8" y1="14" x2="10" y2="14"/>
            <line x1="14" y1="14" x2="16" y2="14"/>
            <line x1="8" y1="18" x2="16" y2="18"/>
          </svg>
        </span>
        <span class="action-label">Helsekalkulator</span>
        <span class="chev" aria-hidden="true"></span>
      </button>

      <div class="action-divider"></div>

      <div class="action-row">
        <span class="action-icon" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
        </span>
        <span class="action-label">Varslinger</span>
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

      <div class="action-divider"></div>

      <button class="action-row action-row--nav" type="button" @click="router.push('/profil/personvern')">
        <span class="action-icon" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </span>
        <span class="action-label">Personvern og sikkerhet</span>
        <span class="chev" aria-hidden="true"></span>
      </button>

      <template v-if="user?.role === 'admin'">
        <div class="action-divider"></div>
        <button class="action-row action-row--nav action-row--admin" type="button" @click="router.push('/admin')">
          <span class="action-icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
            </svg>
          </span>
          <span class="action-label">Admin</span>
          <span class="chev" aria-hidden="true"></span>
        </button>
      </template>

      <div class="action-divider"></div>

      <button class="action-row logout-row" type="button" @click="onLogout" :disabled="auth.isLoading">
        <span class="action-icon logout-icon" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </span>
        <span class="action-label logout-label">{{ auth.isLoading ? "Logger ut..." : "Logg ut" }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.profil {
  max-width: 520px;
  margin: 0 auto;
  padding: 18px 16px 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* HEADER */
.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title {
  margin: 0;
  font-size: 34px;
  font-weight: 900;
  letter-spacing: -0.03em;
  color: #FFFFFF;
}

.gear-btn {
  width: 44px;
  height: 44px;
  border: none;
  background: #034044;
  border-radius: 999px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #D1E7E5;
  flex-shrink: 0;
}

/* PROFILE SECTION */
.profile-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 8px 0 4px;
}

.avatar-wrap {
  position: relative;
  width: 96px;
  height: 96px;
  margin-bottom: 4px;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
}

.avatar-wrap:disabled {
  cursor: default;
}

.avatar {
  width: 96px;
  height: 96px;
  border-radius: 999px;
  background: linear-gradient(135deg, #023238 0%, #034e56 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid rgba(209,231,229,0.15);
  box-shadow: 0 8px 24px rgba(0,0,0,0.35);
  overflow: hidden;
  transition: opacity 150ms ease;
}

.avatar--uploading {
  opacity: 0.7;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 999px;
}

.avatar-initials {
  font-size: 36px;
  font-weight: 900;
  color: white;
  text-transform: uppercase;
  line-height: 1;
}

.hidden-input {
  display: none;
}

.avatar-error {
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  color: #dc2626;
  text-align: center;
  max-width: 260px;
}

.edit-badge {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 28px;
  height: 28px;
  background: #034044;
  border-radius: 999px;
  border: 2px solid #021C20;
  display: flex;
  align-items: center;
  justify-content: center;
}

.badge-spinner {
  width: 12px;
  height: 12px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 999px;
  animation: spin 600ms linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.user-name {
  font-size: 24px;
  font-weight: 900;
  letter-spacing: -0.02em;
  color: #FFFFFF;
}

.user-email {
  font-size: 14px;
  font-weight: 600;
  color: rgba(209,231,229,0.6);
}

.user-role-badge {
  margin-top: 6px;
  display: inline-block;
  background: rgba(209,231,229,0.08);
  border-radius: 999px;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: capitalize;
  color: rgba(209,231,229,0.6);
}

.dm-btn {
  margin-top: 14px;
  height: 44px;
  padding: 0 20px;
  border: 1.5px solid rgba(209,231,229,0.12);
  border-radius: 999px;
  background: #034044;
  color: #D1E7E5;
  font-size: 14px;
  font-weight: 800;
  font-family: inherit;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 150ms ease, border-color 150ms ease;
}

.dm-btn:active {
  background: rgba(209,231,229,0.06);
}

.user-meta-row {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 700;
  color: rgba(209,231,229,0.35);
  margin-top: 2px;
}

/* MINE GRUPPER SECTION */
.section-card {
  background: #023238;
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.25);
  border: 1px solid rgba(209,231,229,0.08);
  overflow: hidden;
  padding: 16px 18px;
}

.section-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  color: rgba(209,231,229,0.6);
}

.section-title {
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 0.02em;
  color: rgba(209,231,229,0.6);
}

.group-empty {
  font-size: 14px;
  font-weight: 600;
  color: rgba(209,231,229,0.35);
  padding: 4px 0 2px;
}

/* STATS ROW */
.stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.stat-card {
  background: #023238;
  border-radius: 20px;
  padding: 16px 10px 14px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.25);
  border: 1px solid rgba(209,231,229,0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 28px;
}

.stat-value {
  font-size: 28px;
  font-weight: 900;
  letter-spacing: -0.03em;
  color: #FFFFFF;
  line-height: 1;
}

.stat-label {
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.1em;
  color: rgba(209,231,229,0.35);
  text-transform: uppercase;
}

/* ACTION LIST FLASH */
@keyframes settings-flash {
  0%   { box-shadow: 0 0 0 0 rgba(190, 242, 1, 0.3); }
  50%  { box-shadow: 0 0 0 6px rgba(190, 242, 1, 0.12); }
  100% { box-shadow: 0 0 0 0 rgba(190, 242, 1, 0); }
}

.action-list--flash {
  animation: settings-flash 700ms ease forwards;
}

/* ACTION LIST */
.action-list {
  background: #023238;
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.25);
  border: 1px solid rgba(209,231,229,0.08);
  overflow: hidden;
}

.action-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  width: 100%;
  background: none;
  border: none;
  cursor: default;
  text-align: left;
}

.action-row--nav {
  cursor: pointer;
}

.action-row--nav:active {
  background: rgba(209,231,229,0.04);
}

.soon-pill {
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(209,231,229,0.6);
  background: rgba(209,231,229,0.08);
  border-radius: 999px;
  padding: 3px 8px;
  flex-shrink: 0;
}

.action-divider {
  height: 1px;
  background: rgba(209,231,229,0.06);
  margin: 0 18px;
}

.action-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: rgba(209,231,229,0.06);
  border-radius: 10px;
  flex-shrink: 0;
  color: rgba(209,231,229,0.6);
}

.action-label {
  flex: 1;
  font-size: 15px;
  font-weight: 800;
  color: #FFFFFF;
}

.chev {
  width: 9px;
  height: 9px;
  border-right: 2px solid rgba(209,231,229,0.25);
  border-top: 2px solid rgba(209,231,229,0.25);
  transform: rotate(45deg);
  flex-shrink: 0;
}

/* TOGGLE */
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

.toggle.on {
  background: #BEF201;
}

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

.toggle.on .toggle-thumb {
  transform: translateX(20px);
}

/* LOGOUT ROW */
.logout-row {
  cursor: pointer;
}

.logout-row:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.logout-icon {
  color: #dc2626;
  background: rgba(220, 38, 38, 0.08);
}

.logout-label {
  color: #dc2626;
}

.action-icon--sit { color: #FFFFFF; background: rgba(190, 242, 1, 0.1); }
.action-icon--calc { color: #FFFFFF; background: rgba(190, 242, 1, 0.1); }
</style>
