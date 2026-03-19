<script setup lang="ts">
import { useRouter } from "vue-router"
import KalkulatorInputs from "@/components/helsekalkulator/KalkulatorInputs.vue"
import KalkulatorResults from "@/components/helsekalkulator/KalkulatorResults.vue"

const router = useRouter()
</script>

<template>
  <div class="page">
    <header class="top">
      <button class="back" type="button" @click="router.back()" aria-label="Tilbake">
        <span class="arrow" aria-hidden="true" />
      </button>
      <div>
        <h1 class="title">Helsekalkulator</h1>
        <p class="sub">Se helsegevinsten av fysisk aktivitet</p>
      </div>
    </header>

    <KalkulatorInputs />
    <KalkulatorResults />
  </div>
</template>

<style scoped>
.page {
  max-width: 520px;
  margin: 0 auto;
  padding: 0 16px 32px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.top {
  position: sticky;
  top: 0;
  z-index: 10;
  background: #021C20;
  margin: 0 -16px;
  padding: 20px 16px 12px;
  display: flex;
  align-items: center;
  gap: 14px;
}

.back {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  border: none;
  background: rgba(209,231,229,0.06);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.arrow {
  width: 12px;
  height: 12px;
  border-left: 3px solid #D1E7E5;
  border-bottom: 3px solid #D1E7E5;
  transform: rotate(45deg);
  margin-left: 4px;
}

.title {
  margin: 0;
  font-size: 28px;
  line-height: 1.1;
  font-weight: 900;
  letter-spacing: -0.02em;
  color: #FFFFFF;
}

.sub {
  margin: 4px 0 0;
  font-size: 15px;
  font-weight: 600;
  color: rgba(209,231,229,0.6);
}
</style>
