# Styling-Konventionen für das COMPARE-Projekt

## CSS-Struktur

Die CSS-Dateien sind wie folgt organisiert:

1. **variables.css** - Enthält alle CSS-Variablen für Farben, Abstände, Schriftgrößen, etc.
2. **global.css** - Grundlegende globale Styles für die gesamte Anwendung
3. **components.css** - Wiederverwendbare Komponenten-Styles
4. **media-queries.css** - Alle responsiven Anpassungen zentral gesammelt

## CSS-Klassen-Konventionen

Wir verwenden einen vereinfachten BEM-ähnlichen Ansatz:

- `.block` - Eigenständiger Komponenten-Block (z.B. `.component-container`)
- `.block__element` - Element innerhalb eines Blocks (z.B. `.data-table__header`)
- `.is-state` - Zustände und Modifikatoren (z.B. `.is-active`, `.is-hidden`)

## Wiederverwendbare Layout-Klassen

Folgende Layout-Klassen sollten bevorzugt verwendet werden:

- **Grid-Layouts**: `.component-grid`, `.grid-2-cols`, `.grid-3-cols`
- **Flex-Layouts**: `.flex-row`, `.flex-column`, `.flex-center`, `.flex-between`
- **Container**: `.component-container`, `.info-box`
- **Tabellen**: `.data-table` mit `.even-row`, `.odd-row`, `.totals-row`

## Farbsystem

Alle Farben sind als CSS-Variablen definiert und können in beiden Themes (hell/dunkel) verwendet werden:

- **Primärfarben**: `var(--color-primary)`, `var(--color-secondary)`, etc.
- **Textfarben**: `var(--color-text)`, `var(--color-text-light)`
- **Hintergrundfarben**: `var(--color-background)`, `var(--background-even-row)`, etc.

## Responsive Design

Media Queries sind in `media-queries.css` zentralisiert. Der Hauptbreakpoint liegt bei 768px.

## Neuer Code

Bei der Erstellung neuer Komponenten:

1. Verwende bestehende CSS-Klassen aus `components.css` wo möglich
2. Nutze CSS-Variablen für Abstände, Farben und Typografie
3. Komponentenspezifische Styles sollten in einer separaten CSS-Datei im `styles`-Verzeichnis der Komponente definiert werden
4. Responsive Anpassungen sollten in `media-queries.css` hinzugefügt werden, nicht in komponentenspezifischen Dateien