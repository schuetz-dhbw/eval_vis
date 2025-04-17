export const de = {
    title: "Visualisierung der Bewertungen: KI vs. Mensch",
    chartTypes: {
        scores: "Zielerreichungsgrade",
        weights: "Gewichtungen",
        weighted: "Gewichtete Werte",
        combined: "Kombinierte Darstellung",
        statistics: "Statistische Analyse",
        workTypeAnalysis: "Analyse nach Arbeitstyp"
    },
    metricsDescriptions: {
        cosineDescription: "Misst die Winkelähnlichkeit zwischen KI- und Human-Bewertungen (1,0 = identisch, 0,0 = völlig unterschiedlich)",
        distanceDescription: "Euklidische Distanz zwischen KI- und Human-Bewertungen (niedriger = ähnlicher)",
        gradeDifferenceDescription: "Unterschied zwischen den finalen Noten von KI und Human"
    },
    metricsQuality: {
        excellent: "Hervorragend",
        good: "Gut",
        moderate: "Moderat",
        poor: "Schwach"
    },
    metrics: {
        cosine: "Kosinus-Ähnlichkeit",
        distance: "Euklidische Distanz",
        avgDifference: "Durchschnittliche Differenz",
        maxDiff: "Max",
        minDiff: "Min",
        standardDeviation: "Standardabweichung",
        weightDifference: "Gewichtungsdifferenz",
        gradeDifference: "Notendifferenz"
    },
    chartTitles: {
        metricsTitle: "Ähnlichkeitsmetriken",
        vectors: "Bewertungsvektoren",
        combinedTitle: "Bewertungen und Gewichtungen",
        radar: "Spinnendiagramm",
        bar: "Balkendiagramm",
        radarWeighted: "Spinnendiagramm (Gewichtete Werte)",
        barWeighted: "Balkendiagramm (Gewichtete Werte)",
        varianceTitle: "Varianzanalyse der Kriterien",
        varianceTable: "Kriterien nach Varianz sortiert",
        correlationTitle: "Korrelationsanalyse",
        workTypeAnalysisTitle: "Analyse nach Arbeitstyp",
        differenceByTypeTitle: "Durchschnittliche Differenz nach Arbeitstyp",
        criteriaByTypeTitle: "Kriterien-Differenzen nach Arbeitstyp",
        largestDiffByTypeTitle: "Größte Differenz nach Arbeitstyp",
        topCriteriaTitle: "Top 5 Kriterien nach Differenz"
    },
    labels: {
        ki: "KI",
        human: "Human",
        kiScore: "KI Wert",
        humanScore: "Human Wert",
        aiWeight: "KI Gewichtung",
        humanWeight: "Human Gewichtung",
        score: "Wert",
        variance: "Varianz",
        difference: "Differenz",
        criteriaVariance: "Kriterienvarianzen",
        correlation: "Korrelation",
        grade: "Note"
    },
    tableHeaders: {
        criterion: "Kriterium",
        aiGrade: "KI-Bewertung",
        aiWeight: "KI-Gewichtung",
        humanGrade: "-Bewertung",
        humanWeight: "Human-Gewichtung",
        aiWeighted: "KI (gewichtet)",
        humanWeighted: "Human (gewichtet)",
        workType: "Arbeitstyp",
        avgByType: "Durchschnitt nach Typ",
        count: "Anzahl",
        total: "Gesamt"
    },
    hints: {
        title: "Hinweise zur Nutzung:",
        scores: "Zielerreichungsgrade",
        weights: "Gewichtungen",
        combined: "Kombinierte Darstellung",
        statistics: "Statistische Analyse",
        workTypeAnalysis: "Analyse nach Arbeitstyp",
        scoresDesc: "zeigt die ursprünglichen Zielerreichungsgrade (0-100%)",
        weightsDesc: "zeigt die relative Gewichtung der Kriterien (0-25%)",
        combinedDesc: "zeigt die kombinierten Werte sowie die gewichtete Punkte der Bewertung",
        statisticsDesc: "vergleicht Varianz und Korrelation zwischen Kriterienbewertungen",
        workTypeAnalysisDesc: "zeigt Differenzen zwischen KI und Mensch basierend auf dem Arbeitstyp (analytische vs. konstruktive Arbeit)",
        tooltip: "Bewegen Sie den Mauszeiger über die Diagramme für detaillierte Informationen",
        table: "Die Tabelle zeigt die Bewertungsdetails zur ausgewählten Arbeit"
    },
    language: "Sprache",
    details: "Bewertungsdetails"
};
