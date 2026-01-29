import React from "react";
import PropTypes from "prop-types";
import { getPrimaryImageUrl } from "../../utils/images";
import "./PropertyImageSlider.css";

const PropertyImageSlider = ({ property }) => {
  const images = property?.property_images || [];
  const urls = images
    .map(imageCon => imageCon?.image?.url)
    .filter(Boolean);
  const primaryIndex = images.findIndex(imageCon => imageCon?.image?.isPrimary);
  const initialIndex = primaryIndex >= 0 ? primaryIndex : 0;
  const [activeIndex, setActiveIndex] = React.useState(initialIndex);
  const [isOpen, setIsOpen] = React.useState(false);
  const propertyId = property?.id;

  React.useEffect(() => {
    const nextIndex = primaryIndex >= 0 ? primaryIndex : 0;
    setActiveIndex(nextIndex);
  }, [propertyId, primaryIndex]);

  React.useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = event => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  React.useEffect(() => {
    if (!urls.length) {
      setActiveIndex(0);
      return;
    }
    if (activeIndex > urls.length - 1) {
      setActiveIndex(urls.length - 1);
    }
  }, [urls.length, activeIndex]);

  const fallbackUrl = getPrimaryImageUrl(property) || property?.image || "/placeholder-property.jpg";
  const mainUrl = urls[activeIndex] || fallbackUrl;
  const altText = property?.address
    ? `${property.address}, ${property.city || ""}`.trim()
    : "Property image";
  const total = urls.length;

  const goPrev = () => {
    if (!total) return;
    setActiveIndex(prev => (prev - 1 + total) % total);
  };

  const goNext = () => {
    if (!total) return;
    setActiveIndex(prev => (prev + 1) % total);
  };

  return (
    <div className="property-gallery">
      <div className="property-gallery-main">
        <button
          type="button"
          className="property-gallery-main-button"
          onClick={() => setIsOpen(true)}
          aria-label="Open image gallery"
        >
          <img src={mainUrl} alt={altText} loading="eager" />
        </button>
        {total > 1 ? (
          <>
            <button
              type="button"
              className="property-gallery-nav property-gallery-prev"
              onClick={goPrev}
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              type="button"
              className="property-gallery-nav property-gallery-next"
              onClick={goNext}
              aria-label="Next image"
            >
              ›
            </button>
            <div className="property-gallery-count">
              {activeIndex + 1} / {total}
            </div>
          </>
        ) : null}
      </div>
      {total > 1 ? (
        <div className="property-gallery-thumbs">
          {urls.map((url, index) => (
            <button
              key={`${url}-${index}`}
              type="button"
              className={`property-gallery-thumb${index === activeIndex ? " is-active" : ""}`}
              onClick={() => setActiveIndex(index)}
              aria-pressed={index === activeIndex}
              aria-label={`View image ${index + 1}`}
            >
              <img src={url} alt={`${altText} thumbnail ${index + 1}`} loading="lazy" />
            </button>
          ))}
        </div>
      ) : null}
      {isOpen ? (
        <div className="property-gallery-modal" onClick={() => setIsOpen(false)}>
          <div
            className="property-gallery-modal-content"
            onClick={event => event.stopPropagation()}
          >
            <button
              type="button"
              className="property-gallery-modal-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close image gallery"
            >
              ×
            </button>
            <div className="property-gallery-modal-main">
              <img src={mainUrl} alt={altText} />
              {total > 1 ? (
                <>
                  <button
                    type="button"
                    className="property-gallery-nav property-gallery-prev"
                    onClick={goPrev}
                    aria-label="Previous image"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    className="property-gallery-nav property-gallery-next"
                    onClick={goNext}
                    aria-label="Next image"
                  >
                    ›
                  </button>
                  <div className="property-gallery-count">
                    {activeIndex + 1} / {total}
                  </div>
                </>
              ) : null}
            </div>
            {total > 1 ? (
              <div className="property-gallery-thumbs">
                {urls.map((url, index) => (
                  <button
                    key={`modal-${url}-${index}`}
                    type="button"
                    className={`property-gallery-thumb${index === activeIndex ? " is-active" : ""}`}
                    onClick={() => setActiveIndex(index)}
                    aria-pressed={index === activeIndex}
                    aria-label={`View image ${index + 1}`}
                  >
                    <img src={url} alt={`${altText} thumbnail ${index + 1}`} loading="lazy" />
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
};

PropertyImageSlider.propTypes = {
  property: PropTypes.shape({
    id: PropTypes.number,
    address: PropTypes.string,
    city: PropTypes.string,
    image: PropTypes.string,
    property_images: PropTypes.array
  })
};

export default PropertyImageSlider;
