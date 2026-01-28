import React from "react";
import { Helmet } from "react-helmet";

const PrivacyPolicy = () => (
  <div className="container mt-4 mb-5">
    <Helmet>
      <title>Privacy Policy | Real Estate</title>
      <meta
        name="description"
        content="Learn how LynRealEstate collects, uses, and protects your personal data."
      />
    </Helmet>
    <h1>Privacy Policy</h1>
    <p className="text-muted">Last updated: January 27, 2026</p>
    <p>
      This Privacy Policy explains how LyneRealEstate (“we,” “us,” or “our”)
      collects, uses, discloses, and protects your personal information when
      you use our website and services.
    </p>

    <h4>Information We Collect</h4>
    <p>We may collect the following categories of information:</p>
    <ul>
      <li>Account details (name, email, phone number, password).</li>
      <li>
        Listing information (property details, photos, pricing, and location).
      </li>
      <li>
        Messages and inquiries you send to admins or through contact forms.
      </li>
      <li>Usage data (pages visited, clicks, device and browser info).</li>
    </ul>

    <h4>How We Use Your Information</h4>
    <ul>
      <li>Provide and maintain the platform.</li>
      <li>Process listings, favorites, and user interactions.</li>
      <li>Respond to inquiries and customer support requests.</li>
      <li>Improve site performance, features, and security.</li>
      <li>Send service-related updates when necessary.</li>
    </ul>

    <h4>Sharing of Information</h4>
    <p>
      We do not sell your personal data. We may share information with service
      providers that help us operate the platform (hosting, analytics, email),
      or when required by law or to protect our rights.
    </p>

    <h4>Cookies and Analytics</h4>
    <p>
      We use cookies and similar technologies to remember preferences, analyze
      traffic, and improve the user experience. You can control cookies through
      your browser settings, but some features may not work properly if cookies
      are disabled.
    </p>

    <h4>Data Retention</h4>
    <p>
      We retain personal data only as long as needed for the purposes described
      in this policy or as required by law.
    </p>

    <h4>Security</h4>
    <p>
      We apply reasonable administrative, technical, and physical safeguards to
      protect your information. However, no method of transmission or storage
      is completely secure.
    </p>

    <h4>Your Choices</h4>
    <ul>
      <li>Update or correct your profile information at any time.</li>
      <li>Request deletion of your account, subject to legal obligations.</li>
      <li>Opt out of non-essential communications.</li>
    </ul>

    <h4>Children’s Privacy</h4>
    <p>
      Our services are not intended for children under 13, and we do not
      knowingly collect data from children.
    </p>

    <h4>Changes to This Policy</h4>
    <p>
      We may update this policy from time to time. Any changes will be posted on
      this page with an updated effective date.
    </p>

    <h4>Contact</h4>
    <p>
      If you have questions about this policy, please contact us using the
      email listed on the website.
    </p>
  </div>
);

export default PrivacyPolicy;
