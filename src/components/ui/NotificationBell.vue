<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue"
import { useRouter } from "vue-router"
import { useNotificationStore } from "@/stores/notificationStore"
import type { NotificationType } from "@/stores/notificationStore"

const router = useRouter()
const store = useNotificationStore()

const open = ref(false)
const panelRef = ref<HTMLElement | null>(null)
const btnRef = ref<HTMLElement | null>(null)

function toggle() {
  open.value = !open.value
}

function onClickOutside(e: MouseEvent) {
  const target = e.target as Node
  if (
    panelRef.value && !panelRef.value.contains(target) &&
    btnRef.value && !btnRef.value.contains(target)
  ) {
    open.value = false
  }
}

onMounted(() => document.addEventListener("pointerdown", onClickOutside))
onUnmounted(() => document.removeEventListener("pointerdown", onClickOutside))

function onNotificationClick(id: string, linkTo?: string) {
  store.markRead(id)
  open.value = false
  if (linkTo) router.push(linkTo)
}

function formatTime(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const diff = (now.getTime() - d.getTime()) / 1000
  if (diff < 60) return "Nå nettopp"
  if (diff < 3600) return `${Math.floor(diff / 60)} min siden`
  if (d.toDateString() === now.toDateString()) {
    return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`
  }
  return `${d.getDate()}. ${d.toLocaleString("nb-NO", { month: "short" })}`
}

function typeIcon(t: NotificationType): string {
  if (t === "dm") return "💬"
  if (t === "admin") return "📢"
  return "🔔"
}
</script>

<template>
  <div class="bell-wrap">
    <!-- Bell button -->
    <button
      ref="btnRef"
      class="bell-btn"
      type="button"
      aria-label="Varsler"
      :aria-expanded="open"
      @click="toggle"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
      <span v-if="store.unreadCount > 0" class="badge" aria-live="polite">
        {{ store.unreadCount > 9 ? "9+" : store.unreadCount }}
      </span>
    </button>

    <!-- Dropdown panel -->
    <Transition name="panel">
      <div v-if="open" ref="panelRef" class="panel" role="dialog" aria-label="Varsler">
        <div class="panel-head">
          <span class="panel-title">Varsler</span>
          <button
            v-if="store.unreadCount > 0"
            class="mark-all"
            type="button"
            @click="store.markAllRead()"
          >
            Merk alle som lest
          </button>
        </div>

        <div v-if="store.sorted.length === 0" class="empty">
          Ingen varsler ennå
        </div>

        <ul v-else class="list" role="list">
          <li
            v-for="n in store.sorted"
            :key="n.id"
            class="notif-item"
            :class="{ unread: !n.read }"
            @click="onNotificationClick(n.id, n.linkTo)"
          >
            <span class="notif-icon" aria-hidden="true">{{ typeIcon(n.type) }}</span>
            <div class="notif-body">
              <div class="notif-title">{{ n.title }}</div>
              <div class="notif-text">{{ n.body }}</div>
              <div class="notif-time">{{ formatTime(n.createdAt) }}</div>
            </div>
            <button
              class="dismiss-btn"
              type="button"
              aria-label="Fjern varsel"
              @click.stop="store.dismiss(n.id)"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </li>
        </ul>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.bell-wrap {
  position: relative;
  flex-shrink: 0;
}

/* BELL BUTTON */
.bell-btn {
  position: relative;
  width: 44px;
  height: 44px;
  border: none;
  background: white;
  border-radius: 999px;
  box-shadow: 0 10px 30px rgba(20, 20, 20, 0.08);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #111827;
}

.badge {
  position: absolute;
  top: 7px;
  right: 7px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  background: #ef4444;
  border-radius: 999px;
  font-size: 9px;
  font-weight: 900;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  border: 1.5px solid white;
  box-sizing: border-box;
}

/* PANEL */
.panel {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: min(320px, calc(100vw - 32px));
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(17, 24, 39, 0.14), 0 4px 16px rgba(17, 24, 39, 0.06);
  border: 1px solid rgba(17, 24, 39, 0.07);
  overflow: hidden;
  z-index: 300;
}

.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px 12px;
  border-bottom: 1px solid rgba(17, 24, 39, 0.07);
}

.panel-title {
  font-size: 14px;
  font-weight: 900;
  color: #111827;
}

.mark-all {
  background: none;
  border: none;
  font-size: 12px;
  font-weight: 700;
  color: rgba(17, 24, 39, 0.45);
  cursor: pointer;
  font-family: inherit;
  padding: 0;
}

.mark-all:hover {
  color: rgba(17, 24, 39, 0.75);
}

.empty {
  padding: 28px 16px;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: rgba(17, 24, 39, 0.38);
}

/* LIST */
.list {
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 320px;
  overflow-y: auto;
}

.notif-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background 120ms ease;
  border-bottom: 1px solid rgba(17, 24, 39, 0.04);
}

.notif-item:last-child {
  border-bottom: none;
}

.notif-item:hover,
.notif-item:active {
  background: rgba(17, 24, 39, 0.03);
}

.notif-item.unread {
  background: rgba(239, 68, 68, 0.04);
}

.notif-icon {
  font-size: 18px;
  line-height: 1;
  flex-shrink: 0;
  margin-top: 2px;
}

.notif-body {
  flex: 1;
  min-width: 0;
}

.notif-title {
  font-size: 13px;
  font-weight: 800;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.notif-text {
  margin-top: 2px;
  font-size: 12px;
  font-weight: 600;
  color: rgba(17, 24, 39, 0.6);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.notif-time {
  margin-top: 4px;
  font-size: 11px;
  font-weight: 700;
  color: rgba(17, 24, 39, 0.35);
}

.dismiss-btn {
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: rgba(17, 24, 39, 0.3);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  margin-top: 1px;
}

.dismiss-btn:hover {
  background: rgba(17, 24, 39, 0.06);
  color: rgba(17, 24, 39, 0.65);
}

/* TRANSITION */
.panel-enter-active {
  transition: opacity 160ms ease, transform 180ms cubic-bezier(0.22, 1, 0.36, 1);
}

.panel-leave-active {
  transition: opacity 120ms ease, transform 120ms ease;
}

.panel-enter-from,
.panel-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.97);
}
</style>
