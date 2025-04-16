import React from 'react';
import './styles/details.css';
import { getTranslation } from '../../utils/translationHelpers';

const DetailsSection = ({ work, translations, language }) => {
    const t = (key, section = null) => getTranslation(translations, language, key, section);

    return (
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
    );
};

export default DetailsSection;