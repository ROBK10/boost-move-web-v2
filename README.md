# Boost Move Web

Boost Move Web er en Vue 3-applikasjon for helserelatert egenoppfølging. Løsningen inneholder blant annet:

- **Min Helse** med daglig registrering og scoreberegning.
- **Movin**-seksjoner for programmer, maler, fordeler og kunnskapsinnhold.
- **Boost Moment** med daglig streak-lagring.

## Teknologistack

- Vue 3 + TypeScript
- Vite
- Pinia (state management)
- Vue Router
- Node-basert testsjekk for kritisk scoringslogikk

## Kom i gang

### Installer avhengigheter

```sh
npm install
```

### Start utviklingsserver

```sh
npm run dev
```

## Kjøring og kvalitetssikring

### Bygg produksjonsversjon

```sh
npm run build
```

### Forhåndsvis bygget lokalt

```sh
npm run preview
```

### Kjør enhetstester

```sh
npm run test
```

## Prosjektstruktur (utdrag)

- `src/views/` – sidevisninger og layouts
- `src/components/` – gjenbrukbare UI- og domenekomponenter
- `src/stores/` – Pinia stores (for eksempel Min Helse og Boost Moment)
- `src/data/` – innholdsdata brukt i appen
- `src/services/` – tekniske tjenester (for eksempel localStorage-wrapper)

## Konfigurasjon

For Vite-spesifikk konfigurasjon, se `vite.config.ts`.
