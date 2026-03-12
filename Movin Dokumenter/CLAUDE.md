# CLAUDE.md – Boost Move App

## Prosjektoversikt

Dette er **Boost Move**-appen – en helse- og treningsapp for bedriftsmedlemmer.
Stack: **Vue 3 + Vite + TypeScript + Node**.

## MOVIN-seksjonen

MOVIN er en innholdseksjon i appen hvor brukere kan lese artikler og laste ned
ressurser fra Boost Move og samarbeidspartnere (klinikker, treningspartnere, o.l.).

### Innholdsstruktur (klar til bruk)

Alle filer ligger i `movin/`-mappen:

```
movin/
├── articles/     56 Markdown-filer med YAML frontmatter
├── images/       56 bilder (PNG/JPG) – én per artikkel
├── pdfs/         56 original PDF-filer
└── partners/     16 partnerlogoer (PNG)
```

### Frontmatter-format (alle artikler)

```yaml
---
title: "Søvn og restitusjon"
slug: sovn-og-restitusjon
category: knowzone          # knowzone | fordeler | maler | programmer
image: sovn-og-restitusjon.jpg
pdf: sovn-og-restitusjon.pdf
partner: "Boost Move"
partner_logo: null          # f.eks. norklinikken.png, eller null
---
```

### Kategorier

| Kategori | Antall | Beskrivelse |
|----------|--------|-------------|
| `knowzone` | 19 | Helse- og treningsartikler |
| `fordeler` | 18 | Partnerfordeler for Boost Move-medlemmer |
| `programmer` | 10 | Treningsprogrammer fra partnere |
| `maler` | 9 | Utskrivbare maler (PDF-fokus, minimal tekst) |

---

## Oppgave: Integrer MOVIN i appen

### 1. Plasser filer

```
public/
  movin/
    images/       ← kopier hit fra movin/images/
    pdfs/         ← kopier hit fra movin/pdfs/
    partners/     ← kopier hit fra movin/partners/

src/
  content/
    movin/        ← kopier hit fra movin/articles/
```

### 2. Generer innholdsindeks

Lag `src/composables/useMovin.ts` som:
- Importerer alle `.md`-filer med `import.meta.glob`
- Parser frontmatter med `gray-matter`
- Eksponerer `articles`, `getBySlug(slug)`, `getByCategory(cat)`

```ts
// Eksempel på ønsket API
const { articles, getBySlug, getByCategory } = useMovin()
const knowzoneArticles = getByCategory('knowzone')
const article = getBySlug('sovn-og-restitusjon')
```

### 3. Lag komponenter

**`MovinList.vue`**
- Grid-visning av alle artikler
- Filtreringsknapper for kategori (KnowZone / Fordeler / Programmer / Maler)
- Hvert kort viser: bilde, tittel, partnernavn
- Klikk → router-push til `/movin/:slug`

**`MovinArticle.vue`**
- Viser én artikkel fullstendig
- Topp: artikkelbilde (full bredde)
- Innhold: rendret Markdown
- Footer-seksjon med:
  - Partnerlogo (hvis `partner_logo` ikke er null)
  - Tekst: *"Levert i samarbeid med [partner]"*
  - Knapp: *"Last ned original PDF"* → lenke til `/movin/pdfs/[pdf]`
  - *© Boost Move*

**`PartnerBadge.vue`**
- Props: `partner: string`, `partnerLogo: string | null`
- Viser logo + navn
- Fallback til kun tekst hvis logo er null

### 4. Ruting (`vue-router`)

```ts
{ path: '/movin',       component: () => import('./views/MovinList.vue') },
{ path: '/movin/:slug', component: () => import('./views/MovinArticle.vue') },
```

### 5. Markdown-rendering

Bruk `markdown-it` eller `marked` for å rendre artikkelteksten.
Installer: `npm install gray-matter marked` (eller `markdown-it`)

---

## Viktige regler

- **Endre aldri teksten** i `.md`-filene – innholdet er hentet direkte fra originaldokumentene
- **Behold alltid** original PDF tilgjengelig for nedlasting
- **Krediter alltid** partneren i footer på artikkelvisningen
- Bruk **Boost Move-branding** (logo, farger) konsekvent

## Kjente begrensninger

- OCR-tekst fra bildebaserte PDF-er kan ha små feil i norske ord (æøå)
- 9 maler (`category: maler`) har minimal tekst – de er primært ment som PDF-nedlastninger
- `partner_logo: null` betyr at partneren ikke har logo i systemet

---

*Generert: 12. mars 2026 | Boost Move dokumentprosessering*
