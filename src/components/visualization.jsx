import React, { useState } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
    BarChart, Bar, ComposedChart
} from 'recharts';
import './visualization.css';

// Übersetzungen
const translations = {
    de: {
        title: "Visualisierung der Bewertungen: KI vs. Mensch",
        chartTypes: {
            scores: "Zielerreichungsgrade",
            weights: "Gewichtungen",
            weighted: "Gewichtete Werte",
            combined: "Kombinierte Darstellung"
        },
        metrics: {
            cosine: "Kosinus-Ähnlichkeit",
            distance: "Euklidische Distanz"
        },
        chartTitles: {
            vectors: "Bewertungsvektoren",
            combinedTitle: "Bewertungen und Gewichtungen",
            radar: "Spinnendiagramm",
            bar: "Balkendiagramm"
        },
        labels: {
            ki: "KI",
            human: "Human",
            kiScore: "KI Score",
            humanScore: "Human Score",
            kiWeight: "KI Gewichtung",
            humanWeight: "Human Gewichtung"
        },
        criteria: {
            professionalTreatment: "Fachl. Bearbeitung",
            useOfExpertise: "Fachwissen",
            useMethods: "Methoden",
            feasibility: "Umsetzbarkeit",
            creativity: "Kreativität",
            economic: "Wirtschaft",
            independence: "Selbständigkeit",
            systematic: "Systematik",
            documentation: "Dokumention",
            litResearch: "Lit.recherche",
            litUse: "Lit.verwendung"
        },
        tableHeaders: {
            criterion: "Kriterium",
            kiGrade: "KI-Bewertung",
            kiWeight: "KI-Gewichtung",
            humanGrade: "Human-Bewertung",
            humanWeight: "Human-Gewichtung",
            kiWeighted: "KI (gewichtet)",
            humanWeighted: "Human (gewichtet)",
            total: "Gesamt"
        },
        hints: {
            title: "Hinweise zur Nutzung:",
            scores: "Zielerreichungsgrade",
            weights: "Gewichtungen",
            weighted: "Gewichtete Werte",
            combined: "Kombinierte Darstellung",
            scoresDesc: "zeigt die ursprünglichen Bewertungspunkte (0-100%)",
            weightsDesc: "zeigt die relative Bedeutung der Kriterien (0-25%)",
            weightedDesc: "zeigt das Produkt aus Bewertung und Gewichtung",
            combinedDesc: "zeigt Bewertungen als Balken und Gewichtungen als Linien",
            tooltip: "Bewegen Sie den Mauszeiger über die Diagramme für detaillierte Informationen",
            table: "Die Tabelle unten zeigt alle numerischen Werte und die Gesamtsummen"
        },
        language: "Sprache",
        details: "Bewertungsdetails"
    },
    en: {
        title: "Visualization of Assessment: AI vs. Human",
        chartTypes: {
            scores: "Achievement Levels",
            weights: "Weightings",
            weighted: "Weighted Values",
            combined: "Combined View"
        },
        metrics: {
            cosine: "Cosine Similarity",
            distance: "Euclidean Distance"
        },
        chartTitles: {
            vectors: "Assessment Vectors",
            combinedTitle: "Scores and Weights",
            radar: "Spider Chart",
            bar: "Bar Chart"
        },
        labels: {
            ki: "AI",
            human: "Human",
            kiScore: "AI Score",
            humanScore: "Human Score",
            kiWeight: "AI Weighting",
            humanWeight: "Human Weighting"
        },
        criteria: {
            professionalTreatment: "Prof. Treat.",
            useOfExpertise: "Expertise",
            useMethods: "Methods",
            feasibility: "Feasibility",
            creativity: "Creativity",
            economic: "Economic",
            independence: "Independence",
            systematic: "Systematic",
            documentation: "Documention",
            litResearch: "Lit. Research",
            litUse: "Literature Use"
        },
        tableHeaders: {
            criterion: "Criterion",
            kiGrade: "AI Rating",
            kiWeight: "AI Weight",
            humanGrade: "Human Rating",
            humanWeight: "Human Weight",
            kiWeighted: "AI (weighted)",
            humanWeighted: "Human (weighted)",
            total: "Total"
        },
        hints: {
            title: "Usage Notes:",
            scores: "Achievement Levels",
            weights: "Weightings",
            weighted: "Weighted Values",
            combined: "Combined View",
            scoresDesc: "shows the original rating scores (0-100%)",
            weightsDesc: "shows the relative importance of criteria (0-25%)",
            weightedDesc: "shows the product of ratings and weights",
            combinedDesc: "shows ratings as bars and weightings as lines",
            tooltip: "Hover over the charts for detailed information",
            table: "The table below shows all numerical values and the totals"
        },
        language: "Language",
        details: "Assessment Details"
    }
};

