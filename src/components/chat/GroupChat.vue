<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from "vue"
import { useAuthStore } from "@/stores/authStore"
import { apiFetch } from "@/services/api"

interface Message {
  id: string
  userId: string
  name: string
  text: string
  createdAt: string
}

const auth = useAuthStore()
const messages = ref<Message[]>([])
const inputText = ref("")

// Boost Move system-meldinger (FYI-tips i chatten)
const BOOST_TIPS = [
  'Visste du at du har gode fordeler som medlem? Sjekk Fordeler under Movin → Utforsk.',
  'Visste du at du har programmer skrevet av samarbeidspartnere? Finn dem under Movin → Programmer.',
  'Visste du at du har artikler skrevet av samarbeidspartnere? Utforsk KnowZone under Movin.',
  'Visste du at Smart bevegelse gir deg 16 uker med tilpasset trening? Finn den under Movin.',
  'Visste du at Kom i gang gir deg 7 dager med mental trening? Start din reise under Movin.',
  'Visste du at du kan tilpasse appen til din situasjon? Gå til Profil → Min situasjon.',
  'Visste du at du kan se helsegevinsten din i kroner? Sjekk Helsekalkulator under Profil.',
  'Visste du at du kan printe ut maler for treningslogg og rutiner? Finn dem under Movin → Maler.',
  'Visste du at du kan ønske deg ting på jobben? Scroll ned på hjemmesiden og send inn ditt ønske.',
]

const boostTip = ref(BOOST_TIPS[Math.floor(Math.random() * BOOST_TIPS.length)])
const tipDismissed = ref(false)

function dismissTip() { tipDismissed.value = true }
const listEl = ref<HTMLElement | null>(null)
const isSending = ref(false)
const isLoaded = ref(false)

let timer: ReturnType<typeof setInterval> | null = null
let isFetching = false

function formatTime(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const h = d.getHours().toString().padStart(2, "0")
  const m = d.getMinutes().toString().padStart(2, "0")
  if (d.toDateString() === now.toDateString()) return `${h}:${m}`
  return `${d.getDate()}. ${d.toLocaleString("nb-NO", { month: "short" })} ${h}:${m}`
}

function isNearBottom(): boolean {
  if (!listEl.value) return true
  const { scrollTop, scrollHeight, clientHeight } = listEl.value
  return scrollHeight - scrollTop - clientHeight < 80
}

async function scrollToBottom() {
  await nextTick()
  if (listEl.value) listEl.value.scrollTop = listEl.value.scrollHeight
}

async function fetchMessages(forceScroll = false) {
  // Guard against concurrent fetches from overlapping poll ticks and send
  if (isFetching) return
  isFetching = true
  const near = isNearBottom()
  try {
    const data: Message[] = await apiFetch("/messages")
    messages.value = data
    isLoaded.value = true
    if (forceScroll || near) await scrollToBottom()
  } catch {
    // Silently ignore poll errors; the UI keeps showing the last known state
  } finally {
    isFetching = false
  }
}

async function send() {
  const text = inputText.value.trim()
  if (!text || isSending.value) return
  isSending.value = true
  inputText.value = ""
  try {
    await apiFetch("/messages", {
      method: "POST",
      body: JSON.stringify({ text }),
    })
    // Force scroll to bottom after sending own message
    await fetchMessages(true)
  } catch {
    // Restore input so the user can retry
    inputText.value = text
  } finally {
    isSending.value = false
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault()
    send()
  }
}

