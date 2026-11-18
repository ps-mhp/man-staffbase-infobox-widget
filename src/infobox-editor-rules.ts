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
 * Prüfung und Status des Fensters „Infobox bearbeiten“.
 *
 * Liegt im Seitenbündel, nicht beim nachgeladenen Editor: der Rahmen braucht
 * beides schon, bevor der Editor da ist. Darum nur reine Funktionen, nichts
 * aus `@man/config-ui` außer Typen.
 */

import type { ValidationIssue } from "@man/config-ui/shell/shell-context";

import type { InfoboxConfig } from "./infobox-config";

export const CONTENT_ISSUE = "content";

/** Im Status des Kopfes. */
export const CONTENT_ISSUE_MESSAGE = "Überschrift oder Text angeben";

/** Unter dem Textfeld, mit dem Satz, der die Sorge nimmt. */
export const CONTENT_ISSUE_DETAIL = "Überschrift oder Text angeben – eines von beiden reicht.";

const blank = (value: string | undefined): boolean => value !== undefined && value.trim() === "";

/**
 * Ohne Überschrift und ohne Text gibt die Infobox nichts aus – eine leere
 * Box ist kein Hinweis. Geprüft wird nur, was das Fenster kennt: ein Feld,
 * das sich im alten Dialog nicht lesen ließ, gilt weiter aus dem alten
 * Attribut und hält die Prüfung nicht auf.
 */
export function validateInfoboxConfig(config: InfoboxConfig): ValidationIssue[] {
  return blank(config.heading) && blank(config.text) ? [{ id: CONTENT_ISSUE, message: CONTENT_ISSUE_MESSAGE }] : [];
}

/** Die Namen im Status, in der Reihenfolge des Formulars. */
const PARTS: readonly [keyof InfoboxConfig, string][] = [
  ["heading", "Überschrift"],
  ["text", "Text"],
  ["variant", "Variante"],
  ["dismissible", "Verhalten"],
];

function joinGerman(parts: readonly string[]): string {
  if (parts.length <= 1) return parts.join("");
  return `${parts.slice(0, -1).join(", ")} und ${parts[parts.length - 1]}`;
}

/**
 * Was sich gegenüber dem übernommenen Stand geändert hat, etwa „Text
 * geändert“ oder „Überschrift, Variante und Verhalten geändert“. Den Satz
 * „– nicht übernommen“ hängt der Rahmen an.
 */
export function infoboxChangesStatus(draft: InfoboxConfig, saved: InfoboxConfig): string | undefined {
  const changed = PARTS.filter(([key]) => draft[key] !== saved[key]).map(([, label]) => label);
  return changed.length === 0 ? undefined : `${joinGerman(changed)} geändert`;
}
