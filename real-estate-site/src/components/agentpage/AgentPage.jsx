import React, { Component } from "react";
import { connect } from "react-redux";

import AddNewproperty from "../addnewproperty/AddNewproperty";

class AgentPage extends Component {
  render() {
    if (this.props.user) {
      if (!this.props.user.agentConfirmedByManager) {
        return (
          <div className="container">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">
                  Sorry. Your account is suspended or not confirmed by your
                  manager.
                </h5>
              </div>
            </div>
          </div>
        );
      } else {
        return (
          <div className="row mt-3">
            <div className="col-12">
              <AddNewproperty />
              <hr className="my-3" />
            </div>
          </div>
        );
      }
    }
  }
}

function mapStateToProps(state) {
  return {
    user: state.userReducer.user
  };
}

export default connect(mapStateToProps)(AgentPage);
