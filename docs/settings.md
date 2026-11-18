# Einstellungen

Alles wird im Fenster **Infobox bearbeiten** gepflegt. Im Einstellungsdialog
selbst steht nur der Knopf, der es öffnet.

| Abschnitt | Einstellung | Vorgabe | Bedeutung |
| --- | --- | --- | --- |
| Inhalt | **Überschrift** | leer | Die fette erste Zeile. Darf leer bleiben. |
| Inhalt | **Text** | leer | Der Text darunter. Zeilenumbrüche bleiben erhalten. Darf leer bleiben. |
| Gestaltung | **Variante** | Neutral | Die Farbe des Kastens: Neutral, Information, Erläuterung, Erfolg, Warnung, Fehler. Jede Pill trägt einen Tupfer in der Farbe, die der Kasten auf der Seite bekommt. |
| Verhalten | **Schließen erlauben** | an | Zeigt das ✕ rechts oben. |

## Hinweise

- Überschrift und Text dürfen nicht beide leer sein — sonst gibt das Widget
  nichts aus. **Übernehmen** nennt dann oben im Status und unter dem Textfeld,
  was fehlt.
- **Übernehmen** schreibt in den Einstellungsdialog; gesichert wird erst mit
  dessen **Speichern**.
- Desktop, Tablet und Mobil zeigen die Infobox so, wie die Seite sie zeigt,
  zwischen einem Seitentitel und einem Absatz als Platzhalter. Die
  Einstellungen stehen dort rechts unter **Einstellungen**. Ist die Box leer,
  steht an ihrer Stelle ein gestrichelter Hinweis.
- Rückgängig und Wiederholen stehen oben im Fenster (⌘/Strg Z bzw. ⇧⌘/Strg Z).

## Infoboxen aus älteren Fassungen

Bis Version 0.1.0-rc.5 standen Variante, Überschrift, Text und Schließen als
einzelne Felder im Einstellungsdialog. Seither speichert das Fenster alles
zusammen im Attribut `infobox-config`; die alten Felder sind ausgeblendet,
ihre Werte bleiben aber stehen.

- Eine ältere Infobox sieht auf der Seite genau so aus wie bisher.
- Beim ersten Öffnen übernimmt das Fenster die alten Werte. Öffnen und
  **Übernehmen** ohne Änderung ändert nichts.
- Lässt sich ein altes Feld nicht lesen — im Content Designer betrifft das
  meist die **Variante** —, zeigt das Fenster dort keine Wahl und einen
  Hinweis darunter. Auf der Seite gilt dann weiter die bisherige Einstellung,
  bis im Fenster eine andere gewählt wird.
