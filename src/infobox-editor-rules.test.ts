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

import { CONTENT_ISSUE, CONTENT_ISSUE_MESSAGE, infoboxChangesStatus, validateInfoboxConfig } from "./infobox-editor-rules";

describe("validateInfoboxConfig", () => {
  it("verlangt Überschrift oder Text, wenn beide leer sind", () => {
    expect(validateInfoboxConfig({ heading: "", text: "  " })).toEqual([
      { id: CONTENT_ISSUE, message: CONTENT_ISSUE_MESSAGE },
    ]);
  });

  it("ist mit einem von beiden zufrieden", () => {
    expect(validateInfoboxConfig({ heading: "Achtung", text: "" })).toEqual([]);
    expect(validateInfoboxConfig({ heading: "", text: "Die Kantine bleibt zu." })).toEqual([]);
  });

  // Ein Feld, das sich im alten Dialog nicht lesen ließ, gilt weiter aus dem
  // alten Attribut – womöglich mit Inhalt. Es hält die Prüfung nicht auf.
  it("hält mit einem ungelesenen Feld nicht auf", () => {
    expect(validateInfoboxConfig({ text: "" })).toEqual([]);
    expect(validateInfoboxConfig({})).toEqual([]);
  });
});

describe("infoboxChangesStatus", () => {
  const saved = { heading: "Achtung", text: "Zu", variant: "info" as const, dismissible: true };

  it("nennt, was sich geändert hat, in der Reihenfolge des Formulars", () => {
    expect(infoboxChangesStatus({ ...saved, text: "Offen" }, saved)).toBe("Text geändert");
    expect(infoboxChangesStatus({ ...saved, dismissible: false, heading: "Neu", variant: "error" }, saved)).toBe(
      "Überschrift, Variante und Verhalten geändert",
    );
  });

  it("sagt nichts ohne Änderung", () => {
    expect(infoboxChangesStatus({ ...saved }, saved)).toBeUndefined();
  });
});
