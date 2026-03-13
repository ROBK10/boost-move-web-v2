<script setup lang="ts">
import { computed } from "vue"
import { useRouter } from "vue-router"
import { useMovin, splitSteps } from "@/composables/useMovin"
import { useMovinState } from "@/composables/useMovinState"

const router = useRouter()
const { getBySlug } = useMovin()
const { isFave, toggleFave, getProgress, isCompleted } = useMovinState()

// Fixed order
const SLUGS = [
  "kom-i-gang-introduksjon",
  "kom-i-gang-dag-1",
  "kom-i-gang-dag-2",
  "kom-i-gang-dag-3",
  "kom-i-gang-dag-4",
  "kom-i-gang-dag-5",
  "kom-i-gang-dag-6",
  "kom-i-gang-dag-7",
]

const items = computed(() =>
  SLUGS.map((slug) => {
    const a = getBySlug(slug)
    const m = slug.match(/dag-(\d+)$/)
    return {
      slug,
      article: a,
      dayNum: m ? parseInt(m[1]) : null,
      isIntro: slug.endsWith("introduksjon"),
    }
  }).filter((it) => !!it.article)
)

function totalSteps(slug: string): number {
  const a = getBySlug(slug)
  return a ? splitSteps(a.content).length : 0
}

function openItem(slug: string) {
  router.push(`/movin/kom-i-gang/${slug}`)
}

function goBack() {
  router.push("/movin")
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
          <h1 class="title">Kom i gang</h1>
          <p class="subtitle">7 dagers startblokk</p>
        </div>
      </header>

      <!-- List -->
      <section class="list" aria-label="Startblokk">
        <button
          v-for="it in items"
          :key="it.slug"
          class="row"
          type="button"
          @click="openItem(it.slug)"
        >
          <!-- Thumb -->
          <div class="thumb" :class="{ intro: it.isIntro, done: isCompleted(it.slug) }">
            <img
              v-if="it.article?.image"
              :src="it.article.image"
              :alt="it.article.title"
              class="thumbImg"
            />
            <template v-else>
              <span v-if="it.dayNum !== null" class="dayNum">{{ it.dayNum }}</span>
              <span v-else class="dayIntroIcon" aria-hidden="true"></span>
            </template>
          </div>

          <!-- Text -->
          <div class="text">
            <div class="rowTitle">{{ it.article?.title }}</div>
            <!-- Progress resume badge -->
            <div v-if="getProgress(it.slug) > 0" class="resumePill">
              <span class="resumeDot" aria-hidden="true"></span>
              Side {{ getProgress(it.slug) + 1 }} av {{ totalSteps(it.slug) }}
            </div>
            <div v-else class="rowSub">{{ it.article?.partner }}</div>
          </div>

          <!-- Actions -->
          <div class="actions" @click.stop>
            <button
              class="starBtn"
              type="button"
              :class="{ active: isFave(it.slug) }"
              @click="toggleFave(it.slug)"
              :aria-label="isFave(it.slug) ? 'Fjern favoritt' : 'Legg til favoritt'"
            >
              <span class="starIcon" aria-hidden="true"></span>
            </button>
          </div>
        </button>
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
.head {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 20px;
}

.back {
  width: 42px; height: 42px;
  border: none; background: white; border-radius: 999px;
  box-shadow: 0 10px 30px rgba(20,20,20,0.08);
  cursor: pointer; display: grid; place-items: center; flex-shrink: 0;
}

.chev {
  width: 12px; height: 12px;
  border-left: 2px solid rgba(17,24,39,0.55);
  border-bottom: 2px solid rgba(17,24,39,0.55);
  transform: rotate(45deg);
}

.title {
  margin: 0;
  font-size: 34px; line-height: 1.05;
  font-weight: 900; letter-spacing: -0.03em; color: #111827;
}

.subtitle {
  margin: 6px 0 0;
  font-size: 14px; font-weight: 700; color: rgba(17,24,39,0.45);
}

/* List */
.list { display: flex; flex-direction: column; gap: 10px; }

.row {
  width: 100%;
  border: 1px solid rgba(17,24,39,0.06);
  background: white;
  border-radius: 18px;
  padding: 14px 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  text-align: left;
  box-shadow: 0 2px 10px rgba(17,24,39,0.05);
  transition: box-shadow 120ms ease;
}
.row:active { box-shadow: 0 4px 18px rgba(17,24,39,0.10); }

/* Thumbnail */
.thumb {
  width: 60px; height: 60px;
  border-radius: 15px;
  background: rgba(17,24,39,0.07);
  flex-shrink: 0;
  overflow: hidden;
  display: grid;
  place-items: center;
  position: relative;
}

.thumb.intro { background: rgba(16,185,129,0.12); }
.thumb.done  { background: rgba(185,255,0,0.18); }

.thumbImg {
  width: 100%; height: 100%;
  object-fit: cover; display: block;
}

.dayNum {
  font-size: 28px; font-weight: 900;
  color: rgba(17,24,39,0.30);
  letter-spacing: -0.04em;
  line-height: 1;
}

.dayIntroIcon {
  width: 22px; height: 22px;
  border-radius: 999px;
  border: 2.5px solid rgba(16,185,129,0.55);
  display: block;
}

/* Text */
.text { flex: 1; min-width: 0; }

.rowTitle {
  font-size: 15px; font-weight: 900;
  color: rgba(17,24,39,0.92); line-height: 1.2;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}

.rowSub {
  margin-top: 3px;
  font-size: 12px; font-weight: 700; color: rgba(17,24,39,0.45);
}

.resumePill {
  margin-top: 4px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11px; font-weight: 800;
  color: rgba(17,24,39,0.70);
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

/* Actions */
.actions { display: flex; gap: 8px; flex-shrink: 0; }

.starBtn {
  width: 38px; height: 38px;
  background: rgba(17,24,39,0.05); border: none; border-radius: 999px;
  display: grid; place-items: center; cursor: pointer;
  transition: background 120ms ease;
}
.starBtn:active { background: rgba(17,24,39,0.10); }
.starBtn.active { background: rgba(251,191,36,0.18); }

.starIcon {
  width: 16px; height: 16px; display: block;
  background: rgba(17,24,39,0.38);
  clip-path: polygon(50% 0%,62% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,38% 35%);
  transition: background 120ms ease;
}
.starBtn.active .starIcon { background: rgba(251,191,36,0.95); }
</style>
