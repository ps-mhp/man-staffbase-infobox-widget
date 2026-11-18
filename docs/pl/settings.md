# Ustawienia

Wszystkie ustawienia wprowadza się w oknie **Edytuj infobox**. W samym oknie dialogowym ustawień
znajduje się jedynie przycisk, który je otwiera.

| Sekcja | Ustawienie | Wartość domyślna | Znaczenie |
| --- | --- | --- | --- |
| Treść | **Nagłówek** | pusty | Pierwszy wiersz pogrubiony. Może pozostać pusty. |
| Treść | **Tekst** | pusty | Tekst poniżej. Złamania wierszy pozostają zachowane. Może pozostać pusty. |
| Wygląd | **Wariant** | Neutralny | Kolor ramki: neutralny, informacja, wyjaśnienie, sukces, ostrzeżenie, błąd. Każda pigułka ma kropkę w kolorze, jaki ramka otrzymuje na stronie. |
| Zachowanie | **Zezwól na zamknięcie** | włączone | Wyświetla znak ✕ w prawym górnym rogu. |

## Uwagi

- Nagłówek i tekst nie mogą być jednocześnie puste — w przeciwnym razie widget
  nie wyświetli niczego. **Zastosuj** wyświetla wówczas u góry w statusie oraz pod polem tekstowym
  informację o tym, czego brakuje.
- **Zastosuj** powoduje przejście do okna dialogowego ustawień; zapisywanie następuje dopiero po
  kliknięciu przycisku **Zapisz**.
- Komputery stacjonarne, tablety i urządzenia mobilne wyświetlają ramkę informacyjną tak, jak pokazuje ją strona,
  między tytułem strony a akapitem jako symbol zastępczy.
  Ustawienia znajdują się po prawej stronie w sekcji **Ustawienia**. Jeśli ramka jest pusta,
  w jej miejscu pojawia się przerywana wskazówka.
- Przyciski Cofnij i Powtórz znajdują się u góry okna (⌘/Ctrl Z lub ⇧⌘/Ctrl Z).

## Ramki informacyjne ze starszych wersji

Do wersji 0.1.0-rc.5 opcje Wariant, Nagłówek, Tekst i Zamknij były
oddzielnymi polami w oknie dialogowym ustawień. Od tego czasu okno zapisuje wszystko
razem w atrybucie `infobox-config`; stare pola są ukryte,
ale ich wartości pozostają niezmienione.

- Starsze okienko informacyjne wygląda na stronie dokładnie tak samo jak dotychczas.
- Przy pierwszym otwarciu okno przejmuje stare wartości. Otwarcie i
  **Zastosuj** bez wprowadzania zmian nie powoduje żadnych zmian.
- Jeśli stare pole jest nieczytelne — w Content Designerze dotyczy to
  najczęściej **wariantu** — okno nie wyświetla w tym miejscu opcji do wyboru, a poniżej pojawia się
  uwaga. Na stronie nadal obowiązuje dotychczasowe ustawienie,
  dopóki w oknie nie zostanie wybrane inne.
