<script setup lang="ts">
import { computed, onMounted } from "vue"
import { useBoostStore } from "@/stores/boostStore"
import { useMinHelseStore } from "@/stores/minHelseStore"

const boost = useBoostStore()
const minHelse = useMinHelseStore()

// ─── Week helpers ────────────────────────────────────────────────────────────

const DAY_LABELS = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"]

function toDateKey(d: Date): string {
  return d.toISOString().slice(0, 10)
}

function getWeekDates(): Date[] {
  const now = new Date()
  const dow = now.getDay() // 0 = Sun
  const monday = new Date(now)
  monday.setDate(now.getDate() - (dow === 0 ? 6 : dow - 1))
  monday.setHours(0, 0, 0, 0)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}

const todayKey = toDateKey(new Date())

const trackedDates = computed(() => {
  const set = new Set<string>()
  for (const c of minHelse.monthCheckins) {
    set.add(new Date(c.date).toISOString().slice(0, 10))
  }
  return set
})

const weekDays = computed(() =>
  getWeekDates().map((d, i) => {
    const key = toDateKey(d)
    return {
      label: DAY_LABELS[i],
      key,
      hasCheckin: trackedDates.value.has(key),
      isToday: key === todayKey,
      isFuture: key > todayKey,
    }
  })
)

const activeDaysThisWeek = computed(
  () => weekDays.value.filter((d) => d.hasCheckin).length
)

// ─── Month label ─────────────────────────────────────────────────────────────

const monthLabel = computed(() => {
  const [y, m] = minHelse.monthKey.split("-")
  return new Date(Number(y), Number(m) - 1, 1).toLocaleString("nb-NO", {
    month: "long",
    year: "numeric",
  })
})

// ─── No data state ────────────────────────────────────────────────────────────

const hasAnyData = computed(
  () => minHelse.monthCheckins.length > 0 || boost.monthTotal > 0
)

// ─── Activity history (oldest → newest, cap 14) ───────────────────────────────

const activityHistory = computed(() =>
  [...minHelse.monthCheckins]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-14)
)

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString("nb-NO", {
    weekday: "short",
    day: "numeric",
    month: "short",
  })
}

const CONTEXT_LABEL: Record<string, string> = {
  felt: "Ute i felt",
  kontor: "Kontor",
  hjemme: "Hjemme",
  trening: "Trening",
  pa_farten: "På farten",
}

function contextLabel(ctx: string): string {
  return CONTEXT_LABEL[ctx] ?? ctx
}

function scoreBand(score: number): "high" | "mid" | "low" {
  if (score >= 70) return "high"
  if (score >= 45) return "mid"
  return "low"
}

// ─── Boost breakdown ──────────────────────────────────────────────────────────

const BOOST_LABEL: Record<string, string> = {
  gange: "Gange",
  løping: "Løping",
  sykling: "Sykling",
  styrke: "Styrke",
  yoga: "Yoga",
  svømming: "Svømming",
  dans: "Dans",
  annet: "Annet",
}

const boostBreakdown = computed(() =>
  Object.entries(boost.byType)
    .sort((a, b) => b[1] - a[1])
    .map(([type, count]) => ({ label: BOOST_LABEL[type] ?? type, count }))
)

// ─── Mount ────────────────────────────────────────────────────────────────────

onMounted(async () => {
  try {
    await minHelse.fetchMonthCheckins(minHelse.monthKey)
  } catch (err) {
    console.error("Progresjon: minHelse fetch error", err)
  }
  try {
    await boost.fetchMonthBoosts(boost.monthKey)
  } catch (err) {
    console.error("Progresjon: boost fetch error", err)
  }
})
</script>

