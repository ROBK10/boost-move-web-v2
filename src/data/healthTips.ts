// src/data/healthTips.ts
//
// Tips organisert etter 5 helsepilarer. Etter innsjekk vises et tips
// fra pilaren med lavest score — slik at tipset alltid er relevant.

export type TipPillar = 'bevegelse' | 'stillesitting' | 'sovn' | 'kosthold' | 'mental'
export type BoostType = 'ga' | 'pust' | 'strekk'
export type TimeOfDay = 'morgen' | 'dag' | 'kveld' | 'alltid'

export interface HealthTip {
  text: string
  pillar: TipPillar
  type: BoostType
  time: TimeOfDay
}

/** Returner tidspunkt basert på klokkeslett */
export function currentTimeOfDay(): TimeOfDay {
  const h = new Date().getHours()
  if (h < 10) return 'morgen'
  if (h < 17) return 'dag'
  return 'kveld'
}

export const healthTips: HealthTip[] = [

  // ── BEVEGELSE ─────────────────────────────────────────────────────────────
  { text: 'Ta en 5-minutters gåtur ute – frisk luft er alltid verdt det', pillar: 'bevegelse', type: 'ga', time: 'alltid' },
  { text: 'Gå trappa i stedet for heisen – bare én etasje teller', pillar: 'bevegelse', type: 'ga', time: 'dag' },
  { text: 'Ta en rask runde rundt bygningen – 2–3 minutter', pillar: 'bevegelse', type: 'ga', time: 'dag' },
  { text: 'Gjør 5 rolige knebøy ved siden av stolen', pillar: 'bevegelse', type: 'strekk', time: 'dag' },
  { text: 'Planlegg en gåtur i lunsjpausen – gjerne med en kollega', pillar: 'bevegelse', type: 'ga', time: 'morgen' },
  { text: 'Gjør 8 rolige knebøy – fokus på god form, ikke fart', pillar: 'bevegelse', type: 'strekk', time: 'alltid' },
  { text: 'Ta 5 minutter og gå ute – bare gå uten mål', pillar: 'bevegelse', type: 'ga', time: 'alltid' },
  { text: 'Gå til toalettet via den lengste veien i dag', pillar: 'bevegelse', type: 'ga', time: 'dag' },
  { text: 'Gjør 2 minutter stille gange på stedet – rolig og bevisst', pillar: 'bevegelse', type: 'ga', time: 'alltid' },
  { text: 'Gå opp og ned trappa to ganger i rolig tempo', pillar: 'bevegelse', type: 'ga', time: 'dag' },
  { text: 'Ta en kveldsgåtur – 10 minutter gjør underverker', pillar: 'bevegelse', type: 'ga', time: 'kveld' },
  { text: 'Start dagen med 5 minutter lett strekk – vekk kroppen forsiktig', pillar: 'bevegelse', type: 'strekk', time: 'morgen' },

  // ── STILLESITTING ─────────────────────────────────────────────────────────
  { text: 'Reis deg og stå i 2 minutter – bare det gjør en forskjell', pillar: 'stillesitting', type: 'strekk', time: 'dag' },
  { text: 'Bytt stilling – flytt deg fremover eller bakover i stolen', pillar: 'stillesitting', type: 'strekk', time: 'dag' },
  { text: 'Reis deg ved neste telefonsamtale – ta den stående', pillar: 'stillesitting', type: 'strekk', time: 'dag' },
  { text: 'Sett en påminnelse om å reise deg hvert 30. minutt', pillar: 'stillesitting', type: 'strekk', time: 'morgen' },
  { text: 'Stå opp og hent et glass vann – stå mens du drikker', pillar: 'stillesitting', type: 'ga', time: 'alltid' },
  { text: 'Strekk armene over hodet og ta ett dypt pust', pillar: 'stillesitting', type: 'strekk', time: 'alltid' },
  { text: 'Rull skuldrene fremover og bakover 10 ganger', pillar: 'stillesitting', type: 'strekk', time: 'alltid' },
  { text: 'Plasser hender i korsryggen og len deg forsiktig bakover', pillar: 'stillesitting', type: 'strekk', time: 'dag' },
  { text: 'Gjør 5 rolige tåhev stående – kjenn strekket i leggen', pillar: 'stillesitting', type: 'strekk', time: 'alltid' },
  { text: 'Stå opp og bøy overkroppen forsiktig fremover – la armene henge', pillar: 'stillesitting', type: 'strekk', time: 'alltid' },

  // ── SØVN ──────────────────────────────────────────────────────────────────
  { text: 'Legg bort telefonen 30 min før sengetid i kveld', pillar: 'sovn', type: 'pust', time: 'kveld' },
  { text: 'Prøv å legge deg til fast tid i kveld – rutine hjelper søvnen', pillar: 'sovn', type: 'pust', time: 'kveld' },
  { text: 'Senk temperaturen i soverommet – 18°C er ideelt', pillar: 'sovn', type: 'pust', time: 'kveld' },
  { text: 'Unngå koffein etter kl. 14 – det påvirker søvnen mer enn du tror', pillar: 'sovn', type: 'pust', time: 'dag' },
  { text: 'Ta 5 minutter avslapning nå – pust rolig og lukk øynene', pillar: 'sovn', type: 'pust', time: 'alltid' },
  { text: 'Skriv ned det som stresser deg før du legger deg – tøm hodet', pillar: 'sovn', type: 'pust', time: 'kveld' },
  { text: 'Prøv 4-7-8-pusting: pust inn 4 sek, hold 7, ut 8 – roer nervesystemet', pillar: 'sovn', type: 'pust', time: 'kveld' },
  { text: 'Bruk mørke gardiner – mørke hjelper kroppen å produsere melatonin', pillar: 'sovn', type: 'pust', time: 'kveld' },
  { text: 'Gå en rolig tur på kvelden – det hjelper kroppen å roe seg ned', pillar: 'sovn', type: 'ga', time: 'kveld' },
  { text: 'Kutt skjermtid i sengen – bruk sengen kun til søvn', pillar: 'sovn', type: 'pust', time: 'kveld' },

  // ── KOSTHOLD ──────────────────────────────────────────────────────────────
  { text: 'Spis en frukt nå – ett stykke teller som én av fem porsjoner', pillar: 'kosthold', type: 'ga', time: 'alltid' },
  { text: 'Drikk et stort glass vann – de fleste drikker for lite', pillar: 'kosthold', type: 'ga', time: 'alltid' },
  { text: 'Legg til grønnsaker i neste måltid – selv litt teller', pillar: 'kosthold', type: 'ga', time: 'dag' },
  { text: 'Bytt ut snacksen med en håndfull nøtter eller frukt', pillar: 'kosthold', type: 'ga', time: 'dag' },
  { text: 'Planlegg morgendagens lunsj i kveld – det gjør sunne valg lettere', pillar: 'kosthold', type: 'pust', time: 'kveld' },
  { text: 'Prøv å spise et fargerikt måltid – flere farger = flere næringsstoffer', pillar: 'kosthold', type: 'ga', time: 'dag' },
  { text: 'Velg vann fremfor brus eller juice – kroppen foretrekker det', pillar: 'kosthold', type: 'ga', time: 'alltid' },
  { text: 'Ta deg tid til å tygge maten ordentlig – det hjelper fordøyelsen', pillar: 'kosthold', type: 'pust', time: 'dag' },
  { text: 'Ha alltid en flaske vann tilgjengelig på pulten', pillar: 'kosthold', type: 'ga', time: 'morgen' },
  { text: 'Spis frokost – det setter standarden for resten av dagen', pillar: 'kosthold', type: 'ga', time: 'morgen' },

  // ── MENTAL HELSE ──────────────────────────────────────────────────────────
  { text: 'Ta 3 lange, rolige pust gjennom nesen – kjenn roen bre seg', pillar: 'mental', type: 'pust', time: 'alltid' },
  { text: 'Tenk på 3 ting du er takknemlig for akkurat nå', pillar: 'mental', type: 'pust', time: 'alltid' },
  { text: 'Ta en bevisst pause fra skjermen i 2 minutter', pillar: 'mental', type: 'pust', time: 'dag' },
  { text: 'Si nei til én ting i dag som ikke er nødvendig – grensesetting er helse', pillar: 'mental', type: 'pust', time: 'morgen' },
  { text: 'Gå en rolig tur uten telefon – la tankene vandre fritt', pillar: 'mental', type: 'ga', time: 'kveld' },
  { text: 'Skriv ned én ting som gikk bra i dag – hold fast ved den', pillar: 'mental', type: 'pust', time: 'kveld' },
  { text: 'Send en hyggelig melding til noen – sosial kontakt er medisin', pillar: 'mental', type: 'pust', time: 'alltid' },
  { text: 'Lukk øynene i 30 sekunder og bare pust – gi hjernen en mikropause', pillar: 'mental', type: 'pust', time: 'alltid' },
  { text: 'Avslutt arbeidsdagen med en kort oppsummering – det reduserer kveldsbekymringer', pillar: 'mental', type: 'pust', time: 'kveld' },
  { text: 'Snakk med en kollega om noe som ikke er jobb – sosial helse teller', pillar: 'mental', type: 'pust', time: 'dag' },
  { text: 'Sett en intensjon for dagen – hva er viktigst i dag?', pillar: 'mental', type: 'pust', time: 'morgen' },
]

