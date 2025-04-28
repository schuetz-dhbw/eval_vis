import React from 'react';
import {DATA_KEYS} from "../../constants/chartConstants";

/**
 * Wiederverwendbarer CustomTooltip für alle Chart-Typen
 *
 * @param {Object} props
 * @param {boolean} props.active - Ob der Tooltip aktiv ist
 * @param {Array} props.payload - Die Tooltip-Daten
 * @param {Function} props.formatter - Optionale Formattierungsfunktion für Tooltip-Inhalte
 * @returns {JSX.Element|null} - Tooltip-Komponente oder null wenn inaktiv
 */
const CustomTooltip = ({
                           active,
                           payload,
                           formatter,
                           labelFormatter
                       }) => {
    if (!active || !payload || !payload.length) {
        return null;
    }

    const data = payload[0].payload;
    const defaultFormatter = (value) => {
        return value !== undefined && value !== null
            ? Number(value).toFixed(2)
            : '-';
    };

    // Standard-Formatierung der Tooltip-Werte, falls kein eigener Formatter übergeben wurde
    const formatValue = (val) => formatter ? formatter(val) : defaultFormatter(val);

    // Titel aus dem ersten Datenpunkt oder dem labelFormatter
    const title = labelFormatter ? labelFormatter(data) : (data.name || data.shortName || '');

    if (formatter && typeof formatter === 'function') {
        const formattedData = formatter(data);
        if (formattedData && typeof formattedData === 'object' && formattedData.items) {
            return (
                <div className="custom-tooltip">
                    {formattedData.title && <p className="tooltip-title">{formattedData.title}</p>}
                    {formattedData.items.map((item, idx) => (
                        <p key={idx} className={`tooltip-item ${item.className || ''}`}>
                            <span className="tooltip-label">{item.name}: </span>
                            <span className="tooltip-value">{item.value}</span>
                        </p>
                    ))}
                </div>
            );
        }
    }

    return (
        <div className="custom-tooltip">
            {title && <p className="tooltip-title">{title}</p>}
            <div>
                {payload.map((entry, index) => {
                    // Bestimme die richtige CSS-Klasse
                    let className = entry.dataKey;

                    // Spezialregeln für Combined-Ansicht
                    if (entry.dataKey === DATA_KEYS.AI_SCORE || entry.dataKey === DATA_KEYS.AI_WEIGHT || entry.dataKey === DATA_KEYS.AI_WEIGHTED) {
                        className = 'ai';
                    } else if (entry.dataKey === DATA_KEYS.HUMAN_SCORE || entry.dataKey === DATA_KEYS.HUMAN_WEIGHT || entry.dataKey === DATA_KEYS.HUMAN_WEIGHTED) {
                        className = 'human';
                    }

                    return (
                        <p key={`item-${index}`} className={`tooltip-item ${className}`}>
                            <span className="tooltip-label">{entry.name}:</span>
                            <span className="tooltip-value">{formatValue(entry.value)}</span>
                        </p>
                    );
                })}
            </div>
        </div>
    );
};

export default CustomTooltip;