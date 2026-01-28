import React from 'react';
import { FaSearch, FaHeart, FaEnvelope, FaKey } from 'react-icons/fa';
import './HowItWorks.css';

/**
 * HowItWorks Component
 * Explains the property buying/renting process
 */
const HowItWorks = () => {
    const steps = [
        {
            icon: <FaSearch />,
            title: 'Search Properties',
            description: 'Browse properties using filters and map view.'
        },
        {
            icon: <FaHeart />,
            title: 'Save Favorites',
            description: 'Keep track of the listings you love.'
        },
        {
            icon: <FaEnvelope />,
            title: 'Contact Admin',
            description: 'Reach out using the listing contact details.'
        },
        {
            icon: <FaKey />,
            title: 'Move In',
            description: 'Finalize the deal and move in.'
        }
    ];

    return (
        <section className="how-it-works">
            <div className="container">
                <div className="section-header">
                    <h2>How It Works</h2>
                    <p>Find your dream property in 4 simple steps</p>
                </div>

                <div className="steps-grid">
                    {steps.map((step, index) => (
                        <div key={index} className="step-card">
                            <div className="step-number">
                                {index + 1}
                            </div>
                            <div className="step-icon">
                                {step.icon}
                            </div>
                            <h3 className="step-title">{step.title}</h3>
                            <p className="step-description">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
