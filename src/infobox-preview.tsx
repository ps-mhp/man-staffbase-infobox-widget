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
 * Die Vorschau des Entwurfs in Desktop, Tablet und Mobil: die echte
 * Leseansicht (`Infobox`) mit ihrem Stylesheet, zwischen einem Seitentitel
 * und einem Absatz als Platzhalter für die Seite drumherum.
 *
 * `Infobox` taugt dafür ohne eigenen Vorschau-Schalter: sie lauscht an
 * nichts und misst nichts. Die Bühne ist `inert`, also lässt sich das ✕
 * nicht klicken – die Box verschwände sonst aus der Vorschau.
 *
 * Eine leere Box gibt `Infobox` gar nicht aus. Hier steht an ihrer Stelle ein
 * gestrichelter Hinweis, damit klar ist, warum die Seite nichts zeigt.
 */

import * as React from "react";
import { Info } from "lucide-react";
import { useConfigShell } from "@man/config-ui/shell/shell-context";

import { Infobox } from "./infobox";
import { InfoboxConfig, resolveDraft } from "./infobox-config";

export const EMPTY_PREVIEW_TEXT =
  "Leere Infobox – sie erscheint nicht auf der Seite, bis Überschrift oder Text gesetzt sind.";

const isBlank = (value: string | undefined): boolean => (value?.trim() ?? "") === "";

function EmptyNotice(): React.ReactElement {
  return (
    <div
      data-testid="infobox-preview-empty"
      className="flex items-start gap-3 border-2 border-dashed border-muted-foreground/60 p-5 text-[15px] text-muted-foreground"
    >
      <Info className="size-5 shrink-0" aria-hidden />
      <span>{EMPTY_PREVIEW_TEXT}</span>
    </div>
  );
}

export function InfoboxPreview({ config }: { config: InfoboxConfig }): React.ReactElement {
  const { view } = useConfigShell();
  const box = resolveDraft(config);
  const empty = isBlank(box.heading) && isBlank(box.text);
  return (
    <div
      inert
      data-testid="infobox-preview"
      className={view === "desktop" ? "flex flex-col gap-4 px-10 pt-8 pb-10" : "flex flex-col gap-4 p-6"}
    >
      {/* Platzhalter für die Seite; die echte kennt das Fenster nicht. */}
      <p className="text-[30px] leading-[1.15] font-bold text-foreground">Seitentitel</p>
      {empty ? (
        <EmptyNotice />
      ) : (
        <Infobox variant={box.variant} heading={box.heading} text={box.text} dismissible={box.dismissible} />
      )}
      <p className="text-[15px] leading-normal text-muted-foreground">[Text der Seite unter der Infobox.]</p>
    </div>
  );
}
