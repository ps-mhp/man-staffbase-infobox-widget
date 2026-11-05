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

export const VARIANT_ATTRIBUTE = "variant";
export const HEADING_ATTRIBUTE = "heading";
export const TEXT_ATTRIBUTE = "text";
export const DISMISSIBLE_ATTRIBUTE = "dismissible";

/**
 * Das Schema des Konfigurationsdialogs.
 *
 * Die Auswahl steht als `oneOf` mit `const` und `title` — das Muster von
 * Formular-, Datei- und Hotspot-Widget. `enumNames` ist in RJSF abgekuendigt
 * und wird vom Dialog der Wirtsseite nicht zuverlaessig uebernommen.
 *
 * @see https://rjsf-team.github.io/react-jsonschema-form/docs/
 */
export const configurationSchema: JSONSchema7 = {
  properties: {
    [VARIANT_ATTRIBUTE]: {
      type: "string",
      title: "Variante",
      default: "default",
      oneOf: [
        { const: "default", title: "Neutral" },
        { const: "info", title: "Information" },
        { const: "explanation", title: "Erläuterung" },
        { const: "success", title: "Erfolg" },
        { const: "warning", title: "Warnung" },
        { const: "error", title: "Fehler" },
      ],
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

/**
 * @see https://rjsf-team.github.io/react-jsonschema-form/docs/api-reference/uiSchema
 */
export const uiSchema: UiSchema = {
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
