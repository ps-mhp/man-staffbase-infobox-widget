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
 * Das Fenster „Infobox bearbeiten“ im gemeinsamen Rahmen von
 * `@man/config-ui`, eingehängt in einen echten RJSF-Dialog: Ausgangsstand aus
 * den alten Feldern, Öffnen und Übernehmen ohne Änderung, erstes Übernehmen
 * nach `infobox-config`, Prüfung, Ausblenden nur im eigenen Dialog,
 * Nachladen des Editors.
 */

import * as React from "react";
import { act, fireEvent, render } from "@testing-library/react";
import Form from "@rjsf/mui";
import validator from "@rjsf/validator-ajv8";

import { modalRoot, settleModal, settleEditor, clickElement } from "@shared/ui/config-modal.testing";
import { configurationSchema } from "./configuration-schema";
import { readInfoboxConfig, resolveInfobox, serializeInfoboxConfig } from "./infobox-config";
import { infoboxEditorShell, startInfoboxDialog } from "./infobox-dialog";

const EDITOR_SELECTOR = '[data-testid="infobox-editor"]';

const mockEditorLoaded = jest.fn();
jest.mock("./infobox-editor", () => {
  mockEditorLoaded();
  return jest.requireActual("./infobox-editor");
});

const fieldValue = (container: HTMLElement): string =>
  container.querySelector<HTMLInputElement>("#infobox #root_infobox-config")!.value;

const inModal = (selector: string): HTMLElement | null => modalRoot()?.querySelector<HTMLElement>(selector) ?? null;

const buttonNamed = (name: string): HTMLElement | null =>
  Array.from(modalRoot()?.querySelectorAll<HTMLElement>('button, [role="radio"], [role="switch"]') ?? []).find(
    (button) => button.textContent?.trim() === name || button.getAttribute("aria-label") === name,
  ) ?? null;

/** Der eigene Dialog neben einem fremden mit gleichen Feldnamen (`text`, `heading`). */
function Dialogs({ formData }: { formData: Record<string, unknown> }): React.ReactElement {
  return (
    <>
      <div id="infobox">
        <Form schema={configurationSchema} validator={validator} formData={formData} />
      </div>
      <form id="foreign">
        <div data-row="text">
          <label htmlFor="root_text">Fremder Text</label>
          <input id="root_text" defaultValue="fremd" />
        </div>
        <div data-row="heading">
          <label htmlFor="root_heading">Fremde Überschrift</label>
          <input id="root_heading" defaultValue="fremd" />
        </div>
      </form>
    </>
  );
}

async function open(formData: Record<string, unknown>): Promise<{ container: HTMLElement; stop: () => void }> {
  const { container } = render(<Dialogs formData={formData} />);
  let stop = (): void => {};
  await act(async () => {
    stop = startInfoboxDialog(container);
  });
  await settleEditor(EDITOR_SELECTOR);
  return { container, stop };
}

const OLD_BLOCK = { variant: "warning", heading: "Wartung", text: "Am Samstag offline.", dismissible: false };

describe("Nachladen", () => {
  // Muss zuerst laufen: einmal geladen, bleibt das Modul im Speicher.
  it("lädt den Editor erst, wenn ein eigener Dialog erscheint", async () => {
    const container = document.createElement("div");
    document.body.append(container);
    const stop = startInfoboxDialog(container);
    await settleModal();

    expect(mockEditorLoaded).not.toHaveBeenCalled();
    await act(async () => stop());
    container.remove();

    const opened = await open({});
    expect(mockEditorLoaded).toHaveBeenCalledTimes(1);
    expect(inModal('[data-testid="infobox-editor"]')).not.toBeNull();
    await act(async () => opened.stop());
  });
});

