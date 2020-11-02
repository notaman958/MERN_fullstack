import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import React, { Fragment, Profiler, useEffect } from "react"; // userEffect like componentDidMount
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/landing";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Alert from "./components/layout/alert";
// dashboard
import Dashboard from "./components/dashboard/Dashboard";
import PrivateRoute from "./components/routing/PrivateRoute";
//profile
import CreateProfile from "./components/profile-forms/CreateProfile";
import EditProfile from "./components/profile-forms/EditProfile";
import AddExperience from "./components/profile-forms/AddExperience";
import AddEducation from "./components/profile-forms/AddEducation";
import Profiles from "./components/profiles/Profiles";
import Profile from "./components/profile/Profile";

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
              <Route exact path="/profiles" component={Profiles} />
              <Route exact path="/profile/:id" component={Profile} />{" "}
              {/*get id profile */}
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
              <PrivateRoute
                exact
                path="/create-profile"
                component={CreateProfile}
              />
              <PrivateRoute
                exact
                path="/edit-profile"
                component={EditProfile}
              />
              <PrivateRoute
                exact
                path="/add-experience"
                component={AddExperience}
              />
              <PrivateRoute
                exact
                path="/add-education"
                component={AddEducation}
              />
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
};
export default App;
