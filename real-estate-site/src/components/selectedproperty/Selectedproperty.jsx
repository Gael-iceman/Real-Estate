import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { fetchproperty, updateproperty, deleteproperty } from "../../actions/property";
import { likeproperty } from "../../actions/likes";

import ImagesUpload from "../image/ImagesUpload";
import ImageGallery from "../image/imagegallery/ImageGallery";
import PropertyImageSlider from "./PropertyImageSlider";
import PropertyFeatures from "../extras/propertyExtras";
import ViewMap from "../map/ViewMap";
import UserCard from "./UserCard";
import PropertyInformation from "./propertyInformation";
import { Helmet } from "react-helmet";
import { isAdminUser } from "../../utils/roles";
import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt, FaTag, FaWhatsapp } from "react-icons/fa";
import PropertyEditForm from "./PropertyEditForm";

import "./selectedproperty.css";

class Selectedproperty extends Component {
  state = {
    updating: false,
    deleting: false,
    updateStatus: "",
    updateError: "",
    showReachoutCard: false
  };

  isYouTubeUrl = url => {
    if (!url) return false;
    const normalized = String(url).toLowerCase();
    return normalized.includes("youtube.com") || normalized.includes("youtu.be");
  };

  getRouteMode = () => {
    const pathname = this.props.location?.pathname || "";
    return pathname.startsWith("/update") ? "update" : "view";
  };