onMounted(async () => {
  await fetchMessages(true)
  timer = setInterval(fetchMessages, 3000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div class="chat-pane">
    <!-- Festet Boost Move-tips -->
    <div v-if="!tipDismissed" class="tip-banner">
      <div class="tip-badge">⚡ Boost Move</div>
      <div class="tip-text">{{ boostTip }}</div>
      <button class="tip-close" @click="dismissTip" aria-label="Lukk">✕</button>
    </div>

    <div class="message-list" ref="listEl">
      <div v-if="isLoaded && messages.length === 0" class="empty">
        Ingen meldinger ennå. Si hei til teamet!
      </div>

      <div
        v-for="msg in messages"
        :key="msg.id"
        class="bubble-row"
        :class="msg.userId === auth.user?.id ? 'mine' : 'theirs'"
      >
        <div v-if="msg.userId !== auth.user?.id" class="sender-name">{{ msg.name }}</div>
        <div class="bubble" :class="msg.userId === auth.user?.id ? 'mine' : 'theirs'">
          {{ msg.text }}
        </div>
        <div class="ts">{{ formatTime(msg.createdAt) }}</div>
      </div>
    </div>

    <div class="input-area">
      <input
        class="chat-input"
        type="text"
        placeholder="Skriv til teamet…"
        v-model="inputText"
        @keydown="onKeydown"
        :disabled="isSending"
        maxlength="500"
        autocomplete="off"
      />
      <button
        class="send-btn"
        type="button"
        @click="send"
        :disabled="!inputText.trim() || isSending"
        aria-label="Send"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"/>
          <polygon points="22 2 15 22 11 13 2 9 22 2"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.chat-pane {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  /* Disable browser scroll anchoring so our isNearBottom logic has full control */
  overflow-anchor: none;
}

.empty {
  margin: auto;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: rgba(209,231,229,0.35);
  padding: 32px 0;
}

.bubble-row {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.bubble-row.mine {
  align-items: flex-end;
}

.bubble-row.theirs {
  align-items: flex-start;
}

.sender-name {
  font-size: 11px;
  font-weight: 800;
  color: rgba(209,231,229,0.35);
  padding: 0 4px;
}

.bubble {
  max-width: 78%;
  padding: 11px 15px;
  border-radius: 18px;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.45;
  word-break: break-word;
}

.bubble.mine {
  background: #023238;
  color: white;
  border-bottom-right-radius: 5px;
}

.bubble.theirs {
  background: #023238;
  color: #FFFFFF;
  border-bottom-left-radius: 5px;
  box-shadow: 0 3px 12px rgba(0,0,0,0.25);
  border: 1px solid rgba(209,231,229,0.08);
}

.ts {
  font-size: 10px;
  font-weight: 600;
  color: rgba(209,231,229,0.35);
  padding: 0 4px;
}

/* Boost Move tip banner (festet) */
.tip-banner {
  flex-shrink: 0;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 16px;
  background: rgba(190, 242, 1, 0.06);
  border-bottom: 1px solid rgba(190, 242, 1, 0.12);
}

.tip-badge {
  font-size: 11px;
  font-weight: 900;
  color: #BEF201;
  white-space: nowrap;
  padding-top: 1px;
}

.tip-text {
  flex: 1;
  font-size: 13px;
  font-weight: 600;
  color: #D1E7E5;
  line-height: 1.4;
}

.tip-close {
  border: none;
  background: none;
  color: rgba(209, 231, 229, 0.35);
  font-size: 14px;
  cursor: pointer;
  padding: 0;
  flex-shrink: 0;
}

.input-area {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px 24px;
  background: rgba(2, 28, 32, 0.95);
  backdrop-filter: blur(12px);
  border-top: 1px solid rgba(209,231,229,0.08);
}

.chat-input {
  flex: 1;
  height: 46px;
  border: 1.5px solid rgba(209,231,229,0.1);
  border-radius: 14px;
  padding: 0 16px;
  font-size: 15px;
  font-weight: 600;
  color: #FFFFFF;
  background: #023238;
  outline: none;
  font-family: inherit;
  transition: border-color 150ms ease;
}

.chat-input::placeholder {
  color: rgba(209,231,229,0.35);
  font-weight: 500;
}

.chat-input:focus {
  border-color: rgba(209,231,229,0.25);
}

.chat-input:disabled {
  opacity: 0.6;
}

.send-btn {
  width: 46px;
  height: 46px;
  border-radius: 14px;
  border: none;
  background: #023238;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: opacity 150ms ease, transform 120ms ease;
}

.send-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.send-btn:not(:disabled):active {
  transform: scale(0.93);
}
</style>
