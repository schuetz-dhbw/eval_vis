# COMPARE - Comparative Assessment Matrix for Performance Analysis and Review Evaluation

Ein React-basiertes Visualisierungstool zum Vergleich von Bewertungen wissenschaftlicher Arbeiten durch KI und menschliche Gutachter.

## 🎯 Projektziel

Diese Anwendung ermöglicht die interaktive Visualisierung und Analyse von Bewertungen wissenschaftlicher Arbeiten. Sie vergleicht KI-generierte Bewertungen mit menschlichen Beurteilungen und bietet verschiedene Visualisierungsoptionen, um Unterschiede und Ähnlichkeiten zu identifizieren.

## ✨ Features

### Visualisierungstypen
- **Zielerreichungsgrade**: Darstellung der ursprünglichen Bewertungsscores (0-100%)
- **Gewichtungen**: Visualisierung der relativen Gewichtung einzelner Kriterien
- **Gewichtete Werte**: Anzeige der gewichteten Bewertungspunkte
- **Kombinierte Darstellung**: Simultane Darstellung von Scores und Gewichtungen
- **Statistische Analyse**: Varianz- und Korrelationsanalysen zwischen den Bewertungen
- **Arbeitstyp-Analyse**: Vergleich von Differenzen basierend auf Arbeitstypen (analytisch vs. konstruktiv)

### Diagrammtypen
- Balkendiagramme
- Liniendiagramme
- Spinnendiagramme (Radar Charts)
- Kombinierte Diagramme
- Heatmaps und Korrelationsmatrizen

### Weitere Features
- Dark/Light Mode Umschaltung
- Mehrsprachigkeit (Deutsch/Englisch)
- Responsive Design
- Erweitertes Error Handling
- Interaktive Tooltips
- Detaillierte Metriken und Statistiken

## 🚀 Installation

### Voraussetzungen
- Node.js (>= 14.0.0)
- npm oder yarn

### Setup

1. Repository klonen:
```bash
git clone https://github.com/your-username/visualization-app.git
cd visualization-app
```

2. Abhängigkeiten installieren:
```bash
npm install
```

Dies installiert automatisch alle notwendigen Abhängigkeiten, einschließlich Recharts für die Visualisierungen.

3. Entwicklungsserver starten:
```bash
npm start
```

Die Anwendung ist dann unter `http://localhost:3000` verfügbar.

## 📁 Projektstruktur

```
src/
├── components/
│   ├── charts/                 # Chart-Komponenten
│   │   ├── BarChartComponent.jsx
│   │   ├── LineChartComponent.jsx
│   │   ├── RadarChartComponent.jsx
│   │   └── ...
│   ├── common/                 # Wiederverwendbare Komponenten
│   │   ├── DarkModeToggle.jsx
│   │   ├── ErrorBoundary.jsx
│   │   └── ...
│   └── visualization/          # Hauptvisualisierungs-Komponenten
│       ├── HeaderSection.jsx
│       ├── ControlSection.jsx
│       ├── MetricsSection.jsx
│       └── ...
├── constants/                  # Konstanten
│   ├── chartTypes.js
│   ├── languages.js
│   └── thresholds.js
├── data/                       # Datenbasis
│   └── works.js               # Bewertungsdaten
├── hooks/                      # Custom React Hooks
│   └── useTranslation.js
├── locales/                    # Übersetzungen
│   ├── de.js
│   ├── en.js
│   └── ...
├── styles/                     # Globale Styles
│   ├── global.css
│   └── variables.css
├── utils/                      # Hilfsfunktionen
│   ├── dataTransformers.js
│   ├── darkmode.js
│   └── translationHelpers.js
├── App.js                     # Hauptkomponente
├── AppContext.js              # React Context für globalen State
└── index.js                   # Einstiegspunkt
```

## 🔧 Architektur

### State Management
- Verwendet React Context API für globales State Management
- Context verwaltet:
    - Ausgewählte Arbeit
    - Diagrammtyp
    - Spracheinstellung
    - Dark Mode

### Datenverarbeitung
- Umfangreiche Datenverarbeitungsfunktionen in `utils/dataTransformers.js`
- Berechnung von:
    - Kosinus-Ähnlichkeit
    - Euklidischer Distanz
    - Statistische Metriken
    - Varianzen und Korrelationen

### Komponenten-Design
- Modulare, wiederverwendbare Komponenten
- Trennung von Präsentation und Logik
- Mehrere Error Boundary Layers
- Custom Hooks für Übersetzungen

## 🛠 Technologie-Stack

- **React** 18.x
- **Recharts** 2.x für Datenvisualisierung (Balken-, Linien- und Spinnendiagramme)
- **CSS Custom Properties** für Theming
- **React Context** für State Management
- **Error Boundaries** für robustes Error Handling

## 🌐 Internationalisierung

Die Anwendung unterstützt:
- Deutsch (Standard)
- Englisch

Übersetzungen werden in separaten JSON-Dateien verwaltet und über einen custom Hook bereitgestellt.

## 📊 Datenformat

Die Bewertungsdaten folgen einem strukturierten Format:

- key: "identifier",
- typeKey: "analytic" | "constructive",
- criteriaKeys: [...],
- aiScores: [...],
- humanScores: [...],
- aiWeights: [...],
- humanWeights: [...],
- aiGrade: number,
- humanGrade: number

## 🎨 Styling

- CSS Variables für einfaches Theming
- Dark/Light Mode Unterstützung
- Responsive Design für alle Gerätegrößen
- Konsistentes Design-System

## 📈 Performance-Optimierungen

- Verwendung von `useMemo` für rechenintensive Operationen
- Lazy Loading von Komponenten
- Optimierte Render-Zyklen durch Context-Splitting

## 🚀 Deployment

### Build für Produktion

```bash
npm run build
```

Erzeugt einen optimierten Build im `build` Verzeichnis.

### Deployment-Optionen

Die Anwendung kann auf folgenden Plattformen deployed werden:
- Vercel
- Netlify
- GitHub Pages
- Eigener Webserver