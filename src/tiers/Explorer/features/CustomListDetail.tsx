import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { listsAPI } from '../../../services/api';
import BackButton from '../../../components/BackButton';
import ActivityCard from '../../../components/ActivityCard';
import './CustomListDetail.css';

interface ListDetail {
    id: string;
    name: string;
    description: string;
    icon: string;
    items: any[];
}

export default function CustomListDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [list, setList] = useState<ListDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (id) {
            loadListDetails();
        }
    }, [id]);

    const loadListDetails = async () => {
        try {
            setLoading(true);
            const data = await listsAPI.getList(id!);
            setList(data);
        } catch (err: any) {
            setError(err.message || 'Failed to load list details');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveItem = async (itemId: string) => {
        try {
            await listsAPI.removeItemFromList(id!, itemId);
            loadListDetails(); // Refresh list
        } catch (err: any) {
            setError(err.message || 'Failed to remove item');
        }
    };

    if (loading) {
        return (
            <div className="list-detail-loading">
                <div className="spinner"></div>
                <p>Loading list details...</p>
            </div>
        );
    }

    if (error || !list) {
        return (
            <div className="list-detail-error">
                <BackButton to="/lists" />
                <div className="error-content">
                    <h2>Oops!</h2>
                    <p>{error || 'List not found'}</p>
                    <button onClick={() => navigate('/lists')} className="btn-primary">
                        Back to My Lists
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="list-detail-container">
            <header className="list-detail-header">
                <BackButton to="/lists" />
                <div className="list-header-info">
                    <span className="list-header-icon">{list.icon}</span>
                    <div className="list-title-group">
                        <h1>{list.name}</h1>
                        {list.description && <p className="list-description">{list.description}</p>}
                    </div>
                </div>
                <div className="list-stats">
                    <span className="badge">{list.items.length} Activities</span>
                </div>
            </header>

            <main className="list-detail-content">
                {list.items.length === 0 ? (
                    <div className="empty-list-state">
                        <div className="empty-icon">🏝️</div>
                        <h3>This list is empty</h3>
                        <p>Start adding activities from the home page!</p>
                        <button onClick={() => navigate('/')} className="btn-primary">
                            Browse Activities
                        </button>
                    </div>
                ) : (
                    <div className="activities-grid">
                        {list.items.map((item) => (
                            <div key={item.id} className="list-item-wrapper">
                                <ActivityCard
                                    activity={item.activity}
                                    isFavorite={false} // Simple for now
                                    onToggleFavorite={() => { }}
                                />
                                <button
                                    className="remove-item-btn"
                                    onClick={() => handleRemoveItem(item.id)}
                                    title="Remove from list"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
