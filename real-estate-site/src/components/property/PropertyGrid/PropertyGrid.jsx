import React from 'react';
import PropTypes from 'prop-types';
import './PropertyGrid.css';

/**
 * PropertyGrid Component
 * Responsive grid layout for property cards
 */
const PropertyGrid = ({ children, columns = 'auto' }) => {
    const gridClass = columns === 'auto'
        ? 'property-grid-auto'
        : `property-grid-${columns}`;

    return (
        <div className={`property-grid ${gridClass}`}>
            {children}
        </div>
    );
};

PropertyGrid.propTypes = {
    children: PropTypes.node.isRequired,
    columns: PropTypes.oneOf(['auto', 1, 2, 3, 4]),
};

export default PropertyGrid;
