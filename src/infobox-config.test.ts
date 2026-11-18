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

import { encodePayload } from "@shared/payload";

import { readDismissible } from "./configuration-schema";
import {
  configFromLegacy,
  readInfoboxConfig,
  resolveDraft,
  resolveInfobox,
  serializeInfoboxConfig,
} from "./infobox-config";
import { resetVariantWarnings, resolveVariant } from "./infobox-variant";

afterEach(() => {
  jest.restoreAllMocks();
  resetVariantWarnings();
});

describe("readInfoboxConfig", () => {
  it("liest kodiertes und rohes JSON", () => {
    const json = JSON.stringify({ variant: "warning", heading: "Achtung", text: "Zu", dismissible: false });
    const expected = { variant: "warning", heading: "Achtung", text: "Zu", dismissible: false };

    expect(readInfoboxConfig(encodePayload(json))).toEqual(expected);
    expect(readInfoboxConfig(json)).toEqual(expected);
  });

  it("liefert null für leer, kaputt oder kein Objekt", () => {
    expect(readInfoboxConfig("")).toBeNull();
    expect(readInfoboxConfig("   ")).toBeNull();
    expect(readInfoboxConfig("{kaputt")).toBeNull();
    expect(readInfoboxConfig("b64:!!!")).toBeNull();
    expect(readInfoboxConfig("[1,2]")).toBeNull();
    expect(readInfoboxConfig(undefined)).toBeNull();
    expect(readInfoboxConfig(42)).toBeNull();
  });

  it("lässt Schlüssel weg, die nicht passen – dann gilt das alte Attribut", () => {
    const raw = JSON.stringify({ variant: "lila", heading: 3, text: "Zu", dismissible: "vielleicht" });
    expect(readInfoboxConfig(raw)).toEqual({ text: "Zu" });
  });

  it("nimmt einen leeren Text als gesetzt, nicht als fehlend", () => {
    expect(readInfoboxConfig(JSON.stringify({ heading: "" }))).toEqual({ heading: "" });
  });
});

describe("serializeInfoboxConfig", () => {
  it("schreibt kodiert und in fester Reihenfolge, ohne leere Schlüssel", () => {
    const raw = serializeInfoboxConfig({ dismissible: true, text: "Zu", variant: "info" });

    expect(raw.startsWith("b64:")).toBe(true);
    expect(readInfoboxConfig(raw)).toEqual({ variant: "info", text: "Zu", dismissible: true });
    expect(raw).toBe(serializeInfoboxConfig({ variant: "info", text: "Zu", dismissible: true }));
  });

  it("schreibt nichts, solange nichts gesetzt ist", () => {
    expect(serializeInfoboxConfig({})).toBe("");
    expect(serializeInfoboxConfig({ heading: undefined })).toBe("");
  });

  it("übersteht Anführungszeichen und Umlaute im Text", () => {
    const config = { heading: 'Die „Kantine" schließt', text: "Zeile 1\nZeile 2 <b>" };
    expect(readInfoboxConfig(serializeInfoboxConfig(config))).toEqual(config);
  });
});

describe("resolveInfobox", () => {
  /** Was die Seite bis 0.1.0-rc.5 aus den einzelnen Attributen machte. */
  const before = (attrs: Record<string, unknown>) => ({
    variant: resolveVariant(attrs.variant),
    heading: typeof attrs.heading === "string" ? attrs.heading : undefined,
    text: typeof attrs.text === "string" ? attrs.text : undefined,
    dismissible: readDismissible(attrs.dismissible),
  });

  it.each([
    {},
    { variant: "warning", heading: "Achtung", text: "Zu", dismissible: "false" },
    { variant: "ERROR ", heading: "", dismissible: false },
    { variant: "info", text: "Nur Text", dismissible: true },
    { heading: 3, text: null, dismissible: "true" },
  ])("zeigt einen alten Block ohne infobox-config wie bisher: %j", (attrs) => {
    expect(resolveInfobox(attrs)).toEqual(before(attrs));
  });

  it("nimmt je Schlüssel den neuen Wert, sonst das alte Attribut, sonst die Vorgabe", () => {
    const config = serializeInfoboxConfig({ heading: "Neu", dismissible: false });
    expect(resolveInfobox({ "infobox-config": config, variant: "success", heading: "Alt", text: "Alter Text" })).toEqual({
      variant: "success",
      heading: "Neu",
      text: "Alter Text",
      dismissible: false,
    });
    expect(resolveInfobox({ "infobox-config": serializeInfoboxConfig({ text: "Nur neu" }) })).toEqual({
      variant: "default",
      heading: undefined,
      text: "Nur neu",
      dismissible: true,
    });
  });

  it("lässt einen geleerten Text leer, statt auf das alte Attribut zurückzufallen", () => {
    const config = serializeInfoboxConfig({ heading: "", text: "Neu" });
    expect(resolveInfobox({ "infobox-config": config, heading: "Alt" }).heading).toBe("");
  });

  it("fällt bei kaputter infobox-config ganz auf die alten Attribute zurück", () => {
    expect(resolveInfobox({ "infobox-config": "{kaputt", variant: "info", heading: "Alt" })).toEqual(
      before({ variant: "info", heading: "Alt" }),
    );
  });

  it("warnt nicht über ein altes Attribut, das der neue Wert verdeckt", () => {
    const warn = jest.spyOn(console, "warn").mockImplementation(() => undefined);
    resolveInfobox({ "infobox-config": serializeInfoboxConfig({ variant: "info" }), variant: "lila" });
    expect(warn).not.toHaveBeenCalled();
  });
});

describe("configFromLegacy", () => {
  it("übernimmt lesbare Werte der alten Felder", () => {
    expect(configFromLegacy({ variant: "warning", heading: "Achtung", text: "", dismissible: "false" })).toEqual({
      variant: "warning",
      heading: "Achtung",
      text: "",
      dismissible: false,
    });
  });

  it("lässt weg, was sich nicht eindeutig lesen lässt", () => {
    expect(configFromLegacy({ variant: "", dismissible: "on" })).toEqual({});
    expect(configFromLegacy({ variant: "lila" })).toEqual({});
    expect(configFromLegacy({})).toEqual({});
  });
});

describe("resolveDraft", () => {
  it("füllt für die Vorschau, was der Entwurf offenlässt, mit den Vorgaben", () => {
    expect(resolveDraft({})).toEqual({ variant: "default", heading: undefined, text: undefined, dismissible: true });
    expect(resolveDraft({ variant: "error", heading: "A", text: "B", dismissible: false })).toEqual({
      variant: "error",
      heading: "A",
      text: "B",
      dismissible: false,
    });
  });
});
