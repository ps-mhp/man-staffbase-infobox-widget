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

import { INFOBOX_VARIANTS, resolveVariant } from "./infobox-variant";

describe("resolveVariant", () => {
  let warn: jest.SpyInstance;

  beforeEach(() => {
    warn = jest.spyOn(console, "warn").mockImplementation(() => undefined);
  });

  afterEach(() => {
    warn.mockRestore();
  });

  it("fuehrt genau die fuenf Varianten des Schemas", () => {
    expect([...INFOBOX_VARIANTS]).toEqual(["default", "info", "success", "warning", "error"]);
  });

  it("gibt jede bekannte Variante unveraendert zurueck", () => {
    for (const variant of INFOBOX_VARIANTS) {
      expect(resolveVariant(variant)).toBe(variant);
    }
    expect(warn).not.toHaveBeenCalled();
  });

  it("normalisiert Schreibweise und Leerraum", () => {
    expect(resolveVariant("INFO")).toBe("info");
    expect(resolveVariant(" info ")).toBe("info");
    expect(resolveVariant("Warning")).toBe("warning");
    expect(warn).not.toHaveBeenCalled();
  });

  it("nimmt ein fehlendes Attribut als Vorgabe, ohne zu warnen", () => {
    expect(resolveVariant(undefined)).toBe("default");
    expect(resolveVariant(null)).toBe("default");
    expect(resolveVariant("")).toBe("default");
    expect(resolveVariant("   ")).toBe("default");
    expect(warn).not.toHaveBeenCalled();
  });

  it("faellt bei unbekanntem Wert auf die Vorgabe zurueck und warnt einmal", () => {
    expect(resolveVariant("danger")).toBe("default");
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toContain("infobox-widget");
  });

  it("behandelt einen Wert, der keine Zeichenkette ist, als unbekannt", () => {
    expect(resolveVariant(42)).toBe("default");
    expect(warn).toHaveBeenCalledTimes(1);
  });
});
