import React, { Component } from "react";
import { Provider } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import store from "./store";

import Header from "./components/header/Header";
import Footer from "./components/layout/Footer/Footer";
import Login from "./components/login/Login";
import Register from "./components/register/Register";
import UserPage from "./components/userpage/UserPage";
import MainPage from "./components/mainpage/MainPage";
import Selectedproperty from "./components/selectedproperty/Selectedproperty";
import Favoriteproperties from "./components/userpage/Favoriteproperties";
import Myproperties from "./components/userpage/Myproperties";
import SearchedBy from "./components/mainpage/SearchedBy";
import NotFound from "./components/layout/NotFound";
import PrivacyPolicy from "./components/layout/PrivacyPolicy";
import TermsOfService from "./components/layout/TermsOfService";
import AboutUs from "./components/layout/AboutUs";
import ContactUs from "./components/layout/ContactUs";

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div className="app-shell">
          <Header />
          <main className="app-main">
            <Switch>
              <Route path="/myproperties" component={Myproperties} />
              <Route path="/favorites" component={Favoriteproperties} />
              <Route path="/login" component={Login} />
              <Route path="/register" component={Register} />
              <Route path="/admin" component={UserPage} />
              <Route path="/update/:id" component={Selectedproperty} />
              <Route path="/view/:id" component={Selectedproperty} />
              <Route
                path="/property/:id"
                render={({ match }) => <Redirect to={`/view/${match.params.id}`} />}
              />
              <Route path="/search/:keyword/:value" component={SearchedBy} />
              <Route path="/privacy" component={PrivacyPolicy} />
              <Route path="/terms" component={TermsOfService} />
              <Route path="/about" component={AboutUs} />
              <Route path="/contact" component={ContactUs} />
              <Route path="/" exact component={MainPage} />
              <Route component={NotFound} />
            </Switch>
          </main>
          <Footer />
        </div>
      </Provider>
    );
  }
}

export { App };
