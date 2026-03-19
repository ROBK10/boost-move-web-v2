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


</script>

<style scoped>
.wrap {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px 16px;
  background: #021C20;
}

.card {
  width: 100%;
  max-width: 420px;
  background: #023238;
  border-radius: 22px;
  padding: 22px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}

.title {
  margin: 0;
  font-size: 28px;
  font-weight: 900;
  letter-spacing: -0.02em;
  color: #FFFFFF;
}

.sub {
  margin: 6px 0 18px;
  font-size: 14px;
  font-weight: 600;
  color: rgba(209,231,229,0.6);
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
  color: #D1E7E5;
}

.input {
  height: 46px;
  border-radius: 14px;
  border: 1px solid rgba(209,231,229,0.12);
  background: #034044;
  padding: 0 14px;
  font-size: 15px;
  color: #D1E7E5;
  outline: none;
}

.input::placeholder {
  color: rgba(209,231,229,0.3);
}

.input:focus {
  border-color: rgba(209,231,229,0.25);
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
  background: #BEF201;
  color: #023238;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

</style>