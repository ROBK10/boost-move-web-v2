# Treningsprogram — Teknisk spesifikasjon for Boost Move

## Oversikt

Denne filen beskriver hvordan treningsprogramfunksjonen i Boost Move-appen skal bygges.
Funksjonen er inspirert av prinsippene bak "Smart mosjon i arbeidslivet" (Helsedirektoratet / Syddansk Universitet 2019),
men er en **selvstendig implementasjon** basert på den offentlig tilgjengelige forskningen.

> **Viktig:** Vi kopierer ikke kode, øvelser eller innhold fra helsenorge.no eller helsedirektoratet.no.
> Vi bygger vår egen algoritme og øvelsesbank basert på de samme forskningsprinsippene.
> Kilde: Dalager et al. (2019), Syddansk Universitet — rapporten er offentlig tilgjengelig.

---

## 1. Brukerflyt — onboarding og kartlegging

Brukeren svarer på et kort spørreskjema (maks 8 spørsmål) første gang.
Svarene lagres og brukes til å generere et tilpasset treningsprogram.

### 1.1 Spørsmål som stilles (kartleggingsskjema)

```
Spørsmål 1: Hva beskriver arbeidsdagen din best?
  - A: Stillesittende (kontor, dataarbeid, bil/transport)
  - B: Stående/gående (butikk, pleie, renhold, produksjon)
  - C: Tungt fysisk arbeid (bygg, lager, løfting, helse med forflytning)

Spørsmål 2: Alder
  - Under 30 / 30–45 / 46–60 / Over 60

Spørsmål 3: Kondisjon (selvvurdert)
  - Lav (blir fort andpusten)
  - Middels (klarer 20 min rolig løping)
  - God (trener regelmessig)

Spørsmål 4: Styrke (selvvurdert)
  - Lav / Middels / God

Spørsmål 5: Smerter eller plager? (flervalg)
  - Ingen plager
  - Nakke / øvre rygg
  - Korsrygg / nedre rygg
  - Skulder / arm
  - Kne / hofte / ben

Spørsmål 6: Varighet på plager (vises kun hvis plager er valgt)
  - Sporadisk (av og til)
  - Gjentakende (ukentlig)
  - Vedvarende (daglig)

Spørsmål 7: Tilgang til utstyr?
  - Ingen (kroppen som vekt)
  - Strikk / elastikk
  - Manualer / vekter
  - Treningssenter

Spørsmål 8: Hvor mye tid har du per treningsøkt?
  - 10 min
  - 25 min
  - 50 min
```

### 1.2 Datamodell — brukerinnstillinger

```typescript
interface UserProfile {
  workType: 'sedentary' | 'standing' | 'heavy'
  ageGroup: 'under30' | '30to45' | '46to60' | 'over60'
  cardioLevel: 'low' | 'medium' | 'high'
  strengthLevel: 'low' | 'medium' | 'high'
  painAreas: PainArea[]
  painFrequency: 'occasional' | 'recurring' | 'persistent' | null
  equipment: Equipment[]
  sessionDuration: 10 | 25 | 50
  programWeek: number          // Hvilken uke i 16-ukers programmet
  createdAt: Date
  updatedAt: Date
}

type PainArea = 'none' | 'neck_upper_back' | 'lower_back' | 'shoulder_arm' | 'knee_hip_leg'
type Equipment = 'bodyweight' | 'band' | 'dumbbells' | 'gym'
```

---

## 2. Algoritmen — slik genereres treningsprogrammet

### 2.1 Prinsipp

Programmet er alltid strukturert slik:

```
1. Oppvarming         (5–10 min, alltid med)
2. Arbeidsprofiltrening  (basert på workType)
3. Individuell trening   (basert på painAreas + nivå)
4. Avkjøling / tøying  (2–5 min, alltid med)
```

### 2.2 Arbeidsprofillogikk

