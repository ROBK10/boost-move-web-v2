<!-- src/views/Movin.vue -->
<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useMovin, type MovinCategory } from "@/composables/useMovin"
import { useMovinState } from "@/composables/useMovinState"
import { useMinHelseStore } from "@/stores/minHelseStore"
import { useBoostStore } from "@/stores/boostStore"
import { useAuthStore } from "@/stores/authStore"

const router = useRouter()
const { articles } = useMovin()
const { isFave, isCompleted } = useMovinState()
const minHelse = useMinHelseStore()
const boostStore = useBoostStore()
const auth = useAuthStore()

const query = ref("")
const inputRef = ref<HTMLInputElement | null>(null)

const CATEGORY_LABELS: Record<MovinCategory, string> = {
  knowzone: "KnowZone",
  programmer: "Programmer",
  maler: "Maler",
  fordeler: "Fordeler",
  komgang: "Kom i gang",
}

const DETAIL_ROUTES: Record<MovinCategory, string> = {
  knowzone: "/movin/knowzone",
  programmer: "/movin/programmer",
  maler: "/movin/maler",
  fordeler: "/movin/fordeler",
  komgang: "/movin/kom-i-gang",
}

onMounted(async () => {
  await Promise.allSettled([
    minHelse.fetchMonthCheckins(minHelse.monthKey),
    boostStore.fetchMonthBoosts(boostStore.monthKey),
  ])
})

// ── Din reise: fase basert på total aktivitet ──────────────────────────────
const totalCheckins = computed(() => minHelse.monthCheckins.length)
const totalBoosts = computed(() => boostStore.monthTotal)

// Sjekk om Kom i gang er fullført
const KOM_I_GANG_SLUGS = [
  "kom-i-gang-introduksjon",
  "kom-i-gang-dag-1", "kom-i-gang-dag-2", "kom-i-gang-dag-3",
  "kom-i-gang-dag-4", "kom-i-gang-dag-5", "kom-i-gang-dag-6", "kom-i-gang-dag-7",
]
const komIGangDone = computed(() =>
  KOM_I_GANG_SLUGS.every(s => isCompleted(s))
)
const komIGangStarted = computed(() =>
  KOM_I_GANG_SLUGS.some(s => isCompleted(s))
)

const journeyPhase = computed(() => {
  // Fase 1 ferdig: Kom i gang fullført
  if (komIGangDone.value) {
    const total = totalCheckins.value + totalBoosts.value
    if (total < 28) return 2  // Uke 3-4: KnowZone
    return 3                   // Uke 5+: Programmer
  }
  return 1
})

// Fase 1 sub-steg: boost → kom i gang
const phase1Link = computed(() => {
  if (komIGangStarted.value || totalBoosts.value >= 1) return '/movin/kom-i-gang'
  return '/movin/boost-moment'
})
const phase1Label = computed(() => {
  if (komIGangStarted.value) return 'Fortsett'
  if (totalBoosts.value >= 1) return 'Start'
  return 'Start'
})
const phase1Desc = computed(() => {
  if (komIGangStarted.value) return 'Fortsett der du slapp'
  if (totalBoosts.value >= 1) return '7 dager med mental trening venter'
  return 'Start med en daglig Boost'
})

// Anbefalt innhold basert på "Min situasjon"
const situation = computed(() => ({
  challenge: auth.user?.healthChallenge ?? "ingen",
  struggle: auth.user?.biggestStruggle ?? "ingen",
}))

const recommendedCategory = computed(() => {
  const s = situation.value
  if (s.challenge === "rygg" || s.challenge === "nakke") return "programmer"
  if (s.struggle === "stress" || s.struggle === "sovn") return "komgang"
  if (s.struggle === "motivasjon") return "komgang"
  return "knowzone"
})

const recommendedLabel = computed(() => {
  const s = situation.value
  if (s.challenge === "rygg" || s.challenge === "nakke") return "Øvelser for kroppen"
  if (s.struggle === "stress") return "Stressmestring"
  if (s.struggle === "sovn") return "Bedre søvn"
  if (s.struggle === "motivasjon") return "Kom i gang"
  return "Lær mer om helse"
})

