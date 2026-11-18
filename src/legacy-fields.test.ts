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

import { readLegacyFromDialog, startHiddenFields } from "./legacy-fields";

const OWN = "infobox-config";
const LEGACY = ["variant", "heading", "text", "dismissible"];

function row(key: string, value = ""): string {
  return `<div data-row="${key}"><label for="root_${key}">${key}</label><input id="root_${key}" value="${value}"><p>Hilfe</p></div>`;
}

const rowOf = (selector: string): HTMLElement | null => document.querySelector<HTMLElement>(selector);

afterEach(() => {
  document.body.innerHTML = "";
});

describe("startHiddenFields", () => {
  it("blendet die alten Felder im eigenen Dialog ganz aus und lässt das eigene stehen", () => {
    document.body.innerHTML = `<form>${row(OWN)}${LEGACY.map((key) => row(key)).join("")}</form>`;

    const stop = startHiddenFields(LEGACY, OWN);

    for (const key of LEGACY) expect(rowOf(`[data-row="${key}"]`)?.style.display).toBe("none");
    expect(rowOf(`[data-row="${OWN}"]`)?.style.display).toBe("");
    stop();
  });

  it("erfasst Felder, die erst später erscheinen, und gibt sie beim Aufhören wieder frei", async () => {
    document.body.innerHTML = "<form></form>";
    const stop = startHiddenFields(LEGACY, OWN);

    document.querySelector("form")?.insertAdjacentHTML("beforeend", `${row(OWN)}${row("heading")}`);
    await Promise.resolve();

    const heading = rowOf('[data-row="heading"]');
    expect(heading?.style.display).toBe("none");
    stop();
    expect(heading?.style.display).toBe("");
  });

  // `text` und `heading` sind Namen, die auch andere Widgets führen können.
  it("lässt den Dialog eines anderen Widgets mit gleichen Feldnamen unberührt", () => {
    document.body.innerHTML =
      `<form id="foreign"><div data-wrap>${row("config")}${row("text")}${row("heading")}</div></form>` +
      `<form id="infobox">${row(OWN)}${row("text")}</form>`;

    const stop = startHiddenFields(LEGACY, OWN);

    expect(rowOf('#foreign [data-row="text"]')?.style.display).toBe("");
    expect(rowOf('#foreign [data-row="heading"]')?.style.display).toBe("");
    expect(rowOf("#foreign [data-wrap]")?.style.display).toBe("");
    expect(rowOf('#infobox [data-row="text"]')?.style.display).toBe("none");
    stop();
  });

  it("beobachtet nur den übergebenen Teilbaum", () => {
    document.body.innerHTML = `<div id="scope"><form>${row(OWN)}${row("text")}</form></div><form>${row(OWN)}${row("text")}</form>`;

    const stop = startHiddenFields(LEGACY, OWN, document.getElementById("scope")!);

    expect(rowOf('#scope [data-row="text"]')?.style.display).toBe("none");
    expect(rowOf('body > form [data-row="text"]')?.style.display).toBe("");
    stop();
  });
});

describe("readLegacyFromDialog", () => {
  it("liest die alten Felder aus dem eigenen Dialog, nicht aus einem fremden", () => {
    document.body.innerHTML =
      `<form id="foreign">${row("config")}${row("text", "Fremd")}</form>` +
      `<form id="infobox">${row(OWN)}${row("heading", "Achtung")}${row("text", "Zu")}</form>`;

    expect(readLegacyFromDialog()).toEqual({ heading: "Achtung", text: "Zu" });
  });

  it("liefert nichts ohne eigenen Dialog", () => {
    document.body.innerHTML = `<form>${row("text", "Zu")}</form>`;

    expect(readLegacyFromDialog()).toEqual({});
  });

  // Im Content Designer sind Auswahlfelder keine echten `<select>`: was dort
  // `root_<key>` trägt, hat keinen lesbaren Wert. Dann bleibt der Schlüssel offen.
  it("überspringt Felder ohne lesbaren Wert", () => {
    document.body.innerHTML = `<form>${row(OWN)}<div id="root_variant" role="combobox">Warnung</div></form>`;

    expect(readLegacyFromDialog()).toEqual({});
  });

  // RJSF schreibt die Stelle der Option, nicht ihren Wert.
  it("übersetzt die Stelle einer Option in ihren Wert", () => {
    document.body.innerHTML =
      `<form>${row(OWN)}<select id="root_variant"><option value="0">Neutral</option>` +
      `<option value="4" selected>Warnung</option></select></form>`;

    expect(readLegacyFromDialog()).toEqual({ variant: "warning" });
  });

  // MUI legt die Kennung auf ein `div`, der Wert steht im versteckten Feld mit dem Namen daneben.
  it("liest eine MUI-Auswahl über ihr verstecktes Eingabefeld", () => {
    document.body.innerHTML =
      `<form>${row(OWN)}<div class="row"><div id="root_variant" role="combobox">Erfolg</div>` +
      `<input aria-hidden="true" tabindex="-1" id="_r_8_" name="root_variant" value="3"></div></form>`;

    expect(readLegacyFromDialog()).toEqual({ variant: "success" });
  });

  it("liest den Stand eines Kästchens, nicht seinen Wert", () => {
    document.body.innerHTML = `<form>${row(OWN)}<input type="checkbox" id="root_dismissible" value="on"></form>`;
    expect(readLegacyFromDialog()).toEqual({ dismissible: "false" });

    document.querySelector<HTMLInputElement>("#root_dismissible")!.checked = true;
    expect(readLegacyFromDialog()).toEqual({ dismissible: "true" });
  });

  it("liest mehrzeiligen Text aus einem Textbereich", () => {
    document.body.innerHTML = `<form>${row(OWN)}<textarea id="root_text">Zeile 1\nZeile 2</textarea></form>`;

    expect(readLegacyFromDialog()).toEqual({ text: "Zeile 1\nZeile 2" });
  });
});