// Charttypen
const CHART_TYPES = {
    SCORES: 'scores',
    WEIGHTS: 'weights',
    WEIGHTED: 'weighted',
    COMBINED: 'combined'
};

// Bewertungen der Arbeiten
const works = [
    {
        title: "ZERO – Sie wissen, was du tust",
        criteriaLabels: ["Fachliche Bearbeitung", "Nutzung von Fachwissen", "Einsatz von Methoden", "Umsetzbarkeit", "Kreativität", "Wirtschaftliche Bewertung", "Selbständigkeit", "Systematik", "Dokumentation", "Literaturrecherche", "Verwendung Literatur"],
        ki_scores: [78, 80, 79, 82, 76, 70, 80, 76, 75, 68, 73],
        human_scores: [54, 65, 40, 0, 0, 0, 58, 50, 50, 55, 57],
        ki_weights: [0.15, 0.10, 0.15, 0.05, 0.05, 0.05, 0.05, 0.10, 0.10, 0.10, 0.10],
        human_weights: [0.20, 0.20, 0.10, 0.00, 0.05, 0.00, 0.05, 0.10, 0.10, 0.10, 0.10],
        similarity: 0.8709,
        distance: 12.223
    },
    {
        title: "CMS-Vergleich",
        criteriaLabels: ["Fachliche Bearbeitung", "Nutzung von Fachwissen", "Einsatz von Methoden", "Umsetzbarkeit", "Kreativität", "Wirtschaftliche Bewertung", "Selbständigkeit", "Systematik", "Dokumentation", "Literaturrecherche", "Verwendung Literatur"],
        ki_scores: [84, 82, 86, 88, 80, 83, 82, 85, 83, 73, 75],
        human_scores: [95, 100, 0, 0, 100, 0, 100, 90, 100, 95, 95],
        ki_weights: [0.15, 0.10, 0.15, 0.05, 0.05, 0.05, 0.05, 0.10, 0.10, 0.10, 0.10],
        human_weights: [0.20, 0.20, 0.00, 0.00, 0.15, 0.00, 0.05, 0.10, 0.10, 0.10, 0.10],
        similarity: 0.7928,
        distance: 22.737
    },
    {
        title: "Jetpack Compose",
        criteriaLabels: ["Fachliche Bearbeitung", "Nutzung von Fachwissen", "Einsatz von Methoden", "Umsetzbarkeit", "Kreativität", "Wirtschaftliche Bewertung", "Selbständigkeit", "Systematik", "Dokumentation", "Literaturrecherche", "Verwendung Literatur"],
        ki_scores: [85, 82, 90, 85, 75, 80, 82, 85, 83, 78, 75],
        human_scores: [100, 100, 100, 0, 100, 0, 100, 100, 100, 95, 100],
        ki_weights: [0.15, 0.10, 0.15, 0.05, 0.05, 0.05, 0.05, 0.10, 0.15, 0.10, 0.05],
        human_weights: [0.20, 0.20, 0.10, 0.00, 0.05, 0.00, 0.05, 0.10, 0.10, 0.10, 0.10],
        similarity: 0.8948,
        distance: 17.050
    },
    {
        title: "Kotlin vs. Java",
        criteriaLabels: ["Fachliche Bearbeitung", "Nutzung von Fachwissen", "Einsatz von Methoden", "Umsetzbarkeit", "Kreativität", "Wirtschaftliche Bewertung", "Selbständigkeit", "Systematik", "Dokumentation", "Literaturrecherche", "Verwendung Literatur"],
        ki_scores: [78, 76, 78, 82, 70, 65, 78, 80, 76, 70, 68],
        human_scores: [52, 65, 45, 0, 50, 0, 48, 48, 48, 85, 66],
        ki_weights: [0.15, 0.10, 0.15, 0.05, 0.05, 0.05, 0.05, 0.10, 0.10, 0.10, 0.10],
        human_weights: [0.20, 0.20, 0.05, 0.00, 0.10, 0.00, 0.05, 0.10, 0.10, 0.10, 0.10],
        similarity: 0.8461,
        distance: 13.130
    },
    {
        title: "Pepper-CMS",
        criteriaLabels: ["Fachliche Bearbeitung", "Nutzung von Fachwissen", "Einsatz von Methoden", "Umsetzbarkeit", "Kreativität", "Wirtschaftliche Bewertung", "Selbständigkeit", "Systematik", "Dokumentation", "Literaturrecherche", "Verwendung Literatur"],
        ki_scores: [70, 75, 75, 70, 75, 70, 75, 72, 78, 72, 72],
        human_scores: [50, 60, 40, 45, 65, 0, 50, 48, 50, 45, 45],
        ki_weights: [0.15, 0.10, 0.15, 0.10, 0.05, 0.05, 0.05, 0.10, 0.10, 0.10, 0.05],
        human_weights: [0.15, 0.10, 0.15, 0.05, 0.10, 0.00, 0.05, 0.10, 0.10, 0.10, 0.10],
        similarity: 0.9328,
        distance: 10.220
    },
    {
        title: "PWA vs. nativ",
        criteriaLabels: ["Fachliche Bearbeitung", "Nutzung von Fachwissen", "Einsatz von Methoden", "Umsetzbarkeit", "Kreativität", "Wirtschaftliche Bewertung", "Selbständigkeit", "Systematik", "Dokumentation", "Literaturrecherche", "Verwendung Literatur"],
        ki_scores: [82, 80, 85, 87, 75, 78, 85, 88, 85, 75, 72],
        human_scores: [92, 100, 0, 0, 100, 0, 100, 92, 92, 92, 95],
        ki_weights: [0.15, 0.10, 0.15, 0.05, 0.05, 0.05, 0.05, 0.10, 0.10, 0.10, 0.10],
        human_weights: [0.20, 0.20, 0.00, 0.00, 0.15, 0.00, 0.05, 0.10, 0.10, 0.10, 0.10],
        similarity: 0.7862,
        distance: 22.668
    },
    {
        title: "Crossplatform-Apps",
        criteriaLabels: ["Fachliche Bearbeitung", "Nutzung von Fachwissen", "Einsatz von Methoden", "Umsetzbarkeit", "Kreativität", "Wirtschaftliche Bewertung", "Selbständigkeit", "Systematik", "Dokumentation", "Literaturrecherche", "Verwendung Literatur"],
        ki_scores: [78, 82, 75, 85, 68, 76, 80, 85, 82, 78, 73],
        human_scores: [90, 95, 95, 90, 90, 0, 90, 90, 90, 100, 100],
        ki_weights: [0.15, 0.10, 0.15, 0.05, 0.05, 0.05, 0.05, 0.10, 0.10, 0.10, 0.10],
        human_weights: [0.15, 0.15, 0.15, 0.05, 0.05, 0.00, 0.05, 0.10, 0.10, 0.10, 0.10],
        similarity: 0.9773,
        distance: 8.822
    },
    {
        title: "Responsive Webdesign",
        criteriaLabels: ["Fachliche Bearbeitung", "Nutzung von Fachwissen", "Einsatz von Methoden", "Umsetzbarkeit", "Kreativität", "Wirtschaftliche Bewertung", "Selbständigkeit", "Systematik", "Dokumentation", "Literaturrecherche", "Verwendung Literatur"],
        ki_scores: [80, 80, 85, 85, 70, 75, 80, 80, 80, 80, 70],
        human_scores: [50, 66, 25, 55, 55, 0, 55, 55, 50, 50, 50],
        ki_weights: [0.15, 0.10, 0.15, 0.05, 0.05, 0.05, 0.05, 0.10, 0.10, 0.10, 0.10],
        human_weights: [0.15, 0.15, 0.15, 0.05, 0.05, 0.00, 0.05, 0.10, 0.10, 0.10, 0.10],
        similarity: 0.9152,
        distance: 12.310
    },
    {
        title: "Android Architecture",
        criteriaLabels: ["Fachliche Bearbeitung", "Nutzung von Fachwissen", "Einsatz von Methoden", "Umsetzbarkeit", "Kreativität", "Wirtschaftliche Bewertung", "Selbständigkeit", "Systematik", "Dokumentation", "Literaturrecherche", "Verwendung Literatur"],
        ki_scores: [82, 85, 88, 80, 75, 78, 80, 87, 85, 78, 78],
        human_scores: [90, 95, 90, 95, 70, 0, 85, 90, 80, 92, 90],
        ki_weights: [0.15, 0.10, 0.15, 0.05, 0.05, 0.05, 0.05, 0.10, 0.10, 0.10, 0.10],
        human_weights: [0.15, 0.15, 0.15, 0.05, 0.05, 0.00, 0.05, 0.10, 0.10, 0.10, 0.10],
        similarity: 0.9746,
        distance: 7.364
    },
    {
        title: "Apple-Feeling",
        criteriaLabels: ["Fachliche Bearbeitung", "Nutzung von Fachwissen", "Einsatz von Methoden", "Umsetzbarkeit", "Kreativität", "Wirtschaftliche Bewertung", "Selbständigkeit", "Systematik", "Dokumentation", "Literaturrecherche", "Verwendung Literatur"],
        ki_scores: [88, 85, 88, 90, 87, 78, 85, 88, 85, 82, 83],
        human_scores: [100, 100, 95, 95, 95, 0, 100, 100, 95, 95, 100],
        ki_weights: [0.15, 0.10, 0.15, 0.05, 0.05, 0.05, 0.05, 0.10, 0.10, 0.10, 0.10],
        human_weights: [0.15, 0.15, 0.15, 0.05, 0.05, 0.00, 0.05, 0.10, 0.10, 0.10, 0.10],
        similarity: 0.9777,
        distance: 8.343
    },
    {
        title: "Videoüberwachungs-App",
        criteriaLabels: ["Fachliche Bearbeitung", "Nutzung von Fachwissen", "Einsatz von Methoden", "Umsetzbarkeit", "Kreativität", "Wirtschaftliche Bewertung", "Selbständigkeit", "Systematik", "Dokumentation", "Literaturrecherche", "Verwendung Literatur"],
        ki_scores: [80, 75, 85, 85, 75, 70, 85, 80, 78, 65, 68],
        human_scores: [50, 60, 50, 75, 60, 0, 50, 55, 55, 25, 25],
        ki_weights: [0.15, 0.10, 0.15, 0.05, 0.05, 0.05, 0.05, 0.10, 0.10, 0.10, 0.10],
        human_weights: [0.15, 0.10, 0.15, 0.10, 0.05, 0.00, 0.05, 0.10, 0.10, 0.10, 0.10],
        similarity: 0.9352,
        distance: 11.069
    },
    {
        title: "Futterstation Nassfutter",
        criteriaLabels: ["Fachliche Bearbeitung", "Nutzung von Fachwissen", "Einsatz von Methoden", "Umsetzbarkeit", "Kreativität", "Wirtschaftliche Bewertung", "Selbständigkeit", "Systematik", "Dokumentation", "Literaturrecherche", "Verwendung Literatur"],
        ki_scores: [85, 82, 88, 78, 85, 70, 87, 85, 83, 80, 78],
        human_scores: [100, 100, 100, 85, 100, 0, 100, 100, 95, 100, 100],
        ki_weights: [0.15, 0.10, 0.15, 0.05, 0.05, 0.10, 0.05, 0.10, 0.10, 0.10, 0.05],
        human_weights: [0.15, 0.10, 0.15, 0.10, 0.05, 0.00, 0.05, 0.10, 0.10, 0.10, 0.10],
        similarity: 0.9456,
        distance: 11.295
    },
    {
        title: "Futterstation Trockenfutter",
        criteriaLabels: ["Fachliche Bearbeitung", "Nutzung von Fachwissen", "Einsatz von Methoden", "Umsetzbarkeit", "Kreativität", "Wirtschaftliche Bewertung", "Selbständigkeit", "Systematik", "Dokumentation", "Literaturrecherche", "Verwendung Literatur"],
        ki_scores: [85, 80, 85, 85, 80, 75, 85, 85, 80, 70, 70],
        human_scores: [100, 100, 100, 100, 100, 0, 100, 100, 95, 90, 90],
        ki_weights: [0.15, 0.10, 0.15, 0.05, 0.05, 0.05, 0.05, 0.10, 0.10, 0.10, 0.10],
        human_weights: [0.15, 0.10, 0.15, 0.10, 0.05, 0.00, 0.05, 0.10, 0.10, 0.10, 0.10],
        similarity: 0.9782,
        distance: 8.678
    },
    {
        title: "Graph Visualization",
        criteriaLabels: ["Fachliche Bearbeitung", "Nutzung von Fachwissen", "Einsatz von Methoden", "Umsetzbarkeit", "Kreativität", "Wirtschaftliche Bewertung", "Selbständigkeit", "Systematik", "Dokumentation", "Literaturrecherche", "Verwendung Literatur"],
        ki_scores: [83, 86, 88, 85, 82, 75, 84, 87, 86, 80, 82],
        human_scores: [90, 95, 95, 90, 100, 0, 95, 95, 90, 95, 85],
        ki_weights: [0.15, 0.10, 0.15, 0.05, 0.05, 0.05, 0.05, 0.10, 0.10, 0.10, 0.10],
        human_weights: [0.15, 0.10, 0.15, 0.10, 0.05, 0.00, 0.05, 0.10, 0.10, 0.10, 0.10],
        similarity: 0.9800,
        distance: 6.625
    },
    {
        title: "KI-Detektor",
        criteriaLabels: ["Fachliche Bearbeitung", "Nutzung von Fachwissen", "Einsatz von Methoden", "Umsetzbarkeit", "Kreativität", "Wirtschaftliche Bewertung", "Selbständigkeit", "Systematik", "Dokumentation", "Literaturrecherche", "Verwendung Literatur"],
        ki_scores: [88, 85, 90, 85, 82, 75, 90, 88, 92, 85, 84],
        human_scores: [90, 91, 90, 80, 92, 0, 95, 82, 85, 95, 80],
        ki_weights: [0.15, 0.10, 0.15, 0.05, 0.05, 0.05, 0.05, 0.10, 0.10, 0.10, 0.10],
        human_weights: [0.15, 0.12, 0.15, 0.08, 0.05, 0.00, 0.05, 0.10, 0.10, 0.10, 0.10],
        similarity: 0.9844,
        distance: 5.192
    },
    {
        title: "Kotlin Multiplatform",
        criteriaLabels: ["Fachliche Bearbeitung", "Nutzung von Fachwissen", "Einsatz von Methoden", "Umsetzbarkeit", "Kreativität", "Wirtschaftliche Bewertung", "Selbständigkeit", "Systematik", "Dokumentation", "Literaturrecherche", "Verwendung Literatur"],
        ki_scores: [84, 82, 88, 85, 76, 72, 85, 88, 86, 78, 80],
        human_scores: [90, 95, 74, 100, 100, 0, 100, 66, 66, 90, 85],
        ki_weights: [0.15, 0.10, 0.20, 0.10, 0.05, 0.05, 0.05, 0.10, 0.10, 0.05, 0.05],
        human_weights: [0.15, 0.10, 0.15, 0.10, 0.05, 0.00, 0.05, 0.10, 0.10, 0.10, 0.10],
        similarity: 0.9283,
        distance: 10.820
    }
];