<template>
  <div class="progresjon">

    <!-- HEADER -->
    <header class="page-header">
      <h1 class="page-title">Progresjon</h1>
      <p class="page-sub">{{ monthLabel }}</p>
    </header>

    <!-- FULL PAGE EMPTY STATE -->
    <div v-if="!hasAnyData" class="full-empty">
      <div class="full-empty-icon" aria-hidden="true">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
          <polyline points="17 6 23 6 23 12"/>
        </svg>
      </div>
      <div class="full-empty-title">Ingen aktivitet ennå</div>
      <div class="full-empty-text">
        Start med en innsjekk i Min Helse eller fullfør et Boost Moment – så vises fremgangen din her.
      </div>
    </div>

    <template v-else>

      <!-- SUMMARY CARDS -->
      <div class="stats-row">
        <!-- Boost Moments this month (weekly data not available from API yet) -->
        <div class="stat-card">
          <span class="stat-icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
              <path d="M4 22h16"/>
              <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
              <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
            </svg>
          </span>
          <div class="stat-value">{{ boost.monthTotal }}</div>
          <div class="stat-label">Boost Moments</div>
          <div class="stat-sub">denne måneden</div>
        </div>

        <!-- Active days this week (computed from checkins) -->
        <div class="stat-card">
          <span class="stat-icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </span>
          <div class="stat-value">
            {{ activeDaysThisWeek }}<span class="stat-denom">/7</span>
          </div>
          <div class="stat-label">Aktive dager</div>
          <div class="stat-sub">denne uken</div>
        </div>

        <!-- Current streak -->
        <div class="stat-card">
          <span class="stat-icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
              <polyline points="17 6 23 6 23 12"/>
            </svg>
          </span>
          <div class="stat-value">{{ minHelse.streak }}</div>
          <div class="stat-label">Streak</div>
          <div class="stat-sub">dager på rad</div>
        </div>
      </div>

      <!-- WEEKLY ACTIVITY INDICATOR -->
      <section class="card week-card">
        <div class="card-label">Aktivitet denne uken</div>
        <div class="week-row">
          <div
            v-for="day in weekDays"
            :key="day.key"
            class="week-day"
            :class="{ 'is-today': day.isToday }"
          >
            <div
              class="week-dot"
              :class="{
                'is-checked': day.hasCheckin,
                'is-today': day.isToday,
                'is-future': day.isFuture,
              }"
              :title="day.hasCheckin ? 'Innsjekket' : day.isFuture ? '' : 'Ingen innsjekk'"
            ></div>
            <span class="week-day-label">{{ day.label }}</span>
          </div>
        </div>

        <!-- Week empty hint -->
        <p v-if="activeDaysThisWeek === 0" class="week-hint">
          Ingen innsjekk registrert ennå denne uken.
        </p>
      </section>

      <!-- BOOST TYPE BREAKDOWN -->
      <section v-if="boostBreakdown.length > 0" class="card">
        <div class="card-label">Boost typer</div>
        <div class="boost-list">
          <div v-for="item in boostBreakdown" :key="item.label" class="boost-row">
            <span class="boost-name">{{ item.label }}</span>
            <div class="boost-bar-wrap">
              <div
                class="boost-bar"
                :style="{ width: Math.round((item.count / boost.monthTotal) * 100) + '%' }"
              ></div>
            </div>
            <span class="boost-count">{{ item.count }}</span>
          </div>
        </div>
      </section>

      <!-- ACTIVITY HISTORY -->
      <section class="card">
        <div class="card-label">Aktivitetslogg</div>

        <div v-if="activityHistory.length === 0" class="list-empty">
          Ingen aktivitet logget denne måneden ennå.
        </div>

        <div v-else class="checkin-list">
          <div
            v-for="(c, i) in activityHistory"
            :key="c.id"
            class="checkin-row"
            :class="{ 'is-last': i === activityHistory.length - 1 }"
          >
            <div
              class="score-dot"
              :class="scoreBand(c.capacityScore)"
              aria-hidden="true"
            ></div>
            <div class="checkin-body">
              <div class="checkin-date">{{ formatDate(c.date) }}</div>
              <div class="checkin-ctx">{{ contextLabel(c.context) }}</div>
            </div>
            <div class="score-badge" :class="scoreBand(c.capacityScore)">
              {{ c.capacityScore }}
            </div>
          </div>
        </div>
      </section>

      <!-- BEST STREAK FOOTNOTE -->
      <p v-if="minHelse.bestStreak > 1" class="footnote">
        Beste streak denne måneden: <strong>{{ minHelse.bestStreak }} dager</strong>
      </p>

    </template>
  </div>
</template>

<style scoped>
.progresjon {
  max-width: 520px;
  margin: 0 auto;
  padding: 18px 16px 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* HEADER */
.page-header {
  margin-bottom: 2px;
}

.page-title {
  margin: 0;
  font-size: 34px;
  font-weight: 900;
  letter-spacing: -0.03em;
  color: #111827;
  line-height: 1.05;
}

.page-sub {
  margin: 4px 0 0;
  font-size: 14px;
  font-weight: 600;
  color: rgba(17, 24, 39, 0.5);
  text-transform: capitalize;
}

/* FULL EMPTY STATE */
.full-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 48px 24px 40px;
  text-align: center;
}

