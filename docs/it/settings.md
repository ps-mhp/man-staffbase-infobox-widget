# Impostazioni

Tutto viene gestito nella finestra **Modifica infobox**. Nella finestra di dialogo delle impostazioni
è presente solo il pulsante che la apre.

| Sezione | Impostazione | Predefinito | Significato |
| --- | --- | --- | --- |
| Contenuto | **Titolo** | vuoto | La prima riga in grassetto. Può rimanere vuota. |
| Contenuto | **Testo** | vuoto | Il testo sottostante. Le interruzioni di riga vengono mantenute. Può rimanere vuoto. |
| Aspetto | **Variante** | Neutro | Il colore del riquadro: Neutro, Informazione, Spiegazione, Successo, Avviso, Errore. Ogni pillola presenta un puntino del colore assegnato al riquadro nella pagina. |
| Comportamento | **Consenti chiusura** | attivo | Mostra la ✕ in alto a destra. |

## Note

- Il titolo e il testo non possono essere entrambi vuoti — altrimenti il widget
  non visualizza nulla. **Applica** indica quindi in alto nello stato e sotto il campo di testo
  ciò che manca.
- **Applica** inserisce i dati nella finestra di dialogo delle impostazioni; il salvataggio avviene solo con
  il pulsante **Salva**.
- Desktop, tablet e dispositivi mobili mostrano l’infobox così come appare nella pagina,
  tra il titolo della pagina e un paragrafo come segnaposto. Le
  impostazioni si trovano lì a destra sotto **Impostazioni**. Se l’infobox è vuota,
  al suo posto compare un’indicazione tratteggiata.
- Annulla e Ripeti si trovano nella parte superiore della finestra (⌘/Ctrl Z o ⇧⌘/Ctrl Z).

## Infobox delle versioni precedenti

Fino alla versione 0.1.0-rc.5, Variante, Titolo, Testo e Chiudi erano presenti come
campi separati nella finestra di dialogo delle impostazioni. Da allora, la finestra salva tutto
insieme nell’attributo `infobox-config`; i vecchi campi sono nascosti,
ma i loro valori rimangono invariati.

- Un riquadro informativo di versione precedente appare sulla pagina esattamente come prima.
- Alla prima apertura, la finestra riprende i valori precedenti. Aprire e
  **Applicare** senza apportare modifiche non cambia nulla.
- Se un vecchio campo non è leggibile — nel Content Designer ciò riguarda
  soprattutto la **variante** —, la finestra non mostra alcuna opzione in quel punto e visualizza un
  avviso sotto di esso. Nella pagina continua quindi a valere l’impostazione precedente,
  finché non ne viene selezionata un’altra nella finestra.
