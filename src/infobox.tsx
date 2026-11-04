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

import { useHotStyle } from "@shared/hot-style";
import { INFOBOX_WIDGET_TAG, InfoboxVariant } from "./infobox-variant";
import infoboxCss from "./styles/infobox.scss";

export interface InfoboxProps {
  variant: InfoboxVariant;
  heading?: string;
  text?: string;
  /** Zeigt das Kreuz. Geschlossen wird nur fuer die Sitzung. */
  dismissible: boolean;
}

/**
 * Eingebettet statt aus der Icon-Schrift: so traegt das Bundle das Zeichen
 * selbst und haengt nicht an der Schriftauslieferung der Instanz.
 */
const CloseIcon = (): React.ReactElement => (
  <svg
    className="man-infobox__close-icon"
    viewBox="0 0 24 24"
    width="20"
    height="20"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

/**
 * Der Hinweiskasten.
 *
 * Ohne Inhalt gibt er nichts aus — eine nackte Farbflaeche auf der Seite
 * waere schlimmer als gar nichts. Der Schliessen-Zustand liegt bewusst nur
 * im Bauteil und nicht im `localStorage`: dauerhaftes Verbergen braeuchte
 * einen stabilen Schluessel je Kasten, den es hier nicht gibt.
 */
export function Infobox({ variant, heading, text, dismissible }: InfoboxProps): React.ReactElement | null {
  const liveCss = useHotStyle(infoboxCss, INFOBOX_WIDGET_TAG, "styles/infobox.scss");
  const [closed, setClosed] = React.useState(false);

  // Eingaben, bei deren Aenderung ein geschlossener Kasten wieder erscheinen
  // soll. Der Vergleich laeuft waehrend des Renderns (das von React dafuer
  // vorgesehene Muster „Zustand beim Rendern anpassen"), nicht in einem
  // `useEffect`: ein Effekt braeuchte einen zusaetzlichen Durchlauf und
  // liesse den Kasten kurz sichtbar aufblitzen, bevor er wieder verschwindet.
  const inputs: readonly [InfoboxVariant, string | undefined, string | undefined] = [variant, heading, text];
  const [prevInputs, setPrevInputs] = React.useState(inputs);
  if (prevInputs.some((value, index) => value !== inputs[index])) {
    setPrevInputs(inputs);
    setClosed(false);
  }

  const title = heading?.trim() ?? "";
  const message = text?.trim() ?? "";

  if (closed) return null;
  if (title === "" && message === "") return null;

  return (
    <section className={`man-infobox man-infobox--${variant}`} role="status">
      <style>{liveCss}</style>
      <div className="man-infobox__body">
        {title !== "" && <p className="man-infobox__heading">{title}</p>}
        {message !== "" && <p className="man-infobox__text">{message}</p>}
      </div>
      {dismissible && (
        <button
          type="button"
          className="man-infobox__close"
          aria-label="Hinweis schließen"
          onClick={() => setClosed(true)}
        >
          <CloseIcon />
        </button>
      )}
    </section>
  );
}
