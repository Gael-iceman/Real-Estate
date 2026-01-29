import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import {
  fetchpropertiesBySearchTerm,
  clearSearchedproperties,
} from "../../actions/property";

import PropertyCard from "../propertycard/propertyCard";
import PropertyGrid from "../property/PropertyGrid/PropertyGrid";
import { getPrimaryImageUrl } from "../../utils/images";

import { Helmet } from "react-helmet";
import SearchBarSearchPage from "../searchbar/SearchBarSearchPage";


const initialState = {
  offset: 0,
  limit: 12,
  search: {}
};
class MainPage extends Component {
  state = initialState;

  getSearchContext = (searchOverride = null) => {
    const { keyword, value } = this.props.match.params;
    const searchBy = keyword === "type" ? "propertyType" : keyword;
    let searchFor = value;
    if (searchBy === "city") {
      searchFor = searchOverride?.city || value;
    }
    return { searchBy, searchFor };
  };

  componentDidMount() {
    // console.log(this.props);
    const { searchBy, searchFor } = this.getSearchContext();
    if (this.props.allproperties) {
      if (this.props.allproperties.length !== 0) {
        this.setState({
          ...this.state,
          offset: this.props.allproperties.length
        });
      } else {
        this.setState(initialState);
        this.props.fetchpropertiesBySearchTerm(
          this.state.offset,
          searchBy,
          searchFor,
          this.props.location.state
        );
        this.setState({ offset: this.state.offset + this.state.limit });
      }
    } else {
      this.props.fetchpropertiesBySearchTerm(
        0,
        searchBy,
        searchFor,
        this.props.location.state
      );
      this.setState({ offset: this.state.offset + this.state.limit });
    }
  }

  findMore = (search) => {
    this.setState({ ...this.state, search });
    // console.log(search);
    const { priceFrom, priceTo, forRent, forSale } = search;
    const { searchBy, searchFor } = this.getSearchContext(search);

    this.props.clearSearchedproperties();
    this.props.fetchpropertiesBySearchTerm(
      0,
      searchBy,
      searchFor,
      { priceFrom, priceTo, forRent, forSale }
    );
    console.log(this.state.offset, this.props.propertiesCount)
    this.setState({ offset: this.state.offset + this.state.limit });
  }

  loadMore = () => {
    if (Object.keys(this.state.search).length === 0) {
      const { searchBy, searchFor } = this.getSearchContext();
      this.props.fetchpropertiesBySearchTerm(
        this.state.offset,
        searchBy,
        searchFor,
        this.props.location.state
      );
      this.setState({ offset: this.state.offset + this.state.limit });
    } else {
      const { priceFrom, priceTo, forRent, forSale } = this.state.search;
      const { searchBy, searchFor } = this.getSearchContext(this.state.search);
      this.props.fetchpropertiesBySearchTerm(
        this.state.offset,
        searchBy,
        searchFor,
        { priceFrom, priceTo, forRent, forSale }
      );
      this.setState({ offset: this.state.offset + this.state.limit });
    }
    console.log(this.state.offset, this.props.propertiesCount)

  };

  numberWithSpaces = x => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  componentWillUnmount() {
    this.props.clearSearchedproperties();
  }

  render() {
    // console.log(this.state);
    console.log();

    if (this.props.error?.actionErr) {
      return (
        <div className="container mt-4">
          <div className="alert alert-danger" role="alert">
            {this.props.error.actionErr}
          </div>
        </div>
      );
    }

    if (!this.props.allproperties || this.props.allproperties.length === 0) {
      return (
        <div className="container">
          <div className="empty-state">
            <h2>No properties listed yet</h2>
            <p>Try adjusting your filters or check back soon.</p>
          </div>
        </div>
      );
    } else {
      const forRent = this.props.allproperties.find(property => property.isForRent);
      const forSale = this.props.allproperties.find(property => property.isForSale);
      const { value } = this.props.match.params;
      const labelValue = value === "any" ? "All" : value;
      const heading = `${labelValue} properties`;
      return (
        <Fragment>
          <Helmet>
            <title>
              {heading}
              {forRent ? " for rent" : ""}
              {forSale ? " for sale" : ""}
            </title>
            {/* <link rel="canonical" href="http://mysite.com/example" /> */}
            <meta
              name="description"
              content={`Browse ${heading.toLowerCase()} with updated listings and filters.`}
            />
            <meta name="keywords" content="real estate, appartment, house, flat, rent, buy" />
          </Helmet>
          <section className="search-hero">
            <div className="container hero-inner">
              <div className="hero-card">
                <SearchBarSearchPage findMore={this.findMore} />
              </div>
            </div>
          </section>
          <div className="container">
            <div className="propertySection mt-3">
              <PropertyGrid>
                {this.props.allproperties.map((property, i) => {
                  const primaryUrl = getPrimaryImageUrl(property);
                  if (primaryUrl) {
                    property.image = primaryUrl;
                  }
                  return <PropertyCard property={property} key={i} />;
                })}
              </PropertyGrid>
            </div>
            <div className="col-12 mt-3 mb-5 text-center">
              {this.props.propertiesCount <= this.state.offset ? (
                <p className="text-muted">Sorry, no more property_listings</p>
              ) : (
                <button className="btn btn-primary" onClick={this.loadMore} style={{ overflowAnchor: 'none' }}>
                  Load More
                </button>
              )}
            </div>
          </div>
        </Fragment>
      );
    }
  }
}

function mapStateToProps(state) {
  return {
    allproperties: state.propertyReducer.searchedproperties,
    propertiesCount: state.propertyReducer.propertiesCount,
    error: state.errorReducer
  };
}

export default connect(mapStateToProps, {
  fetchpropertiesBySearchTerm,
  clearSearchedproperties
})(MainPage);
