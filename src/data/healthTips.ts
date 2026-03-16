// src/data/healthTips.ts
//
// Appen er for mennesker som ikke er mye i bevegelse og vil starte å tenke
// litt på egen helse. Kodeord: lavterskel · redusere sykefravær · gode vaner.
//
// Alle tips er tilgjengelige for alle – ingen krav til form eller trening.
// Band brukes kun for å tilpasse tonen, ikke for å kreve mer av brukeren.

export type TipBand = 'low' | 'mid' | 'high'

export interface HealthTip {
  text: string
  bands: TipBand[]
}

export const healthTips: HealthTip[] = [

  // ── LOW – rolig tilbakestilling, mentalt og fysisk ────────────────────────
  // For tomme eller tunge dager. Null prestasjonskrav.

  { text: 'Hent et glass vann og drikk det rolig – ett slurk av gangen', bands: ['low'] },
  { text: 'Tenk på 3 ting du er takknemlig for akkurat nå', bands: ['low'] },
  { text: 'Pust inn i 4 sek, hold i 4, pust ut i 6 – gjenta 3 ganger', bands: ['low'] },
  { text: 'Rull skuldrene bakover 5 ganger – sakte og bevisst', bands: ['low'] },
  { text: 'Slapp bevisst av i kjeven og ansiktet – kjenn spenningen slippe', bands: ['low'] },
  { text: 'Lukk øynene i 30 sekunder og bare pust', bands: ['low'] },
  { text: 'La skuldrene synke ned fra ørene og hold der', bands: ['low'] },
  { text: 'Se ut av vinduet i ett minutt – ikke tenk på jobben', bands: ['low'] },
  { text: 'Strekk nakken forsiktig til siden – hold 20 sek, bytt side', bands: ['low'] },
  { text: 'Ta 3 lange, rolige pust gjennom nesen', bands: ['low'] },
  { text: 'Massér tinningene rolig med to fingre i 30 sekunder', bands: ['low'] },
  { text: 'Sett begge føttene flatt på gulvet og kjenn underlaget', bands: ['low'] },
  { text: 'Tenk på én person du setter pris på – send dem en varm tanke', bands: ['low'] },
  { text: 'Rist hendene og underarmene løst i 15 sekunder', bands: ['low'] },
  { text: 'Gjør ett langt, bevisst utpust – slipp alt med den pusten', bands: ['low'] },
  { text: 'Len hodet forsiktig fremover og kjenn strekket i nakken', bands: ['low'] },
  { text: 'Strekk fingrene vidt ut og slipp – gjenta 5 ganger', bands: ['low'] },
  { text: 'Sitt rett i stolen, pust dypt inn og kjenn ryggen', bands: ['low'] },
  { text: 'Lukk øynene og se for deg ett sted du trives', bands: ['low'] },
  { text: 'Rull anklene forsiktig i sirkler – 8 ganger hver side', bands: ['low'] },
  { text: 'Vipp hodet til siden og pust ut sakte mens du slipper', bands: ['low'] },
  { text: 'Ta en bevisst pause fra skjermen i 30 sekunder', bands: ['low'] },
  { text: 'Løft og senk skuldrene sakte 5 ganger', bands: ['low'] },
  { text: 'Massér håndleddene forsiktig i 20 sekunder', bands: ['low'] },
  { text: 'Tenk på noe som gikk bra i dag – hold fast ved det et øyeblikk', bands: ['low'] },
  { text: 'Slipp kroppen tungt ned i stolen og pust ut', bands: ['low'] },
  { text: 'Gjør 3 sakte nikk med hodet fremover og bakover', bands: ['low'] },
  { text: 'Slapp av i fingrene og håndflaten – la dem ligge åpne', bands: ['low'] },
  { text: 'Pust inn dypt og se for deg at du puster ut stress og spenning', bands: ['low'] },
  { text: 'Plasser en hånd på magen og kjenn at magen beveger seg rolig', bands: ['low'] },
  { text: 'Slapp av i skuldrene og la armene henge tungt ned', bands: ['low'] },
  { text: 'Ta ett minutt uten å gjøre noe – bare vær til stede', bands: ['low'] },

  // ── MID – lett aktivisering, gode vaner i hverdagen ──────────────────────
  // Fremdeles lavterskel – det handler om å bygge vanen, ikke om intensitet.

  { text: 'Reis deg og hent et glass vann – stå mens du drikker', bands: ['mid'] },
  { text: 'Gå en rolig runde til et annet rom og tilbake', bands: ['mid'] },
  { text: 'Gjør 5 rolige knebøy ved siden av stolen', bands: ['mid'] },
  { text: 'Strekk armene over hodet og ta ett dypt pust inn', bands: ['mid'] },
  { text: 'Stå opp i 2 minutter – bare stå og hvil bena', bands: ['mid'] },
  { text: 'Gjør 5 rolige tåhev stående – kjenn strekket i leggen', bands: ['mid'] },
  { text: 'Gå til nærmeste vindu, se ut og ta 3 dype pust', bands: ['mid'] },
  { text: 'Rull skuldrene fremover og bakover 10 ganger', bands: ['mid'] },
  { text: 'Strekk siden: arm opp og len lett til siden – bytt', bands: ['mid'] },
  { text: 'Strekk nakken forsiktig i alle retninger – rolig tempo', bands: ['mid'] },
  { text: 'Stå rett opp og kjenn fotavtrykkene mot gulvet i 30 sek', bands: ['mid'] },
  { text: 'Gjør 3 rolige sitteknebøy – bare reis deg og sett deg igjen', bands: ['mid'] },
  { text: 'Strekk armene rett frem og hold 10 sekunder', bands: ['mid'] },
  { text: 'Plasser hender i korsryggen og len deg forsiktig bakover', bands: ['mid'] },
  { text: 'Gjør 5 rolige magepress – trekk inn og slipp sakte', bands: ['mid'] },
  { text: 'Ta 5 dype pust og fokuser kun på den lange utpusten', bands: ['mid'] },
  { text: 'Dra skuldrene bakover og åpne brystet – hold 10 sek', bands: ['mid'] },
  { text: 'Tenk på 3 ting du er takknemlig for i dag', bands: ['mid'] },
  { text: 'Stå opp og strekk ett ben rolig ut – hold 10 sek, bytt', bands: ['mid'] },
  { text: 'Gjør rolige sirkler med skuldrene – 8 ganger fremover, 8 bakover', bands: ['mid'] },
  { text: 'Ta 2 minutter og skriv ned én god ting som skjedde i dag', bands: ['mid'] },
  { text: 'Gjør 5 tåhev og nyt strekket i leggen etterpå', bands: ['mid'] },
  { text: 'Strekk ett ben bak og hold tå-strekk i 10 sekunder – bytt', bands: ['mid'] },
  { text: 'Gå til toalettet via den lengste veien i dag', bands: ['mid'] },
  { text: 'Reis deg ved neste telefonsamtale – ta den stående', bands: ['mid'] },
  { text: 'Rist armer og skuldre løst i 15 sekunder', bands: ['mid'] },
  { text: 'Stå opp og bøy overkroppen forsiktig fremover – la armene henge', bands: ['mid'] },
  { text: 'Tenk: hva er én liten ting jeg kan gjøre for kroppen min i dag?', bands: ['mid'] },
  { text: 'Gjør 3 minutter uten skjerm – se på et fast punkt i rommet', bands: ['mid'] },
  { text: 'Gjør 5 rolige armeløft til siden og hold 5 sek', bands: ['mid'] },
  { text: 'Rull hodet forsiktig til siden og hold 15 sek – bytt', bands: ['mid'] },
  { text: 'Gå trappa i stedet for heisen – bare én etasje', bands: ['mid'] },
  { text: 'Hent vann til deg og en kollega – en liten omtanke', bands: ['mid'] },
  { text: 'Gjør 2 minutter stille gange på stedet – rolig og bevisst', bands: ['mid'] },
  { text: 'Strekk korsryggen: sett deg fremst på stolen og len deg lett framover', bands: ['mid'] },
  { text: 'Send en kort, hyggelig melding til noen du ikke har snakket med på en stund', bands: ['mid'] },
  { text: 'Ta bevisst pause – sett deg tilbake og pust rolig i 2 minutter', bands: ['mid'] },
  { text: 'Gjør 5 rolige knebøy og tenk at du investerer i kroppen din', bands: ['mid'] },

  // ── HIGH – litt mer aktiv, men fremdeles helt tilgjengelig for alle ────────
  // Ikke krevende. En kort gåtur, enkel bevegelse, en god vane.

  { text: 'Ta en 5-minutters gåtur ute – frisk luft er alltid verdt det', bands: ['high'] },
  { text: 'Gjør 10 rolige tåhev og kjenn kroppen jobbe', bands: ['high'] },
  { text: 'Gå opp én etasje i trappa – ett steg av gangen', bands: ['high'] },
  { text: 'Gjør 5 enkle armhevinger mot veggen', bands: ['high'] },
  { text: 'Ta en rask runde rundt bygningen – 2–3 minutter', bands: ['high'] },
  { text: 'Strekk hele kroppen fra topp til tå og nyt det', bands: ['high'] },
  { text: 'Gjør 8 rolige knebøy – tenk på god form, ikke fart', bands: ['high'] },
  { text: 'Ta 5 minutter og gå ute – bare gå uten mål', bands: ['high'] },
  { text: 'Gjør 5 rolige sidestrekk på hver side', bands: ['high'] },
  { text: 'Gå opp og ned trappa to ganger i rolig tempo', bands: ['high'] },
  { text: 'Drikk ett stort glass kaldt vann – nyt det sakte', bands: ['high'] },
  { text: 'Gjør 5 push-ups mot veggen – det teller', bands: ['high'] },
  { text: 'Ta 5 minutter med rolig bevegelse – det du har lyst til', bands: ['high'] },
  { text: 'Planlegg en liten gåtur i lunsjpausen – gjerne med en kollega', bands: ['high'] },
  { text: 'Gjør 3 minutter lett strekk av nakke, skuldre og hofter', bands: ['high'] },
  { text: 'Ta 10 rolige armsirkler fremover og 10 bakover', bands: ['high'] },
  { text: 'Ta en 3-minutters spasertur i korridoren eller utenfor', bands: ['high'] },
  { text: 'Gjør 5 rolige utfall fremover – ett bein av gangen', bands: ['high'] },
  { text: 'Bestem deg for én liten sunn vane å starte med i dag', bands: ['high'] },
  { text: 'Gjør 8 rolige armhevinger mot veggen med fokus på pusten', bands: ['high'] },
  { text: 'Nyt 5 minutter frisk luft – åpne vinduet eller gå ut', bands: ['high'] },
  { text: 'Gjør 10 tåhev + 5 rolige knebøy – ta god tid', bands: ['high'] },
  { text: 'Skriv ned én sunn vane du vil jobbe med denne uken', bands: ['high'] },
  { text: 'Gjør 2 runder med 5 rolige knebøy – tenk: dette er starten', bands: ['high'] },
  { text: 'Hent vann til deg selv og en kollega – bevegelse + omtanke', bands: ['high'] },
  { text: 'Ta trappa ned også – begge veier er god vane', bands: ['high'] },
  { text: 'Gjør 5 minutter lett strekk og mobilitet – akkurat slik kroppen vil', bands: ['high'] },
  { text: 'Gå en rolig tur og tenk på noe du er glad for', bands: ['high'] },
  { text: 'Sett deg ett lite mål for bevegelse i morgen – gjerne lavere enn du tror', bands: ['high'] },
  { text: 'Ta 5 dype pust ute i frisk luft og kjenn at du lader litt opp', bands: ['high'] },

]

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Pick a random tip for the given band, optionally skipping one text */
export function pickTip(opts: {
  band: TipBand
  excludeText?: string
}): HealthTip {
  const pool = healthTips.filter(t => t.bands.includes(opts.band))
  const available = opts.excludeText
    ? pool.filter(t => t.text !== opts.excludeText)
    : pool
  const src = available.length > 0 ? available : pool
  return src[Math.floor(Math.random() * src.length)]
}

/** Derive band from Min helse answers */
export function bandFromMinHelse(
  body: string,
  energy: string,
): TipBand {
  if (body === 'tung' || energy === 'tom') return 'low'
  if (body === 'lett' && energy === 'på') return 'high'
  return 'mid'
}

/** Derive band from Boost Moment energy score (1–10) */
export function bandFromEnergyScore(score: number): TipBand {
  if (score <= 3) return 'low'
  if (score <= 7) return 'mid'
  return 'high'
}
