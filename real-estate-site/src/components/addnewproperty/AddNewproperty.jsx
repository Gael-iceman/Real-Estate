import React, { Component } from "react";
import { connect } from "react-redux";
import { createproperty } from "../../actions/property";
import { featurectErrorMessage } from "../../actions/error";
import { uploadImage } from "../../actions/images";
import PropertyForm from "./propertyForm";
import { isAdminUser } from "../../utils/roles";

import "./addnew.css";

const initialState = {
  title: "",
  description: "",
  isForSale: false,
  isForRent: false,
  price: "",
  currency: "RWF",
  address: "",
  city: "",
  postcode: "",
  country: "Rwanda",
  contactEmail: "",
  contactPhone: "",
  nrOfRooms: "",
  nrOfBathrooms: "",
  nrOfFloors: "",
  sqrMeter: "",
  constructionYear: "",
  renovationYear: "",
  wifi: false,
  propertyType: "",
  parking: false,
  hasGarden: false,
  hasBalcony: false,
  hasElevator: false,
  isFurnished: false,
  propertiestatus: "active",
  lat: "",
  lon: "",
  imageFiles: [],
  videoUrl: "",
  showAddForm: false,
  createdPropertyId: null,
  error: "",
  uploadingMedia: false,
  mediaProgress: 0,
  mediaStatus: ""
};

class AddNewproperty extends Component {
  state = initialState;

  handleChange = e => {
    const { name, value, type, checked } = e.target;
    this.setState({
      [name]: type === "checkbox" ? checked : value
    });
  };

  submitNewproperty = async e => {
    e.preventDefault();
    if (!this.state.isForRent && !this.state.isForSale) {
      this.setState({
        error: "Please select is it For Sale or For Rent"
      });
      return;
    }
    const {
      imageFiles,
      showAddForm,
      createdPropertyId,
      error,
      uploadingMedia,
      mediaProgress,
      mediaStatus,
      ...payload
    } = this.state;

    this.setState({ uploadingMedia: true, mediaProgress: 0, mediaStatus: "Creating property...", error: "" });
    let response;
    try {
      const normalizedPayload = {
        ...payload,
        parking: payload.parking ? "Yes" : "No"
      };
      response = await this.props.createproperty(normalizedPayload);
    } catch (err) {
      this.setState({
        uploadingMedia: false,
        mediaStatus: "",
        error: featurectErrorMessage(err)
      });
      return;
    }

    const propertyId = response?.newproperty?.id;
    if (!propertyId) {
      this.setState({ uploadingMedia: false, mediaStatus: "" });
      return;
    }
    this.setState({ createdPropertyId: propertyId });

    const totalUploads = imageFiles.length;
    if (totalUploads) {
      let uploaded = 0;
      this.setState({ mediaStatus: "Uploading media..." });
      try {
        for (const file of imageFiles) {
          const fd = new FormData();
          fd.append("image", file, file.name);
          await this.props.uploadImage(fd, propertyId);
          uploaded += 1;
          this.setState({ mediaProgress: Math.round((uploaded / totalUploads) * 100) });
        }
      } catch (err) {
        this.setState({
          uploadingMedia: false,
          mediaStatus: "",
          error: "Property created, but media upload failed"
        });
        return;
      }
    }

    this.setState({ ...initialState, createdPropertyId: propertyId });
  };

  forRentForSale = action => {
    if (action === "sale") {
      this.setState({
        ...this.state,
        isForSale: true,
        isForRent: false,
        error: ""
      });
    }
    if (action === "rent") {
      this.setState({
        ...this.state,
        isForSale: false,
        isForRent: true,
        error: ""
      });
    }
  };

  showpropertyForm = () => {
    this.setState({
      showAddForm: !this.state.showAddForm
    });
  };

  handleImageFiles = e => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    this.setState(prevState => {
      const existing = prevState.imageFiles || [];
      const seen = new Set(existing.map(file => `${file.name}-${file.size}-${file.lastModified}`));
      const merged = [...existing];
      files.forEach(file => {
        const key = `${file.name}-${file.size}-${file.lastModified}`;
        if (!seen.has(key)) {
          seen.add(key);
          merged.push(file);
        }
      });
      return { imageFiles: merged };
    });
    e.target.value = "";
  };


  render() {
    if (!isAdminUser(this.props.user)) {
      return null;
    }

    return (
      <div className="card">
        <div className="">
          <h5 className="card-title m-3">Add New Property</h5>
          {this.state.createdPropertyId ? (
            <div className="alert alert-success mx-3" role="alert">
              Property created. ID: {this.state.createdPropertyId}
            </div>
          ) : (
            ""
          )}
          {this.state.showAddForm ? (
            <div className="col-12 my-3">
              <button
                className="btn btn-sm btn-warning my-3"
                type="button"
                onClick={this.showpropertyForm}
              >
                Hide Property Form
              </button>
              <hr className="hrSection" />
              {this.state.error ? (
                <div className="alert alert-danger my-3 mx-5" role="alert">
                  {this.state.error}
                </div>
              ) : (
                ""
              )}
              {this.state.mediaStatus ? (
                <div className="alert alert-info my-3 mx-5" role="alert">
                  {this.state.mediaStatus}
                  {this.state.mediaProgress ? ` (${this.state.mediaProgress}%)` : ""}
                </div>
              ) : (
                ""
              )}
              <PropertyForm
                submitNewproperty={this.submitNewproperty}
                handleChange={this.handleChange}
                handleImageFiles={this.handleImageFiles}
                formValues={this.state}
                forRentForSale={this.forRentForSale}
              />
            </div>
          ) : (
            <div className="col-6 my-3">
              <button
                className="btn btn-sm btn-info"
                type="button"
                onClick={this.showpropertyForm}
              >
                Add New Property
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.userReducer
  };
}

export default connect(mapStateToProps, { createproperty, uploadImage })(
  AddNewproperty
);
