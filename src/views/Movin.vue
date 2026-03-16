<!-- src/views/Movin.vue -->
<script setup lang="ts">
import { ref, computed } from "vue"
import { useRouter } from "vue-router"
import { useMovin, type MovinCategory } from "@/composables/useMovin"
import { useMovinState } from "@/composables/useMovinState"

const router = useRouter()
const { articles } = useMovin()
const { isFave } = useMovinState()

const query = ref("")
const inputRef = ref<HTMLInputElement | null>(null)

const CATEGORY_ROUTES: Record<MovinCategory, string> = {
  knowzone:  "/movin/knowzone",
  programmer: "/movin/programmer",
  maler:     "/movin/maler",
  fordeler:  "/movin/fordeler",
  komgang:   "/movin/kom-i-gang",
}

const CATEGORY_LABELS: Record<MovinCategory, string> = {
  knowzone:   "KnowZone",
  programmer: "Programmer",
  maler:      "Maler",
  fordeler:   "Fordeler",
  komgang:    "Kom i gang",
}

const DETAIL_ROUTES: Record<MovinCategory, string> = {
  knowzone:   "/movin/knowzone",
  programmer: "/movin/programmer",
  maler:      "/movin/maler",
  fordeler:   "/movin/fordeler",
  komgang:    "/movin/kom-i-gang",
}

const favorites = computed(() =>
  articles.filter(a => isFave(a.slug))
)

const results = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return []
  return articles
    .filter(a =>
      a.title.toLowerCase().includes(q) ||
      a.partner.toLowerCase().includes(q)
    )
    .slice(0, 8)
})

const isSearching = computed(() => query.value.trim().length > 0)

function go(path: string) {
  router.push(path)
}

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
      <p class="subtitle">Velg hva du vil gjøre i dag</p>
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
      <button
        v-if="isSearching"
        class="clearBtn"
        type="button"
        @click="clearSearch"
        aria-label="Tøm søk"
      >
        <span class="clearX" aria-hidden="true"></span>
      </button>
    </div>

    <!-- Search results -->
    <section v-if="isSearching" class="results">
      <div v-if="results.length === 0" class="noResults">
        Ingen treff på «{{ query.trim() }}»
      </div>
      <button
        v-for="a in results"
        :key="a.slug"
        class="resultRow"
        type="button"
        @click="openResult(a.category, a.slug)"
      >
        <div class="resultThumb">
          <img v-if="a.image" :src="a.image" :alt="a.title" class="resultImg" />
          <div v-else class="resultPlaceholder" aria-hidden="true"></div>
        </div>
        <div class="resultText">
          <div class="resultTitle">{{ a.title }}</div>
          <div class="resultMeta">
            <span class="resultCat">{{ CATEGORY_LABELS[a.category] }}</span>
            <span class="resultDot" aria-hidden="true"></span>
            <span class="resultPartner">{{ a.partner }}</span>
          </div>
        </div>
        <span class="resultChev" aria-hidden="true"></span>
      </button>
    </section>

    <!-- Favorites (hidden while searching) -->
    <section v-if="!isSearching && favorites.length > 0" class="favSection">
      <h2 class="sectionLabel">Mine favoritter</h2>
      <div class="favList">
        <button
          v-for="a in favorites"
          :key="a.slug"
          class="favRow"
          type="button"
          @click="openResult(a.category, a.slug)"
        >
          <div class="favThumb">
            <img v-if="a.image" :src="a.image" :alt="a.title" class="favImg" />
            <div v-else class="favPlaceholder" aria-hidden="true"></div>
          </div>
          <div class="favText">
            <div class="favTitle">{{ a.title }}</div>
            <span class="favCat">{{ CATEGORY_LABELS[a.category] }}</span>
          </div>
          <span class="favChev" aria-hidden="true"></span>
        </button>
      </div>
    </section>

    <!-- Category list (always visible when not searching) -->
    <section v-if="!isSearching" class="list">
      <button class="row" type="button" @click="go('/movin/boost-moment')">
        <div class="rowTitle">Boost Moment</div>
        <div class="rowSub">Dagens mentale boost</div>
        <span class="chev" aria-hidden="true"></span>
      </button>

      <button class="row" type="button" @click="go('/movin/kom-i-gang')">
        <div class="rowTitle">Kom i gang</div>
        <div class="rowSub">Små steg – stor effekt</div>
        <span class="chev" aria-hidden="true"></span>
      </button>

      <button class="row" type="button" @click="go('/movin/knowzone')">
        <div class="rowTitle">KnowZone</div>
        <div class="rowSub">Kunnskapsbase</div>
        <span class="chev" aria-hidden="true"></span>
      </button>

      <button class="row" type="button" @click="go('/movin/programmer')">
        <div class="rowTitle">Programmer</div>
        <div class="rowSub">Trening og opplegg</div>
        <span class="chev" aria-hidden="true"></span>
      </button>

      <button class="row" type="button" @click="go('/movin/maler')">
        <div class="rowTitle">Maler</div>
        <div class="rowSub">Verktøy og skjema</div>
        <span class="chev" aria-hidden="true"></span>
      </button>

      <button class="row" type="button" @click="go('/movin/fordeler')">
        <div class="rowTitle">Fordeler</div>
        <div class="rowSub">Hva får du igjen?</div>
        <span class="chev" aria-hidden="true"></span>
      </button>
    </section>
  </div>
