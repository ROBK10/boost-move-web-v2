<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"
import { useAuthStore } from "@/stores/authStore"
import { changePassword } from "@/services/userService"

const router = useRouter()
const auth = useAuthStore()

// Change password
const currentPassword = ref("")
const newPassword = ref("")
const newPasswordConfirm = ref("")
const pwSaving = ref(false)
const pwError = ref<string | null>(null)
const pwSuccess = ref(false)

async function onChangePassword() {
  pwError.value = null
  if (!currentPassword.value || !newPassword.value) {
    pwError.value = "Fyll ut alle feltene"
    return
  }
  if (newPassword.value.length < 8) {
    pwError.value = "Nytt passord må være minst 8 tegn"
    return
  }
  if (newPassword.value !== newPasswordConfirm.value) {
    pwError.value = "Passordene stemmer ikke overens"
    return
  }
  pwSaving.value = true
  try {
    await changePassword({ currentPassword: currentPassword.value, newPassword: newPassword.value })
    pwSuccess.value = true
    currentPassword.value = ""
    newPassword.value = ""
    newPasswordConfirm.value = ""
    setTimeout(() => { pwSuccess.value = false }, 3000)
  } catch (e: any) {
    pwError.value = e?.message || "Noe gikk galt"
  } finally {
    pwSaving.value = false
  }
}

// Delete account
const showDeleteConfirm = ref(false)
const deleteConfirmText = ref("")
const deleting = ref(false)

