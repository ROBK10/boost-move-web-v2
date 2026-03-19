<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import { apiFetch } from "@/services/api"

// ── Types ────────────────────────────────────────────────────────────────────

interface Wish {
  id: string
  companyId: string
  companyName: string
  month: string
  selected: string[]
  annetText: string | null
  createdAt: string
}

interface Company {
  id: string
  name: string
  code: string
  userCount: number
  createdAt: string
}

interface AdminUser {
  id: string
  name: string
  email: string
  role: string
  companyId: string
  companyName: string
  createdAt: string
}

// ── State ────────────────────────────────────────────────────────────────────

const activeTab = ref<"dashboard" | "wishes" | "users" | "companies">("dashboard")

// Dashboard
const dashboard = ref<{
  totalEmployees: number
  activeUsers: number
  participationRate: number
  avgScore: number
  totalCheckins: number
  monthlySavings: number
  annualSavings: number
  roiPercent: number
  pillarAverages: { pillar: string; avg: number; pct: number }[]
  weakestPillar: { pillar: string; avg: number; pct: number } | null
  trendData: { month: string; participation: number; avgScore: number }[]
} | null>(null)

const PILLAR_LABELS: Record<string, string> = {
  bevegelse: "Bevegelse",
  stillesitting: "Stillesitting",
  sovn: "Søvn",
  kosthold: "Kosthold",
  mental: "Mental helse",
}

const nok = new Intl.NumberFormat("nb-NO", { style: "decimal", maximumFractionDigits: 0 })

function exportReport() {
  if (!dashboard.value) return
  const d = dashboard.value
  const now = new Date().toLocaleDateString("nb-NO", { year: "numeric", month: "long" })
  const lines = [
    `HMS-RAPPORT — Boost Move`,
    `Generert: ${now}`,
    ``,
    `DELTAKELSE`,
    `  Totalt ansatte: ${d.totalEmployees}`,
    `  Aktive brukere denne mnd: ${d.activeUsers}`,
    `  Deltakelsesgrad: ${d.participationRate}%`,
    `  Totalt innsjekker: ${d.totalCheckins}`,
    ``,
    `HELSESCORE`,
    `  Gjennomsnittlig helsescore: ${d.avgScore}/100`,
    `  Svakeste pilar: ${d.weakestPillar ? PILLAR_LABELS[d.weakestPillar.pillar] + ' (' + d.weakestPillar.pct + '%)' : 'N/A'}`,
    ``,
    `PILAR-FORDELING`,
    ...d.pillarAverages.map(p => `  ${PILLAR_LABELS[p.pillar] ?? p.pillar}: ${p.pct}%`),
    ``,
    `HELSEGEVINST`,
    `  Estimert månedlig besparelse: ${nok.format(d.monthlySavings)} kr`,
    `  Estimert årlig besparelse: ${nok.format(d.annualSavings)} kr`,
    `  ROI: ${d.roiPercent}%`,
    ``,
    `UTVIKLING (DELTAKELSE %)`,
    ...d.trendData.map(t => `  ${t.month}: ${t.participation}%`),
    ``,
    `---`,
    `Kilde: Helsedirektoratets DALY-modell (NLOD). STAMI: god forebygging gir 3x avkastning.`,
    `Ref: Arbeidsmiljøloven § 3-4 — arbeidsgiver skal vurdere tiltak for fysisk aktivitet.`,
    `Generert av Boost Move — app.boostmove.no`,
  ]

  const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `hms-rapport-boost-move-${new Date().toISOString().slice(0, 7)}.txt`
  a.click()
  URL.revokeObjectURL(url)
}

// Wishes
const wishes = ref<Wish[]>([])
const wishFilter = ref({ company: "", month: "" })

// Companies
const companies = ref<Company[]>([])

// Users
const users = ref<AdminUser[]>([])
const showAddUser = ref(false)
const newUser = ref({ name: "", email: "", password: "", companyId: "", role: "member" })
const addUserError = ref("")
const addUserLoading = ref(false)

