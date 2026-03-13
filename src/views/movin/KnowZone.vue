<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"
import { useMovin, splitSteps } from "@/composables/useMovin"
import { useMovinState } from "@/composables/useMovinState"

const router = useRouter()
const { getBySlug } = useMovin()
const { isFave, toggleFave, getProgress } = useMovinState()

function totalSteps(slug: string): number {
  const a = getBySlug(slug)
  return a ? splitSteps(a.content).length : 0
}

function openPdf(slug: string) {
  const a = getBySlug(slug)
  if (a?.pdf) window.open(a.pdf, "_blank")
}

type CatItem = { slug: string; title: string; subtitle: string; readMin: number }
type Cat = { id: string; title: string; items: CatItem[] }

const CATEGORIES: Cat[] = [
  {
    id: "vanedannelse",
    title: "Vanedannelse",
    items: [
      { slug: "vil-du-endelig-klare-a-bli-fysisk-aktiv", title: "Vil du endelig klare å bli mer fysisk aktiv?", subtitle: "Lær mer om vanenes rolle når vi prøver å endre atferd", readMin: 15 },
    ],
  },
  {
    id: "trening",
    title: "Kunnskap til bedre trening",
    items: [
      { slug: "tilstandsstyring",      title: "Tilstandsstyring",      subtitle: "Hvordan styrke/endre tilstanden vår",                         readMin: 10 },
      { slug: "pulstrening",           title: "Pulstrening",            subtitle: "Hva sier pulsen?",                                             readMin: 10 },
      { slug: "ga-metoden",            title: "Løp/gå metoden",         subtitle: "Bruk løp/gå metoden for å komme i form!",                     readMin: 10 },
      { slug: "belastning-og-okning",  title: "Belastning og økning",   subtitle: "Hva er belastning og hvordan øke",                            readMin: 15 },
      { slug: "sovn-og-restitusjon",   title: "Søvn og restitusjon",    subtitle: "Hvordan enkelt mestre søvn og restitusjon",                   readMin: 10 },
      { slug: "trening-og-sykdom",     title: "Trening og sykdom",      subtitle: "Hva må jeg tenke på når jeg er syk?",                         readMin: 10 },
      { slug: "80-20-regelen",         title: "80-20 regelen",          subtitle: "Hva er 80-20 regelen og hvorfor bruke denne?",                readMin: 10 },
    ],
  },
  {
    id: "ernaering",
    title: "Ernæring",
    items: [
      { slug: "slik-nar-du-dine-kostholdsrelaterte-mal", title: "Slik når du dine kostholdsrelaterte mål", subtitle: "Hvorfor er dietter så vanskelig, og hvordan kan du lykkes?", readMin: 10 },
      { slug: "tips-til-mettende-maltider",              title: "Tips til mettende måltider",              subtitle: "4 enkle tips til å ta smarte valg i hverdagen",            readMin: 10 },
      { slug: "kosthold-og-trening",                     title: "Kosthold og trening",                     subtitle: "Hva er anbefalt og hvordan kan jeg gjøre smarte valg?",  readMin: 10 },
      { slug: "grunnprinsipper-for-et-godt-kosthold",    title: "Grunnprinsipper for et godt kosthold",    subtitle: "Enkel oversikt over hva kroppen trenger for å fungere best.", readMin: 10 },
    ],
  },
  {
    id: "hormoner",
    title: "Hormoner",
    items: [
      { slug: "hormonbalanse-hos-kvinner-og-menn", title: "Hormonbalanse", subtitle: "Hormonbalanse hos kvinner og menn", readMin: 10 },
    ],
  },
  {
    id: "muskelbalanse",
    title: "Muskelbalanse",
    items: [
      { slug: "muskelbalanse",                              title: "Hva er muskelbalanse?",          subtitle: "Hva er muskelbalanse og hvorfor spiller dette en rolle?",              readMin: 15 },
      { slug: "muskelbalanse-for-deg-som-liker-a-ga-eller-lope", title: "Muskelbalanse: Gå – løper", subtitle: "Muskelbalanse for deg som liker å gå eller løpe",                 readMin: 15 },
      { slug: "muskelbalanse-nakke-skulder-rygg",           title: "Muskelbalanse: Nakke-Skulder-Rygg", subtitle: "Muskelbalanse for deg som har plager i nakke-skulder-rygg regionen", readMin: 15 },
    ],
  },
  {
    id: "urpraksis",
    title: "Urpraksis",
    items: [
      { slug: "group-144",  title: "Varme og kulde",  subtitle: "Eksponering av varme og kulde",                             readMin: 10 },
      { slug: "fasting",    title: "Faste",            subtitle: "Lær mer om faste og hvilke helseeffekter det kan gi",       readMin: 10 },
      { slug: "sollys",     title: "Sollys",           subtitle: "Sollys og dets effekter på kropp og helse",                 readMin: 10 },
    ],
  },
]

