<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch } from "vue"
import { useAuthStore } from "@/stores/authStore"
import { apiFetch } from "@/services/api"

interface DMMessage {
  id: string
  senderId: string
  senderName: string
  receiverId: string
  text: string
  createdAt: string
}

const props = defineProps<{
  receiverId: string
  receiverName: string
}>()

const auth = useAuthStore()
const messages = ref<DMMessage[]>([])
const inputText = ref("")
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
  if (!auth.user) return
  // Guard against concurrent fetches from overlapping poll ticks and send
  if (isFetching) return
  isFetching = true
  const near = isNearBottom()
  try {
    const data: DMMessage[] = await apiFetch(
      `/direct-messages?userA=${auth.user.id}&userB=${props.receiverId}`
    )
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
    await apiFetch("/direct-messages", {
      method: "POST",
      body: JSON.stringify({ receiverId: props.receiverId, text }),
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

function startPolling() {
  if (timer) clearInterval(timer)
  timer = setInterval(fetchMessages, 3000)
}

onMounted(async () => {
  await fetchMessages(true)
  startPolling()
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

// Restart cleanly when switching DM partners
watch(
  () => props.receiverId,
  async () => {
    if (timer) clearInterval(timer)
    timer = null
    isFetching = false
    messages.value = []
    inputText.value = ""
    isLoaded.value = false
    await fetchMessages(true)
    startPolling()
  }
)
</script>

<template>
  <div class="chat-pane">
    <div class="message-list" ref="listEl">
      <div v-if="isLoaded && messages.length === 0" class="empty">
        Ingen meldinger ennå. Send den første!
      </div>

      <div
        v-for="msg in messages"
        :key="msg.id"
        class="bubble-row"
        :class="msg.senderId === auth.user?.id ? 'mine' : 'theirs'"
      >
        <div class="bubble" :class="msg.senderId === auth.user?.id ? 'mine' : 'theirs'">
          {{ msg.text }}
        </div>
        <div class="ts">{{ formatTime(msg.createdAt) }}</div>
      </div>
    </div>

    <div class="input-area">
      <input
        class="chat-input"
        type="text"
        :placeholder="`Melding til ${receiverName}…`"
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
  color: rgba(17, 24, 39, 0.4);
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
  background: #111827;
  color: white;
  border-bottom-right-radius: 5px;
}

.bubble.theirs {
  background: white;
  color: #111827;
  border-bottom-left-radius: 5px;
  box-shadow: 0 3px 12px rgba(20, 20, 20, 0.07);
  border: 1px solid rgba(17, 24, 39, 0.06);
}

.ts {
  font-size: 10px;
  font-weight: 600;
  color: rgba(17, 24, 39, 0.32);
  padding: 0 4px;
}

.input-area {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px 24px;
  background: rgba(249, 250, 251, 0.95);
  backdrop-filter: blur(12px);
  border-top: 1px solid rgba(17, 24, 39, 0.07);
}

.chat-input {
  flex: 1;
  height: 46px;
  border: 1.5px solid rgba(17, 24, 39, 0.1);
  border-radius: 14px;
  padding: 0 16px;
  font-size: 15px;
  font-weight: 600;
  color: #111827;
  background: white;
  outline: none;
  font-family: inherit;
  transition: border-color 150ms ease;
}

.chat-input::placeholder {
  color: rgba(17, 24, 39, 0.35);
  font-weight: 500;
}

.chat-input:focus {
  border-color: rgba(17, 24, 39, 0.28);
}

.chat-input:disabled {
  opacity: 0.6;
}

.send-btn {
  width: 46px;
  height: 46px;
  border-radius: 14px;
  border: none;
  background: #111827;
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