const loading = ref(false)
const error = ref("")

// ── Helpers ──────────────────────────────────────────────────────────────────

const OPTION_LABELS: Record<string, string> = {
  "team-building": "Team Building",
  "fellestrening": "Fellestrening",
  "sauna": "Sauna",
  "kroppsanalyse": "Kroppsanalyse",
  "annet": "Annet",
}

function labelFor(key: string) {
  return OPTION_LABELS[key] ?? key
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("nb-NO", { day: "2-digit", month: "short", year: "numeric" })
}

// ── Data fetching ─────────────────────────────────────────────────────────────

async function fetchAll() {
  loading.value = true
  error.value = ""
  try {
    const [wRes, cRes, uRes] = await Promise.all([
      apiFetch("/admin/wishes"),
      apiFetch("/admin/companies"),
      apiFetch("/admin/users"),
    ])
    wishes.value = wRes.wishes
    companies.value = cRes.companies
    users.value = uRes.users
  } catch (e: any) {
    error.value = e?.message || "Kunne ikke laste data"
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await fetchAll()
  try {
    dashboard.value = await apiFetch("/admin/dashboard")
  } catch { /* non-critical */ }
})

// ── Computed ─────────────────────────────────────────────────────────────────

const filteredWishes = computed(() => {
  return wishes.value.filter((w) => {
    if (wishFilter.value.company && w.companyId !== wishFilter.value.company) return false
    if (wishFilter.value.month && w.month !== wishFilter.value.month) return false
    return true
  })
})

const uniqueCompaniesInWishes = computed(() => {
  const seen = new Set<string>()
  return wishes.value
    .filter((w) => { if (seen.has(w.companyId)) return false; seen.add(w.companyId); return true })
    .map((w) => ({ id: w.companyId, name: w.companyName }))
})

const uniqueMonths = computed(() => {
  return [...new Set(wishes.value.map((w) => w.month))].sort().reverse()
})

// Top categories across filtered wishes
const topCategories = computed(() => {
  const counts: Record<string, number> = {}
  for (const w of filteredWishes.value) {
    for (const s of w.selected) {
      counts[s] = (counts[s] ?? 0) + 1
    }
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([key, count]) => ({ key, label: labelFor(key), count }))
})

// ── Add user ─────────────────────────────────────────────────────────────────

async function submitAddUser() {
  addUserError.value = ""
  if (!newUser.value.name || !newUser.value.email || !newUser.value.password || !newUser.value.companyId) {
    addUserError.value = "Fyll inn alle feltene"
    return
  }
  addUserLoading.value = true
  try {
    await apiFetch("/admin/users", {
      method: "POST",
      body: JSON.stringify(newUser.value),
    })
    newUser.value = { name: "", email: "", password: "", companyId: "", role: "member" }
    showAddUser.value = false
    await fetchAll()
  } catch (e: any) {
    addUserError.value = e?.message || "Kunne ikke opprette bruker"
  } finally {
    addUserLoading.value = false
  }
}

async function changeRole(userId: string, role: string) {
  try {
    await apiFetch(`/admin/users/${userId}`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    })
    const u = users.value.find((u) => u.id === userId)
    if (u) u.role = role
  } catch (e: any) {
    alert(e?.message || "Kunne ikke endre rolle")
  }
}
</script>