.full-empty-icon {
  width: 64px;
  height: 64px;
  border-radius: 20px;
  background: rgba(17, 24, 39, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(17, 24, 39, 0.3);
}

.full-empty-title {
  font-size: 17px;
  font-weight: 900;
  color: #111827;
  letter-spacing: -0.01em;
}

.full-empty-text {
  font-size: 14px;
  font-weight: 600;
  color: rgba(17, 24, 39, 0.5);
  line-height: 1.55;
  max-width: 300px;
}

/* STATS ROW */
.stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.stat-card {
  background: white;
  border-radius: 20px;
  padding: 14px 8px 12px;
  box-shadow: 0 8px 24px rgba(20, 20, 20, 0.06);
  border: 1px solid rgba(17, 24, 39, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 26px;
  margin-bottom: 2px;
}

.stat-value {
  font-size: 26px;
  font-weight: 900;
  letter-spacing: -0.03em;
  color: #111827;
  line-height: 1;
}

.stat-denom {
  font-size: 13px;
  font-weight: 700;
  color: rgba(17, 24, 39, 0.35);
  letter-spacing: 0;
}

.stat-label {
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: rgba(17, 24, 39, 0.5);
  text-align: center;
  line-height: 1.3;
}

.stat-sub {
  font-size: 10px;
  font-weight: 600;
  color: rgba(17, 24, 39, 0.3);
  text-align: center;
}

/* CARD BASE */
.card {
  background: white;
  border-radius: 20px;
  padding: 16px 16px 14px;
  box-shadow: 0 8px 24px rgba(20, 20, 20, 0.06);
  border: 1px solid rgba(17, 24, 39, 0.05);
}

.card-label {
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(17, 24, 39, 0.38);
  margin-bottom: 14px;
}

/* WEEK INDICATOR */
.week-card {
  padding-bottom: 16px;
}

.week-row {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.week-day {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.week-dot {
  width: 30px;
  height: 30px;
  border-radius: 999px;
  background: rgba(17, 24, 39, 0.06);
}

.week-dot.is-checked {
  background: #111827;
}

.week-dot.is-today:not(.is-checked) {
  box-shadow: 0 0 0 2px #111827;
}

.week-dot.is-today.is-checked {
  box-shadow: 0 0 0 2.5px rgba(17, 24, 39, 0.25);
}

.week-dot.is-future {
  background: rgba(17, 24, 39, 0.03);
}

.week-day-label {
  font-size: 10px;
  font-weight: 800;
  color: rgba(17, 24, 39, 0.38);
  letter-spacing: 0.02em;
}

.week-day.is-today .week-day-label {
  color: #111827;
  font-weight: 900;
}

.week-hint {
  margin: 12px 0 0;
  font-size: 13px;
  font-weight: 600;
  color: rgba(17, 24, 39, 0.4);
}

/* BOOST BREAKDOWN */
.boost-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.boost-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.boost-name {
  font-size: 13px;
  font-weight: 800;
  color: #111827;
  width: 72px;
  flex-shrink: 0;
}

.boost-bar-wrap {
  flex: 1;
  height: 6px;
  background: rgba(17, 24, 39, 0.07);
  border-radius: 999px;
  overflow: hidden;
}

.boost-bar {
  height: 100%;
  background: #111827;
  border-radius: 999px;
  min-width: 6px;
}

.boost-count {
  font-size: 13px;
  font-weight: 900;
  color: rgba(17, 24, 39, 0.5);
  width: 22px;
  text-align: right;
  flex-shrink: 0;
}

/* ACTIVITY HISTORY */
.list-empty {
  font-size: 14px;
  font-weight: 600;
  color: rgba(17, 24, 39, 0.4);
  padding: 4px 0;
}

.checkin-list {
  display: flex;
  flex-direction: column;
}

.checkin-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 0;
  border-bottom: 1px solid rgba(17, 24, 39, 0.06);
}

.checkin-row.is-last {
  border-bottom: none;
  padding-bottom: 2px;
}

.score-dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  flex-shrink: 0;
}

.score-dot.high { background: #16a34a; }
.score-dot.mid  { background: #d97706; }
.score-dot.low  { background: #dc2626; }

.checkin-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.checkin-date {
  font-size: 14px;
  font-weight: 800;
  color: #111827;
  text-transform: capitalize;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.checkin-ctx {
  font-size: 12px;
  font-weight: 600;
  color: rgba(17, 24, 39, 0.45);
}

.score-badge {
  font-size: 18px;
  font-weight: 900;
  letter-spacing: -0.02em;
  flex-shrink: 0;
}

.score-badge.high { color: #16a34a; }
.score-badge.mid  { color: #d97706; }
.score-badge.low  { color: #dc2626; }

/* FOOTNOTE */
.footnote {
  font-size: 13px;
  font-weight: 600;
  color: rgba(17, 24, 39, 0.4);
  text-align: center;
  margin: 0;
  padding: 0 0 4px;
}

.footnote strong {
  color: rgba(17, 24, 39, 0.7);
  font-weight: 900;
}
</style>
