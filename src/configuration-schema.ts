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

import { UiSchema } from "@rjsf/utils";
import { JSONSchema7 } from "json-schema";

import { INFOBOX_VARIANTS, InfoboxVariant } from "./infobox-variant";

// Die Namen, unter denen die Konfiguration steht. Jeder steht an drei Stellen
// gleich: als Schlüssel im Schema, als Attribut, das der Wirtsseite gemeldet
// wird, und in `widgets.json`. Die Wirtsseite speichert einen Wert unter
// seinem Schlüssel und liest ihn unter dem gemeldeten Attribut zurück; ein
// Attribut, das sie nicht kennt, verwirft sie.

/**
 * Die ganze Konfiguration in einem Feld – siehe `infobox-config.ts`. Der
 * Name trägt das Widget: Editoren hängen sich über `root_<Attribut>` ein,
 * und das ist widgetübergreifend.
 */
export const INFOBOX_CONFIG_ATTRIBUTE = "infobox-config";
export const VARIANT_ATTRIBUTE = "variant";
export const HEADING_ATTRIBUTE = "heading";
export const TEXT_ATTRIBUTE = "text";
export const DISMISSIBLE_ATTRIBUTE = "dismissible";

/**
 * Die einzelnen Felder bis 0.1.0-rc.5. Sie bleiben im Schema, damit der
 * Dialog ihre Werte weiter führt: das Fenster „Infobox bearbeiten“ übernimmt
 * sie beim ersten Öffnen, und solange `infobox-config` einen Schlüssel nicht
 * trägt, gilt für die Seite das alte Feld. Zu sehen sind sie im eigenen
 * Dialog nicht mehr (`legacy-fields.ts`).
 */
export const LEGACY_ATTRIBUTES = [
  VARIANT_ATTRIBUTE,
  HEADING_ATTRIBUTE,
  TEXT_ATTRIBUTE,
  DISMISSIBLE_ATTRIBUTE,
] as const;

/** Die Klartextnamen der Varianten – im Dialog, im Fenster und in der Doku dieselben. */
export const VARIANT_LABELS: Readonly<Record<InfoboxVariant, string>> = {
  default: "Neutral",
  info: "Information",
  explanation: "Erläuterung",
  success: "Erfolg",
  warning: "Warnung",
  error: "Fehler",
};

/**
 * Das Schema des Konfigurationsdialogs.
 *
 * Zu sehen ist nur `infobox-config`: an seine Stelle tritt der Knopf zum
 * Fenster „Infobox bearbeiten“ (`infobox-dialog.tsx`). Die übrigen Felder
 * sind die älterer Fassungen.
 *
 * Die Auswahl steht als `oneOf` mit `const` und `title` — das Muster von
 * Formular-, Datei- und Hotspot-Widget. `enumNames` ist in RJSF abgekuendigt
 * und wird vom Dialog der Wirtsseite nicht zuverlaessig uebernommen.
 *
 * @see https://rjsf-team.github.io/react-jsonschema-form/docs/
 */
export const configurationSchema: JSONSchema7 = {
  properties: {
    [INFOBOX_CONFIG_ATTRIBUTE]: {
      type: "string",
      title: "Infobox",
      default: "",
    },
    [VARIANT_ATTRIBUTE]: {
      type: "string",
      title: "Variante",
      default: "default",
      oneOf: INFOBOX_VARIANTS.map((variant) => ({ const: variant, title: VARIANT_LABELS[variant] })),
    },
    [HEADING_ATTRIBUTE]: {
      type: "string",
      title: "Überschrift",
    },
    [TEXT_ATTRIBUTE]: {
      type: "string",
      title: "Text",
    },
    [DISMISSIBLE_ATTRIBUTE]: {
      type: "boolean",
      title: "Schließen erlauben",
      default: true,
    },
  },
};

/** Alle Attribute, in der Reihenfolge des Schemas: das neue zuerst, die alten dahinter. */
export const ALL_ATTRIBUTES: string[] = Object.keys(configurationSchema.properties ?? {});

/**
 * Die Hilfen der alten Felder bleiben: wird das Ausblenden einmal nicht
 * greifen, steht der Dialog wenigstens so da wie bisher.
 *
 * @see https://rjsf-team.github.io/react-jsonschema-form/docs/api-reference/uiSchema
 */
export const uiSchema: UiSchema = {
  [INFOBOX_CONFIG_ATTRIBUTE]: {
    "ui:help":
      "Überschrift, Text, Variante und Schließen werden im Fenster „Infobox bearbeiten“ gepflegt; " +
      "das Textfeld dahinter ist die Rohfassung.",
  },
  [VARIANT_ATTRIBUTE]: {
    "ui:help": "Die Farbe des Kastens. Sie sagt dem Leser, wie dringend die Sache ist.",
  },
  [HEADING_ATTRIBUTE]: {
    "ui:help": "Die fette erste Zeile. Darf leer bleiben — dann steht nur der Text im Kasten.",
  },
  [TEXT_ATTRIBUTE]: {
    "ui:widget": "textarea",
    "ui:help": "Der Text unter der Überschrift. Zeilenumbrüche bleiben erhalten.",
  },
  [DISMISSIBLE_ATTRIBUTE]: {
    "ui:help":
      "Das Kreuz rechts oben. Der Kasten bleibt nur bis zum nächsten Seitenaufruf weg. " +
      "Für eine Pflichtmitteilung hier abschalten.",
  },
};

/**
 * Das Kreuz steht, solange es niemand ausdruecklich abschaltet. Staffbase
 * liefert Wahrheitswerte je nach Weg als `boolean` oder als Zeichenkette;
 * nur ein echtes „aus" zaehlt, damit ein fehlendes Attribut die Vorgabe
 * nicht kippt.
 */
export function readDismissible(raw: unknown): boolean {
  return !(raw === false || raw === "false");
}
