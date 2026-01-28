import React, { Component, Fragment } from "react";
import Moment from "react-moment";
import {
  FaBath,
  FaBed,
  FaBolt,
  FaBuilding,
  FaCar,
  FaCity,
  FaCouch,
  FaCube,
  FaDoorOpen,
  FaHashtag,
  FaHome,
  FaInfoCircle,
  FaLeaf,
  FaLayerGroup,
  FaMapMarkerAlt,
  FaRulerCombined,
  FaTag,
  FaTint,
  FaWifi,
  FaWarehouse
} from "react-icons/fa";

export default class PropertyInformation extends Component {
  numberWithSpaces = x => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  render() {
    const { property } = this.props;
    const hasNumber = value => Number.isFinite(Number(value)) && Number(value) > 0;
    const hasText = value => {
      if (value === null || value === undefined) return false;
      if (typeof value === "string") {
        const trimmed = value.trim();
        return trimmed !== "" && trimmed.toLowerCase() !== "no";
      }
      return Boolean(value);
    };
    const featureTexts = Array.isArray(property.property_features)
      ? property.property_features
          .map(featureCon => String(featureCon?.feature?.text || "").toLowerCase())
          .filter(Boolean)
      : [];
    const hasFeature = keywords =>
      featureTexts.some(text =>
        keywords.some(keyword => text.includes(keyword))
      );
    const wifiValue = hasText(property.wifi)
      ? property.wifi
      : hasFeature(["wifi", "wi-fi", "internet"])
        ? "Yes"
        : null;
    const storageValue = hasText(property.storage)
      ? property.storage
      : hasFeature(["storage", "storeroom"])
        ? "Yes"
        : null;
    const heatingValue = hasText(property.heating)
      ? property.heating
      : hasFeature(["heating"])
        ? "Yes"
        : null;
    const warmWaterValue = hasText(property.warmWater)
      ? property.warmWater
      : hasFeature(["warm water", "hot water", "warmwater"])
        ? "Yes"
        : null;
    const monthlyContribution =
      property.monthlyContribution || property.monthlyContibution;
    const currency = (property.currency || "RWF").toUpperCase();
    const priceSuffix = property.isForRent ? `${currency}/month` : currency;
    const amenityItems = [
      { label: "WiFi", icon: "fa fa-wifi", value: wifiValue, show: Boolean(wifiValue) },
      { label: "Parking", icon: "fa fa-car", value: property.parking, show: hasText(property.parking) },
      { label: "Garden", icon: "fa fa-tree", value: property.hasGarden, show: Boolean(property.hasGarden) },
      { label: "Balcony", icon: "fa fa-window-maximize", value: property.hasBalcony, show: Boolean(property.hasBalcony) },
      { label: "Elevator", icon: "fa fa-arrows-v", value: property.hasElevator, show: Boolean(property.hasElevator) },
      { label: "Furnished", icon: "fa fa-bed", value: property.isFurnished, show: Boolean(property.isFurnished) },
      { label: "Storage", icon: "fa fa-check", value: storageValue, show: Boolean(storageValue) }
    ].filter(item => item.show);
    const formatAmenityLabel = (label, value) => {
      if (typeof value === "string") {
        const trimmed = value.trim();
        if (trimmed && trimmed.toLowerCase() !== "yes") {
          return `${label}: ${trimmed}`;
        }
      }
      return label;
    };

    const overviewRows = [
      {
        label: "Price",
        value: `${this.numberWithSpaces(property.price)} ${priceSuffix}`,
        icon: <FaTag />
      },
      hasText(property.propertyType)
        ? { label: "Type", value: property.propertyType, icon: <FaHome /> }
        : null,
      hasText(property.propertiestatus)
        ? { label: "Status", value: property.propertiestatus, icon: <FaHashtag /> }
        : null,
      hasText(property.address)
        ? { label: "Address", value: property.address, icon: <FaMapMarkerAlt /> }
        : null,
      hasText(property.city)
        ? { label: "City", value: property.city, icon: <FaCity /> }
        : null,
      hasText(property.postcode)
        ? { label: "Postcode", value: property.postcode, icon: <FaHashtag /> }
        : null,
      hasNumber(monthlyContribution)
        ? {
          label: "Monthly Payments",
          value: `${monthlyContribution} ${currency}`,
          icon: <FaTag />
        }
        : null,
      property.createdAt
        ? {
          label: "Published",
          value: <Moment fromNow>{property.createdAt}</Moment>,
          icon: <FaInfoCircle />
        }
        : null
    ].filter(Boolean);

    const buildingRows = [
      hasNumber(property.constructionYear)
        ? {
          label: "Construction Year",
          value: property.constructionYear,
          icon: <FaBuilding />
        }
        : null,
      hasNumber(property.renovationYear)
        ? {
          label: "Renovation Year",
          value: property.renovationYear,
          icon: <FaBuilding />
        }
        : null
    ].filter(Boolean);

    const dimensionRows = [
      hasNumber(property.sqrMeter)
        ? {
          label: "Living Space",
          value: `${property.sqrMeter} m²`,
          icon: <FaRulerCombined />
        }
        : null,
      hasNumber(property.cubicMeter)
        ? {
          label: "Living Volume",
          value: `${property.cubicMeter} m³`,
          icon: <FaCube />
        }
        : null
    ].filter(Boolean);

    const layoutRows = [
      hasNumber(property.nrOfRooms)
        ? {
          label: "Rooms",
          value: property.nrOfRooms,
          icon: <FaBed />
        }
        : null,
      hasNumber(property.nrOfBathrooms)
        ? {
          label: "Bathrooms",
          value: property.nrOfBathrooms,
          icon: <FaBath />
        }
        : null,
      hasNumber(property.nrOfFloors)
        ? {
          label: "Floors",
          value: property.nrOfFloors,
          icon: <FaLayerGroup />
        }
        : null
    ].filter(Boolean);

    const energyRows = [
      heatingValue ? { label: "Heating", value: heatingValue, icon: <FaBolt /> } : null,
      warmWaterValue ? { label: "Warm Water", value: warmWaterValue, icon: <FaTint /> } : null
    ].filter(Boolean);

    const amenityRows = amenityItems.map(item => {
      let icon = <FaInfoCircle />;
      if (item.label === "WiFi") icon = <FaWifi />;
      if (item.label === "Parking") icon = <FaCar />;
      if (item.label === "Garden") icon = <FaLeaf />;
      if (item.label === "Balcony") icon = <FaHome />;
      if (item.label === "Elevator") icon = <FaBuilding />;
      if (item.label === "Furnished") icon = <FaCouch />;
      if (item.label === "Storage") icon = <FaWarehouse />;
      return {
        label: item.label,
        value: (
          <span className="amenity-check" aria-label="Available">
            ✓
          </span>
        ),
        icon
      };
    });

    const renderSection = (title, icon, rows) => {
      if (!rows.length) return null;
      return (
        <div className="property-info-section">
          <div className="property-info-header">
            {icon}
            <h4>{title}</h4>
          </div>
          <div className="property-info-table">
            {rows.map((row, index) => (
              <div className="property-info-row" key={`${title}-${index}`}>
                <div className="property-info-label">
                  {row.icon}
                  <span>{row.label}</span>
                </div>
                <div className="property-info-value">{row.value}</div>
              </div>
            ))}
          </div>
        </div>
      );
    };

    return (
      <Fragment>
        {renderSection("Overview", <FaInfoCircle />, overviewRows)}
        {renderSection("Building", <FaBuilding />, buildingRows)}
        {renderSection("Dimensions", <FaRulerCombined />, dimensionRows)}
        {renderSection("Layout", <FaDoorOpen />, layoutRows)}
        {renderSection("Energy", <FaBolt />, energyRows)}
        {renderSection("Amenities", <FaHome />, amenityRows)}
      </Fragment>
    );
  }
}
