import { exerciseBank, type Exercise, type Equipment, type PainArea, type WorkType } from '@/data/exerciseBank'

export interface TrainerProfile {
  workType: WorkType
  cardioLevel: string
  strengthLevel: string
  equipment: Equipment[]
  sessionDuration: number
  programWeek: number
  painAreas: PainArea[]
}

export interface WorkProfile {
  focus: string
  cardioMinutes: number
  strengthFocus: string[]
  note: string
}

export interface SessionExercise {
  id: string
  name: string
  category: string
  sets: number
  reps: number | null
  duration: number | null
  instructions: string[]
}

export interface SessionSection {
  type: 'warmup' | 'work_profile' | 'individual' | 'cooldown'
  label: string
  exercises: SessionExercise[]
}

export interface TrainingSession {
  week: number
  durationMinutes: number
  sections: SessionSection[]
  totalExercises: number
}

// ═══════════════════════════════════════════════════════════════════════════
// Arbeidsprofil-logikk
// ═══════════════════════════════════════════════════════════════════════════

export function getWorkProfile(workType: string, cardioLevel: string, _strengthLevel: string): WorkProfile {
  if (workType === 'sedentary') {
    return {
      focus: 'cardio_and_upper_strength',
      cardioMinutes: cardioLevel === 'low' ? 15 : 10,
      strengthFocus: ['upper_back', 'core', 'glutes'],
      note: 'Bryt stillesittingen — bevegelse er medisin',
    }
  }

  if (workType === 'standing') {
    return {
      focus: 'lower_body_and_core',
      cardioMinutes: 5,
      strengthFocus: ['legs', 'core', 'lower_back'],
      note: 'Styrk musklene som bærer deg gjennom arbeidsdagen',
    }
  }

  // heavy
  return {
    focus: 'full_body_recovery_and_stability',
    cardioMinutes: 10,
    strengthFocus: ['core', 'legs', 'upper_back', 'shoulders'],
    note: 'Bygg kapasitet og forebygg slitasje',
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// Individuell tilpasning basert på plager
// ═══════════════════════════════════════════════════════════════════════════

export function getIndividualExercises(painAreas: PainArea[], equipment: Equipment[]): Exercise[] {
  const results: Exercise[] = []

  if (painAreas.includes('neck_upper_back')) {
    addIfExists(results, 'shoulder_raise')
    addIfExists(results, 'neck_rotation')
    addIfExists(results, 'band_row_seated')
  }

  if (painAreas.includes('lower_back')) {
    addIfExists(results, 'bird_dog')
    addIfExists(results, 'glute_bridge')
    addIfExists(results, 'dead_bug')
  }

  if (painAreas.includes('shoulder_arm')) {
    addIfExists(results, 'band_side_raise')
    addIfExists(results, 'forward_lean_raise')
    addIfExists(results, 'wall_angels')
  }

  if (painAreas.includes('knee_hip_leg')) {
    addIfExists(results, 'single_leg_balance')
    addIfExists(results, 'calf_raise')
    // single_leg_squat has contraindication for knee — offer lighter alt
    addIfExists(results, 'bodyweight_squat')
  }

  // Filtrer bort øvelser som krever utstyr brukeren ikke har
  const hasEquipment = (eq: Equipment) => equipment.includes(eq)
  return results.filter(ex =>
    ex.equipment.length === 0 || ex.equipment.some(hasEquipment)
  )
}

function addIfExists(arr: Exercise[], id: string) {
  const ex = exerciseBank.find(e => e.id === id)
  if (ex) arr.push(ex)
}

// ═══════════════════════════════════════════════════════════════════════════
// 16-ukers progressjon
// ═══════════════════════════════════════════════════════════════════════════

export function getWeeklyProgression(baseReps: number, week: number): number {
  if (week <= 4)  return baseReps
  if (week <= 8)  return Math.round(baseReps * 1.1)
  if (week <= 12) return Math.round(baseReps * 1.2)
  return Math.round(baseReps * 1.15)
}

export function getSetsProgression(baseSets: number, week: number): number {
  if (week <= 4)  return baseSets
  return baseSets + 1
}

// ═══════════════════════════════════════════════════════════════════════════
// Hjelpefunksjoner
// ═══════════════════════════════════════════════════════════════════════════

function getWarmupExercises(): Exercise[] {
  return exerciseBank.filter(e => e.category === 'warmup')
}

function getCooldownExercises(): Exercise[] {
  return exerciseBank.filter(e => e.category === 'cooldown').slice(0, 3)
}

function getWorkProfileExercises(workProfile: WorkProfile, equipment: Equipment[], workType: WorkType): Exercise[] {
  const candidates = exerciseBank.filter(e => {
    if (e.category === 'warmup' || e.category === 'cooldown') return false
    if (!e.workTypeRecommended.includes(workType)) return false
    // Sjekk utstyr
    if (e.equipment.length > 0 && !e.equipment.some(eq => equipment.includes(eq))) return false
    // Sjekk målmuskler mot arbeidsprofil-fokus
    const targetMatch = e.targetMuscles.some(m =>
      workProfile.strengthFocus.some(f => m.includes(f) || f.includes(m))
    )
    return targetMatch || e.category === 'cardio'
  })

  // Velg ut en blanding av kondisjon og styrke
  const cardio = candidates.filter(e => e.category === 'cardio').slice(0, 1)
  const strength = candidates.filter(e => e.category !== 'cardio').slice(0, 3)
  return [...cardio, ...strength]
}

function toSessionExercise(ex: Exercise, week: number): SessionExercise {
  return {
    id: ex.id,
    name: ex.name,
    category: ex.category,
    sets: ex.defaultSets ? getSetsProgression(ex.defaultSets, week) : 1,
    reps: ex.defaultReps ? getWeeklyProgression(ex.defaultReps, week) : null,
    duration: ex.defaultDuration ?? null,
    instructions: ex.instructions,
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// Hovedfunksjon: generer en økt
// ═══════════════════════════════════════════════════════════════════════════

export function generateSession(profile: TrainerProfile): TrainingSession {
  const { workType, cardioLevel, strengthLevel, painAreas, equipment, sessionDuration, programWeek } = profile

  const workProfile = getWorkProfile(workType, cardioLevel, strengthLevel)
  const painExercises = getIndividualExercises(painAreas, equipment)
  const warmup = getWarmupExercises()
  const cooldown = getCooldownExercises()
  const workExercises = getWorkProfileExercises(workProfile, equipment, workType)

  // For kort økt (10 min): begrens antall øvelser
  let finalWarmup = warmup
  let finalWork = workExercises
  let finalPain = painExercises
  let finalCooldown = cooldown

  if (sessionDuration <= 10) {
    finalWarmup = warmup.slice(0, 1)
    finalWork = workExercises.slice(0, 2)
    finalPain = painExercises.slice(0, 1)
    finalCooldown = cooldown.slice(0, 1)
  } else if (sessionDuration <= 25) {
    finalWarmup = warmup.slice(0, 2)
    finalWork = workExercises.slice(0, 3)
    finalPain = painExercises.slice(0, 2)
    finalCooldown = cooldown.slice(0, 2)
  }

  const sections: SessionSection[] = [
    {
      type: 'warmup',
      label: 'Oppvarming',
      exercises: finalWarmup.map(e => toSessionExercise(e, programWeek)),
    },
    {
      type: 'work_profile',
      label: 'Arbeidsprofil',
      exercises: finalWork.map(e => toSessionExercise(e, programWeek)),
    },
  ]

  // Individuell seksjon — bare hvis bruker har plager
  if (finalPain.length > 0) {
    sections.push({
      type: 'individual',
      label: 'Individuell',
      exercises: finalPain.map(e => toSessionExercise(e, programWeek)),
    })
  }

  sections.push({
    type: 'cooldown',
    label: 'Avkjøling',
    exercises: finalCooldown.map(e => toSessionExercise(e, programWeek)),
  })

  const totalExercises = sections.reduce((sum, s) => sum + s.exercises.length, 0)

  return {
    week: programWeek,
    durationMinutes: sessionDuration,
    sections,
    totalExercises,
  }
}
