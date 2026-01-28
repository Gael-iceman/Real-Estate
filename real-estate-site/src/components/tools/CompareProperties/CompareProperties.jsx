import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from '../../common';
import {
    FaTimes,
    FaBed,
    FaBath,
    FaRuler,
    FaBuilding,
    FaParking,
    FaEuroSign
} from 'react-icons/fa';
import numeral from 'numeral';
import './CompareProperties.css';

/**
 * CompareProperties Component
 * Side-by-side property comparison
 */
const CompareProperties = ({ properties = [], onRemove, onClear }) => {
    if (!properties || properties.length === 0) {
        return (
            <div className="compare-empty">
                <p>Select properties to compare (up to 4)</p>
            </div>
        );
    }

    const comparisonFields = [
        {
            key: 'price',
            label: 'Price',
            icon: <FaEuroSign />,
            format: (val) => numeral(val).format('€0,0')
        },
        {
            key: 'address',
            label: 'Address',
            icon: null,
            format: (val) => val
        },
        {
            key: 'city',
            label: 'City',
            icon: null,
            format: (val) => val
        },
        {
            key: 'nrOfRooms',
            label: 'Bedrooms',
            icon: <FaBed />,
            format: (val) => val || 'N/A'
        },
        {
            key: 'nrOfBathrooms',
            label: 'Bathrooms',
            icon: <FaBath />,
            format: (val) => val || 'N/A'
        },
        {
            key: 'sqrMeter',
            label: 'Size',
            icon: <FaRuler />,
            format: (val) => val ? `${val} m²` : 'N/A'
        },
        {
            key: 'constructionYear',
            label: 'Year Built',
            icon: <FaBuilding />,
            format: (val) => val || 'N/A'
        },
        {
            key: 'parking',
            label: 'Parking',
            icon: <FaParking />,
            format: (val) => val ? 'Yes' : 'No'
        },
    ];

    return (
        <div className="compare-properties">
            <div className="compare-header">
                <h2>Compare Properties</h2>
                {onClear && (
                    <Button variant="outline" size="sm" onClick={onClear}>
                        Clear All
                    </Button>
                )}
            </div>

            <div className="compare-table-wrapper">
                <table className="compare-table">
                    <thead>
                        <tr>
                            <th className="compare-label-column">Feature</th>
                            {properties.map((property) => (
                                <th key={property.id} className="compare-property-column">
                                    <div className="compare-property-header">
                                        <img
                                            src={property.image || '/placeholder-property.jpg'}
                                            alt={property.address}
                                            className="compare-property-image"
                                        />
                                        <div className="compare-property-info">
                                            <h3>{property.address}</h3>
                                            <p>{property.city}</p>
                                        </div>
                                        {onRemove && (
                                            <button
                                                className="compare-remove-btn"
                                                onClick={() => onRemove(property.id)}
                                                aria-label="Remove from comparison"
                                            >
                                                <FaTimes />
                                            </button>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {comparisonFields.map((field) => (
                            <tr key={field.key}>
                                <td className="compare-label-cell">
                                    {field.icon && <span className="compare-icon">{field.icon}</span>}
                                    <span>{field.label}</span>
                                </td>
                                {properties.map((property) => (
                                    <td key={property.id} className="compare-value-cell">
                                        {field.format(property[field.key])}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

CompareProperties.propTypes = {
    properties: PropTypes.arrayOf(PropTypes.object),
    onRemove: PropTypes.func,
    onClear: PropTypes.func,
};

export default CompareProperties;
