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
  image?: string    // cover/hero image path (served from /programmer/images/)
  pdfUrl?: string   // downloadable PDF path (served from /programmer/pdfs/)
  pdfOnly?: boolean // true = no sections, show PDF download CTA as primary action
}

export type ProgramCategory = {
  id: string
  title: string
  items: ProgramItem[]
  pdfUrl?: string   // category-level PDF shown as download badge in list view
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
    id: "raske-okter",
    title: "Raske økter",
    items: [
      {
        id: "5min-rygg",
        title: "5 min rygg",
        subtitle: "Løs opp ryggen ved skrivebordet",
        sections: [
          {
            h: "5 min rygg – Kom i gang",
            p: "Disse øvelsene er laget for deg som sitter mye. Du trenger ingen utstyr og kan gjøre dem ved pulten.\n\nØvelse 1 – Katterygg (1 min)\nKom på alle fire (eller gjør det i stolen). Rund ryggen som en katt, hold 3 sekunder. Slipp ned og løft brystet lett, hold 3 sekunder. Gjenta i 1 minutt.\n\nØvelse 2 – Sittende rotasjon (1 min)\nSitt rett. Roter overkroppen sakte til høyre, hold 5 sekunder. Tilbake til midten. Roter til venstre, hold 5 sekunder. Gjenta i 1 minutt.\n\nØvelse 3 – Bryst åpning (1 min)\nFlett hendene bak hodet. Trekk albuene bakover og press brystet fremover. Hold 5 sekunder, slipp. Gjenta 6 ganger.\n\nØvelse 4 – Hofte hev i stående (1 min)\nStå bak stolen, hold i ryggen. Hev én kne til hoftehøyde, hold 2 sekunder. Bytt ben. Gjenta i 1 minutt.\n\nØvelse 5 – Pust og strekk (1 min)\nStå opp, strekk armene rett opp. Pust dypt inn. Pust ut og senk armene sakte. Gjenta 6 ganger rolig.\n\nBra jobbet! Ryggen din takker deg.",
          },
        ],
      },
      {
        id: "5min-skuldre",
        title: "5 min skuldre",
        subtitle: "Slipp spenning i nakke og skuldre",
        sections: [
          {
            h: "5 min skuldre – Slipp spenningen",
            p: "Skuldre og nakke samler mye spenning gjennom dagen. Disse øvelsene hjelper deg å slippe det.\n\nØvelse 1 – Skulderruller (1 min)\nRull skuldrene sakte bakover 10 ganger. Deretter fremover 10 ganger. Hold rolig tempo og pust jevnt.\n\nØvelse 2 – Nakkestrekk (1 min)\nLen hodet sakte til høyre, la tyngden trekke. Hold 15 sekunder. Tilbake til midten. Gjenta til venstre. Gjenta én gang til på hver side.\n\nØvelse 3 – Arm-kryssing over bryst (1 min)\nTrekk én arm rett over brystet med den andre armen. Hold 15 sekunder. Bytt arm. Gjenta én gang til på hver side.\n\nØvelse 4 – Skulder åpning i dørkarm (1 min)\nStå i en åpning (eller press hendene mot veggen bak). Trykk skuldrene lett bakover og åpne brystet. Hold 10 sekunder, slipp. Gjenta 4–5 ganger.\n\nØvelse 5 – Trist-rolig avrunding (1 min)\nSett deg ned. Lukk øynene. Pust inn gjennom nesen i 4 sekunder. Hold 4 sekunder. Pust ut i 6 sekunder. Gjenta 4 ganger.\n\nSkuldrene dine er lettere nå.",
          },
        ],
      },
      {
        id: "5min-energi",
        title: "5 min energi",
        subtitle: "Kickstart kroppen midt på dagen",
        sections: [
          {
            h: "5 min energi – Vekk kroppen",
            p: "Når energien synker midt på dagen, er bevegelse raskere og bedre enn en kopp kaffe. Disse øvelsene får blodet til å sirkulere.\n\nØvelse 1 – Hoppetau uten tau (1 min)\nHopp lett på stedet, alternér bena som om du hopper tauhopp. Lett intensitet, hold tempo du klarer i 1 minutt.\n\nØvelse 2 – Armhevinger mot vegg (1 min)\nStå 1 meter fra veggen, legg hendene på veggen. Bøy albuene og kom mot veggen, press tilbake. 12–15 repetisjoner.\n\nØvelse 3 – Knehev marsj (1 min)\nMarsjer på stedet med høye knær. Sving armene med. Hold jevnt tempo i 1 minutt.\n\nØvelse 4 – Sidestep (1 min)\nTa et skritt til siden, samle føttene. Ta et skritt til andre siden. Øk tempoet gradvis. Hold i 1 minutt.\n\nØvelse 5 – Dyp pust og strekk (1 min)\nHev armene rett opp over hodet på innpust. Pust ut og slipp armene ned. 6–8 rolige repetisjoner.\n\nDu er nå mer klar enn før!",
          },
        ],
      },
    ],
  },

  {
    id: "oppstart",
    title: "Oppstart",
    items: [
      {
        id: "oppstart-din-vei",
        title: "Din vei",
        subtitle: "Veiledning til trening!",
        pdfUrl: "/programmer/pdfs/kartlegge-verdier.pdf",
        pdfOnly: true,
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
    pdfUrl: "/programmer/pdfs/kontortrening.pdf",
    items: [
      {
        id: "kontortrening-01",
        title: "Kontortrening",
        subtitle: "Myk opp og få i gang blodsirkulasjonen",
        pdfUrl: "/programmer/pdfs/kontortrening.pdf",
        pdfOnly: true,
        sections: [],
      },
    ],
  },

  {
    id: "kjerne-og-bevegelighet",
    title: "Kjerne og bevegelighet",
    pdfUrl: "/programmer/pdfs/kjerne-bevegelighet.pdf",
    items: [
      {
        id: "kjerne-01",
        title: "Kjerne og bevegelighet",
        subtitle: "Bevegelighetsprogram",
        pdfUrl: "/programmer/pdfs/kjerne-bevegelighet.pdf",
        pdfOnly: true,
        sections: [],
      },
    ],
  },

  {
    id: "styrkeprogram-for-lopere",
    title: "Styrkeprogram for løpere",
    pdfUrl: "/programmer/pdfs/styrkeprogram-lopere.pdf",
    items: [
      {
        id: "styrke-loper-01",
        title: "Styrkeprogram",
        subtitle: "Forebygger skader og gjør deg sterkere",
        pdfUrl: "/programmer/pdfs/styrkeprogram-lopere.pdf",
        pdfOnly: true,
        sections: [],
      },
    ],
  },

  {
    id: "mobilitetsprogram-for-lopere",
    title: "Mobilitetsprogram for løpere",
    pdfUrl: "/programmer/pdfs/mobilitetsprogram-lopere.pdf",
    items: [
      {
        id: "mobilitet-loper-01",
        title: "Mobilitetsprogram",
        subtitle: "Bli bedre i løp – bedre flyt og mindre stivhet",
        pdfUrl: "/programmer/pdfs/mobilitetsprogram-lopere.pdf",
        pdfOnly: true,
        sections: [],
      },
    ],
  },

  {
    id: "12uker-niva1",
    title: "12-ukers løpeprogram (nivå 1)",
    pdfUrl: "/programmer/pdfs/norklinikken-12uker.pdf",
    items: make12WeeksItems("niva1"),
  },

  {
    id: "12uker-niva2",
    title: "12-ukers løpeprogram (nivå 2)",
    pdfUrl: "/programmer/pdfs/norklinikken-12uker-niva2.pdf",
    items: make12WeeksItems("niva2"),
  },

  {
    id: "fra-null-til-gull",
    title: "Fra Null til Gull",
    pdfUrl: "/programmer/pdfs/12uker-hybrid.pdf",
    items: [
      {
        id: "nulltilgull-01",
        title: "Fra Null til Gull",
        subtitle: "Kom i gang – bygg deg opp steg for steg",
        pdfUrl: "/programmer/pdfs/12uker-hybrid.pdf",
        pdfOnly: true,
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
