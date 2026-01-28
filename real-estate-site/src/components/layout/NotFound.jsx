import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="container">
    <Helmet>
      <title>Page Not Found | Real Estate</title>
    </Helmet>
    <div className="empty-state">
      <h2>This page does not exist</h2>
      <p>The page you are looking for is not available.</p>
      <div className="mt-3">
        <Link className="btn btn-primary" to="/">
          Go to Home
        </Link>
      </div>
    </div>
  </div>
);

export default NotFound;
