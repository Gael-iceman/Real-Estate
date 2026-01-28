import React, { Component } from "react";

export default class UserCard extends Component {
  render() {
    const { user } = this.props;
    if (!user) {
      return null;
    }

    const agencyName = user.agency?.name;
    const username = user.username || "Listing Owner";

    return (
      <div className="card">
        <div className="card-header">
          {agencyName ? agencyName : "Listing Owner"}
        </div>
        <div className="card-body">
          <p className="mb-1">Published by: {username}</p>
          <p className="mb-0 text-muted">
            Contact details are available in the Contact section.
          </p>
        </div>
      </div>
    );
  }
}
