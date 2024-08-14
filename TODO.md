# Lista TODO projektu RAG

1. [ ] Połączyć backend z ostatniego folderu z WhatsAppem
   - Zintegrować istniejący backend z API WhatsApp
   - Dostosować logikę obsługi zapytań do formatu wiadomości WhatsApp
- Główny mechanizm searcha jest w ostatnim folderze -> brać skrypt co działa NA BAZIE nie na PLIKU patrz *README_the_most_important.md* w tym folderze po więcej info.

2. [ ] Załadować masowo pliki PDF przez YABBA OCR w celu zmiany zdjęć na tekst
   - Zaimplementować integrację z YABBA OCR -> albo ręcznie przez ich apke desktopową albo API
   - Użyj skryptu do przetwarzania wsadowego plików PDF w *multi_parser* 

3. [ ] Przemielenie plików wszelakiej maści przez parser
   - Rozszerzyć istniejący parser o obsługę różnych formatów plików jeżeli zajdzie taka potrzeba

4. [ ] Załadowanie danych z folderów o różnych typach (np. .pdf) do odpowiadających im kolekcji
   - Użyć skrypt do automatycznego sortowania plików według typu w *multi_parser*
   - Zaimplementować logikę wstawiania danych do odpowiednich kolekcji w bazie danych:
        * TU WAŻNE -> zrobicie collections z nazwami odpowiadajacymi pdf dla ulatwienia składowania danych i USTALCIE JAK PARSUJECIE RESZTE TYPOW, bo kazdy parser inaczej dane zgarnia wiec jak chcecie format:
        `{pages: [{content: string, vector: []}]}` to trzeba to poprawic dla reszty typów

5. [ ] Poprawić search, żeby działał z plikami o różnych formatach / albo walnąć treść do jednego formatu
   - Ujednolicić format danych w bazie dla wszystkich typów plików
   - Dostosować algorytm wyszukiwania do obsługi różnych formatów lub ujednoliconego formatu -> tak albo dajemy to:
   `{pages: [{content: string, vector: []}]}` wszedzie albo sie bujacie z róznymi typami przeparsowanych danych i trzeba wtedy search troche zmienic

6. [ ] Uprościć strukturę danych do formatu "pages: content: vector:" wszędzie
   - Zmodyfikować schemat bazy danych
   - Zaktualizować wszystkie skrypty korzystające z bazy danych, aby używały nowej struktury

7. [ ] Połączyć ostatni folder (gdzie jest search w bazie, nie w pliku) z WhatsAppem
   - Dostosować prompt do kontekstu konwersacji WhatsApp
   - Zaimplementować możliwość regulacji ilości plików ściąganych z bazy po searchu (bazowo są dwa)

8. [ ] Dodatkowe sugestie w ramach dobrych praktyk:
   - Zaimplementować system logowania dla łatwiejszego debugowania
   - Dodać obsługę błędów i wyjątków
   - Stworzyć podstawową dokumentację dla każdego komponentu systemu
   - Zoptymalizować wydajność wyszukiwania (np. poprzez indeksowanie) -> mamy już ale nie wiem co będziecie robić z plikami np .csv gdzie bedzie wiecej informacji wiec to do ustalenia