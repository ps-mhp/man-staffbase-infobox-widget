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
 * Der Rumpf des Fensters „Infobox bearbeiten“ – nachgeladen, erst wenn ein
 * Dialog das Feld `infobox-config` zeigt (`infobox-dialog.tsx`).
 *
 * Keine Seitenleiste: es gibt nur eine Box. In der Editor-Ansicht steht das
 * Formular als Hauptfläche, in Desktop, Tablet und Mobil die Vorschau, und
 * dasselbe Formular rückt als Inspektor „Einstellungen“ daneben – ein
 * Inspektor schon in der Editor-Ansicht verdoppelte die Felder.
 */

import * as React from "react";
import { InspectorPanel } from "@man/config-ui/inspector/inspector-panel";
import { ConfigWorkspace } from "@man/config-ui/layout/config-workspace";
import { useConfigShell } from "@man/config-ui/shell/shell-context";

import type { InfoboxConfig } from "./infobox-config";
import { InfoboxForm } from "./infobox-form";
import { InfoboxPreview } from "./infobox-preview";

export interface InfoboxEditorProps {
  value: InfoboxConfig;
  onChange: (value: InfoboxConfig) => void;
}

export function InfoboxEditor({ value, onChange }: InfoboxEditorProps): React.ReactElement {
  const { view } = useConfigShell();
  return (
    <ConfigWorkspace
      preview={<InfoboxPreview config={value} />}
      inspector={
        view === "editor" ? undefined : (
          <InspectorPanel title="Einstellungen">
            <div className="flex flex-col gap-6" data-testid="infobox-inspector">
              <InfoboxForm value={value} onChange={onChange} detailed={false} />
            </div>
          </InspectorPanel>
        )
      }
    >
      <div className="flex max-w-[720px] flex-col gap-8 px-10 pt-6 pb-12" data-testid="infobox-editor">
        <InfoboxForm value={value} onChange={onChange} detailed />
      </div>
    </ConfigWorkspace>
  );
}
