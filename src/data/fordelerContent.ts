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
      { id: "loplabbet", title: "Løplabbet", subtitle: "Sandnes & Stavanger", sections: [] },
      { id: "book-sauna", title: "Book Sauna", subtitle: "Rogaland", sections: [] },
      { id: "norklinikken", title: "Norklinikken", subtitle: "Rogaland", sections: [] },
      { id: "stavanger-kiropraktisk-senter", title: "Stavanger kiropraktisk senter", subtitle: "Stavanger", sections: [] },
      { id: "forus-klinikken", title: "Forus Klinikken", subtitle: "Forus", sections: [] },
      { id: "bike-brothers", title: "Bike Brothers", subtitle: "Norge", sections: [] },
      { id: "skap-flyt", title: "Skap-flyt", subtitle: "Mental trener", sections: [] },
      { id: "sunkost", title: "Sunkost", subtitle: "Jærhagen/nettbutikk", sections: [] },
      { id: "mdx", title: "MDX", subtitle: "Medex.no", sections: [] },
      { id: "optimal-bevegelse", title: "Optimal Bevegelse", subtitle: "Naprapati", sections: [] },
      { id: "nuten-sport", title: "Nuten Sport", subtitle: "Sauda", sections: [] },
      { id: "vetlebu-skiservice", title: "Vetlebu Skiservice", subtitle: "Sauda", sections: [] },
      { id: "urteloftet", title: "Urteloftet", subtitle: "Sauda/Nettbutikk", sections: [] },
      { id: "sprek-norge", title: "Sprek Norge", subtitle: "Forus", sections: [] },
      { id: "fitgo", title: "Fitgo", subtitle: "Stavanger", sections: [] },
      { id: "padlegleden", title: "Padlegleden", subtitle: "Sørlandet", sections: [] },
      { id: "socexo", title: "Socexo", subtitle: "Rogaland", sections: [] },
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