```typescript
function getWorkProfile(workType: string, cardioLevel: string, strengthLevel: string) {

  if (workType === 'sedentary') {
    // Kontor, bil, dataarbeid
    // Problem: for lite bevegelse, risiko for nakke/rygg/skulder
    return {
      focus: 'cardio_and_upper_strength',
      cardioMinutes: cardioLevel === 'low' ? 15 : 10,
      strengthFocus: ['upper_back', 'core', 'glutes'],
      note: 'Bryt stillesittingen — bevegelse er medisin'
    }
  }

  if (workType === 'standing') {
    // Butikk, pleie, renhold, produksjon
    // Problem: statisk belastning på bein og rygg, lite dynamisk bevegelse
    return {
      focus: 'lower_body_and_core',
      cardioMinutes: 5,
      strengthFocus: ['legs', 'core', 'lower_back'],
      note: 'Styrk musklene som bærer deg gjennom arbeidsdagen'
    }
  }

  if (workType === 'heavy') {
    // Bygg, lager, helse med tunge løft
    // Problem: overbelastning, skaderisiko, asymmetrisk belastning
    return {
      focus: 'full_body_recovery_and_stability',
      cardioMinutes: 10,
      strengthFocus: ['core', 'legs', 'upper_back', 'shoulders'],
      note: 'Bygg kapasitet og forebygg slitasje'
    }
  }
}
```

### 2.3 Individuell tilpasning basert på plager

```typescript
function getIndividualExercises(painAreas: PainArea[], equipment: Equipment[]) {
  const exercises = []

  if (painAreas.includes('neck_upper_back')) {
    exercises.push(
      { id: 'shoulder_raise', name: 'Skulderhev', sets: 3, reps: 12 },
      { id: 'neck_rotation', name: 'Nakkerotasjon', sets: 2, reps: 10 },
      { id: 'band_row_seated', name: 'Sittende roing med strikk', sets: 3, reps: 12,
        requiresEquipment: 'band' }
    )
  }

  if (painAreas.includes('lower_back')) {
    exercises.push(
      { id: 'bird_dog', name: 'Bird dog', sets: 3, reps: 10 },
      { id: 'glute_bridge', name: 'Glute bridge', sets: 3, reps: 15 },
      { id: 'dead_bug', name: 'Dead bug', sets: 2, reps: 10 }
    )
  }

  if (painAreas.includes('shoulder_arm')) {
    exercises.push(
      { id: 'band_side_raise', name: 'Sidehev med strikk', sets: 3, reps: 12,
        requiresEquipment: 'band' },
      { id: 'forward_lean_raise', name: 'Foroverbøyd sidehev', sets: 3, reps: 12 },
      { id: 'wall_angels', name: 'Veggengel', sets: 2, reps: 10 }
    )
  }

  if (painAreas.includes('knee_hip_leg')) {
    exercises.push(
      { id: 'single_leg_squat', name: 'Ettbens knebøy', sets: 3, reps: 8 },
      { id: 'single_leg_balance', name: 'Ettbens balanse', sets: 3, duration: 30 },
      { id: 'calf_raise', name: 'Tåhev', sets: 3, reps: 15 }
    )
  }

  // Filtrer bort øvelser som krever utstyr brukeren ikke har
  return exercises.filter(ex =>
    !ex.requiresEquipment || equipment.includes(ex.requiresEquipment)
  )
}
```

### 2.4 16-ukers progressjon

Programmet kjøres over 16 uker og øker gradvis i volum.

```typescript
function getWeeklyProgression(baseReps: number, week: number): number {
  // Uke 1–4:   grunnbygging (100%)
  // Uke 5–8:   økt volum (+10%)
  // Uke 9–12:  høyt volum (+20%)
  // Uke 13–16: vedlikehold / peak (15% over base)

  if (week <= 4)  return baseReps
  if (week <= 8)  return Math.round(baseReps * 1.1)
  if (week <= 12) return Math.round(baseReps * 1.2)
  return Math.round(baseReps * 1.15)
}

function getSetsProgression(baseSets: number, week: number): number {
  if (week <= 4)  return baseSets
  if (week <= 8)  return baseSets + 1
  if (week <= 12) return baseSets + 1
  return baseSets + 1
}
```