async function onLogout() {
  await auth.logout()
  router.push("/login")
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
          <h1 class="title">Personvern og sikkerhet</h1>
          <p class="subtitle">Administrer kontoen din</p>
        </div>
      </header>

      <!-- GDPR: Personvernerklæring -->
      <div class="section-label">Personvernerklæring</div>
      <div class="card gdpr-card">
        <p class="gdpr-text">
          Boost Move behandler personopplysninger for å levere en personalisert helseopplevelse på jobb. Vi samler inn navn, e-post, helsescore og aktivitetsdata.
        </p>
        <p class="gdpr-text">
          Dataene dine brukes utelukkende til å vise deg din egen fremgang og gi aggregerte statistikker til din arbeidsgiver. Vi selger aldri data til tredjeparter.
        </p>
        <p class="gdpr-text">
          Du har rett til innsyn, retting og sletting av dine personopplysninger. Se «Faresone» nedenfor for å slette kontoen din.
        </p>
        <p class="gdpr-text">
          Ansvarlig behandlingsansvarlig: Boost Move AS, Norge. Behandlingsgrunnlag: samtykke (GDPR art. 6 nr. 1 a).
        </p>
      </div>

      <!-- GDPR: Databehandling -->
      <div class="section-label">Databehandling</div>
      <div class="card gdpr-card">
        <p class="gdpr-text">
          <strong>Hva vi lagrer:</strong> Navn, e-postadresse, helsescore, boost-aktivitet, refleksjonstekster og meldinger i gruppekanaler du deltar i.
        </p>
        <p class="gdpr-text">
          <strong>Lagring:</strong> Data lagres på servere innenfor EU/EØS. Vi benytter kryptert overføring (HTTPS) og passord lagres som krypterte hash-verdier.
        </p>
        <p class="gdpr-text">
          <strong>Oppbevaringstid:</strong> Data slettes 30 dager etter at kontoen din slettes. Du kan når som helst be om umiddelbar sletting.
        </p>
        <p class="gdpr-text">
          <strong>Dine rettigheter:</strong> Innsyn · Retting · Sletting · Begrensning · Dataportabilitet · Klage til Datatilsynet (datatilsynet.no).
        </p>
      </div>

      <!-- Kontakt -->
      <div class="section-label">Kontakt</div>
      <div class="card gdpr-card">
        <p class="gdpr-text">
          Har du spørsmål om hvordan vi behandler dataene dine, eller ønsker du å utøve dine rettigheter?
        </p>
        <p class="gdpr-text">
          <strong>E-post:</strong> personvern@boostmove.no
        </p>
        <p class="gdpr-text">
          Vi svarer innen 5 virkedager.
        </p>
      </div>

      <!-- Endre passord -->
      <div class="section-label">Endre passord</div>
      <div class="card">
        <div class="field">
          <label class="field-label" for="current-pw">Nåværende passord</label>
          <input
            id="current-pw"
            v-model="currentPassword"
            class="field-input"
            type="password"
            placeholder="••••••••"
            autocomplete="current-password"
          />
        </div>

        <div class="divider"></div>

        <div class="field">
          <label class="field-label" for="new-pw">Nytt passord</label>
          <input
            id="new-pw"
            v-model="newPassword"
            class="field-input"
            type="password"
            placeholder="Minst 8 tegn"
            autocomplete="new-password"
          />
        </div>

        <div class="field">
          <label class="field-label" for="new-pw-confirm">Bekreft nytt passord</label>
          <input
            id="new-pw-confirm"
            v-model="newPasswordConfirm"
            class="field-input"
            type="password"
            placeholder="Gjenta passord"
            autocomplete="new-password"
          />
        </div>

        <p v-if="pwError" class="error-msg">{{ pwError }}</p>
        <p v-if="pwSuccess" class="success-msg">Passordet er oppdatert!</p>

        <button
          class="save-btn"
          type="button"
          @click="onChangePassword"
          :disabled="pwSaving"
        >
          {{ pwSaving ? "Lagrer…" : "Oppdater passord" }}
        </button>
      </div>

      <!-- Konto handlinger -->
      <div class="section-label">Konto handlinger</div>
      <div class="card card--list">
        <button class="list-row" type="button" @click="onLogout" :disabled="auth.isLoading">
          <span class="row-icon row-icon--warn" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </span>
          <span class="row-label">Logg ut alle enheter</span>
          <span class="row-chev" aria-hidden="true"></span>
        </button>
      </div>

      <!-- Danger zone -->
      <div class="section-label section-label--danger">Faresone</div>
      <div class="card card--danger">
        <p class="danger-desc">
          Sletting av kontoen er permanent og kan ikke angres. All data blir slettet.
        </p>

        <template v-if="!showDeleteConfirm">
          <button class="danger-btn" type="button" @click="showDeleteConfirm = true">
            Slett konto
          </button>
        </template>

        <template v-else>
          <div class="field">
            <label class="field-label field-label--danger" for="delete-confirm">
              Skriv SLETT for å bekrefte
            </label>
            <input
              id="delete-confirm"
              v-model="deleteConfirmText"
              class="field-input field-input--danger"
              type="text"
              placeholder="SLETT"
              autocomplete="off"
            />
          </div>
          <div class="danger-actions">
            <button class="cancel-btn" type="button" @click="showDeleteConfirm = false; deleteConfirmText = ''">
              Avbryt
            </button>
            <button
              class="confirm-delete-btn"
              type="button"
              :disabled="deleteConfirmText !== 'SLETT' || deleting"
            >
              {{ deleting ? "Sletter…" : "Bekreft sletting" }}
            </button>
          </div>
        </template>
      </div>
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
  gap: 6px;
}

.top {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 10px;
}

.back {
  width: 42px;
  height: 42px;
  border: none;
  background: white;
  border-radius: 999px;
  box-shadow: 0 10px 30px rgba(20, 20, 20, 0.08);
  cursor: pointer;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  margin-top: 4px;
}

.chev {
  width: 12px;
  height: 12px;
  border-left: 2px solid rgba(17, 24, 39, 0.55);
  border-bottom: 2px solid rgba(17, 24, 39, 0.55);
  transform: rotate(45deg);
}

.title {
  margin: 0;
  font-size: 26px;
  font-weight: 900;
  letter-spacing: -0.03em;
  color: #111827;
}

.subtitle {
  margin: 6px 0 0;
  font-size: 14px;
  font-weight: 700;
  color: rgba(17, 24, 39, 0.45);
}

.section-label {
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(17, 24, 39, 0.42);
  padding: 14px 4px 6px;
}

.section-label--danger {
  color: rgba(220, 38, 38, 0.55);
}

