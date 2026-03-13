<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"
import { useMovin } from "@/composables/useMovin"
import { useMovinState } from "@/composables/useMovinState"

const router = useRouter()
const { getByCategory } = useMovin()
const { isFave, toggleFave } = useMovinState()

const articles = getByCategory("fordeler")
const openSlug = ref<string | null>(null)

function toggle(slug: string) {
  openSlug.value = openSlug.value === slug ? null : slug
}

function goBack() {
  router.push("/movin")
}

function openPdf(url: string) {
  window.open(url, "_blank")
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
            :class="{ 'row--open': openSlug === a.slug }"
            type="button"
            @click="toggle(a.slug)"
            :aria-expanded="openSlug === a.slug"
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
              <span class="chevRight" :class="{ open: openSlug === a.slug }" aria-hidden="true"></span>
            </div>
          </button>

          <Transition name="expand">
            <div v-if="openSlug === a.slug" class="body">
              <article class="content" v-html="a.content"></article>

              <footer class="footer">
                <div v-if="a.partner_logo" class="partnerRow">
                  <img :src="a.partner_logo" :alt="a.partner" class="partnerLogo" />
                  <span class="partnerName">Levert i samarbeid med {{ a.partner }}</span>
                </div>
                <div v-else class="partnerName">Levert i samarbeid med {{ a.partner }}</div>

                <button v-if="a.pdf" class="pdfBtn" type="button" @click="openPdf(a.pdf)">
                  <span class="dlIcon" aria-hidden="true"></span>
                  Last ned original PDF
                </button>

                <div class="copyright">© Boost Move</div>
              </footer>
            </div>
          </Transition>
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

.block { display: flex; flex-direction: column; }

.row {
  width: 100%;
  border: 1px solid rgba(17, 24, 39, 0.07);
  background: white;
  border-radius: 20px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(17, 24, 39, 0.06);
  transition: box-shadow 160ms ease, background 120ms ease, border-color 160ms ease;
  text-align: left;
}

.row--open {
  background: #f8f9fb;
  box-shadow: 0 8px 28px rgba(17, 24, 39, 0.10);
  border-color: rgba(17, 24, 39, 0.11);
  border-radius: 20px 20px 0 0;
}

.row:active { background: rgba(17, 24, 39, 0.03); }

.rowLeft { display: flex; align-items: center; gap: 12px; min-width: 0; }

.thumb {
  width: 56px; height: 56px;
  border-radius: 14px;
  background: rgba(17, 24, 39, 0.07);
  flex-shrink: 0;
  overflow: hidden;
  position: relative;
  display: grid;
  place-items: center;
}

.thumb--logo {
  background: white;
  border: 1px solid rgba(17, 24, 39, 0.07);
  box-shadow: 0 2px 8px rgba(17, 24, 39, 0.06);
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
  background: rgba(17, 24, 39, 0.07);
}

.rowText { min-width: 0; }

.rowTitle {
  font-size: 15px; font-weight: 900;
  color: rgba(17, 24, 39, 0.92); line-height: 1.2;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}

.rowPartner {
  margin-top: 3px;
  font-size: 12px; font-weight: 700; color: rgba(17, 24, 39, 0.45);
}

.rowActions {
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

.chevRight {
  width: 10px; height: 10px; flex-shrink: 0;
  border-right: 2px solid rgba(17, 24, 39, 0.32);
  border-bottom: 2px solid rgba(17, 24, 39, 0.32);
  transform: rotate(45deg);
  transition: transform 200ms cubic-bezier(0.22, 1, 0.36, 1);
}
.chevRight.open { transform: rotate(-135deg); }

.body {
  background: white;
  border: 1px solid rgba(17, 24, 39, 0.07);
  border-top: none;
  border-radius: 0 0 20px 20px;
  overflow: hidden;
}

.content {
  padding: 16px 18px 0;
  font-size: 15px; line-height: 1.65;
  font-weight: 500; color: rgba(17, 24, 39, 0.75);
}

.content :deep(h1),
.content :deep(h2),
.content :deep(h3) {
  font-size: 16px; font-weight: 900;
  color: rgba(17, 24, 39, 0.90);
  letter-spacing: -0.02em;
  margin: 18px 0 6px; line-height: 1.25;
}

.content :deep(p) { margin: 0 0 12px; }

.content :deep(ul),
.content :deep(ol) { padding-left: 20px; margin: 0 0 12px; }

.content :deep(li) { margin-bottom: 6px; }

.content :deep(hr) {
  border: none;
  border-top: 1px solid rgba(17, 24, 39, 0.08);
  margin: 18px 0;
}

.content :deep(a) { color: rgba(17, 24, 39, 0.55); text-decoration: underline; }

.content :deep(em) { color: rgba(17, 24, 39, 0.45); font-style: normal; }

.footer {
  margin: 16px 18px 18px;
  padding: 16px;
  background: rgba(17, 24, 39, 0.03);
  border-radius: 14px;
  display: flex; flex-direction: column; gap: 12px;
}

.partnerRow {
  display: flex; align-items: center; gap: 10px;
}

.partnerLogo {
  height: 28px; max-width: 70px;
  object-fit: contain; display: block; flex-shrink: 0;
}

.partnerName {
  font-size: 12px; font-weight: 700;
  color: rgba(17, 24, 39, 0.45); line-height: 1.3;
}

.pdfBtn {
  display: inline-flex; align-items: center;
  gap: 10px; height: 48px; padding: 0 20px;
  border: none; border-radius: 12px;
  background: #111827; color: white;
  font-size: 13px; font-weight: 900;
  cursor: pointer; width: 100%; justify-content: center;
  transition: opacity 120ms ease;
}
.pdfBtn:active { opacity: 0.82; }

.dlIcon {
  width: 14px; height: 14px;
  position: relative; display: inline-block; flex-shrink: 0;
}
.dlIcon::before {
  content: ""; position: absolute;
  left: 6px; top: 1px; width: 2px; height: 8px; background: white;
}
.dlIcon::after {
  content: ""; position: absolute;
  left: 3px; top: 6px; width: 8px; height: 8px;
  border-right: 2px solid white; border-bottom: 2px solid white;
  transform: rotate(45deg);
}

.copyright {
  font-size: 11px; font-weight: 600;
  color: rgba(17, 24, 39, 0.28); text-align: center;
}

.empty {
  font-size: 14px; font-weight: 700;
  color: rgba(17, 24, 39, 0.38); padding: 20px 4px; text-align: center;
}

.expand-enter-active {
  transition: opacity 220ms ease, transform 220ms cubic-bezier(0.22, 1, 0.36, 1);
}
.expand-leave-active {
  transition: opacity 140ms ease, transform 140ms ease;
}
.expand-enter-from { opacity: 0; transform: translateY(-6px); }
.expand-leave-to   { opacity: 0; transform: translateY(-4px); }
</style>
