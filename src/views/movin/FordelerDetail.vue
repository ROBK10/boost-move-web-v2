<script setup lang="ts">
import { computed, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { findFordelById } from "@/data/fordelerContent"

const route = useRoute()
const router = useRouter()

const id = computed(() => String(route.params.id || ""))
const item = computed(() => findFordelById(id.value))

// paging inni samme artikkel
const index = ref(0)

watch(
  () => id.value,
  () => {
    index.value = 0
  }
)

const total = computed(() => item.value?.sections.length ?? 0)
const isEmpty = computed(() => total.value === 0)
const isFirst = computed(() => index.value <= 0)
const isLast = computed(() => total.value > 0 && index.value >= total.value - 1)

const section = computed(() => {
  if (!item.value) return null
  if (item.value.sections.length === 0) return null
  return item.value.sections[index.value] ?? null
})

function goBack() {
  router.push("/movin/fordeler")
}

function prev() {
  if (isFirst.value) return
  index.value -= 1
}

function next() {
  if (isLast.value) return
  index.value += 1
}

function complete() {
  // V1: bare tilbake til lista
  router.push("/movin/fordeler")
}
</script>

<template>
  <div class="page" v-if="item">
    <div class="container">
      <header class="top">
        <button class="back" type="button" @click="goBack" aria-label="Tilbake">
          <span class="chev" aria-hidden="true"></span>
        </button>

        <div class="progress" v-if="!isEmpty">
          <span class="progressText">{{ index + 1 }}/{{ total }}</span>
        </div>
      </header>

      <h1 class="title">{{ item.title }}</h1>
      <p v-if="item.subtitle" class="subtitle">{{ item.subtitle }}</p>

      <main class="content">
        <div v-if="isEmpty" class="empty">
          Innhold kommer snart.
        </div>

        <section v-else class="section" v-if="section">
          <h2 class="h2">{{ section.h }}</h2>
          <p class="p">{{ section.p }}</p>
        </section>
      </main>

      <div class="bottom" v-if="!isEmpty">
        <button class="navBtn" type="button" @click="prev" :disabled="isFirst">
          Forrige
        </button>

        <button v-if="!isLast" class="primary" type="button" @click="next">
          Neste
          <span class="arrow" aria-hidden="true"></span>
        </button>

        <button v-else class="complete" type="button" @click="complete">
          COMPLETE
        </button>
      </div>
    </div>
  </div>

  <div v-else class="container">
    <p>Fant ikke innholdet.</p>
    <button class="complete" type="button" @click="goBack">Tilbake</button>
  </div>
</template>

<style scoped>
.page {
  width: 100%;
}

.container {
  max-width: 520px;
  margin: 0 auto;
  padding: 18px 16px 120px;
}

.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
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

.progress {
  background: rgba(17, 24, 39, 0.06);
  padding: 10px 12px;
  border-radius: 999px;
}

.progressText {
  font-weight: 900;
  color: rgba(17, 24, 39, 0.65);
  letter-spacing: -0.01em;
}

.title {
  margin: 0;
  font-size: 28px;
  line-height: 1.1;
  font-weight: 900;
  letter-spacing: -0.03em;
  color: #111827;
}

.subtitle {
  margin: 10px 0 0;
  font-size: 14px;
  font-weight: 700;
  color: rgba(17, 24, 39, 0.45);
}

.content {
  margin-top: 18px;
  background: white;
  border-radius: 28px;
  padding: 18px;
  box-shadow: 0 12px 36px rgba(20, 20, 20, 0.06);
  border: 1px solid rgba(17, 24, 39, 0.05);
  min-height: 420px;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 900;
  color: rgba(17, 24, 39, 0.92);
  letter-spacing: -0.02em;
}

.p {
  margin: 0;
  font-size: 15px;
  line-height: 1.6;
  font-weight: 650;
  color: rgba(17, 24, 39, 0.70);
}

.empty {
  font-size: 14px;
  font-weight: 800;
  color: rgba(17, 24, 39, 0.45);
}

/* Bottom nav */
.bottom {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 86px; /* tar hensyn til bottomnav */
  padding: 0 16px;
  display: flex;
  gap: 10px;
  justify-content: center;
}

.navBtn {
  flex: 1;
  height: 58px;
  border: none;
  border-radius: 18px;
  background: rgba(17, 24, 39, 0.06);
  color: rgba(17, 24, 39, 0.85);
  font-weight: 900;
  cursor: pointer;
}

.navBtn:disabled {
  opacity: 0.45;
  cursor: default;
}

.primary {
  flex: 1;
  height: 58px;
  border: none;
  border-radius: 18px;
  background: #0b0f17;
  color: white;
  font-weight: 900;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.complete {
  flex: 1;
  height: 58px;
  border: none;
  border-radius: 18px;
  background: rgba(185, 255, 0, 0.95);
  color: #111827;
  font-weight: 900;
  cursor: pointer;
}

.arrow {
  width: 10px;
  height: 10px;
  border-right: 2px solid rgba(255, 255, 255, 0.85);
  border-top: 2px solid rgba(255, 255, 255, 0.85);
  transform: rotate(45deg);
}
</style>