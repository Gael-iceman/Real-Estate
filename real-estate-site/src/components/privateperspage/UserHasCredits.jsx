import React, { Component, Fragment } from "react";

export default class UserHasCredits extends Component {
  render() {
    if (this.props.user) {
      return (
        <Fragment>
          <h4>
            Welcome back: {this.props.user.username} - you are loged in as
            private person.
          </h4>
          <p>As private person you can publish 1 free property_listing monthly.</p>
          <p>
            You can publish more {this.props.user.freepropertyLimit} free
            property_listing.
          </p>
          <p>
            You also have {this.props.user.paidpropertyLimit} paid property_listing
            limit.
          </p>
        </Fragment>
      );
    } else {
      return <h4>Loading...</h4>;
    }
  }
}