<template>
  <div class="page">
    <div class="container">

      <!-- Header -->
      <header class="head">
        <h1 class="title">Admin</h1>
        <p class="subtitle">Boost Move administrasjon</p>
      </header>

      <!-- Error -->
      <div v-if="error" class="errorBanner">{{ error }}</div>

      <!-- Tabs -->
      <nav class="tabs" aria-label="Admin-faner">
        <button
          class="tab"
          :class="{ active: activeTab === 'dashboard' }"
          type="button"
          @click="activeTab = 'dashboard'"
        >
          Dashboard
        </button>
        <button
          class="tab"
          :class="{ active: activeTab === 'wishes' }"
          type="button"
          @click="activeTab = 'wishes'"
        >
          Tilbakemeldinger
          <span v-if="wishes.length" class="badge">{{ wishes.length }}</span>
        </button>
        <button
          class="tab"
          :class="{ active: activeTab === 'users' }"
          type="button"
          @click="activeTab = 'users'"
        >
          Brukere
          <span v-if="users.length" class="badge">{{ users.length }}</span>
        </button>
        <button
          class="tab"
          :class="{ active: activeTab === 'companies' }"
          type="button"
          @click="activeTab = 'companies'"
        >
          Bedrifter
          <span v-if="companies.length" class="badge">{{ companies.length }}</span>
        </button>
      </nav>

      <!-- Loading -->
      <div v-if="loading" class="loadingRow">Laster...</div>

      <!-- ── WISHES TAB ────────────────────────────────────────────────────── -->
      <!-- DASHBOARD TAB -->
      <section v-if="activeTab === 'dashboard'" class="tabContent">
        <div v-if="dashboard" class="dashboard">
          <div class="dash-grid">
            <div class="dash-card">
              <div class="dash-value accent">{{ nok.format(dashboard.monthlySavings) }} kr</div>
              <div class="dash-label">Helsegevinst denne mnd</div>
            </div>
            <div class="dash-card">
              <div class="dash-value">{{ dashboard.participationRate }}%</div>
              <div class="dash-label">Deltakelse</div>
            </div>
            <div class="dash-card">
              <div class="dash-value">{{ dashboard.avgScore }}</div>
              <div class="dash-label">Gj.snitt helsescore</div>
            </div>
            <div class="dash-card">
              <div class="dash-value">{{ dashboard.activeUsers }} / {{ dashboard.totalEmployees }}</div>
              <div class="dash-label">Aktive brukere</div>
            </div>
          </div>

          <div v-if="dashboard.pillarAverages.length > 0" class="dash-section">
            <div class="dash-section-title">Pilar-fordeling</div>
            <div class="pillar-bars">
              <div v-for="p in dashboard.pillarAverages" :key="p.pillar" class="pillar-row">
                <span class="pillar-name">{{ PILLAR_LABELS[p.pillar] ?? p.pillar }}</span>
                <div class="pillar-bar-wrap">
                  <div class="pillar-bar" :style="{ width: p.pct + '%' }" :class="{ weak: p.pct < 50 }"></div>
                </div>
                <span class="pillar-pct">{{ p.pct }}%</span>
              </div>
            </div>
          </div>

          <!-- ROI -->
          <div class="dash-section">
            <div class="dash-section-title">Avkastning (ROI)</div>
            <div class="roi-row">
              <div class="roi-item">
                <div class="roi-value accent">{{ nok.format(dashboard.annualSavings) }} kr</div>
                <div class="roi-label">Estimert årlig helsegevinst</div>
              </div>
              <div class="roi-item">
                <div class="roi-value" :class="{ 'roi-green': dashboard.roiPercent >= 100 }">{{ dashboard.roiPercent }}%</div>
                <div class="roi-label">ROI</div>
              </div>
            </div>
            <div class="roi-note">Basert på STAMI: god forebygging gir 3x avkastning. Helsegevinst beregnet fra Helsedirektoratets DALY-modell.</div>
          </div>

          <!-- Trend -->
          <div v-if="dashboard.trendData.length > 0" class="dash-section">
            <div class="dash-section-title">Utvikling siste 6 måneder</div>
            <div class="trend-grid">
              <div v-for="t in dashboard.trendData" :key="t.month" class="trend-col">
                <div class="trend-bar-wrap">
                  <div class="trend-bar" :style="{ height: t.participation + '%' }"></div>
                </div>
                <div class="trend-label">{{ t.month }}</div>
                <div class="trend-pct">{{ t.participation }}%</div>
              </div>
            </div>
          </div>

          <div v-if="dashboard.weakestPillar" class="dash-insight">
            Svakeste pilar: <strong>{{ PILLAR_LABELS[dashboard.weakestPillar.pillar] }}</strong> ({{ dashboard.weakestPillar.pct }}%)
          </div>

          <!-- Eksporter -->
          <button class="export-btn" type="button" @click="exportReport">
            Eksporter HMS-rapport
          </button>
        </div>
        <div v-else class="empty">Laster dashboard...</div>
      </section>

      <section v-else-if="activeTab === 'wishes'" class="tabContent">

        <!-- Filters -->
        <div class="filters">
          <select v-model="wishFilter.company" class="filterSelect">
            <option value="">Alle bedrifter</option>
            <option v-for="c in uniqueCompaniesInWishes" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
          <select v-model="wishFilter.month" class="filterSelect">
            <option value="">Alle måneder</option>
            <option v-for="m in uniqueMonths" :key="m" :value="m">{{ m }}</option>
          </select>
        </div>

        <!-- Top categories summary -->
        <div v-if="topCategories.length" class="summaryCard">
          <div class="summaryTitle">Mest ønsket</div>
          <div class="catList">
            <div
              v-for="cat in topCategories"
              :key="cat.key"
              class="catRow"
            >
              <span class="catLabel">{{ cat.label }}</span>
              <div class="catBarWrap">
                <div
                  class="catBar"
                  :style="{ width: `${Math.round((cat.count / filteredWishes.length) * 100)}%` }"
                ></div>
              </div>
              <span class="catCount">{{ cat.count }}</span>
            </div>
          </div>
        </div>

        <!-- Table -->
        <div class="tableWrap" v-if="filteredWishes.length">
          <table class="table">
            <thead>
              <tr>
                <th>Bedrift</th>
                <th>Måned</th>
                <th>Ønsker</th>
                <th>Fritekst</th>
                <th>Dato</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="w in filteredWishes" :key="w.id">
                <td class="bold">{{ w.companyName }}</td>
                <td>{{ w.month }}</td>
                <td>
                  <div class="chips">
                    <span v-for="s in w.selected" :key="s" class="chip">{{ labelFor(s) }}</span>
                  </div>
                </td>
                <td class="annetCell">{{ w.annetText ?? "—" }}</td>
                <td class="muted">{{ fmtDate(w.createdAt) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="empty">Ingen tilbakemeldinger ennå.</div>
      </section>

      <!-- ── USERS TAB ─────────────────────────────────────────────────────── -->
      <section v-else-if="activeTab === 'users'" class="tabContent">

        <div class="tabActions">
          <button class="primaryBtn" type="button" @click="showAddUser = !showAddUser">
            {{ showAddUser ? "Avbryt" : "+ Legg til bruker" }}
          </button>
        </div>

        <!-- Add user form -->
        <div v-if="showAddUser" class="formCard">
          <h2 class="formTitle">Ny bruker</h2>

          <div v-if="addUserError" class="formError">{{ addUserError }}</div>

          <div class="formGroup">
            <label class="formLabel">Navn</label>
            <input v-model="newUser.name" class="formInput" type="text" placeholder="Ola Nordmann" />
          </div>
          <div class="formGroup">
            <label class="formLabel">E-post</label>
            <input v-model="newUser.email" class="formInput" type="email" placeholder="ola@bedrift.no" />
          </div>
          <div class="formGroup">
            <label class="formLabel">Passord</label>
            <input v-model="newUser.password" class="formInput" type="password" placeholder="Minimum 8 tegn" />
          </div>
          <div class="formGroup">
            <label class="formLabel">Bedrift</label>
            <select v-model="newUser.companyId" class="formInput">
              <option value="" disabled>Velg bedrift</option>
              <option v-for="c in companies" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
          </div>
          <div class="formGroup">
            <label class="formLabel">Rolle</label>
            <select v-model="newUser.role" class="formInput">
              <option value="member">member</option>
              <option value="admin">admin</option>
            </select>
          </div>

          <button class="primaryBtn full" type="button" :disabled="addUserLoading" @click="submitAddUser">
            {{ addUserLoading ? "Oppretter..." : "Opprett bruker" }}
          </button>
        </div>

        <!-- Users table -->
        <div class="tableWrap" v-if="users.length">
          <table class="table">
            <thead>
              <tr>
                <th>Navn</th>
                <th>E-post</th>
                <th>Bedrift</th>
                <th>Rolle</th>
                <th>Opprettet</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="u in users" :key="u.id">
                <td class="bold">{{ u.name }}</td>
                <td class="muted">{{ u.email }}</td>
                <td>{{ u.companyName }}</td>
                <td>
                  <select
                    class="roleSelect"
                    :value="u.role"
                    @change="changeRole(u.id, ($event.target as HTMLSelectElement).value)"
                  >
                    <option value="member">member</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td class="muted">{{ fmtDate(u.createdAt) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="empty">Ingen brukere funnet.</div>
      </section>

      <!-- ── COMPANIES TAB ─────────────────────────────────────────────────── -->
      <section v-else-if="activeTab === 'companies'" class="tabContent">
        <div class="tableWrap" v-if="companies.length">
          <table class="table">
            <thead>
              <tr>
                <th>Navn</th>
                <th>Kode</th>
                <th>Brukere</th>
                <th>Opprettet</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="c in companies" :key="c.id">
                <td class="bold">{{ c.name }}</td>
                <td class="muted mono">{{ c.code }}</td>
                <td>{{ c.userCount }}</td>
                <td class="muted">{{ fmtDate(c.createdAt) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="empty">Ingen bedrifter funnet.</div>
      </section>

    </div>
  </div>
</template>

<style scoped>
.page { width: 100%; }

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px 16px 120px;
}

/* Header */
.head { margin-bottom: 24px; }
.title {
  margin: 0;
  font-size: 34px; font-weight: 900;
  letter-spacing: -0.03em; color: #FFFFFF;
}
.subtitle {
  margin: 6px 0 0;
  font-size: 14px; font-weight: 700;
  color: rgba(209,231,229,0.35);
}

.errorBanner {
  padding: 12px 16px; border-radius: 12px;
  background: rgba(239,68,68,0.10); color: #dc2626;
  font-size: 14px; font-weight: 700;
  margin-bottom: 16px;
}

/* Tabs */
.tabs {
  display: flex; gap: 4px;
  background: rgba(209,231,229,0.06);
  border-radius: 14px; padding: 4px;
  margin-bottom: 20px;
}

.tab {
  flex: 1; height: 40px;
  border: none; border-radius: 10px;
  background: transparent;
  font-size: 13px; font-weight: 800;
  color: rgba(209,231,229,0.6);
  cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 6px;
  transition: background 120ms ease, color 120ms ease;
}
.tab.active {
  background: #034044;
  color: #FFFFFF;
  box-shadow: 0 2px 8px rgba(0,0,0,0.25);
}

.badge {
  background: rgba(209,231,229,0.1);
  color: rgba(209,231,229,0.6);
  font-size: 11px; font-weight: 900;
  border-radius: 999px;
  padding: 1px 6px;
  line-height: 1.5;
}
.tab.active .badge {
  background: rgba(209,231,229,0.08);
}

.loadingRow {
  text-align: center;
  padding: 40px;
  font-size: 14px; font-weight: 700;
  color: rgba(209,231,229,0.35);
}

/* Tab content */
.tabContent { display: flex; flex-direction: column; gap: 16px; }

.tabActions { display: flex; justify-content: flex-end; }

/* Filters */
.filters { display: flex; gap: 10px; flex-wrap: wrap; }
.filterSelect {
  height: 38px; padding: 0 12px;
  border: 1px solid rgba(209,231,229,0.12);
  border-radius: 10px; background: #023238;
  font-size: 13px; font-weight: 700;
  color: #D1E7E5; cursor: pointer;
  appearance: none;
}

/* Summary card */
.summaryCard {
  background: #023238; border-radius: 20px;
  padding: 18px 20px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.25);
  border: 1px solid rgba(209,231,229,0.08);
}
.summaryTitle {
  font-size: 11px; font-weight: 900;
  letter-spacing: 0.12em; text-transform: uppercase;
  color: rgba(209,231,229,0.35);
  margin-bottom: 14px;
}
.catList { display: flex; flex-direction: column; gap: 10px; }
.catRow {
  display: flex; align-items: center; gap: 10px;
}
.catLabel {
  font-size: 13px; font-weight: 800;
  color: #FFFFFF; width: 130px; flex-shrink: 0;
}
.catBarWrap {
  flex: 1; height: 8px;
  background: rgba(209,231,229,0.08); border-radius: 999px;
  overflow: hidden;
}
.catBar {
  height: 100%;
  background: rgba(16,185,129,0.85); border-radius: 999px;
  transition: width 300ms ease;
  min-width: 4px;
}
.catCount {
  font-size: 13px; font-weight: 900;
  color: rgba(209,231,229,0.6);
  width: 24px; text-align: right;
}

/* Table */
.tableWrap {
  background: #023238; border-radius: 20px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.25);
  border: 1px solid rgba(209,231,229,0.08);
  overflow: auto;
}

.table {
  width: 100%; border-collapse: collapse;
  font-size: 13px;
}
.table th {
  padding: 12px 14px;
  text-align: left;
  font-size: 11px; font-weight: 900;
  letter-spacing: 0.10em; text-transform: uppercase;
  color: rgba(209,231,229,0.35);
  border-bottom: 1px solid rgba(209,231,229,0.08);
}
.table td {
  padding: 12px 14px;
  font-size: 13px; font-weight: 600;
  color: #D1E7E5;
  border-bottom: 1px solid rgba(209,231,229,0.08);
}
.table tbody tr:last-child td { border-bottom: none; }
.table tbody tr:hover td { background: rgba(209,231,229,0.04); }

.bold { font-weight: 800 !important; color: #FFFFFF !important; }
.muted { color: rgba(209,231,229,0.35) !important; }
.mono { font-family: monospace; font-size: 12px; }

.chips { display: flex; flex-wrap: wrap; gap: 4px; }
.chip {
  display: inline-flex; align-items: center;
  font-size: 11px; font-weight: 800;
  background: rgba(185,255,0,0.25); color: #D1E7E5;
  border-radius: 999px; padding: 2px 8px;
}

.annetCell {
  max-width: 200px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}

.roleSelect {
  height: 30px; padding: 0 8px;
  border: 1px solid rgba(209,231,229,0.12); border-radius: 8px;
  background: #023238; font-size: 12px; font-weight: 700;
  color: #D1E7E5; cursor: pointer; appearance: none;
}

/* Form card */
.formCard {
  background: #023238; border-radius: 20px;
  padding: 20px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.25);
  border: 1px solid rgba(209,231,229,0.08);
}
.formTitle {
  margin: 0 0 16px;
  font-size: 18px; font-weight: 900; color: #FFFFFF;
}
.formError {
  padding: 10px 14px; border-radius: 10px;
  background: rgba(239,68,68,0.10); color: #dc2626;
  font-size: 13px; font-weight: 700;
  margin-bottom: 14px;
}
.formGroup { display: flex; flex-direction: column; gap: 5px; margin-bottom: 12px; }
.formLabel { font-size: 12px; font-weight: 800; color: rgba(209,231,229,0.6); }
.formInput {
  height: 44px; padding: 0 14px;
  border: 1px solid rgba(209,231,229,0.12); border-radius: 12px;
  background: #034044;
  font-size: 14px; font-weight: 600; color: #D1E7E5;
  width: 100%; box-sizing: border-box;
}
.formInput:focus { outline: none; border-color: rgba(209,231,229,0.25); background: #034044; }

/* Buttons */
.primaryBtn {
  height: 44px; padding: 0 20px;
  background: #BEF201; color: #023238;
  border: none; border-radius: 12px;
  font-size: 14px; font-weight: 900;
  cursor: pointer; transition: opacity 120ms ease;
}
.primaryBtn:hover { opacity: 0.88; }
.primaryBtn:disabled { opacity: 0.5; cursor: not-allowed; }
.primaryBtn.full { width: 100%; margin-top: 4px; }

.empty {
  font-size: 14px; font-weight: 700;
  color: rgba(209,231,229,0.35);
  padding: 32px; text-align: center;
}

/* DASHBOARD */
.dashboard { display: flex; flex-direction: column; gap: 16px; }
.dash-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.dash-card {
  background: #023238; border-radius: 18px; padding: 16px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.25);
  border: 1px solid rgba(209,231,229,0.08);
  text-align: center;
}
.dash-value { font-size: 24px; font-weight: 900; color: #FFFFFF; letter-spacing: -0.02em; }
.dash-value.accent { color: rgba(190,242,1,0.95); }
.dash-label { font-size: 11px; font-weight: 800; color: rgba(209,231,229,0.35); margin-top: 4px; text-transform: uppercase; letter-spacing: 0.04em; }

.dash-section { background: #023238; border-radius: 18px; padding: 16px; box-shadow: 0 6px 18px rgba(0,0,0,0.25); border: 1px solid rgba(209,231,229,0.08); }
.dash-section-title { font-size: 12px; font-weight: 900; letter-spacing: 0.08em; color: rgba(209,231,229,0.35); text-transform: uppercase; margin-bottom: 12px; }

.pillar-bars { display: flex; flex-direction: column; gap: 10px; }
.pillar-row { display: flex; align-items: center; gap: 10px; }
.pillar-name { font-size: 13px; font-weight: 800; color: #FFFFFF; width: 90px; flex-shrink: 0; }
.pillar-bar-wrap { flex: 1; height: 8px; background: rgba(209,231,229,0.06); border-radius: 999px; overflow: hidden; }
.pillar-bar { height: 100%; background: rgba(16,185,129,0.85); border-radius: 999px; min-width: 4px; transition: width 0.4s ease; }
.pillar-bar.weak { background: rgba(239,68,68,0.75); }
.pillar-pct { font-size: 13px; font-weight: 900; color: rgba(209,231,229,0.6); width: 36px; text-align: right; }

.dash-insight {
  font-size: 14px; font-weight: 700; color: rgba(209,231,229,0.6);
  padding: 12px 16px; background: rgba(239,68,68,0.06); border-radius: 14px;
  border-left: 4px solid rgba(239,68,68,0.5);
}
.dash-insight strong { color: #FFFFFF; }

/* ROI */
.roi-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px; }
.roi-item { text-align: center; padding: 12px; background: rgba(209,231,229,0.04); border-radius: 14px; }
.roi-value { font-size: 22px; font-weight: 900; color: #FFFFFF; }
.roi-value.accent { color: rgba(190,242,1,0.95); }
.roi-value.roi-green { color: rgba(16,185,129,0.95); }
.roi-label { font-size: 11px; font-weight: 800; color: rgba(209,231,229,0.35); margin-top: 2px; }
.roi-note { font-size: 12px; font-weight: 600; color: rgba(209,231,229,0.35); line-height: 1.5; }

/* Trend */
.trend-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 6px; }
.trend-col { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.trend-bar-wrap { width: 100%; height: 80px; background: rgba(209,231,229,0.06); border-radius: 8px; display: flex; align-items: flex-end; overflow: hidden; }
.trend-bar { width: 100%; background: rgba(190,242,1,0.7); border-radius: 8px 8px 0 0; min-height: 4px; transition: height 0.4s ease; }
.trend-label { font-size: 11px; font-weight: 800; color: rgba(209,231,229,0.35); }
.trend-pct { font-size: 11px; font-weight: 900; color: rgba(209,231,229,0.6); }

/* Export */
.export-btn {
  width: 100%; height: 48px; border: none; border-radius: 14px;
  background: #BEF201; color: #023238; font-size: 15px; font-weight: 900;
  cursor: pointer; font-family: inherit;
}
.export-btn:hover { opacity: 0.9; }
</style>
