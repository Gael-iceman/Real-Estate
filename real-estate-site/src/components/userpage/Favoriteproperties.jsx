import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";

import { getFavorites } from "../../actions/likes";
import PropertyCard from "../propertycard/propertyCard";
import { getPrimaryImageUrl } from "../../utils/images";
import PropertyGrid from "../property/PropertyGrid/PropertyGrid";

class Favoriteproperties extends Component {
  componentDidMount() {
    if (this.props.user) {
      this.props.getFavorites();
    }
  }

  render() {
    if (!this.props.user) {
      return (
        <div className="row mt-3 text-center">
          <Helmet>
            <title>Favorites | Real Estate</title>
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
      if (!this.props.favorites) {
        return (
          <div className="container mt-3">
            <Helmet>
              <title>Favorites | Real Estate</title>
            </Helmet>
            <h4>Loading...</h4>
          </div>
        );
      } else {
        if (this.props.favorites.length === 0) {
          return (
            <div className="container">
              <Helmet>
                <title>Favorites | Real Estate</title>
              </Helmet>
              <div className="empty-state">
                <h2>No favorites yet</h2>
                <p>Browse listings and tap the heart to save them.</p>
              </div>
            </div>
          );
        } else {
          return (
            <div className="container mt-3">
              <Helmet>
                <title>Favorites | Real Estate</title>
              </Helmet>
              <PropertyGrid>
                {this.props.favorites.map((likedproperty, i) => {
                  const primaryUrl = getPrimaryImageUrl(likedproperty.property);
                  if (primaryUrl) {
                    likedproperty.property.image = primaryUrl;
                  }
                  return <PropertyCard property={likedproperty.property} key={i} />;
                })}
              </PropertyGrid>
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
    favorites: state.likeReducer.userFavorites
  };
}

export default connect(mapStateToProps, { getFavorites })(Favoriteproperties);
