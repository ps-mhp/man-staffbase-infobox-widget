# Infobox-Widget

Ein farbig hinterlegter Hinweiskasten für Staffbase: eine fette Zeile, darunter
ein kurzer Text. Fünf Varianten — Neutral, Information, Erfolg, Warnung,
Fehler. Wahlweise vom Leser wegklickbar.

```html
<infobox-widget
  variant="info"
  heading="Neue Essensausgabe"
  text="Die Kantine zieht ab dem 1. Dezember in Halle 4."
  dismissible="true"
></infobox-widget>
```

## Attribute

| Attribut | Typ | Vorgabe | Bedeutung |
| --- | --- | --- | --- |
| `variant` | `default` \| `info` \| `success` \| `warning` \| `error` | `default` | Die Farbe des Kastens |
| `heading` | Zeichenkette | leer | Die fette erste Zeile |
| `text` | Zeichenkette | leer | Der Text darunter, Zeilenumbrüche bleiben erhalten |
| `dismissible` | Wahrheitswert | `true` | Zeigt das Schließen-Kreuz |

Sind `heading` und `text` beide leer, gibt das Widget nichts aus. Eine
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
