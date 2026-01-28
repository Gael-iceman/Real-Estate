import React from 'react';
import PropTypes from 'prop-types';
import { FaPhone, FaEnvelope, FaWhatsapp } from 'react-icons/fa';
import { Button } from '../../common';
import './StickyContactCard.css';

/**
 * StickyContactCard Component
 * Floating contact card for property admin/seller
 */
const StickyContactCard = ({ agent }) => {
    if (!agent) return null;

    return (
        <div className="sticky-contact-card">
            <div className="contact-card-content">
                <div className="agent-avatar">
                    {agent.username ? agent.username.charAt(0).toUpperCase() : 'A'}
                </div>

                <div className="agent-info">
                    <h4>{agent.username || 'Admin'}</h4>
                    {agent.agency && <p className="agency-name">{agent.agency.name}</p>}
                    {agent.email && <p className="contact-detail"><FaEnvelope /> {agent.email}</p>}
                    {agent.phoneNumber && <p className="contact-detail"><FaPhone /> {agent.phoneNumber}</p>}
                </div>

                <div className="contact-actions">
                    {agent.phoneNumber && (
                        <Button
                            variant="secondary"
                            fullWidth
                            icon={<FaWhatsapp />}
                            onClick={() => window.open(`https://wa.me/${agent.phoneNumber.replace(/[^0-9]/g, '')}`, '_blank')}
                        >
                            WhatsApp
                        </Button>
                    )}

                    {agent.email && (
                        <Button
                            variant="outline"
                            fullWidth
                            icon={<FaEnvelope />}
                            onClick={() => window.location.href = `mailto:${agent.email}`}
                        >
                            Send Email
                        </Button>
                    )}
                </div>

                <div className="response-info">
                    <small>Typically responds within 24 hours</small>
                </div>
            </div>
        </div>
    );
};

StickyContactCard.propTypes = {
    agent: PropTypes.shape({
        username: PropTypes.string,
        email: PropTypes.string,
        phoneNumber: PropTypes.string,
        agency: PropTypes.shape({
            name: PropTypes.string,
        }),
    }),
};

export default StickyContactCard;
