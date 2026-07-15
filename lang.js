/* ==========================================================================
   lang.js — CLAMA + KOLAŻ interface languages.
   Loaded by BOTH clama.html and collage.html (same folder, same file:// origin).

   How it works (no edits needed in the two HTML files beyond the <script> tag):
   - Polish stays the source of truth: every UI string in the code IS the key.
   - A MutationObserver walks the DOM and swaps text nodes + title/placeholder/
     label/alt attributes through the active dictionary. #stage, .el subtrees
     (canvas + template previews), inputs' values and contenteditable are
     NEVER touched — user content stays user content.
   - toast / geToast / askConfirm / uiConfirm / confirm are wrapped after load
     so composed messages ("Usunięto: X") translate via {x} patterns and
     clama's toast self-clear comparison keeps working.
   - Dictionary keys containing {x} are patterns: {x} matches lazily, captures
     are re-translated one level deep (so "2 za małe" inside a bigger message
     still translates).
   - Language choice lives in localStorage 'sallora-studio-lang' (shared by
     both tools + the embedded iframe; 'storage' events keep them in sync).
   - Custom languages: topbar 🌐 menu → "+ Dodaj język…" → manager window.
     "Pobierz szablon tłumaczenia" downloads a JSON of every key (EN values as
     a starting point); translate the values, load the file back, done.
     Stored in localStorage 'sallora-studio-userlangs'. Empty values fall back
     to Polish.
   - mode=render / mode=test: this file does nothing at all.
   ========================================================================== */