</template>

<style scoped>
.page {
  width: 100%;
  max-width: 520px;
  margin: 0 auto;
  padding: 18px 16px 110px;
}

.head { margin-bottom: 14px; }

.title {
  margin: 0;
  font-size: 34px; line-height: 1.05;
  font-weight: 900; letter-spacing: -0.03em; color: #111827;
}

.subtitle {
  margin: 8px 0 0;
  font-size: 14px; font-weight: 700; color: rgba(17,24,39,0.45);
}

/* Search */
.searchWrap {
  position: relative;
  margin-bottom: 16px;
}

.searchIcon {
  position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
  width: 17px; height: 17px; display: block; pointer-events: none;
  border: 2px solid rgba(17,24,39,0.30);
  border-radius: 999px;
}
.searchIcon::after {
  content: "";
  position: absolute;
  bottom: -5px; right: -4px;
  width: 2px; height: 6px;
  background: rgba(17,24,39,0.30);
  border-radius: 1px;
  transform: rotate(45deg);
}

.searchInput {
  width: 100%;
  height: 48px;
  background: rgba(17,24,39,0.05);
  border: 1.5px solid rgba(17,24,39,0.07);
  border-radius: 16px;
  padding: 0 44px 0 44px;
  font-size: 15px; font-weight: 600; color: #111827;
  outline: none;
  transition: border-color 120ms ease, background 120ms ease;
  -webkit-appearance: none;
  appearance: none;
  box-sizing: border-box;
}
.searchInput::placeholder { color: rgba(17,24,39,0.35); font-weight: 600; }
.searchInput:focus {
  border-color: rgba(17,24,39,0.18);
  background: white;
}
.searchInput::-webkit-search-cancel-button { display: none; }

.clearBtn {
  position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
  width: 28px; height: 28px;
  border: none; background: rgba(17,24,39,0.08); border-radius: 999px;
  cursor: pointer; display: grid; place-items: center;
  transition: background 120ms ease;
}
.clearBtn:active { background: rgba(17,24,39,0.14); }

.clearX {
  width: 10px; height: 10px; display: block; position: relative;
}
.clearX::before, .clearX::after {
  content: "";
  position: absolute;
  left: 50%; top: 50%;
  width: 10px; height: 2px;
  background: rgba(17,24,39,0.50);
  border-radius: 1px;
}
.clearX::before { transform: translate(-50%, -50%) rotate(45deg); }
.clearX::after  { transform: translate(-50%, -50%) rotate(-45deg); }

/* Results */
.results {
  display: flex; flex-direction: column; gap: 6px;
}

.noResults {
  padding: 24px 4px;
  font-size: 14px; font-weight: 700;
  color: rgba(17,24,39,0.38); text-align: center;
}

.resultRow {
  width: 100%;
  background: white;
  border: 1px solid rgba(17,24,39,0.07);
  border-radius: 18px;
  padding: 12px 14px;
  display: flex; align-items: center; gap: 12px;
  cursor: pointer; text-align: left;
  box-shadow: 0 2px 10px rgba(17,24,39,0.05);
  transition: box-shadow 120ms ease;
}
.resultRow:active { box-shadow: 0 4px 18px rgba(17,24,39,0.09); }

