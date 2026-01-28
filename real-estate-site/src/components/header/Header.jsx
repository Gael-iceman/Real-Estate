import React, { Component, Fragment } from "react";
import { withRouter } from "react-router";
import { connect } from "react-redux";

import { logMeOut } from "../../actions/user";
import { clearErrors, clearSuccess } from "../../actions/error";

import DesktopMenu from "./DesktopMenu";
import MobileMenu from './MobileMenu';

import "./header.css";
import ErrorAlert from "./ErrorAlert";
import SuccessAlert from "./SuccessAlert";

class Header extends Component {
  state = {
    search: "",
    scrolling: false,
    prevScrollValue: 0, 
    scrollDirection: false
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  searchByCityname = e => {
    e.preventDefault();
    this.props.history.push(`/search/city/${this.state.search}`);
  };

  logoutUser = e => {
    e.preventDefault();
    const logoutPromise = this.props.logMeOut();
    if (logoutPromise && typeof logoutPromise.finally === "function") {
      logoutPromise.finally(() => {
        this.props.history.push("/");
      });
      return;
    }
    this.props.history.push("/");
  };

  componentDidUpdate = () => {
    if (this.handleTimer) {
      clearTimeout(this.handleTimer);
    }
    if (this.props.success) {
      this.handleTimer = setTimeout(this.props.clearSuccess, 3000);
    }

    if (this.props.error) {
      if (this.handleTimer) {
        clearTimeout(this.handleTimer);
      }
      this.handleTimer = setTimeout(this.props.clearErrors, 3000);
    }
  };

  componentDidMount = () => {
    window.addEventListener('scroll', this.handleScroll);
  };

  componentWillUnmount = () => {
      window.removeEventListener('scroll', this.handleScroll);
  };

  handleScroll = (event) => {
    if((window.scrollY - 5 > this.state.prevScrollValue) && (!this.state.scrollDirection || this.state.scrollDirection==='UP')){
      this.setState({
        scrollDirection: 'DOWN',
      });
    } else if((window.scrollY + 5 < this.state.prevScrollValue) && (!this.state.scrollDirection || this.state.scrollDirection==='DOWN')) {
      this.setState({
        scrollDirection: 'UP',
      });
    } 
    this.setState({prevScrollValue: window.scrollY})
  };

  render() {
    return (
      <Fragment>
        {/* Desktop menu */}
        <DesktopMenu scrollDirection={this.state.scrollDirection} user={this.props.user} logoutUser={this.logoutUser} />
        {/* Mobile menu */}
        <MobileMenu scrollDirection={this.state.scrollDirection} user={this.props.user} logoutUser={this.logoutUser} />
        <ErrorAlert
          error={this.props.error}
          clearErrors={this.props.clearErrors}
        />
        <SuccessAlert
          success={this.props.success}
          clearSuccess={this.props.clearSuccess}
        />
      </Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.userReducer,
    error: state.errorReducer,
    success: state.successReducer
  };
}

export default withRouter(
  connect(mapStateToProps, {
    logMeOut,
    clearErrors,
    clearSuccess
  })(Header)
);
