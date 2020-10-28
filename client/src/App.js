import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import React, { Fragment, useEffect } from "react"; // userEffect like componentDidMount
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/landing";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Alert from "./components/layout/alert";
// dashboard
import Dashboard from "./components/dashboard/Dashboard";
import PrivateRoute from "./components/routing/PrivateRoute";
import CreateProfile from "./components/profile-forms/CreateProfile";
// to combine redux with react
import { Provider } from "react-redux";
import store from "./store";
// loader user
import { loadUser } from "./actions/auth";
import setAuthToken from "./utils/setAuthToken";

// link about react-router-dom
//https://reactrouter.com/web/guides/quick-start

// check token
if (localStorage.token) {
  setAuthToken(localStorage.token);
}
const App = () => {
  // when state is updated it keep running
  useEffect(() => {
    store.dispatch(loadUser());
  }, []); // [] let run once when it runs
  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Route exact path="/" component={Landing} />
          <section className="container">
            {/**not inside Switch */}
            <Alert />
            <Switch>
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
              <PrivateRoute
                exact
                path="/create-profile"
                component={CreateProfile}
              />
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
};
export default App;
