# Instellingen

Alles wordt beheerd in het venster **Infobox bewerken**. In het instellingenvenster
zelf staat alleen de knop waarmee je het venster opent.

| Sectie | Instelling | Standaard | Betekenis |
| --- | --- | --- | --- |
| Inhoud | **Koptekst** | leeg | De vetgedrukte eerste regel. Mag leeg blijven. |
| Inhoud | **Tekst** | leeg | De tekst daaronder. Regeleinden blijven behouden. Mag leeg blijven. |
| Vormgeving | **Variant** | Neutraal | De kleur van het vak: Neutraal, Informatie, Toelichting, Succes, Waarschuwing, Fout. Elk bolletje heeft een stipje in de kleur die het vak op de pagina krijgt. |
| Gedrag | **Sluiten toestaan** | aan | Toont de ✕ rechtsboven. |

## Opmerkingen

- Kop en tekst mogen niet allebei leeg zijn — anders geeft de widget
  niets weer. **Toepassen** geeft dan bovenaan in de status en onder het tekstveld aan
  wat er ontbreekt.
- **Toepassen** vult het instellingenvenster in; het wordt pas opgeslagen met
  de knop **Opslaan** daarin.
- Desktop, tablet en mobiel tonen de infobox zoals de pagina deze weergeeft,
  tussen een paginatitel en een alinea als plaatshouder. De
  instellingen staan daar rechts onder **Instellingen**. Als de box leeg is,
  staat er in plaats daarvan een gestreepte aanduiding.
- Ongedaan maken en Opnieuw staan bovenaan in het venster (⌘/Ctrl Z resp. ⇧⌘/Ctrl Z).

## Infoboxen uit oudere versies

Tot versie 0.1.0-rc.5 stonden Variant, Kop, Tekst en Sluiten als
afzonderlijke velden in het instellingenvenster. Sindsdien slaat het venster alles
samen op in het attribuut `infobox-config`; de oude velden zijn verborgen,
maar hun waarden blijven behouden.

- Een oudere infobox ziet er op de pagina precies hetzelfde uit als voorheen.
- Bij de eerste keer openen neemt het venster de oude waarden over. Openen en
  **Toepassen** zonder wijzigingen brengt geen verandering teweeg.
- Als een oud veld niet kan worden gelezen — in de Content Designer betreft dit
  meestal de **variant** —, toont het venster daar geen keuze en een
  opmerking eronder. Op de pagina blijft dan de huidige instelling van kracht,
  totdat er in het venster een andere wordt geselecteerd.
