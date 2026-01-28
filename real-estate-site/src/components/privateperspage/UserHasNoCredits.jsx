import React, { Component, Fragment } from "react";

export default class UserHasNoCredits extends Component {
  render() {
    if (this.props.user) {
      return (
        <Fragment>
          <div class="alert alert-info mt-3" role="alert">
            Sorry, property_listing limit reached.
          </div>
        </Fragment>
      );
    } else {
      return <h4>Loading...</h4>;
    }
  }
}