// ── Søk og favoritter ──────────────────────────────────────────────────────
const favorites = computed(() => articles.filter(a => isFave(a.slug)))

const results = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return []
  return articles
    .filter(a => a.title.toLowerCase().includes(q) || a.partner.toLowerCase().includes(q))
    .slice(0, 8)
})

const isSearching = computed(() => query.value.trim().length > 0)

function go(path: string) { router.push(path) }
function openResult(cat: MovinCategory, slug: string) {
  query.value = ""
  router.push(`${DETAIL_ROUTES[cat]}/${slug}`)
}
function clearSearch() {
  query.value = ""
  inputRef.value?.focus()
}
</script>

<template>
  <div class="page">
    <header class="head">
      <h1 class="title">Movin</h1>
      <p class="subtitle">Din reise til bedre helse</p>
    </header>

    <!-- Search -->
    <div class="searchWrap">
      <span class="searchIcon" aria-hidden="true"></span>
      <input
        ref="inputRef"
        v-model="query"
        class="searchInput"
        type="search"
        placeholder="Søk i alt innhold…"
        autocomplete="off"
        autocorrect="off"
        spellcheck="false"
      />
      <button v-if="isSearching" class="clearBtn" type="button" @click="clearSearch" aria-label="Tøm søk">
        <span class="clearX" aria-hidden="true"></span>
      </button>
    </div>

    <!-- Search results -->
    <section v-if="isSearching" class="results">
      <div v-if="results.length === 0" class="noResults">Ingen treff på «{{ query.trim() }}»</div>
      <button v-for="a in results" :key="a.slug" class="resultRow" type="button" @click="openResult(a.category, a.slug)">
        <div class="resultThumb">
          <img v-if="a.image" :src="a.image" :alt="a.title" class="resultImg" />
          <div v-else class="resultPlaceholder"></div>
        </div>
        <div class="resultText">
          <div class="resultTitle">{{ a.title }}</div>
          <div class="resultMeta">
            <span class="resultCat">{{ CATEGORY_LABELS[a.category] }}</span>
            <span class="resultDot"></span>
            <span class="resultPartner">{{ a.partner }}</span>
          </div>
        </div>
        <span class="resultChev"></span>
      </button>
    </section>

    <template v-if="!isSearching">

      <!-- ═══════════════════════════════════════════════════════════════════ -->
      <!-- DIN REISE                                                          -->
      <!-- ═══════════════════════════════════════════════════════════════════ -->
      <section class="journey">
        <h2 class="sectionLabel">Din reise</h2>

        <!-- Fase 1: Boost + Kom i gang -->
        <div class="journey-card" :class="{ active: journeyPhase === 1, done: journeyPhase > 1 }">
          <div class="journey-num">1</div>
          <div class="journey-content">
            <div class="journey-title">Kom i gang</div>
            <div class="journey-desc" v-if="journeyPhase === 1">{{ phase1Desc }}</div>
            <div class="journey-desc" v-else>Fullført</div>
          </div>
          <button v-if="journeyPhase === 1" class="journey-btn" @click="go(phase1Link)">{{ phase1Label }}</button>
          <span v-else class="journey-check">✓</span>
        </div>

        <!-- Fase 2: Lær mer (uke 3-4) -->
        <div class="journey-line"></div>
        <div class="journey-card" :class="{ active: journeyPhase === 2, done: journeyPhase > 2, locked: journeyPhase < 2 }">
          <div class="journey-num">2</div>
          <div class="journey-content">
            <div class="journey-title">{{ recommendedLabel }}</div>
            <div class="journey-desc" v-if="journeyPhase === 2">Utforsk artikler og kunnskap tilpasset deg</div>
            <div class="journey-desc" v-else-if="journeyPhase > 2">Fullført</div>
            <div class="journey-desc" v-else>Låses opp etter fase 1</div>
          </div>
          <button v-if="journeyPhase === 2" class="journey-btn" @click="go(DETAIL_ROUTES[recommendedCategory])">Utforsk</button>
          <span v-else-if="journeyPhase > 2" class="journey-check">✓</span>
        </div>

        <!-- Fase 3: Programmer (uke 5+) -->
        <div class="journey-line"></div>
        <div class="journey-card" :class="{ active: journeyPhase === 3, locked: journeyPhase < 3 }">
          <div class="journey-num">3</div>
          <div class="journey-content">
            <div class="journey-title">Smart bevegelse</div>
            <div class="journey-desc" v-if="journeyPhase === 3">16 uker tilpasset din hverdag</div>
            <div class="journey-desc" v-else>Låses opp etter fase 2</div>
          </div>
          <button v-if="journeyPhase === 3" class="journey-btn" @click="go('/movin/trening')">Start</button>
        </div>
      </section>

      <!-- Anbefalt for deg -->
      <section v-if="situation.challenge !== 'ingen' || situation.struggle !== 'ingen'" class="recommended">
        <h2 class="sectionLabel">Anbefalt for deg</h2>
        <button class="rec-card" @click="go(DETAIL_ROUTES[recommendedCategory])">
          <div class="rec-title">{{ recommendedLabel }}</div>
          <div class="rec-desc">Basert på din situasjon</div>
          <span class="chev"></span>
        </button>
      </section>

      <!-- Favoritter -->
      <section v-if="favorites.length > 0" class="favSection">
        <h2 class="sectionLabel">Mine favoritter</h2>
        <div class="favList">
          <button v-for="a in favorites" :key="a.slug" class="favRow" type="button" @click="openResult(a.category, a.slug)">
            <div class="favThumb">
              <img v-if="a.image" :src="a.image" :alt="a.title" class="favImg" />
              <div v-else class="favPlaceholder"></div>
            </div>
            <div class="favText">
              <div class="favTitle">{{ a.title }}</div>
              <span class="favCat">{{ CATEGORY_LABELS[a.category] }}</span>
            </div>
            <span class="favChev"></span>
          </button>
        </div>
      </section>

      <!-- ═══════════════════════════════════════════════════════════════════ -->
      <!-- UTFORSK (biblioteket — alltid tilgjengelig)                        -->
      <!-- ═══════════════════════════════════════════════════════════════════ -->
      <section class="explore">
        <h2 class="sectionLabel">Utforsk</h2>
        <div class="list">
          <button class="row" type="button" @click="go('/movin/boost-moment')">
            <div class="rowTitle">Boost Moment</div>
            <div class="rowSub">Reflekter og boost dagen</div>
            <span class="chev"></span>
          </button>

          <button class="row" type="button" @click="go('/movin/kom-i-gang')">
            <div class="rowTitle">Kom i gang</div>
            <div class="rowSub">Små steg – stor effekt</div>
            <span class="chev"></span>
          </button>

          <button class="row" type="button" @click="go('/movin/knowzone')">
            <div class="rowTitle">KnowZone</div>
            <div class="rowSub">Kunnskapsbase</div>
            <span class="chev"></span>
          </button>

          <button class="row" type="button" @click="go('/movin/trening')">
            <div class="rowTitle">Smart bevegelse</div>
            <div class="rowSub">16 uker for bedre helse</div>
            <span class="chev"></span>
          </button>

          <button class="row" type="button" @click="go('/movin/programmer')">
            <div class="rowTitle">Programmer</div>
            <div class="rowSub">Trening og opplegg</div>
            <span class="chev"></span>
          </button>

          <button class="row" type="button" @click="go('/movin/maler')">
            <div class="rowTitle">Maler</div>
            <div class="rowSub">Verktøy og skjema</div>
            <span class="chev"></span>
          </button>

          <button class="row" type="button" @click="go('/movin/fordeler')">
            <div class="rowTitle">Fordeler</div>
            <div class="rowSub">Medlemsfordeler</div>
            <span class="chev"></span>
          </button>
        </div>
      </section>

    </template>
  </div>
