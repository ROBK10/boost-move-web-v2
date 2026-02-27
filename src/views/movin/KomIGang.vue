<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()

function goBack() {
  router.push("/movin")
}

type Item = {
  id: string
  title: string
  subtitle: string
  dayLabel?: string
  checked?: boolean
  starred?: boolean
  downloadable?: boolean
}

const items = ref<Item[]>([
  {
    id: "intro",
    title: "Introduksjon (les først)",
    subtitle: "Start her",
    checked: true,
    starred: false,
    downloadable: false,
  },
  {
    id: "day1",
    title: "Første dag (i dag)",
    subtitle: "Dag 1: Jeg ønsker en endring!",
    dayLabel: "1",
    checked: true,
    starred: false,
    downloadable: false,
  },
  {
    id: "day2",
    title: "Andre dag",
    subtitle: 'Dag 2: Finn ditt "hvorfor"',
    dayLabel: "2",
    checked: false,
    starred: false,
    downloadable: true,
  },
  {
    id: "day3",
    title: "Tredje dag",
    subtitle: "Dag 3: Identitet",
    dayLabel: "3",
    checked: false,
    starred: false,
    downloadable: true,
  },
  {
    id: "day4",
    title: "Fjerde dag",
    subtitle: "Dag 4: Mål",
    dayLabel: "4",
    checked: false,
    starred: false,
    downloadable: true,
  },
  {
    id: "day5",
    title: "Femte dag",
    subtitle: "Dag 5: Tanker",
    dayLabel: "5",
    checked: false,
    starred: false,
    downloadable: true,
  },
  {
    id: "day6",
    title: "Sjette dag",
    subtitle: "Dag 6: Visualisering",
    dayLabel: "6",
    checked: false,
    starred: false,
    downloadable: true,
  },
  {
    id: "day7",
    title: "Syvende dag (siste dag av startblokken)",
    subtitle: "Dag 7: Refleksjon og planlegging",
    dayLabel: "7",
    checked: false,
    starred: false,
    downloadable: false,
  },
])

function toggleStar(item: Item) {
  item.starred = !item.starred
}

function toggleDownload(item: Item) {
  // placeholder (senere: offline / lagring)
  item.downloadable = !item.downloadable
}

function openItem(item: Item) {
  // ✅ Går til detaljsiden med paging (kapittel for kapittel)
  router.push(`/movin/kom-i-gang/${item.id}`)
}
</script>

<template>
  <div class="page">
    <div class="container">
      <!-- Header -->
      <header class="head">
        <button class="back" type="button" @click="goBack" aria-label="Tilbake">
          <span class="chev" aria-hidden="true"></span>
        </button>

        <div>
          <h1 class="title">Kom i gang (mentalt)</h1>
          <p class="subtitle">Ta det rolig og se at du også lykkes!</p>
        </div>
      </header>

      <!-- Block header (accordion senere) -->
      <section class="block">
        <div class="blockTitle">7 dagers startblokk</div>
        <div class="blockChevron" aria-hidden="true"></div>
      </section>

      <!-- List -->
      <section class="list" aria-label="Startblokk">
        <button
          v-for="item in items"
          :key="item.id"
          class="row"
          type="button"
          @click="openItem(item)"
        >
          <div class="left">
            <div class="thumb" :class="{ intro: item.id === 'intro' }">
              <div v-if="item.checked" class="check" aria-hidden="true"></div>
              <div v-else class="ghostMark" aria-hidden="true"></div>

              <div v-if="item.dayLabel" class="day">{{ item.dayLabel }}</div>
              <div v-else class="qmark">?</div>
            </div>

            <div class="text">
              <div class="rowTitle">{{ item.title }}</div>
              <div class="rowSub">{{ item.subtitle }}</div>
            </div>
          </div>

          <div class="actions" @click.stop>
            <button
              class="iconBtn"
              type="button"
              :class="{ on: !!item.starred }"
              @click="toggleStar(item)"
              aria-label="Favoritt"
            >
              <span class="star" aria-hidden="true"></span>
            </button>

            <button
              class="iconBtn"
              type="button"
              :class="{ on: !!item.downloadable }"
              @click="toggleDownload(item)"
              aria-label="Lagre offline"
            >
              <span class="cloud" aria-hidden="true"></span>
            </button>
          </div>
        </button>
      </section>
    </div>
  </div>
