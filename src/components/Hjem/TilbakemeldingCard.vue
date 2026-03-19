<script setup lang="ts">
import { computed, ref } from "vue"

const props = defineProps<{
  orgId?: string
  month?: string // optional override "YYYY-MM"
}>()

const emit = defineEmits<{
  (e: "submit", payload: { month: string; selected: string[]; orgId?: string; annetText?: string }): void
}>()

const nowMonth = computed(() => {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, "0")
  return `${y}-${m}`
})

const month = computed(() => props.month ?? nowMonth.value)

const options = [
  { id: "team-building", label: "Team Building" },
  { id: "fellestrening", label: "Fellestrening" },
  { id: "sauna", label: "Sauna" },
  { id: "kroppsanalyse", label: "Kroppsanalyse" },
]

const selected = ref<string[]>([])
const annetSelected = ref(false)
const annetText = ref("")
const expanded = ref(false)

function toggle(id: string) {
  const i = selected.value.indexOf(id)
  if (i >= 0) selected.value.splice(i, 1)
  else selected.value.push(id)
}

function toggleAnnet() {
  annetSelected.value = !annetSelected.value
  if (!annetSelected.value) annetText.value = ""
}

const canSubmit = computed(() => {
  if (selected.value.length > 0) return true
  if (annetSelected.value && annetText.value.trim().length > 0) return true
  return false
})

function submit() {
  if (!canSubmit.value) return
  emit("submit", {
    month: month.value,
    selected: [...selected.value, ...(annetSelected.value ? ["annet"] : [])],
    orgId: props.orgId,
    annetText: annetSelected.value ? annetText.value.trim() : undefined,
  })
  selected.value = []
  annetSelected.value = false
  annetText.value = ""
  expanded.value = false
}
</script>

<template>
  <section class="card" aria-label="Tilbakemelding til arbeidsgiver">
    <header class="top" @click="expanded = !expanded" role="button" tabindex="0" :aria-expanded="expanded">
      <div class="left">
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

        <!-- Annet option -->
        <button
          type="button"
          class="chip"
          :class="{ on: annetSelected }"
          @click="toggleAnnet"
        >
          <span class="dot" aria-hidden="true"></span>
          <span class="txt">Annet</span>
        </button>
      </div>

      <!-- Text input shown when Annet is selected -->
      <div v-if="annetSelected" class="annet-wrap">
        <textarea
          v-model="annetText"
          class="annet-input"
          placeholder="Skriv inn ditt forslag…"
          rows="3"
          maxlength="300"
          aria-label="Ditt forslag"
        ></textarea>
      </div>

      <button class="cta" type="button" :disabled="!canSubmit" @click="submit">
        Send forslag
        <span class="meta">({{ month }})</span>
      </button>

      <div class="note">Anonymt for kollegaer.</div>
    </div>
  </section>
</template>

<style scoped>
.card {
  border-radius: 22px;
  background: #023238;
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
  min-height: 44px;
}

.left { display: grid; gap: 6px; }

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
  flex-shrink: 0;
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
  min-height: 52px;
  border: none;
  border-radius: 16px;
  padding: 14px 14px;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.92);
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  text-align: left;
  transition: background 120ms ease;
}

.chip.on {
  background: rgba(185, 255, 0, 0.16);
  box-shadow: inset 0 0 0 1px rgba(185, 255, 0, 0.35);
}

.chip:active {
  opacity: 0.85;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.35);
  flex-shrink: 0;
}
.chip.on .dot { background: rgba(185, 255, 0, 0.95); }

.txt {
  font-weight: 850;
  font-size: 15px;
}

/* ANNET INPUT */
.annet-wrap {
  margin-top: -2px;
}

.annet-input {
  width: 100%;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(185, 255, 0, 0.35);
  border-radius: 14px;
  padding: 12px 14px;
  color: white;
  font-size: 14px;
  font-weight: 700;
  font-family: inherit;
  line-height: 1.4;
  resize: none;
  outline: none;
  box-sizing: border-box;
}

.annet-input::placeholder {
  color: rgba(209,231,229,0.3);
  font-weight: 600;
}

.annet-input:focus {
  border-color: rgba(185, 255, 0, 0.65);
  background: rgba(255, 255, 255, 0.10);
}

.cta {
  height: 54px;
  border: none;
  border-radius: 16px;
  background: rgba(185, 255, 0, 0.95);
  color: #FFFFFF;
  font-weight: 950;
  font-size: 15px;
  cursor: pointer;
  width: 100%;
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
