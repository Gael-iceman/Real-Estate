import React, { useState } from 'react';
import { Button, Badge, Input, Modal } from '../../common';
import { FaBell, FaTrash, FaEdit, FaSearch } from 'react-icons/fa';
import './SavedSearches.css';

/**
 * SavedSearches Component
 * Manage saved property search filters with alerts
 */
const SavedSearches = () => {
    const [searches, setSearches] = useState([
        {
            id: 1,
            name: ' Apartments',
            filters: { city: '', propertyType: 'apartment', minPrice: 300000, maxPrice: 500000 },
            alertsEnabled: true,
            createdAt: new Date('2024-01-15'),
            matchCount: 24
        },
        {
            id: 2,
            name: 'Utrecht Houses 3+ Beds',
            filters: { city: 'Utrecht', propertyType: 'house', bedrooms: '3+' },
            alertsEnabled: false,
            createdAt: new Date('2024-01-10'),
            matchCount: 12
        }
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSearch, setEditingSearch] = useState(null);
    const [searchName, setSearchName] = useState('');

    const handleToggleAlerts = (id) => {
        setSearches(searches.map(s =>
            s.id === id ? { ...s, alertsEnabled: !s.alertsEnabled } : s
        ));
    };

    const handleDeleteSearch = (id) => {
        if (window.confirm('Are you sure you want to delete this saved search?')) {
            setSearches(searches.filter(s => s.id !== id));
        }
    };

    const handleEditSearch = (search) => {
        setEditingSearch(search);
        setSearchName(search.name);
        setIsModalOpen(true);
    };

    const handleSave = () => {
        if (editingSearch) {
            setSearches(searches.map(s =>
                s.id === editingSearch.id ? { ...s, name: searchName } : s
            ));
        }
        setIsModalOpen(false);
        setEditingSearch(null);
        setSearchName('');
    };

    const formatFilters = (filters) => {
        const parts = [];
        if (filters.city) parts.push(`📍 ${filters.city}`);
        if (filters.propertyType) parts.push(`🏠 ${filters.propertyType}`);
        if (filters.minPrice || filters.maxPrice) {
            parts.push(`💰 €${filters.minPrice?.toLocaleString() || '0'} - €${filters.maxPrice?.toLocaleString() || '∞'}`);
        }
        if (filters.bedrooms) parts.push(`🛏️ ${filters.bedrooms} beds`);
        return parts.join(' • ');
    };

    return (
        <div className="saved-searches">
            <div className="saved-searches-header">
                <h2>Saved Searches</h2>
                <Button variant="primary" icon={<FaSearch />}>
                    New Search
                </Button>
            </div>

            {searches.length === 0 ? (
                <div className="empty-state">
                    <FaSearch />
                    <p>No saved searches yet</p>
                    <Button variant="primary">Create Your First Search</Button>
                </div>
            ) : (
                <div className="searches-grid">
                    {searches.map((search) => (
                        <div key={search.id} className="search-card">
                            <div className="search-card-header">
                                <h3>{search.name}</h3>
                                <div className="search-actions">
                                    <button
                                        className={`alerts-toggle ${search.alertsEnabled ? 'active' : ''}`}
                                        onClick={() => handleToggleAlerts(search.id)}
                                        title={search.alertsEnabled ? 'Alerts enabled' : 'Alerts disabled'}
                                    >
                                        <FaBell />
                                    </button>
                                    <button
                                        className="action-btn"
                                        onClick={() => handleEditSearch(search)}
                                        title="Edit search"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        className="action-btn delete"
                                        onClick={() => handleDeleteSearch(search.id)}
                                        title="Delete search"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>

                            <div className="search-filters">
                                {formatFilters(search.filters)}
                            </div>

                            <div className="search-card-footer">
                                <Badge variant={search.matchCount > 0 ? 'success' : 'neutral'}>
                                    {search.matchCount} properties
                                </Badge>
                                <span className="search-date">
                                    Saved {search.createdAt.toLocaleDateString()}
                                </span>
                            </div>

                            <Button variant="outline" fullWidth size="sm">
                                View Results
                            </Button>
                        </div>
                    ))}
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Edit Saved Search"
                size="md"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleSave}>
                            Save Changes
                        </Button>
                    </>
                }
            >
                <Input
                    label="Search Name"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    placeholder="Enter search name"
                    fullWidth
                />
            </Modal>
        </div>
    );
};

export default SavedSearches;
