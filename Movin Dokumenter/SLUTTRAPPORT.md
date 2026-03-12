# Sluttrapport – Movin Dokumenter

**Dato:** 12. mars 2026
**Prosjekt:** Boost Move – MOVIN-seksjon
**Status:** ✅ Ferdig

---

## Hva er gjort

Alle dokumenter i «Movin Dokumenter»-mappen er organisert, standardisert og bygget ut som en komplett innholdstruktur klar for bruk i Boost Move-appen.

---

## Fase 1 – Filorganisering og navngiving

Alle 56 dokumenter ble gjennomgått og standardisert:

- Filnavn konvertert til lowercase med bindestreker (æ→ae, ø→o, å→a)
- Hvert dokument har nå to filer: én **PDF** (original) og én **PNG/JPG** (forhåndsvisning)
- Paralogoer i «Partnere Bilder» beholdt som PNG med standardisert navn
- Filer uten PDF fikk automatisk generert PDF fra bildefil

---

## Fase 2 – Logo-utskiftning

30 dokumenter hadde feil logo (Boost Athlete, teal-farget) i nedre høyre hjørne.

- Boost Athlete-logoen (teal, RGB ca. 0/57/64) ble automatisk detektert og erstattet med Boost Move-logoen (sort tekst)
- Alle 30 filer oppdatert, inkl. tilhørende PDF regenerert
- Endelig verifisering: 0 filer med Boost Athlete-logo

---

## Fase 3 – MOVIN-struktur bygget

Mappen `movin/` er opprettet med følgende understruktur:

```
movin/
├── articles/   – 56 Markdown-artikler med frontmatter
├── images/     – 56 bildefiler (PNG/JPG)
├── pdfs/       – 56 original PDF-filer
└── partners/   – 16 partnerlogoer (PNG)
```

### Artikkelformat

Hver artikkel følger dette formatet:

```markdown
---
title: "Tittel på dokumentet"
slug: slug-for-url
category: knowzone | fordeler | maler | programmer
image: filnavn.png
pdf: filnavn.pdf
partner: "Partnernavn"
partner_logo: partnernavn.png
---

[Innhold – uendret fra original]

---

*Levert i samarbeid med Partner*
*© Boost Move*
*[Last ned original PDF](filnavn.pdf)*
```

---

## Innholdsstatistikk

| Kategori | Antall artikler | Beskrivelse |
|----------|-----------------|-------------|
| knowzone | 19 | Helse- og treningsartikler |
| fordeler | 18 | Partnerfordeler for Boost Move-medlemmer |
| programmer | 10 | Treningsprogrammer fra partnere |
| maler | 9 | Utskrivbare maler (PDF-fokus) |
| **Totalt** | **56** | |

**Unike partnere kreditert (20):**
Bike Brothers, Book Sauna, Boost Move, Fitgo, Forus Klinikken, Klepp IL, Løplabbet, Medex, Norklinikken, Nuten Sport, Optimal Bevegelse, Padlegleden, Skap Flyt, Socexo, Sprek Norge, Stavanger Kiropraktisk Senter, Sunkost Alti Jærhagen, Urteloftet, Vetlebu, Zooca

---

## Tekstutvinning – metode

| Metode | Antall dokumenter |
|--------|------------------|
| pdfminer (tekst-PDF) | 9 |
| OCR via pytesseract | 38 |
| Mal-stub (ingen tekst) | 9 |

> **Merk om OCR-kvalitet:** Tesseract hadde kun engelsk språkpakke tilgjengelig. Norske tegn (æøå) og enkelte ord kan ha OCR-feil. Det anbefales å installere `tesseract-ocr-nor` og kjøre `build_movin.py` på nytt for bedre tekstkvalitet på OCR-dokumenter.

---

## Verifisering

Automatisk kvalitetssjekk etter bygging bekreftet:

- ✅ Alle 56 artikler har gyldig frontmatter
- ✅ Alle 56 PDF-filer kopiett til `pdfs/`
- ✅ Alle 56 bildefiler kopiert til `images/`
- ✅ Alle artikler har korrekt partnerkreditering og footer
- ✅ 16 partnerlogoer kopiert til `partners/`

---

## Filer og skript brukt

| Fil | Formål |
|-----|--------|
| `process_movin.py` | Fase 1: Filscan, PNG-generering, navngiving |
| `fix_case.py` | Håndterte HFS+ case-insensitive rename |
| `img_to_pdf.py` | Genererte PDF fra PNG/JPG-filer |
| `swap_logo.py` | Erstattet Boost Athlete-logo med Boost Move |
| `build_movin.py` | Bygget komplett movin/-struktur |
| `verify.py` | Verifiserte filstruktur og navngiving |

---

*Rapport generert automatisk av Boost Move dokumentprosessering*
