import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { fetchproperties } from "../../actions/property";
import PropertyCard from "../propertycard/propertyCard";
import SearchBar from "../searchbar/SearchBar";
import PropertyGrid from "../property/PropertyGrid/PropertyGrid";
import { PropertyTypes, HowItWorks, Testimonials } from "../home";
import { Helmet } from "react-helmet";

import './mainpage.css';
import './hero.css';

const initialState = {
  offset: 0,
  limit: 12,
  noMoreproperties: false,
  isLoading: true
};

class MainPage extends Component {
  state = initialState;

  componentDidMount() {
    setTimeout(() => {
      if (this.props.allproperties.length !== 0) {
        this.setState({
          ...this.state,
          offset: this.props.allproperties.length,
          noMoreproperties: true,
          isLoading: false
        });
      } else {
        this.setState(initialState);
        this.props.fetchproperties(this.state.offset);
        this.setState({
          offset: this.state.offset + this.state.limit,
          noMoreproperties: true
        });
      }
    }, 500);
  }

  componentWillUnmount() {}

  loadMore = () => {
    this.props.fetchproperties(this.state.offset);
    this.setState({ offset: this.state.offset + this.state.limit });
  };

  componentDidUpdate(prevProps) {
    if (prevProps.user !== this.props.user) {
      this.props.fetchproperties(0);
    }
    if (
      this.state.isLoading &&
      (prevProps.allproperties !== this.props.allproperties ||
        prevProps.propertiesCount !== this.props.propertiesCount ||
        prevProps.error !== this.props.error)
    ) {
      this.setState({ isLoading: false });
    }
  }

  renderEmptyState = () => (
    <div className="container">
      <div className="empty-state">
        <h2>No properties listed yet</h2>
        <p>Listings will appear here as soon as they are published.</p>
      </div>
    </div>
  );

  render() {
    // Use real data from backend
    const displayproperties = this.props.allproperties || [];

    if (this.props.error?.actionErr) {
      return (
        <div className="container mt-4">
          <div className="alert alert-danger" role="alert">
            {this.props.error.actionErr}
          </div>
        </div>
      );
    }

    if (this.state.isLoading) {
      return (
        <div className="container mt-4">
          <div className="empty-state">
            <h2>Loading listings...</h2>
            <p>Please wait a moment.</p>
          </div>
        </div>
      );
    }

    if (!displayproperties || displayproperties.length === 0) {
      return this.renderEmptyState();
    }

    return (
      <Fragment>
        <Helmet>
          <title>Real Estate - Find Your Dream Home</title>
          <meta name="description" content="Browse curated properties across the Rwanda" />
        </Helmet>

        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-text">
              <div className="hero-content-inner">
                <p className="hero-eyebrow">Find your next place</p>
                <h1 className="hero-title">Browse verified listings across the Rwanda</h1>
                <p className="hero-subtitle">
                  Search by city, price, and deal type. Save favorites and contact admins directly.
                </p>
                <div className="hero-tags">
                  <span className="hero-tag">Admin listings</span>
                  <span className="hero-tag">Favorites</span>
                  <span className="hero-tag">Clear details</span>
                </div>
              </div>
            </div>
            <div className="hero-search-card">
              <SearchBar />
            </div>
          </div>
        </section>

        <div className="container">
          {/* Property Types */}
          <PropertyTypes />
        </div>

        <div className="container">
          {/* All Properties */}
          <div className="propertySection">
            <h2 className="heading-style-h2" style={{ marginBottom: '2rem' }}>
              All Properties
            </h2>
            <PropertyGrid>
              {displayproperties.map((property, i) => (
                <PropertyCard property={property} key={i} />
              ))}
            </PropertyGrid>

            {/* Load More Button */}
            <div className="d-flex justify-content-center mt-3 mb-5">
              {this.props.propertiesCount <= this.state.offset ? (
                <p className="text-muted">
                  {this.state.noMoreproperties
                    ? "Sorry, no more properties"
                    : "Loading..."}
                </p>
              ) : (
                <button
                  onClick={this.loadMore}
                  className="btn btn-primary myBox mb-2"
                >
                  Load more
                </button>
              )}
            </div>
          </div>

          {/* How It Works */}
          <HowItWorks />

          {/* Testimonials */}
          <Testimonials />
        </div>
      </Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    allproperties: state.propertyReducer.allproperties,
    propertiesCount: state.propertyReducer.propertiesCount,
    user: state.userReducer,
    error: state.errorReducer
  };
}

export default connect(mapStateToProps, { fetchproperties })(MainPage);
