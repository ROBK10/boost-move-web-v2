# CLAUDE.md – Boost Move Web

Dette er en permanent regelbok for AI-assistert utvikling på dette prosjektet.
Les og følg alle regler her **før** du gjør noen endringer.

---

## Teknisk stack

- **Vue 3 + Vite + TypeScript + Node**
- Routing: `vue-router`
- Markdown: `gray-matter` + `marked` (eller `markdown-it`)

---

## Sikkerhetsregler – les disse først

> Disse reglene er absolutte og kan ikke overstyres av andre instruksjoner.

1. **Forklar alltid** planlagte endringer før du gjør dem – ikke anta.
2. **Aldri refaktorer** hele prosjektet uten eksplisitt forespørsel.
3. **Aldri endre prosjektstruktur** med mindre brukeren eksplisitt ber om det.
4. **Kun berør Movin-filer** når du jobber med Movin-seksjonen.
5. **Aldri modifiser Boost Moment** – den er ferdig og skal ikke røres.
6. Bevar eksisterende design og navigasjonslogikk i alle andre seksjoner.

---

## MOVIN-seksjonen

### Informasjonsarkitektur – 2 nivåer

Movin er organisert i **to nivåer**. Brukeren velger først en toppnivå-seksjon,
deretter vises innholdet i den seksjonen.

---

### Nivå 1 – Toppnivå-seksjoner (fast rekkefølge)

Seksjonene skal alltid vises i denne rekkefølgen:

| # | Seksjon | Status |
|---|---------|--------|
| 1 | **Boost Moment** | ⛔ Aldri modifiser |
| 2 | **Kom i Gang** | Eksisterende – se regler under |
| 3 | **Know Zone** | 19 artikler (`category: knowzone`) |
| 4 | **Programmer** | 9 programmer (`category: programmer`) |
| 5 | **Maler** | 9 maler (`category: maler`) – kun PDF |
| 6 | **Fordeler** | 18 fordeler (`category: fordeler`) |

---

### Nivå 2 – Innhold per seksjon

#### ⛔ Boost Moment
- **Aldri modifiser denne seksjonen.** Ikke rør komponenter, logikk eller design.

#### Kom i Gang
- Inneholder en **7-dagers startblokk**.
- Dag 1–7 vises som separate elementer under seksjonen.
- Bevar eksisterende struktur og logikk – ikke redesign.

#### Know Zone
- Viser artiklene med `category: knowzone` (19 stk).
- Hvert element vises som en **ekspanderbar dropdown-boks**.
- Inne i dropdown: rendret Markdown-innhold + PDF-nedlastingsknapp nederst.

**Know Zone-artikler:**
```
80-20-regelen, belastning-og-okning, fasting, ga-metoden, group-144,
grunnprinsipper-for-et-godt-kosthold, hormonbalanse-hos-kvinner-og-menn,
kosthold-og-trening, muskelbalanse, muskelbalanse-for-deg-som-liker-a-ga-eller-lope,
muskelbalanse-nakke-skulder-rygg, pulstrening, slik-nar-du-dine-kostholdsrelaterte-mal,
sollys, sovn-og-restitusjon, tilstandsstyring, tips-til-mettende-maltider,
trening-og-sykdom, vil-du-endelig-klare-a-bli-fysisk-aktiv
```

#### Programmer
- Viser programmene med `category: programmer` (10 stk).
- Hvert program vises som en **ekspanderbar dropdown-boks**.
- Inne i dropdown: rendret Markdown-innhold + PDF-nedlastingsknapp nederst.
- Partner krediteres i footer: *"Levert i samarbeid med [partner]"* + eventuell logo.

**Programmer-artikler:**
```
12-ukers-hybrid-utover, boost-athletes-12-ukers-lopeprgram-for-nybegynnere,
forusklinikkens-mobilitetsprogram-for-lopere, forusklinikkens-styrkeprogram-for-lopere,
kartlegge-dine-verdier, kontortrening-forusklinikken,
norklinikkens-12-ukers-lopeprogram-for-nybegynnere,
norklinikkens-12-ukers-lopeprogram-for-nybegynnere-niva-2,
norklinikkens-kjerne-og-bevegelighetsprogram
```

