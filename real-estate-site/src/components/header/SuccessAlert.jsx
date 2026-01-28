import React, { Component } from "react";

export default class SuccessAlert extends Component {
  render() {
    if (!this.props.success) {
      return null;
    }

    return (
      <div className="global-alert-container" aria-live="polite" aria-atomic="true">
        <div className="global-alert">
          <div className="alert alert-success" role="alert">
            <div className="global-alert-body">{this.props.success.text}</div>
            <button
              type="button"
              className="close"
              aria-label="Close"
              onClick={this.props.clearSuccess}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
}
