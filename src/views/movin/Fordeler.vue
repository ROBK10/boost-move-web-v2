<script setup lang="ts">
import { useRouter } from "vue-router"
import { useMovin } from "@/composables/useMovin"
import { useMovinState } from "@/composables/useMovinState"

const router = useRouter()
const { getByCategory } = useMovin()
const { isFave, toggleFave, isCompleted } = useMovinState()

const articles = getByCategory("fordeler")
function goBack() {
  router.push("/movin")
}

function openDetail(slug: string) {
  router.push(`/movin/fordeler/${slug}`)
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
          <h1 class="title">Mine fordeler</h1>
          <p class="subtitle">Ressurser og samarbeidspartnere</p>
        </div>
      </header>

      <section class="list">
        <div v-for="a in articles" :key="a.slug" class="block">
          <button
            class="row"
            type="button"
            @click="openDetail(a.slug)"
          >
            <div class="rowLeft">
              <div class="thumb" :class="{ 'thumb--logo': !!a.partner_logo }">
                <img v-if="a.partner_logo" :src="a.partner_logo" :alt="a.partner" class="thumbLogo" />
                <img v-else-if="a.image" :src="a.image" :alt="a.title" class="thumbImg" />
                <div v-else class="thumbPlaceholder" aria-hidden="true"></div>
              </div>
              <div class="rowText">
                <div class="rowTitle">{{ a.title }}</div>
                <div class="rowPartner">{{ a.partner }}</div>
                <span v-if="isCompleted(a.slug)" class="donePill">
                  <span class="doneDot" aria-hidden="true"></span>
                  Lest
                </span>
              </div>
            </div>
            <div class="rowActions" @click.stop>
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
        </div>

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

.block { display: flex; flex-direction: column; }

.row {
  width: 100%;
  border: 1px solid rgba(209,231,229,0.08);
  background: #023238;
  border-radius: 20px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(0,0,0,0.25);
  transition: box-shadow 160ms ease, background 120ms ease, border-color 160ms ease;
  text-align: left;
}

.row:active { background: rgba(209,231,229,0.04); }

.rowLeft { display: flex; align-items: center; gap: 12px; min-width: 0; }

.thumb {
  width: 56px; height: 56px;
  border-radius: 14px;
  background: rgba(209,231,229,0.08);
  flex-shrink: 0;
  overflow: hidden;
  position: relative;
  display: grid;
  place-items: center;
}

.thumb--logo {
  background: #023238;
  border: 1px solid rgba(209,231,229,0.08);
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  padding: 6px;
}

.thumbLogo {
  width: 100%; height: 100%;
  object-fit: contain; display: block;
}

.thumbImg {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  object-fit: cover; display: block;
}

.thumbPlaceholder {
  width: 100%; height: 100%;
  background: rgba(209,231,229,0.08);
}

.rowText { min-width: 0; }

.rowTitle {
  font-size: 15px; font-weight: 900;
  color: rgba(209,231,229,0.95); line-height: 1.2;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}

.rowPartner {
  margin-top: 3px;
  font-size: 12px; font-weight: 700; color: rgba(209,231,229,0.35);
}

.rowActions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.starBtn {
  width: 34px; height: 34px;
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

.chevRight {
  width: 10px; height: 10px; flex-shrink: 0;
  border-right: 2px solid rgba(209,231,229,0.25);
  border-bottom: 2px solid rgba(209,231,229,0.25);
  transform: rotate(-45deg);
}

.donePill {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 10px; font-weight: 800;
  color: rgba(209,231,229,0.6);
  background: rgba(185,255,0,0.25);
  border-radius: 999px;
  padding: 2px 7px 2px 5px;
  margin-top: 3px;
  width: fit-content;
}

.doneDot {
  width: 5px; height: 5px;
  border-radius: 999px;
  background: rgba(60,120,0,0.65);
  flex-shrink: 0;
}


.empty {
  font-size: 14px; font-weight: 700;
  color: rgba(209,231,229,0.35); padding: 20px 4px; text-align: center;
}

</style>
