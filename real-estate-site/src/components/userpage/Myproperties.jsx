import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

import { getMyproperties } from "../../actions/property";
import PropertyCard from "../propertycard/propertyCard";
import { isAdminUser } from "../../utils/roles";
import { getPrimaryImageUrl } from "../../utils/images";
import PropertyGrid from "../property/PropertyGrid/PropertyGrid";

import "./myproperties.css";

class Myproperties extends Component {
  state = {
    query: "",
    status: "all",
    deal: "all"
  };

  componentDidMount() {
    if (this.props.user && isAdminUser(this.props.user)) {
      this.props.getMyproperties();
    }
  }

  render() {
    if (!this.props.user) {
      return (
        <div className="row mt-3 text-center">
          <Helmet>
            <title>My Properties | Real Estate</title>
          </Helmet>
          <div className="col-12">
            <h4>Now you can Login to access your account.</h4>
          </div>
          <div className="col-12">
            <Link className="btn btn-outline-success" to="/login">
              Login
            </Link>
            <Link className="btn btn-outline-info ml-1" to="/register">
              Sign Up
            </Link>
          </div>
        </div>
      );
    } else {
      if (!isAdminUser(this.props.user)) {
        return (
          <div className="container text-center mt-3">
            <Helmet>
              <title>My Properties | Real Estate</title>
            </Helmet>
            <h4>This area is for admins only.</h4>
            <Link to="/">Back to listings</Link>
          </div>
        );
      }
      if (!this.props.userproperties) {
        return (
          <div className="container mt-3">
            <Helmet>
              <title>My Properties | Real Estate</title>
            </Helmet>
            <h4>Loading...</h4>
          </div>
        );
      } else {
        if (this.props.userproperties.length === 0) {
          return (
            <div className="container text-center mt-3">
              <Helmet>
                <title>My Properties | Real Estate</title>
              </Helmet>
              <h4>You have not added property_listings yet</h4>
              <Link to="/admin">Add property</Link>
            </div>
          );
        } else {
          const query = this.state.query.trim().toLowerCase();
          const filtered = this.props.userproperties.filter(property => {
            const matchesQuery = !query
              ? true
              : [property.title, property.address, property.city, property.postcode]
                .filter(Boolean)
                .some(text => String(text).toLowerCase().includes(query));

            const matchesStatus =
              this.state.status === "all"
                ? true
                : String(property.propertiestatus || "").toLowerCase() ===
                  this.state.status;

            const matchesDeal =
              this.state.deal === "all"
                ? true
                : this.state.deal === "sale"
                  ? Boolean(property.isForSale)
                  : Boolean(property.isForRent);

            return matchesQuery && matchesStatus && matchesDeal;
          });
          return (
            <div className="container">
              <Helmet>
                <title>My Properties | Real Estate</title>
              </Helmet>
              <div className="myproperties-toolbar">
                <div className="myproperties-search">
                  <label className="sr-only" htmlFor="myproperties-query">
                    Search
                  </label>
                  <input
                    id="myproperties-query"
                    type="text"
                    className="form-control"
                    placeholder="Search by name, address, or city"
                    value={this.state.query}
                    onChange={e => this.setState({ query: e.target.value })}
                  />
                </div>
                <div className="myproperties-filters">
                  <select
                    className="form-control"
                    value={this.state.status}
                    onChange={e => this.setState({ status: e.target.value })}
                  >
                    <option value="all">All statuses</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="sold">Sold</option>
                    <option value="rented">Rented</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <select
                    className="form-control"
                    value={this.state.deal}
                    onChange={e => this.setState({ deal: e.target.value })}
                  >
                    <option value="all">All deals</option>
                    <option value="sale">For Sale</option>
                    <option value="rent">For Rent</option>
                  </select>
                </div>
              </div>
              {filtered.length === 0 ? (
                <div className="empty-state">
                  <h2>No matching properties</h2>
                  <p>Try adjusting your filters.</p>
                </div>
              ) : (
                <PropertyGrid>
                  {filtered.map((property, i) => {
                    const primaryUrl = getPrimaryImageUrl(property);
                    if (primaryUrl) {
                      property.image = primaryUrl;
                    }
                    return <PropertyCard key={i} property={property} />;
                  })}
                </PropertyGrid>
              )}
            </div>
          );
        }
      }
    }
  }
}

function mapStateToProps(state) {
  return {
    user: state.userReducer,
    userproperties: state.propertyReducer.myproperties
  };
}

export default connect(mapStateToProps, { getMyproperties })(Myproperties);
