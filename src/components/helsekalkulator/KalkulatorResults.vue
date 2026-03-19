<script setup lang="ts">
import { computed } from "vue"
import { useHelsekalkulatorStore } from "@/stores/helsekalkulatorStore"
import ResultStatCard from "./ResultStatCard.vue"

const store = useHelsekalkulatorStore()

const annualSavings = computed(() => Math.round(store.annualHealthcareSavings))
const totalDaly = computed(() => Math.round(store.totalDaly * 10) / 10)
const societalValue = computed(() => Math.round(store.totalSocietalValue))
</script>

<template>
  <div class="results" v-if="store.isValid">
    <div class="head">
      <div class="h">HELSEGEVINST</div>
    </div>

    <div class="card">
      <ResultStatCard
        label="Årlig besparelse i helsekostnader"
        :value="annualSavings"
        suffix="kr/år"
        :highlight="true"
      />

      <div class="divider" />

      <ResultStatCard
        label="Vunne friske leveår"
        :value="totalDaly"
        suffix="DALY"
      />

      <div class="divider" />

      <ResultStatCard
        label="Samfunnsøkonomisk verdi"
        :value="societalValue"
        suffix="kr"
      />
    </div>

    <p class="credit">
      Datakilde:
      <a href="https://www.helsedirektoratet.no/forebygging-diagnose-og-behandling/forebygging-og-levevaner/fysisk-aktivitet/kalkulator-helseeffekter-av-fysisk-aktivitet" target="_blank" rel="noopener">
        Helsedirektoratet
      </a>
      (NLOD). Verdier i 2023-kroner.
    </p>
  </div>

  <div v-else class="empty">
    <p class="empty-text">Velg et mål-nivå som er høyere enn nåværende nivå for å se helsegevinsten.</p>
  </div>
</template>

<style scoped>
.results {
  display: grid;
  gap: 14px;
}

.head {
  display: flex;
  align-items: center;
  margin-top: 6px;
}

.h {
  font-size: 14px;
  font-weight: 950;
  letter-spacing: 0.12em;
  color: rgba(209,231,229,0.35);
}

.card {
  background: #023238;
  border-radius: 30px;
  padding: 8px 0;
  box-shadow: 0 12px 36px rgba(0,0,0,0.25);
  border: 1px solid rgba(209,231,229,0.08);
}

.divider {
  height: 1px;
  margin: 0 24px;
  background: rgba(209,231,229,0.06);
}

.credit {
  font-size: 12px;
  font-weight: 700;
  color: rgba(209,231,229,0.35);
  text-align: center;
  margin: 0;
}
.credit a {
  color: rgba(190, 242, 1, 0.8);
  text-decoration: none;
}

.empty {
  padding: 32px 16px;
  text-align: center;
}
.empty-text {
  font-size: 15px;
  font-weight: 700;
  color: rgba(209,231,229,0.35);
  margin: 0;
}
</style>
