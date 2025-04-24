import React, {useMemo} from 'react';
import './styles/details.css';
import { useTranslation } from '../../hooks/useTranslation';
import {useAppContext} from "../../AppContext";


const DetailsSection = () => {
    const { currentWork } = useAppContext();
    const t = useTranslation();

    const totals = useMemo(() => {
        return {
            aiWeightSum: currentWork.aiWeights.reduce((sum, w) => sum + w, 0).toFixed(2),
            humanWeightSum: currentWork.humanWeights.reduce((sum, w) => sum + w, 0).toFixed(2),
            aiWeightedScore: currentWork.aiScores.reduce((sum, score, i) => sum + score * currentWork.aiWeights[i], 0).toFixed(2),
            humanWeightedScore: currentWork.humanScores.reduce((sum, score, i) => sum + score * currentWork.humanWeights[i], 0).toFixed(2)
        };
    }, [currentWork]);

    return (
        <div className="component-container">
            <h3 className="section-title">{t('details')}: {currentWork.title}</h3>

            <div className="component-grid grid-2-cols">
                <div className="info-box">
                    <span className="data-label">{t('ai', 'labels')} {t('grade', 'labels') || 'Note'}:</span>
                    <span className="data-value">{currentWork.aiGrade.toFixed(1)}</span>
                </div>
                <div className="info-box">
                    <span className="data-label">{t('human', 'labels')} {t('grade', 'labels') || 'Note'}:</span>
                    <span className="data-value">{currentWork.humanGrade.toFixed(1)}</span>
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
                    {currentWork.criteriaKeys.map((label, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                            <td>{currentWork.criteriaLabels[index]}</td>
                            <td>{currentWork.aiScores[index]}%</td>
                            <td>{currentWork.aiWeights[index]}</td>
                            <td>{currentWork.humanScores[index]}%</td>
                            <td>{currentWork.humanWeights[index]}</td>
                            <td>{(currentWork.aiScores[index] * currentWork.aiWeights[index]).toFixed(2)}</td>
                            <td>{(currentWork.humanScores[index] * currentWork.humanWeights[index]).toFixed(2)}</td>
                        </tr>
                    ))}
                    <tr className="totals-row">
                        <td>{t('total', 'tableHeaders')}</td>
                        <td>-</td>
                        <td>{totals.aiWeightSum}</td>
                        <td>-</td>
                        <td>{totals.humanWeightSum}</td>
                        <td>{totals.aiWeightedScore}</td>
                        <td>{totals.humanWeightedScore}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DetailsSection;