<script setup lang="ts">
import { computed, ref } from "vue"
import { useRouter } from "vue-router"
import { useMovin, type MovinCategory } from "@/composables/useMovin"

const router = useRouter()
const { articles, getByCategory } = useMovin()

type Filter = "all" | MovinCategory

const activeFilter = ref<Filter>("all")

const filters: { key: Filter; label: string }[] = [
  { key: "all",        label: "Alle" },
  { key: "knowzone",   label: "KnowZone" },
  { key: "fordeler",   label: "Fordeler" },
  { key: "programmer", label: "Programmer" },
  { key: "maler",      label: "Maler" },
]

const visible = computed(() =>
  activeFilter.value === "all"
    ? articles
    : getByCategory(activeFilter.value as MovinCategory)
)

function open(slug: string) {
  router.push(`/movin/${slug}`)
}

function goBoostMoment() {
  router.push("/movin/boost-moment")
}
</script>

<template>
  <div class="page">
    <div class="container">
      <!-- Header -->
      <header class="head">
        <h1 class="title">Movin</h1>
        <p class="subtitle">Ressurser, kunnskap og fordeler</p>
      </header>

      <!-- Boost Moment shortcut -->
      <button class="boostBtn" type="button" @click="goBoostMoment">
        <div class="boostLeft">
          <div class="boostLabel">Dagens boost</div>
          <div class="boostTitle">Boost Moment</div>
        </div>
        <span class="boostChev" aria-hidden="true"></span>
      </button>

      <!-- Category filters -->
      <div class="filters" role="tablist">
        <button
          v-for="f in filters"
          :key="f.key"
          class="filterBtn"
          :class="{ active: activeFilter === f.key }"
          type="button"
          role="tab"
          :aria-selected="activeFilter === f.key"
          @click="activeFilter = f.key"
        >{{ f.label }}</button>
      </div>

      <!-- Article list -->
      <section class="list">
        <button
          v-for="a in visible"
          :key="a.slug"
          class="card"
          type="button"
          @click="open(a.slug)"
        >
          <div class="cardImg">
            <img
              v-if="a.image"
              :src="a.image"
              :alt="a.title"
              class="img"
            />
            <div v-else class="imgPlaceholder" aria-hidden="true"></div>
          </div>
          <div class="cardBody">
            <div class="cardCat">{{ a.category }}</div>
            <div class="cardTitle">{{ a.title }}</div>
            <div class="cardPartner">{{ a.partner }}</div>
          </div>
        </button>

        <div v-if="visible.length === 0" class="empty">
          Ingen innhold i denne kategorien ennå.
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.page { width: 100%; }

.container {
  max-width: 520px;
  margin: 0 auto;
  padding: 18px 16px 110px;
}

/* Header */
.head { margin-bottom: 16px; }

.title {
  margin: 0;
  font-size: 34px;
  line-height: 1.05;
  font-weight: 900;
  letter-spacing: -0.03em;
  color: #111827;
}

.subtitle {
  margin: 8px 0 0;
  font-size: 14px;
  font-weight: 700;
  color: rgba(17, 24, 39, 0.45);
}

/* Boost Moment shortcut */
.boostBtn {
  width: 100%;
  border: none;
  background: #111827;
  border-radius: 20px;
  padding: 16px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  margin-bottom: 14px;
  transition: opacity 120ms ease;
}
.boostBtn:active { opacity: 0.85; }

.boostLeft { text-align: left; }

.boostLabel {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(185, 255, 0, 0.75);
  margin-bottom: 4px;
}

.boostTitle {
  font-size: 18px;
  font-weight: 900;
  color: white;
  letter-spacing: -0.02em;
}

.boostChev {
  width: 10px;
  height: 10px;
  border-right: 2px solid rgba(255, 255, 255, 0.4);
  border-top: 2px solid rgba(255, 255, 255, 0.4);
  transform: rotate(45deg);
  flex-shrink: 0;
}

/* Filters */
.filters {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;
  padding-bottom: 2px;
  margin-bottom: 14px;
}
.filters::-webkit-scrollbar { display: none; }

.filterBtn {
  flex-shrink: 0;
  border: 1.5px solid rgba(17, 24, 39, 0.10);
  background: white;
  border-radius: 999px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 800;
  color: rgba(17, 24, 39, 0.55);
  cursor: pointer;
  transition: background 120ms ease, color 120ms ease, border-color 120ms ease;
  white-space: nowrap;
}

.filterBtn.active {
  background: #111827;
  border-color: #111827;
  color: white;
}

/* Article list */
.list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* Card */
.card {
  width: 100%;
  border: 1px solid rgba(17, 24, 39, 0.06);
  background: white;
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  text-align: left;
  box-shadow: 0 2px 10px rgba(17, 24, 39, 0.05);
  transition: box-shadow 120ms ease;
}
.card:active { box-shadow: 0 4px 18px rgba(17, 24, 39, 0.10); }

.cardImg {
  width: 100%;
  height: 160px;
  background: rgba(17, 24, 39, 0.06);
  flex-shrink: 0;
  overflow: hidden;
}

.img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.imgPlaceholder {
  width: 100%;
  height: 100%;
  background: rgba(17, 24, 39, 0.06);
}

.cardBody {
  padding: 14px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.cardCat {
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(17, 24, 39, 0.38);
}

.cardTitle {
  font-size: 16px;
  font-weight: 900;
  color: rgba(17, 24, 39, 0.92);
  letter-spacing: -0.01em;
  line-height: 1.25;
}

.cardPartner {
  font-size: 12px;
  font-weight: 700;
  color: rgba(17, 24, 39, 0.45);
}

.empty {
  font-size: 14px;
  font-weight: 700;
  color: rgba(17, 24, 39, 0.38);
  padding: 20px 4px;
  text-align: center;
}
</style>