  renderModeToggle = propertyId => {
    const mode = this.getRouteMode();
    return (
      <div className="btn-group mb-3" role="group" aria-label="Property view mode">
        <Link
          className={`btn btn-sm ${mode === "view" ? "btn-primary" : "btn-outline-primary"}`}
          to={`/view/${propertyId}`}
        >
          View
        </Link>
        <Link
          className={`btn btn-sm ${mode === "update" ? "btn-primary" : "btn-outline-primary"}`}
          to={`/update/${propertyId}`}
        >
          Update
        </Link>
      </div>
    );
  };

  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.fetchproperty(id);
    setTimeout(() => {
      window.scrollTo(0, 0);
    });
  }

  likeproperty = () => {
    const { id } = this.props.match.params;
    this.props.likeproperty(id);
  };

  handleUpdateProperty = async payload => {
    this.setState({ updating: true, updateStatus: "", updateError: "" });
    try {
      const normalizedPayload = {
        ...payload,
        parking: payload.parking ? "Yes" : "No",
        heating: payload.heating ? "Yes" : "No",
        warmWater: payload.warmWater ? "Yes" : "No",
        storage: payload.storage ? "Yes" : "No",
        wifi: payload.wifi ? "Yes" : "No"
      };
      if (!normalizedPayload.isForRent) {
        delete normalizedPayload.monthlyContribution;
      }
      await this.props.updateproperty(this.props.property.id, normalizedPayload);
      this.setState({ updating: false, updateStatus: "Property updated.", updateError: "" });
    } catch (err) {
      this.setState({ updating: false, updateStatus: "", updateError: "Failed to update property." });
    }
  };

  handleDeleteProperty = async () => {
    this.setState({ deleting: true, updateStatus: "", updateError: "" });
    try {
      await this.props.deleteproperty(this.props.property.id);
      this.setState({ deleting: false, updateStatus: "", updateError: "" });
      this.props.history.push("/myproperties");
    } catch (err) {
      this.setState({ deleting: false, updateStatus: "", updateError: "Failed to delete property." });
    }
  };

  numberWithSpaces = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  openReachoutCard = () => {
    this.setState({ showReachoutCard: true });
  };

  closeReachoutCard = () => {
    this.setState({ showReachoutCard: false });
  };

  contentForAll = (showToggle = false) => {
    const contactEmail = String(this.props.property.contactEmail || "");
    const contactPhone = String(this.props.property.contactPhone || "");
    const ownerReachoutEmail = String(this.props.property.user?.reachoutEmail || "");
    const ownerReachoutPhone = String(this.props.property.user?.reachoutPhone || "");
    const hasText = value => {
      if (value === null || value === undefined) return false;
      if (typeof value === "string") {
        return value.trim() !== "";
      }
      return Boolean(value);
    };
    const displayEmail = hasText(contactEmail) ? contactEmail : ownerReachoutEmail;
    const displayPhone = hasText(contactPhone) ? contactPhone : ownerReachoutPhone;
    const hasContact = hasText(displayEmail) || hasText(displayPhone);
    const hasCoords =
      Number.isFinite(Number(this.props.property.lat)) &&
      Number.isFinite(Number(this.props.property.lon));
    const currency = (this.props.property.currency || "RWF").toUpperCase();
    const priceSuffix = this.props.property.isForRent ? `${currency}/month` : currency;
    return (
      <div className="container mt-3">
        {showToggle ? this.renderModeToggle(this.props.property.id) : ""}
        <Helmet>
          <title>
            {this.props.property.title || this.props.property.address || "Property"} | View
          </title>
          {/* <link rel="canonical" href="http://mysite.com/example" /> */}
          <meta name="description" content={`Real Estate${this.props.property.isForRent ? " for rent" : " for sale"}${this.props.property.city ? ` ${this.props.property.city}` : " The Rwanda"}${this.props.property.address ? ` ${this.props.property.address}` : ""}${this.props.property.postcode ? `, ${this.props.property.postcode}` : ""}`} />
          <meta name="keywords" content="real estate, appartment, house, flat, rent, buy" />
        </Helmet>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to={`/search/city/${this.props.property.city}`}>
                {this.props.property.city}
              </Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {this.props.property.address}, {this.props.property.city},{" "}
              {this.props.property.postcode}
            </li>
          </ol>
        </nav>
        <h1 className="property-title">
          {this.props.property.title || this.props.property.address}
        </h1>
        <p className="text-muted mb-1 property-id">Property ID: {this.props.property.id}</p>
        <p className="property-subtitle">
          <FaMapMarkerAlt /> {this.props.property.address}, {this.props.property.city}{" "}
          {this.props.property.postcode}
        </p>
        <hr />

        <div className="row">
          <div className="col-12 col-md-12 col-lg-4 col-xl-4">
            <div className="property-price">
              <FaTag />
              <span>
                {this.numberWithSpaces(this.props.property.price)}{" "}
                {priceSuffix}
              </span>
            </div>
            {this.props.user ? (
              this.props.liked ? (
                <button
                  className="btn btn-outline-warning"
                  onClick={this.likeproperty}
                >
                  DisLike
                </button>
              ) : (
                <button className="btn btn-success" onClick={this.likeproperty}>
                  Like
                </button>
              )
            ) : (
              ""
            )}
            <hr />
            <PropertyFeatures property={this.props.property} myproperty={false} />
            {hasContact ? (
              <div className="card mt-3 contact-card">
                <div className="card-body">
                  <h5 className="card-title">Contact</h5>
                  <p className="mb-3">
                    Reach out to the listing admin using the contact details
                    below.
                  </p>
                  {hasText(displayEmail) ? (
                    <p className="mb-1 contact-item">
                      <FaEnvelope />
                      <a href={`mailto:${displayEmail}`}>{displayEmail}</a>
                    </p>
                  ) : (
                    ""
                  )}
                  {hasText(displayPhone) ? (
                    <p className="mb-0 contact-item">
                      <FaPhoneAlt />
                      <a href={`tel:${displayPhone}`}>{displayPhone}</a>
                    </p>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="col-12 col-md-12 col-lg-8 col-xl-8">
            <PropertyImageSlider property={this.props.property} />
            {this.props.property.videoUrl && this.isYouTubeUrl(this.props.property.videoUrl) ? (
              <div className="col-12 mt-3">
                <h4>Video Tour</h4>
                <a
                  className="btn btn-outline-primary"
                  href={this.props.property.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Watch on YouTube
                </a>
              </div>
            ) : (
              ""
            )}
            <div className="col-12 mt-3">
              <UserCard user={this.props.property.user} />
            </div>
            {hasText(this.props.property.description) ? (
              <div className="col-12 mt-3">
                <h4>Description</h4>
                <p className="property-description">{this.props.property.description}</p>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="col-12 mt-3">
          <PropertyInformation property={this.props.property} />
        </div>
        {hasCoords ? (
          <>
            <hr />
            <div className="card mb-5 mx-3 mt-3">
              <div className="card-body p-3">
                <h5 className="card-title">Map</h5>
                <ViewMap
                  lat={this.props.property.lat}
                  lon={this.props.property.lon}
                  pointer={`${this.props.property.address}, ${this.props.property.city}, ${this.props.property.postcode}`}
                />
              </div>
            </div>
          </>
        ) : (
          ""
        )}
        <div className="reachout-cta">
          <button
            type="button"
            className="btn btn-primary reachout-btn"
            onClick={this.openReachoutCard}
          >
            Buy / Rent Property
          </button>
        </div>
        {this.state.showReachoutCard ? (
          <div
            className="reachout-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Property reachout details"
            onClick={this.closeReachoutCard}
          >
            <div
              className="reachout-card"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className="reachout-close"
                aria-label="Close"
                onClick={this.closeReachoutCard}
              >
                ×
              </button>
              <h4 className="reachout-title">Interested in this property?</h4>
              <p className="reachout-subtitle">
                Reach out using any of the options below.
              </p>
              {hasText(displayPhone) ? (
                <p className="reachout-item">
                  <FaPhoneAlt />
                  <a href={`tel:${displayPhone}`}>{displayPhone}</a>
                </p>
              ) : (
                ""
              )}
              {hasText(displayEmail) ? (
                <p className="reachout-item">
                  <FaEnvelope />
                  <a href={`mailto:${displayEmail}`}>{displayEmail}</a>
                </p>
              ) : (
                ""
              )}
              {hasText(displayPhone) ? (
                <p className="reachout-item">
                  <FaWhatsapp />
                  <span className="reachout-label">WhatsApp:</span>
                  <a href={`https://wa.me/${displayPhone.replace(/\D/g, "")}`}>
                    {displayPhone}
                  </a>
                </p>
              ) : (
                ""
              )}
              {!hasContact ? (
                <p className="reachout-empty">
                  No contact details available yet.
                </p>
              ) : (
                ""
              )}
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    );
  };

  render() {
    if (!this.props.property) {
      return (
        <div className="mt-2 d-flex justify-content-center">
          <div className="col-6">
            <div className="alert alert-warning" role="alert">
              Looks like you just logged out. And we can not show you this
              property_listing.
            </div>
          </div>
        </div>
      );
    } else if (this.props.property && isAdminUser(this.props.user)) {
      const { id } = this.props.property;
      const isUpdateRoute = this.getRouteMode() === "update";
      const userId = this.props.user?.id || this.props.user?.user?.id;
      const isOwner = userId && this.props.property.userId === userId;
      const mySelectedproperty = this.props.myproperties
        ? this.props.myproperties.find((property) => property.id === id)
        : null;
      const canEdit = isUpdateRoute && (isOwner || this.props.mypropertyIds?.includes(id));

      if (canEdit) {
        const selectedProperty = mySelectedproperty || this.props.property;
        const hasCoords =
          Number.isFinite(Number(selectedProperty?.lat)) &&
          Number.isFinite(Number(selectedProperty?.lon));

        return (
          <div className="container mt-3">
            {this.renderModeToggle(selectedProperty.id)}
            <Helmet>
              <title>
                {selectedProperty.title || selectedProperty.address || "Property"} | Update
              </title>
            </Helmet>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/">Home</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/admin">Admin Dashboard</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/myproperties">My property_listings</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {selectedProperty.address}
                </li>
              </ol>
            </nav>
            <h1 className="property-title">
              {selectedProperty.title || selectedProperty.address}
            </h1>
            <p className="text-muted mb-1 property-id">
              Property ID: {selectedProperty.id}
            </p>
            <p className="property-subtitle">
              <FaMapMarkerAlt /> {selectedProperty.address},{" "}
              {selectedProperty.city} {selectedProperty.postcode}
            </p>
            <PropertyEditForm
              property={this.props.property}
              onSave={this.handleUpdateProperty}
              onDelete={this.handleDeleteProperty}
              saving={this.state.updating}
              deleting={this.state.deleting}
            />
            {this.state.updateStatus ? (
              <div className="alert alert-success mt-3" role="alert">
                {this.state.updateStatus}
              </div>
            ) : (
              ""
            )}
            {this.state.updateError ? (
              <div className="alert alert-danger mt-3" role="alert">
                {this.state.updateError}
              </div>
            ) : (
              ""
            )}
            <ImagesUpload />
            <div className="card my-3">
              <div className="card-body">
                <h5 className="card-title activeAppoint">Gallery</h5>
                <ImageGallery property={this.props.property} myproperty={true} />
              </div>
            </div>
            <hr />
            <div className="card">
              <div className="card-body">
                <PropertyFeatures property={this.props.property} myproperty={true} />
              </div>
            </div>
            {hasCoords ? (
              <>
                <hr />
                <div className="card mb-5">
                  <div className="card-body p-3">
                    <h5 className="card-title">Map</h5>
                    <ViewMap
                      lat={selectedProperty.lat}
                      lon={selectedProperty.lon}
                    />
                  </div>
                </div>
              </>
            ) : (
              ""
            )}
          </div>
        );
      } else {
        return this.contentForAll(true);
      }
    } else {
      return this.contentForAll(isAdminUser(this.props.user));
    }
  }
}

function mapStateToProps(state) {
  if (state.propertyReducer.selectedproperty && state.likeReducer.likedproperties) {
      return {
        user: state.userReducer,
        property: state.propertyReducer.selectedproperty,
        myproperties: state.propertyReducer.myproperties,
        mypropertyIds: state.propertyReducer.mypropertyIds,
        liked: state.likeReducer.likedproperties.find(
          (property) => property.propertyId === state.propertyReducer.selectedproperty.id
        )
      };
    }
  return {
    user: state.userReducer,
  };
}

export default connect(mapStateToProps, {
  fetchproperty,
  likeproperty,
  updateproperty,
  deleteproperty
})(Selectedproperty);
