import { useState, useEffect } from 'react';
import { listsAPI } from '../services/api';
import './ListPickerModal.css';
import { useTranslation } from 'react-i18next';

interface ListPickerModalProps {
    activity: any;
    onClose: () => void;
    onAddSuccess: () => void;
}

export default function ListPickerModal({ activity, onClose, onAddSuccess }: ListPickerModalProps) {
    const [lists, setLists] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [processing, setProcessing] = useState<string | null>(null);
    const { t } = useTranslation();

    useEffect(() => {
        loadLists();
    }, []);

    const loadLists = async () => {
        try {
            setLoading(true);
            const data = await listsAPI.getLists();
            setLists(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToList = async (listId: string) => {
        try {
            setProcessing(listId);
            await listsAPI.addItemToList(listId, activity);
            onAddSuccess();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setProcessing(null);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content list-picker-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{t('list.add_title', 'Add to Custom List')}</h3>
                    <button onClick={onClose} className="close-btn">×</button>
                </div>

                <div className="modal-body">
                    {loading ? (
                        <p className="loading-text">Loading your lists...</p>
                    ) : error ? (
                        <div className="error-msg">
                            {error}
                            <button onClick={loadLists}>Retry</button>
                        </div>
                    ) : lists.length === 0 ? (
                        <div className="empty-lists">
                            <p>{t('list.empty', "You haven't created any lists yet.")}</p>
                            <button className="btn-primary" onClick={() => window.location.href = '/lists'}>
                                {t('list.create_first', 'Create First List')}
                            </button>
                        </div>
                    ) : (
                        <div className="picker-grid">
                            {lists.map(list => (
                                <button
                                    key={list.id}
                                    className="list-picker-item"
                                    disabled={processing !== null}
                                    onClick={() => handleAddToList(list.id)}
                                >
                                    <span className="list-icon">{list.icon}</span>
                                    <span className="list-name">{list.name}</span>
                                    {processing === list.id && <span className="spinner">⌛</span>}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    <button className="btn-secondary" onClick={onClose}>{t('common.cancel', 'Cancel')}</button>
                </div>
            </div>
        </div>
    );
}
