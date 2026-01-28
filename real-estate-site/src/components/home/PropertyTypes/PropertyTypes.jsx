import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaBuilding, FaWarehouse, FaHouseUser, FaMountain } from 'react-icons/fa';
import './PropertyTypes.css';

/**
 * Property Types Showcase Component
 * Displays different property type categories
 */
const PropertyTypes = () => {
    const propertyTypes = [
        {
            icon: <FaHome />,
            title: 'Houses',
            description: 'Find your dream house',
            link: '/search/type/house'
        },
        {
            icon: <FaBuilding />,
            title: 'Apartments',
            description: 'Modern city living',
            link: '/search/type/apartment'
        },
        {
            icon: <FaWarehouse />,
            title: 'Commercial',
            description: 'Business properties',
            link: '/search/type/commercial'
        },
        {
            icon: <FaHouseUser />,
            title: 'Villas',
            description: 'Luxury estates',
            link: '/search/type/villa'
        },
        {
            icon: <FaMountain />,
            title: 'Land',
            description: 'Plots and land listings',
            link: '/search/type/land'
        }
    ];

    return (
        <section className="property-types-section">
            <div className="container">
                <div className="section-header">
                    <h2>Browse by Property Type</h2>
                    <p>Find the perfect property that matches your lifestyle</p>
                </div>

                <div className="property-types-grid">
                    {propertyTypes.map((type, index) => (
                        <Link to={type.link} key={index} className="property-type-card">
                            <div className="property-type-icon">{type.icon}</div>
                            <h3 className="property-type-title">{type.title}</h3>
                            <p className="property-type-description">{type.description}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PropertyTypes;
