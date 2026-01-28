import React from "react";
import { Helmet } from "react-helmet";

const AboutUs = () => (
  <div className="container mt-4 mb-5">
    <Helmet>
      <title>About Us | Real Estate</title>
    </Helmet>
    <h1>About Us</h1>
    <p className="text-muted">Helping people find the right property.</p>
    <p>
      We are a real estate platform focused on clear listings, transparent
      information, and simple tools for discovering properties. Our goal is to
      make buying, renting, and selling easier for everyone.
    </p>
    <h4>What We Offer</h4>
    <ul>
      <li>Verified listings with up-to-date details.</li>
      <li>Fast filtering by city, price, and property type.</li>
      <li>Favorites to keep track of your best options.</li>
    </ul>
    <h4>Contact</h4>
    <p>
      Reach out using the contact details in the footer if you have questions
      or want to work with us.
    </p>
  </div>
);

export default AboutUs;
