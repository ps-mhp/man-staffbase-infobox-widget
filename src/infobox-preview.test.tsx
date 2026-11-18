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

import * as React from "react";
import { render, screen } from "@testing-library/react";

import { EMPTY_PREVIEW_TEXT, InfoboxPreview } from "./infobox-preview";

describe("InfoboxPreview", () => {
  it("zeigt die echte Infobox mit Stylesheet und lässt sich nicht bedienen", () => {
    render(<InfoboxPreview config={{ heading: "Wartung", text: "Offline.", variant: "error", dismissible: true }} />);

    const preview = screen.getByTestId("infobox-preview");
    expect(preview).toHaveAttribute("inert");
    const box = preview.querySelector(".man-infobox");
    expect(box).toHaveClass("man-infobox--error");
    expect(box).toHaveTextContent("Wartung");
    expect(box?.querySelector("style")?.textContent).toContain(".man-infobox--error");
    expect(preview.querySelector(".man-infobox__close")).not.toBeNull();
  });

  it("füllt offene Schlüssel mit den Vorgaben der Seite", () => {
    render(<InfoboxPreview config={{ text: "Offline." }} />);

    const box = screen.getByTestId("infobox-preview").querySelector(".man-infobox");
    expect(box).toHaveClass("man-infobox--default");
    expect(box?.querySelector(".man-infobox__close")).not.toBeNull();
  });

  it("lässt das ✕ weg, wenn Schließen aus ist", () => {
    render(<InfoboxPreview config={{ text: "Offline.", dismissible: false }} />);

    expect(screen.getByTestId("infobox-preview").querySelector(".man-infobox__close")).toBeNull();
  });

  it("zeigt statt einer leeren Box einen Hinweis, warum die Seite nichts zeigt", () => {
    render(<InfoboxPreview config={{ heading: " ", text: "" }} />);

    expect(screen.getByTestId("infobox-preview-empty")).toHaveTextContent(EMPTY_PREVIEW_TEXT);
    expect(screen.getByTestId("infobox-preview").querySelector(".man-infobox")).toBeNull();
  });
});
