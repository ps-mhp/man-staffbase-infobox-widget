# Settings

Everything is configured in the **Edit Infobox** window. The settings dialog
itself contains only the button that opens it.

| Section | Setting | Default | Meaning |
| --- | --- | --- | --- |
| Content | **Heading** | empty | The bold first line. May be left blank. |
| Content | **Text** | empty | The text below it. Line breaks are preserved. May be left blank. |
| Design | **Variant** | Neutral | The box’s color: Neutral, Information, Explanation, Success, Warning, Error. Each pill has a dot in the color assigned to the box on the page. |
| Behavior | **Allow Closing** | on | Displays the ✕ in the upper right corner. |

## Notes

- The heading and text must not both be empty—otherwise, the widget
  will not display anything. **Apply** then displays at the top of the status bar and below the text field
  what is missing.
- **Apply** opens the settings dialog; changes are not saved until you click
  **Save** there.
- Desktop, tablet, and mobile devices display the infobox exactly as the page displays it,
  as a placeholder between a page title and a paragraph. The
  settings are located on the right under **Settings**. If the box is empty,
  a dashed placeholder appears in its place.
- Undo and Redo are at the top of the window (⌘/Ctrl Z and ⇧⌘/Ctrl Z, respectively).

## Infoboxes from Older Versions

Up to version 0.1.0-rc.5, Variant, Heading, Text, and Close were
separate fields in the settings dialog. Since then, the window has stored everything
together in the `infobox-config` attribute; the old fields are hidden,
but their values remain.

- An older infobox appears on the page exactly as it did before.
- When opened for the first time, the window adopts the old values. Opening it and
  **Applying** without making changes does not alter anything.
- If an old field cannot be read—in the Content Designer, this usually affects
  the **Variant**—the window will not display a selection option there and will show a
  note below it. On the page, the previous setting will continue to apply
  until a different one is selected in the window.
