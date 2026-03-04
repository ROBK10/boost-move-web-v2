<script setup lang="ts">
import { computed, ref } from "vue"

const props = defineProps<{
  orgId?: string
  month?: string // optional override "YYYY-MM"
}>()

const emit = defineEmits<{
  (e: "submit", payload: { month: string; selected: string[]; orgId?: string }): void
}>()

const nowMonth = computed(() => {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, "0")
  return `${y}-${m}`
})

const month = computed(() => props.month ?? nowMonth.value)

// V2: flervalg (lav terskel)
const options = [
  { id: "group-workout", label: "Fellestrening / gruppetime" },
  { id: "health-check", label: "Kroppsanalyse / helsesjekk" },
  { id: "nutrition-talk", label: "Kosthold / foredrag" },
  { id: "mobility", label: "Mobilitet / rygg-nakke" },
  { id: "stress", label: "Stress / søvn / mental boost" },
  { id: "competition", label: "Konkurranse / challenge" },
]

const selected = ref<string[]>([])
const expanded = ref(false)

function toggle(id: string) {
  const i = selected.value.indexOf(id)
  if (i >= 0) selected.value.splice(i, 1)
  else selected.value.push(id)
}

const canSubmit = computed(() => selected.value.length > 0)

function submit() {
  if (!canSubmit.value) return
  emit("submit", { month: month.value, selected: [...selected.value], orgId: props.orgId })
  // V1: reset (senere: lock 1 gang pr måned i store/backend)
  selected.value = []
  expanded.value = false
}
</script>

<template>
  <section class="card" aria-label="Tilbakemelding til arbeidsgiver">
    <header class="top" @click="expanded = !expanded" role="button" tabindex="0">
      <div class="left">
        <div class="badge">NY</div>
        <div class="title">Hva ønsker dere på jobb?</div>
        <div class="sub">Lavterskel flervalg · tar 10 sek</div>
      </div>
      <span class="chev" :class="{ open: expanded }" aria-hidden="true"></span>
    </header>

    <div v-if="expanded" class="body">
      <div class="hint">
        Velg det du tror flest hadde hatt nytte av. Vi samler svar og kan gi leder et tydelig bilde.
      </div>

      <div class="grid">
        <button
          v-for="opt in options"
          :key="opt.id"
          type="button"
          class="chip"
          :class="{ on: selected.includes(opt.id) }"
          @click="toggle(opt.id)"
        >
          <span class="dot" aria-hidden="true"></span>
          <span class="txt">{{ opt.label }}</span>
        </button>
      </div>

      <button class="cta" type="button" :disabled="!canSubmit" @click="submit">
        Send forslag
        <span class="meta">({{ month }})</span>
      </button>

      <div class="note">Anonymt for kollegaer. (V1: logges lokalt / console hos deg.)</div>
    </div>
  </section>
</template>

<style scoped>
.card {
  border-radius: 22px;
  background: #0b0f17; /* “boost”-mørk */
  color: rgba(255, 255, 255, 0.92);
  padding: 14px;
  box-shadow: 0 18px 44px rgba(11, 15, 23, 0.22);
}

.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  cursor: pointer;
  user-select: none;
}

.left { display: grid; gap: 6px; }

.badge {
  width: fit-content;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.14em;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(185, 255, 0, 0.95);
  color: #0b0f17;
}

.title {
  font-size: 18px;
  font-weight: 950;
  letter-spacing: -0.02em;
}

.sub {
  font-size: 13px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.65);
}

.chev {
  width: 10px;
  height: 10px;
  border-right: 2px solid rgba(255, 255, 255, 0.55);
  border-bottom: 2px solid rgba(255, 255, 255, 0.55);
  transform: rotate(45deg);
  transition: transform 140ms ease;
}
.chev.open { transform: rotate(-135deg); }

.body { margin-top: 12px; display: grid; gap: 12px; }

.hint {
  font-size: 13px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.70);
  line-height: 1.35;
}

.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}

.chip {
  width: 100%;
  border: none;
  border-radius: 16px;
  padding: 12px 12px;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.92);
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  text-align: left;
}

.chip.on {
  background: rgba(185, 255, 0, 0.16);
  box-shadow: inset 0 0 0 1px rgba(185, 255, 0, 0.35);
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.35);
}
.chip.on .dot { background: rgba(185, 255, 0, 0.95); }

.txt { font-weight: 850; font-size: 14px; }

.cta {
  height: 54px;
  border: none;
  border-radius: 16px;
  background: rgba(185, 255, 0, 0.95);
  color: #0b0f17;
  font-weight: 950;
  cursor: pointer;
}

.cta:disabled {
  opacity: 0.45;
  cursor: default;
}

.meta {
  font-weight: 900;
  opacity: 0.7;
  margin-left: 8px;
}

.note {
  font-size: 12px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.55);
}
</style>