import React, { Component } from "react";

export default class ImageCard extends Component {
  render() {
    const { imageCon, property, imageId, removeAction, onSetPrimary, isPrimary } =
      this.props;
    const isMarked = removeAction && imageId === imageCon.image.id;
    const showPrimaryControls = Boolean(onSetPrimary);
    const showRemoveControls = Boolean(removeAction);
    const imgClassName = `card-img-top img-fluid m-auto${isMarked ? " toRemove" : ""}${showPrimaryControls && isPrimary ? " border border-success" : ""}`;
    const currency = (property.currency || "RWF").toUpperCase();
    const priceSuffix = property.isForRent ? `${currency}/month` : currency;
    const imageAlt = `${property.address}, property ${property.isForSale ? "for sale - " : "for rent - "}${property.price} ${priceSuffix}`;

    return (
      <div className="card col-12 col-sm-6 col-lg-4 mb-3">
        <div className="image-card-media position-relative">
          {showPrimaryControls && isPrimary ? (
            <span
              className="badge badge-success position-absolute image-card-primary-badge"
              style={{ top: "8px", left: "8px" }}
            >
              Primary
            </span>
          ) : (
            ""
          )}
          <img
            src={imageCon.image.url}
            className={imgClassName}
            alt={imageAlt}
          />
        </div>
        {(showPrimaryControls || showRemoveControls) && (
          <div className="p-2 d-flex justify-content-between align-items-center image-card-actions">
            {showPrimaryControls ? (
              isPrimary ? (
                <small className="text-success font-weight-bold">
                  Primary image
                </small>
              ) : (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-success"
                  onClick={() => onSetPrimary(imageCon.image.id)}
                >
                  Set as primary
                </button>
              )
            ) : (
              <span />
            )}
            {showRemoveControls ? (
              <button
                type="button"
                className="btn btn-sm btn-outline-danger"
                onClick={() =>
                  removeAction(imageCon.image.public_id, imageCon.image.id)
                }
              >
                Delete
              </button>
            ) : (
              ""
            )}
          </div>
        )}
      </div>
    );
  }
}