.resultThumb {
  width: 48px; height: 48px;
  border-radius: 12px;
  background: rgba(17,24,39,0.07);
  flex-shrink: 0; overflow: hidden;
}

.resultImg {
  width: 100%; height: 100%; object-fit: cover; display: block;
}

.resultPlaceholder {
  width: 100%; height: 100%;
  background: rgba(17,24,39,0.07);
}

.resultText { flex: 1; min-width: 0; }

.resultTitle {
  font-size: 14px; font-weight: 800;
  color: rgba(17,24,39,0.92); line-height: 1.2;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}

.resultMeta {
  display: flex; align-items: center; gap: 5px;
  margin-top: 3px;
}

.resultCat {
  font-size: 11px; font-weight: 800;
  color: rgba(17,24,39,0.55);
  background: rgba(17,24,39,0.06);
  border-radius: 999px;
  padding: 2px 7px;
}

.resultDot {
  width: 3px; height: 3px;
  border-radius: 999px;
  background: rgba(17,24,39,0.25);
  flex-shrink: 0;
}

.resultPartner {
  font-size: 11px; font-weight: 700;
  color: rgba(17,24,39,0.38);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}

.resultChev {
  width: 8px; height: 8px; flex-shrink: 0;
  border-right: 2px solid rgba(17,24,39,0.25);
  border-top: 2px solid rgba(17,24,39,0.25);
  transform: rotate(45deg);
}

/* Favorites */
.favSection { margin-bottom: 20px; }

.sectionLabel {
  margin: 0 0 10px;
  font-size: 13px; font-weight: 800;
  color: rgba(17,24,39,0.40);
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.favList { display: flex; flex-direction: column; gap: 6px; }

.favRow {
  width: 100%;
  background: white;
  border: 1px solid rgba(17,24,39,0.07);
  border-radius: 16px;
  padding: 10px 12px;
  display: flex; align-items: center; gap: 10px;
  cursor: pointer; text-align: left;
  box-shadow: 0 2px 8px rgba(17,24,39,0.04);
  transition: box-shadow 120ms ease;
}
.favRow:active { box-shadow: 0 4px 16px rgba(17,24,39,0.08); }

.favThumb {
  width: 40px; height: 40px;
  border-radius: 10px;
  background: rgba(17,24,39,0.07);
  flex-shrink: 0; overflow: hidden;
}

.favImg { width: 100%; height: 100%; object-fit: cover; display: block; }

.favPlaceholder { width: 100%; height: 100%; background: rgba(17,24,39,0.07); }

.favText { flex: 1; min-width: 0; }

.favTitle {
  font-size: 13px; font-weight: 800;
  color: rgba(17,24,39,0.90); line-height: 1.2;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}

.favCat {
  display: inline-block;
  margin-top: 2px;
  font-size: 10px; font-weight: 800;
  color: rgba(17,24,39,0.45);
  background: rgba(17,24,39,0.05);
  border-radius: 999px;
  padding: 1px 6px;
}

.favChev {
  width: 8px; height: 8px; flex-shrink: 0;
  border-right: 2px solid rgba(17,24,39,0.20);
  border-top: 2px solid rgba(17,24,39,0.20);
  transform: rotate(45deg);
}

/* Category list */
.list {
  display: flex; flex-direction: column; gap: 12px;
}

.row {
  width: 100%;
  border: none;
  background: rgba(17,24,39,0.04);
  border-radius: 18px;
  padding: 16px 16px;
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: auto auto;
  gap: 4px 10px;
  cursor: pointer;
  text-align: left;
  transition: background 120ms ease;
}
.row:active { background: rgba(17,24,39,0.07); }

.rowTitle {
  font-size: 18px; font-weight: 900; color: rgba(17,24,39,0.92);
}

.rowSub {
  grid-column: 1 / 2;
  font-size: 14px; font-weight: 700; color: rgba(17,24,39,0.55);
}

.chev {
  grid-column: 2 / 3;
  grid-row: 1 / 3;
  align-self: center;
  width: 10px; height: 10px;
  border-right: 2px solid rgba(17,24,39,0.25);
  border-top: 2px solid rgba(17,24,39,0.25);
  transform: rotate(45deg);
}
</style>