// ── HUMØR-TIPS (for lavterskel-brukere) ─────────────────────────────────────

export type Mood = 'tung' | 'ok' | 'bra'

export const moodTips: Record<Mood, string[]> = {
  tung: [
    'Det er ok å ha en tung dag. Et glass vann og 3 rolige pust er nok.',
    'Du var her i dag — det krever mot på en tung dag.',
    'Bare det å puste bevisst i 30 sekunder kan hjelpe litt.',
    'Legg hendene på magen og kjenn at du puster. Det er nok.',
    'Du trenger ikke prestere. Bare vær her.',
    'En tung dag er ikke en dårlig dag. Den er bare tung.',
  ],
  ok: [
    'Bra at du sjekket inn. Prøv å reise deg i 30 sekunder.',
    'En ok dag er en god dag. Små valg gjør stor forskjell over tid.',
    'Hent et glass vann — kroppen din setter pris på det.',
    'Strekk nakken forsiktig til hver side. Kjenn at du tar vare på deg.',
    'Du bygger en vane — det er viktigere enn noe enkelttiltak.',
  ],
  bra: [
    'Flott! Ta en 2-minutters gåtur — du har energien.',
    'Bra dag — kanskje en kort gåtur ute?',
    'Nyt energien — gjør noe aktivt som du har lyst til.',
    'En bra dag er en dag for å investere litt ekstra i deg selv.',
    'Kan du ta trappa i stedet for heisen i dag?',
  ],
}

