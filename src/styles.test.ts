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
 * Wachen ueber das uebersetzte Stylesheet. Aussehen prueft jsdom nicht;
 * pruefbar ist, dass jede Variante genau ihr Token-Paar traegt, dass keine
 * Farbe von Hand gesetzt wurde, und dass der blanke `button` sich gegen die
 * Wirtsseite durchsetzt (im Hotspot-Widget am 10.09.2026 so gesehen).
 */

import css from "./styles/infobox.scss";
import { INFOBOX_VARIANTS } from "./infobox-variant";

/** Die Farbpaare, die der Entwurf je Variante festlegt. */
const EXPECTED: Record<string, { surface: string; ink: string }> = {
  default: { surface: "grey-300", ink: "text" },
  info: { surface: "info", ink: "info-ink" },
  explanation: { surface: "explanation", ink: "explanation-ink" },
  success: { surface: "success", ink: "success-ink" },
  warning: { surface: "warning", ink: "warning-ink" },
  error: { surface: "error-surface", ink: "error-ink" },
};

function ruleFor(variant: string): string {
  const match = css.match(new RegExp(`\\.man-infobox--${variant}\\s*\\{([^}]*)\\}`));
  expect(match).not.toBeNull();
  return match![1];
}

describe("Stylesheet", () => {
  it("bringt eine Regel fuer jede Variante mit", () => {
    for (const variant of INFOBOX_VARIANTS) {
      expect(css).toContain(`.man-infobox--${variant}`);
    }
  });

  it.each(Object.entries(EXPECTED))("gibt %s genau sein Token-Paar", (variant, tokens) => {
    const rule = ruleFor(variant);
    expect(rule).toContain(`var(--man-${tokens.surface}`);
    expect(rule).toContain(`var(--man-${tokens.ink}`);
  });

  it("setzt keine Farbe von Hand", () => {
    const invented = [...css.matchAll(/(?:^|[;{])\s*(?:background|color):\s*([^;}]+)/g)]
      .map((match) => match[1].replace("!important", "").trim())
      .filter(
        (value) =>
          !value.startsWith("var(--man-") &&
          value !== "inherit" &&
          value !== "none" &&
          value !== "currentcolor",
      );

    expect(invented).toEqual([]);
  });

  it("rundet nur nach den MAN-Tokens", () => {
    const invented = [...css.matchAll(/border-radius:\s*([^;}]+)/g)]
      .map((match) => match[1].trim())
      .filter((value) => !value.startsWith("var(--man-radius") && !value.startsWith("0"));

    expect(invented).toEqual([]);
  });

  it("setzt das Kreuz gegen die Regeln der Wirtsseite durch", () => {
    const selector = "\\.man-infobox__close".repeat(5);
    expect(css).toMatch(new RegExp(`${selector}\\s*\\{[^}]*background:\\s*none\\s*!important`));
  });

  it("hebt das Kreuz nur unter einem echten Zeiger hervor", () => {
    const [outsideHoverQuery] = css.split("@media (hover: hover)");
    expect(outsideHoverQuery).not.toMatch(/:hover/);
    expect(css).toMatch(/@media \(hover: hover\)[\s\S]*\.man-infobox__close/);
  });
});
