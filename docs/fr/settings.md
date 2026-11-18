# Paramètres

Tout est géré dans la fenêtre **Modifier l'infobox**. La boîte de dialogue des paramètres
elle-même ne contient que le bouton qui permet de l'ouvrir.

| Section | Paramètre | Valeur par défaut | Signification |
| --- | --- | --- | --- |
| Contenu | **Titre** | vide | La première ligne en gras. Peut rester vide. |
| Contenu | **Texte** | vide | Le texte situé en dessous. Les sauts de ligne sont conservés. Peut rester vide. |
| Mise en page | **Variante** | Neutre | La couleur de l'encadré : Neutre, Information, Explication, Succès, Avertissement, Erreur. Chaque pastille porte une tache de la couleur attribuée à l'encadré sur la page. |
| Comportement | **Autoriser la fermeture** | activé | Affiche le ✕ en haut à droite. |

## Remarques

- Le titre et le texte ne doivent pas être tous les deux vides — sinon, le widget
  n'affiche rien. **Appliquer** indique alors en haut dans l’état et sous le champ de texte
  ce qui manque.
- **Appliquer** ouvre la boîte de dialogue des paramètres ; la sauvegarde ne s’effectue qu’en cliquant sur
  son bouton **Enregistrer**.
- Sur ordinateur, tablette et mobile, la boîte d’information s’affiche telle que la page la présente,
  entre un titre de page et un paragraphe, en tant qu’espace réservé. Les
  paramètres se trouvent à droite sous **Paramètres**. Si la boîte est vide,
  une indication en pointillés apparaît à sa place.
- Les boutons **Annuler** et **Rétablir** se trouvent en haut de la fenêtre (⌘/Ctrl Z et ⇧⌘/Ctrl Z respectivement).

## Boîtes d’information des anciennes versions

Jusqu’à la version 0.1.0-rc.5, les champs Variante, Titre, Texte et Fermer figuraient
séparément dans la boîte de dialogue des paramètres. Depuis, la fenêtre enregistre tout
ensemble dans l’attribut `infobox-config` ; les anciens champs sont masqués,
mais leurs valeurs sont conservées.

- Une infobox plus ancienne s'affiche sur la page exactement comme auparavant.
- Lors de la première ouverture, la fenêtre reprend les anciennes valeurs. Ouvrir et
  **Appliquer** sans modification ne change rien.
- Si un ancien champ ne peut pas être lu — dans le Content Designer, cela concerne
  le plus souvent la **variante** —, la fenêtre n’affiche aucune option à cet endroit et une
  remarque en dessous. Sur la page, le paramètre précédent reste alors valable,
  jusqu’à ce qu’un autre soit sélectionné dans la fenêtre.
