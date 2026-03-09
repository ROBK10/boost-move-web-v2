<template>
  <div class="wrap">
    <div class="card">
      <h1 class="title">Logg inn</h1>
      <p class="sub">Bruk e-post og passord.</p>

      <form class="form" @submit.prevent="onLogin">
        <label class="label">
          E-post
          <input
            v-model.trim="email"
            class="input"
            type="email"
            autocomplete="email"
            placeholder="ola@bedrift.no"
            required
          />
        </label>

        <label class="label">
          Passord
          <input
            v-model="password"
            class="input"
            type="password"
            autocomplete="current-password"
            placeholder="••••••••"
            required
          />
        </label>

        <p v-if="auth.error" class="error">{{ auth.error }}</p>

        <button class="btn" type="submit" :disabled="auth.isLoading">
          {{ auth.isLoading ? "Logger inn..." : "Logg inn" }}
        </button>
      </form>

      <div class="divider"></div>

      <button class="btn secondary" type="button" @click="onCreateDemo" :disabled="auth.isLoading">
        {{ auth.isLoading ? "Oppretter..." : "Lag demo-bruker (test)" }}
      </button>

      <p class="hint">Tips: Demo-bruker lages i databasen og du blir logget inn automatisk.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"
import { useAuthStore } from "../stores/authStore"

const router = useRouter()
const auth = useAuthStore()

const email = ref("")
const password = ref("")

async function onLogin() {
  await auth.login(email.value, password.value)
  router.push("/")
}

async function onCreateDemo() {
  // Lager en unik demo-epost hver gang
  const rand = Math.random().toString(16).slice(2, 8)
  const demoEmail = `demo-${rand}@boostmove.no`

  await auth.register({
    name: "Demo Bruker",
    email: demoEmail,
    password: "Test12345!",
    companyName: "Demo Company",
  })

  router.push("/")
}
</script>

<style scoped>
.wrap {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px 16px;
  background: #f4f6f8;
}

.card {
  width: 100%;
  max-width: 420px;
  background: #fff;
  border-radius: 22px;
  padding: 22px;
  box-shadow: 0 20px 60px rgba(16, 24, 40, 0.08);
}

.title {
  margin: 0;
  font-size: 28px;
  font-weight: 900;
  letter-spacing: -0.02em;
  color: #111827;
}

.sub {
  margin: 6px 0 18px;
  font-size: 14px;
  font-weight: 600;
  color: rgba(17, 24, 39, 0.55);
}

.form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  font-weight: 700;
  color: rgba(17, 24, 39, 0.75);
}

.input {
  height: 46px;
  border-radius: 14px;
  border: 1px solid rgba(17, 24, 39, 0.12);
  padding: 0 14px;
  font-size: 15px;
  outline: none;
}

.input:focus {
  border-color: rgba(17, 24, 39, 0.28);
}

.error {
  margin: 0;
  color: #dc2626;
  font-weight: 700;
  font-size: 13px;
}

.btn {
  height: 46px;
  border: none;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  background: #111827;
  color: white;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn.secondary {
  background: rgba(17, 24, 39, 0.06);
  color: #111827;
}

.divider {
  height: 1px;
  background: rgba(17, 24, 39, 0.08);
  margin: 16px 0;
}

.hint {
  margin: 12px 0 0;
  font-size: 12px;
  font-weight: 600;
  color: rgba(17, 24, 39, 0.5);
}
</style>