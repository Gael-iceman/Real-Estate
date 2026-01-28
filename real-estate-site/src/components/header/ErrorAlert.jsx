import React, { Component } from "react";

export default class ErrorAlert extends Component {
  getAlertConfig = () => {
    if (!this.props.error) {
      return null;
    }

    if (this.props.error.actionErr) {
      return { message: this.props.error.actionErr, variant: "warning" };
    }

    if (this.props.error.userErr) {
      return { message: this.props.error.userErr, variant: "danger" };
    }

    return {
      message: "Unexpected error. Please contact us: technical@support.com",
      variant: "warning"
    };
  };

  render() {
    const alertConfig = this.getAlertConfig();

    if (!alertConfig) {
      return null;
    }

    return (
      <div className="global-alert-container" aria-live="assertive" aria-atomic="true">
        <div className="global-alert">
          <div className={`alert alert-${alertConfig.variant}`} role="alert">
            <div className="global-alert-body">{alertConfig.message}</div>
            <button
              type="button"
              className="close"
              aria-label="Close"
              onClick={this.props.clearErrors}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
}
