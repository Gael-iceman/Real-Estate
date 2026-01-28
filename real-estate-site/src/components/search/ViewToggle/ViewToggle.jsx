import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaTh, FaList, FaMapMarkedAlt } from 'react-icons/fa';
import './ViewToggle.css';

/**
 * ViewToggle Component
 * Toggle between Grid, List, and Map views
 */
const ViewToggle = ({ currentView = 'grid', onViewChange }) => {
    const views = [
        { value: 'grid', icon: <FaTh />, label: 'Grid' },
        { value: 'list', icon: <FaList />, label: 'List' },
        { value: 'map', icon: <FaMapMarkedAlt />, label: 'Map' },
    ];

    const handleViewChange = (view) => {
        if (onViewChange) {
            onViewChange(view);
        }
    };

    return (
        <div className="view-toggle">
            {views.map((view) => (
                <button
                    key={view.value}
                    className={`view-toggle-btn ${currentView === view.value ? 'active' : ''}`}
                    onClick={() => handleViewChange(view.value)}
                    aria-label={`${view.label} view`}
                    title={`${view.label} view`}
                >
                    {view.icon}
                    <span className="view-toggle-label">{view.label}</span>
                </button>
            ))}
        </div>
    );
};

ViewToggle.propTypes = {
    currentView: PropTypes.oneOf(['grid', 'list', 'map']),
    onViewChange: PropTypes.func,
};

export default ViewToggle;