---

## 3. Øvelsesbank — struktur og innhold

Øvelsene er **våre egne** — ikke kopiert fra helsenorge.no.
Basert på generell treningsfysiologi og allmenn kunnskap.

### 3.1 Øvelse-datamodell

```typescript
interface Exercise {
  id: string
  name: string                    // Norsk navn
  category: ExerciseCategory
  targetMuscles: string[]
  equipment: Equipment[]          // hva som trengs (tom = kun kropp)
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  defaultSets: number
  defaultReps: number | null      // null hvis tid brukes
  defaultDuration: number | null  // sekunder
  instructions: string[]          // steg-for-steg på norsk
  videoUrl: string | null         // egen video
  imageUrl: string | null
  contraindications: PainArea[]   // Ikke anbefalt ved disse plagene
  workTypeRecommended: WorkType[] // Hvilke arbeidsprofiler øvelsen passer for
}

type ExerciseCategory =
  | 'warmup'        // Oppvarming
  | 'cardio'        // Kondisjon
  | 'strength'      // Styrke
  | 'core'          // Kjerne / stabilitet
  | 'mobility'      // Bevegelighet / tøying
  | 'balance'       // Balanse
```

### 3.2 Eksempel-øvelser (seed-data til databasen)

```typescript
const exerciseBank: Exercise[] = [

  // --- OPPVARMING ---
  {
    id: 'warmup_march',
    name: 'Marsjering på stedet',
    category: 'warmup',
    targetMuscles: ['quadriceps', 'hip_flexors', 'core'],
    equipment: [],
    difficulty: 'beginner',
    defaultSets: 1,
    defaultReps: null,
    defaultDuration: 60,
    instructions: [
      'Stå oppreist med skulderbreddes avstand mellom beina',
      'Løft knærne vekselvis opp mot hoftehoyde',
      'Swing armene naturlig i motbevegelse',
      'Hold jevnt tempo i 60 sekunder'
    ],
    videoUrl: null,
    imageUrl: null,
    contraindications: [],
    workTypeRecommended: ['sedentary', 'standing', 'heavy']
  },

  {
    id: 'warmup_arm_circles',
    name: 'Armsirkler',
    category: 'warmup',
    targetMuscles: ['shoulders', 'upper_back'],
    equipment: [],
    difficulty: 'beginner',
    defaultSets: 1,
    defaultReps: null,
    defaultDuration: 30,
    instructions: [
      'Stå oppreist med armene ut til siden',
      'Lag store sirkler fremover i 15 sekunder',
      'Bytt retning og lag sirkler bakover i 15 sekunder',
      'Hold skuldrene nede og avslappet'
    ],
    videoUrl: null,
    imageUrl: null,
    contraindications: [],
    workTypeRecommended: ['sedentary', 'standing', 'heavy']
  },

  // --- NAKKE / ØVRE RYGG ---
  {
    id: 'shoulder_raise',
    name: 'Skulderhev',
    category: 'mobility',
    targetMuscles: ['upper_trapezius', 'neck'],
    equipment: [],
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: 12,
    defaultDuration: null,
    instructions: [
      'Stå eller sitt oppreist',
      'Løft begge skuldrene opp mot ørene på innpust',
      'Hold i 1 sekund på toppen',
      'Slipp skuldrene ned og bakover på utpust',
      'Gjenta rolig og kontrollert'
    ],
    videoUrl: null,
    imageUrl: null,
    contraindications: [],
    workTypeRecommended: ['sedentary', 'standing']
  },

  {
    id: 'band_row_seated',
    name: 'Sittende roing med strikk',
    category: 'strength',
    targetMuscles: ['rhomboids', 'middle_trapezius', 'biceps'],
    equipment: ['band'],
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: 12,
    defaultDuration: null,
    instructions: [
      'Fest strikken rundt en stabil gjenstand i brysthøyde',
      'Sitt eller stå med strakt rygg',
      'Hold strikken med begge hender, strake armer foran deg',
      'Trekk strikken mot magen mens du fører albuene bakover',
      'Klem skulderbladene sammen på toppen',
      'Strekk rolig tilbake til utgangsposisjon'
    ],
    videoUrl: null,
    imageUrl: null,
    contraindications: [],
    workTypeRecommended: ['sedentary', 'standing', 'heavy']
  },

  // --- KORSRYGG / KJERNE ---
  {
    id: 'glute_bridge',
    name: 'Glute bridge',
    category: 'strength',
    targetMuscles: ['glutes', 'hamstrings', 'lower_back', 'core'],
    equipment: [],
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: 15,
    defaultDuration: null,
    instructions: [
      'Legg deg på ryggen med bøyde knær og føttene flate i gulvet',
      'Ha armene langs siden med håndflatene ned',
      'Stram sete og mage',
      'Løft hoften opp til kroppen danner en rett linje fra knær til skuldre',
      'Hold i 2 sekunder på toppen',
      'Senk rolig ned igjen'
    ],
    videoUrl: null,
    imageUrl: null,
    contraindications: [],
    workTypeRecommended: ['sedentary', 'standing', 'heavy']
  },

  {
    id: 'bird_dog',
    name: 'Bird dog',
    category: 'core',
    targetMuscles: ['core', 'glutes', 'lower_back', 'shoulder_stabilizers'],
    equipment: [],
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: 10,
    defaultDuration: null,
    instructions: [
      'Start på alle fire med håndledd under skuldrene og knærne under hoftene',
      'Stram kjernemuskulaturen',
      'Strekk høyre arm fremover og venstre bein bakover samtidig',
      'Hold ryggen rett — unngå å rotere eller svaie',
      'Hold 2 sekunder, før tilbake rolig',
      'Bytt side — venstre arm og høyre bein'
    ],
    videoUrl: null,
    imageUrl: null,
    contraindications: [],
    workTypeRecommended: ['sedentary', 'standing', 'heavy']
  },

  // --- SKULDER / ARM ---
  {
    id: 'wall_angels',
    name: 'Veggengel',
    category: 'mobility',
    targetMuscles: ['upper_back', 'rotator_cuff', 'chest'],
    equipment: [],
    difficulty: 'beginner',
    defaultSets: 2,
    defaultReps: 10,
    defaultDuration: null,
    instructions: [
      'Stå med ryggen flat mot veggen, knærne lett bøyd',
      'Press korsryggen inn mot veggen',
      'Løft armene med 90 graders vinkel i albuen (som en kaktus)',
      'Press armbakside og håndflater mot veggen',
      'Skyv sakte armene opp over hodet mens du holder kontakten med veggen',
      'Kom rolig tilbake til startposisjon'
    ],
    videoUrl: null,
    imageUrl: null,
    contraindications: [],
    workTypeRecommended: ['sedentary']
  },

  // --- KNE / HOFTE / BEN ---
  {
    id: 'single_leg_squat',
    name: 'Ettbens knebøy',
    category: 'strength',
    targetMuscles: ['quadriceps', 'glutes', 'balance'],
    equipment: [],
    difficulty: 'intermediate',
    defaultSets: 3,
    defaultReps: 8,
    defaultDuration: null,
    instructions: [
      'Stå på ett ben, hold lett i en stol eller vegg for balanse om nødvendig',
      'Bøy sakte kneet og senk deg ned til 90 grader',
      'Hold kneet over foten — ikke kollaps innover',
      'Stram sete og strekk benet tilbake til startposisjon',
      'Gjør alle repetisjoner på ett ben før du bytter'
    ],
    videoUrl: null,
    imageUrl: null,
    contraindications: ['knee_hip_leg'],  // Vær forsiktig — tilby lettere variant
    workTypeRecommended: ['standing', 'heavy']
  },

  {
    id: 'single_leg_balance',
    name: 'Ettbens balanse',
    category: 'balance',
    targetMuscles: ['ankle_stabilizers', 'core', 'glutes'],
    equipment: [],
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: null,
    defaultDuration: 30,
    instructions: [
      'Stå på ett ben med blikket festet på et punkt foran deg',
      'Løft det andre beinet lett fra gulvet',
      'Hold armene lett ut til siden for balanse',
      'Hold stansen i 30 sekunder',
      'Bytt ben og gjenta',
      'Gjør det vanskeligere ved å lukke øynene'
    ],
    videoUrl: null,
    imageUrl: null,
    contraindications: [],
    workTypeRecommended: ['standing', 'heavy']
  },

  // --- KONDISJON ---
  {
    id: 'cardio_walk_in_place',
    name: 'Rask marsjering / gange på stedet',
    category: 'cardio',
    targetMuscles: ['full_body'],
    equipment: [],
    difficulty: 'beginner',
    defaultSets: 1,
    defaultReps: null,
    defaultDuration: 600,  // 10 minutter
    instructions: [
      'Marsjér raskt på stedet eller gå i trapper/ute',
      'Intensitet: du skal bli litt andpusten men fortsatt klare å snakke',
      'Hold god holdning — ikke heng i skuldre',
      'Sving armene naturlig'
    ],
    videoUrl: null,
    imageUrl: null,
    contraindications: [],
    workTypeRecommended: ['sedentary', 'standing', 'heavy']
  },

  // --- KJERNE ---
  {
    id: 'plank',
    name: 'Plank',
    category: 'core',
    targetMuscles: ['core', 'shoulders', 'glutes'],
    equipment: [],
    difficulty: 'intermediate',
    defaultSets: 3,
    defaultReps: null,
    defaultDuration: 30,
    instructions: [
      'Støtt på underarmene og tærne — kroppen i en rett linje',
      'Stram magen, setet og lårene',
      'Ikke la hoften synke ned eller opp',
      'Hold i 30 sekunder, pust rolig',
      'Øk til 45 og 60 sekunder etter hvert'
    ],
    videoUrl: null,
    imageUrl: null,
    contraindications: ['lower_back'],
    workTypeRecommended: ['sedentary', 'standing', 'heavy']
  }
]
```

