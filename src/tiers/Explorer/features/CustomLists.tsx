import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CustomLists.css';
import { useAuth } from '../../../contexts/AuthContext';
import { hasFeature } from '../../../config/tierConfig';
import { listsAPI } from '../../../services/api';
import BackButton from '../../../components/BackButton';

interface CustomList {
    id: string;
    name: string;
    description: string;
    icon: string;
    itemCount: number;
    created_at: string;
}

export default function CustomLists() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [lists, setLists] = useState<CustomList[]>([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newListName, setNewListName] = useState('');
    const [newListDescription, setNewListDescription] = useState('');
    const [newListIcon, setNewListIcon] = useState('📋');
    const [loading, setLoading] = useState(true);
    const [creatingList, setCreatingList] = useState(false);
    const [error, setError] = useState('');
    const [localError, setLocalError] = useState('');

    const hasExplorerAccess = hasFeature(user?.tier, 'hasCustomLists');

    const ICON_OPTIONS = ['📋', '🏔️', '💕', '👨‍👩‍👧', '🎭', '🍽️', '🎵', '⚽', '🎨', '🌟'];

    useEffect(() => {
        if (hasExplorerAccess) {
            loadLists();
        } else {
            setLoading(false);
        }
    }, [hasExplorerAccess, user?.tier]);

    const loadLists = async () => {
        try {
            setLoading(true);
            const data = await listsAPI.getLists();
            setLists(data);
            setError('');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateList = async () => {
        if (!newListName.trim()) {
            setLocalError('List name is required');
            return;
        }

        try {
            setCreatingList(true);
            setLocalError('');
            await listsAPI.createList(newListName, newListDescription, newListIcon);
            setShowCreateModal(false);
            setNewListName('');
            setNewListDescription('');
            setNewListIcon('📋');
            loadLists();
        } catch (err: any) {
            setLocalError(err.message);
        } finally {
            setCreatingList(false);
        }
    };

    const handleDeleteList = async (id: string) => {
        if (!confirm('Are you sure you want to delete this list?')) return;

        try {
            await listsAPI.deleteList(id);
            loadLists();
        } catch (err: any) {
            setError(err.message);
        }
    };

    if (!hasExplorerAccess) {
        return (
            <div className="custom-lists-locked">
                <div className="lock-content">
                    <div className="lock-icon">🔒</div>
                    <h2>Custom Lists</h2>
                    <p>Create and organize multiple activity collections</p>
                    <div className="upgrade-features">
                        <div className="feature-item">📋 Create unlimited lists</div>
                        <div className="feature-item">🎨 Customize with icons</div>
                        <div className="feature-item">📱 Organize your activities</div>
                    </div>
                    <button className="upgrade-btn" onClick={() => window.location.href = '/profile'}>
                        Upgrade to Explorer
                    </button>
                </div>
            </div>
        );
    }

    if (loading) {
        return <div className="custom-lists-loading">Loading lists...</div>;
    }

    return (
        <div className="custom-lists-container">
            <BackButton to="/profile" />
            <div className="lists-header">
                <h2>My Custom Lists</h2>
                <span className="explorer-badge">👑 Explorer Feature</span>
                <button className="create-list-btn" onClick={() => setShowCreateModal(true)}>
                    + New List
                </button>
            </div>

            {error && (
                <div className="error-banner">
                    <p>{error}</p>
                    <button className="close-error" onClick={() => setError('')}>×</button>
                </div>
            )}

            <div className="lists-grid">
                {lists.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📋</div>
                        <h3>No lists yet</h3>
                        <p>Create your first custom list to organize activities</p>
                        <button className="create-first-btn" onClick={() => setShowCreateModal(true)}>
                            Create Your First List
                        </button>
                    </div>
                ) : (
                    lists.map(list => (
                        <div key={list.id} className="list-card">
                            <div className="list-icon">{list.icon}</div>
                            <div className="list-info">
                                <h3>{list.name}</h3>
                                {list.description && <p>{list.description}</p>}
                                <div className="list-meta">
                                    <span className="item-count">{list.itemCount} activities</span>
                                </div>
                            </div>
                            <div className="list-actions">
                                <button className="view-btn" onClick={() => navigate(`/lists/${list.id}`)}>
                                    View
                                </button>
                                <button className="delete-btn" onClick={() => handleDeleteList(list.id)}>
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Create List Modal */}
            {showCreateModal && (
                <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Create New List</h3>
                            <button className="close-btn" onClick={() => setShowCreateModal(false)}>✕</button>
                        </div>
                        <div className="modal-body">
                            {localError && <div className="modal-error">{localError}</div>}
                            <div className="form-group">
                                <label>Icon</label>
                                <div className="icon-picker">
                                    {ICON_OPTIONS.map(icon => (
                                        <button
                                            key={icon}
                                            className={`icon-option ${newListIcon === icon ? 'selected' : ''}`}
                                            onClick={() => setNewListIcon(icon)}
                                        >
                                            {icon}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="form-group">
                                <label>List Name *</label>
                                <input
                                    type="text"
                                    value={newListName}
                                    onChange={(e) => setNewListName(e.target.value)}
                                    placeholder="e.g., Weekend Adventures"
                                    maxLength={50}
                                />
                            </div>
                            <div className="form-group">
                                <label>Description (optional)</label>
                                <textarea
                                    value={newListDescription}
                                    onChange={(e) => setNewListDescription(e.target.value)}
                                    placeholder="Describe this list..."
                                    maxLength={200}
                                    rows={3}
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="cancel-btn" onClick={() => setShowCreateModal(false)}>
                                Cancel
                            </button>
                            <button
                                className="btn-primary create-btn"
                                onClick={handleCreateList}
                                disabled={creatingList}
                            >
                                {creatingList ? (
                                    <span className="loading-spinner-inline"></span>
                                ) : (
                                    'CREATE LIST'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
