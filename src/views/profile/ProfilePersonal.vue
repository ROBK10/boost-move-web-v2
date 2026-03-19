<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"
import { useAuthStore } from "@/stores/authStore"

const router = useRouter()
const auth = useAuthStore()

const name = ref(auth.user?.name ?? "")
const bio = ref(auth.user?.bio ?? "")
const saving = ref(false)
const saveError = ref<string | null>(null)
const saveSuccess = ref(false)

async function save() {
  if (!name.value.trim()) return
  saving.value = true
  saveError.value = null
  saveSuccess.value = false
  try {
    await auth.updateProfile({ name: name.value.trim(), bio: bio.value.trim() || undefined })
    saveSuccess.value = true
    setTimeout(() => { saveSuccess.value = false }, 2000)
  } catch (e: any) {
    saveError.value = e?.message || "Noe gikk galt"
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="page">
    <div class="container">
      <header class="top">
        <button class="back" type="button" @click="router.push('/profil')" aria-label="Tilbake">
          <span class="chev" aria-hidden="true"></span>
        </button>
        <div>
          <h1 class="title">Personlige detaljer</h1>
          <p class="subtitle">Oppdater profilinformasjonen din</p>
        </div>
      </header>

      <div class="card">
        <div class="field">
          <label class="field-label" for="personal-name">Navn</label>
          <input
            id="personal-name"
            v-model="name"
            class="field-input"
            type="text"
            placeholder="Ditt fulle navn"
            autocomplete="name"
          />
        </div>

        <div class="divider"></div>

        <div class="field">
          <label class="field-label" for="personal-bio">
            Bio <span class="optional">(valgfritt)</span>
          </label>
          <textarea
            id="personal-bio"
            v-model="bio"
            class="field-input field-textarea"
            rows="4"
            placeholder="Skriv litt om deg selv…"
          />
        </div>
      </div>

      <p v-if="saveError" class="error-msg">{{ saveError }}</p>

      <button
        class="save-btn"
        type="button"
        @click="save"
        :disabled="saving || !name.trim()"
      >
        <span v-if="saving">Lagrer…</span>
        <span v-else-if="saveSuccess">Lagret!</span>
        <span v-else>Lagre endringer</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.page { width: 100%; }

.container {
  max-width: 520px;
  margin: 0 auto;
  padding: 18px 16px 60px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.top {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 4px;
}

.back {
  width: 42px;
  height: 42px;
  border: none;
  background: #023238;
  border-radius: 999px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  cursor: pointer;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  margin-top: 4px;
}

.chev {
  width: 12px;
  height: 12px;
  border-left: 2px solid rgba(209,231,229,0.5);
  border-bottom: 2px solid rgba(209,231,229,0.5);
  transform: rotate(45deg);
}

.title {
  margin: 0;
  font-size: 28px;
  font-weight: 900;
  letter-spacing: -0.03em;
  color: #FFFFFF;
}

.subtitle {
  margin: 6px 0 0;
  font-size: 14px;
  font-weight: 700;
  color: rgba(209,231,229,0.35);
}

.card {
  background: #023238;
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.25);
  border: 1px solid rgba(209,231,229,0.08);
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-size: 13px;
  font-weight: 800;
  color: rgba(209,231,229,0.6);
}

.optional {
  font-weight: 600;
  color: rgba(209,231,229,0.35);
}

.field-input {
  border: 1.5px solid rgba(209,231,229,0.1);
  border-radius: 14px;
  padding: 12px 14px;
  font-size: 15px;
  font-weight: 600;
  font-family: inherit;
  color: #FFFFFF;
  background: rgba(209,231,229,0.04);
  transition: border-color 140ms ease, box-shadow 140ms ease;
  -webkit-appearance: none;
}

.field-input:focus {
  outline: none;
  border-color: rgba(209,231,229,0.25);
  box-shadow: 0 0 0 3px rgba(209,231,229,0.08);
}

.field-textarea {
  resize: none;
  line-height: 1.5;
}

.divider {
  height: 1px;
  background: rgba(209,231,229,0.06);
}

.error-msg {
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  color: #dc2626;
}

.save-btn {
  height: 54px;
  border: none;
  border-radius: 16px;
  background: #023238;
  color: white;
  font-size: 16px;
  font-weight: 900;
  font-family: inherit;
  cursor: pointer;
  transition: opacity 150ms ease;
}

.save-btn:disabled {
  opacity: 0.45;
  cursor: default;
}
</style>
