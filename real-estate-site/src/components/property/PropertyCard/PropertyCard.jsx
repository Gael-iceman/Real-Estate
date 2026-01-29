import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import {
    FaBed,
    FaBath,
    FaRuler,
    FaMapMarkerAlt,
    FaHeart,
    FaRegHeart,
    FaCalendar,
    FaParking,
    FaLeaf,
    FaBuilding,
    FaEye
} from 'react-icons/fa';
import { Badge } from '../../common';
import numeral from 'numeral';
import { formatDistanceToNow } from 'date-fns';
import { getPrimaryImageUrl } from '../../../utils/images';
import './PropertyCard.css';

/**
 * Modern Property Card Component
 * Displays property with rich icons and information
 */
const PropertyCard = ({
    property,
    onFavoriteToggle,
    isFavorite = false,
    detailPath,
}) => {
    const history = useHistory();
    const cardRef = useRef(null);

    const {
        id,
        title,
        price,
        address,
        city,
        image,
        nrOfRooms,
        nrOfBathrooms,
        sqrMeter,
        constructionYear,
        parking,
        description,
        isForSale,
        isForRent,
        createdAt,
        property_features = [],
        propertiestatus,
        status,
        propertyType,
    } = property;

    // Get primary image
    const primaryImage = getPrimaryImageUrl(property) || image || '/placeholder-property.jpg';

    const displayTitle = title || address;
    const propertyTypeLabel = propertyType
        ? propertyType.toString().replace(/_/g, " ").toUpperCase()
        : "";
    const normalizedStatus = (propertiestatus || status || "").toString().toLowerCase();
    const statusLabel = normalizedStatus ? normalizedStatus : "";
    const statusVariant = statusLabel === "sold" || statusLabel === "rented" || statusLabel === "inactive"
        ? "error"
        : statusLabel === "pending"
            ? "warning"
            : statusLabel === "active"
                ? "success"
                : "info";

    // Format price
    const formattedPrice = numeral(price).format('0,0');
    const currency = (property.currency || "RWF").toUpperCase();
    const currencyLabel = isForRent ? `${currency}/month` : currency;

    // Get time since listed
    const listedTime = createdAt ? formatDistanceToNow(new Date(createdAt), { addSuffix: true }) : '';

    // Check if has garden
    const hasGarden = property_features.some(e => e.feature?.text?.toLowerCase().includes('garden'));
    const hasParking = parking && String(parking).trim().toLowerCase() !== 'no';

    // Navigate to property detail page
    const handleCardClick = (e) => {
        // Don't navigate if clicking favorite button
        if (e.target.closest('.property-card-favorite')) {
            return;
        }
        const targetPath = detailPath || `/view/${id}`;
        history.push(targetPath);
    };

    const handleMouseMove = event => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const rotateX = ((y / rect.height) - 0.5) * -10;
        const rotateY = ((x / rect.width) - 0.5) * 10;
        cardRef.current.style.setProperty('--tilt-x', `${rotateX}deg`);
        cardRef.current.style.setProperty('--tilt-y', `${rotateY}deg`);
        cardRef.current.style.setProperty('--glow-x', `${(x / rect.width) * 100}%`);
        cardRef.current.style.setProperty('--glow-y', `${(y / rect.height) * 100}%`);
    };

    const handleMouseLeave = () => {
        if (!cardRef.current) return;
        cardRef.current.style.setProperty('--tilt-x', '0deg');
        cardRef.current.style.setProperty('--tilt-y', '0deg');
        cardRef.current.style.setProperty('--glow-x', '50%');
        cardRef.current.style.setProperty('--glow-y', '50%');
    };

    // Toggle favorite
    const handleFavoriteClick = (e) => {
        e.stopPropagation();
        if (onFavoriteToggle) {
            onFavoriteToggle(id);
        }
    };

    return (
        <div
            className="property-card"
            ref={cardRef}
            onClick={handleCardClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {/* Image Section */}
            <div className="property-card-image">
                <img src={primaryImage} alt={address} />

                {/* Overlay Badges */}
                <div className="property-card-badges">
                    {propertyTypeLabel && (
                        <Badge variant="warning" size="sm" rounded>
                            {propertyTypeLabel}
                        </Badge>
                    )}
                    {isForSale && (
                        <Badge variant="success" size="sm" rounded>
                            FOR SALE
                        </Badge>
                    )}
                    {isForRent && (
                        <Badge variant="info" size="sm" rounded>
                            FOR RENT
                        </Badge>
                    )}
                </div>

                {/* Favorite Button */}
                <button
                    type="button"
                    className="property-card-favorite"
                    onClick={handleFavoriteClick}
                    aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    aria-pressed={isFavorite}
                >
                    {isFavorite ? <FaHeart /> : <FaRegHeart />}
                </button>

                {/* Status Badge */}
                {statusLabel ? (
                    <div className="property-card-status">
                        <Badge variant={statusVariant} size="sm" rounded>
                            {statusLabel.toUpperCase()}
                        </Badge>
                    </div>
                ) : null}

            </div>

            {/* Content Section */}
            <div className="property-card-content">
                {/* Title */}
                <h3 className="property-card-title">{displayTitle}</h3>
                <div className="property-card-id">ID: {id}</div>

                {/* Price */}
                <div className="property-card-price">
                    {formattedPrice} {currencyLabel}
                </div>
                <div className="property-card-location">
                    <FaMapMarkerAlt />
                    <span>{city}</span>
                </div>

                {/* Property Details Grid */}
                <div className="property-card-details">
                    {nrOfRooms && (
                        <div className="property-detail-item">
                            <FaBed />
                            <span>{nrOfRooms} Bedrooms</span>
                        </div>
                    )}
                    {nrOfBathrooms && (
                        <div className="property-detail-item">
                            <FaBath />
                            <span>{nrOfBathrooms} Bathrooms</span>
                        </div>
                    )}
                    {sqrMeter && (
                        <div className="property-detail-item">
                            <FaRuler />
                            <span>{sqrMeter} m²</span>
                        </div>
                    )}
                    {constructionYear && (
                        <div className="property-detail-item">
                            <FaBuilding />
                            <span>Built {constructionYear}</span>
                        </div>
                    )}
                    {hasGarden && (
                        <div className="property-detail-item">
                            <FaLeaf />
                            <span>Garden</span>
                        </div>
                    )}
                    {hasParking && (
                        <div className="property-detail-item">
                            <FaParking />
                            <span>Parking</span>
                        </div>
                    )}
                </div>

                {/* Description Preview */}
                {description && (
                    <p className="property-card-description">
                        {description.length > 100
                            ? `${description.substring(0, 100)}...`
                            : description}
                    </p>
                )}

                {/* Footer */}
                <div className="property-card-footer">
                    <div className="property-card-meta">
                        <FaCalendar />
                        <span>Listed {listedTime}</span>
                    </div>
                    <div className="property-card-actions">
                        <span className="property-card-view-btn">
                            <FaEye />
                            View Details
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

PropertyCard.propTypes = {
    property: PropTypes.shape({
        id: PropTypes.number.isRequired,
        price: PropTypes.number.isRequired,
        currency: PropTypes.string,
        title: PropTypes.string,
        address: PropTypes.string.isRequired,
        city: PropTypes.string.isRequired,
        image: PropTypes.string,
        property_images: PropTypes.array,
        nrOfRooms: PropTypes.number,
        nrOfBathrooms: PropTypes.number,
        sqrMeter: PropTypes.number,
        constructionYear: PropTypes.number,
        parking: PropTypes.string,
        description: PropTypes.string,
        isForSale: PropTypes.bool,
        isForRent: PropTypes.bool,
        createdAt: PropTypes.string,
        property_features: PropTypes.array,
    }).isRequired,
    onFavoriteToggle: PropTypes.func,
    isFavorite: PropTypes.bool,
    detailPath: PropTypes.string,
};

export default PropertyCard;
