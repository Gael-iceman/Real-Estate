import React, { Component, Fragment } from 'react';
import { Link } from "react-router-dom";
import { isAdminUser } from "../../utils/roles";


export default class MobileMenu extends Component {
  state = {
    opened: false
  }
  toggleMenu = () => {
    this.setState((prevState) => ({
      opened: !prevState.opened
    }));
  }
  render() {
    const isAdmin = isAdminUser(this.props.user);
    return (
      <nav className={`mainNav d-lg-none mobileNav 
      ${this.props.scrollDirection === 'DOWN' ? 'navHidden' : 'navVisible'}`}>
        <div className="mobileNavBar">
          <Link className="mobileNavLogo" to="/">
            <i className="fa fa-home"></i>
          </Link>
          <button className="mobileNavToggle" type="button" onClick={this.toggleMenu} aria-label="Toggle menu">
            <i className={`fa ${this.state.opened ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </div>
        <ul className={`navbar-nav mobileNavMenu ${this.state.opened ? 'is-open' : ''}`} onClick={this.toggleMenu}>
          {this.props.user ? (
            <Fragment>
              <li className="nav-item">
                <Link className="mobileLink" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="mobileLink" to="/favorites">
                  My Favorite properties
                </Link>
              </li>
              {isAdmin ? (
                <li className="nav-item">
                  <Link className="mobileLink" to="/myproperties">
                    My properties
                  </Link>
                </li>
              ) : (
                ""
              )}
              {isAdmin ? (
                <li className="nav-item">
                  <Link className="mobileLink" to="/admin">
                    Admin Dashboard
                  </Link>
                </li>
              ) : (
                ""
              )}
              <li className="nav-item">
                <a className="mobileLink" onClick={this.props.logoutUser} href="/">
                  Logout
                </a>
              </li>
            </Fragment>
          ) : (
            <Fragment>
              <li className="nav-item">
                <Link className="mobileLink" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="mobileLink" to="/contact">
                  Contact Us
                </Link>
              </li>
              <li className="nav-item">
                <Link className="mobileLink" to="/login">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link className="mobileLink" to="/register">
                  Register
                </Link>
              </li>
            </Fragment>
          )}
        </ul>
      </nav>
    )
  }
}
