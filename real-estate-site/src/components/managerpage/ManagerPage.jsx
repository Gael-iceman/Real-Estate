import React, { Component } from "react";
import { connect } from "react-redux";

import { getAgencyAgents, toggleAgentAcc } from "../../actions/property";
import ManagersList from "./ManagersList";
import AddNewproperty from "../addnewproperty/AddNewproperty";

import "./managerpage.css";

class ManagerPage extends Component {
  componentDidMount() {
    if (this.props.user) {
      this.props.getAgencyAgents();
    }
  }

  toggleAccount = (agentId, action) => {
    this.props.toggleAgentAcc(agentId, action);
  };

  render() {
    return (
      <div className="row mt-3">
        <div className="col-12">
          <AddNewproperty />
          <hr className="my-3" />
          <ManagersList
            agents={this.props.agents}
            toggleAccount={this.toggleAccount}
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.userReducer.user,
    agents: state.propertyReducer.agencyAgents
  };
}

export default connect(mapStateToProps, {
  getAgencyAgents,
  toggleAgentAcc
})(ManagerPage);
