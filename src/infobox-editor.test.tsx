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
 * Der Rumpf des Fensters „Infobox bearbeiten“ ohne den Rahmen: Abschnitte
 * wie im Screen, Pills mit Farbtupfer, Schalterzeile, Fehler an beiden
 * Feldern, offene Schlüssel und der Wechsel zwischen Editor und Vorschau.
 */

import * as React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConfigShellProvider, ConfigView } from "@man/config-ui/shell/shell-context";

import type { InfoboxConfig } from "./infobox-config";
import { InfoboxEditor } from "./infobox-editor";
import { CONTENT_ISSUE_DETAIL } from "./infobox-editor-rules";
import { UNREAD_HINT, VARIANT_UNREAD_HINT } from "./infobox-form";

const FILLED: InfoboxConfig = { heading: "Wartung", text: "Am Samstag offline.", variant: "warning", dismissible: true };

interface HarnessProps {
  initial: InfoboxConfig;
  view?: ConfigView;
  issuesVisible?: boolean;
  onChange?: (value: InfoboxConfig) => void;
}

/** Hält den Entwurf wie der Rahmen: der Editor ist gesteuert. */
function Harness({ initial, view = "editor", issuesVisible = false, onChange }: HarnessProps): React.ReactElement {
  const [value, setValue] = React.useState(initial);
  return (
    <ConfigShellProvider value={{ view, setView: () => undefined, preview: true, issuesVisible }}>
      <InfoboxEditor
        value={value}
        onChange={(next) => {
          onChange?.(next);
          setValue(next);
        }}
      />
    </ConfigShellProvider>
  );
}

function renderEditor(props: HarnessProps): { onChange: jest.Mock } {
  const onChange = jest.fn();
  render(<Harness {...props} onChange={onChange} />);
  return { onChange };
}

const variantGroup = (): HTMLElement => screen.getByRole("radiogroup", { name: "Variante" });
const pill = (name: string): HTMLElement => within(variantGroup()).getByRole("radio", { name });

