# Infobox-Widget

Ein farbig hinterlegter Hinweiskasten für Staffbase: eine fette Zeile, darunter
ein kurzer Text. Sechs Varianten — Neutral, Information, Erläuterung, Erfolg,
Warnung, Fehler. Wahlweise vom Leser wegklickbar.

```html
<infobox-widget infobox-config="b64:…"></infobox-widget>
```

## Konfiguration

Im Studio öffnet der Einstellungsdialog das Fenster **Infobox bearbeiten**
(Vollbild-Rahmen aus `@man/config-ui`): Inhalt, Gestaltung und Verhalten als
Formular, dazu die Vorschau in Desktop, Tablet und Mobil. Der Editor wird erst
nachgeladen, wenn ein Dialog das Feld zeigt; das Seitenbündel trägt nur Prüfung,
Status und Hilfe.

## Attribute

| Attribut | Typ | Bedeutung |
| --- | --- | --- |
| `infobox-config` | JSON (über `@shared/payload` kodiert) | `{ variant?, heading?, text?, dismissible? }` — jeder Schlüssel optional |
| `variant` | `default` \| `info` \| `explanation` \| `success` \| `warning` \| `error` | bis 0.1.0-rc.5: die Farbe des Kastens, Vorgabe `default` |
| `heading` | Zeichenkette | bis 0.1.0-rc.5: die fette erste Zeile |
| `text` | Zeichenkette | bis 0.1.0-rc.5: der Text darunter, Zeilenumbrüche bleiben erhalten |
| `dismissible` | Wahrheitswert | bis 0.1.0-rc.5: zeigt das Schließen-Kreuz, Vorgabe `true` |

Die Seite liest je Schlüssel: Wert aus `infobox-config`, sonst das alte
Attribut, sonst die Vorgabe. Eine Infobox ohne `infobox-config` sieht deshalb
aus wie bisher, und ein Schlüssel, den das Fenster im alten Dialog nicht lesen
konnte (Auswahlfelder des Content Designers), fehlt in `infobox-config`, bis
jemand ihn im Fenster ändert — bis dahin gilt das alte Attribut. Die alten
Felder bleiben im Schema und sind im eigenen Dialog ausgeblendet.

Sind Überschrift und Text beide leer, gibt das Widget nichts aus. Eine
unbekannte `variant` fällt auf `default` zurück und warnt in der Konsole.

Geschlossen wird nur für die Sitzung — nach dem Neuladen steht der Kasten
wieder da.

## Entwicklung

Dieses Repo wird vom Meta-Repo
[man-staffbase-cms-extensions](https://github.com/ps-mhp/man-staffbase-cms-extensions)
gebaut und ausgeliefert. Dort:

```bash
npm run build -- --env widget=infobox-widget   # bauen
npx jest src/widgets/infobox-widget            # testen
scripts/release.sh infobox-widget              # ausliefern
```
