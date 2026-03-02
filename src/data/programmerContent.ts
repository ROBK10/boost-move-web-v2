// src/data/programmerContent.ts

export type ProgramSection = {
  h: string
  p: string
}

export type ProgramItem = {
  id: string
  title: string
  subtitle: string
  sections: ProgramSection[]
}

export type ProgramCategory = {
  id: string
  title: string
  items: ProgramItem[]
}

function make12WeeksItems(prefix: string): ProgramItem[] {
  const items: ProgramItem[] = []
  for (let week = 1; week <= 12; week++) {
    for (let day = 1; day <= 3; day++) {
      items.push({
        id: `${prefix}-uke${week}-dag${day}`,
        title: `Uke ${week}`,
        subtitle: `Dag ${day}/3`,
        sections: [],
      })
    }
  }

  items.push({
    id: `${prefix}-ferdig`,
    title: "Ferdig",
    subtitle: "Bra jobbet!",
    sections: [],
  })

  return items
}

export const programmerCategories: ProgramCategory[] = [
  {
    id: "oppstart",
    title: "Oppstart",
    items: [
      {
        id: "oppstart-din-vei",
        title: "Din vei",
        subtitle: "Veiledning til trening!",
        sections: [],
      },
    ],
  },

  {
    id: "mental-klarhet",
    title: "Mental klarhet",
    items: [
      {
        id: "mental-klarhet-01",
        title: "Mental klarhet",
        subtitle: "Skap-Flyt program – din guide til å gå på «navigasjonssystem»",
        sections: [],
      },
    ],
  },

  {
    id: "kontortrening",
    title: "Kontortrening",
    items: [
      {
        id: "kontortrening-01",
        title: "Kontortrening",
        subtitle: "Myk opp og få i gang blodsirkulasjonen",
        sections: [],
      },
    ],
  },

  {
    id: "kjerne-og-bevegelighet",
    title: "Kjerne og bevegelighet",
    items: [
      {
        id: "kjerne-01",
        title: "Kjerne og bevegelighet",
        subtitle: "Bevegelighetsprogram",
        sections: [],
      },
    ],
  },

  {
    id: "styrkeprogram-for-lopere",
    title: "Styrkeprogram for løpere",
    items: [
      {
        id: "styrke-loper-01",
        title: "Styrkeprogram",
        subtitle: "Forebygger skader og gjør deg sterkere",
        sections: [],
      },
    ],
  },

  {
    id: "mobilitetsprogram-for-lopere",
    title: "Mobilitetsprogram for løpere",
    items: [
      {
        id: "mobilitet-loper-01",
        title: "Mobilitetsprogram",
        subtitle: "Bli bedre i løp – bedre flyt og mindre stivhet",
        sections: [],
      },
    ],
  },

  {
    id: "12uker-niva1",
    title: "12-ukers løpeprogram (nivå1)",
    items: make12WeeksItems("niva1"),
  },

  {
    id: "12uker-niva2",
    title: "12-ukers løpeprogram (nivå2)",
    items: make12WeeksItems("niva2"),
  },

  {
    id: "fra-null-til-gull",
    title: "Fra Null til Gull.",
    items: [
      {
        id: "nulltilgull-01",
        title: "Fra Null til Gull",
        subtitle: "Kom i gang – bygg deg opp steg for steg",
        sections: [],
      },
    ],
  },

  {
    id: "eksplosiv-styrke-hjemme",
    title: "Eksplosiv styrke hjemme",
    items: [
      {
        id: "eksplosiv-01",
        title: "Eksplosiv styrke hjemme",
        subtitle: "Rask og effektiv økt hjemme",
        sections: [],
      },
    ],
  },

  {
    id: "kroppsvekt-hvor-som-helst",
    title: "Kroppsvekt økt hvor som helst",
    items: [
      {
        id: "kroppsvekt-01",
        title: "Kroppsvekt økt",
        subtitle: "Du trenger bare kroppen",
        sections: [],
      },
    ],
  },

  {
    id: "magetrening-planke",
    title: "Magetrening med fokus på planke",
    items: [
      {
        id: "planke-01",
        title: "Plankeprogram",
        subtitle: "Stabilitet og sterk kjerne",
        sections: [],
      },
    ],
  },

  {
    id: "fullkropp-treningsstudio",
    title: "Fullkroppsøkt treningsstudio",
    items: [
      {
        id: "fullkropp-01",
        title: "Fullkroppsøkt",
        subtitle: "Treningsstudio",
        sections: [],
      },
    ],
  },
]

export function getProgrammerCategories() {
  return programmerCategories
}

export function findProgramById(id: string) {
  for (const c of programmerCategories) {
    const hit = c.items.find((x) => x.id === id)
    if (hit) return hit
  }
  return null
}