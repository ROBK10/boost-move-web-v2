<script setup lang="ts">
import { useRouter } from "vue-router"
import { useMovin, splitSteps } from "@/composables/useMovin"
import { useMovinState } from "@/composables/useMovinState"

const router = useRouter()
const { getByCategory } = useMovin()
const { isFave, toggleFave, getProgress } = useMovinState()

const articles = getByCategory("programmer")

function totalSteps(slug: string): number {
  const a = articles.find(a => a.slug === slug)
  return a ? splitSteps(a.content).length : 0
}

function openItem(slug: string) {
  router.push(`/movin/programmer/${slug}`)
}

function goBack() {
  router.push("/movin")
}
</script>

<template>
  <div class="page">
    <div class="container">
      <header class="head">
        <button class="back" type="button" @click="goBack" aria-label="Tilbake">
          <span class="chev" aria-hidden="true"></span>
        </button>
        <div>
          <h1 class="title">Programmer</h1>
          <p class="subtitle">Strukturerte treningsprogrammer</p>
        </div>
      </header>

      <section class="list" aria-label="Treningsprogrammer">
        <button
          v-for="a in articles"
          :key="a.slug"
          class="row"
          type="button"
          @click="openItem(a.slug)"
        >
          <div class="thumb">
            <img v-if="a.image" :src="a.image" :alt="a.title" class="thumbImg" />
            <div v-else class="thumbPlaceholder" aria-hidden="true"></div>
          </div>

          <div class="text">
            <div class="rowTitle">{{ a.title }}</div>
            <div v-if="getProgress(a.slug) > 0" class="resumePill">
              <span class="resumeDot" aria-hidden="true"></span>
              Side {{ getProgress(a.slug) + 1 }} av {{ totalSteps(a.slug) }}
            </div>
            <div v-else class="rowSub">{{ a.partner }}</div>
          </div>

          <div class="actions" @click.stop>
            <button
              class="starBtn"
              type="button"
              :class="{ active: isFave(a.slug) }"
              @click="toggleFave(a.slug)"
              :aria-label="isFave(a.slug) ? 'Fjern favoritt' : 'Legg til favoritt'"
            >
              <span class="starIcon" aria-hidden="true"></span>
            </button>
          </div>
        </button>

        <div v-if="articles.length === 0" class="empty">Innhold kommer snart.</div>
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

.head {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 20px;
}

.back {
  width: 42px; height: 42px;
  border: none; background: #023238; border-radius: 999px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  cursor: pointer; display: grid; place-items: center; flex-shrink: 0;
}

.chev {
  width: 12px; height: 12px;
  border-left: 2px solid rgba(209,231,229,0.5);
  border-bottom: 2px solid rgba(209,231,229,0.5);
  transform: rotate(45deg);
}

.title {
  margin: 0;
  font-size: 34px; line-height: 1.05;
  font-weight: 900; letter-spacing: -0.03em; color: #FFFFFF;
}

.subtitle {
  margin: 6px 0 0;
  font-size: 14px; font-weight: 700; color: rgba(209,231,229,0.35);
}

.list { display: flex; flex-direction: column; gap: 10px; }

.row {
  width: 100%;
  border: 1px solid rgba(209,231,229,0.08);
  background: #023238;
  border-radius: 18px;
  padding: 14px 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  text-align: left;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  transition: box-shadow 120ms ease;
}
.row:active { box-shadow: 0 4px 18px rgba(0,0,0,0.25); }

.thumb {
  width: 60px; height: 60px;
  border-radius: 15px;
  background: rgba(209,231,229,0.08);
  flex-shrink: 0;
  overflow: hidden;
  display: grid;
  place-items: center;
}

.thumbImg {
  width: 100%; height: 100%;
  object-fit: cover; display: block;
}

.thumbPlaceholder {
  width: 100%; height: 100%;
  background: rgba(209,231,229,0.08);
}

.text { flex: 1; min-width: 0; }

.rowTitle {
  font-size: 15px; font-weight: 900;
  color: rgba(209,231,229,0.95); line-height: 1.2;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}

.rowSub {
  margin-top: 3px;
  font-size: 12px; font-weight: 700; color: rgba(209,231,229,0.35);
}

.resumePill {
  margin-top: 4px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11px; font-weight: 800;
  color: #D1E7E5;
  background: rgba(185,255,0,0.25);
  border-radius: 999px;
  padding: 3px 9px 3px 6px;
}

.resumeDot {
  width: 6px; height: 6px;
  border-radius: 999px;
  background: rgba(60,120,0,0.60);
  flex-shrink: 0;
}

.actions { display: flex; gap: 8px; flex-shrink: 0; }

.starBtn {
  width: 38px; height: 38px;
  background: rgba(209,231,229,0.06); border: none; border-radius: 999px;
  display: grid; place-items: center; cursor: pointer;
  transition: background 120ms ease;
}
.starBtn:active { background: rgba(209,231,229,0.1); }
.starBtn.active { background: rgba(251,191,36,0.18); }

.starIcon {
  width: 16px; height: 16px; display: block;
  background: rgba(209,231,229,0.3);
  clip-path: polygon(50% 0%,62% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,38% 35%);
  transition: background 120ms ease;
}
.starBtn.active .starIcon { background: rgba(251,191,36,0.95); }

.empty {
  font-size: 14px; font-weight: 700;
  color: rgba(209,231,229,0.35); padding: 20px 4px; text-align: center;
}
</style>