---

## 4. Program-genereringsfunksjon

```typescript
function generateProgram(profile: UserProfile): TrainingSession[] {

  const { workType, cardioLevel, strengthLevel, painAreas, equipment, sessionDuration, programWeek } = profile

  const workProfile = getWorkProfile(workType, cardioLevel, strengthLevel)
  const painExercises = getIndividualExercises(painAreas, equipment)

  // Juster volum basert på uke i programmet
  const progressionMultiplier = getProgressionMultiplier(programWeek)

  const session: TrainingSession = {
    week: programWeek,
    durationMinutes: sessionDuration,
    sections: [
      {
        type: 'warmup',
        durationMinutes: 5,
        exercises: getWarmupExercises(workType)
      },
      {
        type: 'work_profile',
        durationMinutes: workProfile.cardioMinutes,
        exercises: getWorkProfileExercises(workProfile, equipment, progressionMultiplier)
      },
      {
        type: 'individual',
        durationMinutes: sessionDuration - workProfile.cardioMinutes - 7,
        exercises: painExercises.map(ex => ({
          ...ex,
          reps: ex.defaultReps ? getWeeklyProgression(ex.defaultReps, programWeek) : null,
          sets: getSetsProgression(ex.defaultSets, programWeek)
        }))
      },
      {
        type: 'cooldown',
        durationMinutes: 2,
        exercises: getCooldownExercises()
      }
    ]
  }

  return [session]
}
```

