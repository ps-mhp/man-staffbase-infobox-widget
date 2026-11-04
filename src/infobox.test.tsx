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

import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";

import { Infobox } from "./infobox";

describe("Infobox", () => {
  it("gibt ohne Ueberschrift und ohne Text nichts aus", () => {
    const { container } = render(<Infobox variant="info" dismissible />);
    expect(container.querySelector(".man-infobox")).toBeNull();
  });

  it("behandelt reinen Leerraum wie leer", () => {
    const { container } = render(<Infobox variant="info" heading="   " text={"\n"} dismissible />);
    expect(container.querySelector(".man-infobox")).toBeNull();
  });

  it("zeigt nur die Ueberschrift, wenn kein Text gesetzt ist", () => {
    const { container } = render(<Infobox variant="info" heading="Achtung" dismissible />);
    expect(screen.getByText("Achtung")).toBeTruthy();
    expect(container.querySelector(".man-infobox__text")).toBeNull();
  });

  it("zeigt nur den Text, wenn keine Ueberschrift gesetzt ist", () => {
    const { container } = render(<Infobox variant="info" text="Die Kantine bleibt zu." dismissible />);
    expect(screen.getByText("Die Kantine bleibt zu.")).toBeTruthy();
    expect(container.querySelector(".man-infobox__heading")).toBeNull();
  });

  it("setzt die Klasse der Variante", () => {
    const { container } = render(<Infobox variant="warning" heading="Achtung" dismissible />);
    expect(container.querySelector(".man-infobox--warning")).not.toBeNull();
  });

  it("meldet sich als Hinweis, ohne den Lesefluss zu unterbrechen", () => {
    render(<Infobox variant="info" heading="Achtung" dismissible />);
    expect(screen.getByRole("status")).toBeTruthy();
  });

  it("nimmt den Kasten beim Klick auf das Kreuz weg", () => {
    const { container } = render(<Infobox variant="info" heading="Achtung" dismissible />);
    fireEvent.click(screen.getByRole("button", { name: "Hinweis schließen" }));
    expect(container.querySelector(".man-infobox")).toBeNull();
  });

  it("laesst das Kreuz weg, wenn Schliessen abgeschaltet ist", () => {
    render(<Infobox variant="info" heading="Achtung" dismissible={false} />);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("haelt die Zeilenumbrueche des Textfelds", () => {
    const { container } = render(
      <Infobox variant="info" text={"Erste Zeile\nZweite Zeile"} dismissible />,
    );
    expect(container.querySelector(".man-infobox__text")!.textContent).toBe("Erste Zeile\nZweite Zeile");
  });

  it("zeigt den Kasten nach dem Schliessen wieder, wenn sich eine Eingabe aendert", () => {
    const { container, rerender } = render(
      <Infobox variant="info" heading="Achtung" text="Alter Text" dismissible />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Hinweis schließen" }));
    expect(container.querySelector(".man-infobox")).toBeNull();

    rerender(<Infobox variant="info" heading="Achtung" text="Neuer Text" dismissible />);
    expect(container.querySelector(".man-infobox")).not.toBeNull();
    expect(screen.getByText("Neuer Text")).toBeTruthy();
  });

  it("bleibt nach dem Schliessen verschwunden, wenn sich keine Eingabe aendert", () => {
    const { container, rerender } = render(
      <Infobox variant="info" heading="Achtung" text="Text" dismissible />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Hinweis schließen" }));
    expect(container.querySelector(".man-infobox")).toBeNull();

    rerender(<Infobox variant="info" heading="Achtung" text="Text" dismissible />);
    expect(container.querySelector(".man-infobox")).toBeNull();
  });

  it("bringt sein Stylesheet selbst mit", () => {
    const { container } = render(<Infobox variant="info" heading="Achtung" dismissible />);
    const style = container.querySelector("style");
    expect(style).not.toBeNull();
    expect(style!.textContent).toContain(".man-infobox");
  });
});
