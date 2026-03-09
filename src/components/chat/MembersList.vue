<script setup lang="ts">
import { ref, onMounted } from "vue"
import { apiFetch } from "@/services/api"

interface Member {
  id: string
  name: string
}

const emit = defineEmits<{
  (e: "select", member: Member): void
}>()

const members = ref<Member[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    const data: Member[] = await apiFetch("/workplace-members")
    members.value = data
  } catch {
    error.value = "Kunne ikke laste kollegaer."
  } finally {
    isLoading.value = false
  }
})

function initials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}
</script>

<template>
  <div class="members-pane">
    <div class="section-label">Kollegaer</div>

    <div v-if="error" class="status-msg error-msg">{{ error }}</div>

    <div v-else-if="!isLoading && members.length === 0" class="status-msg">
      Ingen kollegaer funnet.
    </div>

    <div
      v-for="member in members"
      :key="member.id"
      class="member-row"
      role="button"
      tabindex="0"
      @click="emit('select', member)"
      @keydown.enter.prevent="emit('select', member)"
      @keydown.space.prevent="emit('select', member)"
    >
      <div class="avatar">{{ initials(member.name) }}</div>
      <div class="member-name">{{ member.name }}</div>
      <span class="chev" aria-hidden="true"></span>
    </div>
  </div>
</template>

<style scoped>
.members-pane {
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.section-label {
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(17, 24, 39, 0.38);
  padding: 4px 4px 8px;
}

.status-msg {
  padding: 24px 4px;
  font-size: 14px;
  font-weight: 600;
  color: rgba(17, 24, 39, 0.4);
}

.error-msg {
  color: #dc2626;
}

.member-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 14px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 3px 12px rgba(20, 20, 20, 0.06);
  border: 1px solid rgba(17, 24, 39, 0.05);
  cursor: pointer;
  transition: transform 120ms ease, box-shadow 120ms ease;
  user-select: none;
}

.member-row:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(20, 20, 20, 0.09);
}

.member-row:focus-visible {
  outline: 3px solid rgba(99, 102, 241, 0.22);
  outline-offset: 2px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 900;
  color: white;
  flex-shrink: 0;
}

.member-name {
  flex: 1;
  font-size: 15px;
  font-weight: 800;
  color: #111827;
}

.chev {
  width: 9px;
  height: 9px;
  border-right: 2px solid rgba(17, 24, 39, 0.24);
  border-top: 2px solid rgba(17, 24, 39, 0.24);
  transform: rotate(45deg);
  flex-shrink: 0;
}
</style>
