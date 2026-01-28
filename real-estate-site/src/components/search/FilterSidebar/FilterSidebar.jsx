import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Input, Button } from '../../common';
import { FaFilter, FaTimes } from 'react-icons/fa';
import './FilterSidebar.css';

/**
 * FilterSidebar Component
 * Advanced property search filters
 */
const FilterSidebar = ({ onFilterChange, initialFilters = {} }) => {
    const [filters, setFilters] = useState({
        propertyType: initialFilters.propertyType || '',
        minPrice: initialFilters.minPrice || '',
        maxPrice: initialFilters.maxPrice || '',
        bedrooms: initialFilters.bedrooms || '',
        bathrooms: initialFilters.bathrooms || '',
        minSize: initialFilters.minSize || '',
        maxSize: initialFilters.maxSize || '',
        parking: initialFilters.parking || false,
        garden: initialFilters.garden || false,
        ...initialFilters
    });

    const handleChange = (field, value) => {
        const newFilters = { ...filters, [field]: value };
        setFilters(newFilters);
        if (onFilterChange) {
            onFilterChange(newFilters);
        }
    };

    const clearFilters = () => {
        const clearedFilters = {
            propertyType: '',
            minPrice: '',
            maxPrice: '',
            bedrooms: '',
            bathrooms: '',
            minSize: '',
            maxSize: '',
            parking: false,
            garden: false
        };
        setFilters(clearedFilters);
        if (onFilterChange) {
            onFilterChange(clearedFilters);
        }
    };

    return (
        <aside className="filter-sidebar">
            <div className="filter-header">
                <h3><FaFilter /> Filters</h3>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    icon={<FaTimes />}
                >
                    Clear All
                </Button>
            </div>

            <div className="filter-section">
                <label className="filter-label">Property Type</label>
                <select
                    className="filter-select"
                    value={filters.propertyType}
                    onChange={(e) => handleChange('propertyType', e.target.value)}
                >
                    <option value="">All Types</option>
                    <option value="house">House</option>
                    <option value="apartment">Apartment</option>
                    <option value="villa">Villa</option>
                    <option value="studio">Studio</option>
                </select>
            </div>

            <div className="filter-section">
                <label className="filter-label">Price Range (€)</label>
                <div className="filter-range">
                    <Input
                        type="number"
                        placeholder="Min"
                        value={filters.minPrice}
                        onChange={(e) => handleChange('minPrice', e.target.value)}
                        size="sm"
                    />
                    <span>to</span>
                    <Input
                        type="number"
                        placeholder="Max"
                        value={filters.maxPrice}
                        onChange={(e) => handleChange('maxPrice', e.target.value)}
                        size="sm"
                    />
                </div>
            </div>

            <div className="filter-section">
                <label className="filter-label">Bedrooms</label>
                <div className="filter-buttons">
                    {['1', '2', '3', '4', '5+'].map((num) => (
                        <button
                            key={num}
                            className={`filter-btn ${filters.bedrooms === num ? 'active' : ''}`}
                            onClick={() => handleChange('bedrooms', num)}
                        >
                            {num}
                        </button>
                    ))}
                </div>
            </div>

            <div className="filter-section">
                <label className="filter-label">Bathrooms</label>
                <div className="filter-buttons">
                    {['1', '2', '3', '4+'].map((num) => (
                        <button
                            key={num}
                            className={`filter-btn ${filters.bathrooms === num ? 'active' : ''}`}
                            onClick={() => handleChange('bathrooms', num)}
                        >
                            {num}
                        </button>
                    ))}
                </div>
            </div>

            <div className="filter-section">
                <label className="filter-label">Size (m²)</label>
                <div className="filter-range">
                    <Input
                        type="number"
                        placeholder="Min"
                        value={filters.minSize}
                        onChange={(e) => handleChange('minSize', e.target.value)}
                        size="sm"
                    />
                    <span>to</span>
                    <Input
                        type="number"
                        placeholder="Max"
                        value={filters.maxSize}
                        onChange={(e) => handleChange('maxSize', e.target.value)}
                        size="sm"
                    />
                </div>
            </div>

            <div className="filter-section">
                <label className="filter-label">Amenities</label>
                <div className="filter-checkboxes">
                    <label className="filter-checkbox">
                        <input
                            type="checkbox"
                            checked={filters.parking}
                            onChange={(e) => handleChange('parking', e.target.checked)}
                        />
                        <span>Parking</span>
                    </label>
                    <label className="filter-checkbox">
                        <input
                            type="checkbox"
                            checked={filters.garden}
                            onChange={(e) => handleChange('garden', e.target.checked)}
                        />
                        <span>Garden</span>
                    </label>
                </div>
            </div>
        </aside>
    );
};

FilterSidebar.propTypes = {
    onFilterChange: PropTypes.func,
    initialFilters: PropTypes.object,
};

export default FilterSidebar;
