import { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { hasFeature } from '../../../config/tierConfig';
import { exportAPI } from '../../../services/api';
import UpgradePrompt from '../../Free/features/UpgradePrompt';

interface CalendarExportProps {
    activities: any[];
    buttonStyle?: React.CSSProperties;
    className?: string;
}

export default function CalendarExport({ activities, buttonStyle, className }: CalendarExportProps) {
    const { user } = useAuth();
    const [exporting, setExporting] = useState(false);
    const [showUpgrade, setShowUpgrade] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const hasAccess = hasFeature(user?.tier, 'hasExportCalendar');

    const handleExport = async () => {
        if (!hasAccess) {
            setShowUpgrade(true);
            return;
        }

        if (!activities || activities.length === 0) {
            setError('No activities to export');
            return;
        }

        try {
            setExporting(true);
            setError(null);
            await exportAPI.toCalendar(activities);
        } catch (err: any) {
            setError(err.message || 'Failed to export');
        } finally {
            setExporting(false);
        }
    };

    return (
        <>
            <button
                onClick={handleExport}
                className={`export-btn ${className || ''}`}
                style={buttonStyle}
                disabled={exporting}
                title={hasAccess ? "Export to Calendar" : "Upgrade to export"}
            >
                {exporting ? '⏳ Exporting...' : '📅 Export to Calendar'}
                {!hasAccess && <span className="lock-icon">🔒</span>}
            </button>

            {error && (
                <div className="export-error">
                    {error}
                    <button onClick={() => setError(null)}>×</button>
                </div>
            )}

            {showUpgrade && (
                <UpgradePrompt
                    feature="Calendar Export"
                    currentLimit="Locked"
                    tier="Explorer"
                    onClose={() => setShowUpgrade(false)}
                />
            )}

            <style>{`
                .export-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 16px;
                    background-color: #fff;
                    border: 1px solid #e2e8f0;
                    border-radius: 6px;
                    color: #4a5568;
                    font-size: 0.9rem;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .export-btn:hover:not(:disabled) {
                    background-color: #f7fafc;
                    border-color: #cbd5e0;
                }
                .export-btn:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }
                .lock-icon {
                    font-size: 0.8rem;
                }
                .export-error {
                    position: absolute;
                    top: 100%;
                    right: 0;
                    background: #fff5f5;
                    border: 1px solid #feb2b2;
                    color: #c53030;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 0.8rem;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    margin-top: 4px;
                    z-index: 10;
                    white-space: nowrap;
                }
            `}</style>
        </>
    );
}
