// src/utils/smartBoost.ts

export type Context = "felt" | "kontor" | "hjemme"

export function smartBoostV1(capacityScore: number, context: Context) {
  // Tolkning: lav < 45, stabil 45-69, høy >= 70
  const band = capacityScore < 45 ? "low" : capacityScore < 70 ? "stable" : "high"

  const suggestions =
    context === "felt"
      ? band === "low"
        ? ["Drikk vann (2–3 store slurker)", "3 rolige pust (20–30 sek)", "Rist løs skuldre 20 sek"]
        : band === "stable"
          ? ["Hent litt vann", "Skuldre bak + 5 dype pust", "30 sek lett gange"]
          : ["Hold flyten: 1 min rolig gange", "2 dype pust", "Kjapp nakkestrekk 20 sek"]
      : context === "kontor"
        ? band === "low"
          ? ["Reis deg + 30 sek gange", "Nakke/øvre rygg strekk 30 sek", "3 rolige pust"]
          : band === "stable"
            ? ["Nakke strekk 20 sek", "Skuldre ned/tilbake 10 reps", "Drikk vann"]
            : ["2 min walk", "10 dype pust", "Strekk hoftebøyer 30 sek"]
        : band === "low"
          ? ["2 min mobilitet (hofter/ankler)", "Drikk vann", "3 rolige pust"]
          : band === "stable"
            ? ["30 sek mobilitet", "1 min rolig pust", "Kjapp strekk legg/hamstring"]
            : ["Hold trøkket: 2 min mobilitet", "10 dype pust", "Kort tur ute"]

  const title =
    band === "low"
      ? "Lav kapasitet i dag"
      : band === "stable"
        ? "Stabil kapasitet i dag"
        : "Høy kapasitet i dag"

  const message =
    band === "low"
      ? "Kroppen signaliserer at du bør holde det enkelt."
      : band === "stable"
        ? "Du virker stabil. Små ting kan gi litt ekstra."
        : "Du er i flyt. Hold det jevnt og smart."

  return { band, title, message, suggestions }
}