</template>

<style scoped>
.page { width: 100%; max-width: 520px; margin: 0 auto; padding: 18px 16px 110px; }
.head { margin-bottom: 14px; }
.title { margin: 0; font-size: 34px; line-height: 1.05; font-weight: 900; letter-spacing: -0.03em; color: #FFFFFF; }
.subtitle { margin: 8px 0 0; font-size: 14px; font-weight: 700; color: rgba(209,231,229,0.35); }

.sectionLabel {
  margin: 24px 0 12px; font-size: 13px; font-weight: 900;
  color: rgba(209,231,229,0.35); letter-spacing: 0.05em; text-transform: uppercase;
}

/* ── Journey ──────────────────────────────────────────────────────────────── */
.journey { margin-bottom: 8px; }

.journey-card {
  display: flex; align-items: center; gap: 14px;
  background: #023238; border-radius: 18px; padding: 16px;
  border: 2px solid rgba(209,231,229,0.08);
  transition: all 0.15s;
}
.journey-card.active {
  border-color: #BEF201;
  box-shadow: 0 8px 24px rgba(190,242,1,0.12);
}
.journey-card.done { opacity: 0.6; }
.journey-card.locked { opacity: 0.4; }

.journey-num {
  width: 36px; height: 36px; border-radius: 999px;
  background: rgba(209,231,229,0.06); display: grid; place-items: center;
  font-size: 15px; font-weight: 900; color: rgba(209,231,229,0.6); flex-shrink: 0;
}
.journey-card.active .journey-num {
  background: rgba(190,242,1,0.12); color: #FFFFFF;
}
.journey-card.done .journey-num {
  background: rgba(16,185,129,0.1); color: rgba(16,185,129,0.95);
}

.journey-content { flex: 1; min-width: 0; }
.journey-title { font-size: 16px; font-weight: 900; color: #FFFFFF; }
.journey-desc { font-size: 13px; font-weight: 600; color: rgba(209,231,229,0.6); margin-top: 2px; }

.journey-btn {
  padding: 8px 16px; border-radius: 12px; border: none;
  background: #BEF201; color: #023238; font-size: 13px; font-weight: 900;
  cursor: pointer; flex-shrink: 0;
}
.journey-btn:active { opacity: 0.85; }

.journey-check { font-size: 18px; font-weight: 900; color: rgba(16,185,129,0.95); }

.journey-line {
  width: 2px; height: 20px; background: rgba(209,231,229,0.08);
  margin: 0 0 0 33px;
}

/* ── Recommended ──────────────────────────────────────────────────────────── */
.rec-card {
  width: 100%; border: none; background: rgba(190,242,1,0.06);
  border-radius: 18px; padding: 16px; cursor: pointer; text-align: left;
  display: grid; grid-template-columns: 1fr auto; gap: 4px 10px;
  border: 1.5px solid rgba(190,242,1,0.2);
}
.rec-card:active { background: rgba(190,242,1,0.1); }
.rec-title { font-size: 16px; font-weight: 900; color: #FFFFFF; }
.rec-desc { font-size: 13px; font-weight: 600; color: rgba(209,231,229,0.6); grid-column: 1/2; }

/* ── Search ───────────────────────────────────────────────────────────────── */
.searchWrap { position: relative; margin-bottom: 16px; }
.searchIcon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); width: 17px; height: 17px; display: block; pointer-events: none; border: 2px solid rgba(209,231,229,0.25); border-radius: 999px; }
.searchIcon::after { content: ""; position: absolute; bottom: -5px; right: -4px; width: 2px; height: 6px; background: rgba(209,231,229,0.25); border-radius: 1px; transform: rotate(45deg); }
.searchInput { width: 100%; height: 48px; background: rgba(209,231,229,0.06); border: 1.5px solid rgba(209,231,229,0.08); border-radius: 16px; padding: 0 44px; font-size: 15px; font-weight: 600; color: #D1E7E5; outline: none; -webkit-appearance: none; appearance: none; box-sizing: border-box; }
.searchInput::placeholder { color: rgba(209,231,229,0.3); font-weight: 600; }
.searchInput:focus { border-color: rgba(209,231,229,0.15); background: #034044; }
.searchInput::-webkit-search-cancel-button { display: none; }
.clearBtn { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); width: 28px; height: 28px; border: none; background: rgba(209,231,229,0.08); border-radius: 999px; cursor: pointer; display: grid; place-items: center; }
.clearX { width: 10px; height: 10px; display: block; position: relative; }
.clearX::before, .clearX::after { content: ""; position: absolute; left: 50%; top: 50%; width: 10px; height: 2px; background: rgba(209,231,229,0.4); border-radius: 1px; }
.clearX::before { transform: translate(-50%,-50%) rotate(45deg); }
.clearX::after { transform: translate(-50%,-50%) rotate(-45deg); }

/* ── Results ──────────────────────────────────────────────────────────────── */
.results { display: flex; flex-direction: column; gap: 6px; }
.noResults { padding: 24px 4px; font-size: 14px; font-weight: 700; color: rgba(209,231,229,0.35); text-align: center; }
.resultRow { width: 100%; background: #023238; border: 1px solid rgba(209,231,229,0.08); border-radius: 18px; padding: 12px 14px; display: flex; align-items: center; gap: 12px; cursor: pointer; text-align: left; box-shadow: 0 2px 10px rgba(0,0,0,0.2); }
.resultThumb { width: 48px; height: 48px; border-radius: 12px; background: rgba(209,231,229,0.08); flex-shrink: 0; overflow: hidden; }
.resultImg { width: 100%; height: 100%; object-fit: cover; display: block; }
.resultPlaceholder { width: 100%; height: 100%; background: rgba(209,231,229,0.08); }
.resultText { flex: 1; min-width: 0; }
.resultTitle { font-size: 14px; font-weight: 800; color: rgba(209,231,229,0.95); line-height: 1.2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.resultMeta { display: flex; align-items: center; gap: 5px; margin-top: 3px; }
.resultCat { font-size: 11px; font-weight: 800; color: rgba(209,231,229,0.6); background: rgba(209,231,229,0.06); border-radius: 999px; padding: 2px 7px; }
.resultDot { width: 3px; height: 3px; border-radius: 999px; background: rgba(209,231,229,0.2); }
.resultPartner { font-size: 11px; font-weight: 700; color: rgba(209,231,229,0.35); }
.resultChev { width: 8px; height: 8px; flex-shrink: 0; border-right: 2px solid rgba(209,231,229,0.25); border-top: 2px solid rgba(209,231,229,0.25); transform: rotate(45deg); }

/* ── Favorites ────────────────────────────────────────────────────────────── */
.favSection { margin-bottom: 8px; }
.favList { display: flex; flex-direction: column; gap: 6px; }
.favRow { width: 100%; background: #023238; border: 1px solid rgba(209,231,229,0.08); border-radius: 16px; padding: 10px 12px; display: flex; align-items: center; gap: 10px; cursor: pointer; text-align: left; box-shadow: 0 2px 8px rgba(0,0,0,0.2); }
.favThumb { width: 40px; height: 40px; border-radius: 10px; background: rgba(209,231,229,0.08); flex-shrink: 0; overflow: hidden; }
.favImg { width: 100%; height: 100%; object-fit: cover; display: block; }
.favPlaceholder { width: 100%; height: 100%; background: rgba(209,231,229,0.08); }
.favText { flex: 1; min-width: 0; }
.favTitle { font-size: 13px; font-weight: 800; color: rgba(209,231,229,0.95); line-height: 1.2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.favCat { display: inline-block; margin-top: 2px; font-size: 10px; font-weight: 800; color: rgba(209,231,229,0.35); background: rgba(209,231,229,0.06); border-radius: 999px; padding: 1px 6px; }
.favChev { width: 8px; height: 8px; flex-shrink: 0; border-right: 2px solid rgba(209,231,229,0.2); border-top: 2px solid rgba(209,231,229,0.2); transform: rotate(45deg); }

/* ── Explore list ─────────────────────────────────────────────────────────── */
.list { display: flex; flex-direction: column; gap: 12px; }
.row { width: 100%; border: none; background: rgba(209,231,229,0.06); border-radius: 18px; padding: 16px; display: grid; grid-template-columns: 1fr auto; grid-template-rows: auto auto; gap: 4px 10px; cursor: pointer; text-align: left; }
.row:active { background: rgba(209,231,229,0.08); }
.rowTitle { font-size: 18px; font-weight: 900; color: rgba(209,231,229,0.95); }
.rowSub { grid-column: 1/2; font-size: 14px; font-weight: 700; color: rgba(209,231,229,0.6); }
.chev { grid-column: 2/3; grid-row: 1/3; align-self: center; width: 10px; height: 10px; border-right: 2px solid rgba(209,231,229,0.25); border-top: 2px solid rgba(209,231,229,0.25); transform: rotate(45deg); }
</style>
