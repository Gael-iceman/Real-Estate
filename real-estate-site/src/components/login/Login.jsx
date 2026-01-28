import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { loginUser } from "../../actions/user";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

const initialState = {
  identifier: "",
  password: "",
  errors: {},
  showPassword: false
};

class LoginForm extends Component {
  state = initialState;

  login = e => {
    e.preventDefault();
    const errors = {};
    const identifier = this.state.identifier.trim();

    if (!identifier) {
      errors.identifier = "Email or username is required.";
    }

    if (!this.state.password) {
      errors.password = "Password is required.";
    }

    if (Object.keys(errors).length > 0) {
      this.setState({ errors });
      return;
    }

    this.props.loginUser({ identifier, password: this.state.password });
  };

  handleChange = e => {
    e.preventDefault();
    const { name, value } = e.target;
    const errors = { ...this.state.errors };

    if (errors[name]) {
      delete errors[name];
    }

    this.setState({
      [name]: value,
      errors
    });
  };

  redirectToAccount = () => {
    this.props.history.push("/");
  };

  componentDidMount() {
    if (this.props.user) {
      this.redirectToAccount();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.user && this.props.user !== prevProps.user) {
      this.redirectToAccount();
    }
  }

  render() {
    const { errors } = this.state;
    const loginError =
      this.props.error && this.props.error.userErr ? this.props.error.userErr : "";
    const loginErrorLower = loginError.toLowerCase();
    const loginErrorHint =
      loginErrorLower.includes("invalid") || loginErrorLower.includes("credential")
        ? "Check your email or username and password and try again."
        : loginErrorLower.includes("password")
        ? "Make sure your password is correct and try again."
        : loginErrorLower.includes("email") || loginErrorLower.includes("username")
        ? "Double-check your email or username and try again."
        : "";

    return (
      <Fragment>
        <Helmet>
          <title>Login | Real Estate</title>
        </Helmet>
        <div className="d-flex flex-row justify-content-center mt-5">
          <div className="col-12 col-md-8 col-lg-6 col-xl-3">
            <div className="card p-5">
              <h4>Login</h4>
              {loginError ? (
                <div className="alert alert-danger" role="alert">
                  <div>{loginError}</div>
                  {loginErrorHint ? (
                    <div className="alert-hint">{loginErrorHint}</div>
                  ) : null}
                </div>
              ) : null}
              <form onSubmit={this.login}>
                <div className="form-group">
                  <label htmlFor="identifier">Email or Username</label>
                  <input
                    type="text"
                    name="identifier"
                    placeholder="Email or Username"
                    className={`form-control${
                      errors.identifier ? " form-control-error" : ""
                    }`}
                    value={this.state.identifier}
                    onChange={e => this.handleChange(e)}
                    aria-invalid={errors.identifier ? "true" : "false"}
                    aria-describedby={
                      errors.identifier ? "login-identifier-error" : undefined
                    }
                  />
                  {errors.identifier ? (
                    <small
                      id="login-identifier-error"
                      className="form-error-text"
                    >
                      {errors.identifier}
                    </small>
                  ) : null}
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <div className="password-toggle-wrapper">
                    <input
                      type={this.state.showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      className={`form-control${
                        errors.password ? " form-control-error" : ""
                      }`}
                      value={this.state.password}
                      onChange={e => this.handleChange(e)}
                      aria-invalid={errors.password ? "true" : "false"}
                      aria-describedby={
                        errors.password ? "login-password-error" : undefined
                      }
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
                  {errors.password ? (
                    <small
                      id="login-password-error"
                      className="form-error-text"
                    >
                      {errors.password}
                    </small>
                  ) : null}
                </div>
                <div className="form-group">
                  <input
                    type="submit"
                    value="LOGIN"
                    className="btn btn-md btn-success"
                  />
                </div>
              </form>
              <p>I do not have account</p>
              <Link to="/register">Sign Me Up</Link>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.userReducer,
    error: state.errorReducer
  };
}

export default connect(mapStateToProps, { loginUser })(LoginForm);