export function pickMoodTip(mood: Mood): string {
  const pool = moodTips[mood]
  return pool[Math.floor(Math.random() * pool.length)]
}

// ── STREAK-MELDINGER ───────────────────────────────────────────────────────

export const streakMessages: Record<number, string> = {
  1: 'Du tok det første steget. Alt starter her.',
  2: '2 dager — du er i gang.',
  3: '3 dager på rad — en vane begynner å ta form.',
  5: '5 dager! Kroppen din legger merke til det.',
  7: 'En hel uke. Det er stort.',
  10: '10 dager — du har bevist at du kan.',
  14: 'To uker. For alvor.',
  21: '3 uker — dette er en del av hvem du er nå.',
  30: 'En måned. Du har endret en vane.',
}

export function getStreakMessage(streak: number): string {
  // Finn høyeste terskel som er <= streak
  const thresholds = Object.keys(streakMessages).map(Number).sort((a, b) => b - a)
  for (const t of thresholds) {
    if (streak >= t) return streakMessages[t]
  }
  return 'Du var her i dag. Det teller.'
}

// ── Helpers ───────────────────────────────────────────────────────────────────

// ── Persona-vekting ──────────────────────────────────────────────────────────

type PersonaContext = {
  healthChallenge?: string | null  // rygg/nakke/hodepine/ingen
  biggestStruggle?: string | null  // stress/sovn/motivasjon/smerter/ingen
}

const PERSONA_TYPE_MAP: Record<string, TipType[]> = {
  rygg: ['strekk'],
  nakke: ['strekk'],
  hodepine: ['pust', 'strekk'],
  stress: ['pust'],
  sovn: ['pust'],
  motivasjon: ['ga'],
  smerter: ['strekk'],
}

