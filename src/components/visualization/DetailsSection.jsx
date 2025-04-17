import React from 'react';
import './styles/details.css';
import { useTranslation } from '../../hooks/useTranslation';

const DetailsSection = ({ work, language }) => {
    const t = useTranslation(language);

    return (
        <div className="details-container">
            <h3 className="details-title">{t('details')}: {work.title}</h3>

            <div className="grades-container">
                <div className="grade-box">
                    <span className="grade-label">{t('ki', 'labels')} {t('grade', 'labels') || 'Note'}:</span>
                    <span className="grade-value">{work.aiGrade.toFixed(1)}</span>
                </div>
                <div className="grade-box">
                    <span className="grade-label">{t('human', 'labels')} {t('grade', 'labels') || 'Note'}:</span>
                    <span className="grade-value">{work.humanGrade.toFixed(1)}</span>
                </div>
            </div>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                    <tr>
                        <th>{t('criterion', 'tableHeaders')}</th>
                        <th>{t('aiGrade', 'tableHeaders')}</th>
                        <th>{t('aiWeight', 'tableHeaders')}</th>
                        <th>{t('humanGrade', 'tableHeaders')}</th>
                        <th>{t('humanWeight', 'tableHeaders')}</th>
                        <th>{t('aiWeighted', 'tableHeaders')}</th>
                        <th>{t('humanWeighted', 'tableHeaders')}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {work.criteriaKeys.map((label, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                            <td>{work.criteriaLabels[index]}</td>
                            <td>{work.aiScores[index]}%</td>
                            <td>{work.aiWeights[index]}</td>
                            <td>{work.humanScores[index]}%</td>
                            <td>{work.humanWeights[index]}</td>
                            <td>{(work.aiScores[index] * work.aiWeights[index]).toFixed(2)}</td>
                            <td>{(work.humanScores[index] * work.humanWeights[index]).toFixed(2)}</td>
                        </tr>
                    ))}
                    <tr className="totals-row">
                        <td>{t('total', 'tableHeaders')}</td>
                        <td>-</td>
                        <td>{work.aiWeights.reduce((sum, w) => sum + w, 0).toFixed(2)}</td>
                        <td>-</td>
                        <td>{work.humanWeights.reduce((sum, w) => sum + w, 0).toFixed(2)}</td>
                        <td>
                            {work.aiScores.reduce((sum, score, i) => sum + score * work.aiWeights[i], 0).toFixed(2)}
                        </td>
                        <td>
                            {work.humanScores.reduce((sum, score, i) => sum + score * work.humanWeights[i], 0).toFixed(2)}
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DetailsSection;