export type KomIGangSection = {
  h: string
  p: string
}

export type KomIGangDay = {
  id: string // intro | day1 | day2 ...
  title: string
  subtitle?: string
  sections: KomIGangSection[]
}

export const komIGangDays: KomIGangDay[] = [
  {
    id: "intro",
    title: "Introduksjon (les først)",
    subtitle: "Start her",
    sections: [
      {
        h: "Hva er grunnhelse?",
        p: "Grunnhelse er et solid fundament for både fysisk og mental velvære, slik at du kan leve livet på dine egne premisser. Det er evnen til å håndtere hverdagslige utfordringer og leve aktivt og selvstendig – uansett alder.",
      },
      {
        h: "Hva innebærer god grunnhelse?",
        p: "God grunnhelse betyr en kropp som fungerer optimalt, gir deg energi, og gjør deg i stand til å håndtere livets påkjenninger. Det handler også om mental styrke til å møte utfordringer og en livsstil som støtter både fysisk og psykisk velvære over tid.",
      },
      {
        h: "Hva kan du selv gjøre?",
        p: "Du kan påvirke grunnhelsen din med små, bevisste valg. Regelmessig fysisk aktivitet, et variert kosthold, nok søvn og mental hvile er viktige. Å bygge gode vaner og håndtere stress på en sunn måte er også essensielt.",
      },
      {
        h: "Hvor ser du deg selv som 60-åring?",
        p: "Hvor du er som 60-åring avhenger av hva du gjør i dag. Har du bygget et solid helsegrunnlag, vil du være aktiv, selvstendig og ha overskudd til å gjøre det som betyr mest for deg.",
      },
      {
        h: "Hvor godt klarer du å ta vare på deg selv som 80-åring?",
        p: "Hvordan du tar vare på deg selv som 80-åring starter med valgene du gjør nå. Grunnhelse er en investering i fremtiden – små steg i dag kan gjøre deg mer energisk og robust senere.",
      },
    ],
  },

  // Placeholders (fyll inn senere uten å endre kode)
  { id: "day1", title: "Første dag (i dag)", subtitle: "Dag 1: Jeg ønsker en endring!", sections: [] },
  { id: "day2", title: "Andre dag", subtitle: 'Dag 2: Finn ditt "hvorfor"', sections: [] },
  { id: "day3", title: "Tredje dag", subtitle: "Dag 3: Identitet", sections: [] },
  { id: "day4", title: "Fjerde dag", subtitle: "Dag 4: Mål", sections: [] },
  { id: "day5", title: "Femte dag", subtitle: "Dag 5: Tanker", sections: [] },
  { id: "day6", title: "Sjette dag", subtitle: "Dag 6: Visualisering", sections: [] },
  { id: "day7", title: "Syvende dag", subtitle: "Dag 7: Refleksjon og planlegging", sections: [] },
]

export function getKomIGangDay(id: string) {
  return komIGangDays.find((d) => d.id === id) ?? null
}

export function getNextKomIGangDayId(id: string) {
  const idx = komIGangDays.findIndex((d) => d.id === id)
  if (idx < 0) return null
  return komIGangDays[idx + 1]?.id ?? null
}