/** Weighted pick — prefer tips matching persona, but allow any */
function weightedPick(pool: HealthTip[], persona?: PersonaContext): HealthTip {
  if (!persona) return pool[Math.floor(Math.random() * pool.length)]

  const preferredTypes: TipType[] = [
    ...(PERSONA_TYPE_MAP[persona.healthChallenge ?? ''] ?? []),
    ...(PERSONA_TYPE_MAP[persona.biggestStruggle ?? ''] ?? []),
  ]

  if (preferredTypes.length === 0) return pool[Math.floor(Math.random() * pool.length)]

  // 70% chance to pick preferred type, 30% random
  const preferred = pool.filter(t => preferredTypes.includes(t.type))
  if (preferred.length > 0 && Math.random() < 0.7) {
    return preferred[Math.floor(Math.random() * preferred.length)]
  }
  return pool[Math.floor(Math.random() * pool.length)]
}

/** Pick a random tip for a given pillar, with optional persona weighting */
export function pickTipByPillar(opts: {
  pillar: TipPillar
  excludeText?: string
  persona?: PersonaContext
}): HealthTip {
  const pool = healthTips.filter(t => t.pillar === opts.pillar)
  const available = opts.excludeText
    ? pool.filter(t => t.text !== opts.excludeText)
    : pool
  const src = available.length > 0 ? available : pool
  return weightedPick(src, opts.persona)
}

/** Pick a random tip filtered by time of day (for Boost Moment), with persona weighting */
export function pickTip(opts: {
  band?: string
  excludeText?: string
  persona?: PersonaContext
}): HealthTip {
  const now = currentTimeOfDay()
  let pool = healthTips.filter(t => t.time === now || t.time === 'alltid')
  if (opts.excludeText) {
    pool = pool.filter(t => t.text !== opts.excludeText)
  }
  const src = pool.length > 0 ? pool : healthTips
  return weightedPick(src, opts.persona)
}

// ── Tomorrow teaser ─────────────────────────────────────────────────────────

const PILLAR_TEASERS: Record<TipPillar, string[]> = {
  bevegelse: [
    'en 2-minutters gåøvelse',
    'et enkelt bevegelsestips',
    'en lett strekkeøvelse',
  ],
  stillesitting: [
    'en pause-påminnelse',
    'en enkel skrivebordsøvelse',
    'et tips for bedre sittestilling',
  ],
  sovn: [
    'et søvntips som faktisk virker',
    'en enkel kveldsrutine',
    'et tips for bedre søvnkvalitet',
  ],
  kosthold: [
    'en enkel kostholdsvane',
    'et tips for mer grønt i hverdagen',
    'en matidé som gir energi',
  ],
  mental: [
    'en 1-minutts pusteøvelse',
    'et tips for mentalt overskudd',
    'en enkel stressmestringsteknikk',
  ],
}

export function tomorrowTeaser(pillar: TipPillar): string {
  const teasers = PILLAR_TEASERS[pillar]
  const picked = teasers[Math.floor(Math.random() * teasers.length)]
  return `I morgen: ${picked}`
}

/** Pilar-scoring maps — brukes av frontend for å finne svakeste pilar */
export const PILLAR_SCORES: Record<TipPillar, Record<string, number>> = {
  bevegelse:     { ingen: 0, lett: 8, moderat: 15, aktiv: 20 },
  stillesitting: { ingen_pauser: 0, noen: 10, regelmessig: 20 },
  sovn:          { under_5: 0, "5_6": 8, "7_8": 20, over_8: 15 },
  kosthold:      { ingen: 0, "1_2": 8, "3_4": 15, "5_pluss": 20 },
  mental:        { hoyt: 0, middels: 10, lavt: 20 },
}

/** Find the weakest pillar from checkin answers */
export function weakestPillar(answers: {
  movement: string
  body: string
  energy: string
  context: string
  mental: string
}): TipPillar {
  const scores: [TipPillar, number][] = [
    ['bevegelse', PILLAR_SCORES.bevegelse[answers.movement] ?? 10],
    ['stillesitting', PILLAR_SCORES.stillesitting[answers.body] ?? 10],
    ['sovn', PILLAR_SCORES.sovn[answers.energy] ?? 10],
    ['kosthold', PILLAR_SCORES.kosthold[answers.context] ?? 10],
    ['mental', PILLAR_SCORES.mental[answers.mental] ?? 10],
  ]

  scores.sort((a, b) => a[1] - b[1])
  return scores[0][0]
}
