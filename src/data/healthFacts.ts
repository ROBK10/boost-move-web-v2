// Mikro-fakta basert på FHI og Helsedirektoratet
// Vises etter innsjekk, koblet til brukerens svar

export type FactTrigger = {
  field: 'movement' | 'energy' | 'body' | 'context' | 'mental'
  value: string
  fact: string
}

export const healthFacts: FactTrigger[] = [
  // Bevegelse
  { field: 'movement', value: 'ingen', fact: '10 minutter gange om dagen gir opptil 8 flere friske leveår (Helsedirektoratet).' },
  { field: 'movement', value: 'ingen', fact: 'Bare det å reise seg fra stolen hvert 30. minutt gir helseeffekt.' },
  { field: 'movement', value: 'lett', fact: 'Lett aktivitet reduserer risiko for hjertesykdom med opptil 20% (FHI).' },
  { field: 'movement', value: 'lett', fact: 'Selv korte gåturer forbedrer blodsirkulasjon og konsentrasjon.' },
  { field: 'movement', value: 'moderat', fact: 'Moderat aktivitet styrker immunforsvaret og reduserer betennelser.' },
  { field: 'movement', value: 'aktiv', fact: 'Du er blant de 30% av nordmenn som når aktivitetsanbefalingene.' },

  // Søvn
  { field: 'energy', value: 'under_5', fact: 'Under 6 timer søvn øker risiko for overvekt, depresjon og hjertesykdom (FHI).' },
  { field: 'energy', value: 'under_5', fact: 'Søvnmangel reduserer reaksjonstid like mye som alkoholpåvirkning.' },
  { field: 'energy', value: '5_6', fact: '7–8 timer søvn forbedrer konsentrasjon og hukommelse neste dag.' },
  { field: 'energy', value: '7_8', fact: 'God søvn er en av de viktigste faktorene for mental helse.' },
  { field: 'energy', value: 'over_8', fact: 'Regelmessig søvnrytme er like viktig som antall timer.' },

  // Stillesitting
  { field: 'body', value: 'ingen_pauser', fact: 'Stillesitting over 8 timer daglig øker dødelighet uavhengig av trening (WHO).' },
  { field: 'body', value: 'ingen_pauser', fact: '33% av alt sykefravær skyldes muskel- og skjelettplager — pauser hjelper.' },
  { field: 'body', value: 'noen', fact: 'Selv korte pauser fra sitting reduserer belastning på rygg og nakke.' },
  { field: 'body', value: 'regelmessig', fact: 'Regelmessige pauser forbedrer produktivitet og kreativitet.' },

  // Kosthold
  { field: 'context', value: 'ingen', fact: '5 porsjoner frukt og grønt om dagen kan forlenge levetiden med opptil 3 år.' },
  { field: 'context', value: '1_2', fact: 'Hver ekstra porsjon frukt eller grønt reduserer risiko for kronisk sykdom.' },
  { field: 'context', value: '3_4', fact: 'Du er på god vei — de fleste nordmenn spiser under 3 porsjoner daglig.' },
  { field: 'context', value: '5_pluss', fact: 'Du treffer anbefalingene. Et variert kosthold styrker immunforsvaret.' },

  // Mental helse
  { field: 'mental', value: 'hoyt', fact: 'Kronisk stress øker risiko for hjertesykdom og depresjon. Små pauser hjelper.' },
  { field: 'mental', value: 'hoyt', fact: '3 minutter bevisst pust kan senke stresshormonet kortisol merkbart.' },
  { field: 'mental', value: 'middels', fact: 'Fysisk aktivitet er like effektivt som medisiner mot mild depresjon (WHO).' },
  { field: 'mental', value: 'lavt', fact: 'Lavt stressnivå er koblet til bedre søvn, immunforsvar og livskvalitet.' },
]

/** Pick a random fact relevant to the user's check-in answers */
export function pickFact(answers: {
  movement: string
  body: string
  energy: string
  context: string
  mental: string
}): string {
  // Finn fakta som matcher et av svarene
  const matching = healthFacts.filter(f => {
    const val = answers[f.field]
    return val === f.value
  })

  if (matching.length === 0) {
    return 'Hver dag du tar vare på helsa di, investerer du i fremtiden.'
  }

  return matching[Math.floor(Math.random() * matching.length)].fact
}
