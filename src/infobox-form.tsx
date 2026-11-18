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
 * Das Formular des Fensters „Infobox bearbeiten“: Inhalt, Gestaltung,
 * Verhalten – in der Editor-Ansicht als Hauptfläche, in Desktop, Tablet und
 * Mobil als Inspektor neben der Vorschau.
 *
 * Ein offener Schlüssel (das alte Feld ließ sich nicht lesen) bleibt offen,
 * bis jemand ihn hier ändert: die Pills zeigen dann keine Wahl, der Schalter
 * die Vorgabe, und ein Hinweis sagt, dass die bisherige Einstellung gilt.
 */

import * as React from "react";
import { TriangleAlert } from "lucide-react";
import { Field } from "@man/config-ui/form/field";
import { FormSection } from "@man/config-ui/form/form-section";
import type { IconComponent, SegmentedOption } from "@man/config-ui/form/segmented";
import { SegmentedField } from "@man/config-ui/form/segmented-field";
import { SwitchRow } from "@man/config-ui/form/switch-row";
import { Input } from "@man/config-ui/primitives/input";
import { Textarea } from "@man/config-ui/primitives/textarea";
import { cn } from "@man/config-ui/primitives/utils";
import { useConfigShell } from "@man/config-ui/shell/shell-context";

import { VARIANT_LABELS } from "./configuration-schema";
import type { InfoboxConfig } from "./infobox-config";
import { CONTENT_ISSUE, CONTENT_ISSUE_DETAIL, validateInfoboxConfig } from "./infobox-editor-rules";
import { INFOBOX_VARIANTS, InfoboxVariant } from "./infobox-variant";
import swatchCss from "./styles/variant-swatches.scss";

/** Steht für „keine Pill gewählt“: das alte Feld ließ sich nicht lesen. */
const UNREAD = "unread";
type VariantChoice = InfoboxVariant | typeof UNREAD;

export const UNREAD_HINT = "Die bisherige Einstellung ließ sich hier nicht lesen; sie gilt weiter, bis sie hier geändert wird.";

/** Die Vorschau füllt den offenen Schlüssel mit der Vorgabe – das muss dabeistehen. */
export const VARIANT_UNREAD_HINT = `${UNREAD_HINT} Die Vorschau zeigt bis dahin Neutral.`;

const DISMISSIBLE_HINT = "Leser können die Box mit einem ✕ ausblenden.";

/** Eingaben im Maß des Screens: 40 px hoch, 15 px Schrift. */
const INPUT_CLASS = "h-10 text-[15px] md:text-[15px]";
const TEXTAREA_CLASS = "min-h-[88px] resize-y text-[15px] md:text-[15px]";

/**
 * Der Farbtupfer einer Variante. Die Farbe kommt aus den MAN-Tokens der
 * Seite (`variant-swatches.scss`), Größe und Kante aus Tailwind; das
 * `className` der Pill (16 px) wird bewusst übergangen – der Tupfer ist
 * kleiner als ein Icon.
 */
function swatchOf(variant: InfoboxVariant): IconComponent {
  function VariantSwatch({ "aria-hidden": ariaHidden }: { "aria-hidden"?: boolean | "true" | "false" }): React.ReactElement {
    return (
      <span
        aria-hidden={ariaHidden}
        data-swatch={variant}
        className={cn(`infobox-swatch--${variant}`, "size-3.5 shrink-0 rounded-full ring-1 ring-foreground/30 ring-inset")}
      />
    );
  }
  VariantSwatch.displayName = `VariantSwatch(${variant})`;
  return VariantSwatch;
}

const VARIANT_OPTIONS: readonly SegmentedOption<VariantChoice>[] = INFOBOX_VARIANTS.map((variant) => ({
  id: variant,
  label: VARIANT_LABELS[variant],
  icon: swatchOf(variant),
}));

export interface InfoboxFormProps {
  value: InfoboxConfig;
  onChange: (value: InfoboxConfig) => void;
  /**
   * Die Hauptfläche der Editor-Ansicht: mit Randnotiz am Abschnitt „Inhalt“,
   * höherem Textfeld und schmaler Schalterzeile. Im Inspektor knapper.
   */
  detailed: boolean;
}

