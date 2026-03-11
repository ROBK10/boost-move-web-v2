<script setup lang="ts">
const emit = defineEmits<{
  (e: "open"): void
}>()

function open() {
  emit("open")
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault()
    open()
  }
}

const insights = [
  "Små bevegelsespauser gjennom dagen gir bedre fokus og lavere stressnivå.",
  "3 dype pust senker pulsen og hjelper kroppen å skifte til ro-modus.",
  "Regelmessig bevegelse er den enkeltfaktoren som påvirker energinivået mest.",
  "Det å stå opp i 2 minutter per time reduserer belastningen på ryggen markant.",
  "Mental kapasitet henger direkte sammen med søvn, bevegelse og pauser.",

  // --- 40 nye ---
  "Små pauser i løpet av arbeidsdagen kan øke konsentrasjonen mer enn du tror.",
  "En kort gåtur etter lunsj kan gi både bedre humør og bedre fokus resten av dagen.",
  "Å drikke nok vann er en av de enkleste måtene å holde energien oppe på.",
  "Kroppen er ikke laget for å sitte stille i åtte timer – beveg deg, selv i ett minutt.",
  "God holdning ved skrivebordet reduserer muskelspenninger og gir mer energi.",
  "Å ta en kort pust-pause er ikke sløsing med tid – det er investering i produktivitet.",
  "Stressreaksjonene i kroppen dempes raskere når du puster bevisst og sakte.",
  "En enkel strekkøvelse hver time kan forebygge kroniske nakkesmerter over tid.",
  "Det du gjør i pausene dine former arbeidskapasiteten din like mye som jobben selv.",
  "Mikropauser på 1–2 minutter er dokumentert mer effektive enn én lang pause.",
  "Fokus er en begrenset ressurs – det er smart å lade den opp jevnlig gjennom dagen.",
  "Bevisst pust aktiverer det parasympatiske nervesystemet og gir ro på sekunder.",
  "Å stå opp mens du tar en telefon er en enkel vane som gir kroppen mer bevegelse.",
  "God søvn natten før er den viktigste faktoren for mental ytelse neste dag.",
  "Øynene trenger pauser fra skjermen – 20-20-20-regelen hjelper: hvert 20. minutt, se 20 fot unna i 20 sekunder.",
  "Ryggsmerter hos kontorarbeidere skyldes oftest for lite bevegelse, ikke for mye.",
  "En åpen kroppsholdning signaliserer trygghet – til deg selv og til omgivelsene.",
  "Hjernen fungerer bedre etter fysisk aktivitet fordi blodgjennomstrømningen øker.",
  "Å gjøre én liten ting for helsen din hver dag bygger sterke vaner over tid.",
  "Arbeidsmiljøet ditt påvirker stressnivået ditt – rydd, så tankene blir klarere.",
  "Diafragmapust er kroppens naturlige stressbrems – prøv det neste gang du er spent.",
  "Å sette av fem minutter til strekk midt på dagen er en investering, ikke et avbrudd.",
  "Mentalt krevende arbeid forbruker energi – pauser er påfylling, ikke latskap.",
  "Regelmessige bevegelsespauser reduserer risikoen for livsstilssykdommer markant.",
  "En kort vandring på fire minutter kan kutte ned på mentalt stress i løpet av timer.",
  "Å bytte mellom å sitte og stå er bedre for ryggen enn noe enkelt alternativ alene.",
  "God pustekapasitet henger direkte sammen med evnen til å håndtere press.",
  "Produktivitet handler ikke om å jobbe mer, men om å jobbe smartere – og å hvile.",
  "En enkel skulderøvelse kan fjerne spenning som har bygget seg opp gjennom dagen.",
  "Det å smile – selv frivillig – aktiverer nevrokjemikalier som gir bedre humør.",
  "Korte mentale pauser mellom oppgaver gir hjernen tid til å konsolidere informasjon.",
  "Musikk uten tekst kan øke konsentrasjonen under kognitivt krevende arbeid.",
  "Kontrollert pust, slik som boks-pust, brukes av både toppidrettsutøvere og kirurger for å prestere under press.",
  "En vanlig kilde til ettermiddagstrøtthet er for lite vann – ikke for lite kaffe.",
  "Muskler som ikke brukes, strammer seg – aktive hvilepauser forebygger dette.",
  "Å prioritere bevegelse er ikke egoistisk – det gjør deg til en bedre kollega og leder.",
  "Å ta pauser er en profesjonell ferdighet, ikke en svakhet.",
  "Kroppsholdningen din påvirker tankene dine – rett deg opp og merk forskjellen.",
  "Å avslutte arbeidsdagen med en liten oppsummering reduserer bekymringer om kvelden.",
  "Bevegelse og mental helse henger uløselig sammen – kroppen er ikke adskilt fra sinnet.",
]

const insight = insights[Math.floor(Math.random() * insights.length)]
</script>

<template>
  <section
    class="pill"
    role="button"
    tabindex="0"
    @click="open"
    @keydown="onKeydown"
    aria-label="Åpne KnowZone"
  >
    <div class="dot" aria-hidden="true"></div>

    <div class="text">
      <div class="label">DAGENS INNSIKT</div>
      <div class="quote">{{ insight }}</div>
    </div>

    <div class="chev" aria-hidden="true"></div>
  </section>
</template>

<style scoped>
.pill {
  background: rgba(17, 24, 39, 0.03);
  border-radius: 22px;
  padding: 14px 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: inset 0 0 0 1px rgba(17, 24, 39, 0.04);
  cursor: pointer;
  user-select: none;
  transition: transform 120ms ease;
}

.pill:hover {
  transform: translateY(-1px);
}

.pill:focus-visible {
  outline: 3px solid rgba(99, 102, 241, 0.25);
  outline-offset: 4px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: rgba(17, 24, 39, 0.28);
}

.text {
  flex: 1;
}

.label {
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.12em;
  color: rgba(17, 24, 39, 0.45);
}

.quote {
  margin-top: 4px;
  font-size: 15px;
  font-weight: 800;
  color: rgba(17, 24, 39, 0.78);
  line-height: 1.4;
}

.chev {
  width: 10px;
  height: 10px;
  border-right: 2px solid rgba(17, 24, 39, 0.25);
  border-top: 2px solid rgba(17, 24, 39, 0.25);
  transform: rotate(45deg);
}
</style>
