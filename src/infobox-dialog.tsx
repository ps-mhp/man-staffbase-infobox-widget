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
 * Was der Konfigurationsdialog zeigt: ein einziges Fenster am Feld
 * `infobox-config`, die einzelnen Felder älterer Fassungen ausgeblendet.
 *
 * Das Fenster beginnt mit `infobox-config` und füllt, was dort fehlt, aus
 * den lesbaren alten Feldern des eigenen Dialogs. Was sich nicht lesen lässt
 * (Auswahlfelder des Content Designers), bleibt offen: es wird nicht mit
 * einer Vorgabe überschrieben, und für die Seite gilt weiter das alte
 * Attribut, bis jemand den Wert im Fenster ändert.
 */

import * as React from "react";
import { Info } from "lucide-react";

import { FieldModalShellOptions, startFieldModalInjector } from "@shared/config-modal";

import { INFOBOX_CONFIG_ATTRIBUTE, LEGACY_ATTRIBUTES } from "./configuration-schema";
import { InfoboxConfig, configFromLegacy, readInfoboxConfig, serializeInfoboxConfig } from "./infobox-config";
import { infoboxChangesStatus, validateInfoboxConfig } from "./infobox-editor-rules";
import { readLegacyFromDialog, startHiddenFields } from "./legacy-fields";

/**
 * Der Editor kommt erst, wenn ein Dialog ihn zeigt: er baut auf
 * `@man/config-ui` und damit auf react-aria und Tailwind. Hier im
 * Seitenbündel bleiben nur Prüfung, Status und Hilfe – sie braucht der
 * Rahmen, bevor der Editor da ist.
 */
const LazyInfoboxEditor = React.lazy(() =>
  import("./infobox-editor").then((module) => ({ default: module.InfoboxEditor })),
);

const LOADING = <p className="p-6 text-sm text-muted-foreground">Editor wird geladen …</p>;

/** Tasten und den Satz zu „Übernehmen“ ergänzt der Rahmen selbst. */
const HELP = (
  <ul className="flex list-disc flex-col gap-2 pl-5">
    <li>
      <strong>Überschrift</strong> ist die fette erste Zeile, <strong>Text</strong> der Satz darunter; Zeilenumbrüche im
      Text bleiben stehen. Eines von beiden reicht – sind beide leer, erscheint die Infobox nicht auf der Seite.
    </li>
    <li>
      <strong>Variante</strong> ist die Farbe und sagt, wie dringend der Hinweis ist: Neutral für Ergänzungen,
      Information für Neuigkeiten, Erläuterung für Hintergrundwissen, Erfolg, Warnung und Fehler für den Stand einer
      Sache.
    </li>
    <li>
      <strong>Schließen erlauben</strong> zeigt rechts oben ein ✕. Weggeklickt bleibt die Box nur bis zum nächsten
      Seitenaufruf weg – für eine Pflichtmitteilung abschalten.
    </li>
    <li>
      Desktop, Tablet und Mobil zeigen die Infobox, wie die Seite sie zeigt; die Einstellungen stehen dann rechts. Ist
      sie leer, steht dort ein gestrichelter Hinweis.
    </li>
    <li>
      Ist bei Variante keine Pill gewählt, ließ sich die bisherige Einstellung nicht lesen. Sie gilt weiter, bis hier
      eine gewählt wird.
    </li>
  </ul>
);

/** Was der gemeinsame Rahmen von der Infobox wissen muss. Offengelegt für Tests. */
export const infoboxEditorShell: FieldModalShellOptions<InfoboxConfig> = {
  widgetName: "Infobox",
  title: "Infobox bearbeiten",
  icon: Info,
  preview: true,
  help: HELP,
  statusText: infoboxChangesStatus,
  validate: validateInfoboxConfig,
};

/**
 * Der Ausgangsstand des Fensters: je Schlüssel `infobox-config`, sonst das
 * lesbare alte Feld – dieselbe Reihenfolge, in der die Seite liest.
 */
function initialConfig(raw: string, root: ParentNode): InfoboxConfig {
  return { ...configFromLegacy(readLegacyFromDialog(root)), ...readInfoboxConfig(raw) };
}

/**
 * Wartet auf den Konfigurationsdialog des Widgets, setzt das Fenster an die
 * Stelle von `infobox-config` und blendet die alten Felder aus – beides nur
 * im eigenen Dialog.
 *
 * @param root der zu beobachtende Teilbaum; standardmäßig das Dokument.
 * Offengelegt, damit Tests den Beobachter auf einen Container begrenzen.
 * @returns eine Funktion, die die Beobachtung beendet und alles abbaut.
 */
export function startInfoboxDialog(root: ParentNode = document): () => void {
  const stopModal = startFieldModalInjector<InfoboxConfig>({
    fieldKey: INFOBOX_CONFIG_ATTRIBUTE,
    root,
    reopenLabel: "Infobox bearbeiten",
    modalTestId: "infobox-editor-modal",
    reopenTestId: "infobox-editor-reopen",
    parse: (raw) => initialConfig(raw, root),
    serialize: serializeInfoboxConfig,
    shell: infoboxEditorShell,
    render: ({ value, onChange }) => (
      <React.Suspense fallback={LOADING}>
        <LazyInfoboxEditor value={value} onChange={onChange} />
      </React.Suspense>
    ),
  });
  const stopHiding = startHiddenFields(LEGACY_ATTRIBUTES, INFOBOX_CONFIG_ATTRIBUTE, root);
  return () => {
    stopModal();
    stopHiding();
  };
}
