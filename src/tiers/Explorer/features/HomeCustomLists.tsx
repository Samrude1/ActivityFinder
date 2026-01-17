import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { listsAPI } from '../../../services/api';

interface CustomList {
    id: string;
    name: string;
    icon: string;
    itemCount: number;
}

export default function HomeCustomLists() {
    const navigate = useNavigate();
    const [lists, setLists] = useState<CustomList[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadLists();
    }, []);

    const loadLists = async () => {
        try {
            const data = await listsAPI.getLists();
            setLists(data);
        } catch (error) {
            console.error('Failed to load lists for home page:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return null;

    return (
        <section className="home-custom-lists-section" style={{ marginBottom: 'var(--space-xl)' }}>
            <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
                <h2 className="section-title" style={{ fontSize: 'var(--font-size-xl)', margin: 0 }}>My Lists</h2>
                <button
                    className="btn-ghost"
                    onClick={() => navigate('/lists')}
                    style={{ fontSize: 'var(--font-size-sm)', padding: 'var(--space-xs) var(--space-sm)' }}
                >
                    View All →
                </button>
            </div>

            <div className="scroll-container" style={{ paddingBottom: 'var(--space-sm)' }}>
                {lists.map(list => (
                    <div
                        key={list.id}
                        className="home-list-card"
                        onClick={() => navigate(`/lists/${list.id}`)}
                        style={{
                            minWidth: '160px',
                            backgroundColor: 'var(--bg-card)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-lg)',
                            padding: 'var(--space-md)',
                            cursor: 'pointer',
                            transition: 'var(--transition)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            gap: 'var(--space-sm)'
                        }}
                    >
                        <span style={{ fontSize: '2rem' }}>{list.icon}</span>
                        <div>
                            <h3 style={{ fontSize: 'var(--font-size-base)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px' }}>{list.name}</h3>
                            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>
                                {list.itemCount} items
                            </span>
                        </div>
                    </div>
                ))}

                <div
                    className="home-list-card create-new"
                    onClick={() => navigate('/lists')}
                    style={{
                        minWidth: '160px',
                        backgroundColor: 'var(--bg-secondary)',
                        border: '1px dashed var(--border-color)',
                        borderRadius: 'var(--radius-lg)',
                        padding: 'var(--space-md)',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        gap: 'var(--space-sm)'
                    }}
                >
                    <span style={{ fontSize: '1.5rem', color: 'var(--text-secondary)' }}>+</span>
                    <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', fontWeight: 500 }}>Create New</span>
                </div>
            </div>
        </section>
    );
}
