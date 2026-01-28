import React, { useEffect, useRef, useState } from "react";

const hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj || {}, key);

const hasAmenityFeature = (property, keywords) => {
  if (!property || !Array.isArray(property.property_features)) return false;
  const normalizedKeywords = keywords.map(keyword => keyword.toLowerCase());
  return property.property_features.some(featureCon => {
    const text = String(featureCon?.feature?.text || "").toLowerCase();
    if (!text) return false;
    return normalizedKeywords.some(keyword => text.includes(keyword));
  });
};

const parseAmenityList = value =>
  String(value || "")
    .split(",")
    .map(item => item.trim())
    .filter(Boolean);

const toggleAmenityKeywords = (items, keywords, label, enabled) => {
  const normalizedKeywords = keywords.map(keyword => keyword.toLowerCase());
  const matchesKeyword = item =>
    normalizedKeywords.some(keyword => item.toLowerCase().includes(keyword));
  const hasMatch = items.some(matchesKeyword);
  if (enabled && !hasMatch) {
    return [...items, label];
  }
  if (!enabled && hasMatch) {
    return items.filter(item => !matchesKeyword(item));
  }
  return items;
};

const buildInitialState = property => ({
  title: property.title || "",
  description: property.description || "",
  price: property.price ?? "",
  currency: property.currency || "RWF",
  address: property.address || "",
  city: property.city || "",
  postcode: property.postcode || "",
  country: property.country || "",
  propertyType: property.propertyType || "",
  propertiestatus: property.propertiestatus || property.status || "active",
  isForSale: Boolean(property.isForSale),
  isForRent: Boolean(property.isForRent),
  nrOfRooms: property.nrOfRooms ?? "",
  nrOfBathrooms: property.nrOfBathrooms ?? "",
  nrOfFloors: property.nrOfFloors ?? "",
  sqrMeter: property.sqrMeter ?? "",
  cubicMeter: property.cubicMeter ?? "",
  monthlyContribution: property.monthlyContribution ?? "",
  constructionYear: property.constructionYear ?? "",
  renovationYear: property.renovationYear ?? "",
  heating:
    (Boolean(property.heating) && String(property.heating).toLowerCase() !== "no") ||
    (!hasOwn(property, "heating") && hasAmenityFeature(property, ["heating"])),
  warmWater:
    (Boolean(property.warmWater) &&
      String(property.warmWater).toLowerCase() !== "no") ||
    (!hasOwn(property, "warmWater") &&
      hasAmenityFeature(property, ["warm water", "hot water", "warmwater"])),
  storage:
    (Boolean(property.storage) && String(property.storage).toLowerCase() !== "no") ||
    (!hasOwn(property, "storage") && hasAmenityFeature(property, ["storage", "storeroom"])),
  wifi:
    (Boolean(property.wifi) && String(property.wifi).toLowerCase() !== "no") ||
    (!hasOwn(property, "wifi") && hasAmenityFeature(property, ["wifi", "wi-fi", "internet"])),
  parking: Boolean(property.parking) && String(property.parking).toLowerCase() !== "no",
  hasGarden: Boolean(property.hasGarden),
  hasBalcony: Boolean(property.hasBalcony),
  hasElevator: Boolean(property.hasElevator),
  isFurnished: Boolean(property.isFurnished),
  lat: property.lat ?? "",
  lon: property.lon ?? "",
  contactEmail: property.contactEmail || "",
  contactPhone: property.contactPhone || "",
  videoUrl: property.videoUrl || "",
  amenities: Array.isArray(property.property_features)
    ? property.property_features
        .map(item => item?.feature?.text)
        .filter(Boolean)
        .join(", ")
    : ""
});

