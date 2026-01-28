import React, { Component, Fragment } from 'react';
import { Link } from "react-router-dom";
import { isAdminUser } from "../../utils/roles";


export default class DesktopMenu extends Component {

  render() {
    const isAdmin = isAdminUser(this.props.user);
    return (
      <nav className={`mainNav navbar-expand-lg justify-content-between d-none d-lg-flex ${this.props.scrollDirection === 'DOWN' ? 'navHidden' : 'navVisible'}`}>
        <div className="align-self-center ml-5">
          <Link className="" to="/">
            <i className="fa fa-home" style={{ fontSize: '30px', color: '#EDF7F6' }}></i>
          </Link>
        </div>
        <div className="navbarLinkContainer" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            {this.props.user ? (
              <Fragment>
                {/* <li className="nav-item mr-2 my-2">
                  <Link className="text-link" to="/">
                    Home
                  </Link>
                </li> */}
                <li className="nav-item mr-2 my-2">
                  <Link className="text-link" to="/favorites">
                    My Favorite properties
                  </Link>
                </li>
                {isAdmin ? (
                  <li className="nav-item mr-2 my-2">
                    <Link className="text-link" to="/myproperties">
                      My properties
                    </Link>
                  </li>
                ) : (
                  ""
                )}
                {isAdmin ? (
                  <li className="nav-item mr-2 my-2">
                    <Link className="text-link" to="/admin">
                      Admin Dashboard
                    </Link>
                  </li>
                ) : (
                  ""
                )}
                <li className="nav-item mr-2 my-2">
                  <a className="text-link" onClick={this.props.logoutUser} href="/">
                    Logout
                  </a>
                </li>
              </Fragment>
            ) : (
              <Fragment>
                {/* <li className="nav-item mr-2 my-2">
                  <Link className="text-link" to="/">
                    Home
                  </Link>
                </li> */}
                <li className="nav-item mr-2 my-2">
                  <Link className="text-link" to="/contact">
                    Contact Us
                  </Link>
                </li>
                <li className="nav-item mr-2 my-2">
                  <Link className="text-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item mr-2 my-2">
                  <Link className="text-link" to="/register">
                    Register
                  </Link>
                </li>
              </Fragment>
            )}
          </ul>
          <ul className="navbar-nav ml-auto"></ul>
        </div>
      </nav>
    )
  }
}
