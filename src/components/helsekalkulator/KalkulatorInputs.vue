<script setup lang="ts">
import { computed } from "vue"
import { useHelsekalkulatorStore } from "@/stores/helsekalkulatorStore"
import { activityLevels, getActivityOrder, type ActivityLevel } from "@/data/helsekalkulatorData"

const store = useHelsekalkulatorStore()

const currentLabel = computed(
  () => activityLevels.find((a) => a.key === store.currentLevel)?.label ?? ""
)
const targetLabel = computed(
  () => activityLevels.find((a) => a.key === store.targetLevel)?.label ?? ""
)

function cycleCurrentLevel() {
  const levels: ActivityLevel[] = ["inactive", "partial", "active"]
  const idx = levels.indexOf(store.currentLevel)
  const next = (idx + 1) % levels.length
  store.setCurrentLevel(levels[next])
}

function cycleTargetLevel() {
  const minOrder = getActivityOrder(store.currentLevel) + 1
  const available = activityLevels.filter((a) => a.order >= minOrder)
  if (available.length === 0) return
  const idx = available.findIndex((a) => a.key === store.targetLevel)
  const next = (idx + 1) % available.length
  store.setTargetLevel(available[next].key)
}
</script>

<template>
  <div class="inputs">
    <div class="head">
      <div class="h">KALKULATOR</div>
    </div>

    <!-- Antall ansatte -->
    <div class="row">
      <div class="left">
        <div class="icon" style="background: rgba(190,242,1,0.10)">
          <div class="people-icon" aria-hidden="true" />
        </div>
        <div class="txt">
          <div class="t">Antall ansatte</div>
          <div class="s">I BEDRIFTEN</div>
        </div>
      </div>
      <div class="right">
        <button class="step" type="button" @click="store.setEmployees(store.employeeCount - 10)">–</button>
        <div class="val">{{ store.employeeCount }}</div>
        <button class="step" type="button" @click="store.setEmployees(store.employeeCount + 10)">+</button>
      </div>
    </div>

    <!-- Nåværende nivå -->
    <div class="row" role="button" tabindex="0" @click="cycleCurrentLevel" @keydown.enter="cycleCurrentLevel">
      <div class="left">
        <div class="icon" style="background: rgba(239,68,68,0.10)">
          <div class="level-icon low" aria-hidden="true" />
        </div>
        <div class="txt">
          <div class="t">Nåværende nivå</div>
          <div class="s">TRYKK FOR Å ENDRE</div>
        </div>
      </div>
      <div class="right">
        <div class="level-badge from">{{ currentLabel }}</div>
      </div>
    </div>

    <!-- Mål-nivå -->
    <div class="row" role="button" tabindex="0" @click="cycleTargetLevel" @keydown.enter="cycleTargetLevel">
      <div class="left">
        <div class="icon" style="background: rgba(16,185,129,0.10)">
          <div class="level-icon high" aria-hidden="true" />
        </div>
        <div class="txt">
          <div class="t">Mål-nivå</div>
          <div class="s">TRYKK FOR Å ENDRE</div>
        </div>
      </div>
      <div class="right">
        <div class="level-badge to">{{ targetLabel }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.inputs {
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

.row {
  background: #023238;
  border-radius: 28px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 12px 36px rgba(0,0,0,0.25);
  border: 1px solid rgba(209,231,229,0.08);
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
}
.row:hover {
  transform: translateY(-1px);
  box-shadow: 0 16px 40px rgba(0,0,0,0.3);
}

.left {
  display: flex;
  gap: 14px;
  align-items: center;
  min-width: 0;
}
.icon {
  width: 54px;
  height: 54px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.txt {
  min-width: 0;
}
.t {
  font-size: 18px;
  font-weight: 900;
  color: #FFFFFF;
}
.s {
  margin-top: 4px;
  font-size: 13px;
  font-weight: 800;
  color: rgba(209,231,229,0.35);
  letter-spacing: 0.02em;
}

.right {
  display: flex;
  gap: 10px;
  align-items: center;
}
.val {
  font-size: 28px;
  font-weight: 900;
  color: #FFFFFF;
  min-width: 56px;
  text-align: center;
}

.step {
  width: 46px;
  height: 46px;
  border-radius: 16px;
  border: none;
  background: rgba(209,231,229,0.06);
  font-weight: 900;
  font-size: 22px;
  cursor: pointer;
}

.level-badge {
  padding: 10px 14px;
  border-radius: 999px;
  font-weight: 900;
  font-size: 14px;
  white-space: nowrap;
}
.level-badge.from {
  background: rgba(239, 68, 68, 0.1);
  color: rgba(239, 68, 68, 0.85);
}
.level-badge.to {
  background: rgba(16, 185, 129, 0.1);
  color: rgba(16, 185, 129, 0.95);
}

/* CSS-only ikoner */
.people-icon {
  width: 24px;
  height: 20px;
  position: relative;
}
.people-icon::before {
  content: "";
  position: absolute;
  left: 4px;
  top: 0;
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: rgba(190, 242, 1, 0.85);
}
.people-icon::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 18px;
  height: 8px;
  border-radius: 8px 8px 0 0;
  background: rgba(190, 242, 1, 0.85);
}

.level-icon {
  width: 22px;
  height: 22px;
  position: relative;
}
.level-icon::before,
.level-icon::after {
  content: "";
  position: absolute;
  bottom: 0;
  width: 6px;
  border-radius: 3px;
}
.level-icon.low::before {
  left: 2px;
  height: 8px;
  background: rgba(239, 68, 68, 0.85);
}
.level-icon.low::after {
  left: 12px;
  height: 14px;
  background: rgba(239, 68, 68, 0.45);
}
.level-icon.high::before {
  left: 2px;
  height: 14px;
  background: rgba(16, 185, 129, 0.55);
}
.level-icon.high::after {
  left: 12px;
  height: 22px;
  background: rgba(16, 185, 129, 0.95);
}
</style>
