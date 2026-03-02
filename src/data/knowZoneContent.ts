// src/data/knowZoneContent.ts
export type KnowZoneSection = {
  h: string
  p: string
}

export type KnowZoneItem = {
  id: string
  title: string
  subtitle: string
  sections: KnowZoneSection[]
}

export type KnowZoneCategory = {
  id: string
  title: string
  items: KnowZoneItem[]
}

export const knowZoneCategories: KnowZoneCategory[] = [
  // 1) Vanedannelse
  {
    id: "vanedannelse",
    title: "Vanedannelse",
    items: [
      {
        id: "vane-01",
        title: "Vil du endelig klare å bli mer fysisk aktiv?",
        subtitle: "lær mer om vanenes rolle når vi prøver å endre atferd",
        sections: [{ h: "Intro", p: "Placeholder..." }],
      },
    ],
  },

  // 2) Kunnskap til bedre trening
  {
    id: "kunnskap-trening",
    title: "Kunnskap til bedre trening",
    items: [
      {
        id: "kt-01",
        title: "Tilstandsstyring",
        subtitle: "Hvordan styrke/endre tilstanden vår",
        sections: [{ h: "Intro", p: "Placeholder..." }],
      },
      {
        id: "kt-02",
        title: "Pulstrening",
        subtitle: "Hva sier pulsen?",
        sections: [{ h: "Intro", p: "Placeholder..." }],
      },
      {
        id: "kt-03",
        title: "Løp/gå metoden",
        subtitle: "Bruk løp/gå metoden for å komme i form!",
        sections: [{ h: "Intro", p: "Placeholder..." }],
      },
      {
        id: "kt-04",
        title: "Belastning og økning",
        subtitle: "Hva er belastning og hvordan øke",
        sections: [{ h: "Intro", p: "Placeholder..." }],
      },
      {
        id: "kt-05",
        title: "Søvn og restitusjon",
        subtitle: "Hvordan enkelt mestre søvn og restitusjon",
        sections: [{ h: "Intro", p: "Placeholder..." }],
      },
      {
        id: "kt-06",
        title: "Trening og sykdom",
        subtitle: "Hva må jeg tenke på når er syk?",
        sections: [{ h: "Intro", p: "Placeholder..." }],
      },
      {
        id: "kt-07",
        title: "80-20 regelen",
        subtitle: "Hva er 80-20 regelen og hvorfor bruke denne?",
        sections: [{ h: "Intro", p: "Placeholder..." }],
      },
    ],
  },

  // 3) Ernæring
  {
    id: "ernaering",
    title: "Ernæring",
    items: [
      {
        id: "ern-01",
        title: "Slik når du dine kostholdsrelaterte mål",
        subtitle: "Hvorfor er dietter så vanskelig, og hvordan kan du lykkes?",
        sections: [{ h: "Intro", p: "Placeholder..." }],
      },
      {
        id: "ern-02",
        title: "Tips til mettende måltider",
        subtitle: "4 enkle tips til å ta smarte valg i hverdagen",
        sections: [{ h: "Intro", p: "Placeholder..." }],
      },
      {
        id: "ern-03",
        title: "Kosthold og trening",
        subtitle: "Hva er anbefalt og hvordan kan jeg gjøre smarte valg?",
        sections: [{ h: "Intro", p: "Placeholder..." }],
      },
      {
        id: "ern-04",
        title: "Grunnprinsipper for et godt kosthold",
        subtitle: "Enkel oversikt over hva kroppen trenger for å fungere best.",
        sections: [{ h: "Intro", p: "Placeholder..." }],
      },
    ],
  },

  // 4) Hormoner
  {
    id: "hormoner",
    title: "Hormoner",
    items: [
      {
        id: "hor-01",
        title: "Hormonbalanse",
        subtitle: "Hormonbalanse hos kvinner og menn",
        sections: [{ h: "Intro", p: "Placeholder..." }],
      },
    ],
  },

  // 5) Muskelbalanse
  {
    id: "muskelbalanse",
    title: "Muskelbalanse",
    items: [
      {
        id: "mus-01",
        title: "Hva er muskelbalanse?",
        subtitle: "Hva er muskelbalanse og hvorfor spiller dette en rolle?",
        sections: [{ h: "Intro", p: "Placeholder..." }],
      },
      {
        id: "mus-02",
        title: "Muskelbalanse: Gå - løper",
        subtitle: "Muskelbalanse for deg som liker å gå Eller løpe",
        sections: [{ h: "Intro", p: "Placeholder..." }],
      },
      {
        id: "mus-03",
        title: "Muskelbalanse: Nakke-Skulder-Rygg",
        subtitle: "Muskelbalanse for deg som har plager i nakke-skulder-rygg regionen",
        sections: [{ h: "Intro", p: "Placeholder..." }],
      },
    ],
  },

  // 6) Urpraksis
  {
    id: "urpraksis",
    title: "Urpraksis",
    items: [
      {
        id: "ur-01",
        title: "Varme og kulde eksponering",
        subtitle: "Eksponering av varme og kulde",
        sections: [{ h: "Intro", p: "Placeholder..." }],
      },
      {
        id: "ur-02",
        title: "Faste",
        subtitle: "lær mer om faste og hvilke helseeffekter det kan gi",
        sections: [{ h: "Intro", p: "Placeholder..." }],
      },
    ],
  },
]

export function getKnowZoneCategories() {
  return knowZoneCategories
}

export function findKnowZoneItemById(id: string) {
  for (const c of knowZoneCategories) {
    const hit = c.items.find((x) => x.id === id)
    if (hit) return hit
  }
  return null
}