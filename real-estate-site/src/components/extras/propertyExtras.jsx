import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchfeatures, addfeature, removefeature } from "../../actions/feature";
import "./propertyextras.css";

const initialState = {
  text: ""
};

const featureIconMatches = [
  { keywords: ["wifi", "internet"], icon: "fa fa-wifi" },
  { keywords: ["parking", "garage"], icon: "fa fa-car" },
  { keywords: ["garden", "yard"], icon: "fa fa-tree" },
  { keywords: ["balcony", "terrace", "patio"], icon: "fa fa-window-maximize" },
  { keywords: ["elevator", "lift"], icon: "fa fa-arrows-v" },
  { keywords: ["furnished", "furniture"], icon: "fa fa-bed" }
];

const getFeatureIconClass = text => {
  const normalized = String(text || "").toLowerCase();
  const matched = featureIconMatches.find(entry =>
    entry.keywords.some(keyword => normalized.includes(keyword))
  );
  return matched ? matched.icon : "fa fa-check";
};

class PropertyFeatures extends Component {
  state = initialState;

  componentDidMount = () => {
    if (this.props.myproperty) {
      this.props.fetchfeatures();
    }
  };

  addfeature = (id, text) => {
    const selectedFeatureTexts = this.props.property.property_features
      .map(feature => (feature.feature?.text || "").toLowerCase())
      .filter(Boolean);
    if (selectedFeatureTexts.includes(text.toLowerCase())) {
      return;
    }
    this.props.addfeature(text);
  };

  removefeature = id => {
    this.props.removefeature(id);
  };

  handleChange = e => {
    this.setState({
      text: e.target.value
    });
  };

  addNew = e => {
    e.preventDefault();
    this.props.addfeature(this.state.text);
    this.setState(initialState);
  };

  render() {
    if (this.props.myproperty) {
      return (
        <div>
          <h4>This advantages are going to be shown on your property_listing</h4>
          <p>To remove advantages from your property_listing, just click on it.</p>
          {this.props.property.property_features.map((featureCon, i) => (
            <button
              className="btn btn-sm btn-outline-success ml-1 allfeatures mt-1 d-inline-flex align-items-center"
              key={i}
              onClick={() => this.removefeature(featureCon.feature.id)}
            >
              <i
                className={`${getFeatureIconClass(featureCon.feature.text)} mr-2`}
                aria-hidden="true"
              />
              {featureCon.feature.text}
            </button>
          ))}
          <hr />
          <div>
            <h4>Top adventages you can add, to your property_listing</h4>
            <p>
              Just choose one from the list and click on it. Or create new one.
            </p>
            {this.props.features.map((feature, i) => (
              <button
                className="btn btn-sm btn-outline-info ml-1 allfeatures mt-1 d-inline-flex align-items-center"
                key={i}
                onClick={() => this.addfeature(feature.id, feature.text)}
              >
                <i
                  className={`${getFeatureIconClass(feature.text)} mr-2`}
                  aria-hidden="true"
                />
                {feature.text}
              </button>
            ))}
          </div>
          <hr />
          <div className="col-12 col-md-12 col-lg-6 col-xl-5">
            <h4>Add New Advantage</h4>
            <p>Just add new Advantage, if you can not find one in the list</p>
            <form onSubmit={e => this.addNew(e)} className="input-group">
              <input
                type="text"
                name="text"
                className="form-control"
                value={this.state.text}
                onChange={this.handleChange}
              />
              <input
                type="submit"
                value="Add New"
                className="btn btn-sm btn-success ml-3"
              />
            </form>
          </div>
        </div>
      );
    } else {
      const features = this.props.property.property_features || [];
      if (!features.length) {
        return null;
      }
      return (
        <div>
          <h4>Advantages</h4>
          {features.map((featureCon, i) => (
            <p
              className="btn btn-sm btn-outline-info ml-1 allfeatures mt-1 d-inline-flex align-items-center"
              key={i}
            >
              <i
                className={`${getFeatureIconClass(featureCon.feature.text)} mr-2`}
                aria-hidden="true"
              />
              <span className="feature-label">{featureCon.feature.text}</span>
              <span className="feature-check" aria-hidden="true">✓</span>
            </p>
          ))}
          <hr />
        </div>
      );
    }
  }
}

function mapStateToProps(state) {
  return {
    features: state.featureReducer.fetchedfeatures
  };
}

export default connect(mapStateToProps, { fetchfeatures, addfeature, removefeature })(
  PropertyFeatures
);