const PropertyEditForm = ({ property, onSave, onDelete, saving, deleting }) => {
  const [formState, setFormState] = useState(buildInitialState(property));
  const prevPropertyIdRef = useRef(property?.id);
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

  useEffect(() => {
    if (!property) return;
    if (prevPropertyIdRef.current !== property.id) {
      setFormState(buildInitialState(property));
      prevPropertyIdRef.current = property.id;
    }
  }, [property]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleDealChange = e => {
    const value = e.target.value;
    setFormState(prev => ({
      ...prev,
      isForSale: value === "sale",
      isForRent: value === "rent",
      monthlyContribution: value === "rent" ? prev.monthlyContribution : ""
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    const payload = { ...formState };
    if (!payload.isForRent) {
      delete payload.monthlyContribution;
    }
    const amenityFallback = {
      heating: !hasOwn(property, "heating"),
      warmWater: !hasOwn(property, "warmWater"),
      storage: !hasOwn(property, "storage"),
      wifi: !hasOwn(property, "wifi")
    };
    if (Object.values(amenityFallback).some(Boolean)) {
      let amenities = parseAmenityList(payload.amenities);
      if (amenityFallback.heating) {
        amenities = toggleAmenityKeywords(amenities, ["heating"], "Heating", payload.heating);
      }
      if (amenityFallback.warmWater) {
        amenities = toggleAmenityKeywords(
          amenities,
          ["warm water", "hot water", "warmwater"],
          "Warm Water",
          payload.warmWater
        );
      }
      if (amenityFallback.storage) {
        amenities = toggleAmenityKeywords(amenities, ["storage", "storeroom"], "Storage", payload.storage);
      }
      if (amenityFallback.wifi) {
        amenities = toggleAmenityKeywords(amenities, ["wifi", "wi-fi", "internet"], "WiFi", payload.wifi);
      }
      payload.amenities = amenities.join(", ");
      setFormState(prev => ({ ...prev, amenities: payload.amenities }));
    }
    onSave(payload);
  };

  const handleDelete = () => {
    if (window.confirm("Delete this property permanently?")) {
      onDelete();
    }
  };

  return (
    <div className="card mt-3">
      <div className="card-body">
        <h5 className="card-title">Edit Property Details</h5>
        <p className="text-muted">
          Update any property field and save. Status can be changed anytime.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-12 col-md-6 mb-3">
              <label className="w-100">
                Title
                <input
                  className="form-control"
                  name="title"
                  value={formState.title}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>
            <div className="col-12 col-md-3 mb-3">
              <label className="w-100">
                Price
                <input
                  className="form-control"
                  type="number"
                  name="price"
                  min="0"
                  value={formState.price}
                  onChange={handleChange}
                />
                <select
                  className="form-control mt-2"
                  name="currency"
                  value={formState.currency || "RWF"}
                  onChange={handleChange}
                >
                  <option value="RWF">RWF</option>
                  <option value="USD">USD</option>
                </select>
              </label>
            </div>
            <div className="col-12 col-md-3 mb-3">
              <label className="w-100">
                Status
                <select
                  className="form-control"
                  name="propertiestatus"
                  value={formState.propertiestatus}
                  onChange={handleChange}
                >
                  <option value="active">active</option>
                  <option value="pending">pending</option>
                  <option value="sold">sold</option>
                  <option value="rented">rented</option>
                  <option value="inactive">inactive</option>
                </select>
              </label>
            </div>
            <div className="col-12 col-md-4 mb-3">
              <label className="w-100">
                Property Type
                <select
                  className="form-control"
                  name="propertyType"
                  value={formState.propertyType}
                  onChange={handleChange}
                >
                  <option value="">Select type</option>
                  {propertyTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="col-6 col-md-4 mb-3">
              <label className="w-100">
                For Sale
                <input
                  type="radio"
                  name="dealType"
                  className="ml-2"
                  value="sale"
                  checked={formState.isForSale}
                  onChange={handleDealChange}
                />
              </label>
            </div>
            <div className="col-6 col-md-4 mb-3">
              <label className="w-100">
                For Rent
                <input
                  type="radio"
                  name="dealType"
                  className="ml-2"
                  value="rent"
                  checked={formState.isForRent}
                  onChange={handleDealChange}
                />
              </label>
            </div>
            <div className="col-12 mb-3">
              <label className="w-100">
                Description
                <textarea
                  className="form-control"
                  name="description"
                  rows="4"
                  value={formState.description}
                  onChange={handleChange}
                />
              </label>
            </div>
          </div>

          <div className="row">
            <div className="col-12 col-md-6 mb-3">
              <label className="w-100">
                Address
                <input
                  className="form-control"
                  name="address"
                  value={formState.address}
                  onChange={handleChange}
                />
              </label>
            </div>
            <div className="col-12 col-md-3 mb-3">
              <label className="w-100">
                City
                <input
                  className="form-control"
                  name="city"
                  value={formState.city}
                  onChange={handleChange}
                />
              </label>
            </div>
            <div className="col-12 col-md-3 mb-3">
              <label className="w-100">
                Postcode
                <input
                  className="form-control"
                  name="postcode"
                  value={formState.postcode}
                  onChange={handleChange}
                />
              </label>
            </div>
            <div className="col-12 col-md-4 mb-3">
              <label className="w-100">
                Country
                <input
                  className="form-control"
                  name="country"
                  value={formState.country}
                  onChange={handleChange}
                />
              </label>
            </div>
            <div className="col-12 col-md-4 mb-3">
              <label className="w-100">
                Contact Email
                <input
                  className="form-control"
                  type="email"
                  name="contactEmail"
                  value={formState.contactEmail}
                  onChange={handleChange}
                />
              </label>
            </div>
            <div className="col-12 col-md-4 mb-3">
              <label className="w-100">
                Contact Phone
                <input
                  className="form-control"
                  name="contactPhone"
                  value={formState.contactPhone}
                  onChange={handleChange}
                />
              </label>
            </div>
          </div>

          <div className="row">
            <div className="col-6 col-md-3 mb-3">
              <label className="w-100">
                Rooms
                <input
                  className="form-control"
                  type="number"
                  name="nrOfRooms"
                  value={formState.nrOfRooms}
                  onChange={handleChange}
                />
              </label>
            </div>
            <div className="col-6 col-md-3 mb-3">
              <label className="w-100">
                Bathrooms
                <input
                  className="form-control"
                  type="number"
                  name="nrOfBathrooms"
                  value={formState.nrOfBathrooms}
                  onChange={handleChange}
                />
              </label>
            </div>
            <div className="col-6 col-md-3 mb-3">
              <label className="w-100">
                Floors
                <input
                  className="form-control"
                  type="number"
                  name="nrOfFloors"
                  value={formState.nrOfFloors}
                  onChange={handleChange}
                />
              </label>
            </div>
            <div className="col-6 col-md-3 mb-3">
              <label className="w-100">
                Sq Meter
                <input
                  className="form-control"
                  type="number"
                  name="sqrMeter"
                  value={formState.sqrMeter}
                  onChange={handleChange}
                />
              </label>
            </div>
            <div className="col-6 col-md-3 mb-3">
              <label className="w-100">
                Cubic Meter
                <input
                  className="form-control"
                  type="number"
                  name="cubicMeter"
                  value={formState.cubicMeter}
                  onChange={handleChange}
                />
              </label>
            </div>
            {formState.isForRent ? (
              <div className="col-6 col-md-3 mb-3">
                <label className="w-100">
                  Monthly Contribution
                  <input
                    className="form-control"
                    type="number"
                    name="monthlyContribution"
                    value={formState.monthlyContribution}
                    onChange={handleChange}
                  />
                </label>
              </div>
            ) : (
              ""
            )}
          </div>

          <div className="row">
            <div className="col-6 col-md-3 mb-3">
              <label className="w-100">
                Construction Year
                <input
                  className="form-control"
                  type="number"
                  name="constructionYear"
                  value={formState.constructionYear}
                  onChange={handleChange}
                />
              </label>
            </div>
            <div className="col-6 col-md-3 mb-3">
              <label className="w-100">
                Renovation Year
                <input
                  className="form-control"
                  type="number"
                  name="renovationYear"
                  value={formState.renovationYear}
                  onChange={handleChange}
                />
              </label>
            </div>
            <div className="col-12 col-md-6 mb-3">
              <label className="w-100">
                Parking
                <input
                  type="checkbox"
                  name="parking"
                  className="ml-2"
                  checked={formState.parking}
                  onChange={handleChange}
                />
              </label>
            </div>
            <div className="col-12 col-md-6 mb-3">
              <label className="w-100">
                Heating
                <input
                  type="checkbox"
                  name="heating"
                  className="ml-2"
                  checked={formState.heating}
                  onChange={handleChange}
                />
              </label>
            </div>
            <div className="col-12 col-md-6 mb-3">
              <label className="w-100">
                Warm Water
                <input
                  type="checkbox"
                  name="warmWater"
                  className="ml-2"
                  checked={formState.warmWater}
                  onChange={handleChange}
                />
              </label>
            </div>
            <div className="col-12 col-md-6 mb-3">
              <label className="w-100">
                Storage
                <input
                  type="checkbox"
                  name="storage"
                  className="ml-2"
                  checked={formState.storage}
                  onChange={handleChange}
                />
              </label>
            </div>
            <div className="col-12 col-md-6 mb-3">
              <label className="w-100">
                WiFi
                <input
                  type="checkbox"
                  name="wifi"
                  className="ml-2"
                  checked={formState.wifi}
                  onChange={handleChange}
                />
              </label>
            </div>
            <div className="col-6 col-md-3 mb-3">
              <label className="w-100">
                Garden
                <input
                  type="checkbox"
                  name="hasGarden"
                  className="ml-2"
                  checked={formState.hasGarden}
                  onChange={handleChange}
                />
              </label>
            </div>
            <div className="col-6 col-md-3 mb-3">
              <label className="w-100">
                Balcony
                <input
                  type="checkbox"
                  name="hasBalcony"
                  className="ml-2"
                  checked={formState.hasBalcony}
                  onChange={handleChange}
                />
              </label>
            </div>
            <div className="col-6 col-md-3 mb-3">
              <label className="w-100">
                Elevator
                <input
                  type="checkbox"
                  name="hasElevator"
                  className="ml-2"
                  checked={formState.hasElevator}
                  onChange={handleChange}
                />
              </label>
            </div>
            <div className="col-6 col-md-3 mb-3">
              <label className="w-100">
                Furnished
                <input
                  type="checkbox"
                  name="isFurnished"
                  className="ml-2"
                  checked={formState.isFurnished}
                  onChange={handleChange}
                />
              </label>
            </div>
            <div className="col-12 col-md-6 mb-3">
              <label className="w-100">
                Latitude
                <input
                  className="form-control"
                  type="number"
                  name="lat"
                  min="-90"
                  max="90"
                  value={formState.lat}
                  onChange={handleChange}
                />
              </label>
            </div>
            <div className="col-12 col-md-6 mb-3">
              <label className="w-100">
                Longitude
                <input
                  className="form-control"
                  type="number"
                  name="lon"
                  min="-180"
                  max="180"
                  value={formState.lon}
                  onChange={handleChange}
                />
              </label>
            </div>
            <div className="col-12 mb-3">
              <label className="w-100">
                YouTube Video Link
                <input
                  className="form-control"
                  type="url"
                  name="videoUrl"
                  value={formState.videoUrl}
                  onChange={handleChange}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </label>
            </div>
            <div className="col-12 mb-3">
              <label className="w-100">
                Amenities (comma separated)
                <input
                  className="form-control"
                  name="amenities"
                  value={formState.amenities}
                  onChange={handleChange}
                />
              </label>
            </div>
          </div>

          <div className="d-flex flex-wrap align-items-center gap-2 property-edit-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete Property"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PropertyEditForm;