</template>

<style scoped>
.page {
  width: 100%;
}

.container {
  max-width: 520px;
  margin: 0 auto;
  padding: 18px 16px 110px;
}

/* Header */
.head {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 14px;
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

/* Block header */
.block {
  background: rgba(17, 24, 39, 0.04);
  border-radius: 18px;
  padding: 16px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 14px 0 10px;
}

.blockTitle {
  font-size: 20px;
  font-weight: 900;
  letter-spacing: -0.02em;
  color: rgba(17, 24, 39, 0.88);
}

.blockChevron {
  width: 10px;
  height: 10px;
  border-right: 2px solid rgba(17, 24, 39, 0.45);
  border-top: 2px solid rgba(17, 24, 39, 0.45);
  transform: rotate(-45deg);
}

/* List */
.list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.row {
  width: 100%;
  border: none;
  background: rgba(17, 24, 39, 0.04);
  border-radius: 18px;
  padding: 14px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  cursor: pointer;
}

.left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.thumb {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: rgba(17, 24, 39, 0.10);
  position: relative;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  overflow: hidden;
}

.thumb.intro {
  background: rgba(16, 185, 129, 0.14);
}

.check {
  position: absolute;
  left: 8px;
  top: 8px;
  width: 16px;
  height: 16px;
  border-radius: 6px;
  background: rgba(16, 185, 129, 0.95);
}

.ghostMark {
  position: absolute;
  left: 8px;
  top: 8px;
  width: 16px;
  height: 16px;
  border-radius: 6px;
  background: rgba(17, 24, 39, 0.10);
}

.day {
  font-size: 34px;
  font-weight: 900;
  color: rgba(17, 24, 39, 0.35);
  letter-spacing: -0.04em;
}

.qmark {
  font-size: 34px;
  font-weight: 900;
  color: rgba(17, 24, 39, 0.35);
}

.text {
  min-width: 0;
  text-align: left;
}

.rowTitle {
  font-size: 18px;
  font-weight: 900;
  color: rgba(17, 24, 39, 0.92);
  line-height: 1.15;
}

.rowSub {
  margin-top: 4px;
  font-size: 14px;
  font-weight: 700;
  color: rgba(17, 24, 39, 0.55);
  line-height: 1.2;
}

.actions {
  display: flex;
  gap: 10px;
  flex-shrink: 0;
}

.iconBtn {
  width: 42px;
  height: 42px;
  border-radius: 999px;
  border: none;
  background: rgba(255, 255, 255, 0.75);
  box-shadow: 0 10px 24px rgba(20, 20, 20, 0.08);
  display: grid;
  place-items: center;
  cursor: pointer;
}

.iconBtn.on {
  background: rgba(16, 185, 129, 0.12);
}

.star {
  width: 18px;
  height: 18px;
  display: inline-block;
  background: rgba(17, 24, 39, 0.55);
  clip-path: polygon(
    50% 0%,
    62% 35%,
    98% 35%,
    68% 57%,
    79% 91%,
    50% 70%,
    21% 91%,
    32% 57%,
    2% 35%,
    38% 35%
  );
}

.iconBtn.on .star {
  background: rgba(16, 185, 129, 0.95);
}

.cloud {
  width: 20px;
  height: 14px;
  display: inline-block;
  border-radius: 999px;
  background: rgba(17, 24, 39, 0.18);
  position: relative;
}

.cloud::before {
  content: "";
  position: absolute;
  left: 2px;
  top: -5px;
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: rgba(17, 24, 39, 0.18);
}

.cloud::after {
  content: "";
  position: absolute;
  right: 2px;
  top: -6px;
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background: rgba(17, 24, 39, 0.18);
}

.iconBtn.on .cloud,
.iconBtn.on .cloud::before,
.iconBtn.on .cloud::after {
  background: rgba(16, 185, 129, 0.85);
}
</style>