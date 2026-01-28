import React, { Component, Fragment } from "react";
import ViewMap from "../map/ViewMap";

export default class PropertyForm extends Component {
  render() {
    const latRaw = this.props.formValues.lat;
    const lonRaw = this.props.formValues.lon;
    const latValue = latRaw === "" ? Number.NaN : Number(latRaw);
    const lonValue = lonRaw === "" ? Number.NaN : Number(lonRaw);
    const hasCoords = Number.isFinite(latValue) && Number.isFinite(lonValue);
    const isLand = this.props.formValues.propertyType === "land";
    const propertyTypes = [
      { value: "apartment", label: "Apartment" },
      { value: "house", label: "House" },
      { value: "villa", label: "Villa" },
      { value: "studio", label: "Studio" },
      { value: "loft", label: "Loft" },
      { value: "penthouse", label: "Penthouse" },
      { value: "townhouse", label: "Townhouse" },
      { value: "commercial", label: "Commercial" },
      { value: "land", label: "Land" }
    ];
    const statusOptions = ["active", "pending", "sold", "rented", "inactive"];
    const amenityOptions = [
      { name: "wifi", label: "WiFi", icon: "fa fa-wifi" },
      { name: "parking", label: "Parking", icon: "fa fa-car" },
      { name: "hasGarden", label: "Garden", icon: "fa fa-tree" },
      { name: "hasBalcony", label: "Balcony", icon: "fa fa-window-maximize" },
      { name: "hasElevator", label: "Elevator", icon: "fa fa-arrows-v" },
      { name: "isFurnished", label: "Furnished", icon: "fa fa-bed" }
    ];
    return (
      <Fragment>
        <form onSubmit={this.props.submitNewproperty}>
          <div className="row pl-3">
            {this.props.formValues.isForSale ? (
              <button
                className="btn btn-sm btn-success mr-3"
                type="button"
                onClick={() => this.props.forRentForSale("sale")}
              >
                For Sale
              </button>
            ) : (
              <button
                className="btn btn-sm btn-warning mr-3"
                type="button"
                onClick={() => this.props.forRentForSale("sale")}
              >
                For Sale
              </button>
            )}
            {this.props.formValues.isForRent ? (
              <button
                type="button"
                className="btn btn-sm btn-success"
                onClick={() => this.props.forRentForSale("rent")}
              >
                For Rent
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-sm btn-warning"
                onClick={() => this.props.forRentForSale("rent")}
              >
                For Rent
              </button>
            )}
          </div>
          {!this.props.formValues.isForRent && !this.props.formValues.isForSale ? (
            <div className="row pl-3 mb-3">
              <small className="text-danger">Please, Select is it For Sale or For Rent</small>
            </div>
          ) : (
            ""
          )}
          <div className="row pl-3 mb-3">
            <small className="text-muted">
              Property ID:{" "}
              {this.props.formValues.createdPropertyId
                ? this.props.formValues.createdPropertyId
                : "Will be generated after saving"}
            </small>
          </div>
          <div className="row mb-3 mt-3">
            <label htmlFor="title" className="col-12">
              Title <span className="text-danger">*</span>
              <input
                type="text"
                name="title"
                className="form-control"
                value={this.props.formValues.title}
                onChange={this.props.handleChange}
                placeholder="Listing title"
                required
              />
            </label>
          </div>
          <div className="row mb-3">
            <label htmlFor="price" className="col-12 col-md-4">
              Price - {this.props.formValues.isForSale
                ? (this.props.formValues.currency || "RWF")
                : this.props.formValues.isForRent
                  ? `${this.props.formValues.currency || "RWF"}/month`
                  : ""} <span className="text-danger">*</span>
              <input
                type="number"
                name="price"
                className="form-control"
                min="0"
                step="0.01"
                value={this.props.formValues.price}
                onChange={this.props.handleChange}
                required
              />
              <select
                className="form-control mt-2"
                name="currency"
                value={this.props.formValues.currency || "RWF"}
                onChange={this.props.handleChange}
              >
                <option value="RWF">RWF</option>
                <option value="USD">USD</option>
              </select>

            </label>
            <label htmlFor="propertyType" className="col-12 col-md-4">
              Property Type <span className="text-danger">*</span>
              <select
                className="form-control"
                name="propertyType"
                value={this.props.formValues.propertyType}
                onChange={this.props.handleChange}
                required
              >
                <option value="">Select type</option>
                {propertyTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </label>
            <label htmlFor="propertiestatus" className="col-12 col-md-4">
              Status <span className="text-danger">*</span>
              <select
                className="form-control"
                name="propertiestatus"
                value={this.props.formValues.propertiestatus}
                onChange={this.props.handleChange}
                required
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="row mb-3">
            <label htmlFor="postcode" className="col-12 col-md-8">
              Address <span className="text-danger">*</span>
              <input
                type="text"
                name="address"
                className="form-control"
                value={this.props.formValues.address}
                onChange={this.props.handleChange}
                placeholder="Address"
                required
              />
            </label>
            <label htmlFor="postcode" className="col-12 col-md-4">
              Postcode
              <input
                type="text"
                name="postcode"
                className="form-control"
                value={this.props.formValues.postcode}
                onChange={this.props.handleChange}
                placeholder="Postcode"
              />
            </label>
          </div>
          <div className="row mb-3">
            <label htmlFor="city" className="col-12 col-md-6">
              City <span className="text-danger">*</span>
              <input
                type="text"
                name="city"
                className="form-control"
                value={this.props.formValues.city}
                onChange={this.props.handleChange}
                placeholder="City"
                required
              />
            </label>
            <label htmlFor="country" className="col-12 col-md-6">
              Country <span className="text-danger">*</span>
              <input
                type="text"
                name="country"
                className="form-control"
                value={this.props.formValues.country}
                onChange={this.props.handleChange}
                placeholder="Country"
                required
              />
            </label>
          </div>
          <div className="row mb-3">
            <label htmlFor="contactEmail" className="col-12 col-md-6">
              Contact Email (optional)
              <input
                type="email"
                name="contactEmail"
                className="form-control"
                value={this.props.formValues.contactEmail}
                onChange={this.props.handleChange}
                placeholder="Reachout email for this property"
              />
            </label>
            <label htmlFor="contactPhone" className="col-12 col-md-6">
              Contact Phone (optional)
              <input
                type="text"
                name="contactPhone"
                className="form-control"
                value={this.props.formValues.contactPhone}
                onChange={this.props.handleChange}
                placeholder="Reachout phone for this property"
              />
            </label>
            <div className="col-12">
              <small className="text-muted">
                Leave blank to use the admin reachout contact details.
              </small>
            </div>
          </div>
          <div className="row mb-3">
            <label htmlFor="lat" className="col-12 col-md-6">
              Latitude (Exact location)
              <input
                type="number"
                name="lat"
                className="form-control"
                step="0.000001"
                min="-90"
                max="90"
                value={this.props.formValues.lat}
                onChange={this.props.handleChange}
                placeholder="Latitude"
              />
            </label>
            <label htmlFor="lon" className="col-12 col-md-6">
              Longitude (Exact location)
              <input
                type="number"
                name="lon"
                className="form-control"
                step="0.000001"
                min="-180"
                max="180"
                value={this.props.formValues.lon}
                onChange={this.props.handleChange}
                placeholder="Longitude"
              />
            </label>
          </div>
          <div className="row mb-3">
            <div className="col-12">
              <small className="text-muted">
                Add coordinates to preview the exact location on the map.
              </small>
              <div className="mt-2">
                {hasCoords ? (
                  <ViewMap
                    lat={latValue}
                    lon={lonValue}
                    pointer={`${this.props.formValues.address || ""}, ${this.props.formValues.city || ""} ${this.props.formValues.postcode || ""}`}
                  />
                ) : (
                  <div className="text-muted">Map preview appears after both coordinates are set.</div>
                )}
              </div>
            </div>
          </div>
          <div className="row mb-3">
            <label htmlFor="sqrMeter" className="col-6 col-md-3">
              Square Meter <span className="text-danger">*</span>
              <input
                type="number"
                className="form-control"
                name="sqrMeter"
                min="0"
                step="0.01"
                value={this.props.formValues.sqrMeter}
                onChange={this.props.handleChange}
                required
              />
            </label>
            <label htmlFor="numberOfRooms" className="col-6 col-md-3">
              Nr. of Rooms {!isLand ? <span className="text-danger">*</span> : ""}
              <input
                type="number"
                className="form-control"
                name="nrOfRooms"
                min="0"
                step="1"
                value={this.props.formValues.nrOfRooms}
                onChange={this.props.handleChange}
                required={!isLand}
              />
            </label>
            <label htmlFor="numberOfBathrooms" className="col-6 col-md-3">
              Nr. of Bathrooms {!isLand ? <span className="text-danger">*</span> : ""}
              <input
                type="number"
                className="form-control"
                name="nrOfBathrooms"
                min="0"
                step="1"
                value={this.props.formValues.nrOfBathrooms}
                onChange={this.props.handleChange}
                required={!isLand}
              />
            </label>
            <label htmlFor="constructionYear" className="col-6 col-md-3">
              Construction Year {!isLand ? <span className="text-danger">*</span> : ""}
              <input
                type="number"
                className="form-control"
                name="constructionYear"
                min="0"
                step="1"
                value={this.props.formValues.constructionYear}
                onChange={this.props.handleChange}
                required={!isLand}
              />
            </label>
          </div>
          <div className="row mb-3">
            <label htmlFor="renovationYear" className="col-6 col-md-3">
              Renovation Year
              <input
                type="number"
                className="form-control"
                name="renovationYear"
                min="0"
                step="1"
                value={this.props.formValues.renovationYear}
                onChange={this.props.handleChange}
              />
            </label>
            <label htmlFor="nrOfFloors" className="col-6 col-md-3">
              Number of Floors
              <input
                type="number"
                className="form-control"
                name="nrOfFloors"
                min="0"
                step="1"
                value={this.props.formValues.nrOfFloors}
                onChange={this.props.handleChange}
              />
            </label>
          </div>
          <div className="col-12 mt-3">
            <h5>Amenities</h5>
            <div className="row">
              {amenityOptions.map(amenity => (
                <div className="col-6 col-md-4" key={amenity.name}>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`amenity-${amenity.name}`}
                      name={amenity.name}
                      checked={Boolean(this.props.formValues[amenity.name])}
                      onChange={this.props.handleChange}
                    />
                    <label className="form-check-label" htmlFor={`amenity-${amenity.name}`}>
                      <i className={`${amenity.icon} mr-2`} aria-hidden="true" />
                      {amenity.label}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-12">
            <div className="row mt-3">
              <label htmlFor="description">
                Description <span className="text-danger">*</span>
              </label>
              <textarea
                className="form-control"
                id="description"
                rows="7"
                name="description"
                value={this.props.formValues.description}
                onChange={this.props.handleChange}
                placeholder="Description"
                required
              />
            </div>
          </div>
          <div className="col-12 mt-3">
            <h5>Media</h5>
            <div className="row">
              <label className="col-12 mb-3">
                YouTube Video Link (optional)
                <input
                  type="url"
                  className="form-control"
                  name="videoUrl"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={this.props.formValues.videoUrl || ""}
                  onChange={this.props.handleChange}
                />
                <small className="text-muted">
                  Only YouTube links are supported.
                </small>
              </label>
              <label className="col-12 col-md-6">
                Gallery Images
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  multiple
                  onChange={this.props.handleImageFiles}
                />
                <small className="text-muted">
                  {this.props.formValues.imageFiles?.length
                    ? `${this.props.formValues.imageFiles.length} image${this.props.formValues.imageFiles.length > 1 ? "s" : ""} selected`
                    : "Select multiple images for the gallery."}
                </small>
              </label>
            </div>
            <small className="text-muted">
              Media uploads start right after the property is created.
            </small>
          </div>
          <div className="col-12 mt-3">
            <input
              className="btn btn-success"
              type="submit"
              value={this.props.formValues.uploadingMedia ? "Working..." : "Add New"}
              disabled={this.props.formValues.uploadingMedia}
            />
          </div>
        </form>
      </Fragment>
    );
  }
}
