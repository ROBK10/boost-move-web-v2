<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { useRouter } from "vue-router"
import { useAuthStore } from "@/stores/authStore"
import { useBoostStore } from "@/stores/boostStore"
import { useMinHelseStore } from "@/stores/minHelseStore"
import { useTeamStore } from "@/stores/teamStore"

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

const notificationsOn = ref(true)

onMounted(async () => {
  try {
    await boostStore.fetchMonthBoosts(boostStore.monthKey)
  } catch (err) {
    console.error("PROFIL: boost fetch error", err)
  }

  try {
    await minHelse.fetchMonthCheckins(minHelse.monthKey)
  } catch (err) {
    console.error("PROFIL: minHelse fetch error", err)
  }

  try {
    await teamStore.fetchTeamStatus()
  } catch (err) {
    console.error("PROFIL: team fetch error", err)
  }
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
      <button class="gear-btn" type="button" aria-label="Innstillinger">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
      </button>
    </header>

    <!-- PROFILE SECTION -->
    <section class="profile-section">
      <div class="avatar-wrap">
        <div class="avatar">
          <span class="avatar-initials">{{ user?.name?.charAt(0) ?? "?" }}</span>
        </div>
        <div class="edit-badge" aria-hidden="true">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </div>
      </div>
      <div class="user-name">{{ user?.name ?? "—" }}</div>
      <div class="user-email">{{ user?.email ?? "—" }}</div>
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
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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

    <!-- ACTION LIST -->
    <div class="action-list">
      <div class="action-row">
        <span class="action-icon" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </span>
        <span class="action-label">Personlige detaljer</span>
        <span class="chev" aria-hidden="true"></span>
      </div>

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
          @click="notificationsOn = !notificationsOn"
        >
          <span class="toggle-thumb"></span>
        </button>
      </div>

      <div class="action-divider"></div>

      <div class="action-row">
        <span class="action-icon" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </span>
        <span class="action-label">Personvern og sikkerhet</span>
        <span class="chev" aria-hidden="true"></span>
      </div>

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
  color: #111827;
}

.gear-btn {
  width: 44px;
  height: 44px;
  border: none;
  background: white;
  border-radius: 999px;
  box-shadow: 0 10px 30px rgba(20, 20, 20, 0.08);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(17, 24, 39, 0.7);
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
}

.avatar {
  width: 96px;
  height: 96px;
  border-radius: 999px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid white;
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.28);
}

.avatar-initials {
  font-size: 36px;
  font-weight: 900;
  color: white;
  text-transform: uppercase;
  line-height: 1;
}

.edit-badge {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 28px;
  height: 28px;
  background: #111827;
  border-radius: 999px;
  border: 2px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-name {
  font-size: 24px;
  font-weight: 900;
  letter-spacing: -0.02em;
  color: #111827;
}

.user-email {
  font-size: 14px;
  font-weight: 600;
  color: rgba(17, 24, 39, 0.5);
}

/* STATS ROW */
.stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.stat-card {
  background: white;
  border-radius: 20px;
  padding: 16px 10px 14px;
  box-shadow: 0 8px 24px rgba(20, 20, 20, 0.06);
  border: 1px solid rgba(17, 24, 39, 0.05);
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
  color: #111827;
  line-height: 1;
}

.stat-label {
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.1em;
  color: rgba(17, 24, 39, 0.42);
  text-transform: uppercase;
}

/* ACTION LIST */
.action-list {
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(20, 20, 20, 0.06);
  border: 1px solid rgba(17, 24, 39, 0.05);
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

.action-divider {
  height: 1px;
  background: rgba(17, 24, 39, 0.06);
  margin: 0 18px;
}

.action-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: rgba(17, 24, 39, 0.05);
  border-radius: 10px;
  flex-shrink: 0;
  color: rgba(17, 24, 39, 0.65);
}

.action-label {
  flex: 1;
  font-size: 15px;
  font-weight: 800;
  color: #111827;
}

.chev {
  width: 9px;
  height: 9px;
  border-right: 2px solid rgba(17, 24, 39, 0.28);
  border-top: 2px solid rgba(17, 24, 39, 0.28);
  transform: rotate(45deg);
  flex-shrink: 0;
}

/* TOGGLE */
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

.toggle.on {
  background: #16a34a;
}

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
</style>
