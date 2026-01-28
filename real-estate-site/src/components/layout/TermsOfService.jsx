import React from "react";
import { Helmet } from "react-helmet";

const TermsOfService = () => (
  <div className="container mt-4 mb-5">
    <Helmet>
      <title>Terms of Service | Real Estate</title>
    </Helmet>
    <h1>Terms of Service</h1>
    <p className="text-muted">Last updated: January 25, 2026</p>
    <p>
      By using this platform, you agree to these Terms of Service. Please read
      them carefully.
    </p>
    <h4>Use of the Platform</h4>
    <p>
      You must provide accurate information and use the platform only for lawful
      purposes. Misuse, spam, or fraudulent listings are prohibited.
    </p>
    <h4>Listings and Content</h4>
    <p>
      Listing admins are responsible for the accuracy of property information.
      We do not guarantee availability or suitability of any listing.
    </p>
    <h4>Account Security</h4>
    <p>
      You are responsible for maintaining the confidentiality of your account
      credentials and activities performed under your account.
    </p>
    <h4>Limitation of Liability</h4>
    <p>
      We are not liable for any damages arising from the use of the platform,
      including data loss or interrupted service.
    </p>
    <h4>Contact</h4>
    <p>
      If you have questions about these terms, please contact us at the email
      listed on the website.
    </p>
  </div>
);

export default TermsOfService;
