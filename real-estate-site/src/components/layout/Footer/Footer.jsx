import React from 'react';
import { Link } from 'react-router-dom';
import {
    FaYoutube,
    FaTwitter,
    FaInstagram,
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt
} from 'react-icons/fa';
import { FaTiktok } from 'react-icons/fa6';
import './Footer.css';

/**
 * Footer Component
 * Site-wide footer with links, contact info, and social media
 */
const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-container">
                {/* Main Footer Content */}
                <div className="footer-content">
                    {/* Company Info */}
                    <div className="footer-section footer-section-wide">
                        <h3 className="footer-heading">LyneRealEstate</h3>
                        <p className="footer-text">
                            Your trusted partner for buying, selling, and renting properties across the Rwanda.
                        </p>
                        <div className="footer-social">
                            <a href="https://www.youtube.com/@lynerealestates" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                                <FaYoutube />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                                <FaTwitter />
                            </a>
                            <a href="https://www.instagram.com/lynerealestate/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                                <FaInstagram />
                            </a>
                            <a href="https://www.tiktok.com/@lynerealestate" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                                <FaTiktok />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-section">
                        <h4 className="footer-heading">Quick Links</h4>
                        <ul className="footer-links">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/search/city/any">Browse Properties</Link></li>
                            <li><Link to="/favorites">Favorites</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="footer-section">
                        <h4 className="footer-heading">Contact Us</h4>
                        <ul className="footer-contact">
                            <li>
                                <FaMapMarkerAlt />
                                <span>Kigali, Rwanda</span>
                            </li>
                            <li>
                                <FaPhone />
                                <span>+250790682778</span>
                            </li>
                            <li>
                                <FaEnvelope />
                                <span>Lynerealestate24@gmail.com </span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="footer-bottom">
                    <div className="footer-bottom-content">
                        <p className="footer-copyright">
                            © {currentYear} LyneRealEstate. All rights reserved.
                        </p>
                        <div className="footer-legal">
                            <Link to="/privacy">Privacy Policy</Link>
                            <span>•</span>
                            <Link to="/terms">Terms of Service</Link>
                            <span>•</span>
                            <Link to="/about">About Us</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
