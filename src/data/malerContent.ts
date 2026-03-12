// src/data/malerContent.ts

export type MalSection = {
  h: string
  p: string
}

export type MalItem = {
  id: string
  label?: string
  title: string
  subtitle: string
  sections: MalSection[]
  image?: string    // preview image path (served from /maler/images/)
  pdfUrl?: string   // printable PDF path (served from /maler/pdfs/)
  pdfOnly?: boolean // true = no sections, show PDF download CTA as primary action
}

export type MalCategory = {
  id: string
  label?: string
  title: string
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
        image: "/maler/images/a4-safezone-for-etter.jpg",
        pdfUrl: "/maler/pdfs/a4-for-etter.pdf",
        sections: [],
      },
      {
        id: "logg-uke",
        title: "Logg uke",
        subtitle: "A4 utskrift",
        image: "/maler/images/a4-safezone-logg-uke.jpg",
        sections: [],
      },
      {
        id: "motivasjon-og-vaner",
        title: "Motivasjon og vaner = mål",
        subtitle: "A4 utskrift",
        pdfUrl: "/maler/pdfs/a4-mine-boost-mal.pdf",
        pdfOnly: true,
        sections: [],
      },
      {
        id: "daglige-rutiner",
        title: "Daglige rutiner",
        subtitle: "A4 utskrift",
        image: "/maler/images/a4-safezone-daglige-rutiner.jpg",
        pdfUrl: "/maler/pdfs/a4-daglige-rutiner.pdf",
        sections: [],
      },
      {
        id: "ukeplan",
        title: "Ukeplan",
        subtitle: "A4 utskrift",
        image: "/maler/images/a4-safezone-ukeplan.jpg",
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
