import React from 'react';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';
import './Testimonials.css';

/**
 * Testimonials Component
 * Customer reviews and testimonials slider
 */
const Testimonials = () => {
    const testimonials = [
        {
            id: 1,
            name: 'Sarah Johnson',
            role: 'Apartment Buyer',
            location: '',
            rating: 5,
            text: 'Found my dream apartment in just 2 weeks! The platform is easy to use and the listings were spot on. Highly recommended!',
            avatar: '/avatar1.jpg'
        },
        {
            id: 2,
            name: 'Michael Chen',
            role: 'House Renter',
            location: 'Rotterdam',
            rating: 5,
            text: 'Best real estate platform in the Rwanda. The mortgage calculator helped me understand exactly what I could afford. Excellent service!',
            avatar: '/avatar2.jpg'
        },
        {
            id: 3,
            name: 'Emma Williams',
            role: 'Villa Buyer',
            location: 'Utrecht',
            rating: 5,
            text: 'The property comparison tool was a game-changer. I could easily compare multiple properties side-by-side and make an informed decision.',
            avatar: '/avatar3.jpg'
        },
        {
            id: 4,
            name: 'David Martinez',
            role: 'Commercial Property',
            location: 'The Hague',
            rating: 5,
            text: 'Professional platform with well-documented listings. The map view feature helped me find the perfect location for my business.',
            avatar: '/avatar4.jpg'
        }
    ];

    return (
        <section className="testimonials">
            <div className="container">
                <div className="section-header">
                    <h2>What Our Customers Say</h2>
                    <p>Real experiences from real people</p>
                </div>

                <div className="testimonials-grid">
                    {testimonials.map((testimonial) => (
                        <div key={testimonial.id} className="testimonial-card">
                            <FaQuoteLeft className="quote-icon" />

                            <div className="testimonial-rating">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <FaStar key={i} />
                                ))}
                            </div>

                            <p className="testimonial-text">{testimonial.text}</p>

                            <div className="testimonial-author">
                                <div className="author-avatar">
                                    {testimonial.name.charAt(0)}
                                </div>
                                <div className="author-info">
                                    <h4>{testimonial.name}</h4>
                                    <p>{testimonial.role} - {testimonial.location}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
