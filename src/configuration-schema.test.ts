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

import { JSONSchema7, JSONSchema7Definition } from "json-schema";

import { INFOBOX_VARIANTS } from "./infobox-variant";
import {
  ALL_ATTRIBUTES,
  DISMISSIBLE_ATTRIBUTE,
  HEADING_ATTRIBUTE,
  INFOBOX_CONFIG_ATTRIBUTE,
  LEGACY_ATTRIBUTES,
  TEXT_ATTRIBUTE,
  VARIANT_ATTRIBUTE,
  configurationSchema,
  readDismissible,
  uiSchema,
} from "./configuration-schema";

describe("configurationSchema", () => {
  it("fuehrt das neue Attribut zuerst und die vier alten dahinter", () => {
    expect(ALL_ATTRIBUTES).toEqual([
      INFOBOX_CONFIG_ATTRIBUTE,
      VARIANT_ATTRIBUTE,
      HEADING_ATTRIBUTE,
      TEXT_ATTRIBUTE,
      DISMISSIBLE_ATTRIBUTE,
    ]);
    expect(ALL_ATTRIBUTES.slice(1)).toEqual([...LEGACY_ATTRIBUTES]);
  });

  // `root_<Attribut>` ist widgetuebergreifend; `config` hat schon das Hotspot-Widget.
  it("traegt den Namen des Widgets im neuen Attribut", () => {
    expect(INFOBOX_CONFIG_ATTRIBUTE).toBe("infobox-config");
    expect((configurationSchema.properties ?? {})[INFOBOX_CONFIG_ATTRIBUTE]).toMatchObject({ type: "string", default: "" });
  });

  it("bietet die Varianten in derselben Reihenfolge wie der Code an", () => {
    const variant = (configurationSchema.properties ?? {})[VARIANT_ATTRIBUTE] as JSONSchema7;
    const offered = (variant.oneOf ?? []).map((entry) => (entry as JSONSchema7).const);
    expect(offered).toEqual([...INFOBOX_VARIANTS]);
  });

  it("gibt jeder Variante einen Klartextnamen", () => {
    const variant = (configurationSchema.properties ?? {})[VARIANT_ATTRIBUTE] as JSONSchema7;
    const titles = (variant.oneOf ?? []).map((entry: JSONSchema7Definition) => (entry as JSONSchema7).title);
    expect(titles).toEqual(["Neutral", "Information", "Erläuterung", "Erfolg", "Warnung", "Fehler"]);
  });

  it("steht neutral und schliessbar in der Vorgabe", () => {
    const properties = configurationSchema.properties ?? {};
    expect(properties[VARIANT_ATTRIBUTE]).toMatchObject({ type: "string", default: "default" });
    expect(properties[DISMISSIBLE_ATTRIBUTE]).toMatchObject({ type: "boolean", default: true });
  });

  it("gibt dem Textkoerper ein mehrzeiliges Feld", () => {
    expect(uiSchema[TEXT_ATTRIBUTE]).toMatchObject({ "ui:widget": "textarea" });
  });
});

describe("readDismissible", () => {
  it("steht an, solange niemand ausdruecklich abschaltet", () => {
    expect(readDismissible(undefined)).toBe(true);
    expect(readDismissible(null)).toBe(true);
    expect(readDismissible("")).toBe(true);
    expect(readDismissible(true)).toBe(true);
    expect(readDismissible("true")).toBe(true);
  });

  it("liest ein echtes Aus aus Wahrheitswert und Zeichenkette", () => {
    expect(readDismissible(false)).toBe(false);
    expect(readDismissible("false")).toBe(false);
  });
});
