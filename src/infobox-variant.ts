/*!
 * Copyright 2026, MHP Management und IT-Beratung GmbH and contributors.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Der Elementname, unter dem `index.tsx` den Baustein anmeldet. Liegt hier
 * und nicht in `index.tsx` selbst, weil sowohl `index.tsx` als auch
 * `infobox.tsx` diese Datei bereits einbinden — ein eigener Ort dafuer
 * wuerde nur einen zusaetzlichen Importpfad ohne Nutzen schaffen.
 */
export const INFOBOX_WIDGET_TAG = "infobox-widget";

/**
 * Die Variante steht als Zeichenkette im Attribut `variant`. Diese Datei ist
 * der einzige Ort, an dem aus dieser Zeichenkette eine gueltige Variante
 * wird — die Darstellung bekommt nur noch einen der sechs bekannten Namen
 * und muss nicht mehr pruefen.
 *
 * Die Reihenfolge ist dieselbe wie im Konfigurationsdialog und im
 * Stylesheet; `infobox-variant.test.ts` und `styles.test.ts` wachen darueber.
 */
export const INFOBOX_VARIANTS = [
  "default",
  "info",
  "explanation",
  "success",
  "warning",
  "error",
] as const;

/** Merkt sich je unbekanntem Wert, ob schon gewarnt wurde — nur einmal pro Wert. */
const warnedValues = new Set<string>();

/** Nur fuer Tests: setzt den Merkspeicher bereits gemeldeter Werte zurueck. */
export function resetVariantWarnings(): void {
  warnedValues.clear();
}

export type InfoboxVariant = (typeof INFOBOX_VARIANTS)[number];

/**
 * Liest das Attribut `variant`.
 *
 * @param raw der rohe Attributwert.
 * @returns die Variante; `default`, wenn nichts gesetzt ist oder der Wert
 *   unbekannt ist.
 */
export function resolveVariant(raw: unknown): InfoboxVariant {
  // Ein fehlendes Attribut ist kein Fehler, sondern die Vorgabe — es darf
  // keine Warnung ausloesen.
  if (raw === undefined || raw === null) return "default";

  if (typeof raw === "string") {
    const normalized = raw.trim().toLowerCase();
    if (normalized === "") return "default";
    if ((INFOBOX_VARIANTS as readonly string[]).includes(normalized)) {
      return normalized as InfoboxVariant;
    }
  }

  const key = String(raw);
  if (!warnedValues.has(key)) {
    warnedValues.add(key);
    console.warn(
      `${INFOBOX_WIDGET_TAG}: Unbekannte Variante „${key}". ` +
        `Erlaubt sind ${INFOBOX_VARIANTS.join(", ")}. Es gilt „default".`,
    );
  }
  return "default";
}
