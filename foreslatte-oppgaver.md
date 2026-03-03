# Foreslåtte oppgaver

## 1) Skrivefeil: rett tekst i KnowZone-innhold
**Problem:** I teksten for "Trening og sykdom" står det i dag: "Hva må jeg tenke på når er syk?".

**Foreslått oppgave:**
- Rett teksten til "Hva må jeg tenke på når jeg er syk?".
- Kjør en rask gjennomgang av øvrige `subtitle`-felter for tilsvarende småfeil (store/små bokstaver og manglende ord).

**Berørt fil:** `src/data/knowZoneContent.ts`

**Akseptansekriterier:**
- Visningsteksten er grammatisk korrekt i UI.
- Ingen eksisterende ID-er eller datamodeller er endret.

---

## 2) Bug: build feiler på Linux pga. feil store-import (case sensitivity)
**Problem:** `BoostMoment.vue` importerer `@/stores/boostMomentStore`, mens filen heter `BoostMomentStore.ts`. Dette kan fungere på case-insensitive filsystem, men feiler i produksjonsbygg på Linux.

**Foreslått oppgave:**
- Standardiser filnavn/import slik at casing matcher 100%.
- Kjør `npm run build` i CI- eller Linux-miljø for å verifisere at feilen er borte.

**Berørte filer:**
- `src/views/movin/BoostMoment.vue`
- `src/stores/BoostMomentStore.ts`

**Akseptansekriterier:**
- `npm run build` fullfører uten "Could not load ... boostMomentStore"-feil.
- Ingen regresjon i Boost Moment-flyt (hydrate, complete, reset).

---

## 3) Dokumentasjonsavvik: README beskriver template i stedet for produktet
**Problem:** README er i praksis standardtekst fra Vue/Vite-template og beskriver ikke domene, struktur eller sentrale kommandoer for dette prosjektet.

**Foreslått oppgave:**
- Oppdater README med prosjektspesifikk introduksjon (Boost Move Web), funksjonsoversikt, teknologistack, og mappe-/moduloversikt.
- Legg inn seksjon for kvalitetssikring (hvordan kjøre lint/test/build).

**Berørt fil:** `README.md`

**Akseptansekriterier:**
- En ny utvikler kan sette opp, kjøre og forstå prosjektet uten intern kontekst.
- README inneholder minst: formål, oppstart, bygg, og test/lint-rutiner.

---

## 4) Testforbedring: legg til enhetstester for scorings- og datologikk
**Problem:** Kodebasen mangler automatiserte tester, spesielt rundt beregningslogikk med terskler og dato.

**Foreslått oppgave:**
- Sett opp Vitest for enhetstester (hvis ikke allerede konfigurert).
- Legg tester for `todayISO`, `normalizeMovement`, og utvalgte score-funksjoner/`computeScore` via offentlig store-API.
- Inkluder grensetester (f.eks. 299/300 for minutter/steg, og score-terskler).

**Berørte filer:**
- `src/stores/minHelseStore.ts`
- `package.json` (scripts/avhengigheter ved behov)

**Akseptansekriterier:**
- Testkommando kan kjøres lokalt i CI-lignende miljø.
- Kritiske grenser i datotolkning og poengberegning er dekket av tester.
