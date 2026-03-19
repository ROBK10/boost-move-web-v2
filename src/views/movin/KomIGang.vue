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

const completedCount = computed(() =>
  SLUGS.filter(s => isCompleted(s)).length
)

// Finn neste ugjorte item
const nextSlug = computed(() => {
  // Først: finn item med pågående progress
  const inProgress = SLUGS.find(s => getProgress(s) > 0 && !isCompleted(s))
  if (inProgress) return inProgress
  // Ellers: første ikke-fullførte
  return SLUGS.find(s => !isCompleted(s)) ?? null
})

const nextItem = computed(() => {
  if (!nextSlug.value) return null
  return items.value.find(it => it.slug === nextSlug.value) ?? null
})

function continueNext() {
  if (nextSlug.value) router.push(`/movin/kom-i-gang/${nextSlug.value}`)
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

      <!-- Progress + fortsett -->
      <section v-if="nextItem" class="continue-card">
        <div class="continue-info">
          <div class="continue-count">{{ completedCount }} av {{ SLUGS.length }} fullført</div>
          <div class="continue-track">
            <div class="continue-fill" :style="{ width: (completedCount / SLUGS.length * 100) + '%' }"></div>
          </div>
        </div>
        <button class="continue-btn" type="button" @click="continueNext">
          {{ getProgress(nextSlug!) > 0 ? 'Fortsett' : 'Start neste' }}
        </button>
      </section>

      <section v-else class="done-banner">
        <div class="done-icon">✓</div>
        <div class="done-text">Alle {{ SLUGS.length }} dager fullført!</div>
      </section>

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
            <!-- Fullført -->
            <div v-if="isCompleted(it.slug)" class="completedPill">
              <span class="completedCheck">✓</span>
              {{ totalSteps(it.slug) }} av {{ totalSteps(it.slug) }} lest
            </div>
            <!-- Pågående -->
            <div v-else-if="getProgress(it.slug) > 0" class="resumePill">
              <span class="resumeDot" aria-hidden="true"></span>
              {{ getProgress(it.slug) }} av {{ totalSteps(it.slug) }} lest
            </div>
            <!-- Ikke startet -->
            <div v-else class="rowSub">{{ totalSteps(it.slug) }} sider</div>
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

/* Continue card */
.continue-card {
  display: flex; align-items: center; gap: 14px;
  background: #023238; border-radius: 18px; padding: 16px;
  border: 1px solid rgba(190,242,1,0.15);
  margin-bottom: 16px;
}
.continue-info { flex: 1; min-width: 0; }
.continue-count { font-size: 14px; font-weight: 800; color: #D1E7E5; margin-bottom: 8px; }
.continue-track { height: 4px; background: rgba(209,231,229,0.1); border-radius: 2px; overflow: hidden; }
.continue-fill { height: 100%; background: #BEF201; border-radius: 2px; transition: width 0.3s ease; }
.continue-btn {
  padding: 10px 18px; border-radius: 12px; border: none;
  background: #BEF201; color: #023238; font-size: 14px; font-weight: 900;
  cursor: pointer; flex-shrink: 0; white-space: nowrap;
}
.continue-btn:active { opacity: 0.85; }

/* Done banner */
.done-banner {
  display: flex; align-items: center; gap: 12px;
  background: rgba(190,242,1,0.08); border-radius: 18px; padding: 16px;
  border: 1px solid rgba(190,242,1,0.15);
  margin-bottom: 16px;
}
.done-icon { font-size: 24px; font-weight: 900; color: #BEF201; }
.done-text { font-size: 16px; font-weight: 900; color: #D1E7E5; }

/* List */
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

/* Thumbnail */
.thumb {
  width: 60px; height: 60px;
  border-radius: 15px;
  background: rgba(209,231,229,0.08);
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
  color: rgba(209,231,229,0.25);
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
  color: rgba(209,231,229,0.95); line-height: 1.2;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}

.rowSub {
  margin-top: 3px;
  font-size: 12px; font-weight: 700; color: rgba(209,231,229,0.35);
}

.completedPill {
  margin-top: 4px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11px; font-weight: 800;
  color: #BEF201;
  background: rgba(190,242,1,0.1);
  border-radius: 999px;
  padding: 3px 9px 3px 6px;
}

.completedCheck {
  font-size: 10px; font-weight: 900;
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

/* Actions */
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
</style>
