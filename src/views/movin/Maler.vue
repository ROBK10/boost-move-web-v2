<script setup lang="ts">
import { useRouter } from "vue-router"
import { useMovin } from "@/composables/useMovin"
import { useMovinState } from "@/composables/useMovinState"

const router = useRouter()
const { getByCategory } = useMovin()
const { isFave, toggleFave, isCompleted } = useMovinState()

const articles = getByCategory("maler")

function goBack() {
  router.push("/movin")
}

function openDetail(slug: string) {
  router.push(`/movin/maler/${slug}`)
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
          <h1 class="title">Maler</h1>
          <p class="subtitle">Praktiske verktøy og rutiner</p>
        </div>
      </header>

      <section class="list">
        <button
          v-for="a in articles"
          :key="a.slug"
          class="card"
          type="button"
          @click="openDetail(a.slug)"
        >
          <div class="cardLeft">
            <div class="thumb">
              <img v-if="a.image" :src="a.image" :alt="a.title" class="thumbImg" />
              <div v-else class="thumbPlaceholder" aria-hidden="true"></div>
            </div>
            <div class="cardMeta">
              <div class="cardTitle">{{ a.title }}</div>
              <span v-if="isCompleted(a.slug)" class="donePill">
                <span class="doneDot" aria-hidden="true"></span>
                Lastet ned
              </span>
            </div>
          </div>

          <div class="cardActions" @click.stop>
            <button
              class="starBtn"
              type="button"
              :class="{ active: isFave(a.slug) }"
              @click="toggleFave(a.slug)"
              :aria-label="isFave(a.slug) ? 'Fjern favoritt' : 'Legg til favoritt'"
            >
              <span class="starIcon" aria-hidden="true"></span>
            </button>
            <span class="chevRight" aria-hidden="true"></span>
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
  width: 44px; height: 44px;
  border: none; background: white; border-radius: 999px;
  box-shadow: 0 10px 30px rgba(20, 20, 20, 0.08);
  cursor: pointer; display: grid; place-items: center; flex-shrink: 0;
}

.chev {
  width: 12px; height: 12px;
  border-left: 2px solid rgba(17, 24, 39, 0.55);
  border-bottom: 2px solid rgba(17, 24, 39, 0.55);
  transform: rotate(45deg);
}

.title {
  margin: 0;
  font-size: 34px; line-height: 1.05;
  font-weight: 900; letter-spacing: -0.03em; color: #111827;
}

.subtitle {
  margin: 6px 0 0;
  font-size: 14px; font-weight: 700; color: rgba(17, 24, 39, 0.45);
}

.list { display: flex; flex-direction: column; gap: 10px; }

.card {
  width: 100%;
  border: 1px solid rgba(17, 24, 39, 0.07);
  background: white;
  border-radius: 20px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  box-shadow: 0 4px 16px rgba(17, 24, 39, 0.06);
  cursor: pointer;
  text-align: left;
  transition: box-shadow 120ms ease;
}
.card:active { box-shadow: 0 6px 24px rgba(17,24,39,0.10); }

.cardLeft {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  flex: 1;
}

.cardMeta {
  display: flex; flex-direction: column; gap: 4px; min-width: 0;
}

.donePill {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 11px; font-weight: 800;
  color: rgba(17,24,39,0.70);
  background: rgba(185,255,0,0.25);
  border-radius: 999px;
  padding: 3px 8px 3px 6px;
  width: fit-content;
}

.doneDot {
  width: 5px; height: 5px;
  border-radius: 999px;
  background: rgba(60,120,0,0.65);
  flex-shrink: 0;
}

.chevRight {
  width: 10px; height: 10px; flex-shrink: 0;
  border-right: 2px solid rgba(17,24,39,0.25);
  border-top: 2px solid rgba(17,24,39,0.25);
  transform: rotate(45deg);
}

.thumb {
  width: 56px; height: 56px;
  border-radius: 14px;
  background: rgba(17, 24, 39, 0.07);
  flex-shrink: 0;
  overflow: hidden;
}

.thumbImg {
  width: 100%; height: 100%;
  object-fit: cover; display: block;
}

.thumbPlaceholder {
  width: 100%; height: 100%;
  background: rgba(17, 24, 39, 0.07);
}

.cardTitle {
  font-size: 15px; font-weight: 900;
  color: rgba(17, 24, 39, 0.92); line-height: 1.2;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}

.cardActions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.starBtn {
  width: 34px; height: 34px;
  background: rgba(17,24,39,0.05); border: none; border-radius: 999px;
  display: grid; place-items: center; cursor: pointer;
  transition: background 120ms ease;
}
.starBtn:active { background: rgba(17,24,39,0.10); }
.starBtn.active { background: rgba(251,191,36,0.18); }

.starIcon {
  width: 16px; height: 16px; display: block;
  background: rgba(17,24,39,0.35);
  clip-path: polygon(50% 0%,62% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,38% 35%);
  transition: background 120ms ease;
}
.starBtn.active .starIcon { background: rgba(251,191,36,0.95); }

.empty {
  font-size: 14px; font-weight: 700;
  color: rgba(17, 24, 39, 0.38); padding: 20px 4px; text-align: center;
}
</style>