(function () {
  'use strict';

  var MODE = new URLSearchParams(location.search).get('mode');
  window.T = window.T || function (s) { return s; };
  window.TP = window.TP || function (s) { return s; };
  if (MODE === 'render' || MODE === 'test') return;

  var LS_LANG = 'sallora-studio-lang';
  var LS_ULANGS = 'sallora-studio-userlangs';

  /* ------------------------------------------------------------------ */
  /* English dictionary — Polish source string -> English.               */
  /* Keys with {x} are patterns (composed runtime messages).             */
  /* ------------------------------------------------------------------ */
  var EN = {
    /* --- CLAMA top bar --- */
    "Kolaż — układanie zdjęć w siatce (wraca się przyciskiem „Edytor\")": "Collage — arrange photos in a grid (return with the \"Editor\" button)",
    "Kolaż": "Collage",
    "Szablony — otwórz galerię": "Templates — open the gallery",
    "Szablony": "Templates",
    "Nowy — pusty projekt, tylko białe tło": "New — empty project, just a white background",
    "Nowy": "New",
    "Reset — przywróć szablon startowy": "Reset — restore the starting template",
    "Cofnij (Ctrl+Z)": "Undo (Ctrl+Z)",
    "Ponów (Ctrl+Y)": "Redo (Ctrl+Y)",
    "Wyśrodkuj w poziomie": "Center horizontally",
    "Wyśrodkuj w pionie": "Center vertically",
    "Format pliku": "File format",
    "Pobierz": "Download",
    "Pokaż / ukryj panel": "Show / hide panel",
    "Pomoc": "Help",
    /* mobile menu ☰ (topbar) */
    "Pobierz PNG": "Download PNG",
    "Pobierz JPG": "Download JPG",

    /* --- left toolbar --- */
    "Tekst": "Text",
    "Linia": "Line",
    "Kształt": "Shape",
    "Obraz…": "Image…",
    "Obraz": "Image",
    "Rozwiń / zwiń": "Expand / collapse",
    "Zwiń panel": "Collapse panel",

    /* --- right panel --- */
    "Elementy": "Elements",
    "Właściwości": "Properties",
    "Pusto — dodaj element z lewego paska.": "Empty — add an element from the left bar.",

    /* --- context menu / confirms --- */
    "Edytuj tekst": "Edit text",
    "Duplikuj": "Duplicate",
    "Warstwa wyżej": "Layer up",
    "Warstwa niżej": "Layer down",
    "Usuń": "Delete",
    "Anuluj": "Cancel",
    "Tak": "Yes",
    "Na pewno?": "Are you sure?",

    /* --- template gallery --- */
    "Zapisz bieżący jako szablon": "Save current as template",
    "Import .json": "Import .json",
    "Eksport .json": "Export .json",
    "Zamknij (Esc)": "Close (Esc)",
    "Nazwa szablonu": "Template name",
    "Zapisz": "Save",
    "Zastąp": "Replace",
    "Usuń szablon": "Delete template",
    "Usunąć szablon \"{n}\"?": "Delete template \"{n}\"?",
    "Usunięto: {n}": "Deleted: {n}",
    "Wczytano: {n}": "Loaded: {n}",
    "Zapisano szablon: {n}": "Template saved: {n}",
    "Zaimportowano": "Imported",
    "Błędny plik JSON": "Invalid JSON file",
    "Podaj nazwę szablonu.": "Enter a template name.",
    "„{n}\" to szablon wbudowany — zmień nazwę.": "\"{n}\" is a built-in template — choose another name.",
    "Szablon „{n}\" już istnieje — zostanie zastąpiony.": "Template \"{n}\" already exists — it will be replaced.",
    "Poradnik — naszyjniki": "Guide — necklaces",
    "Pusty — z logo": "Blank — with logo",

    /* --- new / reset / image swap --- */
    "Nowy projekt — wszystkie elementy zostaną usunięte, zostanie tylko białe tło.": "New project — every element will be removed, only a white background stays.",
    "Tak, nowy": "Yes, new",
    "Nowy projekt (Ctrl+Z cofa)": "New project (Ctrl+Z undoes)",
    "Reset — bieżący projekt zostanie zastąpiony szablonem startowym.": "Reset — the current project will be replaced with the starting template.",
    "Tak, resetuj": "Yes, reset",
    "Przywrócono szablon startowy (Ctrl+Z cofa)": "Starting template restored (Ctrl+Z undoes)",
    "Podmieniono obraz": "Image replaced",
    "Podmienić zaznaczony obraz? (Anuluj = dodaj nowy)": "Replace the selected image? (Cancel = add a new one)",
    "Skopiowano: {n}": "Copied: {n}",
    "Nowy tekst": "New text",

    /* --- properties: canvas group --- */
    "Płótno": "Canvas",
    "Tło": "Background",
    "Tło płótna": "Canvas background",
    "Rozmiar": "Size",
    "— własny rozmiar —": "— custom size —",
    "Szer.": "Width",
    "Wys.": "Height",
    "1000 × 2100 — pin długi": "1000 × 2100 — long pin",
    "1080 × 1080 — post kwadrat": "1080 × 1080 — square post",
    "1080 × 566 — post poziomy": "1080 × 566 — landscape post",
    "1200 × 630 — post z linkiem (OG)": "1200 × 630 — link post (OG)",
    "820 × 312 — cover strony": "820 × 312 — page cover",
    "1920 × 1080 — baner 16:9": "1920 × 1080 — banner 16:9",
    "Sklep": "Shop",
    "2048 × 2048 — zdjęcie produktu": "2048 × 2048 — product photo",
    "Wydruk 300 dpi": "Print 300 dpi",
    "2480 × 3508 — A4 pion": "2480 × 3508 — A4 portrait",
    "3508 × 2480 — A4 poziom": "3508 × 2480 — A4 landscape",
    "1748 × 2480 — A5 pion": "1748 × 2480 — A5 portrait",
    "1063 × 591 — wizytówka 90 × 50 mm": "1063 × 591 — business card 90 × 50 mm",
    "Inne": "Other",
    "1000 × 1000 — kwadrat": "1000 × 1000 — square",

    /* --- properties: element groups --- */
    "Nazwa": "Name",
    "Podmień obraz…": "Replace image…",
    "Pozycja i rozmiar": "Position and size",
    "Obrót °": "Rotation °",
    "Zmieniaj proporcjonalnie": "Resize proportionally",
    "Wygląd": "Appearance",
    "Cień": "Shadow",
    "Obrys": "Outline",
    "nie": "no",
    "tak": "yes",
    "Rozmycie": "Blur",
    "Krycie %": "Opacity %",
    "Grubość": "Weight",
    "Kolor": "Color",
    "Font": "Font",
    "Interlinia": "Line height",
    "Pogrubienie": "Bold",
    "Kursywa": "Italic",
    "Wyrówn.": "Align",
    "Do lewej": "Left",
    "Do środka": "Center",
    "Do prawej": "Right",
    "Odstęp": "Spacing",
    "Figura": "Figure",
    "Prostokąt": "Rectangle",
    "Gwiazda": "Star",
    "Ramiona": "Points",
    "Wcięcie %": "Inner %",
    "Zaokrągl.": "Rounding",
    "Styl": "Style",
    "Ciągła": "Solid",
    "Kreskowana": "Dashed",
    "Kropkowana": "Dotted",
    "Kreska-kropka": "Dash-dot",
    "Kreska": "Dash",
    "Przerwa": "Gap",
    "Końce": "Caps",
    "Płaskie": "Flat",
    "Zaokrąglone": "Round",
    "Kwadratowe": "Square",
    "Kadr": "Crop",
    "Cały obraz (auto)": "Whole image (auto)",
    "Wypełnij ramkę": "Fill frame",
    "Zmieść w ramce": "Fit in frame",
    "Poz. X %": "Pos. X %",
    "Poz. Y %": "Pos. Y %",
    "Jasność %": "Brightness %",
    "Kontrast %": "Contrast %",
    "Nasycenie %": "Saturation %",

    /* --- Filtry strip (ready-made filter presets; scope = photo / whole picture) --- */
    "Filtry": "Filters",
    "Oryginał": "Original",
    "Czarno-biały": "Black & white",
    "Sepia": "Sepia",
    "Ciepły": "Warm",
    "Chłodny": "Cool",
    "Wyblakły": "Faded",
    "Cała grafika": "Whole graphic",
    "Ulubione — Sallora": "Favorites — Sallora",
    "Pozostałe": "Others",
    "Własne": "Custom",
    "+ Własne fonty…": "+ Custom fonts…",

    /* --- built-in template element names (display only) --- */
    "Tytuł": "Title",
    "Tytuł pinu": "Pin title",
    "Zdjęcie": "Photo",
    "Miejsce na zdjęcie": "Photo placeholder",
    "Podpis": "Caption",
    "Adres": "Address",

    /* --- color popover --- */
    "Wybierz własny kolor": "Pick a custom color",
    "Kod hex": "Hex code",
    "Pipeta — pobierz kolor z ekranu": "Eyedropper — pick a color from the screen",
    "Zapisane": "Saved",
    "Zapisz bieżący kolor": "Save current color",
    "Ostatnie": "Recent",
    "— pusto —": "— empty —",
    "Usunąć kolor {c} z zapisanych?": "Remove color {c} from saved?",
    "Zapisano kolor: {c}": "Color saved: {c}",
    "Zapisano {c} (najstarszy wypadł z listy)": "Saved {c} (the oldest dropped off the list)",
    "Pipeta działa tylko w Chrome/Edge": "The eyedropper only works in Chrome/Edge",

    /* --- custom fonts window --- */
    "Własne fonty": "Custom fonts",
    "Dodaj plik fontu…": "Add a font file…",
    "Nazwa fontu": "Font name",
    "Dodaj font": "Add font",
    "Dodaj jako 700": "Add as 700",
    "Podaj nazwę fontu.": "Enter a font name.",
    "„{n}\" już jest wbudowany — zmień nazwę.": "\"{n}\" is already built in — choose another name.",
    "Font „{n}\" już istnieje — ten plik zastąpi jego pogrubienie (700).": "Font \"{n}\" already exists — this file will replace its bold (700).",
    "Font „{n}\" już istnieje — ten plik zostanie dodany jako pogrubienie (700).": "Font \"{n}\" already exists — this file will be added as its bold (700).",
    "Usunąć font \"{n}\"?": "Delete font \"{n}\"?",
    "Font \"{n}\" usunięty": "Font \"{n}\" deleted",
    "Font \"{n}\" dodany ({w})": "Font \"{n}\" added ({w})",
    "Plik za duży (max 5 MB)": "File too big (max 5 MB)",
    "Nie udało się odczytać — to nie jest plik fontu?": "Could not read it — is this not a font file?",
    "Brak miejsca w przeglądarce — usuń któryś własny font": "No space left in the browser — delete one of your custom fonts",
    "Brak własnych fontów. „Dodaj plik fontu…\" wczyta plik z dysku — font pojawi się w grupie „Własne\" na liście fontów.": "No custom fonts yet. \"Add a font file…\" loads a file from disk — the font will appear in the \"Custom\" group of the font list.",
    "Obsługiwane pliki: TTF · OTF · WOFF · WOFF2. Drugi plik pod tą samą nazwą = pogrubienie (700). Fonty zapisują się w tej przeglądarce.": "Supported files: TTF · OTF · WOFF · WOFF2. A second file under the same name = bold (700). Fonts are saved in this browser.",

    /* --- export --- */
    "Renderuję…": "Rendering…",
    "Gotowe — sprawdź folder Pobrane": "Done — check your Downloads folder",
    "Błąd renderowania: {e}": "Render error: {e}",

    /* --- Kolaż bridge (clama side) --- */
    "Kolaż wstawiony (Ctrl+Z cofa)": "Collage inserted (Ctrl+Z undoes)",
    "Gotowy kolaż z okna „Kolaż\" — wstawić go na płótno jako obraz?": "A finished collage from the \"Collage\" window — insert it onto the canvas as an image?",
    "Wstaw": "Insert",

    /* --- help window: tabs --- */
    "Klawiatura": "Keyboard",
    "Eksport": "Export",
    "Gotowe": "Done",

    /* --- help window: start --- */
    "Clama tworzy grafiki Sallory — piny, posty, stories. Cały przepływ w pięciu krokach:": "Clama makes Sallora's graphics — pins, posts, stories. The whole flow in five steps:",
    "1 · Wybierz szablon": "1 · Pick a template",
    "Przycisk „Szablony” w górnym pasku otwiera galerię — klik na kartę wczytuje projekt.": "The \"Templates\" button in the top bar opens the gallery — clicking a card loads the project.",
    "2 · Podmień treść": "2 · Swap the content",
    "Tekst edytujesz z menu prawego przycisku („Edytuj tekst”) albo klawiszem Enter. Zdjęcie przeciągnij z dysku prosto na płótno.": "Edit text from the right-click menu (\"Edit text\") or with Enter. Drag a photo from disk straight onto the canvas.",
    "3 · Ułóż elementy": "3 · Arrange the elements",
    "Przeciągaj, rozciągaj za uchwyty, obracaj kółkiem nad elementem. Czerwone linie same wyrównują.": "Drag, stretch by the handles, rotate with the ring above the element. The red lines align things for you.",
    "4 · Zapisz układ": "4 · Save the layout",
    "W galerii „Zapisz bieżący jako szablon” — projekt zostaje na tym komputerze.": "In the gallery, \"Save current as template\" — the project stays on this computer.",
    "5 · Pobierz PNG lub JPG": "5 · Download PNG or JPG",
    "Format wybierasz na liście obok przycisku. Gotowa grafika w pełnym rozmiarze trafia do folderu Pobrane.": "Pick the format in the list next to the button. The finished full-size graphic lands in your Downloads folder.",
    "Każda zakładka po lewej opisuje jedną część dokładniej.": "Each tab on the left describes one part in more detail.",

    /* --- help window: canvas --- */
    "Przesuwanie i przyciąganie": "Moving and snapping",
    "Złap element i przeciągnij. Czerwone linie to przyciąganie — do środka, marginesów i innych elementów. Z wciśniętym Alt przyciąganie jest wyłączone.": "Grab an element and drag. The red lines are snapping — to the center, the margins and other elements. Hold Alt to turn snapping off.",
    "Rozciąganie": "Resizing",
    "Uchwyty na bokach i narożnikach zaznaczenia. Narożnik tekstu skaluje razem z szerokością także czcionkę; obraz w trybie „Cały obraz\" trzyma proporcje, w ramce (Kadr) rozciąga się swobodnie.": "Handles on the sides and corners of the selection. A text corner scales the font together with the width; an image in \"Whole image\" mode keeps its proportions, in a frame (Crop) it stretches freely.",
    "Obrót": "Rotation",
    "Kółko nad zaznaczonym elementem. Kąt przyciąga do 45°; z Alt obrót jest płynny. Dokładną wartość wpiszesz w polu „Obrót °” w panelu.": "The ring above the selected element. The angle snaps to 45°; with Alt rotation is smooth. Type an exact value in the \"Rotation °\" field in the panel.",
    "Zaznaczanie": "Selecting",
    "Klik zaznacza element, klik na puste płótno odznacza. Element można też wybrać z listy „Elementy” po prawej.": "Click selects an element, clicking empty canvas deselects. You can also pick an element from the \"Elements\" list on the right.",
    "Tło, rozmiar i zoom": "Background, size and zoom",
    "Gdy nic nie jest zaznaczone, prawy panel pokazuje grupę „Płótno” — tam ustawisz tło i rozmiar. Lista rozmiarów jest pogrupowana wg kanałów (Pinterest, Instagram, Facebook / www, sklep, wydruk 300 dpi), a pola Szer. / Wys. przyjmują dowolny własny rozmiar (od 50 px). Suwak zoomu (15–200%) został w górnym pasku; dwuklik na element przybliża go i ustawia na środku widoku. Zoom nie wpływa na eksport.": "When nothing is selected, the right panel shows the \"Canvas\" group — set the background and size there. The size list is grouped by channel (Pinterest, Instagram, Facebook / www, shop, 300 dpi print), and the Width / Height fields accept any custom size (from 50 px). The zoom slider (15–200%) lives in the top bar; double-clicking an element zooms it to the center of the view. Zoom does not affect export.",

    /* --- help window: elements --- */
    "Dodawanie": "Adding",
    "Lewy pasek: Tekst, Linia, Kształt, Obraz. Plik graficzny można też upuścić z dysku prosto na płótno.": "The left bar: Text, Line, Shape, Image. You can also drop an image file from disk straight onto the canvas.",
    "Warstwy": "Layers",
    "Lista „Elementy” w prawym panelu — im wyżej na liście, tym bliżej wierzchu grafiki. Przeciągnij kartę wyżej / niżej, aby zmienić kolejność; to samo zrobią strzałki „Warstwa wyżej / niżej” w menu prawego przycisku myszy. Dwuklik na kartę przybliża element na płótnie, a karta zaznaczonego elementu sama przewija się do widoku.": "The \"Elements\" list in the right panel — the higher on the list, the closer to the front of the graphic. Drag a card up / down to change the order; the \"Layer up / down\" arrows in the right-click menu do the same. Double-clicking a card zooms to the element on the canvas, and the selected element's card scrolls itself into view.",
    "Prawy panel: pozycja, szerokość, obrót; dla tekstu font, grubość, pogrubienie, kursywa, rozmiar, odstępy, kolor, obrys (kontur liter) i cień; dla kształtu figura (prostokąt / gwiazda), zaokrąglenie, kolor i cień; dla obrazu Kadr (Cały obraz / Wypełnij ramkę / Zmieść w ramce — „Wypełnij\" kadruje zdjęcie w ramce, Poz. X/Y % przesuwa kadr), filtry (Jasność / Kontrast / Nasycenie %) i zaokrąglenie rogów. Każdy element ma też „Krycie %\" — przezroczystość (100 = pełny, 0 = niewidoczny).": "The right panel: position, width, rotation; for text — font, weight, bold, italic, size, spacing, color, outline (letter contour) and shadow; for a shape — figure (rectangle / star), rounding, color and shadow; for an image — Crop (Whole image / Fill frame / Fit in frame — \"Fill\" crops the photo inside the frame, Pos. X/Y % moves the crop), filters (Brightness / Contrast / Saturation %) and corner rounding. Every element also has \"Opacity %\" — transparency (100 = solid, 0 = invisible).",
    "Znaczniki w tekście": "Tags in text",
    "Fragment tekstu wyróżnisz znacznikami (jak w Unity) — wpisujesz je w polu Tekst albo podczas edycji na płótnie; można je zagnieżdżać. Znacznik działa tylko jako kompletna, poprawnie zamknięta para — niezamknięty pozostaje zwykłym tekstem. Działają:": "Highlight a fragment of text with tags (like in Unity) — type them in the Text field or while editing on the canvas; they can be nested. A tag only works as a complete, correctly closed pair — an unclosed one stays plain text. These work:",
    "<b>tekst</b>": "<b>text</b>",
    "<i>tekst</i>": "<i>text</i>",
    "<size=48>tekst</size>": "<size=48>text</size>",
    "<color=#b4593f>tekst</color>": "<color=#b4593f>text</color>",
    "<color=red>tekst</color>": "<color=red>text</color>",
    "pogrubienie fragmentu": "bold fragment",
    "kursywa": "italic",
    "rozmiar fragmentu w px": "fragment size in px",
    "kolor fragmentu — hex": "fragment color — hex",
    "kolor — nazwa CSS (red, white…)": "color — CSS name (red, white…)",
    "Menu elementu": "Element menu",
    "Prawy przycisk myszy na elemencie — na płótnie lub na liście „Elementy”: duplikuj, usuń, warstwa wyżej / niżej (strzałki). Gdy element jest na samej górze, „Warstwa wyżej” jest nieaktywna — analogicznie na dole. Wyśrodkowanie w poziomie i w pionie to dwa przyciski w górnym pasku.": "Right-click an element — on the canvas or in the \"Elements\" list: duplicate, delete, layer up / down (arrows). When an element is at the very top, \"Layer up\" is inactive — same at the bottom. Centering horizontally and vertically are two buttons in the top bar.",

    /* --- help window: keyboard --- */
    "przesuwają element o 1 px": "move the element by 1 px",
    "strzałki": "arrows",
    "przesuwają o 10 px": "move by 10 px",
    "Dwuklik": "Double-click",
    "przybliża element na środek widoku": "zooms the element to the center of the view",
    "edycja zaznaczonego tekstu": "edit the selected text",
    "usuwa zaznaczony element": "deletes the selected element",
    "cofa — do 60 kroków": "undo — up to 60 steps",
    "ponawia cofniętą zmianę (także Ctrl + Shift + Z)": "redoes the undone change (also Ctrl + Shift + Z)",
    "kopiuje zaznaczony element": "copies the selected element",
    "wkleja kopię — każde kolejne wklejenie z przesunięciem": "pastes a copy — each next paste is offset",
    "+ przeciąganie": "+ drag",
    "wyłącza przyciąganie do linii": "turns off snapping to lines",
    "+ obrót": "+ rotation",
    "wyłącza skok co 45°": "turns off the 45° steps",
    "zamyka to okno i galerię szablonów": "closes this window and the template gallery",

    /* --- help window: templates + export --- */
    "Galeria": "Gallery",
    "Przycisk „Szablony” w górnym pasku. Karty pokazują podgląd; klik wczytuje szablon (Ctrl+Z cofa wczytanie).": "The \"Templates\" button in the top bar. Cards show a preview; a click loads the template (Ctrl+Z undoes the load).",
    "Zapisywanie": "Saving",
    "„Zapisz bieżący jako szablon” w oknie galerii. Szablony żyją w tej przeglądarce, na tym komputerze.": "\"Save current as template\" in the gallery window. Templates live in this browser, on this computer.",
    "Import i eksport .json": "Import and export .json",
    "Ikonka na karcie eksportuje szablon do pliku; „Import .json” wczytuje go z powrotem — np. na innym komputerze.": "The icon on a card exports the template to a file; \"Import .json\" loads it back — e.g. on another computer.",
    "Usuwanie": "Deleting",
    "Ikonka kosza na karcie usuwa zapisany szablon. Wbudowanych szablonów nie da się usunąć.": "The trash icon on a card deletes a saved template. Built-in templates cannot be deleted.",
    "Pobierz PNG / JPG": "Download PNG / JPG",
    "Przycisk po prawej w górnym pasku; format (PNG lub JPG) wybierasz na liście obok. Grafika renderuje się w pełnym rozmiarze płótna, niezależnie od zoomu. PNG = pełna jakość; JPG = mniejszy plik.": "The button on the right of the top bar; pick the format (PNG or JPG) in the list next to it. The graphic renders at the full canvas size, regardless of zoom. PNG = full quality; JPG = smaller file.",
    "Gdzie ląduje plik": "Where the file lands",
    "W folderze Pobrane. Nazwa pliku = nazwa szablonu + wymiary, np. poradnik-naszyjniki-1000x1500.png (albo .jpg).": "In the Downloads folder. File name = template name + dimensions, e.g. poradnik-naszyjniki-1000x1500.png (or .jpg).",
    "Wszystko offline": "Everything offline",
    "Clama działa w całości na tym komputerze — czcionki i obrazy są wbudowane, nic nie wychodzi do sieci.": "Clama runs entirely on this computer — the fonts and images are built in, nothing goes out to the network.",

    /* --- KOLAŻ: top bar --- */
    "Wróć do edytora Clama (kolaż zostaje, wrócisz do niego)": "Back to the Clama editor (the collage stays, you can come back to it)",
    "Edytor": "Editor",
    "Nowy kolaż": "New collage",
    "Pokaż kolaż na czysto — bez oznaczeń": "Show the collage clean — no markings",
    "Podgląd": "Preview",
    "Wyślij kolaż do Clamy — pojawi się tam do wstawienia jako obraz": "Send the collage to Clama — it will appear there ready to insert as an image",
    "Do Clamy": "To Clama",
    "+ Dodaj zdjęcia": "+ Add photos",

    /* --- KOLAŻ: panel --- */
    "Układ": "Layout",
    "Okno z miniaturą kolażu — klikasz komórki i scalasz, łączysz, przecinasz lub rozdzielasz": "A window with a miniature of the collage — click cells and merge, link, cut or ungroup them",
    "Scal i połącz…": "Merge & link…",
    "Scal i połącz": "Merge & link",
    "W oknie „Scal i połącz” klikasz komórki na miniaturze — bez Ctrl — i jednym przyciskiem scalasz je w jedną albo dajesz im wspólne zdjęcie.": "In the \"Merge & link\" window you click cells on the miniature — no Ctrl — and one button merges them into one or gives them a shared photo.",
    "Linie": "Lines",
    "Całe płótno: proporcje, szerokość zapisywanego pliku i tło — tło widać w pustych komórkach i przez półprzezroczyste linie (Krycie)": "The whole canvas: aspect ratio, saved-file width and background — the background shows in empty cells and through semi-transparent lines (Opacity)",
    "Proporcje": "Ratio",
    "2:3 — pion": "2:3 — portrait",
    "1:1 — kwadrat": "1:1 — square",
    "Eksport px": "Export px",
    "Szerokość zapisywanego pliku (px)": "Width of the saved file (px)",
    "Zdjęcie tła…": "Background photo…",
    "Usuń tło": "Remove background",
    "Zaznaczone zdjęcie": "Selected photo",
    "Przeciągnij zdjęcie = przesuwanie · kółko = zoom · pierścień: po łuku = obrót, odciągnij = zoom (100 px = ×2) · prawy klik = menu": "Drag the photo = pan · wheel = zoom · ring: along the arc = rotate, pull away = zoom (100 px = ×2) · right-click = menu",
    "Zamień zdjęcie": "Replace photo",
    "Zamień zdjęcie…": "Replace photo…",
    "Potem kliknij zdjęcie, z którym zamienić": "Then click the photo to swap with",
    "Miejscami": "Swap",
    "Zamień miejscami…": "Swap places…",
    "Usuń zdjęcie": "Remove photo",
    "Kolor linii": "Line color",

    /* --- KOLAŻ: grid window --- */
    "Odznacz wszystkie komórki": "Deselect all cells",
    "Zaznaczone komórki staną się JEDNĄ komórką (muszą razem tworzyć prostokąt)": "The selected cells become ONE cell (together they must form a rectangle)",
    "Scal w jedną": "Merge into one",
    "Zaznaczone komórki pokażą jedno wspólne zdjęcie — linie między nimi zostają": "The selected cells will show one shared photo — the lines between them stay",
    "Wspólne zdjęcie": "Shared photo",
    "Każda z zaznaczonych komórek znów ze swoim zdjęciem": "Each selected cell gets its own photo again",
    "Rozdziel": "Ungroup",
    "Rozdziel grupę": "Ungroup",
    "Przetnij każdą zaznaczoną komórkę na dwie: górną i dolną": "Cut each selected cell into two: top and bottom",
    "Góra i dół": "Top & bottom",
    "Przetnij każdą zaznaczoną komórkę na dwie obok siebie": "Cut each selected cell into two side by side",
    "Obok siebie": "Side by side",
    "Klik na miniaturze = zaznacz / odznacz komórkę (złota ramka). Ctrl+klik na dużym kolażu robi to samo.": "Click on the miniature = select / deselect a cell (gold frame). Ctrl+click on the big collage does the same.",
    "zaznaczone: {n}": "selected: {n}",
    "Zaznacz co najmniej 2 komórki": "Select at least 2 cells",
    "Zaznaczone komórki muszą razem tworzyć prostokąt": "The selected cells must form a rectangle together",
    "Tego układu nie da się tak scalić": "This layout cannot be merged like that",
    "Scalono komórki: {n} → 1": "Merged cells: {n} → 1",
    "Wspólne zdjęcie dla komórek: {n}": "Shared photo for {n} cells",
    "Nic z zaznaczonych nie jest połączone": "None of the selected cells are linked",
    "Rozdzielono grupy: {n}": "Ungrouped: {n}",
    "Zaznacz komórkę na miniaturze": "Select a cell on the miniature",
    "Za małe komórki — nie da się ich już przeciąć": "Cells too small — they cannot be cut any further",
    "Limit kolażu: {n} komórek": "Collage limit: {n} cells",
    "Przecięto: {n} · pominięto: {m}": "Cut: {n} · skipped: {m}",
    "{n} za małe": "{n} too small",
    "limit {n} komórek": "limit of {n} cells",
    "Przecięto komórki: {n}": "Cells cut: {n}",

    /* --- KOLAŻ: photos, tray, messages --- */
    "To zdjęcie nie jest połączone": "This photo is not linked",
    "Najpierw kliknij zdjęcie": "Click a photo first",
    "Kliknij zdjęcie, z którym zamienić (Esc = anuluj)": "Click the photo to swap with (Esc = cancel)",
    "Zamiana anulowana": "Swap canceled",
    "Najpierw dodaj zdjęcie do kolażu": "Add a photo to the collage first",
    "Eksport nie powiódł się": "Export failed",
    "Pobrano: {f}": "Downloaded: {f}",
    "Przeciągnij na komórkę · klik = do zaznaczonej · prawy klik = menu": "Drag onto a cell · click = into the selected cell · right-click = menu",
    "Do zaznaczonej komórki": "Into the selected cell",
    "Najpierw kliknij komórkę w kolażu": "Click a cell in the collage first",
    "Usuń z półki": "Remove from the shelf",
    "Usunąć to zdjęcie z półki?": "Remove this photo from the shelf?",
    "Nie udało się otworzyć zdjęcia": "Could not open the photo",
    "Zdjęcia na półce — przeciągnij je na komórki": "Photos on the shelf — drag them onto the cells",
    "Ustaw jako tło": "Set as background",
    "Wyprostuj (0°)": "Straighten (0°)",
    "Dodaj zdjęcie…": "Add photo…",
    "Dwa — góra / dół": "Two — top / bottom",
    "Dwa — obok siebie": "Two — side by side",
    "Trzy rzędy": "Three rows",
    "Cztery": "Four",
    "Duże + dwa małe": "Big + two small",
    "Duże + trzy": "Big + three",
    "Kliknij pustą komórkę, aby dodać zdjęcie · pierścień = obrót i zoom · uchwyt na linii = siatka": "Click an empty cell to add a photo · ring = rotate & zoom · grip on a line = grid",
    "Nie ma czego cofnąć": "Nothing to undo",
    "Nie ma czego ponowić": "Nothing to redo",
    "Kliknij najpierw komórkę, albo przeciągnij zdjęcie na nią": "Click a cell first, or drag a photo onto it",
    "Zmiana szablonu": "Template change",
    "Zastąpić obecny układ szablonem „{n}”? Ctrl+Z przywróci poprzedni.": "Replace the current layout with the \"{n}\" template? Ctrl+Z brings the previous one back.",
    "Zastosuj": "Apply",
    "Nowy kolaż (Ctrl+Z przywraca poprzedni)": "New collage (Ctrl+Z brings the previous one back)",
    "Zacząć od nowa? Obecny kolaż zostanie wyczyszczony. Ctrl+Z przywróci poprzedni.": "Start over? The current collage will be cleared. Ctrl+Z brings the previous one back.",
    "Zacznij od nowa": "Start over",
    "Nie udało się przekazać (za duży) — Pobierz plik i przeciągnij go do Clamy": "Could not hand it over (too big) — Download the file and drag it into Clama",
    "Wysłano do Clamy — otwórz Clamę, kolaż czeka tam na wstawienie": "Sent to Clama — open Clama, the collage is waiting there to be inserted",
    "Podgląd — kliknij płótno, aby wrócić": "Preview — click the canvas to go back",
    "Jedno ze zdjęć nie dało się wczytać": "One of the photos could not be loaded",
    "Zdjęcia od Manoni wczytane — przestaw je, jak chcesz": "Photos from Manoni loaded — arrange them as you like",

    /* --- language UI itself --- */
    "Język": "Language",
    "Języki": "Languages",
    "+ Dodaj język…": "+ Add a language…",
    "Pobierz szablon tłumaczenia": "Download translation template",
    "Wczytaj plik języka…": "Load a language file…",
    "Usunąć język \"{n}\"?": "Delete language \"{n}\"?",
    "Język \"{n}\" wczytany": "Language \"{n}\" loaded",
    "Język \"{n}\" usunięty": "Language \"{n}\" deleted",
    "Błędny plik języka": "Invalid language file",
    "Brak miejsca w przeglądarce — usuń któryś język": "No space left in the browser — delete one of the languages",
    "Szablon zapisany — sprawdź folder Pobrane": "Template saved — check your Downloads folder",
    "Brak dodanych języków. „Pobierz szablon tłumaczenia\" zapisze plik JSON ze wszystkimi tekstami — przetłumacz wartości i wczytaj plik z powrotem.": "No added languages yet. \"Download translation template\" saves a JSON file with every text — translate the values and load the file back.",
    "Plik języka = JSON z szablonu. Wartości puste zostają po polsku. Języki zapisują się w tej przeglądarce.": "A language file = the JSON from the template. Empty values stay in Polish. Languages are saved in this browser.",
    "wpisów": "entries"
  };

  /* ------------------------------------------------------------------ */
  /* translation engine                                                  */
  /* ------------------------------------------------------------------ */
  var cur = 'pl';
  var exact = null;   // Map or null (pl = identity)
  var pats = null;    // [{re, out}]
  var everApplied = false;

  function userLangs() { try { return JSON.parse(localStorage.getItem(LS_ULANGS)) || {}; } catch (e) { return {}; } }

  function compile(strings) {
    exact = new Map(); pats = [];
    for (var k in strings) {
      var v = strings[k];
      if (!v || typeof v !== 'string') continue;
      if (k.indexOf('{') >= 0) {
        var src = '^' + k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\\{[a-z]+\\\}/g, '(.+?)') + '$';
        try { pats.push({ re: new RegExp(src), out: v }); } catch (e) {}
      } else {
        exact.set(k, v);
      }
    }
    pats.sort(function (a, b) { return b.re.source.length - a.re.source.length; });
  }

  function trPart(s, depth) {
    if (!exact || !s) return s;
    var hit = exact.get(s);
    if (hit) return hit;
    for (var i = 0; i < pats.length; i++) {
      var m = pats[i].re.exec(s);
      if (m) {
        var caps = [];
        for (var c = 1; c < m.length; c++)
          caps.push(depth < 2 ? trCapture(m[c], depth + 1) : m[c]);
        var j = 0;
        return pats[i].out.replace(/\{[a-z]+\}/g, function () { return j < caps.length ? caps[j++] : ''; });
      }
    }
    return s;
  }
  /* captures may be ", "-joined composites ("2 za małe, limit 12 komórek") */
  function trCapture(s, depth) {
    if (s.indexOf(', ') >= 0) {
      var parts = s.split(', '), out = [];
      for (var i = 0; i < parts.length; i++) out.push(trPart(parts[i], depth));
      return out.join(', ');
    }
    return trPart(s, depth);
  }
  function T(s) { s = String(s); if (!exact) return s; return exact.get(s) || s; }
  function TP(s) { return trPart(String(s), 0); }
  window.T = T; window.TP = TP;

  /* ------------------------------------------------------------------ */
  /* DOM walker + observer                                               */
  /* user content is sacred: #stage, .el (canvas + template previews),   */
  /* contenteditable, input values are never touched                     */
  /* ------------------------------------------------------------------ */
  var ATTRS = ['title', 'placeholder', 'label', 'alt', 'aria-label'];

  function skipEl(el) {
    if (!el || el.nodeType !== 1) return false;
    if (el.id === 'stage') return true;
    var t = el.tagName;
    /* TEXTAREA's text child is its VALUE — never touch; INPUT has no text
       children, so it stays walkable for title/placeholder attributes */
    if (t === 'SCRIPT' || t === 'STYLE' || t === 'IFRAME' || t === 'CANVAS' ||
        t === 'TEXTAREA') return true;
    if (el.classList && el.classList.contains('el')) return true;
    if (el.getAttribute && el.getAttribute('contenteditable') === 'true') return true;
    return false;
  }
  function inSkipped(node) {
    for (var p = node; p && p.nodeType === 1; p = p.parentNode)
      if (skipEl(p)) return true;
    return false;
  }

  function trText(n) {
    var raw = n.data;
    if (!raw || !raw.trim()) return;
    /* untouched since our last write -> retranslate from the stored source;
       fresh or app-overwritten -> the current content IS the new source */
    if (n.__l10c !== raw) n.__l10o = raw;
    var m = n.__l10o.match(/^(\s*)([\s\S]*?)(\s*)$/);
    var out = m[1] + TP(m[2]) + m[3];
    n.__l10c = out;
    if (out !== raw) n.data = out;
  }

  function trAttrs(el) {
    if (!el.hasAttribute) return;
    var st = el.__l10a || (el.__l10a = {});
    for (var i = 0; i < ATTRS.length; i++) {
      var a = ATTRS[i];
      if (!el.hasAttribute(a)) continue;
      var raw = el.getAttribute(a);
      if (!raw) continue;
      var rec = st[a];
      if (!rec || rec.c !== raw) rec = st[a] = { o: raw };
      var out = TP(rec.o);
      rec.c = out;
      if (out !== raw) el.setAttribute(a, out);
    }
  }

  function trTree(root) {
    if (!root) return;
    if (root.nodeType === 3) { if (!inSkipped(root.parentNode)) trText(root); return; }
    if (root.nodeType !== 1) return;
    if (skipEl(root) || inSkipped(root.parentNode)) return;
    trAttrs(root);
    var w = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        if (n.nodeType === 1) return skipEl(n) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var n;
    while ((n = w.nextNode())) {
      if (n.nodeType === 1) trAttrs(n); else trText(n);
    }
  }

  function retranslateAll() {
    if (cur === 'pl' && !everApplied) return;   // nothing was ever swapped
    if (document.body) trTree(document.body);
    if (cur !== 'pl') everApplied = true;
  }

  var mo = new MutationObserver(function (muts) {
    if (cur === 'pl') return;                    // identity — stay out of the way
    for (var i = 0; i < muts.length; i++) {
      var m = muts[i];
      if (m.type === 'characterData') {
        if (m.target.parentNode && !inSkipped(m.target.parentNode)) trText(m.target);
      } else if (m.type === 'attributes') {
        if (m.target.nodeType === 1 && !skipEl(m.target) && !inSkipped(m.target.parentNode)) trAttrs(m.target);
      } else {
        for (var j = 0; j < m.addedNodes.length; j++) trTree(m.addedNodes[j]);
      }
    }
  });

  /* ------------------------------------------------------------------ */
  /* language registry + switching                                       */
  /* ------------------------------------------------------------------ */
  function langList() {
    var out = [{ id: 'pl', name: 'Polski' }, { id: 'en', name: 'English' }];
    var ul = userLangs();
    for (var n in ul) out.push({ id: 'u:' + n, name: n });
    return out;
  }
  function setLang(id) {
    var ul = userLangs();
    if (id !== 'pl' && id !== 'en' && !(id.slice(0, 2) === 'u:' && ul[id.slice(2)])) id = 'pl';
    cur = id;
    if (id === 'pl') { exact = null; pats = null; }
    else if (id === 'en') compile(EN);
    else compile(ul[id.slice(2)].strings || {});
    try { localStorage.setItem(LS_LANG, id); } catch (e) {}
    retranslateAll();
  }

  /* other windows (Clama <-> embedded Kolaż, separate tabs) follow along */
  window.addEventListener('storage', function (ev) {
    if (ev.key === LS_LANG && ev.newValue && ev.newValue !== cur) setLang(ev.newValue);
    else if (ev.key === LS_ULANGS && cur.slice(0, 2) === 'u:') setLang(cur);
  });

  /* ------------------------------------------------------------------ */
  /* wrappers: composed runtime messages translate at the source         */
  /* ------------------------------------------------------------------ */
  function wrapFns() {
    if (typeof window.toast === 'function') {
      var _t = window.toast;
      window.toast = function (m) { return _t(TP(m)); };
    }
    if (typeof window.geToast === 'function') {
      var _g = window.geToast;
      window.geToast = function (m, ok) { return _g(TP(m), ok); };
    }
    if (typeof window.askConfirm === 'function') {
      var _a = window.askConfirm;
      window.askConfirm = function (btn, msg, yes, act) { return _a(btn, TP(msg), TP(yes), act); };
    }
    if (typeof window.uiConfirm === 'function') {
      var _u = window.uiConfirm;
      window.uiConfirm = function (t, m, ok, f) { return _u(TP(t), TP(m), TP(ok), f); };
    }
    var _c = window.confirm.bind(window);
    window.confirm = function (m) { return _c(TP(m)); };
  }
  function safeToast(m) { if (typeof window.toast === 'function') window.toast(m); }
  /* in-app confirm, whichever tool we're in (never the native confirm) */
  function askDel(btn, msg, fn) {
    if (typeof window.askConfirm === 'function') window.askConfirm(btn, msg, 'Usuń', fn);
    else if (typeof window.uiConfirm === 'function') window.uiConfirm('Usuwanie', msg, 'Usuń', fn);
    else fn();
  }

  /* ------------------------------------------------------------------ */
  /* UI: topbar button + language menu + manager window                  */
  /* ------------------------------------------------------------------ */
  var ICON_LANG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA8ElEQVR4nNWVSwrCQBBEA3HhBQx6A9GFO73NnMd7DbgILsQs4uceRkF4EtKLTsh/4q+gGaZJqqozPR3P+xYASwb7nwLvctsF9ncEmgBsgKfE2pUsrWYPBLIPgLO43jqRC2EoZBGwkDXFARgPITABjkJ6lzUGps7kSmQOJEL+AFZDkldVMCt51gd2En5X8pR0WdjnRACj2tZ0PWDdRZHkw4L7kxK4AqNOLarygeRtifuLRLsq2oC8e6PEmqtoKWA0YVFwCPe3mhmVOFVBvnOq0K8KGj6F81nQQOB8FmSXrfZlZSLuI5Dek9qxoMbHZ/7lLw3VlI78NvyrAAAAAElFTkSuQmCC';

  var CSS = [
    '#lgpop { position:fixed; z-index:640; display:none; min-width:180px;',
    '  background:#232323; border:1px solid #3d3d3d; border-radius:7px; padding:4px;',
    '  box-shadow:0 10px 28px rgba(0,0,0,.5); font-size:12px; }',
    '#lgpop .lgi { display:flex; align-items:center; gap:9px; padding:7px 10px;',
    '  border-radius:5px; cursor:pointer; color:#ddd; white-space:nowrap; }',
    '#lgpop .lgi:hover { background:#333; }',
    '#lgpop .lgi .chk { width:13px; flex:0 0 13px; text-align:center; color:#b4593f; }',
    '#lgpop .lgsep { height:1px; background:#3a3a3a; margin:4px 6px; }',
    '#lgModal { position:fixed; inset:0; background:rgba(0,0,0,.55); display:none;',
    '  align-items:center; justify-content:center; z-index:545; }',
    '#lgModal.open { display:flex; }',
    '#lgWin { width:min(600px, 92vw); max-height:70vh; background:#1c1c1c;',
    '  border:1px solid #3a3a3a; border-radius:10px; box-shadow:0 30px 80px rgba(0,0,0,.6);',
    '  display:flex; flex-direction:column; overflow:hidden; }',
    '#lgHead { display:flex; align-items:center; gap:6px; padding:11px 14px; border-bottom:1px solid #2e2e2e; }',
    '#lgHead .ttl { font-size:12px; letter-spacing:.16em; text-transform:uppercase; color:#8a7a6e; }',
    '#lgHead .grow { flex:1; }',
    '#lgHead .tbtn { display:flex; align-items:center; gap:7px; flex:0 0 auto; background:none;',
    '  border:1px solid transparent; border-radius:5px; padding:6px 8px; cursor:pointer;',
    '  color:#cfcfcf; font-size:12px; white-space:nowrap; font-family:inherit; }',
    '#lgHead .tbtn:hover { background:#2b2b2b; border-color:#3d3d3d; }',
    '#lgHead .tbtn img { width:17px; height:17px; display:block; opacity:.85; }',
    '#lgList { flex:1; overflow-y:auto; padding:12px 14px; display:flex; flex-direction:column; gap:8px; }',
    '#lgList .lgempty { color:#6f6f6f; font-size:11px; line-height:1.55; }',
    '.lgrow { display:flex; align-items:center; gap:10px; background:#242424;',
    '  border:1px solid #333; border-radius:8px; padding:9px 12px; font-size:12px; color:#ddd; }',
    '.lgrow .cnt { color:#6f6f6f; font-size:11px; flex:0 0 auto; }',
    '.lgrow .grow { flex:1; }',
    '.lgrow button { background:#333; border:1px solid #444; border-radius:5px; color:#cfcfcf;',
    '  font-size:11px; padding:5px 10px; cursor:pointer; font-family:inherit; }',
    '.lgrow button:hover { background:#404040; }',
    '#lgFoot { padding:9px 14px; border-top:1px solid #2e2e2e; color:#6f6f6f; font-size:11px; line-height:1.5; }'
  ].join('\n');

  var lgpop = null, lgModal = null, lgPick = null, langBtn = null;

  function buildUI() {
    var fmt = document.getElementById('fmt');
    if (!fmt || !fmt.parentNode) return;

    var st = document.createElement('style');
    st.textContent = CSS;
    document.head.appendChild(st);

    langBtn = document.createElement('button');
    langBtn.className = 'tbtn';
    langBtn.id = 'langBtn';
    langBtn.title = 'Język';
    langBtn.innerHTML = '<img src="' + ICON_LANG + '" alt="">';
    fmt.parentNode.insertBefore(langBtn, fmt);

    lgpop = document.createElement('div');
    lgpop.id = 'lgpop';
    document.body.appendChild(lgpop);

    lgModal = document.createElement('div');
    lgModal.id = 'lgModal';
    lgModal.innerHTML =
      '<div id="lgWin">' +
      '  <div id="lgHead"><span class="ttl">Języki</span><div class="grow"></div>' +
      '    <button class="tbtn" id="lgTpl">Pobierz szablon tłumaczenia</button>' +
      '    <button class="tbtn" id="lgLoad">Wczytaj plik języka…</button>' +
      '    <button class="tbtn" id="lgClose" title="Zamknij (Esc)">✕</button></div>' +
      '  <div id="lgList"></div>' +
      '  <div id="lgFoot">Plik języka = JSON z szablonu. Wartości puste zostają po polsku. Języki zapisują się w tej przeglądarce.</div>' +
      '</div>';
    document.body.appendChild(lgModal);

    lgPick = document.createElement('input');
    lgPick.type = 'file';
    lgPick.accept = 'application/json,.json';
    lgPick.style.display = 'none';
    document.body.appendChild(lgPick);

    langBtn.onclick = function () {
      if (lgpop.style.display === 'block') { closeMenu(); return; }
      openMenu();
    };
    document.getElementById('lgClose').onclick = closeMgr;
    document.getElementById('lgTpl').onclick = dlTemplate;
    document.getElementById('lgLoad').onclick = function () { lgPick.value = ''; lgPick.click(); };
    lgPick.onchange = importFile;
    lgModal.addEventListener('mousedown', function (ev) { if (ev.target === lgModal) closeMgr(); });

    window.addEventListener('mousedown', function (ev) {
      if (lgpop.style.display === 'block' && !lgpop.contains(ev.target) && ev.target !== langBtn && !langBtn.contains(ev.target)) closeMenu();
    }, true);
    window.addEventListener('keydown', function (ev) {
      if (ev.key !== 'Escape') return;
      if (lgpop.style.display === 'block') { closeMenu(); ev.stopPropagation(); }
      else if (lgModal.classList.contains('open')) { closeMgr(); ev.stopPropagation(); }
    }, true);
    window.addEventListener('scroll', closeMenu, true);
    window.addEventListener('resize', closeMenu);
  }

  function openMenu() {
    var rows = '';
    langList().forEach(function (l) {
      rows += '<div class="lgi" data-lang="' + l.id.replace(/"/g, '&quot;') + '">' +
        '<span class="chk">' + (l.id === cur ? '✓' : '') + '</span><span>' + l.name.replace(/</g, '&lt;') + '</span></div>';
    });
    rows += '<div class="lgsep"></div><div class="lgi" data-act="add"><span class="chk"></span><span>+ Dodaj język…</span></div>';
    lgpop.innerHTML = rows;
    trTree(lgpop);                       // translate synchronously before measuring
    lgpop.style.display = 'block';
    var r = langBtn.getBoundingClientRect();
    lgpop.style.left = Math.max(8, Math.min(r.left, innerWidth - lgpop.offsetWidth - 8)) + 'px';
    lgpop.style.top = (r.bottom + 6) + 'px';
    lgpop.querySelectorAll('.lgi').forEach(function (it) {
      it.onclick = function () {
        closeMenu();
        if (it.dataset.act === 'add') { openMgr(); return; }
        setLang(it.dataset.lang);
      };
    });
  }
  function closeMenu() { if (lgpop) lgpop.style.display = 'none'; }

  function openMgr() { renderList(); lgModal.classList.add('open'); }
  function closeMgr() { lgModal.classList.remove('open'); }

  function renderList() {
    var box = document.getElementById('lgList');
    var ul = userLangs();
    var names = Object.keys(ul);
    if (!names.length) {
      box.innerHTML = '<div class="lgempty">Brak dodanych języków. „Pobierz szablon tłumaczenia" zapisze plik JSON ze wszystkimi tekstami — przetłumacz wartości i wczytaj plik z powrotem.</div>';
      trTree(box);
      return;
    }
    box.innerHTML = '';
    names.forEach(function (n) {
      var row = document.createElement('div');
      row.className = 'lgrow';
      var cnt = 0, ss = ul[n].strings || {};
      for (var k in ss) if (ss[k]) cnt++;
      row.innerHTML = '<span></span><span class="cnt">' + cnt + ' wpisów</span><span class="grow"></span><button>Usuń</button>';
      row.firstChild.textContent = n;
      var db = row.querySelector('button');
      db.onclick = function () {
        askDel(db, 'Usunąć język "' + n + '"?', function () {
          var u2 = userLangs();
          delete u2[n];
          try { localStorage.setItem(LS_ULANGS, JSON.stringify(u2)); } catch (e) {}
          if (cur === 'u:' + n) setLang('pl');
          renderList();
          safeToast('Język "' + n + '" usunięty');
        });
      };
      box.appendChild(row);
    });
    trTree(box);
  }

  /* "generation of the existing": every key -> JSON template for translators */
  function dlTemplate() {
    var strings = {};
    for (var k in EN) strings[k] = EN[k];
    var obj = {
      format: 'clama-lang',
      name: '',
      info: 'Wpisz nazwę języka w polu "name" i przetłumacz wartości po prawej; {n}/{c}/{e}/{m}/{w}/{f} zostaw bez zmian. Puste wartości zostają po polsku. | Put the language name in "name" and translate the right-hand values; keep the {n}/{c}/{e}/{m}/{w}/{f} placeholders. Empty values stay Polish.',
      strings: strings
    };
    var blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'clama-jezyk-szablon.json';
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
    safeToast('Szablon zapisany — sprawdź folder Pobrane');
  }

  function importFile(ev) {
    var f = ev.target.files[0];
    if (!f) return;
    var r = new FileReader();
    r.onload = function () {
      var obj = null;
      try { obj = JSON.parse(r.result); } catch (e) {}
      var strings = obj && (obj.strings || obj);
      var ok = false;
      if (strings && typeof strings === 'object' && !Array.isArray(strings)) {
        for (var k in strings) if (typeof strings[k] === 'string' && strings[k]) { ok = true; break; }
      }
      if (!ok) { safeToast('Błędny plik języka'); return; }
      var name = String((obj && obj.name) || f.name.replace(/\.json$/i, '')).replace(/['"<>\\]/g, '').trim().slice(0, 24);
      if (!name || name.toLowerCase() === 'pl' || name.toLowerCase() === 'polski') name = 'Język ' + (Object.keys(userLangs()).length + 1);
      var clean = {};
      for (var k2 in strings) if (typeof strings[k2] === 'string' && strings[k2]) clean[k2] = strings[k2];
      var ul = userLangs();
      ul[name] = { strings: clean };
      try { localStorage.setItem(LS_ULANGS, JSON.stringify(ul)); }
      catch (e) { safeToast('Brak miejsca w przeglądarce — usuń któryś język'); return; }
      setLang('u:' + name);
      renderList();
      safeToast('Język "' + name + '" wczytany');
    };
    r.readAsText(f);
  }

  /* ------------------------------------------------------------------ */
  /* boot                                                                */
  /* ------------------------------------------------------------------ */
  var startLang = 'pl';
  try { startLang = localStorage.getItem(LS_LANG) || 'pl'; } catch (e) {}

  function init() {
    wrapFns();
    buildUI();
    if (document.body)
      mo.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRS });
    setLang(startLang);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
