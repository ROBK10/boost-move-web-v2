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

const activeTab = ref<"wishes" | "users" | "companies">("wishes")

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

onMounted(fetchAll)

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
  letter-spacing: -0.03em; color: #111827;
}
.subtitle {
  margin: 6px 0 0;
  font-size: 14px; font-weight: 700;
  color: rgba(17,24,39,0.45);
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
  background: rgba(17,24,39,0.05);
  border-radius: 14px; padding: 4px;
  margin-bottom: 20px;
}

.tab {
  flex: 1; height: 40px;
  border: none; border-radius: 10px;
  background: transparent;
  font-size: 13px; font-weight: 800;
  color: rgba(17,24,39,0.5);
  cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 6px;
  transition: background 120ms ease, color 120ms ease;
}
.tab.active {
  background: white;
  color: #111827;
  box-shadow: 0 2px 8px rgba(17,24,39,0.08);
}

.badge {
  background: rgba(17,24,39,0.10);
  color: rgba(17,24,39,0.6);
  font-size: 11px; font-weight: 900;
  border-radius: 999px;
  padding: 1px 6px;
  line-height: 1.5;
}
.tab.active .badge {
  background: rgba(17,24,39,0.08);
}

.loadingRow {
  text-align: center;
  padding: 40px;
  font-size: 14px; font-weight: 700;
  color: rgba(17,24,39,0.45);
}

/* Tab content */
.tabContent { display: flex; flex-direction: column; gap: 16px; }

.tabActions { display: flex; justify-content: flex-end; }

/* Filters */
.filters { display: flex; gap: 10px; flex-wrap: wrap; }
.filterSelect {
  height: 38px; padding: 0 12px;
  border: 1px solid rgba(17,24,39,0.12);
  border-radius: 10px; background: white;
  font-size: 13px; font-weight: 700;
  color: #111827; cursor: pointer;
  appearance: none;
}

/* Summary card */
.summaryCard {
  background: white; border-radius: 20px;
  padding: 18px 20px;
  box-shadow: 0 4px 16px rgba(17,24,39,0.06);
  border: 1px solid rgba(17,24,39,0.07);
}
.summaryTitle {
  font-size: 11px; font-weight: 900;
  letter-spacing: 0.12em; text-transform: uppercase;
  color: rgba(17,24,39,0.35);
  margin-bottom: 14px;
}
.catList { display: flex; flex-direction: column; gap: 10px; }
.catRow {
  display: flex; align-items: center; gap: 10px;
}
.catLabel {
  font-size: 13px; font-weight: 800;
  color: #111827; width: 130px; flex-shrink: 0;
}
.catBarWrap {
  flex: 1; height: 8px;
  background: rgba(17,24,39,0.07); border-radius: 999px;
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
  color: rgba(17,24,39,0.55);
  width: 24px; text-align: right;
}

/* Table */
.tableWrap {
  background: white; border-radius: 20px;
  box-shadow: 0 4px 16px rgba(17,24,39,0.06);
  border: 1px solid rgba(17,24,39,0.07);
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
  color: rgba(17,24,39,0.35);
  border-bottom: 1px solid rgba(17,24,39,0.07);
}
.table td {
  padding: 12px 14px;
  font-size: 13px; font-weight: 600;
  color: rgba(17,24,39,0.8);
  border-bottom: 1px solid rgba(17,24,39,0.05);
}
.table tbody tr:last-child td { border-bottom: none; }
.table tbody tr:hover td { background: rgba(17,24,39,0.02); }

.bold { font-weight: 800 !important; color: #111827 !important; }
.muted { color: rgba(17,24,39,0.45) !important; }
.mono { font-family: monospace; font-size: 12px; }

.chips { display: flex; flex-wrap: wrap; gap: 4px; }
.chip {
  display: inline-flex; align-items: center;
  font-size: 11px; font-weight: 800;
  background: rgba(185,255,0,0.25); color: rgba(17,24,39,0.75);
  border-radius: 999px; padding: 2px 8px;
}

.annetCell {
  max-width: 200px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}

.roleSelect {
  height: 30px; padding: 0 8px;
  border: 1px solid rgba(17,24,39,0.12); border-radius: 8px;
  background: white; font-size: 12px; font-weight: 700;
  color: #111827; cursor: pointer; appearance: none;
}

/* Form card */
.formCard {
  background: white; border-radius: 20px;
  padding: 20px;
  box-shadow: 0 4px 16px rgba(17,24,39,0.06);
  border: 1px solid rgba(17,24,39,0.07);
}
.formTitle {
  margin: 0 0 16px;
  font-size: 18px; font-weight: 900; color: #111827;
}
.formError {
  padding: 10px 14px; border-radius: 10px;
  background: rgba(239,68,68,0.10); color: #dc2626;
  font-size: 13px; font-weight: 700;
  margin-bottom: 14px;
}
.formGroup { display: flex; flex-direction: column; gap: 5px; margin-bottom: 12px; }
.formLabel { font-size: 12px; font-weight: 800; color: rgba(17,24,39,0.55); }
.formInput {
  height: 44px; padding: 0 14px;
  border: 1px solid rgba(17,24,39,0.14); border-radius: 12px;
  background: #f9fafb;
  font-size: 14px; font-weight: 600; color: #111827;
  width: 100%; box-sizing: border-box;
}
.formInput:focus { outline: none; border-color: rgba(17,24,39,0.35); background: white; }

/* Buttons */
.primaryBtn {
  height: 44px; padding: 0 20px;
  background: #111827; color: white;
  border: none; border-radius: 12px;
  font-size: 14px; font-weight: 900;
  cursor: pointer; transition: opacity 120ms ease;
}
.primaryBtn:hover { opacity: 0.88; }
.primaryBtn:disabled { opacity: 0.5; cursor: not-allowed; }
.primaryBtn.full { width: 100%; margin-top: 4px; }

.empty {
  font-size: 14px; font-weight: 700;
  color: rgba(17,24,39,0.38);
  padding: 32px; text-align: center;
}
</style>
