import React from 'react';
import PropTypes from 'prop-types';
import { FaShare, FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp, FaEnvelope, FaLink } from 'react-icons/fa';
import './ShareProperty.css';

/**
 * ShareProperty Component
 * Social sharing buttons for property listings
 */
const ShareProperty = ({ propertyUrl, title, description }) => {
    const shareLinks = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(propertyUrl)}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(propertyUrl)}&text=${encodeURIComponent(title)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(propertyUrl)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(title + ' ' + propertyUrl)}`,
        email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(description + '\n\n' + propertyUrl)}`,
    };

    const handleShare = (platform) => {
        if (platform === 'copy') {
            navigator.clipboard.writeText(propertyUrl);
            // You could add a toast notification here
            alert('Link copied to clipboard!');
            return;
        }
        window.open(shareLinks[platform], '_blank', 'width=600,height=400');
    };

    return (
        <div className="share-property">
            <h4 className="share-title">
                <FaShare /> Share this property
            </h4>
            <div className="share-buttons">
                <button
                    className="share-btn share-facebook"
                    onClick={() => handleShare('facebook')}
                    aria-label="Share on Facebook"
                >
                    <FaFacebook />
                    <span>Facebook</span>
                </button>
                <button
                    className="share-btn share-twitter"
                    onClick={() => handleShare('twitter')}
                    aria-label="Share on Twitter"
                >
                    <FaTwitter />
                    <span>Twitter</span>
                </button>
                <button
                    className="share-btn share-linkedin"
                    onClick={() => handleShare('linkedin')}
                    aria-label="Share on LinkedIn"
                >
                    <FaLinkedin />
                    <span>LinkedIn</span>
                </button>
                <button
                    className="share-btn share-whatsapp"
                    onClick={() => handleShare('whatsapp')}
                    aria-label="Share on WhatsApp"
                >
                    <FaWhatsapp />
                    <span>WhatsApp</span>
                </button>
                <button
                    className="share-btn share-email"
                    onClick={() => handleShare('email')}
                    aria-label="Share via Email"
                >
                    <FaEnvelope />
                    <span>Email</span>
                </button>
                <button
                    className="share-btn share-copy"
                    onClick={() => handleShare('copy')}
                    aria-label="Copy link"
                >
                    <FaLink />
                    <span>Copy Link</span>
                </button>
            </div>
        </div>
    );
};

ShareProperty.propTypes = {
    propertyUrl: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
};

export default ShareProperty;