---

## 5. Databaseskjema (React Native / Supabase / SQLite)

```sql
-- Brukers profil
CREATE TABLE user_profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  work_type TEXT NOT NULL,           -- 'sedentary' | 'standing' | 'heavy'
  age_group TEXT NOT NULL,
  cardio_level TEXT NOT NULL,
  strength_level TEXT NOT NULL,
  pain_areas TEXT[] DEFAULT '{}',
  pain_frequency TEXT,
  equipment TEXT[] DEFAULT '{}',
  session_duration INT DEFAULT 25,
  program_week INT DEFAULT 1,
  program_start_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Øvelsesbiblioteket (seed-data)
CREATE TABLE exercises (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  target_muscles TEXT[],
  equipment TEXT[],
  difficulty TEXT NOT NULL,
  default_sets INT,
  default_reps INT,
  default_duration INT,             -- sekunder
  instructions TEXT[],
  video_url TEXT,
  image_url TEXT,
  contraindications TEXT[],
  work_type_recommended TEXT[]
);

-- Genererte treningsprogrammer
CREATE TABLE training_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  profile_id UUID REFERENCES user_profile(id),
  week_number INT NOT NULL,
  session_date DATE,
  duration_minutes INT,
  session_data JSONB NOT NULL,      -- Komplett øktdata
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Logg når bruker fullfører en økt
CREATE TABLE workout_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  session_id UUID REFERENCES training_sessions(id),
  completed_at TIMESTAMPTZ DEFAULT now(),
  duration_actual_minutes INT,
  notes TEXT,
  felt_score INT CHECK (felt_score BETWEEN 1 AND 5)  -- Hvordan kjentes det?
);
```