.card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(20, 20, 20, 0.06);
  border: 1px solid rgba(17, 24, 39, 0.05);
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.card--list {
  padding: 0;
  overflow: hidden;
  gap: 0;
}

.card--danger {
  border-color: rgba(220, 38, 38, 0.15);
  background: rgba(220, 38, 38, 0.02);
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-size: 13px;
  font-weight: 800;
  color: rgba(17, 24, 39, 0.55);
}

.field-label--danger {
  color: rgba(220, 38, 38, 0.70);
}

.field-input {
  border: 1.5px solid rgba(17, 24, 39, 0.10);
  border-radius: 14px;
  padding: 12px 14px;
  font-size: 15px;
  font-weight: 600;
  font-family: inherit;
  color: #111827;
  background: rgba(17, 24, 39, 0.025);
  transition: border-color 140ms ease, box-shadow 140ms ease;
  -webkit-appearance: none;
}

.field-input:focus {
  outline: none;
  border-color: rgba(17, 24, 39, 0.28);
  box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.05);
}

.field-input--danger {
  border-color: rgba(220, 38, 38, 0.25);
}

.field-input--danger:focus {
  border-color: rgba(220, 38, 38, 0.50);
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.06);
}

.divider {
  height: 1px;
  background: rgba(17, 24, 39, 0.06);
}

.error-msg {
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  color: #dc2626;
}

.success-msg {
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  color: #16a34a;
}

.save-btn {
  height: 50px;
  border: none;
  border-radius: 14px;
  background: #111827;
  color: white;
  font-size: 15px;
  font-weight: 900;
  font-family: inherit;
  cursor: pointer;
  transition: opacity 150ms ease;
}

.save-btn:disabled {
  opacity: 0.45;
  cursor: default;
}

.list-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  transition: background 120ms ease;
}

.list-row:active { background: rgba(17, 24, 39, 0.03); }
.list-row:disabled { opacity: 0.5; cursor: not-allowed; }

.row-icon {
  width: 36px;
  height: 36px;
  background: rgba(17, 24, 39, 0.05);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(17, 24, 39, 0.65);
  flex-shrink: 0;
}

.row-icon--warn {
  background: rgba(234, 88, 12, 0.08);
  color: #ea580c;
}

.row-label {
  flex: 1;
  font-size: 15px;
  font-weight: 800;
  color: #111827;
}

.row-chev {
  width: 9px;
  height: 9px;
  border-right: 2px solid rgba(17, 24, 39, 0.28);
  border-top: 2px solid rgba(17, 24, 39, 0.28);
  transform: rotate(45deg);
}

/* Danger zone */
.danger-desc {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: rgba(17, 24, 39, 0.55);
  line-height: 1.5;
}

.danger-btn {
  height: 48px;
  border: 1.5px solid rgba(220, 38, 38, 0.35);
  border-radius: 14px;
  background: none;
  color: #dc2626;
  font-size: 15px;
  font-weight: 900;
  font-family: inherit;
  cursor: pointer;
  transition: background 140ms ease;
}

.danger-btn:active {
  background: rgba(220, 38, 38, 0.05);
}

.danger-actions {
  display: flex;
  gap: 10px;
}

.cancel-btn {
  flex: 1;
  height: 48px;
  border: 1.5px solid rgba(17, 24, 39, 0.12);
  border-radius: 14px;
  background: none;
  color: rgba(17, 24, 39, 0.65);
  font-size: 15px;
  font-weight: 900;
  font-family: inherit;
  cursor: pointer;
}

.confirm-delete-btn {
  flex: 1;
  height: 48px;
  border: none;
  border-radius: 14px;
  background: #dc2626;
  color: white;
  font-size: 15px;
  font-weight: 900;
  font-family: inherit;
  cursor: pointer;
  transition: opacity 150ms ease;
}

.confirm-delete-btn:disabled {
  opacity: 0.35;
  cursor: default;
}

/* GDPR static cards */
.gdpr-card {
  gap: 10px;
}

.gdpr-text {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: rgba(17, 24, 39, 0.65);
  line-height: 1.6;
}

.gdpr-text strong {
  font-weight: 800;
  color: rgba(17, 24, 39, 0.80);
}
</style>