/** Die Meldung zu `id`, aber erst, wenn „Übernehmen“ an ihr gescheitert ist. */
function useIssue(value: InfoboxConfig, id: string): boolean {
  const { issuesVisible } = useConfigShell();
  return issuesVisible && validateInfoboxConfig(value).some((issue) => issue.id === id);
}

/** Eine Meldung wie die von `Field`: Symbol und Text, vorgelesen, sobald sie erscheint. */
function IssueText({ id, children }: { id: string; children: React.ReactNode }): React.ReactElement {
  return (
    <p id={id} role="alert" className="flex items-start gap-1.5 text-[13px] text-destructive">
      <TriangleAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden />
      <span>{children}</span>
    </p>
  );
}

/**
 * Überschrift und Text. Fehlt beides, gilt der Fehler beiden Feldern: beide
 * sind als ungültig markiert und verweisen auf dieselbe Meldung unter dem
 * Textfeld – eines von beiden reicht.
 */
export function ContentSection({ value, onChange, detailed }: InfoboxFormProps): React.ReactElement {
  const errorId = `${React.useId()}-content-error`;
  const invalid = useIssue(value, CONTENT_ISSUE);
  const errorProps = invalid ? { "aria-invalid": true, "aria-describedby": errorId } : {};
  return (
    <FormSection title="Inhalt" aside={detailed ? "Überschrift oder Text nötig" : undefined}>
      <Field label="Überschrift">
        <Input
          type="text"
          className={INPUT_CLASS}
          data-testid="infobox-heading"
          value={value.heading ?? ""}
          onChange={(event) => onChange({ ...value, heading: event.target.value })}
          {...errorProps}
        />
      </Field>
      {/* Wie im Feld selbst: die Meldung 6 px unter dem Textfeld. */}
      <div className="flex flex-col gap-1.5">
        <Field label="Text">
          <Textarea
            rows={detailed ? 4 : 3}
            className={TEXTAREA_CLASS}
            data-testid="infobox-text"
            value={value.text ?? ""}
            onChange={(event) => onChange({ ...value, text: event.target.value })}
            {...errorProps}
          />
        </Field>
        {invalid && <IssueText id={errorId}>{CONTENT_ISSUE_DETAIL}</IssueText>}
      </div>
    </FormSection>
  );
}

/** Die Variante als Pills mit Farbtupfer, wie der Kasten sie auf der Seite trägt. */
export function DesignSection({ value, onChange }: InfoboxFormProps): React.ReactElement {
  return (
    <FormSection title="Gestaltung">
      <style>{swatchCss}</style>
      <SegmentedField<VariantChoice>
        label="Variante"
        options={VARIANT_OPTIONS}
        value={value.variant ?? UNREAD}
        onChange={(next) => {
          if (next !== UNREAD) onChange({ ...value, variant: next });
        }}
        hint={value.variant === undefined ? VARIANT_UNREAD_HINT : undefined}
      />
    </FormSection>
  );
}

/** Ob Leser die Box wegklicken dürfen. */
export function BehaviourSection({ value, onChange, detailed }: InfoboxFormProps): React.ReactElement {
  const unread = value.dismissible === undefined;
  return (
    <FormSection title="Verhalten">
      <SwitchRow
        label="Schließen erlauben"
        hint={unread ? `${DISMISSIBLE_HINT} ${UNREAD_HINT}` : DISMISSIBLE_HINT}
        checked={value.dismissible ?? true}
        onCheckedChange={(dismissible) => onChange({ ...value, dismissible })}
        className={detailed ? "max-w-[520px]" : undefined}
        data-testid="infobox-dismissible"
      />
    </FormSection>
  );
}

/** Alle drei Abschnitte untereinander. */
export function InfoboxForm(props: InfoboxFormProps): React.ReactElement {
  return (
    <>
      <ContentSection {...props} />
      <DesignSection {...props} />
      <BehaviourSection {...props} />
    </>
  );
}