---

## 6. React Native — skjermstruktur

```
TrainingStack
├── TrainingHomeScreen           -- Ukesoversikt + neste økt
├── OnboardingStack
│   ├── WorkTypeScreen           -- Spørsmål 1: arbeidssituasjon
│   ├── FitnessLevelScreen       -- Spørsmål 2–4: alder, kondisjon, styrke
│   ├── PainAreasScreen          -- Spørsmål 5–6: plager og varighet
│   ├── EquipmentScreen          -- Spørsmål 7: utstyr
│   └── SessionDurationScreen    -- Spørsmål 8: tid per økt
├── ActiveWorkoutScreen          -- Gjennomføring av økt step-by-step
│   ├── ExerciseCard             -- Viser én øvelse av gangen
│   ├── TimerComponent           -- For tidsbaserte øvelser
│   └── SetCounterComponent      -- For rep-baserte øvelser
├── WorkoutCompleteScreen        -- Fullføring + felt_score
└── ProgramOverviewScreen        -- 16-ukers oversikt + fremgang
```

---

## 7. Nøkkelregler for implementasjon

1. **Aldri kopier innhold fra helsenorge.no** — alle øvelsesbeskrivelser skrives selv
2. **Progressivt overload** — øk sets/reps gradvis over 16 uker (se getWeeklyProgression)
3. **Intensitet** — styrkeøvelser skal være til nesten-utmatting på siste rep (ikke 12 av 20 mulige)
4. **Fleksibilitet** — brukeren kan alltid dele opp (10 min × 5 vs 50 min × 1)
5. **Kontraindikasjoner** — vis alltid mildere alternativ, aldri blokker øvelse helt
6. **Utstyrsfritt er default** — programmet skal fungere kun med kroppen som vekt
7. **16 uker** — programmet endres automatisk ukentlig, men brukeren kan justere
8. **GDPR** — helsedata (plager, alder, vekt) behandles som sensitiv kategori, krypteres i ro

---

## 8. Kildehenvisning (for intern bruk)

Metodikken er basert på:

- Dalager T, Hansen AF, Holtermann A, Sjøgaard G, Søgaard K. (2019).
  *Intelligent motion: Smart Mosjon i Arbejdslivet i Norge.*
  Syddansk Universitet, Danmark.
  Tilgjengelig: https://findresearcher.sdu.dk/ws/portalfiles/portal/178418893/IntelligentMotionDK_Smart_MosjonNO.pdf

- Helsedirektoratets råd om fysisk aktivitet for voksne og eldre (2022).
  https://www.helsedirektoratet.no/faglige-rad/fysisk-aktivitet-i-forebygging-og-behandling/voksne-og-eldre

- Nasjonale anbefalinger: 150–300 min moderat aktivitet per uke for voksne.

> Boost Move er ikke tilknyttet Helsedirektoratet eller helsenorge.no.
> Vi anvender offentlig tilgjengelig forskning, akkurat som en fysioterapeut ville gjort.
