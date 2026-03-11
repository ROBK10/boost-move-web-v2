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

  {
    id: "day1",
    title: "Første dag (i dag)",
    subtitle: "Dag 1: Jeg ønsker en endring!",
    sections: [
      {
        h: "Dag 1: Start med valget",
        p: "Informasjon: Alt starter med et valg. Hvis du vil ha en positiv endring, må du bestemme deg for det og forplikte deg. Endring krever innsats, og det er ingen som kan gjøre jobben for deg.\n\nOppgaver:\n\n1. Skriv ned én konkret ting du ønsker å endre i livet ditt. (Det finnes ingen fasit, men et eksempel kan være «Jeg vil endre treningsvanen min»).\n\n2. Reflekter over hvorfor dette valget er viktig for deg. Skriv ned dine tanker.\n\n3. Forplikt deg til dette valget, og si det høyt for deg selv: «Jeg velger å .»",
      },
    ],
  },

  {
    id: "day2",
    title: "Andre dag",
    subtitle: 'Dag 2: Finn ditt "hvorfor"',
    sections: [
      {
        h: 'Dag 2: Finn ditt "hvorfor"',
        p: "Informasjon: Motivasjon holder ikke alltid. Det som holder deg i gang over tid er et tydelig «hvorfor» – en dyp grunn til at du ønsker endringen.\n\nOppgaver:\n\n1. Tenk tilbake på valget du tok i går. Spør deg selv: Hvorfor er dette viktig for meg?\n\n2. Skriv ned minst tre grunner. Jo mer personlig og spesifikt, jo bedre.\n\n3. Les dem høyt for deg selv. Legg merke til hva som kjennes sterkest.",
      },
    ],
  },

  {
    id: "day3",
    title: "Tredje dag",
    subtitle: "Dag 3: Identitet",
    sections: [
      {
        h: "Dag 3: Hvem vil du være?",
        p: "Informasjon: Varige endringer skjer når du begynner å se på deg selv annerledes. I stedet for å si «Jeg prøver å trene mer», si «Jeg er en person som er aktiv».\n\nOppgaver:\n\n1. Beskriv hvem du ønsker å bli. Ikke hva du vil gjøre, men hvem du vil være.\n\n2. Skriv en kort setning som starter med «Jeg er en person som …»\n\n3. Les denne setningen hver morgen denne uken.",
      },
    ],
  },

  {
    id: "day4",
    title: "Fjerde dag",
    subtitle: "Dag 4: Mål",
    sections: [
      {
        h: "Dag 4: Sett et konkret mål",
        p: "Informasjon: Et godt mål er spesifikt, målbart og tidsbestemt. Vage mål gir vage resultater.\n\nOppgaver:\n\n1. Ta valget og «hvorfor»-et ditt fra de første dagene og form det om til et konkret mål.\n\nEksempel: I stedet for «Jeg vil bevege meg mer», skriv «Jeg skal gå 20 minutter etter lunsj, tre ganger i uken, de neste fire ukene».\n\n2. Skriv ned målet ditt.\n\n3. Del det med noen du stoler på, eller behold det som din private kontrakt med deg selv.",
      },
    ],
  },

  {
    id: "day5",
    title: "Femte dag",
    subtitle: "Dag 5: Tanker",
    sections: [
      {
        h: "Dag 5: Tankene dine former veien",
        p: "Informasjon: Det vi sier til oss selv påvirker hva vi gjør. Negative tanker («Jeg klarer ikke dette», «Det er for vanskelig») er automatiske, men de kan utfordres.\n\nOppgaver:\n\n1. Tenk på én negativ tanke du har hatt om endringen din. Skriv den ned.\n\n2. Utfordre den: Er tanken sann? Hva er beviset? Hva ville du sagt til en venn i samme situasjon?\n\n3. Skriv en mer balansert og støttende tanke i stedet.",
      },
    ],
  },

  {
    id: "day6",
    title: "Sjette dag",
    subtitle: "Dag 6: Visualisering",
    sections: [
      {
        h: "Dag 6: Se deg selv lykkes",
        p: "Informasjon: Visualisering er et verktøy brukt av toppidrettsutøvere og ledere. Hjernen skiller ikke alltid mellom noe du opplever og noe du levende forestiller deg.\n\nOppgaver:\n\n1. Finn et rolig sted. Lukk øynene i 2–3 minutter.\n\n2. Se for deg selv om 30 dager – etter at du har holdt deg til endringen du valgte. Hvordan ser du ut? Hvordan føler du deg? Hva sier folk rundt deg?\n\n3. Skriv ned det du så og følte. Bruk det som motivasjon fremover.",
      },
    ],
  },

  {
    id: "day7",
    title: "Syvende dag",
    subtitle: "Dag 7: Refleksjon og planlegging",
    sections: [
      {
        h: "Dag 7: Se tilbake – og planlegg fremover",
        p: "Informasjon: Du har nå gått gjennom en hel uke med bevisst jobbing med deg selv. Det er ikke lite.\n\nOppgaver:\n\n1. Se tilbake på uken. Hva var lettest? Hva var vanskeligst?\n\n2. Hva har du lært om deg selv?\n\n3. Lag en enkel plan for neste uke: Én vane du vil fortsette, én ting du vil gjøre annerledes.\n\nHusk: Du trenger ikke å være perfekt. Du trenger bare å fortsette.",
      },
    ],
  },
]

export function getKomIGangDay(id: string) {
  return komIGangDays.find((d) => d.id === id) ?? null
}

export function getNextKomIGangDayId(id: string) {
  const idx = komIGangDays.findIndex((d) => d.id === id)
  if (idx < 0) return null
  return komIGangDays[idx + 1]?.id ?? null
}