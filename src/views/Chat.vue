<script setup lang="ts">
import { ref } from "vue"
import GroupChat from "@/components/chat/GroupChat.vue"
import MembersList from "@/components/chat/MembersList.vue"
import DirectChat from "@/components/chat/DirectChat.vue"

type Tab = "group" | "direct"

interface Member {
  id: string
  name: string
}

const activeTab = ref<Tab>("group")
const activeDM = ref<Member | null>(null)

function selectMember(member: Member) {
  activeDM.value = member
}

function closeDM() {
  activeDM.value = null
}

function switchTab(tab: Tab) {
  activeTab.value = tab
  if (tab === "group") activeDM.value = null
}
</script>

<template>
  <div class="chat-view">
    <!-- HEADER -->
    <header class="chat-header">
      <template v-if="activeDM">
        <button class="back-btn" type="button" @click="closeDM" aria-label="Tilbake">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <div class="dm-header-info">
          <div class="dm-name">{{ activeDM.name }}</div>
          <div class="dm-sub">Direktemelding</div>
        </div>
      </template>
      <template v-else>
        <div>
          <h1 class="chat-title">Chat</h1>
          <p class="chat-sub">Din samtale med teamet</p>
        </div>
      </template>
    </header>

    <!-- TAB BAR (hidden when in DM view) -->
    <div v-if="!activeDM" class="tab-bar">
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'group' }"
        type="button"
        @click="switchTab('group')"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
        Gruppe
      </button>
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'direct' }"
        type="button"
        @click="switchTab('direct')"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        Direkte
      </button>
    </div>

    <!-- CONTENT -->
    <GroupChat v-if="activeTab === 'group'" />

    <template v-else>
      <DirectChat
        v-if="activeDM"
        :receiverId="activeDM.id"
        :receiverName="activeDM.name"
      />
      <MembersList v-else @select="selectMember" />
    </template>
  </div>
</template>

<style scoped>
.chat-view {
  max-width: 520px;
  margin: 0 auto;
  /* Subtract the .page padding-bottom that reserves space for the fixed BottomNav,
     otherwise the input area sits behind the nav bar */
  height: calc(100dvh - 96px);
  display: flex;
  flex-direction: column;
}

/* HEADER */
.chat-header {
  padding: 18px 16px 10px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.chat-title {
  margin: 0;
  font-size: 34px;
  font-weight: 900;
  letter-spacing: -0.03em;
  color: #FFFFFF;
  line-height: 1.05;
}

.chat-sub {
  margin: 4px 0 0;
  font-size: 14px;
  font-weight: 600;
  color: rgba(209,231,229,0.6);
}

.back-btn {
  width: 38px;
  height: 38px;
  border: none;
  background: rgba(209,231,229,0.06);
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FFFFFF;
  flex-shrink: 0;
  transition: background 120ms ease;
}

.back-btn:hover {
  background: rgba(209,231,229,0.1);
}

.dm-header-info {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.dm-name {
  font-size: 17px;
  font-weight: 900;
  color: #FFFFFF;
  letter-spacing: -0.01em;
}

.dm-sub {
  font-size: 12px;
  font-weight: 600;
  color: rgba(209,231,229,0.35);
}

/* TAB BAR */
.tab-bar {
  display: flex;
  gap: 6px;
  padding: 0 16px 10px;
  flex-shrink: 0;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  padding: 0 14px;
  border-radius: 999px;
  border: none;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  color: rgba(209,231,229,0.6);
  background: rgba(209,231,229,0.06);
  transition: background 150ms ease, color 150ms ease;
  font-family: inherit;
}

.tab-btn.active {
  background: #034044;
  color: white;
}
</style>
