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
 * Die ganze Konfiguration der Infobox in einem Attribut: `infobox-config`.
 *
 * Bis 0.1.0-rc.5 lag sie auf vier Feldern des Staffbase-Dialogs. Seither
 * pflegt das Fenster „Infobox bearbeiten“ alles und schreibt es hierher.
 *
 * Jeder Schlüssel ist für sich optional, und die Seite mischt je Schlüssel:
 * neuer Wert, sonst das alte Attribut, sonst die Vorgabe
 * ({@link resolveInfobox}). Das hält alte Blöcke unverändert – auch dann,
 * wenn das Fenster ein altes Feld nicht lesen konnte: Auswahlfelder des
 * Content Designers haben oft keinen auslesbaren Wert. Ein solcher Schlüssel
 * bleibt hier weg, bis jemand ihn im Fenster ändert, und bis dahin gilt das
 * alte Attribut.
 */

import { decodePayload, encodePayload } from "@shared/payload";

import {
  DISMISSIBLE_ATTRIBUTE,
  HEADING_ATTRIBUTE,
  INFOBOX_CONFIG_ATTRIBUTE,
  TEXT_ATTRIBUTE,
  VARIANT_ATTRIBUTE,
  readDismissible,
} from "./configuration-schema";
import { INFOBOX_VARIANTS, InfoboxVariant, resolveVariant } from "./infobox-variant";

/** Was `infobox-config` trägt; ein fehlender Schlüssel heißt „das alte Attribut gilt“. */
export interface InfoboxConfig {
  variant?: InfoboxVariant;
  heading?: string;
  text?: string;
  dismissible?: boolean;
}

/** Was die Darstellung bekommt: Variante und Kreuz immer entschieden. */
export interface ResolvedInfobox {
  variant: InfoboxVariant;
  heading?: string;
  text?: string;
  dismissible: boolean;
}

/** Die Attribute am Element, so wie `parseAttributes` sie liefert. */
export type InfoboxAttributes = Partial<Record<string, unknown>>;

const DEFAULT_VARIANT: InfoboxVariant = "default";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const isInfoboxVariant = (raw: unknown): raw is InfoboxVariant =>
  typeof raw === "string" && (INFOBOX_VARIANTS as readonly string[]).includes(raw);

const textOf = (raw: unknown): string | undefined => (typeof raw === "string" ? raw : undefined);

/** Nur ein eindeutiges An oder Aus; alles andere bleibt offen. */
function booleanOf(raw: unknown): boolean | undefined {
  if (raw === true || raw === "true") return true;
  if (raw === false || raw === "false") return false;
  return undefined;
}

/** Baut die Konfiguration in fester Reihenfolge; offene Schlüssel fehlen ganz. */
function configOf(variant: unknown, heading: unknown, text: unknown, dismissible: unknown): InfoboxConfig {
  const entries: [keyof InfoboxConfig, unknown][] = [
    ["variant", isInfoboxVariant(variant) ? variant : undefined],
    ["heading", textOf(heading)],
    ["text", textOf(text)],
    ["dismissible", booleanOf(dismissible)],
  ];
  return Object.fromEntries(entries.filter(([, value]) => value !== undefined)) as InfoboxConfig;
}

function parseJson(text: string): unknown {
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

/**
 * Liest `infobox-config`; `null`, wenn dort nichts Brauchbares steht – leer,
 * kaputt kodiert oder kein Objekt. Dann gelten die alten Attribute.
 */
export function readInfoboxConfig(raw: unknown): InfoboxConfig | null {
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (trimmed === "") return null;
  const value = parseJson(decodePayload(trimmed) ?? trimmed);
  if (!isRecord(value)) return null;
  return configOf(value.variant, value.heading, value.text, value.dismissible);
}

/**
 * Schreibt `infobox-config`, kodiert wie die übrigen JSON-Attribute
 * (`@shared/payload`): Überschrift und Text dürfen Anführungszeichen tragen.
 * Ohne einen gesetzten Schlüssel bleibt das Attribut leer.
 */
export function serializeInfoboxConfig(config: InfoboxConfig): string {
  const clean = configOf(config.variant, config.heading, config.text, config.dismissible);
  return Object.keys(clean).length === 0 ? "" : encodePayload(JSON.stringify(clean));
}

/**
 * Die lesbaren Werte der alten Dialogfelder als Ausgangsstand des Fensters.
 * Was sich nicht eindeutig lesen lässt, fehlt – dann gilt weiter das alte
 * Attribut, statt dass eine Vorgabe es still überschreibt.
 */
export function configFromLegacy(values: Readonly<Record<string, string>>): InfoboxConfig {
  return configOf(
    values[VARIANT_ATTRIBUTE],
    values[HEADING_ATTRIBUTE],
    values[TEXT_ATTRIBUTE],
    values[DISMISSIBLE_ATTRIBUTE],
  );
}

/**
 * Was die Seite zeigt: je Schlüssel `infobox-config`, sonst das alte
 * Attribut, sonst die Vorgabe. Ohne `infobox-config` ist das genau die
 * Lesart bis 0.1.0-rc.5 – samt Warnung über eine unbekannte Variante, die
 * aber nur kommt, wenn das alte Attribut auch gilt.
 */
export function resolveInfobox(attrs: InfoboxAttributes): ResolvedInfobox {
  const config = readInfoboxConfig(attrs[INFOBOX_CONFIG_ATTRIBUTE]) ?? {};
  return {
    variant: config.variant ?? resolveVariant(attrs[VARIANT_ATTRIBUTE]),
    heading: config.heading ?? textOf(attrs[HEADING_ATTRIBUTE]),
    text: config.text ?? textOf(attrs[TEXT_ATTRIBUTE]),
    dismissible: config.dismissible ?? readDismissible(attrs[DISMISSIBLE_ATTRIBUTE]),
  };
}

/** Der Entwurf für die Vorschau: Offenes mit den Vorgaben gefüllt. */
export function resolveDraft(config: InfoboxConfig): ResolvedInfobox {
  return {
    variant: config.variant ?? DEFAULT_VARIANT,
    heading: config.heading,
    text: config.text,
    dismissible: config.dismissible ?? true,
  };
}
