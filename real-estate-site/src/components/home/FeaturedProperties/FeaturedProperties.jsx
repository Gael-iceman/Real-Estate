import React from 'react';
import PropertyCard from '../../property/PropertyCard/PropertyCard';
import PropertyGrid from '../../property/PropertyGrid/PropertyGrid';
import './FeaturedProperties.css';

/**
 * FeaturedProperties Component
 * Carousel slider for featured property listings
 */
const FeaturedProperties = ({ properties = [] }) => {
    if (!properties || properties.length === 0) {
        return null;
    }

    return (
        <section className="featured-properties">
            <div className="container">
                <div className="section-header">
                    <h2>Featured Properties</h2>
                    <p>Hand-picked properties you might like</p>
                </div>

                <PropertyGrid>
                    {properties.map((property) => (
                        <PropertyCard property={property} key={property.id} />
                    ))}
                </PropertyGrid>
            </div>
        </section>
    );
};

export default FeaturedProperties;