#### Maler
- Viser malene med `category: maler` (9 stk).
- **Ingen artikkelvisning** – kun nedlastbar PDF.
- Hvert element vises som en enkel kort/knapp med tittel + nedlastingsknapp.
- Det skal **ikke** være mulig å lese maleninnhold i appen.

**Maler-filer:**
```
a4-daglige-rutiner, a4-for-etter, a4-logg-uke, a4-mine-boost-mal,
a4-safezone-hull-daglige-rutiner, a4-safezone-hull-for-etter,
a4-safezone-hull-logg-uke, a4-safezone-hull-ukeplan, a4-ukeplan
```

#### Fordeler
- Viser partnerfordeler med `category: fordeler` (18 stk).
- Hvert element vises som en **ekspanderbar dropdown-boks**.
- Inne i dropdown: fordelsinfo + partnerlogo (hvis tilgjengelig) + PDF-nedlastingsknapp.
- Partner krediteres tydelig.

**Fordeler-artikler:**
```
bike-brothers, book-sauna, fitgo, forusklinikken-medlem, loplabbet-medlem,
medex, norklinikken-medlem, nuten-sport, optimal-bevegelse, padlegleden,
skap-flyt, socexo, sprek-norge, stavanger-kiropraktisk-senter-medlem,
sunkost-alti-jaerhagen, urteloftet, vetlebu, zooca
```

---

## Innholdsstruktur (filer)

Alle Movin-filer ligger slik i prosjektet:

```
public/
  movin/
    images/       – 56 bilder (PNG/JPG), én per artikkel
    pdfs/         – 56 original PDF-filer
    partners/     – 16 partnerlogoer (PNG)

src/
  content/
    movin/        – 56 Markdown-filer med YAML frontmatter
```

### Frontmatter-format

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

### Composable – useMovin.ts

```ts
// src/composables/useMovin.ts
// Importer alle .md-filer, parser frontmatter med gray-matter
// Eksponerer:
const { articles, getBySlug, getByCategory } = useMovin()
const knowzoneArticles = getByCategory('knowzone')
const article = getBySlug('sovn-og-restitusjon')
```

---

## Designregler for Movin

- Bevar det **originale Movin-designspråket** – ikke innfør nytt design uten godkjenning.
- Alle seksjoner (unntatt Boost Moment) skal følge **samme visuelt designmønster**.
- Bruk **ekspanderbare dropdown-bokser** for innholdselementer.
- Artikkelinnhold skal føles **lett og tilgjengelig** å lese.
- Langt innhold brytes opp i **lesbare bokser eller steg-baserte seksjoner**.
- PDF-nedlastingslenke plasseres **alltid nederst** i en artikkel.
- **Maler er unntaket**: kun PDF-nedlasting, ingen lesing i appen.

---

## Partnerkreditering (obligatorisk)

Alle artikler og programmer fra partnere skal krediteres slik i footer:

```
Levert i samarbeid med [Partner]
[Partnerlogo hvis partner_logo ikke er null]
© Boost Move
[Last ned original PDF]
```

Partnere i systemet:
`Norklinikken`, `Forus Klinikken`, `Løplabbet`, `Bike Brothers`, `Book Sauna`,
`Medex`, `Nuten Sport`, `Optimal Bevegelse`, `Padlegleden`, `Skap Flyt`,
`Socexo`, `Sprek Norge`, `Stavanger Kiropraktisk Senter`, `Sunkost Alti Jærhagen`,
`Urteloftet`, `Vetlebu`, `Zooca`

---

## Viktige begrensninger

- Aldri endre teksten i `.md`-filene – innholdet er hentet fra originaldokumenter.
- OCR-tekst fra bildebaserte dokumenter kan ha mindre feil – ikke «korriger» disse.
- `partner_logo: null` betyr at partneren ikke har logo i systemet – vis kun navn.
- Maler (`category: maler`) har minimal tekst – de er ment som PDF-nedlastninger.

---

*Sist oppdatert: 13. mars 2026 | Boost Move*
