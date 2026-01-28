import React, { Component } from "react";
import { connect } from "react-redux";
import AddNewproperty from "../addnewproperty/AddNewproperty";
import { isAdminUser } from "../../utils/roles";
import { createAdminUser, updateAdminProfile } from "../../actions/user";
import { Helmet } from "react-helmet";

import './privateperspage.css'

const initialState = {
  profileUsername: "",
  profileEmail: "",
  profilePassword: "",
  profilePasswordConfirm: "",
  profileReachoutEmail: "",
  profileReachoutPhone: "",
  profileStatus: "",
  profileError: "",
  profileSaving: false,
  activeSection: "property",
  showProfilePassword: false,
  showProfilePasswordConfirm: false,
  adminUsername: "",
  adminEmail: "",
  adminPhoneNumber: "",
  adminPassword: "",
  adminPasswordConfirm: "",
  adminStatus: "",
  adminError: "",
  showAdminPassword: false,
  showAdminPasswordConfirm: false
};
class PrivatePersPage extends Component {
  state = initialState;

  componentDidMount() {
    this.hydrateProfileFields();
  }

  hydrateProfileFields = (force = false) => {
    const { user } = this.props;
    if (!user) return;
    this.setState(state => {
      if (!force && (state.profileUsername || state.profileEmail)) {
        return null;
      }
      return {
        profileUsername: user.username || "",
        profileEmail: user.email || "",
        profileReachoutEmail: user.reachoutEmail || "",
        profileReachoutPhone: user.reachoutPhone || ""
      };
    });
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  submitAdminCreate = async e => {
    e.preventDefault();
    const {
      adminUsername,
      adminEmail,
      adminPhoneNumber,
      adminPassword,
      adminPasswordConfirm
    } = this.state;

    if (!adminUsername || !adminEmail || !adminPassword) {
      this.setState({ adminError: "Please fill in all required fields.", adminStatus: "" });
      return;
    }
    if (adminPassword !== adminPasswordConfirm) {
      this.setState({ adminError: "Passwords do not match.", adminStatus: "" });
      return;
    }

    try {
      await this.props.createAdminUser({
        username: adminUsername,
        email: adminEmail,
        phoneNumber: adminPhoneNumber,
        password: adminPassword
      });
      this.setState({
        adminUsername: "",
        adminEmail: "",
        adminPhoneNumber: "",
        adminPassword: "",
        adminPasswordConfirm: "",
        adminStatus: "Admin user created successfully.",
        adminError: ""
      });
    } catch (err) {
      this.setState({ adminError: "Failed to create admin user.", adminStatus: "" });
    }
  };

  submitAdminProfileUpdate = async e => {
    e.preventDefault();
    const {
      profileUsername,
      profileEmail,
      profilePassword,
      profilePasswordConfirm,
      profileReachoutEmail,
      profileReachoutPhone
    } = this.state;

    if (profilePassword && profilePassword !== profilePasswordConfirm) {
      this.setState({
        profileError: "Passwords do not match.",
        profileStatus: ""
      });
      return;
    }

    this.setState({ profileSaving: true, profileError: "", profileStatus: "" });
    try {
      const response = await this.props.updateAdminProfile({
        username: profileUsername,
        email: profileEmail,
        password: profilePassword,
        reachoutEmail: profileReachoutEmail,
        reachoutPhone: profileReachoutPhone
      });
      const updatedUser = response?.user;
      this.setState({
        profileUsername: updatedUser?.username || profileUsername,
        profileEmail: updatedUser?.email || profileEmail,
        profileReachoutEmail: updatedUser?.reachoutEmail || profileReachoutEmail,
        profileReachoutPhone: updatedUser?.reachoutPhone || profileReachoutPhone,
        profilePassword: "",
        profilePasswordConfirm: "",
        profileStatus: "Profile updated successfully.",
        profileError: "",
        profileSaving: false
      });
    } catch (err) {
      this.setState({
        profileError: "Failed to update profile.",
        profileStatus: "",
        profileSaving: false
      });
    }
  };

  componentDidUpdate(prevProps) {
    if (prevProps.user?.id !== this.props.user?.id) {
      this.hydrateProfileFields(true);
    }
  }

  render() {
    const isAdmin = isAdminUser(this.props.user);
    return (
      <div className="row mt-3">
        <div className="col-12">
          <Helmet>
            <title>{isAdmin ? "Admin Dashboard" : "Account"} | Real Estate</title>
          </Helmet>
          {isAdmin ? (
            <div className="admin-dashboard">
              <aside className="admin-sidebar">
                <button
                  type="button"
                  className={`admin-nav-item ${
                    this.state.activeSection === "property" ? "active" : ""
                  }`}
                  onClick={() => this.setState({ activeSection: "property" })}
                >
                  Add Property
                </button>
                <button
                  type="button"
                  className={`admin-nav-item ${
                    this.state.activeSection === "profile" ? "active" : ""
                  }`}
                  onClick={() => this.setState({ activeSection: "profile" })}
                >
                  Update Profile
                </button>
                <button
                  type="button"
                  className={`admin-nav-item ${
                    this.state.activeSection === "admin" ? "active" : ""
                  }`}
                  onClick={() => this.setState({ activeSection: "admin" })}
                >
                  Create Admin
                </button>
              </aside>
              <div className="admin-content">
                {this.state.activeSection === "property" ? (
                  <AddNewproperty />
                ) : (
                  ""
                )}
                {this.state.activeSection === "profile" ? (
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">Update Admin Profile</h5>
                      <p className="text-muted mb-3">
                        Update your username, email, and public reachout contact. Leave password
                        blank to keep it unchanged.
                      </p>
                      {this.state.profileStatus ? (
                        <div className="alert alert-success" role="alert">
                          {this.state.profileStatus}
                        </div>
                      ) : (
                        ""
                      )}
                      {this.state.profileError ? (
                        <div className="alert alert-danger" role="alert">
                          {this.state.profileError}
                        </div>
                      ) : (
                        ""
                      )}
                      <form onSubmit={this.submitAdminProfileUpdate}>
                        <div className="row">
                          <div className="col-12 col-md-6 mb-3">
                            <label className="w-100">
                              Username
                              <input
                                type="text"
                                name="profileUsername"
                                className="form-control"
                                value={this.state.profileUsername}
                                onChange={this.handleChange}
                              />
                            </label>
                          </div>
                          <div className="col-12 col-md-6 mb-3">
                            <label className="w-100">
                              Email
                              <input
                                type="email"
                                name="profileEmail"
                                className="form-control"
                                value={this.state.profileEmail}
                                onChange={this.handleChange}
                              />
                            </label>
                          </div>
                          <div className="col-12 col-md-6 mb-3">
                            <label className="w-100">
                              Reachout Email (optional)
                              <input
                                type="email"
                                name="profileReachoutEmail"
                                className="form-control"
                                value={this.state.profileReachoutEmail}
                                onChange={this.handleChange}
                                placeholder="Public contact email"
                              />
                            </label>
                          </div>
                          <div className="col-12 col-md-6 mb-3">
                            <label className="w-100">
                              Reachout Phone (optional)
                              <input
                                type="text"
                                name="profileReachoutPhone"
                                className="form-control"
                                value={this.state.profileReachoutPhone}
                                onChange={this.handleChange}
                                placeholder="Public contact phone"
                              />
                            </label>
                          </div>
                          <div className="col-12 col-md-6 mb-3">
                            <label className="w-100">
                              New Password
                              <div className="password-toggle-wrapper">
                                <input
                                  type={this.state.showProfilePassword ? "text" : "password"}
                                  name="profilePassword"
                                  className="form-control"
                                  value={this.state.profilePassword}
                                  onChange={this.handleChange}
                                />
                                <button
                                  type="button"
                                  className="password-toggle-button"
                                  onClick={() =>
                                    this.setState(state => ({
                                      showProfilePassword: !state.showProfilePassword
                                    }))
                                  }
                                  aria-label={
                                    this.state.showProfilePassword
                                      ? "Hide new password"
                                      : "Show new password"
                                  }
                                >
                                  <i
                                    className={`fa ${
                                      this.state.showProfilePassword
                                        ? "fa-eye-slash"
                                        : "fa-eye"
                                    }`}
                                    aria-hidden="true"
                                  />
                                </button>
                              </div>
                            </label>
                          </div>
                          <div className="col-12 col-md-6 mb-3">
                            <label className="w-100">
                              Confirm New Password
                              <div className="password-toggle-wrapper">
                                <input
                                  type={
                                    this.state.showProfilePasswordConfirm
                                      ? "text"
                                      : "password"
                                  }
                                  name="profilePasswordConfirm"
                                  className="form-control"
                                  value={this.state.profilePasswordConfirm}
                                  onChange={this.handleChange}
                                />
                                <button
                                  type="button"
                                  className="password-toggle-button"
                                  onClick={() =>
                                    this.setState(state => ({
                                      showProfilePasswordConfirm:
                                        !state.showProfilePasswordConfirm
                                    }))
                                  }
                                  aria-label={
                                    this.state.showProfilePasswordConfirm
                                      ? "Hide confirm password"
                                      : "Show confirm password"
                                  }
                                >
                                  <i
                                    className={`fa ${
                                      this.state.showProfilePasswordConfirm
                                        ? "fa-eye-slash"
                                        : "fa-eye"
                                    }`}
                                    aria-hidden="true"
                                  />
                                </button>
                              </div>
                            </label>
                          </div>
                        </div>
                        <button
                          type="submit"
                          className="btn btn-success"
                          disabled={this.state.profileSaving}
                        >
                          {this.state.profileSaving ? "Saving..." : "Update Profile"}
                        </button>
                      </form>
                    </div>
                  </div>
                ) : (
                  ""
                )}
                {this.state.activeSection === "admin" ? (
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">Create Admin User</h5>
                      <p className="text-muted mb-3">
                        Create another admin account for managing listings.
                      </p>
                      {this.state.adminStatus ? (
                        <div className="alert alert-success" role="alert">
                          {this.state.adminStatus}
                        </div>
                      ) : (
                        ""
                      )}
                      {this.state.adminError ? (
                        <div className="alert alert-danger" role="alert">
                          {this.state.adminError}
                        </div>
                      ) : (
                        ""
                      )}
                      <form onSubmit={this.submitAdminCreate}>
                        <div className="row">
                          <div className="col-12 col-md-6 mb-3">
                            <label className="w-100">
                              Username <span className="text-danger">*</span>
                              <input
                                type="text"
                                name="adminUsername"
                                className="form-control"
                                value={this.state.adminUsername}
                                onChange={this.handleChange}
                                required
                              />
                            </label>
                          </div>
                          <div className="col-12 col-md-6 mb-3">
                            <label className="w-100">
                              Email <span className="text-danger">*</span>
                              <input
                                type="email"
                                name="adminEmail"
                                className="form-control"
                                value={this.state.adminEmail}
                                onChange={this.handleChange}
                                required
                              />
                            </label>
                          </div>
                          <div className="col-12 col-md-6 mb-3">
                            <label className="w-100">
                              Phone Number
                              <input
                                type="text"
                                name="adminPhoneNumber"
                                className="form-control"
                                value={this.state.adminPhoneNumber}
                                onChange={this.handleChange}
                              />
                            </label>
                          </div>
                          <div className="col-12 col-md-6 mb-3">
                            <label className="w-100">
                              Password <span className="text-danger">*</span>
                              <div className="password-toggle-wrapper">
                                <input
                                  type={this.state.showAdminPassword ? "text" : "password"}
                                  name="adminPassword"
                                  className="form-control"
                                  value={this.state.adminPassword}
                                  onChange={this.handleChange}
                                  required
                                />
                                <button
                                  type="button"
                                  className="password-toggle-button"
                                  onClick={() =>
                                    this.setState(state => ({
                                      showAdminPassword: !state.showAdminPassword
                                    }))
                                  }
                                  aria-label={
                                    this.state.showAdminPassword
                                      ? "Hide password"
                                      : "Show password"
                                  }
                                >
                                  <i
                                    className={`fa ${
                                      this.state.showAdminPassword
                                        ? "fa-eye-slash"
                                        : "fa-eye"
                                    }`}
                                    aria-hidden="true"
                                  />
                                </button>
                              </div>
                            </label>
                          </div>
                          <div className="col-12 col-md-6 mb-3">
                            <label className="w-100">
                              Confirm Password <span className="text-danger">*</span>
                              <div className="password-toggle-wrapper">
                                <input
                                  type={this.state.showAdminPasswordConfirm ? "text" : "password"}
                                  name="adminPasswordConfirm"
                                  className="form-control"
                                  value={this.state.adminPasswordConfirm}
                                  onChange={this.handleChange}
                                  required
                                />
                                <button
                                  type="button"
                                  className="password-toggle-button"
                                  onClick={() =>
                                    this.setState(state => ({
                                      showAdminPasswordConfirm: !state.showAdminPasswordConfirm
                                    }))
                                  }
                                  aria-label={
                                    this.state.showAdminPasswordConfirm
                                      ? "Hide confirm password"
                                      : "Show confirm password"
                                  }
                                >
                                  <i
                                    className={`fa ${
                                      this.state.showAdminPasswordConfirm
                                        ? "fa-eye-slash"
                                        : "fa-eye"
                                    }`}
                                    aria-hidden="true"
                                  />
                                </button>
                              </div>
                            </label>
                          </div>
                        </div>
                        <button type="submit" className="btn btn-success">
                          Create Admin
                        </button>
                      </form>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Client Dashboard</h5>
                <p className="mb-0">
                  Clients can browse listings and save favorites. Property
                  creation is limited to admins.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  if (state.userReducer) {
    return {
      user: state.userReducer.user
    };
  }
}

export default connect(mapStateToProps, {
  createAdminUser,
  updateAdminProfile
})(PrivatePersPage);