describe("startInfoboxDialog", () => {
  it("öffnet das Fenster im gemeinsamen Rahmen mit Vorschau-Umschalter", async () => {
    const { stop } = await open({});

    expect(modalRoot()!.textContent).toContain("Infobox");
    expect(modalRoot()!.querySelector("h1")).toHaveTextContent("Infobox bearbeiten");
    expect(inModal('[aria-label="Ansicht"]')).not.toBeNull();

    await act(async () => stop());
  });

  it("blendet die alten Felder nur im eigenen Dialog aus", async () => {
    const { container, stop } = await open(OLD_BLOCK);

    for (const key of ["variant", "heading", "text", "dismissible"]) {
      const field = container.querySelector(`#infobox [id="root_${key}"]`);
      expect(field).not.toBeNull();
      expect(field!.closest<HTMLElement>('[style*="display: none"]')).not.toBeNull();
    }
    expect(container.querySelector<HTMLElement>('#foreign [data-row="text"]')?.style.display).toBe("");
    expect(container.querySelector<HTMLElement>('#foreign [data-row="heading"]')?.style.display).toBe("");
    expect(container.querySelector<HTMLElement>("#foreign")?.style.display).toBe("");

    await act(async () => stop());
    expect(container.querySelector('#infobox [id="root_text"]')!.closest('[style*="display: none"]')).toBeNull();
  });

  it("beginnt mit den alten Feldern, ohne den Block beim bloßen Öffnen zu ändern", async () => {
    const { container, stop } = await open(OLD_BLOCK);

    expect(inModal('[data-testid="infobox-heading"]')).toHaveValue("Wartung");
    expect(inModal('[data-testid="infobox-text"]')).toHaveValue("Am Samstag offline.");
    expect(buttonNamed("Warnung")).toHaveAttribute("aria-checked", "true");
    expect(inModal('[data-testid="infobox-dismissible"]')).toHaveAttribute("aria-checked", "false");
    // Nichts geändert: Übernehmen ist aus, und das Feld bleibt leer.
    expect(inModal('[data-testid="config-shell-apply"]')).toBeDisabled();
    expect(fieldValue(container)).toBe("");

    await act(async () => stop());
  });

  it("schreibt beim ersten Übernehmen nach infobox-config, und die Seite zeigt dasselbe plus die Änderung", async () => {
    const { container, stop } = await open(OLD_BLOCK);

    const text = inModal('[data-testid="infobox-text"]') as HTMLTextAreaElement;
    await act(async () => {
      fireEvent.change(text, { target: { value: "Am Sonntag auch." } });
    });
    expect(inModal('[role="status"]')).toHaveTextContent("Text geändert");
    await clickElement(inModal('[data-testid="config-shell-apply"]'));

    const raw = fieldValue(container);
    expect(readInfoboxConfig(raw)).toEqual({
      variant: "warning",
      heading: "Wartung",
      text: "Am Sonntag auch.",
      dismissible: false,
    });
    // Die alten Felder bleiben, wie sie sind; je Schlüssel gilt jetzt infobox-config.
    expect(container.querySelector<HTMLInputElement>('#infobox [id="root_heading"]')!.value).toBe("Wartung");
    expect(resolveInfobox({ ...OLD_BLOCK, "infobox-config": raw })).toEqual({
      variant: "warning",
      heading: "Wartung",
      text: "Am Sonntag auch.",
      dismissible: false,
    });

    await act(async () => stop());
  });

  it("nimmt eine vorhandene infobox-config vor den alten Feldern", async () => {
    const config = serializeInfoboxConfig({ heading: "Neu", variant: "success" });
    const { stop } = await open({ ...OLD_BLOCK, "infobox-config": config });

    expect(inModal('[data-testid="infobox-heading"]')).toHaveValue("Neu");
    // Text trägt infobox-config nicht: das alte Feld füllt ihn.
    expect(inModal('[data-testid="infobox-text"]')).toHaveValue("Am Samstag offline.");
    expect(buttonNamed("Erfolg")).toHaveAttribute("aria-checked", "true");

    await act(async () => stop());
  });

  it("übernimmt keine leere Box und nennt den Grund im Status und am Feld", async () => {
    const { container, stop } = await open({ heading: "Wartung" });

    const heading = inModal('[data-testid="infobox-heading"]') as HTMLInputElement;
    await act(async () => {
      fireEvent.change(heading, { target: { value: "" } });
    });
    await clickElement(inModal('[data-testid="config-shell-apply"]'));

    expect(fieldValue(container)).toBe("");
    expect(inModal('[role="status"]')).toHaveTextContent("Überschrift oder Text angeben");
    expect(inModal('[role="alert"]')).toHaveTextContent("eines von beiden reicht");
    expect(heading).toHaveAttribute("aria-invalid", "true");

    await act(async () => stop());
  });

  it("zeigt in der Vorschau den Entwurf als echte Infobox", async () => {
    const { stop } = await open(OLD_BLOCK);

    await clickElement(buttonNamed("Desktop"));
    await settleModal();

    const preview = inModal('[data-testid="infobox-preview"]');
    expect(preview).toHaveAttribute("inert");
    expect(preview?.querySelector(".man-infobox--warning")).toHaveTextContent("Am Samstag offline.");
    expect(inModal('[data-testid="infobox-inspector"]')).not.toBeNull();

    await act(async () => stop());
  });
});

describe("infoboxEditorShell", () => {
  it("erklärt in der Hilfe Inhalt, Varianten, Schließen und eine ungelesene Variante", () => {
    const { container } = render(<>{infoboxEditorShell.help}</>);

    expect(container).toHaveTextContent("Eines von beiden reicht");
    expect(container).toHaveTextContent("Erläuterung");
    expect(container).toHaveTextContent("Schließen erlauben");
    expect(container).toHaveTextContent("keine Pill gewählt");
  });

  it("bietet die Vorschau an", () => {
    expect(infoboxEditorShell).toMatchObject({ widgetName: "Infobox", title: "Infobox bearbeiten", preview: true });
  });
});
