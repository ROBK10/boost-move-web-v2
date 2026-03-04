<!-- src/views/Movin.vue -->
<script setup lang="ts">
import { useRouter } from "vue-router"

const router = useRouter()

function go(path: string) {
  router.push(path)
}
</script>

<template>
  <div class="page">
    <header class="head">
      <h1 class="title">Movin</h1>
      <p class="subtitle">Velg hva du vil gjøre i dag</p>
    </header>

    <section class="list">
      <button class="row" type="button" @click="go('/movin/boost-moment')">
        <div class="rowTitle">Boost Moment</div>
        <div class="rowSub">Dagens mentale boost</div>
        <span class="chev" aria-hidden="true"></span>
      </button>

      <button class="row" type="button" @click="go('/movin/kom-i-gang')">
        <div class="rowTitle">Kom i gang</div>
        <div class="rowSub">Små steg – stor effekt</div>
        <span class="chev" aria-hidden="true"></span>
      </button>

      <button class="row" type="button" @click="go('/movin/programmer')">
        <div class="rowTitle">Programmer</div>
        <div class="rowSub">Trening og opplegg</div>
        <span class="chev" aria-hidden="true"></span>
      </button>

      <button class="row" type="button" @click="go('/movin/knowzone')">
        <div class="rowTitle">KnowZone</div>
        <div class="rowSub">Kunnskapsbase</div>
        <span class="chev" aria-hidden="true"></span>
      </button>

      <button class="row" type="button" @click="go('/movin/maler')">
        <div class="rowTitle">Maler</div>
        <div class="rowSub">Verktøy og skjema</div>
        <span class="chev" aria-hidden="true"></span>
      </button>

      <button class="row" type="button" @click="go('/movin/fordeler')">
        <div class="rowTitle">Fordeler</div>
        <div class="rowSub">Hva får du igjen?</div>
        <span class="chev" aria-hidden="true"></span>
      </button>
    </section>
  </div>
</template>

<style scoped>
.page {
  max-width: 520px;
  margin: 0 auto;
  padding: 18px 16px 110px;
}

.head {
  margin-bottom: 14px;
}

.title {
  margin: 0;
  font-size: 34px;
  line-height: 1.05;
  font-weight: 900;
  letter-spacing: -0.03em;
  color: #111827;
}

.subtitle {
  margin: 8px 0 0;
  font-size: 14px;
  font-weight: 700;
  color: rgba(17, 24, 39, 0.45);
}

.list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.row {
  width: 100%;
  border: none;
  background: rgba(17, 24, 39, 0.04);
  border-radius: 18px;
  padding: 16px 16px;
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: auto auto;
  gap: 4px 10px;
  cursor: pointer;
  text-align: left;
}

.rowTitle {
  font-size: 18px;
  font-weight: 900;
  color: rgba(17, 24, 39, 0.92);
}

.rowSub {
  grid-column: 1 / 2;
  font-size: 14px;
  font-weight: 700;
  color: rgba(17, 24, 39, 0.55);
}

.chev {
  grid-column: 2 / 3;
  grid-row: 1 / 3;
  align-self: center;
  width: 10px;
  height: 10px;
  border-right: 2px solid rgba(17, 24, 39, 0.25);
  border-top: 2px solid rgba(17, 24, 39, 0.25);
  transform: rotate(45deg);
}
</style>