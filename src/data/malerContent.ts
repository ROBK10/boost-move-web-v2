// src/data/malerContent.ts

export type MalSection = {
  h: string
  p: string
}

export type MalItem = {
  id: string
  title: string
  subtitle: string
  sections: MalSection[]
}

export type MalCategory = {
  id: string
  label?: string // f.eks "Library"
  title: string  // f.eks "A4 printbare maler"
  items: MalItem[]
}

export const malerCategories: MalCategory[] = [
  {
    id: "a4-library",
    label: "Library",
    title: "A4 printbare maler",
    items: [
      {
        id: "for-og-etter",
        title: "Før og etter",
        subtitle: "A4 utskrift",
        sections: [],
      },
      {
        id: "logg-uke",
        title: "Logg uke",
        subtitle: "A4 utskrift",
        sections: [],
      },
      {
        id: "motivasjon-og-vaner",
        title: "Motivasjon og vaner = mål",
        subtitle: "A4 utskrift",
        sections: [],
      },
      {
        id: "daglige-rutiner",
        title: "Daglige rutiner",
        subtitle: "A4 utskrift",
        sections: [],
      },
      {
        id: "ukeplan",
        title: "Ukeplan",
        subtitle: "A4 utskrift",
        sections: [],
      },
    ],
  },
]

export function getMalerCategories() {
  return malerCategories
}

export function findMalById(id: string) {
  for (const c of malerCategories) {
    const hit = c.items.find((x) => x.id === id)
    if (hit) return hit
  }
  return null
}