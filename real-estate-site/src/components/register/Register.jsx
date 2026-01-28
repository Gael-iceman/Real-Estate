import React, { Component, Fragment } from "react";
import { createUser } from "../../actions/user";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

const initialState = {
  username: "",
  email: "",
  phoneNumber: "",
  password: "",
  repeatPassword: "",
  showPassword: false,
  showRepeatPassword: false,
  error: ""
};

class SignUpForm extends Component {
  state = initialState;

  signUpValidation = e => {
    e.preventDefault();
    if (!this.state.password || this.state.password.length < 8) {
      return this.setState({
        ...this.state,
        error: "Password should be 8 symbols long or more"
      });
    }
    if (this.state.password !== this.state.repeatPassword) {
      return this.setState({
        ...this.state,
        password: "",
        repeatPassword: "",
        error: "Passwords does not match. Enter passwords one more time."
      });
    }
    this.canSignUp();
  };

  canSignUp = () => {
    this.props.createUser(this.state);
    this.setState(initialState);
    this.props.history.push("/");
  };

  handleChange = e => {
    e.preventDefault();
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  render() {
    return (
      <Fragment>
        <Helmet>
          <title>Create Account | Real Estate</title>
        </Helmet>
        <div className="container mt-2">
          {this.state.error ? (
            <div className="alert alert-warning" role="alert">
              {this.state.error}
            </div>
          ) : (
            ""
          )}
        </div>
        <div className="d-flex flex-row justify-content-center mt-5">
          <div className="col-12 col-md-8 col-lg-6 col-xl-3">
            <div className="card p-5">
              <h4>Sign Up</h4>
              <form onSubmit={this.signUpValidation}>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    className="form-control"
                    autoComplete="email"
                    value={this.state.email}
                    onChange={e => this.handleChange(e)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    className="form-control"
                    autoComplete="username"
                    value={this.state.username}
                    onChange={e => this.handleChange(e)}
                    required
                  />
                  <small className="form-text text-muted">
                    Choose a unique username
                  </small>
                </div>
                <div className="form-group">
                  <label htmlFor="phoneNumber">Phone Number</label>
                  <input
                    type="text"
                    placeholder="Phone Number"
                    name="phoneNumber"
                    className="form-control"
                    value={this.state.phoneNumber}
                    onChange={e => this.handleChange(e)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <div className="password-toggle-wrapper">
                    <input
                      type={this.state.showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      className="form-control"
                      autoComplete="new-password"
                      value={this.state.password}
                      onChange={e => this.handleChange(e)}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle-button"
                      onClick={() =>
                        this.setState(state => ({ showPassword: !state.showPassword }))
                      }
                      aria-label={
                        this.state.showPassword ? "Hide password" : "Show password"
                      }
                    >
                      <i
                        className={`fa ${
                          this.state.showPassword ? "fa-eye-slash" : "fa-eye"
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                  <small className="form-text text-muted">
                    Choose password for your account
                  </small>
                </div>
                <div className="form-group">
                  <label htmlFor="repeatPassword">Repeat Password</label>
                  <div className="password-toggle-wrapper">
                    <input
                      type={this.state.showRepeatPassword ? "text" : "password"}
                      name="repeatPassword"
                      placeholder="Repeat Password"
                      className="form-control"
                      autoComplete="new-password"
                      value={this.state.repeatPassword}
                      onChange={e => this.handleChange(e)}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle-button"
                      onClick={() =>
                        this.setState(state => ({
                          showRepeatPassword: !state.showRepeatPassword
                        }))
                      }
                      aria-label={
                        this.state.showRepeatPassword
                          ? "Hide repeat password"
                          : "Show repeat password"
                      }
                    >
                      <i
                        className={`fa ${
                          this.state.showRepeatPassword ? "fa-eye-slash" : "fa-eye"
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                  <small className="form-text text-muted">
                    Choose password for your account
                  </small>
                </div>
                <div className="form-group">
                  <input
                    type="submit"
                    value="SIGN UP"
                    className="btn btn-md btn-success"
                  />
                </div>
              </form>
              <p>I have account</p>
              <Link to="/login">Login</Link>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.userReducer
  };
}

export default connect(mapStateToProps, { createUser })(SignUpForm);
