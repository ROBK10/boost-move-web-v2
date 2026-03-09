<template>
  <div class="wrap">
    <header class="top">
      <div>
        <h1 class="title">Profil</h1>
        <p class="sub">Brukerinfo og innstillinger</p>
      </div>
    </header>

    <section class="card" v-if="user">
      <div class="row">
        <div class="label">Navn</div>
        <div class="value">{{ user.name }}</div>
      </div>

      <div class="row">
        <div class="label">E-post</div>
        <div class="value">{{ user.email }}</div>
      </div>

      <div class="row">
        <div class="label">Rolle</div>
        <div class="value">{{ user.role }}</div>
      </div>

      <div class="row">
        <div class="label">Company ID</div>
        <div class="value mono">{{ user.companyId }}</div>
      </div>
    </section>

    <section class="card" v-else>
      <p class="muted">Ingen bruker lastet. Prøv å logge inn på nytt.</p>
    </section>

    <button class="btn" type="button" @click="onLogout" :disabled="auth.isLoading">
      {{ auth.isLoading ? "Logger ut..." : "Logg ut" }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useRouter } from "vue-router"
import { useAuthStore } from "@/stores/authStore"

const router = useRouter()
const auth = useAuthStore()

const user = computed(() => auth.user)

async function onLogout() {
  await auth.logout()
  router.push("/login")
}
</script>

<style scoped>
.wrap {
  max-width: 520px;
  margin: 0 auto;
  padding: 18px 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.title {
  margin: 0;
  font-size: 28px;
  line-height: 1.1;
  font-weight: 900;
  letter-spacing: -0.02em;
  color: #111827;
}

.sub {
  margin: 6px 0 0;
  font-size: 14px;
  font-weight: 600;
  color: rgba(17, 24, 39, 0.55);
}

.card {
  background: white;
  border-radius: 18px;
  padding: 16px;
  box-shadow: 0 10px 30px rgba(20, 20, 20, 0.08);
}

.row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid rgba(17, 24, 39, 0.06);
}

.row:last-child {
  border-bottom: none;
}

.label {
  font-size: 13px;
  font-weight: 800;
  color: rgba(17, 24, 39, 0.55);
}

.value {
  font-size: 14px;
  font-weight: 800;
  color: rgba(17, 24, 39, 0.9);
  text-align: right;
}

.value.mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 12px;
}

.muted {
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  color: rgba(17, 24, 39, 0.55);
}

.btn {
  height: 46px;
  border: none;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 900;
  cursor: pointer;
  background: #111827;
  color: white;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>