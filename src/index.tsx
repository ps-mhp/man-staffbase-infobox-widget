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

import { setPublicPathFromBundle } from "@shared/public-path";
// Muss vor jedem dynamischen `import()` laufen, damit nachgeladene Teile von
// dem CDN kommen, von dem das Bundle stammt, und nicht von der Wirtsseite.
setPublicPathFromBundle(`${INFOBOX_WIDGET_TAG}.js`);

import React from "react";
import ReactDOM from "react-dom/client";

import { BlockFactory, BlockDefinition, ExternalBlockDefinition, BaseBlock } from "widget-sdk";
import { startWidget } from "@shared/dev-mode/start-widget";
import { ALL_ATTRIBUTES, configurationSchema, uiSchema } from "./configuration-schema";
import { resolveInfobox } from "./infobox-config";
import { INFOBOX_WIDGET_TAG } from "./infobox-variant";
import { Infobox } from "./infobox";
import icon from "../resources/infobox-widget.svg";
import pkg from "../package.json";

/**
 * Die Attribute des Widgets, aus dem Schema genommen: `infobox-config` und
 * dahinter die vier Felder älterer Fassungen, die weiter gelten, solange
 * `infobox-config` sie nicht trägt.
 */
const widgetAttributes: string[] = ALL_ATTRIBUTES;

const factory: BlockFactory = (BaseBlockClass, _widgetApi) => {
  /**
   * <infobox-widget infobox-config="b64:…"></infobox-widget>
   * <infobox-widget variant="info" heading="Achtung" text="Die Kantine bleibt zu."></infobox-widget>
   */
  return class InfoboxWidgetBlock extends BaseBlockClass implements BaseBlock {
    private _root: ReactDOM.Root | null = null;

    public renderBlock(container: HTMLElement): void {
      // Je Schlüssel `infobox-config`, sonst das alte Attribut, sonst die
      // Vorgabe (`infobox-config.ts`). Ein alter Block ohne `infobox-config`
      // steht damit genau wie bisher da.
      const box = resolveInfobox(this.parseAttributes<Record<string, unknown>>());

      this._root ??= ReactDOM.createRoot(container);
      this._root.render(
        <Infobox variant={box.variant} heading={box.heading} text={box.text} dismissible={box.dismissible} />,
      );
    }

    public unmountBlock(_container: HTMLElement): void {
      this._root?.unmount();
      this._root = null;
    }

    public static get observedAttributes(): string[] {
      return widgetAttributes;
    }

    public attributeChangedCallback(...args: [string, string | undefined, string | undefined]): void {
      super.attributeChangedCallback.apply(this, args);
    }
  };
};

const blockDefinition: BlockDefinition = {
  name: INFOBOX_WIDGET_TAG,
  factory: factory,
  attributes: widgetAttributes,
  blockLevel: "block",
  configurationSchema: configurationSchema,
  uiSchema: uiSchema,
  label: "Infobox",
  iconUrl: icon,
};

const externalBlockDefinition: ExternalBlockDefinition = {
  blockDefinition,
  author: pkg.author,
  version: pkg.version,
};

/**
 * Meldet den Baustein bei der Wirtsseite an.
 *
 * `startWidget` fragt zuerst, ob ein lokaler Entwicklungsserver dieses Widget
 * ausliefert. In fast jedem Browser lautet die Antwort nein, und es wird
 * sofort angemeldet; auf dem Rechner der Entwicklung uebernimmt das lokale
 * Bundle und meldet an seiner Stelle an. Immer nur eines von beiden — ein
 * Bausteinname laesst sich nicht zweimal belegen.
 *
 * Die Abfrage davor laesst das Modul in Jest laden, wo es keine Wirtsseite
 * gibt: ohne sie braeche schon der blosse Import der Datei jeden Test.
 */
if (typeof window.defineBlock === "function") {
  void startWidget({
    name: INFOBOX_WIDGET_TAG,
    version: pkg.version,
    register: () => {
      window.defineBlock(externalBlockDefinition);
    },
  });
}