// Hauptkomponente
const Visualization = () => {
    const [selectedWorkIndex, setSelectedWorkIndex] = useState(0);
    const [chartType, setChartType] = useState(CHART_TYPES.SCORES);
    const [language, setLanguage] = useState('de');

    const work = works[selectedWorkIndex];

    // Übersetzungshilfe
    const t = (key, section = null) => {
        if (section) {
            return translations[language][section][key] || key;
        }
        return translations[language][key] || key;
    };

    // Für kürzere Achsenbeschriftungen
    const getShortLabels = () => {
        return work.criteriaLabels.map(label => {
            if (label === "Fachliche Bearbeitung") return t('professionalTreatment', 'criteria');
            if (label === "Nutzung von Fachwissen") return t('useOfExpertise', 'criteria');
            if (label === "Einsatz von Methoden") return t('useMethods', 'criteria');
            if (label === "Umsetzbarkeit") return t('feasibility', 'criteria');
            if (label === "Kreativität") return t('creativity', 'criteria');
            if (label === "Wirtschaftliche Bewertung") return t('economic', 'criteria');
            if (label === "Selbständigkeit") return t('independence', 'criteria');
            if (label === "Systematik") return t('systematic', 'criteria');
            if (label === "Dokumentation") return t('documentation', 'criteria');
            if (label === "Literaturrecherche") return t('litResearch', 'criteria');
            if (label === "Verwendung Literatur") return t('litUse', 'criteria');
            return label;
        });
    };

    // Daten für die Bewertungsdiagramme
    const getScoresData = () => {
        const shortLabels = getShortLabels();
        return work.criteriaLabels.map((label, index) => {
            return {
                name: label,
                shortName: shortLabels[index],
                [t('ki', 'labels')]: work.ki_scores[index],
                [t('human', 'labels')]: work.human_scores[index],
            };
        });
    };

    // Daten für die Gewichtungsdiagramme
    const getWeightsData = () => {
        const shortLabels = getShortLabels();
        return work.criteriaLabels.map((label, index) => {
            return {
                name: label,
                shortName: shortLabels[index],
                [t('ki', 'labels')]: work.ki_weights[index] * 100, // Skaliert für bessere Sichtbarkeit
                [t('human', 'labels')]: work.human_weights[index] * 100,
            };
        });
    };

    // Daten für die gewichteten Bewertungsdiagramme
    const getWeightedData = () => {
        const shortLabels = getShortLabels();
        return work.criteriaLabels.map((label, index) => {
            return {
                name: label,
                shortName: shortLabels[index],
                [t('ki', 'labels')]: work.ki_scores[index] * work.ki_weights[index],
                [t('human', 'labels')]: work.human_scores[index] * work.human_weights[index],
            };
        });
    };

    // Daten für die kombinierte Darstellung
    const getCombinedData = () => {
        const shortLabels = getShortLabels();
        return work.criteriaLabels.map((label, index) => {
            return {
                name: label,
                shortName: shortLabels[index],
                [`${t('ki', 'labels')}Score`]: work.ki_scores[index],
                [`${t('human', 'labels')}Score`]: work.human_scores[index],
                [`${t('ki', 'labels')}Weight`]: work.ki_weights[index] * 100,
                [`${t('human', 'labels')}Weight`]: work.human_weights[index] * 100,
                [`${t('ki', 'labels')}Weighted`]: work.ki_scores[index] * work.ki_weights[index],
                [`${t('human', 'labels')}Weighted`]: work.human_scores[index] * work.human_weights[index],
            };
        });
    };

    // Daten für das Radar/Spinnendiagramm
    const getRadarData = () => {
        if (chartType === CHART_TYPES.WEIGHTED) {
            return work.criteriaLabels.map((label, index) => {
                return {
                    subject: label,
                    shortSubject: getShortLabels()[index],
                    [t('ki', 'labels')]: work.ki_scores[index] * work.ki_weights[index],
                    [t('human', 'labels')]: work.human_scores[index] * work.human_weights[index],
                    fullMark: 10,
                };
            });
        } else if (chartType === CHART_TYPES.WEIGHTS) {
            return work.criteriaLabels.map((label, index) => {
                return {
                    subject: label,
                    shortSubject: getShortLabels()[index],
                    [t('ki', 'labels')]: work.ki_weights[index] * 100,
                    [t('human', 'labels')]: work.human_weights[index] * 100,
                    fullMark: 25,
                };
            });
        } else {
            return work.criteriaLabels.map((label, index) => {
                return {
                    subject: label,
                    shortSubject: getShortLabels()[index],
                    [t('ki', 'labels')]: work.ki_scores[index],
                    [t('human', 'labels')]: work.human_scores[index],
                    fullMark: 100,
                };
            });
        }
    };

    // Bestimmen der aktuellen Diagrammdaten basierend auf dem Typ
    const getCurrentChartData = () => {
        switch(chartType) {
            case CHART_TYPES.WEIGHTS:
                return getWeightsData();
            case CHART_TYPES.WEIGHTED:
                return getWeightedData();
            case CHART_TYPES.COMBINED:
                return getCombinedData();
            case CHART_TYPES.SCORES:
            default:
                return getScoresData();
        }
    };

    // Y-Achsen-Domain basierend auf dem Charttyp
    const getYDomain = () => {
        switch(chartType) {
            case CHART_TYPES.WEIGHTS:
                return [0, 25];
            case CHART_TYPES.WEIGHTED:
                return [0, 20];
            case CHART_TYPES.COMBINED:
            case CHART_TYPES.SCORES:
            default:
                return [0, 100];
        }
    };

    // Radar-Domain basierend auf dem Charttyp
    const getRadarDomain = () => {
        switch(chartType) {
            case CHART_TYPES.WEIGHTS:
                return [0, 25];
            case CHART_TYPES.WEIGHTED:
                return [0, 20];
            default:
                return [0, 100];
        }
    };

    return (
        <div className="visualization-container">
            <div className="header-section">
                <h2 className="main-title">{t('title')}</h2>
                <div className="controls">
                    <select
                        className="dropdown-selector"
                        value={selectedWorkIndex}
                        onChange={(e) => setSelectedWorkIndex(parseInt(e.target.value))}
                    >
                        {works.map((work, index) => (
                            <option key={index} value={index}>
                                {work.title}
                            </option>
                        ))}
                    </select>
                    <select
                        className="dropdown-selector"
                        value={chartType}
                        onChange={(e) => setChartType(e.target.value)}
                    >
                        {Object.values(CHART_TYPES).map((type) => (
                            <option key={type} value={type}>
                                {t(type, 'chartTypes')}
                            </option>
                        ))}
                    </select>
                    <select
                        className="dropdown-selector"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                    >
                        <option value="de">Deutsch</option>
                        <option value="en">English</option>
                    </select>
                </div>
                <div className="metrics">
                    <p><span className="metric-label">{t('cosine', 'metrics')}:</span> {work.similarity.toFixed(4)}</p>
                    <p><span className="metric-label">{t('distance', 'metrics')}:</span> {work.distance.toFixed(3)}</p>
                </div>
            </div>

            <div className="charts-grid">
                {/* Linien- oder kombiniertes Diagramm */}
                <div className="chart-container full-width">
                    <h3 className="chart-title">
                        {chartType === CHART_TYPES.COMBINED ? t('combinedTitle', 'chartTitles') : t('vectors', 'chartTitles')}
                    </h3>
                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height={250}>
                            {chartType === CHART_TYPES.COMBINED ? (
                                <ComposedChart
                                    data={getCombinedData()}
                                    margin={{ top: 5, right: 30, left: 0, bottom: 30 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="shortName"
                                        angle={-45}
                                        textAnchor="end"
                                        height={70}
                                        tick={{fontSize: 10}}
                                    />
                                    <YAxis yAxisId="left" domain={[0, 100]} />
                                    <YAxis yAxisId="right" orientation="right" domain={[0, 25]} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar yAxisId="left" dataKey={`${t('ki', 'labels')}Score`} name={t('kiScore', 'labels')} fill="#8884d8" />
                                    <Bar yAxisId="left" dataKey={`${t('human', 'labels')}Score`} name={t('humanScore', 'labels')} fill="#82ca9d" />
                                    <Line yAxisId="right" type="monotone" dataKey={`${t('ki', 'labels')}Weight`} name={t('kiWeight', 'labels')} stroke="#ff7300" />
                                    <Line yAxisId="right" type="monotone" dataKey={`${t('human', 'labels')}Weight`} name={t('humanWeight', 'labels')} stroke="#0088fe" />
                                </ComposedChart>
                            ) : (
                                <LineChart
                                    data={getCurrentChartData()}
                                    margin={{ top: 5, right: 30, left: 0, bottom: 30 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="shortName"
                                        angle={-45}
                                        textAnchor="end"
                                        height={70}
                                        tick={{fontSize: 10}}
                                    />
                                    <YAxis domain={getYDomain()} />
                                    <Tooltip />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey={t('ki', 'labels')}
                                        stroke="#8884d8"
                                        activeDot={{ r: 8 }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey={t('human', 'labels')}
                                        stroke="#82ca9d"
                                        activeDot={{ r: 8 }}
                                    />
                                </LineChart>
                            )}
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Spinnendiagramm */}
                <div className="chart-container full-width">
                    <h3 className="chart-title">{t('radar', 'chartTitles')}</h3>
                    <div className="chart-wrapper radar-wrapper">
                        <ResponsiveContainer width="100%" height={350}>
                            <RadarChart outerRadius="75%" data={getRadarData()}>
                                <PolarGrid />
                                <PolarAngleAxis
                                    dataKey="shortSubject"
                                    tick={{fontSize: 10}}
                                />
                                <PolarRadiusAxis
                                    angle={90}
                                    domain={getRadarDomain()}
                                />
                                <Radar
                                    name={t('ki', 'labels')}
                                    dataKey={t('ki', 'labels')}
                                    stroke="#8884d8"
                                    fill="#8884d8"
                                    fillOpacity={0.6}
                                />
                                <Radar
                                    name={t('human', 'labels')}
                                    dataKey={t('human', 'labels')}
                                    stroke="#82ca9d"
                                    fill="#82ca9d"
                                    fillOpacity={0.6}
                                />
                                <Legend />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Balkendiagramm */}
                <div className="chart-container full-width">
                    <h3 className="chart-title">{t('bar', 'chartTitles')}</h3>
                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart
                                data={getCurrentChartData()}
                                margin={{
                                    top: 10,
                                    right: 30,
                                    left: 0,
                                    bottom: 30,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="shortName"
                                    angle={-45}
                                    textAnchor="end"
                                    height={70}
                                    tick={{fontSize: 10}}
                                />
                                <YAxis domain={getYDomain()} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey={t('ki', 'labels')} fill="#8884d8" />
                                <Bar dataKey={t('human', 'labels')} fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="details-container">
                <h3 className="details-title">{t('details')}: {work.title}</h3>
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>{t('criterion', 'tableHeaders')}</th>
                            <th>{t('kiGrade', 'tableHeaders')}</th>
                            <th>{t('kiWeight', 'tableHeaders')}</th>
                            <th>{t('humanGrade', 'tableHeaders')}</th>
                            <th>{t('humanWeight', 'tableHeaders')}</th>
                            <th>{t('kiWeighted', 'tableHeaders')}</th>
                            <th>{t('humanWeighted', 'tableHeaders')}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {work.criteriaLabels.map((label, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                                <td>{label}</td>
                                <td>{work.ki_scores[index]}%</td>
                                <td>{work.ki_weights[index]}</td>
                                <td>{work.human_scores[index]}%</td>
                                <td>{work.human_weights[index]}</td>
                                <td>{(work.ki_scores[index] * work.ki_weights[index]).toFixed(2)}</td>
                                <td>{(work.human_scores[index] * work.human_weights[index]).toFixed(2)}</td>
                            </tr>
                        ))}
                        <tr className="totals-row">
                            <td>{t('total', 'tableHeaders')}</td>
                            <td>-</td>
                            <td>{work.ki_weights.reduce((sum, w) => sum + w, 0).toFixed(2)}</td>
                            <td>-</td>
                            <td>{work.human_weights.reduce((sum, w) => sum + w, 0).toFixed(2)}</td>
                            <td>
                                {work.ki_scores.reduce((sum, score, i) => sum + score * work.ki_weights[i], 0).toFixed(2)}
                            </td>
                            <td>
                                {work.human_scores.reduce((sum, score, i) => sum + score * work.human_weights[i], 0).toFixed(2)}
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="usage-hints">
                <h3 className="hints-title">{t('title', 'hints')}</h3>
                <ul className="hints-list">
                    <li><span className="term">{t('scores', 'hints')}</span> {t('scoresDesc', 'hints')}</li>
                    <li><span className="term">{t('weights', 'hints')}</span> {t('weightsDesc', 'hints')}</li>
                    <li><span className="term">{t('weighted', 'hints')}</span> {t('weightedDesc', 'hints')}</li>
                    <li><span className="term">{t('combined', 'hints')}</span> {t('combinedDesc', 'hints')}</li>
                    <li>{t('tooltip', 'hints')}</li>
                    <li>{t('table', 'hints')}</li>
                </ul>
            </div>
        </div>
    );
};

export default Visualization;