describe("InfoboxEditor – Editor-Ansicht", () => {
  it("gliedert in Inhalt, Gestaltung und Verhalten, ohne Inspektor daneben", () => {
    renderEditor({ initial: FILLED });

    const editor = screen.getByTestId("infobox-editor");
    expect(within(editor).getAllByRole("heading", { level: 3 }).map((h) => h.textContent)).toEqual([
      "Inhalt",
      "Gestaltung",
      "Verhalten",
    ]);
    expect(editor).toHaveTextContent("Überschrift oder Text nötig");
    expect(screen.queryByTestId("infobox-inspector")).toBeNull();
    expect(screen.queryByTestId("infobox-preview")).toBeNull();
  });

  it("schreibt Überschrift und Text in den Entwurf", () => {
    const { onChange } = renderEditor({ initial: FILLED });

    fireEvent.change(screen.getByLabelText("Überschrift"), { target: { value: "Neu" } });
    expect(onChange).toHaveBeenLastCalledWith({ ...FILLED, heading: "Neu" });

    fireEvent.change(screen.getByLabelText("Text"), { target: { value: "Zeile 1\nZeile 2" } });
    expect(onChange).toHaveBeenLastCalledWith({ ...FILLED, heading: "Neu", text: "Zeile 1\nZeile 2" });
  });

  it("zeigt die sechs Varianten als Pills mit Farbtupfer und wählt per Klick", async () => {
    const { onChange } = renderEditor({ initial: FILLED });

    expect(within(variantGroup()).getAllByRole("radio").map((radio) => radio.textContent)).toEqual([
      "Neutral",
      "Information",
      "Erläuterung",
      "Erfolg",
      "Warnung",
      "Fehler",
    ]);
    expect(pill("Warnung")).toHaveAttribute("aria-checked", "true");
    expect(pill("Fehler").querySelector('[data-swatch="error"]')).toHaveClass("infobox-swatch--error");

    await userEvent.click(pill("Fehler"));
    expect(onChange).toHaveBeenLastCalledWith({ ...FILLED, variant: "error" });
  });

  it("bringt die Farben der Tupfer aus den MAN-Tokens mit", () => {
    renderEditor({ initial: FILLED });

    const css = Array.from(document.querySelectorAll("style"))
      .map((style) => style.textContent ?? "")
      .join("\n");
    expect(css).toMatch(/\.infobox-swatch--warning\s*\{[^}]*var\(--man-warning/);
  });

  it("schaltet das Schließen als Zeile mit Hinweis", async () => {
    const { onChange } = renderEditor({ initial: FILLED });

    const toggle = screen.getByRole("switch", { name: "Schließen erlauben" });
    expect(toggle).toHaveAttribute("aria-checked", "true");
    expect(toggle).toHaveAccessibleDescription("Leser können die Box mit einem ✕ ausblenden.");

    await userEvent.click(toggle);
    expect(onChange).toHaveBeenLastCalledWith({ ...FILLED, dismissible: false });
  });
});

describe("InfoboxEditor – offene Schlüssel", () => {
  // Im Content Designer ist das alte Auswahlfeld nicht lesbar. Dann zeigt
  // keine Pill eine Wahl, und der Schlüssel bleibt offen, bis jemand wählt.
  it("zeigt bei ungelesener Variante keine Wahl und sagt, dass die bisherige gilt", async () => {
    const { onChange } = renderEditor({ initial: { heading: "Wartung", text: "", dismissible: true } });

    for (const radio of within(variantGroup()).getAllByRole("radio")) {
      expect(radio).toHaveAttribute("aria-checked", "false");
    }
    expect(variantGroup()).toHaveAccessibleDescription(VARIANT_UNREAD_HINT);

    fireEvent.change(screen.getByLabelText("Text"), { target: { value: "Zu" } });
    expect(onChange.mock.calls[0][0]).not.toHaveProperty("variant");

    await userEvent.click(pill("Information"));
    expect(onChange).toHaveBeenLastCalledWith({ heading: "Wartung", text: "Zu", dismissible: true, variant: "info" });
  });

  it("zeigt den Schalter bei ungelesenem Wert an und lässt den Schlüssel offen", () => {
    renderEditor({ initial: { heading: "Wartung" } });

    const toggle = screen.getByRole("switch", { name: "Schließen erlauben" });
    expect(toggle).toHaveAttribute("aria-checked", "true");
    expect(toggle).toHaveAccessibleDescription(expect.stringContaining(UNREAD_HINT));
  });
});

describe("InfoboxEditor – Fehler", () => {
  it("zeigt den Fehler erst, wenn Übernehmen daran scheiterte", () => {
    renderEditor({ initial: { heading: "", text: "" } });

    expect(screen.queryByRole("alert")).toBeNull();
    expect(screen.getByLabelText("Überschrift")).not.toHaveAttribute("aria-invalid");
  });

  it("markiert beide Felder und verweist auf dieselbe Meldung unter dem Text", () => {
    renderEditor({ initial: { heading: "", text: "" }, issuesVisible: true });

    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent(CONTENT_ISSUE_DETAIL);
    for (const field of [screen.getByLabelText("Überschrift"), screen.getByLabelText("Text")]) {
      expect(field).toHaveAttribute("aria-invalid", "true");
      expect(field).toHaveAccessibleDescription(CONTENT_ISSUE_DETAIL);
    }
  });

  it("nimmt den Fehler zurück, sobald eines der Felder Inhalt hat", () => {
    renderEditor({ initial: { heading: "", text: "" }, issuesVisible: true });

    fireEvent.change(screen.getByLabelText("Text"), { target: { value: "Zu" } });

    expect(screen.queryByRole("alert")).toBeNull();
    expect(screen.getByLabelText("Überschrift")).not.toHaveAttribute("aria-invalid");
  });
});

describe("InfoboxEditor – Geräte-Ansicht", () => {
  it("zeigt die Vorschau und daneben dasselbe Formular als Einstellungen", () => {
    renderEditor({ initial: FILLED, view: "desktop" });

    expect(screen.getByRole("region", { name: "Vorschau Desktop" })).toBeInTheDocument();
    expect(screen.getByTestId("infobox-preview")).toHaveTextContent("Am Samstag offline.");
    const inspector = screen.getByRole("complementary", { name: "Einstellungen" });
    expect(within(inspector).getByRole("heading", { level: 2 })).toHaveTextContent("Einstellungen");
    expect(within(inspector).getAllByRole("heading", { level: 3 }).map((h) => h.textContent)).toEqual([
      "Inhalt",
      "Gestaltung",
      "Verhalten",
    ]);
    // Die Randnotiz steht nur in der Editor-Ansicht.
    expect(inspector).not.toHaveTextContent("Überschrift oder Text nötig");
    expect(screen.queryByTestId("infobox-editor")).toBeNull();
  });

  it("zeigt Änderungen aus den Einstellungen sofort in der Vorschau", () => {
    renderEditor({ initial: FILLED, view: "mobile" });

    fireEvent.change(screen.getByLabelText("Text"), { target: { value: "Am Sonntag auch." } });

    expect(screen.getByTestId("infobox-preview")).toHaveTextContent("Am Sonntag auch.");
  });
});
