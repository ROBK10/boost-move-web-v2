// src/data/fordelerContent.ts
export type FordelSection = {
  h: string
  p: string
}

export type FordelItem = {
  id: string
  title: string
  subtitle: string
  sections: FordelSection[]
  image?: string      // member benefit image (served from /fordeler/images/)
  logo?: string       // clean partner brand logo (served from /partners/logos/)
  pdfUrl?: string     // member benefit document (served from /fordeler/pdfs/)
  pdfOnly?: boolean   // true = no sections, show PDF download CTA as primary action
}

export type FordelCategory = {
  id: string
  title: string
  items: FordelItem[]
}

export const fordelerCategories: FordelCategory[] = [
  {
    id: "samarbeidspartnere",
    title: "Samarbeidspartnere",
    items: [
      {
        id: "loplabbet",
        title: "Løplabbet",
        subtitle: "Sandnes & Stavanger",
        image: "/fordeler/images/loplabbet-medlem.png",
        logo: "/partners/logos/loplabbet.png",
        sections: [],
      },
      {
        id: "book-sauna",
        title: "Book Sauna",
        subtitle: "Rogaland",
        image: "/fordeler/images/book-sauna.png",
        logo: "/partners/logos/book-sauna.png",
        sections: [],
      },
      {
        id: "norklinikken",
        title: "Norklinikken",
        subtitle: "Rogaland",
        image: "/fordeler/images/norklinikken.png",
        logo: "/partners/logos/norklinikken.png",
        sections: [],
      },
      {
        id: "stavanger-kiropraktisk-senter",
        title: "Stavanger kiropraktisk senter",
        subtitle: "Stavanger",
        image: "/fordeler/images/stavanger-kiropraktisk.png",
        logo: "/partners/logos/stavanger-kiropraktisk-senter.png",
        sections: [],
      },
      {
        id: "forus-klinikken",
        title: "Forus Klinikken",
        subtitle: "Forus",
        image: "/fordeler/images/forusklinikken.png",
        logo: "/partners/logos/forus-klinikken.png",
        sections: [],
      },
      {
        id: "bike-brothers",
        title: "Bike Brothers",
        subtitle: "Norge",
        image: "/fordeler/images/bike-brothers.png",
        logo: "/partners/logos/bike-brothers.jpg",
        sections: [],
      },
      {
        id: "skap-flyt",
        title: "Skap-flyt",
        subtitle: "Mental trener",
        image: "/fordeler/images/skap-flyt.png",
        logo: "/partners/logos/skap-flyt.png",
        sections: [],
      },
      {
        id: "sunkost",
        title: "Sunkost",
        subtitle: "Jærhagen/nettbutikk",
        image: "/fordeler/images/sunkost.png",
        logo: "/partners/logos/sunkost.png",
        sections: [],
      },
      {
        id: "mdx",
        title: "MDX",
        subtitle: "Medex.no",
        image: "/fordeler/images/medex.png",
        logo: "/partners/logos/medex.png",
        sections: [],
      },
      {
        id: "optimal-bevegelse",
        title: "Optimal Bevegelse",
        subtitle: "Naprapati",
        image: "/fordeler/images/optimal-bevegelse.png",
        logo: "/partners/logos/optimal-bevegelse.png",
        sections: [],
      },
      {
        id: "nuten-sport",
        title: "Nuten Sport",
        subtitle: "Sauda",
        image: "/fordeler/images/nuten-sport.png",
        logo: "/partners/logos/nuten-sport.png",
        sections: [],
      },
      {
        id: "vetlebu-skiservice",
        title: "Vetlebu Skiservice",
        subtitle: "Sauda",
        image: "/fordeler/images/vetlebu.png",
        logo: "/partners/logos/vetlebu.png",
        sections: [],
      },
      {
        id: "urteloftet",
        title: "Urteloftet",
        subtitle: "Sauda/Nettbutikk",
        image: "/fordeler/images/urteloftet.png",
        sections: [],
      },
      {
        id: "sprek-norge",
        title: "Sprek Norge",
        subtitle: "Forus",
        logo: "/partners/logos/sprek-norge.png",
        pdfUrl: "/fordeler/pdfs/sprek-norge.pdf",
        pdfOnly: true,
        sections: [],
      },
      {
        id: "fitgo",
        title: "Fitgo",
        subtitle: "Stavanger",
        image: "/fordeler/images/fitgo.png",
        sections: [],
      },
      {
        id: "padlegleden",
        title: "Padlegleden",
        subtitle: "Sørlandet",
        image: "/fordeler/images/padlegleden.png",
        logo: "/partners/logos/padlegleden.png",
        sections: [],
      },
      {
        id: "socexo",
        title: "Socexo",
        subtitle: "Rogaland",
        image: "/fordeler/images/socexo.png",
        logo: "/partners/logos/socexo.png",
        sections: [],
      },
      {
        id: "zooca",
        title: "Zooca",
        subtitle: "Fordelsavtale",
        logo: "/partners/logos/zooca.png",
        pdfUrl: "/fordeler/pdfs/zooca.pdf",
        pdfOnly: true,
        sections: [],
      },
    ],
  },
]

export function getFordelerCategories() {
  return fordelerCategories
}

export function findFordelById(id: string) {
  for (const c of fordelerCategories) {
    const hit = c.items.find((x) => x.id === id)
    if (hit) return hit
  }
  return null
}
