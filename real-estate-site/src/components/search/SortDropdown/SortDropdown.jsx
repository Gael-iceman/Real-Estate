import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaSortAmountDown } from 'react-icons/fa';
import './SortDropdown.css';

/**
 * SortDropdown Component
 * Dropdown to sort property listings
 */
const SortDropdown = ({ onSortChange, currentSort = 'newest' }) => {
    const [isOpen, setIsOpen] = useState(false);

    const sortOptions = [
        { value: 'newest', label: 'Newest First' },
        { value: 'price-low', label: 'Price: Low to High' },
        { value: 'price-high', label: 'Price: High to Low' },
        { value: 'size-large', label: 'Size: Largest First' },
        { value: 'size-small', label: 'Size: Smallest First' },
    ];

    const handleSort = (value) => {
        setIsOpen(false);
        if (onSortChange) {
            onSortChange(value);
        }
    };

    const currentLabel = sortOptions.find(opt => opt.value === currentSort)?.label || 'Sort By';

    return (
        <div className="sort-dropdown">
            <button
                className="sort-dropdown-trigger"
                onClick={() => setIsOpen(!isOpen)}
            >
                <FaSortAmountDown />
                <span>{currentLabel}</span>
                <svg
                    className={`sort-dropdown-arrow ${isOpen ? 'open' : ''}`}
                    width="12"
                    height="8"
                    viewBox="0 0 12 8"
                    fill="none"
                >
                    <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
            </button>

            {isOpen && (
                <>
                    <div className="sort-dropdown-backdrop" onClick={() => setIsOpen(false)} />
                    <div className="sort-dropdown-menu">
                        {sortOptions.map((option) => (
                            <button
                                key={option.value}
                                className={`sort-dropdown-item ${currentSort === option.value ? 'active' : ''}`}
                                onClick={() => handleSort(option.value)}
                            >
                                {option.label}
                                {currentSort === option.value && <span className="check">✓</span>}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

SortDropdown.propTypes = {
    onSortChange: PropTypes.func,
    currentSort: PropTypes.string,
};

export default SortDropdown;