const openCatId = ref<string | null>(null)

function toggleCat(id: string) {
  openCatId.value = openCatId.value === id ? null : id
}

function openArticle(slug: string) {
  router.push(`/movin/knowzone/${slug}`)
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
          <h1 class="title">KnowZone</h1>
          <p class="subtitle">Kunnskap for bedre helse</p>
        </div>
      </header>

      <!-- Category list -->
      <section class="list">
        <div v-for="cat in CATEGORIES" :key="cat.id" class="catBlock">

          <!-- Category pill -->
          <button
            class="catPill"
            :class="{ 'catPill--open': openCatId === cat.id }"
            type="button"
            @click="toggleCat(cat.id)"
            :aria-expanded="openCatId === cat.id"
          >
            <span class="catTitle">{{ cat.title }}</span>
            <span class="catChev" :class="{ open: openCatId === cat.id }" aria-hidden="true"></span>
          </button>

          <!-- Items -->
          <Transition name="expand">
            <div v-if="openCatId === cat.id" class="items">
              <button
                v-for="it in cat.items"
                :key="it.slug"
                class="itemRow"
                type="button"
                @click="openArticle(it.slug)"
              >
                <!-- Thumbnail -->
                <div class="thumb">
                  <img
                    v-if="getBySlug(it.slug)?.image"
                    :src="getBySlug(it.slug)!.image!"
                    :alt="it.title"
                    class="thumbImg"
                  />
                  <div v-else class="thumbDoc" aria-hidden="true"></div>
                </div>

                <!-- Text -->
                <div class="itemText">
                  <div class="itemTitle">{{ it.title }}</div>
                  <div v-if="getProgress(it.slug) > 0" class="resumePill">
                    <span class="resumeDot" aria-hidden="true"></span>
                    Side {{ getProgress(it.slug) + 1 }} av {{ totalSteps(it.slug) }}
                  </div>
                  <div v-else class="itemSub">{{ it.subtitle }}</div>
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
                  <button
                    v-if="getBySlug(it.slug)?.pdf"
                    class="dlBadge"
                    type="button"
                    :aria-label="`Last ned PDF – ${it.title}`"
                    @click="openPdf(it.slug)"
                  >
                    <span class="dlArrow" aria-hidden="true"></span>
                    <span class="dlMin">{{ it.readMin }} min</span>
                  </button>
                </div>
              </button>
            </div>
          </Transition>

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
.list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.catBlock { display: flex; flex-direction: column; }

/* Category pill */
.catPill {
  width: 100%;
  background: white;
  border: 1px solid rgba(17,24,39,0.07);
  border-radius: 18px;
  padding: 14px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(17,24,39,0.05);
  transition: box-shadow 120ms ease, background 120ms ease;
}

.catPill--open {
  border-radius: 18px 18px 0 0;
  box-shadow: 0 4px 16px rgba(17,24,39,0.08);
  border-color: rgba(17,24,39,0.10);
}

.catPill:active { background: rgba(17,24,39,0.03); }

.catTitle {
  font-size: 16px; font-weight: 800;
  color: rgba(17,24,39,0.92);
  letter-spacing: -0.01em;
  text-align: left;
}

.catChev {
  width: 9px; height: 9px; flex-shrink: 0;
  border-right: 2px solid rgba(17,24,39,0.35);
  border-bottom: 2px solid rgba(17,24,39,0.35);
  transform: rotate(45deg);
  transition: transform 200ms cubic-bezier(0.22,1,0.36,1);
}
.catChev.open { transform: rotate(-135deg); }

/* Items container */
.items {
  background: white;
  border: 1px solid rgba(17,24,39,0.07);
  border-top: none;
  border-radius: 0 0 18px 18px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Item row */
.itemRow {
  width: 100%;
  background: transparent;
  border: none;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  text-align: left;
  transition: background 100ms ease;
  border-bottom: 1px solid rgba(17,24,39,0.05);
}

.itemRow:last-child { border-bottom: none; }
.itemRow:active { background: rgba(17,24,39,0.03); }

/* Thumbnail */
.thumb {
  width: 52px; height: 52px;
  border-radius: 12px;
  background: rgba(17,24,39,0.07);
  flex-shrink: 0;
  overflow: hidden;
  display: grid;
  place-items: center;
}

.thumbImg {
  width: 100%; height: 100%;
  object-fit: cover; display: block;
}

/* Document placeholder */
.thumbDoc {
  width: 28px; height: 34px;
  background: rgba(17,24,39,0.15);
  border-radius: 3px;
  position: relative;
}
.thumbDoc::before {
  content: "";
  position: absolute;
  top: 6px; left: 5px; right: 5px;
  height: 2px;
  background: rgba(17,24,39,0.25);
  border-radius: 1px;
  box-shadow: 0 5px 0 rgba(17,24,39,0.25), 0 10px 0 rgba(17,24,39,0.25), 0 15px 0 rgba(17,24,39,0.18);
}

/* Text */
.itemText { flex: 1; min-width: 0; }

.itemTitle {
  font-size: 14px; font-weight: 800;
  color: rgba(17,24,39,0.92); line-height: 1.25;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}

.itemSub {
  margin-top: 3px;
  font-size: 12px; font-weight: 600;
  color: rgba(17,24,39,0.45); line-height: 1.3;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
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
.actions {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.starBtn {
  width: 32px; height: 32px;
  background: rgba(17,24,39,0.05); border: none; border-radius: 999px;
  display: grid; place-items: center; cursor: pointer;
  transition: background 120ms ease;
}
.starBtn:active { background: rgba(17,24,39,0.10); }
.starBtn.active { background: rgba(251,191,36,0.18); }

.starIcon {
  width: 15px; height: 15px; display: block;
  background: rgba(17,24,39,0.38);
  clip-path: polygon(50% 0%,62% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,38% 35%);
  transition: background 120ms ease;
}
.starBtn.active .starIcon { background: rgba(251,191,36,0.95); }

/* Download badge */
.dlBadge {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.dlArrow {
  width: 28px; height: 28px;
  border: 2px solid #b9ff00;
  border-radius: 999px;
  display: grid; place-items: center;
  position: relative;
  background: rgba(185,255,0,0.10);
}

.dlArrow::before {
  content: "";
  position: absolute;
  top: 5px; left: 50%; transform: translateX(-50%);
  width: 2px; height: 9px;
  background: rgba(80,130,0,0.85);
  border-radius: 1px;
}
.dlArrow::after {
  content: "";
  position: absolute;
  bottom: 5px; left: 50%; transform: translateX(-50%) rotate(45deg);
  width: 7px; height: 7px;
  border-right: 2px solid rgba(80,130,0,0.85);
  border-bottom: 2px solid rgba(80,130,0,0.85);
}

.dlMin {
  font-size: 9px; font-weight: 800;
  color: rgba(80,130,0,0.85);
  letter-spacing: 0.02em;
  white-space: nowrap;
}

/* Transition */
.expand-enter-active {
  transition: opacity 200ms ease, transform 200ms cubic-bezier(0.22,1,0.36,1);
}
.expand-leave-active {
  transition: opacity 120ms ease, transform 120ms ease;
}
.expand-enter-from { opacity: 0; transform: translateY(-6px); }
.expand-leave-to   { opacity: 0; transform: translateY(-4px); }
</style>
